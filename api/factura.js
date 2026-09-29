// Entrega la factura de UN pedido al cliente, sin que tenga que iniciar sesión.
//
//   GET /api/factura?pedido=<id del pedido>
//
// Por qué existe: el bucket "facturas" es privado (antes era público y se
// podían listar y bajar TODAS las facturas de la empresa con solo tener el
// link del bundle). Como el portal de seguimiento no tiene login, el link
// firmado se arma acá, del lado del servidor, y solo para el pedido que
// viene en la URL. El cliente nunca ve la clave de servicio ni puede pedir
// la factura de otro.
//
// Variables de entorno (las mismas que el resto de /api):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";

const BUCKET = "facturas";
const VENCE_EN = 300; // 5 minutos: alcanza para abrirla o bajarla

// El valor guardado puede ser una ruta (lo nuevo) o una URL pública entera
// (los pedidos viejos). En los dos casos queremos la ruta.
function rutaDelArchivo(valor) {
  const texto = String(valor || "").trim();
  if (!texto) return "";
  const publico = `/storage/v1/object/public/${BUCKET}/`;
  const i = texto.indexOf(publico);
  if (i !== -1) return decodeURIComponent(texto.slice(i + publico.length));
  const firmado = `/storage/v1/object/sign/${BUCKET}/`;
  const j = texto.indexOf(firmado);
  if (j !== -1) return decodeURIComponent(texto.slice(j + firmado.length).split("?")[0]);
  return texto.replace(/^\/+/, "");
}

export default async function handler(req, res) {
  // Nunca cachear: el link vence y cada pedido tiene el suyo.
  res.setHeader("Cache-Control", "no-store");

  const id = String((req.query && req.query.pedido) || "").trim();
  if (!id) return res.status(400).json({ error: "Falta el pedido." });

  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return res.status(500).json({ error: "Falta configurar el servidor." });

  try {
    const supabase = createClient(url, clave, { auth: { persistSession: false } });

    // Se busca el pedido por su id y se saca SU factura. No se acepta una
    // ruta que venga por la URL: si no, cualquiera pediría cualquier archivo.
    const { data, error } = await supabase
      .from("pedidos_rows").select("data").eq("id", id).maybeSingle();
    if (error) return res.status(500).json({ error: "No se pudo buscar el pedido." });
    if (!data) return res.status(404).json({ error: "No encontramos ese pedido." });

    const ruta = rutaDelArchivo(data.data && data.data.facturaUrl);
    if (!ruta) return res.status(404).json({ error: "Ese pedido todavía no tiene factura cargada." });

    const { data: firma, error: errorFirma } = await supabase
      .storage.from(BUCKET).createSignedUrl(ruta, VENCE_EN);
    if (errorFirma || !firma?.signedUrl) return res.status(404).json({ error: "No se encontró el archivo." });

    return res.redirect(302, firma.signedUrl);
  } catch (e) {
    return res.status(500).json({ error: "No se pudo abrir la factura." });
  }
}
