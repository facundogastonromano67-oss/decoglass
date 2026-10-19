// La puerta del link de seguimiento.
//
//   GET /api/puerta?pedido=<id>              -> { pide: true|false }
//   GET /api/puerta?pedido=<id>&t=1234       -> { ok: true|false }
//   (lo mismo con ?grupo=<grupoId>)
//
// Por qué existe: el link de seguimiento no tiene login. Cualquiera que lo
// tuviera —reenviado, o adivinando un id— veía el pedido entero, se bajaba la
// factura y podía reclamar por un espejo que no era suyo.
//
// Se le piden los ÚLTIMOS 4 DÍGITOS del teléfono del cliente, que es el mismo
// al que le mandamos el link. La comparación se hace ACÁ, no en el navegador:
// si se hiciera en el navegador, el pedido ya habría viajado hasta la pantalla
// y alcanzaría con abrir las herramientas del navegador para leerlo.
//
// Un pedido SIN teléfono cargado no pide nada (`pide: false`). Es a propósito:
// no tenemos contra qué comparar, y dejar afuera a un cliente de verdad es
// peor que el riesgo que estamos tapando. Esos quedan como estaban hasta que
// se les cargue el teléfono.
//
// Variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";
import { ultimos4, coincide } from "./_telefono.js";

// El teléfono del pedido, o del primer espejo del grupo (es el mismo cliente).
async function telefonoDe(supabase, { pedido, grupo }) {
  if (pedido) {
    const { data, error } = await supabase
      .from("pedidos_rows").select("data").eq("id", pedido).maybeSingle();
    if (error) throw new Error("consulta");
    return data ? { existe: true, tel: data.data && data.data.celular } : { existe: false };
  }
  const { data, error } = await supabase
    .from("pedidos_rows").select("data").eq("data->>grupoId", grupo).limit(1);
  if (error) throw new Error("consulta");
  const fila = (data || [])[0];
  return fila ? { existe: true, tel: fila.data && fila.data.celular } : { existe: false };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const pedido = String((req.query && req.query.pedido) || "").trim();
  const grupo = String((req.query && req.query.grupo) || "").trim();
  const escrito = String((req.query && req.query.t) || "").trim();
  if (!pedido && !grupo) return res.status(400).json({ error: "Falta el pedido." });

  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return res.status(500).json({ error: "Falta configurar el servidor." });

  try {
    const supabase = createClient(url, clave, { auth: { persistSession: false } });
    const { existe, tel } = await telefonoDe(supabase, { pedido, grupo });

    // Un pedido que no existe contesta igual que uno sin teléfono: así el link
    // no sirve para andar probando ids a ver cuáles existen.
    if (!existe) return res.status(200).json({ pide: false, ok: true });

    const esperado = ultimos4(tel);
    if (!esperado) return res.status(200).json({ pide: false, ok: true });
    if (!escrito) return res.status(200).json({ pide: true });
    return res.status(200).json({ pide: true, ok: coincide(tel, escrito) });
  } catch (e) {
    return res.status(500).json({ error: "No se pudo verificar." });
  }
}
