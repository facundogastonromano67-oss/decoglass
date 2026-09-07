// Función serverless: recibe la foto de una factura de compra (en base64) y
// la reenvía al script de Google Apps Script que la guarda en Drive.
//
// El navegador NO puede hablar directo con Apps Script (CORS lo bloquea),
// pero el servidor sí. La URL del script llega en el body — la configura el
// admin en Ajustes -> Integraciones.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { scriptUrl, base64, fecha, nombre, mime } = req.body || {};

  if (!scriptUrl || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec/.test(String(scriptUrl))) {
    return res.status(400).json({ error: "La URL del script de Drive no es válida (tiene que terminar en /exec)." });
  }
  if (!base64) return res.status(400).json({ error: "No llegó ninguna imagen." });

  try {
    const r = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64, fecha: fecha || "", nombre: nombre || "", mime: mime || "image/jpeg" }),
      redirect: "follow",
    });

    const texto = await r.text();
    let datos = null;
    try { datos = JSON.parse(texto); } catch (e) { datos = null; }

    if (!datos) {
      // Suele pasar cuando el script no está publicado como "Cualquier persona"
      // (Google devuelve una página de login en vez de JSON).
      return res.status(502).json({
        error: "El script no respondió un resultado válido. Revisá que lo hayas publicado como aplicación web con acceso para 'Cualquier persona'.",
      });
    }
    if (!datos.ok) {
      return res.status(502).json({ error: datos.error || "El script de Drive rechazó el archivo." });
    }
    return res.status(200).json({ ok: true, url: datos.url || "", carpeta: datos.carpeta || "" });
  } catch (e) {
    console.error("subir-factura-drive falló:", e);
    return res.status(502).json({ error: "No se pudo conectar con el script de Drive." });
  }
}
