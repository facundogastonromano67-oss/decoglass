// Lo privado de UN pedido, para el cliente que no tiene login:
//
//   GET /api/factura?pedido=<id>&puerta=1          -> { pide: true|false }
//   GET /api/factura?pedido=<id>&t=1234&puerta=1   -> { pide, ok: true|false }
//   GET /api/factura?grupo=<grupoId>&puerta=1      -> idem, para el link de grupo
//   GET /api/factura?pedido=<id>&t=1234            -> manda la factura
//   GET /api/factura?pedido=<id>&t=1234&n=1        -> la segunda (si la pidió en partes)
//   GET /api/factura?pedido=<id>&t=1234&foto=0     -> la foto del espejo terminado
//
// POR QUÉ LAS DOS COSAS VIVEN EN EL MISMO ARCHIVO: el plan Hobby de Vercel
// admite 12 funciones por deploy y ya estábamos justo en 12. Separar esto en
// un /api/puerta hacía 13 y el deploy fallaba al publicar (el build salía
// bien y moría en "Deploying outputs"). Las dos contestan la misma pregunta
// —¿este que está del otro lado es el dueño del pedido?— así que tampoco
// quedan tan lejos. Si algún día sobran funciones, se puede separar.
//
// La puerta: el link de seguimiento no tiene login. Con tenerlo —reenviado, o
// adivinando un id— se veía el pedido entero, se bajaba la factura y se podía
// reclamar por un espejo ajeno. Ahora se piden los últimos 4 dígitos del
// teléfono del cliente, que es el mismo al que le mandamos el link, y la
// comparación se hace ACÁ: si se hiciera en el navegador, el pedido ya habría
// viajado hasta la pantalla y alcanzaría con abrirla para leerlo.
//
// La factura: el bucket "facturas" es privado (antes era público y se podían
// listar y bajar TODAS las facturas de la empresa con solo tener el link del
// bundle). El link firmado se arma acá, del lado del servidor, y solo para el
// pedido que viene en la URL.
//
// Variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { ultimos4, coincide } from "./_telefono.js";

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

// El pedido, o el primero del grupo (es el mismo cliente y el mismo teléfono).
async function buscarPedido(supabase, { pedido, grupo }) {
  if (pedido) {
    const { data, error } = await supabase
      .from("pedidos_rows").select("data").eq("id", pedido).maybeSingle();
    if (error) throw new Error("consulta");
    return data ? data.data : null;
  }
  const { data, error } = await supabase
    .from("pedidos_rows").select("data").eq("data->>grupoId", grupo).limit(1);
  if (error) throw new Error("consulta");
  const fila = (data || [])[0];
  return fila ? fila.data : null;
}

export default async function handler(req, res) {
  // Nunca cachear: el link vence y cada pedido tiene el suyo.
  res.setHeader("Cache-Control", "no-store");

  const q = req.query || {};
  const id = String(q.pedido || "").trim();
  const grupo = String(q.grupo || "").trim();
  const escrito = String(q.t || "").trim();
  const esPuerta = String(q.puerta || "") === "1";
  if (!id && !grupo) return res.status(400).json({ error: "Falta el pedido." });

  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return res.status(500).json({ error: "Falta configurar el servidor." });

  try {
    const supabase = createClient(url, clave, { auth: { persistSession: false } });
    const pedido = await buscarPedido(supabase, { pedido: id, grupo });

    if (esPuerta) {
      // Un pedido que NO EXISTE contesta igual que uno sin teléfono: así el
      // link tampoco sirve para ir probando ids a ver cuáles existen.
      if (!pedido) return res.status(200).json({ pide: false, ok: true });
      const esperado = ultimos4(pedido.celular);
      if (!esperado) return res.status(200).json({ pide: false, ok: true });
      if (!escrito) return res.status(200).json({ pide: true });
      return res.status(200).json({ pide: true, ok: coincide(pedido.celular, escrito) });
    }

    if (!pedido) return res.status(404).json({ error: "No encontramos ese pedido." });

    // Se vuelve a verificar acá aunque la pantalla ya los haya pedido: si el
    // control viviera solo en el navegador, alcanzaría con escribir la URL de
    // la factura a mano para saltearlo. Un pedido sin teléfono cargado no
    // puede pedir nada (coincide() da true) y queda como estaba.
    if (!coincide(pedido.celular, escrito)) {
      return res.status(403).json({ error: "Para ver la factura hacen falta los últimos 4 dígitos de tu teléfono." });
    }

    // La foto del espejo terminado (27/10/2026). Va por acá porque el bucket es
    // privado y el cliente no tiene login: el link firmado se arma en el
    // servidor, con el mismo control de los 4 dígitos que la factura.
    if (q.foto !== undefined) {
      const fotos = Array.isArray(pedido.fotosTerminado) ? pedido.fotosTerminado.filter(Boolean) : [];
      const k = Number.parseInt(String(q.foto), 10);
      const rutaFoto = rutaDelArchivo(fotos[Number.isInteger(k) && k >= 0 ? k : 0]);
      if (!rutaFoto) return res.status(404).json({ error: "Todavía no hay foto de ese espejo." });
      const { data: firmaFoto, error: errorFoto } = await supabase.storage.from(BUCKET).createSignedUrl(rutaFoto, VENCE_EN);
      if (errorFoto || !firmaFoto?.signedUrl) return res.status(404).json({ error: "No se encontró la foto." });
      return res.redirect(302, firmaFoto.signedUrl);
    }

    // Un pedido puede tener varias facturas (el cliente la pidió en partes):
    // la primera en facturaUrl y las demás en facturasExtra. n elige cuál;
    // sin n, la primera, como siempre.
    const extra = Array.isArray(pedido.facturasExtra) ? pedido.facturasExtra : [];
    const facturas = [pedido.facturaUrl, ...extra].filter(Boolean);
    const n = Number.parseInt(String(q.n ?? "0"), 10);
    const ruta = rutaDelArchivo(facturas[Number.isInteger(n) && n >= 0 ? n : 0]);
    if (!ruta) return res.status(404).json({ error: "Ese pedido todavía no tiene factura cargada." });

    const { data: firma, error: errorFirma } = await supabase
      .storage.from(BUCKET).createSignedUrl(ruta, VENCE_EN);
    if (errorFirma || !firma?.signedUrl) return res.status(404).json({ error: "No se encontró el archivo." });

    return res.redirect(302, firma.signedUrl);
  } catch (e) {
    return res.status(500).json({ error: "No se pudo abrir la factura." });
  }
}
