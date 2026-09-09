// Función serverless: avisa por push a TODO el equipo que entró un reclamo nuevo.
// La llama la pestaña Reclamos con { reclamoId }. Reusa las mismas variables de
// entorno que check-alerts (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAPID_*).

import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const reclamoId = String((req.body && req.body.reclamoId) || "").trim();
  if (!reclamoId) return res.status(400).json({ error: "Falta reclamoId." });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY." });
  }
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(500).json({ error: "Faltan las claves VAPID." });
  }

  const supabase = createClient(process.env.SUPABASE_URL.trim(), process.env.SUPABASE_SERVICE_ROLE_KEY.trim());

  // El reclamo vive en la tabla reclamos_rows: { id, data, updated_at }
  const { data: fila } = await supabase.from("reclamos_rows").select("data").eq("id", reclamoId).maybeSingle();
  const r = fila && fila.data;
  if (!r) return res.status(404).json({ error: "Reclamo inexistente." });

  webpush.setVapidDetails(
    (process.env.VAPID_SUBJECT || "mailto:contacto@decoglass.com").trim(),
    process.env.VAPID_PUBLIC_KEY.trim(),
    process.env.VAPID_PRIVATE_KEY.trim()
  );

  const cliente = r.cliente ? r.cliente : "Sin nombre";
  const cuerpo = [cliente, r.notas].filter(Boolean).join(" · ").slice(0, 140);
  const payload = JSON.stringify({
    title: `Reclamo nuevo: ${r.tipo || "sin tipo"}`,
    body: cuerpo || "Entró un reclamo nuevo en PostVenta.",
    url: "/",
    tag: `reclamo-${reclamoId}`,
  });

  const { data: subs } = await supabase.from("push_subscriptions").select("*");
  const suscripciones = subs || [];
  let enviadas = 0;
  const bajas = [];
  for (const sub of suscripciones) {
    try {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload);
      enviadas++;
    } catch (err) {
      if (err && (err.statusCode === 404 || err.statusCode === 410)) bajas.push(sub.id);
    }
  }
  if (bajas.length) await supabase.from("push_subscriptions").delete().in("id", bajas);

  return res.status(200).json({ ok: true, enviadas, suscripciones: suscripciones.length });
}
