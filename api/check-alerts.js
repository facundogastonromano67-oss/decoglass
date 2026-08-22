// Función serverless (Vercel Cron la llama sola cada tanto).
// Revisa las condiciones de alerta del negocio y manda notificaciones push
// a los teléfonos suscriptos, cada uno según lo que le corresponde ver.
//
// Variables de entorno que necesita (se configuran en Vercel, NO en el
// código ni en el .env del navegador):
//   SUPABASE_URL                  -> misma URL del proyecto de Supabase
//   SUPABASE_SERVICE_ROLE_KEY     -> la "service_role key" (Supabase -> Settings -> API)
//   VAPID_PUBLIC_KEY              -> la clave pública generada para Web Push
//   VAPID_PRIVATE_KEY             -> la clave privada generada para Web Push
//   VAPID_SUBJECT                 -> un mailto: o https:// de contacto (lo pide el estándar)
//   CRON_SECRET                   -> opcional, para evitar que cualquiera dispare este endpoint

import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const DIA_MS = 24 * 60 * 60 * 1000;
const UMBRAL_PEDIDO_ESTANCADO_DIAS = 3;
const UMBRAL_RECLAMO_HORAS = 48;
const UMBRAL_COMISION_DIAS = 7;
const REENVIO_MISMA_ALERTA_HORAS = 24; // no repetir la misma alerta antes de esto

function supabaseAdmin() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function leerKv(supabase, key) {
  const { data } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
  if (!data) return null;
  try { return JSON.parse(data.value); } catch (e) { return null; }
}

async function leerLog(supabase) {
  return (await leerKv(supabase, "push-log")) || {};
}
async function guardarLog(supabase, log) {
  await supabase.from("kv_store").upsert({ key: "push-log", value: JSON.stringify(log), updated_at: new Date().toISOString() });
}
function yaSeAviso(log, clave) {
  const t = log[clave];
  return t && Date.now() - t < REENVIO_MISMA_ALERTA_HORAS * 60 * 60 * 1000;
}

function pedidoTerminado(p) {
  return p.estado === "Espejo listo" || p.estado === "Entregado" || p.estado === "Cancelado";
}
function ultimaActividadPedido(p) {
  const fechas = [p.produccionEmbaladoFecha, p.produccionArmadoFecha, p.produccionCortadoFecha, p.fecha]
    .filter(Boolean).map((f) => new Date(f).getTime()).filter((t) => !Number.isNaN(t));
  return fechas.length ? Math.max(...fechas) : 0;
}

export default async function handler(req, res) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers["authorization"];
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: "No autorizado" });
  }
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(500).json({ error: "Faltan las claves VAPID en las variables de entorno de Vercel." });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:contacto@decoglass.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const supabase = supabaseAdmin();
  const ahora = Date.now();
  const log = await leerLog(supabase);

  const [{ data: pedidoRows }, { data: subs }] = await Promise.all([
    supabase.from("pedidos_rows").select("data"),
    supabase.from("push_subscriptions").select("*"),
  ]);
  const pedidos = (pedidoRows || []).map((r) => r.data);
  const suscripciones = subs || [];
  const stockMateriales = (await leerKv(supabase, "stock-materiales")) || [];
  const reclamos = (await leerKv(supabase, "reclamos")) || [];

  // notificaciones a mandar: { destinatarios: (sub)=>bool, title, body, url, tag }
  const notificaciones = [];

  // 1) Pedidos estancados en producción
  for (const p of pedidos) {
    if (pedidoTerminado(p) || p.estado === "Sin pasar a fábrica") continue;
    const ultima = ultimaActividadPedido(p);
    if (!ultima) continue;
    const dias = (ahora - ultima) / DIA_MS;
    if (dias < UMBRAL_PEDIDO_ESTANCADO_DIAS) continue;
    const clave = `pedido-estancado:${p.id}`;
    if (yaSeAviso(log, clave)) continue;
    notificaciones.push({
      clave,
      destinatarios: (s) => s.rol === "admin" || s.rol === "encargado",
      title: "Pedido sin avanzar",
      body: `#${p.orden} — ${p.cliente || "sin nombre"} lleva ${Math.floor(dias)} día(s) sin moverse en producción.`,
      url: "/",
      tag: clave,
    });
  }

  // 2) Stock de materiales bajo mínimo
  for (const m of stockMateriales) {
    if (Number(m.cantidad) > Number(m.minimo)) continue;
    const clave = `stock-bajo:${m.id}`;
    if (yaSeAviso(log, clave)) continue;
    notificaciones.push({
      clave,
      destinatarios: (s) => s.rol === "admin" || s.sector_id === "fabrica",
      title: "Material bajo el mínimo",
      body: `${m.nombre}: quedan ${m.cantidad} ${m.unidad} (mínimo ${m.minimo}).`,
      url: "/",
      tag: clave,
    });
  }

  // 3) Reclamos sin resolver hace más de 48hs
  for (const r of reclamos) {
    if (r.finalizado || (r.estado || "").toLowerCase().includes("final")) continue;
    const fecha = new Date(r.fecha).getTime();
    if (Number.isNaN(fecha)) continue;
    const horas = (ahora - fecha) / (60 * 60 * 1000);
    if (horas < UMBRAL_RECLAMO_HORAS) continue;
    const clave = `reclamo:${r.id}`;
    if (yaSeAviso(log, clave)) continue;
    notificaciones.push({
      clave,
      destinatarios: (s) => s.rol === "admin",
      title: "Reclamo sin resolver",
      body: `${r.cliente || "Un cliente"} — ${r.tipo} — lleva más de 48hs sin solución cargada.`,
      url: "/",
      tag: clave,
    });
  }

  // 4) Comisiones liquidables hace más de una semana y sin pagar
  for (const p of pedidos) {
    if (p.comisionPagada || p.comisionExcluida || !p.vendedor) continue;
    if ((Number(p.monto) || 0) - (Number(p.anticipo) || 0) > 0) continue; // no está saldado
    const fecha = new Date(p.fecha).getTime();
    if (Number.isNaN(fecha)) continue;
    const dias = (ahora - fecha) / DIA_MS;
    if (dias < UMBRAL_COMISION_DIAS) continue;
    const clave = `comision:${p.id}`;
    if (yaSeAviso(log, clave)) continue;
    notificaciones.push({
      clave,
      destinatarios: (s) => s.rol === "admin",
      title: "Comisión pendiente de liquidar",
      body: `#${p.orden} de ${p.vendedor} está saldado hace más de una semana y su comisión sigue sin liquidarse.`,
      url: "/",
      tag: clave,
    });
  }

  let enviadas = 0;
  const bajas = [];
  for (const n of notificaciones) {
    const destinatarios = suscripciones.filter(n.destinatarios);
    for (const sub of destinatarios) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title: n.title, body: n.body, url: n.url, tag: n.tag })
        );
        enviadas++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) bajas.push(sub.id); // suscripción vencida
      }
    }
    log[n.clave] = ahora;
  }

  if (bajas.length) await supabase.from("push_subscriptions").delete().in("id", bajas);
  await guardarLog(supabase, log);

  return res.status(200).json({ ok: true, alertas: notificaciones.length, enviadas, bajasEliminadas: bajas.length });
}
