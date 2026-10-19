// La regla de los últimos 4 dígitos, en UN solo lugar.
// La usan la puerta del seguimiento (/api/puerta) y la factura
// (/api/factura). Si se toca acá, se toca en los dos lados a la vez.
//
// El guión bajo del nombre es a propósito: Vercel no publica como ruta los
// archivos de /api que empiezan con "_".

// Los últimos 4 dígitos del teléfono. Menos de 8 dígitos no es un teléfono
// (puede ser "s/d", un interno, basura): ahí devuelve "" y no se pide nada.
export function ultimos4(tel) {
  const d = String(tel || "").replace(/\D/g, "");
  return d.length >= 8 ? d.slice(-4) : "";
}

// Acepta los 4 dígitos o el número entero, con guiones o sin ellos.
// Si el pedido NO tiene un teléfono usable, devuelve true: no hay contra qué
// comparar, y dejar afuera a un cliente de verdad es peor que el riesgo que
// estamos tapando.
export function coincide(guardado, escrito) {
  const esperado = ultimos4(guardado);
  if (!esperado) return true;
  const d = String(escrito || "").replace(/\D/g, "");
  return d.length >= 4 && d.slice(-4) === esperado;
}
