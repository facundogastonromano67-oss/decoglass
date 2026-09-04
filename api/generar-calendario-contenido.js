// Función serverless: recibe una lista de fechas del mes y le pide a la API
// de OpenAI que arme una idea de contenido para cada una (tipo, texto y una
// descripción de imagen), pensadas para Decoglass. La clave de OpenAI vive
// solo en el servidor (variable de entorno), nunca llega al navegador.
//
// Variable de entorno necesaria en Vercel: OPENAI_API_KEY (la misma que ya
// usa generar-imagen-marketing.js)

const TIPOS_VALIDOS = ["Historia", "Post", "Reel/Video", "Carrusel"];
const MAX_FECHAS = 40;

const PILARES = [
  "Producto — mostrar un modelo o línea de espejos (con luz LED, de baño, decorativos, con marco)",
  "Detrás de escena — el proceso de fabricación: corte, grabado, armado en el taller",
  "Antes y después — el espejo ya instalado en un ambiente real (baño, living, gimnasio, peluquería)",
  "Testimonio o reseña de un cliente",
  "Tip de decoración — cómo elegir tamaño, forma o ubicación de un espejo",
  "Pregunta o interacción con la audiencia (encuesta, \"cuál te gusta más\")",
  "Promoción u oferta",
  "Dato curioso sobre espejos con luz LED (luz cálida vs. fría, antivaho, sensores táctiles)",
  "Institucional — medida a pedido, atención personalizada, la historia de la empresa",
];

function fechaValida(f) {
  return typeof f === "string" && /^\d{4}-\d{2}-\d{2}$/.test(f);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    return res.status(500).json({ error: "Falta configurar OPENAI_API_KEY en Vercel." });
  }

  const { fechas, notas } = req.body || {};
  if (!Array.isArray(fechas) || fechas.length === 0 || !fechas.every(fechaValida)) {
    return res.status(400).json({ error: "Faltan las fechas del mes a generar." });
  }
  if (fechas.length > MAX_FECHAS) {
    return res.status(400).json({ error: `Son demasiadas fechas de una vez (máximo ${MAX_FECHAS}).` });
  }

  const fechasOrdenadas = [...fechas].sort();
  const prompt = `Sos el/la community manager de Decoglass, una empresa argentina que fabrica espejos a medida: espejos con luz LED (antivaho, luz cálida/fría, táctiles), espejos de baño, espejos decorativos y con marco. Venden a particulares que remodelan su casa y a comercios (peluquerías, gimnasios, salones de belleza).

Armá una idea de contenido para redes (Instagram) para cada una de estas fechas: ${fechasOrdenadas.join(", ")}.

Pilares de contenido para variar (no uses siempre el mismo, distribuilos con criterio a lo largo de las fechas):
${PILARES.map((p, i) => `${i + 1}. ${p}`).join("\n")}

${notas && String(notas).trim() ? `Contexto adicional que te da el equipo: ${String(notas).trim()}\n` : ""}
Para cada fecha devolvé:
- "fecha": la fecha tal cual te la pasé (YYYY-MM-DD)
- "tipo": uno de estos, tal cual: ${TIPOS_VALIDOS.join(", ")}
- "texto": el texto/caption en español rioplatense, cercano y profesional, de 2 a 5 líneas, sin relleno genérico — que se note que es de una fábrica de espejos real. Sin hashtags.
- "promptImagen": una descripción en español de la imagen o escena para ilustrar el posteo (para generarla con IA), concreta y visual — qué espejo, qué ambiente, qué luz.

Devolvé SOLO un JSON con esta forma exacta, sin texto extra:
{"ideas": [{"fecha": "YYYY-MM-DD", "tipo": "...", "texto": "...", "promptImagen": "..."}]}`;

  try {
    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.9,
      }),
    });

    const datos = await respuesta.json();
    if (!respuesta.ok) {
      const mensaje = datos?.error?.message || "OpenAI no pudo generar las ideas.";
      return res.status(respuesta.status).json({ error: mensaje });
    }

    const contenido = datos?.choices?.[0]?.message?.content || "{}";
    let parseado;
    try {
      parseado = JSON.parse(contenido);
    } catch (e) {
      return res.status(500).json({ error: "OpenAI devolvió una respuesta que no se pudo leer. Probá de nuevo." });
    }

    const crudas = Array.isArray(parseado?.ideas) ? parseado.ideas : [];
    const porFecha = new Map(crudas.filter((it) => fechaValida(it?.fecha)).map((it) => [it.fecha, it]));

    const ideas = fechasOrdenadas.map((fecha) => {
      const it = porFecha.get(fecha) || {};
      return {
        fecha,
        tipo: TIPOS_VALIDOS.includes(it.tipo) ? it.tipo : "Post",
        texto: typeof it.texto === "string" ? it.texto.trim() : "",
        promptImagen: typeof it.promptImagen === "string" ? it.promptImagen.trim() : "",
      };
    }).filter((it) => it.texto);

    if (ideas.length === 0) return res.status(500).json({ error: "OpenAI no devolvió ninguna idea utilizable." });

    return res.status(200).json({ ok: true, ideas });
  } catch (e) {
    console.error("generar-calendario-contenido falló:", e);
    return res.status(500).json({ error: "No se pudo conectar con OpenAI. Probá de nuevo." });
  }
}
