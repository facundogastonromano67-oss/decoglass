// Convierte una dirección de texto en coordenadas (para el pin del destino).
// Usa Nominatim (OpenStreetMap) — gratis, sin cuenta. Se hace del lado del
// servidor para poder mandar el User-Agent que Nominatim exige.
//   GET /api/geocodificar?q=<direccion>

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, max-age=86400");
  const q = String((req.query && req.query.q) || "").trim();
  if (!q) return res.status(400).json({ error: "Falta la dirección." });

  try {
    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ar&q=" + encodeURIComponent(q);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000);
    const r = await fetch(url, {
      headers: { "User-Agent": "DecoglassGestion/1.0 (seguimiento de envios)", "Accept-Language": "es" },
      signal: ctrl.signal,
    }).finally(() => clearTimeout(t));
    const arr = await r.json();
    const hit = Array.isArray(arr) && arr[0];
    if (!hit) return res.status(200).json({ ok: false, motivo: "no se encontró la dirección" });
    return res.status(200).json({
      ok: true,
      lat: Number(hit.lat),
      lng: Number(hit.lon),
      texto: hit.display_name || q,
    });
  } catch (e) {
    return res.status(200).json({ ok: false, motivo: "no se pudo geocodificar" });
  }
}
