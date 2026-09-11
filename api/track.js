// Recibe la posición del flete. La ubicación entra al mapa SOLO si viene del
// dispositivo que inició el recorrido (identificado por un "token").
//
//   1. App de GPS en segundo plano (modo OsmAnd / HTTP):
//        GET /api/track?id=<TOKEN>&lat=<>&lon=<>
//      -> el "Device identifier" tiene que ser el TOKEN que muestra la app
//         en "Código de rastreo de este celular".
//      Sirve con Traccar Client, GPSLogger, OwnTracks (modo HTTP) o cualquier
//      otra que permita armar la URL.
//
//   2. OwnTracks (modo HTTP), que es lo que mejor anda en iPhone:
//        POST /api/track?id=<TOKEN>   con su JSON {lat, lon} en el cuerpo.
//
//   3. Botón "Comenzar recorrido" de la app:  POST /api/track  { lat, lng, token }
//
//   4. PRUEBA: abrir en el navegador del celular
//        GET /api/track?id=<TOKEN>     (sin lat ni lon)
//      Contesta un diagnóstico en castellano: si llegó, si el token existe y
//      si hay un recorrido abierto. Sirve para saber si el problema es la app
//      de GPS o la configuración.
//
// Variables de entorno (las mismas que check-alerts):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   TRACK_SECRET (opcional): si está, la URL también necesita ?key=

import { createClient } from "@supabase/supabase-js";

function num(v) {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) ? n : null;
}

// Si alguien pega la URL completa en el campo "servidor", el parámetro puede
// llegar repetido. Nos quedamos con el primero.
function texto(v) {
  return String(Array.isArray(v) ? v[0] : (v == null ? "" : v)).trim();
}

function haceCuanto(iso) {
  if (!iso) return "nunca";
  const seg = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (!Number.isFinite(seg)) return "nunca";
  if (seg < 90) return `hace ${seg} segundos`;
  if (seg < 3600) return `hace ${Math.round(seg / 60)} minutos`;
  return `hace ${Math.round(seg / 3600)} horas`;
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
    if (secret && texto(req.query.key) !== secret) {
      return res.status(401).json({ error: "key inválida" });
    }
    token = texto(req.query.id) || texto(req.query.token) || texto(req.query.deviceid);
    lat = num(req.query.lat);
    lng = num(req.query.lon != null ? req.query.lon : req.query.lng);
  } else if (req.method === "POST") {
    const origin = req.headers.origin || "";
    const host = req.headers.host || "";
    if (origin && host && !origin.endsWith(host)) {
      return res.status(403).json({ error: "origen no permitido" });
    }
    const b = req.body || {};
    // OwnTracks manda {_type:"location", lat, lon, tid}. Su "tid" son 2 letras,
    // así que lo normal es poner el código en la URL (?id=XXXX) y que el
    // cuerpo traiga solo las coordenadas. Aceptamos las dos formas.
    token = texto(b.token) || texto(b.tid) || texto(req.query && req.query.id);
    lat = num(b.lat);
    lng = num(b.lng != null ? b.lng : b.lon);
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // El código se genera en mayúsculas, pero algunas apps lo mandan como lo
  // tipearon. Comparamos sin distinguir mayúsculas para no fallar en silencio.
  token = token.toUpperCase();

  if (!token) {
    return res.status(400).json({
      error: "Falta el identificador del dispositivo.",
      ayuda: "En la app de GPS, el 'Device identifier' tiene que ser el código que muestra Logística en 'Código de rastreo de este celular'.",
    });
  }

  // Cerrar recorridos abandonados (más de 4 horas).
  await supabase.from("envio_tracking").update({ activo: false })
    .eq("activo", true).lt("iniciado_at", new Date(Date.now() - 4 * 3600 * 1000).toISOString());

  // Solo las filas que inició ESTE dispositivo (mismo token, sin importar
  // mayúsculas).
  const { data: activos, error: errorBusqueda } = await supabase.from("envio_tracking")
    .select("*").eq("activo", true).ilike("fletero_token", token);

  if (errorBusqueda) {
    return res.status(500).json({ error: "No pude leer los recorridos: " + errorBusqueda.message });
  }

  // --- Modo prueba: sin coordenadas, contesta qué está pasando -------------
  if (lat == null || lng == null) {
    if (req.method !== "GET") {
      return res.status(400).json({ error: "Coordenadas inválidas." });
    }
    if (!activos || activos.length === 0) {
      const { data: conEseToken } = await supabase.from("envio_tracking")
        .select("id,activo,iniciado_at").ilike("fletero_token", token).limit(5);
      return res.status(200).json({
        prueba: true,
        llegue_bien: true,
        codigo: token,
        recorridos_abiertos: 0,
        diagnostico: (conEseToken && conEseToken.length > 0)
          ? "La URL está bien y el código existe, pero ahora mismo no hay ningún recorrido abierto con ese código. Tocá 'Comenzar recorrido' en Logística y volvé a probar."
          : "La URL está bien, pero nunca se empezó un recorrido con este código. Fijate que el 'Device identifier' sea EXACTAMENTE el código que muestra Logística, y que el recorrido lo hayas empezado desde ESE mismo celular.",
      });
    }
    return res.status(200).json({
      prueba: true,
      llegue_bien: true,
      codigo: token,
      recorridos_abiertos: activos.length,
      ultima_posicion: haceCuanto(activos[0].flete_at),
      diagnostico: "Todo bien: la URL llega y hay un recorrido abierto con este código. Si la última posición quedó vieja, el problema es la app de GPS del celular (no está mandando en segundo plano).",
    });
  }

  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return res.status(400).json({ error: "Coordenadas inválidas." });
  }

  if (!activos || activos.length === 0) {
    return res.status(200).json({
      ok: true,
      actualizados: 0,
      motivo: "No hay ningún recorrido abierto con el código " + token + ". Empezá el recorrido desde Logística.",
    });
  }

  const ahora = new Date().toISOString();
  let n = 0;
  for (const row of activos) {
    const { error } = await supabase.from("envio_tracking")
      .update({ flete_lat: lat, flete_lng: lng, flete_at: ahora }).eq("id", row.id);
    if (!error) n++;
  }

  return res.status(200).json({ ok: true, actualizados: n });
}
