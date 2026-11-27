// Mercado Libre (26/11/2026, Facundo: «desde la app quiero poder ver las
// ventas que llegan, leer el chat… contestarlos… y que se carguen los pedidos
// a fábrica»). Una sola función para todo, porque el plan gratis de Vercel
// tiene un máximo de 12 y ya estamos ahí: /api/ml/<accion>.
//
//   conectar        (admin)          arma el link para autorizar la cuenta
//   callback        (Mercado Libre)  vuelve de autorizar y guarda la llave
//   desconectar     (admin)          borra la llave
//   estado          (equipo)         ¿está conectada? ¿qué cuenta?
//   ventas          (equipo)         las últimas ventas, con su envío
//   chat            (equipo)         los mensajes de una venta
//   enviar          (equipo)         manda un mensaje (en partes de 350)
//   notificaciones  (Mercado Libre)  avisa al celu de una venta o mensaje nuevo
//
// «Equipo» = administrador, Ventas o PostVenta (lo que eligió Facundo).
//
// La llave de Mercado Libre se guarda en la tabla ml_cuenta, que NO tiene
// permisos para la app: solo la lee este servidor (supabase/mercadolibre.sql).
// Los chats y las ventas NO se guardan en Supabase: se piden a Mercado Libre
// cada vez, así no gastan del cupo gratis.
//
// Variables de entorno (las carga Facundo en Vercel):
//   ML_CLIENT_ID, ML_CLIENT_SECRET            de la aplicación de Mercado Libre
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   las de siempre
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY       las de los avisos al celular

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const API = "https://api.mercadolibre.com";
const AUTORIZAR = "https://auth.mercadolibre.com.ar/authorization";
const MAX_MENSAJE = 350;
const SECTORES_EQUIPO = ["ventas", "postventa"];

const env = (k) => String(process.env[k] || "").trim();
function redirectUri(req) {
  if (env("ML_REDIRECT_URI")) return env("ML_REDIRECT_URI");
  const host = req.headers["x-forwarded-host"] || req.headers.host || "decoglass-decoglass.vercel.app";
  return `https://${host}/api/ml/callback`;
}
function supa() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
}

// ---- Quién llama -----------------------------------------------------------
async function quienLlama(sb, req) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) return null;
  const { data: perfil } = await sb.from("profiles").select("rol, sector_id, aprobado, nombre").eq("id", data.user.id).maybeSingle();
  if (!perfil || perfil.aprobado === false) return null;
  return { id: data.user.id, rol: perfil.rol, sector: perfil.sector_id, nombre: perfil.nombre || "" };
}
const esAdmin = (q) => q?.rol === "admin";
const esEquipo = (q) => esAdmin(q) || SECTORES_EQUIPO.includes(q?.sector);

// ---- La llave de Mercado Libre --------------------------------------------
async function leerCuenta(sb) {
  const { data } = await sb.from("ml_cuenta").select("*").eq("id", 1).maybeSingle();
  return data || null;
}
async function guardarCuenta(sb, cambios) {
  const { error } = await sb.from("ml_cuenta").upsert({ id: 1, ...cambios, updated_at: new Date().toISOString() });
  if (error) throw new Error("No se pudo guardar en ml_cuenta: " + error.message);
}
async function pedirToken(params) {
  const r = await fetch(`${API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ client_id: env("ML_CLIENT_ID"), client_secret: env("ML_CLIENT_SECRET"), ...params }).toString(),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) throw new Error(d.message || d.error || `Mercado Libre respondió ${r.status}`);
  return d;
}
// Devuelve un access_token vigente. El de Mercado Libre dura 6 horas; el
// refresh_token se usa UNA vez y viene uno nuevo cada vez.
async function tokenVigente(sb) {
  const c = await leerCuenta(sb);
  if (!c?.refresh_token) return null;
  const vence = c.expires_at ? new Date(c.expires_at).getTime() : 0;
  if (c.access_token && vence - Date.now() > 5 * 60 * 1000) return { token: c.access_token, sellerId: c.seller_id, cuenta: c };
  const d = await pedirToken({ grant_type: "refresh_token", refresh_token: c.refresh_token });
  const cambios = {
    access_token: d.access_token,
    refresh_token: d.refresh_token || c.refresh_token,
    expires_at: new Date(Date.now() + (Number(d.expires_in) || 21600) * 1000).toISOString(),
  };
  await guardarCuenta(sb, cambios);
  return { token: d.access_token, sellerId: c.seller_id, cuenta: { ...c, ...cambios } };
}
async function ml(token, ruta, opciones = {}) {
  const r = await fetch(`${API}${ruta}`, {
    ...opciones,
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json", ...(opciones.body ? { "Content-Type": "application/json" } : {}), ...(opciones.headers || {}) },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(d.message || d.error || `Mercado Libre respondió ${r.status}`);
    e.status = r.status; e.datos = d;
    throw e;
  }
  return d;
}

// ---- Cómo se ve una venta para la app ----------------------------------------
function textoDe(m) { return typeof m?.text === "string" ? m.text : (m?.text?.plain || ""); }
function envioDe(s) {
  if (!s) return null;
  const a = s.receiver_address || s.destination?.shipping_address || {};
  const logistica = s.logistic?.type || s.logistic_type || "";
  const modo = s.logistic?.mode || s.mode || "";
  return {
    id: s.id, modo, logistica, estado: s.status || "",
    nombre: a.receiver_name || s.destination?.receiver_name || "",
    telefono: a.receiver_phone || s.destination?.receiver_phone || "",
    calle: a.address_line || [a.street_name, a.street_number].filter(Boolean).join(" "),
    piso: a.comment || "",
    ciudad: a.city?.name || "", provincia: a.state?.name || "", cp: a.zip_code || "",
  };
}
function ventaDe(o, envio) {
  return {
    id: String(o.id),
    pack: String(o.pack_id || o.id),
    fecha: o.date_created || o.date_closed || "",
    estado: o.status || "",
    total: Number(o.total_amount) || 0,
    comprador: {
      id: o.buyer?.id || null,
      apodo: o.buyer?.nickname || "",
      nombre: [o.buyer?.first_name, o.buyer?.last_name].filter(Boolean).join(" "),
    },
    items: (o.order_items || []).map((it) => ({
      id: it.item?.id || "",
      titulo: it.item?.title || "",
      variacion: (it.item?.variation_attributes || []).map((v) => `${v.name}: ${v.value_name}`).join(" · "),
      cantidad: Number(it.quantity) || 1,
      precio: Number(it.unit_price) || 0,
    })),
    envio,
    etiquetas: o.tags || [],
  };
}

// Corta un texto largo en partes de hasta 350, sin partir palabras: primero
// por párrafos, después por oraciones y recién al final por palabras.
export function partirMensaje(texto, max = MAX_MENSAJE) {
  const limpio = String(texto || "").replace(/\r/g, "").trim();
  if (!limpio) return [];
  if (limpio.length <= max) return [limpio];
  const piezas = [];
  limpio.split(/\n{2,}/).forEach((par) => {
    if (par.length <= max) { piezas.push(par); return; }
    par.split(/(?<=[.!?])\s+|\n/).forEach((or) => {
      if (or.length <= max) { piezas.push(or); return; }
      let linea = "";
      or.split(/\s+/).forEach((w) => {
        if ((linea + " " + w).trim().length > max) { if (linea) piezas.push(linea); linea = w.slice(0, max); }
        else linea = (linea + " " + w).trim();
      });
      if (linea) piezas.push(linea);
    });
  });
  const partes = [];
  let actual = "";
  piezas.forEach((p) => {
    const junto = actual ? `${actual}\n\n${p}` : p;
    if (junto.length <= max) actual = junto;
    else { if (actual) partes.push(actual); actual = p; }
  });
  if (actual) partes.push(actual);
  return partes;
}

// Lo que dice Mercado Libre cuando no deja escribir, en criollo.
function motivoBloqueo(e) {
  const t = JSON.stringify(e?.datos || {}).toLowerCase() + " " + String(e?.message || "").toLowerCase();
  if (/fulfillment|delivered/.test(t)) return "Es una venta Full: Mercado Libre no deja escribir hasta que el paquete se entregue.";
  if (/cancel/.test(t)) return "La venta está cancelada: Mercado Libre no deja escribir.";
  if (/payment|pago/.test(t)) return "El pago todavía no se acreditó: Mercado Libre no deja escribir todavía.";
  if (/blocked|bloque|initiat|action_guide/.test(t)) return "Mercado Libre no deja escribir primero en esta venta: hay que esperar a que el cliente escriba.";
  if (/length|largo|characters/.test(t)) return "El mensaje es muy largo para Mercado Libre.";
  if (e?.status === 403) return "Mercado Libre no permite mandar mensajes en esta venta.";
  return e?.message || "Mercado Libre no aceptó el mensaje.";
}

// ---- Avisos al celular ---------------------------------------------------------
async function avisarAlEquipo(sb, titulo, cuerpo, tag) {
  if (!env("VAPID_PUBLIC_KEY") || !env("VAPID_PRIVATE_KEY")) return 0;
  webpush.setVapidDetails(env("VAPID_SUBJECT") || "mailto:contacto@decoglass.com", env("VAPID_PUBLIC_KEY"), env("VAPID_PRIVATE_KEY"));
  const { data: subs } = await sb.from("push_subscriptions").select("*");
  const payload = JSON.stringify({ title: titulo, body: String(cuerpo || "").slice(0, 140), url: "/?mercadolibre=1", tag });
  const bajas = [];
  let enviadas = 0;
  await Promise.all((subs || []).map(async (sub) => {
    try { await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload); enviadas++; }
    catch (err) { if (err && (err.statusCode === 404 || err.statusCode === 410)) bajas.push(sub.id); }
  }));
  if (bajas.length) await sb.from("push_subscriptions").delete().in("id", bajas);
  return enviadas;
}
// Mercado Libre avisa muchas veces por la misma venta (cada cambio de pago,
// de envío…). Se avisa al celu UNA sola vez por venta y por mensaje.
async function yaAvisado(sb, cuenta, clave) {
  const lista = Array.isArray(cuenta?.avisados) ? cuenta.avisados : [];
  if (lista.includes(clave)) return true;
  await guardarCuenta(sb, { avisados: [clave, ...lista].slice(0, 200) });
  return false;
}
async function procesarNotificacion(sb, n) {
  const t = await tokenVigente(sb);
  if (!t || String(n.user_id) !== String(t.sellerId)) return;
  const recurso = String(n.resource || "");
  if (n.topic === "orders_v2") {
    const o = await ml(t.token, recurso);
    if (o.status !== "paid") return;
    // Solo las ventas nuevas (las de hace más de un día ya se vieron).
    if (Date.now() - new Date(o.date_created).getTime() > 24 * 3600 * 1000) return;
    if (await yaAvisado(sb, t.cuenta, `venta:${o.id}`)) return;
    const item = o.order_items?.[0]?.item?.title || "un producto";
    await avisarAlEquipo(sb, "Nueva venta en Mercado Libre", `${o.buyer?.nickname || "Un cliente"} compró ${item}`, `ml-venta-${o.id}`);
  } else if (n.topic === "messages") {
    const id = recurso.split("/").filter(Boolean).pop();
    const d = await ml(t.token, `/messages/${id}?tag=post_sale`);
    const m = Array.isArray(d.messages) ? d.messages[0] : d;
    if (!m || String(m.from?.user_id) === String(t.sellerId)) return;
    if (await yaAvisado(sb, t.cuenta, `msj:${m.id || id}`)) return;
    await avisarAlEquipo(sb, "Mensaje en Mercado Libre", textoDe(m) || "Te escribieron en una venta", `ml-msj-${m.id || id}`);
  }
}
// Que Vercel deje terminar el trabajo después de contestar (Mercado Libre
// pide la respuesta en menos de medio segundo). Es lo mismo que hace
// waitUntil de @vercel/functions, sin sumar la dependencia.
function despuesDeContestar(promesa) {
  try {
    const ctx = globalThis[Symbol.for("@vercel/request-context")]?.get?.();
    if (ctx?.waitUntil) { ctx.waitUntil(promesa.catch(() => {})); return true; }
  } catch (e) { /* sigue abajo */ }
  return false;
}

// ---- El servidor ------------------------------------------------------------------
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  const accion = String(req.query?.accion || "").toLowerCase();
  if (!env("SUPABASE_URL") || !env("SUPABASE_SERVICE_ROLE_KEY")) return res.status(500).json({ error: "Servidor sin configurar." });
  const sb = supa();
  const configurado = !!(env("ML_CLIENT_ID") && env("ML_CLIENT_SECRET"));

  try {
    // Mercado Libre avisa algo: se contesta enseguida y se trabaja después.
    if (accion === "notificaciones") {
      if (req.method !== "POST") return res.status(200).json({ ok: true });
      const n = req.body || {};
      const trabajo = configurado && ["orders_v2", "messages"].includes(n.topic) ? procesarNotificacion(sb, n) : Promise.resolve();
      if (despuesDeContestar(trabajo)) return res.status(200).json({ ok: true });
      await trabajo.catch(() => {});
      return res.status(200).json({ ok: true });
    }

    // Vuelve de autorizar en Mercado Libre.
    if (accion === "callback") {
      const { code, state, error } = req.query || {};
      const volver = (q) => { res.writeHead(302, { Location: `/?mercadolibre=1&ml=${q}` }); res.end(); };
      if (error || !code) return volver("cancelado");
      const c = await leerCuenta(sb);
      if (!c?.oauth_state || c.oauth_state !== state || new Date(c.oauth_vence || 0).getTime() < Date.now()) return volver("vencido");
      const d = await pedirToken({ grant_type: "authorization_code", code: String(code), redirect_uri: redirectUri(req) });
      let apodo = "";
      try { apodo = (await ml(d.access_token, "/users/me")).nickname || ""; } catch (e) { /* no importa */ }
      await guardarCuenta(sb, {
        seller_id: d.user_id, nickname: apodo,
        access_token: d.access_token, refresh_token: d.refresh_token,
        expires_at: new Date(Date.now() + (Number(d.expires_in) || 21600) * 1000).toISOString(),
        oauth_state: null, oauth_vence: null,
        // Desde acá se arman los pedidos solos: las ventas de antes ya se cargaron a mano.
        ...(c.conectado_at ? {} : { conectado_at: new Date().toISOString() }),
      });
      return volver("conectado");
    }

    // De acá en adelante, solo el equipo con su sesión.
    const quien = await quienLlama(sb, req);
    if (!quien) return res.status(401).json({ error: "Tu sesión venció. Volvé a entrar." });
    if (!esEquipo(quien)) return res.status(403).json({ error: "Mercado Libre lo ven el administrador, Ventas y PostVenta." });

    if (accion === "estado") {
      const c = configurado ? await leerCuenta(sb) : null;
      return res.status(200).json({ configurado, conectado: !!c?.refresh_token, cuenta: c?.nickname || "", desde: c?.conectado_at || null, puedeConectar: esAdmin(quien) });
    }

    if (accion === "conectar") {
      if (!esAdmin(quien)) return res.status(403).json({ error: "La cuenta la conecta el administrador." });
      if (!configurado) return res.status(400).json({ error: "Faltan ML_CLIENT_ID y ML_CLIENT_SECRET en Vercel." });
      const estado = crypto.randomBytes(18).toString("hex");
      await guardarCuenta(sb, { oauth_state: estado, oauth_vence: new Date(Date.now() + 10 * 60 * 1000).toISOString() });
      const url = `${AUTORIZAR}?${new URLSearchParams({ response_type: "code", client_id: env("ML_CLIENT_ID"), redirect_uri: redirectUri(req), state: estado })}`;
      return res.status(200).json({ url });
    }

    if (accion === "desconectar") {
      if (!esAdmin(quien)) return res.status(403).json({ error: "La cuenta la desconecta el administrador." });
      await guardarCuenta(sb, { access_token: null, refresh_token: null, expires_at: null });
      return res.status(200).json({ ok: true });
    }

    if (!configurado) return res.status(400).json({ error: "Mercado Libre todavía no está configurado." });
    const t = await tokenVigente(sb);
    if (!t) return res.status(409).json({ error: "La cuenta de Mercado Libre no está conectada." });

    if (accion === "ventas") {
      const d = await ml(t.token, `/orders/search?seller=${t.sellerId}&sort=date_desc&limit=30`);
      const ordenes = d.results || [];
      const envios = await Promise.all(ordenes.map((o) => (o.shipping?.id
        ? ml(t.token, `/shipments/${o.shipping.id}`, { headers: { "x-format-new": "true" } }).then(envioDe).catch(() => null)
        : Promise.resolve(null))));
      return res.status(200).json({ ventas: ordenes.map((o, i) => ventaDe(o, envios[i])), cuenta: t.cuenta.nickname || "", desde: t.cuenta.conectado_at || null });
    }

    if (accion === "chat") {
      const pack = String(req.query?.pack || "").replace(/\D/g, "");
      if (!pack) return res.status(400).json({ error: "Falta la venta." });
      const d = await ml(t.token, `/messages/packs/${pack}/sellers/${t.sellerId}?tag=post_sale&mark_as_read=false`);
      const mensajes = (d.messages || []).map((m) => ({
        id: m.id,
        deNosotros: String(m.from?.user_id) === String(t.sellerId),
        texto: textoDe(m),
        fecha: m.message_date?.created || m.date_created || "",
        adjuntos: (m.message_attachments || []).length,
      })).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
      const conv = d.conversation_status || {};
      return res.status(200).json({ mensajes, bloqueado: conv.status === "blocked", motivo: conv.substatus || "" });
    }

    if (accion === "enviar") {
      if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
      const { pack, comprador, texto } = req.body || {};
      const p = String(pack || "").replace(/\D/g, "");
      const partes = partirMensaje(texto);
      if (!p || !comprador || !partes.length) return res.status(400).json({ error: "Falta la venta, el cliente o el texto." });
      if (partes.length > 6) return res.status(400).json({ error: "El mensaje es muy largo (más de 6 partes). Achicalo un poco." });
      let enviadas = 0;
      for (const parte of partes) {
        try {
          await ml(t.token, `/messages/packs/${p}/sellers/${t.sellerId}?tag=post_sale`, {
            method: "POST",
            body: JSON.stringify({ from: { user_id: t.sellerId }, to: { user_id: comprador }, text: parte }),
          });
          enviadas++;
        } catch (e) {
          return res.status(e.status && e.status < 500 ? 422 : 502).json({ error: motivoBloqueo(e), enviadas, partes: partes.length });
        }
      }
      return res.status(200).json({ ok: true, enviadas, partes: partes.length, quien: quien.nombre });
    }

    return res.status(404).json({ error: "Acción desconocida." });
  } catch (e) {
    return res.status(502).json({ error: e?.message || "Error hablando con Mercado Libre." });
  }
}
