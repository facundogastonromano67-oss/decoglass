// Función serverless: recibe un prompt de texto (y opcionalmente el link a
// una foto de referencia de la biblioteca) y genera una imagen con la API de
// OpenAI. La clave de OpenAI vive solo en el servidor (variable de entorno),
// nunca llega al navegador de nadie.
//
// Variable de entorno necesaria en Vercel: OPENAI_API_KEY

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    return res.status(500).json({ error: "Falta configurar OPENAI_API_KEY en Vercel." });
  }

  const { prompt, tamano } = req.body || {};
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Falta describir qué imagen generar." });
  }

  try {
    const respuesta = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt.trim(),
        size: tamano || "1024x1024",
        n: 1,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      const mensaje = datos?.error?.message || "OpenAI no pudo generar la imagen.";
      return res.status(respuesta.status).json({ error: mensaje });
    }

    const base64 = datos?.data?.[0]?.b64_json;
    if (!base64) return res.status(500).json({ error: "OpenAI no devolvió ninguna imagen." });

    return res.status(200).json({ ok: true, base64 });
  } catch (e) {
    console.error("generar-imagen-marketing falló:", e);
    return res.status(500).json({ error: "No se pudo conectar con OpenAI. Probá de nuevo." });
  }
}
