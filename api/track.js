// Recibe la posición del flete. La ubicación entra al mapa SOLO si viene del
// dispositivo que inició el recorrido (identificado por un "token").
//
//   1. Traccar Client (modo OsmAnd):  GET /api/track?id=<TOKEN>&lat=<>&lon=<>
//        -> el "Device identifier" de Traccar Client tiene que ser el TOKEN
//           que muestra la app en "Comenzar recorrido".
//   2. Botón "Comenzar recorrido" de la app:  POST /api/track  { lat, lng, token }
//
// Variables de entorno (las mismas que check-alerts):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   TRACK_SECRET (opcional): si está, la URL de Traccar también necesita ?key=

import { createClient } from "@supabase/supabase-js";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY." });
  }
  const supabase = createClient(process.env.SUPABASE_URL.trim(), process.env.SUPABASE_SERVICE_ROLE_KEY.trim());
  const secret = (process.env.TRACK_SECRET || "").trim();

  let lat = null, lng = null, token = "";
  if (req.method === "GET") {
    if (secret && String(req.query.key || "") !== secret) {
      return res.status(401).json({ error: "key inválida" });
    }
    token = String(req.query.id || req.query.token || "").trim();
    lat = num(req.query.lat);
    lng = num(req.query.lon != null ? req.query.lon : req.query.lng);
  } else if (req.method === "POST") {
    const origin = req.headers.origin || "";
    const host = req.headers.host || "";
    if (origin && host && !origin.endsWith(host)) {
      return res.status(403).json({ error: "origen no permitido" });
    }
    const b = req.body || {};
    token = String(b.token || "").trim();
    lat = num(b.lat);
    lng = num(b.lng != null ? b.lng : b.lon);
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
  if (lat == null || lng == null || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return res.status(400).json({ error: "Coordenadas inválidas." });
  }
  if (!token) {
    return res.status(400).json({ error: "Falta el token del recorrido." });
  }

  const ahora = new Date().toISOString();

  // Cerrar recorridos abandonados (más de 4 horas).
  await supabase.from("envio_tracking").update({ activo: false })
    .eq("activo", true).lt("iniciado_at", new Date(Date.now() - 4 * 3600 * 1000).toISOString());

  // Solo las filas que inició ESTE dispositivo (mismo token).
  const { data: activos } = await supabase.from("envio_tracking")
    .select("*").eq("activo", true).eq("fletero_token", token);
  if (!activos || activos.length === 0) {
    return res.status(200).json({ ok: true, actualizados: 0, motivo: "ningún recorrido activo para este token" });
  }

  let n = 0;
  for (const row of activos) {
    const { error } = await supabase.from("envio_tracking")
      .update({ flete_lat: lat, flete_lng: lng, flete_at: ahora }).eq("id", row.id);
    if (!error) n++;
  }

  return res.status(200).json({ ok: true, actualizados: n });
}
