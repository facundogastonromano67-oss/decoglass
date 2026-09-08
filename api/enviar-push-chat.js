// Función serverless: cuando un cliente manda un mensaje desde el link de
// seguimiento, esto avisa por push a todo el equipo (admin + encargados +
// operarios suscriptos). Lo llama la propia página de seguimiento después de
// guardar el mensaje: fetch("/api/enviar-push-chat", { body: { hiloId } }).
//
// Variables de entorno (ya están en Vercel si anda check-alerts):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT

import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const hiloId = String((req.body && req.body.hiloId) || "").trim();
  if (!hiloId) return res.status(400).json({ error: "Falta hiloId." });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY." });
  }
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return res.status(500).json({ error: "Faltan las claves VAPID." });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
  );

  // 1) Traer el hilo y su último mensaje. Solo avisamos si de verdad hay un
  //    mensaje reciente de un cliente (evita que alguien spamee el endpoint).
  const { data: hilo } = await supabase.from("chat_hilos").select("*").eq("id", hiloId).maybeSingle();
  if (!hilo) return res.status(404).json({ error: "Hilo inexistente." });

  const { data: ultimos } = await supabase
    .from("chat_mensajes").select("*")
    .eq("hilo_id", hiloId).order("created_at", { ascending: false }).limit(1);
  const ultimo = (ultimos || [])[0];
  if (!ultimo || ultimo.autor_tipo !== "cliente") {
    return res.status(200).json({ ok: true, enviadas: 0, motivo: "sin mensaje de cliente" });
  }
  const antiguedadSeg = (Date.now() - new Date(ultimo.created_at).getTime()) / 1000;
  if (!(antiguedadSeg >= 0) || antiguedadSeg > 120) {
    return res.status(200).json({ ok: true, enviadas: 0, motivo: "mensaje no reciente" });
  }

  // 2) Marcar el hilo como "no leído por el staff" (por las dudas el trigger de
  //    la app no llegó) y actualizar el resumen.
  await supabase.from("chat_hilos").update({
    ultimo_mensaje: (ultimo.cuerpo || "").slice(0, 200),
    ultimo_mensaje_at: ultimo.created_at,
    ultimo_autor_tipo: "cliente",
  }).eq("id", hiloId);

  // 3) Mandar push a todas las suscripciones.
  webpush.setVapidDetails(
    (process.env.VAPID_SUBJECT || "mailto:contacto@decoglass.com").trim(),
    process.env.VAPID_PUBLIC_KEY.trim(),
    process.env.VAPID_PRIVATE_KEY.trim()
  );

  const { data: subs } = await supabase.from("push_subscriptions").select("*");
  const suscripciones = subs || [];

  const nombre = hilo.cliente_nombre || "un cliente";
  const orden = hilo.orden ? ` (${hilo.orden})` : "";
  const payload = JSON.stringify({
    title: `Consulta de ${nombre}${orden}`,
    body: (ultimo.cuerpo || "").slice(0, 140),
    url: "/?consultas=1",
    tag: `chat-${hiloId}`,
  });

  let enviadas = 0;
  const bajas = [];
  for (const sub of suscripciones) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      enviadas++;
    } catch (err) {
      if (err && (err.statusCode === 404 || err.statusCode === 410)) bajas.push(sub.id);
    }
  }
  if (bajas.length) await supabase.from("push_subscriptions").delete().in("id", bajas);

  return res.status(200).json({ ok: true, enviadas, suscripciones: suscripciones.length, bajasEliminadas: bajas.length });
}
