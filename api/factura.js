// Lo privado de UN pedido, para el cliente que no tiene login:
//
//   GET /api/factura?pedido=<id>&puerta=1          -> { pide: true|false }
//   GET /api/factura?pedido=<id>&t=1234&puerta=1   -> { pide, ok: true|false }
//   GET /api/factura?grupo=<grupoId>&puerta=1      -> idem, para el link de grupo
//   GET /api/factura?rid=<reclamo>&puerta=1        -> idem, para el link de un reclamo
//   GET /api/factura?pedido=<id>&t=1234            -> manda la factura
//   GET /api/factura?pedido=<id>&t=1234&n=1        -> la segunda (si la pidió en partes)
//   GET /api/factura?pedido=<id>&t=1234&foto=0     -> la foto del espejo terminado
//   GET /api/factura?pedido=<id>&t=1234&chat=subir&tipo=imagen&mime=image/jpeg -> permiso para subir al chat
//   GET /api/factura?pedido=<id>&t=1234&chat=ver&m=<id del mensaje>           -> una foto o audio del chat
//   GET /api/factura?pedido=<id>&t=1234&reclamo=subir&mime=image/jpeg         -> permiso para subir una foto del reclamo
//   POST /api/factura?pedido=<id>&t=1234&reclamo=nuevo  { motivo, detalle, espejoId, fotos } -> crea el reclamo
//
// POR QUÉ LAS DOS COSAS VIVEN EN EL MISMO ARCHIVO: el plan Hobby de Vercel
// admite 12 funciones por deploy y ya estábamos justo en 12. Separar esto en
// un /api/puerta hacía 13 y el deploy fallaba al publicar (el build salía
// bien y moría en "Deploying outputs"). Las dos contestan la misma pregunta
// —¿este que está del otro lado es el dueño del pedido?— así que tampoco
// quedan tan lejos. Si algún día sobran funciones, se puede separar.
//
// La puerta: el link de seguimiento no tiene login. Con tenerlo —reenviado, o
// adivinando un id— se veía el pedido entero, se bajaba la factura y se podía
// reclamar por un espejo ajeno. Ahora se piden los últimos 4 dígitos del
// teléfono del cliente, que es el mismo al que le mandamos el link, y la
// comparación se hace ACÁ: si se hiciera en el navegador, el pedido ya habría
// viajado hasta la pantalla y alcanzaría con abrirla para leerlo.
//
// La factura: el bucket "facturas" es privado (antes era público y se podían
// listar y bajar TODAS las facturas de la empresa con solo tener el link del
// bundle). El link firmado se arma acá, del lado del servidor, y solo para el
// pedido que viene en la URL.
//
// Variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { ultimos4, coincide } from "./_telefono.js";
import { BUCKET_CHAT, MAX_ADJUNTOS, carpetaDeHilo, extensionDe, chatCerrado } from "./_chat-adjuntos.js";

const BUCKET = "facturas";

// Los motivos que puede elegir el cliente (los mismos de la app, RECLAMO_MOTIVOS).
const MOTIVOS_RECLAMO = {
  roto: "Llegó roto", oxidado: "Espejo oxidado", insumo: "Falla de un insumo", demora: "Entrega demorada",
  error: "Error en el pedido", pieza: "Falta una pieza", rayado: "Rayado o defecto de fábrica",
  colocacion: "Problema con la colocación", atencion: "Atención o trato", otro: "Otro",
};
const MAX_RECLAMOS_ABIERTOS_DEL_LINK = 3;
function espejoTextoReclamo(p) {
  const a = Number(p?.ancho) || 0, h = Number(p?.alto) || 0;
  const forma = String(p?.forma || "");
  const circular = /circular|redond/i.test(forma) && a > 0 && a === h;
  const medida = a && h ? (circular ? `${a} cm Circular` : `${a}×${h} cm`) : "";
  return [medida, circular ? "" : forma, p?.tipo, p?.tono].filter(Boolean).join(" · ");
}
const VENCE_EN = 300; // 5 minutos: alcanza para abrirla o bajarla

// El valor guardado puede ser una ruta (lo nuevo) o una URL pública entera
// (los pedidos viejos). En los dos casos queremos la ruta.
function rutaDelArchivo(valor) {
  const texto = String(valor || "").trim();
  if (!texto) return "";
  const publico = `/storage/v1/object/public/${BUCKET}/`;
  const i = texto.indexOf(publico);
  if (i !== -1) return decodeURIComponent(texto.slice(i + publico.length));
  const firmado = `/storage/v1/object/sign/${BUCKET}/`;
  const j = texto.indexOf(firmado);
  if (j !== -1) return decodeURIComponent(texto.slice(j + firmado.length).split("?")[0]);
  return texto.replace(/^\/+/, "");
}

// El pedido, o el primero del grupo (es el mismo cliente y el mismo teléfono).
async function buscarPedido(supabase, { pedido, grupo }) {
  if (pedido) {
    const { data, error } = await supabase
      .from("pedidos_rows").select("data").eq("id", pedido).maybeSingle();
    if (error) throw new Error("consulta");
    return data ? data.data : null;
  }
  const { data, error } = await supabase
    .from("pedidos_rows").select("data").eq("data->>grupoId", grupo).limit(1);
  if (error) throw new Error("consulta");
  const fila = (data || [])[0];
  return fila ? fila.data : null;
}

export default async function handler(req, res) {
  // Nunca cachear: el link vence y cada pedido tiene el suyo.
  res.setHeader("Cache-Control", "no-store");

  const q = req.query || {};
  const id = String(q.pedido || "").trim();
  const grupo = String(q.grupo || "").trim();
  const escrito = String(q.t || "").trim();
  const esPuerta = String(q.puerta || "") === "1";
  const rid = String(q.rid || "").trim();
  if (!id && !grupo && !rid) return res.status(400).json({ error: "Falta el pedido." });

  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return res.status(500).json({ error: "Falta configurar el servidor." });

  try {
    const supabase = createClient(url, clave, { auth: { persistSession: false } });

    // El link de un reclamo (20/11/2026): la misma puerta, con el teléfono
    // del reclamo. Solo la puerta: lo demás se pide por el pedido.
    if (rid) {
      if (!esPuerta) return res.status(400).json({ error: "Falta el pedido." });
      const { data: filaR, error: errorR } = await supabase.from("reclamos_rows").select("data").eq("id", rid).maybeSingle();
      if (errorR) throw new Error("consulta");
      const rec = filaR ? filaR.data : null;
      if (!rec) return res.status(200).json({ pide: false, ok: true });
      if (!ultimos4(rec.celular)) return res.status(200).json({ pide: false, ok: true });
      if (!escrito) return res.status(200).json({ pide: true });
      return res.status(200).json({ pide: true, ok: coincide(rec.celular, escrito) });
    }

    const pedido = await buscarPedido(supabase, { pedido: id, grupo });

    if (esPuerta) {
      // Un pedido que NO EXISTE contesta igual que uno sin teléfono: así el
      // link tampoco sirve para ir probando ids a ver cuáles existen.
      if (!pedido) return res.status(200).json({ pide: false, ok: true });
      const esperado = ultimos4(pedido.celular);
      if (!esperado) return res.status(200).json({ pide: false, ok: true });
      if (!escrito) return res.status(200).json({ pide: true });
      return res.status(200).json({ pide: true, ok: coincide(pedido.celular, escrito) });
    }

    if (!pedido) return res.status(404).json({ error: "No encontramos ese pedido." });

    // Se vuelve a verificar acá aunque la pantalla ya los haya pedido: si el
    // control viviera solo en el navegador, alcanzaría con escribir la URL de
    // la factura a mano para saltearlo. Un pedido sin teléfono cargado no
    // puede pedir nada (coincide() da true) y queda como estaba.
    if (!coincide(pedido.celular, escrito)) {
      return res.status(403).json({ error: "Para ver la factura hacen falta los últimos 4 dígitos de tu teléfono." });
    }

    // El cliente inicia un reclamo desde su link (20/11/2026), con el mismo
    // control de los 4 dígitos. Las fotos van al bucket privado, en una carpeta
    // de ESE pedido; el reclamo se crea acá (la tabla está cerrada para el link).
    if (q.reclamo === "subir" || q.reclamo === "nuevo") {
      const carpeta = `reclamo-cliente/${String(id ? id : `grupo-${grupo}`).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      if (q.reclamo === "subir") {
        const mime = String(q.mime || "").split(";")[0];
        const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[mime];
        if (!ext) return res.status(400).json({ error: "Solo se pueden mandar fotos." });
        const { data: yaHay } = await supabase.storage.from(BUCKET).list(carpeta, { limit: 100 });
        if ((yaHay || []).length >= 20) return res.status(429).json({ error: "Llegaste al máximo de fotos. Escribinos por WhatsApp." });
        const rutaNueva = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { data: permisoR, error: errorPermisoR } = await supabase.storage.from(BUCKET).createSignedUploadUrl(rutaNueva);
        if (errorPermisoR || !permisoR?.token) return res.status(500).json({ error: "No se pudo preparar la subida." });
        return res.status(200).json({ path: rutaNueva, token: permisoR.token });
      }
      if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido." });
      let body = req.body || {};
      if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
      const motivo = MOTIVOS_RECLAMO[String(body.motivo || "")];
      const detalle = String(body.detalle || "").trim().slice(0, 1000);
      if (!motivo) return res.status(400).json({ error: "Elegí qué pasó." });
      if (detalle.length < 5) return res.status(400).json({ error: "Contanos un poco más qué pasó." });
      // Los espejos de este link: el reclamo solo puede ser de uno de ellos.
      let espejos = [pedido];
      if (grupo) {
        const { data: filasG, error: errorG } = await supabase.from("pedidos_rows").select("data").eq("data->>grupoId", grupo);
        if (errorG) throw new Error("consulta");
        espejos = (filasG || []).map((f) => f.data).filter(Boolean);
        if (!espejos.length) espejos = [pedido];
      }
      const espejo = espejos.find((e) => e.id === String(body.espejoId || "")) || espejos[0];
      const { data: previos, error: errorPrevios } = await supabase.from("reclamos_rows").select("data").in("data->>pedidoOrigenId", espejos.map((e) => e.id));
      if (errorPrevios) throw new Error("consulta");
      const abiertosDelLink = (previos || []).map((f) => f.data).filter((r) => r && r.desdeLink && !r.finalizado);
      if (abiertosDelLink.length >= MAX_RECLAMOS_ABIERTOS_DEL_LINK) {
        return res.status(429).json({ error: "Ya tenés reclamos abiertos por este pedido. Si es por otra cosa, escribinos por WhatsApp." });
      }
      const fotos = (Array.isArray(body.fotos) ? body.fotos : []).map(String)
        .filter((p) => p.startsWith(carpeta + "/") && !p.includes("..")).slice(0, 4);
      const ahora = new Date();
      const nuevoId = `rc${ahora.getTime().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
      const dato = {
        id: nuevoId,
        fecha: new Date(ahora.getTime() - 3 * 3600 * 1000).toISOString().slice(0, 10), // día de Argentina
        creado: ahora.toISOString(),
        motivo: String(body.motivo), tipo: motivo,
        cliente: espejo.cliente || "", celular: espejo.celular || "",
        pedidoOrigenId: espejo.id, grupoOrigenId: espejo.grupoId || "", ordenOrigen: espejo.orden || null,
        espejoTexto: espejoTextoReclamo(espejo),
        notas: detalle, detalleCliente: detalle, desdeLink: true,
        solucion: "", finalizado: false, estado: "Pendiente",
        barrio: espejo.barrio || "", detalleEntrega: espejo.detalleEntrega || "", piso: espejo.piso || "",
        horarioEntrega: espejo.horarioEntrega || "", localidad: espejo.localidad || "", fleteOrigen: espejo.fletero || "",
        ...(fotos.length ? { fotos } : {}),
      };
      const { error: errorIns } = await supabase.from("reclamos_rows").insert({ id: nuevoId, data: dato, updated_at: ahora.toISOString() });
      if (errorIns) return res.status(500).json({ error: "No se pudo guardar el reclamo. Probá de nuevo." });
      return res.status(200).json({ ok: true, id: nuevoId });
    }

    // Fotos y audios del chat (06/11/2026), con el mismo control de los 4 dígitos:
    //   ?chat=subir&tipo=imagen|audio&mime=...  -> { path, token } para subirlo
    //   ?chat=ver&m=<id del mensaje>            -> el archivo (link firmado)
    // El cliente no tiene login: no puede subir nada por su cuenta. El permiso
    // es para UN archivo, en la carpeta de SU conversación.
    if (q.chat === "subir" || q.chat === "ver") {
      const hilo = id ? id : `grupo:${grupo}`;
      const carpeta = carpetaDeHilo(hilo);
      if (q.chat === "ver") {
        const mId = Number.parseInt(String(q.m || ""), 10);
        if (!Number.isInteger(mId)) return res.status(400).json({ error: "Falta el mensaje." });
        const { data: msg } = await supabase.from("chat_mensajes").select("hilo_id, adjunto").eq("id", mId).maybeSingle();
        const ruta = msg?.adjunto?.path;
        if (!msg || msg.hilo_id !== hilo || !ruta) return res.status(404).json({ error: "No encontramos ese archivo." });
        if (msg.adjunto.borrado) return res.status(410).json({ error: "Este archivo ya se borró: la conversación se cerró." });
        const { data: firmaChat, error: errorChat } = await supabase.storage.from(BUCKET_CHAT).createSignedUrl(ruta, 3600);
        if (errorChat || !firmaChat?.signedUrl) return res.status(404).json({ error: "No encontramos ese archivo." });
        // El link dura una hora: el navegador puede reusarlo en vez de volver a pedirlo.
        res.setHeader("Cache-Control", "private, max-age=3000");
        return res.redirect(302, firmaChat.signedUrl);
      }
      if (chatCerrado(pedido)) return res.status(403).json({ error: "Esta conversación ya se cerró. Escribinos por WhatsApp." });
      const tipo = q.tipo === "audio" ? "audio" : q.tipo === "imagen" ? "imagen" : "";
      const ext = extensionDe(tipo, q.mime);
      if (!tipo || !ext) return res.status(400).json({ error: "Solo se pueden mandar fotos o audios." });
      const { data: yaHay } = await supabase.storage.from(BUCKET_CHAT).list(carpeta, { limit: 1000 });
      if ((yaHay || []).length >= MAX_ADJUNTOS) {
        return res.status(429).json({ error: `Llegaste al máximo de ${MAX_ADJUNTOS} archivos en esta conversación. Escribinos por WhatsApp.` });
      }
      const rutaNueva = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { data: permiso, error: errorPermiso } = await supabase.storage.from(BUCKET_CHAT).createSignedUploadUrl(rutaNueva);
      if (errorPermiso || !permiso?.token) return res.status(500).json({ error: "No se pudo preparar la subida." });
      return res.status(200).json({ path: rutaNueva, token: permiso.token });
    }

    // La foto del espejo terminado (27/10/2026). Va por acá porque el bucket es
    // privado y el cliente no tiene login: el link firmado se arma en el
    // servidor, con el mismo control de los 4 dígitos que la factura.
    if (q.foto !== undefined) {
      const fotos = Array.isArray(pedido.fotosTerminado) ? pedido.fotosTerminado.filter(Boolean) : [];
      const k = Number.parseInt(String(q.foto), 10);
      const rutaFoto = rutaDelArchivo(fotos[Number.isInteger(k) && k >= 0 ? k : 0]);
      if (!rutaFoto) return res.status(404).json({ error: "Todavía no hay foto de ese espejo." });
      const { data: firmaFoto, error: errorFoto } = await supabase.storage.from(BUCKET).createSignedUrl(rutaFoto, VENCE_EN);
      if (errorFoto || !firmaFoto?.signedUrl) return res.status(404).json({ error: "No se encontró la foto." });
      return res.redirect(302, firmaFoto.signedUrl);
    }

    // Un pedido puede tener varias facturas (el cliente la pidió en partes):
    // la primera en facturaUrl y las demás en facturasExtra. n elige cuál;
    // sin n, la primera, como siempre.
    const extra = Array.isArray(pedido.facturasExtra) ? pedido.facturasExtra : [];
    const facturas = [pedido.facturaUrl, ...extra].filter(Boolean);
    const n = Number.parseInt(String(q.n ?? "0"), 10);
    const ruta = rutaDelArchivo(facturas[Number.isInteger(n) && n >= 0 ? n : 0]);
    if (!ruta) return res.status(404).json({ error: "Ese pedido todavía no tiene factura cargada." });

    const { data: firma, error: errorFirma } = await supabase
      .storage.from(BUCKET).createSignedUrl(ruta, VENCE_EN);
    if (errorFirma || !firma?.signedUrl) return res.status(404).json({ error: "No se encontró el archivo." });

    return res.redirect(302, firma.signedUrl);
  } catch (e) {
    return res.status(500).json({ error: "No se pudo abrir la factura." });
  }
}
