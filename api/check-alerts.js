// Función serverless (Vercel Cron la llama una vez por día).
// Arma UN resumen del día por audiencia (Fábrica, Ventas, Administración,
// Administradores) y manda UNA sola notificación push a cada persona con
// el conteo total. Al tocarla, la app le muestra el detalle completo.
// El mismo resumen queda guardado para el historial de Ajustes.
//
// Variables de entorno (se configuran en Vercel, no en el código):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
//   CRON_SECRET (opcional)

import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const UMBRAL_RECLAMO_HORAS = 48;
const UMBRAL_COMISION_DIAS = 7;

function supabaseAdmin() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function leerKv(supabase, key) {
  const { data } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
  if (!data) return null;
  try { return JSON.parse(data.value); } catch (e) { return null; }
}

function pedidoTerminado(p) {
  return p.estado === "Entregado" || p.estado === "Cancelado";
}
function resumenPedido(p) {
  return { id: p.id, orden: p.orden, cliente: p.cliente || "Sin nombre", metodo: p.metodo, listo: p.listo || null };
}

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
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
  const fecha = hoyISO();
  const hoyMs = new Date(fecha).getTime();
  const ahora = Date.now();

  const [{ data: pedidoRows }, { data: subs }] = await Promise.all([
    supabase.from("pedidos_rows").select("data"),
    supabase.from("push_subscriptions").select("*"),
  ]);
  const pedidos = (pedidoRows || []).map((r) => r.data);
  const suscripciones = subs || [];
  const stockMateriales = (await leerKv(supabase, "stock-materiales")) || [];
  const reclamos = (await leerKv(supabase, "reclamos")) || [];

  // ---- armar las listas base ----
  const demorados = pedidos.filter((p) => p.demorado && !pedidoTerminado(p)).map(resumenPedido);
  const sinConfirmar = pedidos.filter((p) => p.estado === "Sin pasar a fábrica" && !pedidoTerminado(p)).map(resumenPedido);
  const pasadosDeFecha = pedidos
    .filter((p) => p.listo && !pedidoTerminado(p) && new Date(p.listo).getTime() < hoyMs)
    .map(resumenPedido);
  const reclamosSinResolver = reclamos
    .filter((r) => !r.finalizado && !(r.estado || "").toLowerCase().includes("final"))
    .filter((r) => { const f = new Date(r.fecha).getTime(); return !Number.isNaN(f) && (ahora - f) / 3600000 >= UMBRAL_RECLAMO_HORAS; })
    .map((r) => ({ id: r.id, cliente: r.cliente || "Sin nombre", tipo: r.tipo, fecha: r.fecha }));
  const comisionesPendientes = pedidos
    .filter((p) => !p.comisionPagada && !p.comisionExcluida && p.vendedor && (Number(p.monto) || 0) - (Number(p.anticipo) || 0) <= 0)
    .filter((p) => { const f = new Date(p.fecha).getTime(); return !Number.isNaN(f) && (ahora - f) / 86400000 >= UMBRAL_COMISION_DIAS; })
    .map((p) => ({ id: p.id, orden: p.orden, vendedor: p.vendedor, cliente: p.cliente || "Sin nombre" }));
  const stockBajo = stockMateriales
    .filter((m) => Number(m.cantidad) <= Number(m.minimo))
    .map((m) => ({ id: m.id, nombre: m.nombre, cantidad: m.cantidad, minimo: m.minimo, unidad: m.unidad }));

  // ---- arma un resumen por audiencia; cada una ve solo lo que le corresponde ----
  const AUDIENCIAS = {
    fabrica: { demorados },
    ventas: { sinConfirmar, pasadosDeFecha },
    administracion: { demorados, sinConfirmar, pasadosDeFecha },
    otros: { demorados, sinConfirmar, pasadosDeFecha }, // postventa/logística/marketing: misma vista que administración
    admin: { demorados, sinConfirmar, pasadosDeFecha, reclamosSinResolver, comisionesPendientes, stockBajo },
  };

  function totalDeAudiencia(detalle) {
    return Object.values(detalle).reduce((a, lista) => a + lista.length, 0);
  }
  function tituloDetalle(detalle) {
    const partes = [];
    if (detalle.demorados?.length) partes.push(`${detalle.demorados.length} demorado(s)`);
    if (detalle.sinConfirmar?.length) partes.push(`${detalle.sinConfirmar.length} sin confirmar`);
    if (detalle.pasadosDeFecha?.length) partes.push(`${detalle.pasadosDeFecha.length} vencido(s)`);
    if (detalle.reclamosSinResolver?.length) partes.push(`${detalle.reclamosSinResolver.length} reclamo(s)`);
    if (detalle.comisionesPendientes?.length) partes.push(`${detalle.comisionesPendientes.length} comisión(es)`);
    if (detalle.stockBajo?.length) partes.push(`${detalle.stockBajo.length} material(es) bajo mínimo`);
    return partes.join(" · ");
  }
  function sectorDeAudiencia(audiencia) {
    if (audiencia === "fabrica") return "fabrica";
    if (audiencia === "ventas") return "ventas";
    if (audiencia === "administracion") return "administracion";
    return null;
  }

  const resultados = {};
  for (const [audiencia, detalle] of Object.entries(AUDIENCIAS)) {
    const total = totalDeAudiencia(detalle);
    const id = `${fecha}-${audiencia}`;
    await supabase.from("notificaciones_resumen").upsert({ id, fecha, audiencia, detalle });
    resultados[audiencia] = { total, guardado: true };
  }

  // ---- enviar UNA push por persona, según a qué audiencia le corresponde ----
  let enviadas = 0;
  const bajas = [];
  for (const sub of suscripciones) {
    const audiencia = sub.rol === "admin" ? "admin" : (sectorDeAudiencia(sub.sector_id) || "otros");
    const detalle = AUDIENCIAS[audiencia];
    const total = totalDeAudiencia(detalle);
    if (total === 0) continue; // sin novedades para esta persona, no se le manda nada

    const cuerpo = tituloDetalle(detalle);
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({
          title: `Resumen del día — ${total} aviso(s)`,
          body: cuerpo,
          url: "/?notificaciones=1",
          tag: `resumen-${fecha}`,
        })
      );
      enviadas++;
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) bajas.push(sub.id);
    }
  }

  if (bajas.length) await supabase.from("push_subscriptions").delete().in("id", bajas);

  return res.status(200).json({ ok: true, fecha, resumenes: resultados, enviadas, bajasEliminadas: bajas.length });
}
