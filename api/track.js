// Recibe la posición del flete y la reparte a todos los recorridos activos.
// Dos formas de llegar:
//   1. Traccar Client (app del celular, modo OsmAnd):
//        GET /api/track?id=<lo-que-sea>&lat=<>&lon=<>
//   2. El botón "Comenzar recorrido" de la app:
//        POST /api/track   { lat, lng }
//
// Variables de entorno (las mismas que check-alerts):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Distancia en km (Haversine) — fallback si OSRM no responde.
function distanciaKm(a, b, c, d) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (c - a) * r, dLng = (d - b) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function rutaOSRM(fLat, fLng, dLat, dLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fLng},${fLat};${dLng},${dLat}?overview=false`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
    const j = await r.json();
    const ruta = j && j.routes && j.routes[0];
    if (ruta) return { etaMin: Math.round(ruta.duration / 60), km: Math.round((ruta.distance / 1000) * 10) / 10 };
  } catch (e) { /* cae al fallback */ }
  const km = Math.round(distanciaKm(fLat, fLng, dLat, dLng) * 10) / 10;
  return { etaMin: Math.max(1, Math.round((km / 22) * 60)), km }; // ~22 km/h ciudad
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY." });
  }
  const supabase = createClient(process.env.SUPABASE_URL.trim(), process.env.SUPABASE_SERVICE_ROLE_KEY.trim());

  let lat = null, lng = null;
  if (req.method === "GET") {
    lat = num(req.query.lat);
    lng = num(req.query.lon != null ? req.query.lon : req.query.lng);
  } else if (req.method === "POST") {
    const b = req.body || {};
    lat = num(b.lat);
    lng = num(b.lng != null ? b.lng : b.lon);
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
  if (lat == null || lng == null || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return res.status(400).json({ error: "Coordenadas inválidas." });
  }

  const ahora = new Date().toISOString();

  // Cerrar recorridos abandonados (más de 4 horas).
  await supabase.from("envio_tracking").update({ activo: false })
    .eq("activo", true).lt("iniciado_at", new Date(Date.now() - 4 * 3600 * 1000).toISOString());

  const { data: activos } = await supabase.from("envio_tracking").select("*").eq("activo", true);
  if (!activos || activos.length === 0) {
    return res.status(200).json({ ok: true, actualizados: 0, motivo: "sin recorridos activos" });
  }

  let n = 0;
  for (const row of activos) {
    const patch = { flete_lat: lat, flete_lng: lng, flete_at: ahora };
    if (row.destino_lat != null && row.destino_lng != null) {
      const { etaMin, km } = await rutaOSRM(lat, lng, row.destino_lat, row.destino_lng);
      patch.eta_min = etaMin;
      patch.distancia_km = km;
    }
    const { error } = await supabase.from("envio_tracking").update(patch).eq("id", row.id);
    if (!error) n++;
  }

  return res.status(200).json({ ok: true, actualizados: n });
}
