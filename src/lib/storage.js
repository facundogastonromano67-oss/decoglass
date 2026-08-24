// Reemplazo de window.storage (el almacenamiento de los artifacts de Claude)
// usando una tabla simple de clave/valor en Supabase (Postgres).
//
// Mantiene la misma firma que usaba la app dentro de Claude:
//   storage.get(key)    -> { key, value } | null
//   storage.set(key, value) -> { key, value } | null
//   storage.delete(key) -> { key, deleted } | null
//   storage.list(prefix) -> { keys } | null
//
// Toda la app trata los datos como "compartidos" (una sola empresa, un solo
// set de datos), así que no hace falta distinguir shared/personal como en
// los artifacts — se ignora ese segundo parámetro si se llega a pasar.

import { supabase } from "./supabaseClient";

const TABLE = "kv_store";
const SYNC_TOPIC = "decoglass-shared-data-v1";
const SYNC_EVENT = "kv-change";

const syncListeners = new Set();
const statusListeners = new Set();
let syncChannel = null;
let syncConnected = false;

function notifyStatus(status) {
  statusListeners.forEach((listener) => listener(status));
}

function ensureSyncChannel() {
  if (syncChannel) return syncChannel;

  syncChannel = supabase
    .channel(SYNC_TOPIC, { config: { broadcast: { self: false } } })
    .on("broadcast", { event: SYNC_EVENT }, ({ payload }) => {
      syncListeners.forEach((listener) => listener(payload));
    })
    .subscribe((status) => {
      syncConnected = status === "SUBSCRIBED";
      notifyStatus(status);
    });

  return syncChannel;
}

async function broadcastChange(row) {
  if (!syncConnected || !syncChannel || !row) return;
  try {
    await syncChannel.send({
      type: "broadcast",
      event: SYNC_EVENT,
      payload: row,
    });
  } catch (error) {
    // El dato ya quedó guardado. El sondeo automático recuperará el cambio
    // aunque el aviso en vivo falle momentáneamente.
  }
}

export const pedidosStore = {
  async getAll() {
    const { data, error } = await supabase.from("pedidos_rows").select("id, data, updated_at");
    if (error) throw error;
    return (data || []).map((r) => r.data);
  },

  // Lectura pública de un solo pedido por id, sin sesión — la usa el portal
  // de seguimiento del cliente (no requiere login, la base ya es de lectura abierta).
  async getOne(id) {
    if (!id) return null;
    const { data, error } = await supabase.from("pedidos_rows").select("data").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? data.data : null;
  },

  // Lectura pública de todos los espejos de un mismo pedido agrupado (varios
  // espejos, un solo link de seguimiento). Filtra por el campo grupoId
  // guardado adentro del jsonb de cada fila.
  async getByGrupoId(grupoId) {
    if (!grupoId) return [];
    const { data, error } = await supabase.from("pedidos_rows").select("data").eq("data->>grupoId", grupoId);
    if (error) throw error;
    return (data || []).map((r) => r.data);
  },

  async upsertMany(lista) {
    if (!lista.length) return;
    const rows = lista.map((p) => ({ id: p.id, data: p, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("pedidos_rows").upsert(rows);
    if (error) throw error;
    rows.forEach((r) => broadcastChange({ key: `pedido:${r.id}`, value: JSON.stringify(r.data), updated_at: r.updated_at }));
  },

  async removeMany(ids) {
    if (!ids.length) return;
    const { error } = await supabase.from("pedidos_rows").delete().in("id", ids);
    if (error) throw error;
    ids.forEach((id) => broadcastChange({ key: `pedido-borrado:${id}`, value: id, updated_at: new Date().toISOString() }));
  },

  // Avisa (mejor esfuerzo) que hay cambios en pedidos; el otro cliente hace un refetch completo.
  subscribeRealtime(onChange) {
    const channel = supabase
      .channel("pedidos-rows-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "pedidos_rows" }, onChange)
      .subscribe();
    return () => { try { supabase.removeChannel(channel); } catch (e) {} };
  },
};

export const documentosStore = {
  // Sube el PDF de la factura (emitida en otra app, como EcomApp) y devuelve
  // la URL pública para guardarla en el pedido. Requiere el bucket "facturas"
  // creado en Supabase Storage (público, para que el link funcione en el
  // portal de seguimiento sin pedir login).
  async subirFactura(pedidoId, archivo) {
    const ruta = `${pedidoId}/factura-${Date.now()}.pdf`;
    const { error } = await supabase.storage.from("facturas").upload(ruta, archivo, {
      contentType: archivo.type || "application/pdf",
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("facturas").getPublicUrl(ruta);
    return data.publicUrl;
  },

  // Sube el remito de envío de Vía Cargo (foto o PDF). Requiere el bucket
  // "remitos" en Supabase Storage (público, mismo motivo que arriba).
  async subirRemito(pedidoId, archivo) {
    const ext = (archivo.type || "").includes("pdf") ? "pdf" : "jpg";
    const ruta = `${pedidoId}/remito-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("remitos").upload(ruta, archivo, {
      contentType: archivo.type || "application/octet-stream",
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("remitos").getPublicUrl(ruta);
    return data.publicUrl;
  },
};

export const notificacionesStore = {
  async getUltimoDe(audiencia) {
    const { data, error } = await supabase
      .from("notificaciones_resumen")
      .select("*")
      .eq("audiencia", audiencia)
      .order("fecha", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  },
  async getHistorial(limite = 60) {
    const { data, error } = await supabase
      .from("notificaciones_resumen")
      .select("*")
      .order("fecha", { ascending: false })
      .limit(limite);
    if (error) throw error;
    return data || [];
  },
};

export const pushStore = {
  async guardarSuscripcion({ endpoint, keys }, usuario) {
    const row = {
      id: endpoint, // el endpoint ya es único por dispositivo/navegador
      usuario_nombre: usuario?.nombre || "Desconocido",
      rol: usuario?.role === "admin" ? "admin" : (usuario?.tipo || "encargado"),
      sector_id: usuario?.sectorId || null,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    };
    const { error } = await supabase.from("push_subscriptions").upsert(row);
    if (error) throw error;
  },
  async borrarSuscripcion(endpoint) {
    if (!endpoint) return;
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  },
};

export const storage = {
  async get(key) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("key, value, updated_at")
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return { key: data.key, value: data.value, updated_at: data.updated_at };
  },

  async getMany(keys = []) {
    let query = supabase.from(TABLE).select("key, value, updated_at");
    if (keys.length) query = query.in("key", keys);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getVersions(keys = []) {
    let query = supabase.from(TABLE).select("key, updated_at");
    if (keys.length) query = query.in("key", keys);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async set(key, value) {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select("key, value, updated_at")
      .maybeSingle();

    if (error) throw error;
    if (data) broadcastChange(data);
    return data ? { key: data.key, value: data.value, updated_at: data.updated_at } : null;
  },

  async delete(key) {
    const { error } = await supabase.from(TABLE).delete().eq("key", key);
    if (error) throw error;
    return { key, deleted: true };
  },

  async list(prefix = "") {
    const query = supabase.from(TABLE).select("key");
    const { data, error } = prefix ? await query.like("key", `${prefix}%`) : await query;
    if (error) throw error;
    return { keys: (data || []).map((r) => r.key) };
  },

  subscribe(onChange, onStatus = () => {}) {
    syncListeners.add(onChange);
    statusListeners.add(onStatus);
    ensureSyncChannel();
    if (syncConnected) onStatus("SUBSCRIBED");

    return () => {
      syncListeners.delete(onChange);
      statusListeners.delete(onStatus);
    };
  },
};
