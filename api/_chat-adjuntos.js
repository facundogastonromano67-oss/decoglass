// Fotos y audios del chat del seguimiento (06/11/2026). Lo usan:
//   · api/factura.js  → da el permiso para subir (después de los 4 dígitos) y
//                        arma el link para verlos.
//   · api/check-alerts.js → la revisión diaria borra los archivos de las
//                        conversaciones que ya se cerraron.
// Empieza con «_» para que Vercel no lo cuente como una función más (el plan
// admite 12 y ya estamos en 12).

export const BUCKET_CHAT = "chat-adjuntos";
// Más que esto en una conversación ya no es una consulta: que escriban por WhatsApp.
export const MAX_ADJUNTOS = 30;
// Lo único que se acepta, y con qué terminación se guarda.
export const EXTENSION_CHAT = {
  imagen: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" },
  audio: { "audio/webm": "webm", "audio/ogg": "ogg", "audio/mp4": "m4a", "audio/x-m4a": "m4a", "audio/mpeg": "mp3", "audio/aac": "aac" },
};
const DIA = 86400000;

// La carpeta de una conversación. La misma regla está en el SQL
// (seguimiento_escribir_adjunto): si se cambia acá, se cambia allá.
export function carpetaDeHilo(hilo) {
  return `chat/${String(hilo || "").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export function extensionDe(tipo, mime) {
  const limpio = String(mime || "").split(";")[0].trim().toLowerCase();
  return (EXTENSION_CHAT[tipo] || {})[limpio] || "";
}

// La conversación se cierra 7 días después de entregado (igual que la
// pantalla del cliente, chatClienteCerrado en App.jsx).
export function chatCerrado(pedido, ahora = Date.now()) {
  if (!pedido || pedido.estado !== "Entregado" || !pedido.entregadoFecha) return false;
  const t = new Date(pedido.entregadoFecha).getTime();
  return !Number.isNaN(t) && ahora - t > 7 * DIA;
}

// ¿Ya se pueden borrar los archivos de esta conversación?
//   · Todos sus espejos (sin contar los cancelados) entregados hace más de 7 días.
//   · O el pedido entero se canceló.
//   · O el pedido ya no existe y el archivo tiene más de 30 días.
export function hiloCerradoParaArchivos(hilo, pedidos, ahora = Date.now(), creado = "") {
  const id = String(hilo || "");
  const lista = (pedidos || []).filter(Boolean);
  const suyos = id.startsWith("grupo:")
    ? lista.filter((p) => p.grupoId === id.slice(6))
    : lista.filter((p) => p.id === id);
  if (!suyos.length) {
    const t = new Date(creado).getTime();
    return !Number.isNaN(t) && ahora - t > 30 * DIA;
  }
  const vivos = suyos.filter((p) => p.estado !== "Cancelado");
  if (!vivos.length) return true;
  return vivos.every((p) => chatCerrado(p, ahora));
}

// Borra los archivos de las conversaciones cerradas y marca sus mensajes
// («borrado»), así la pantalla muestra que ya no está en vez de un error.
export async function limpiarAdjuntosChat(supabase, pedidos, ahora = Date.now()) {
  const { data: mensajes, error } = await supabase
    .from("chat_mensajes").select("id, hilo_id, adjunto, created_at")
    .not("adjunto", "is", null).limit(2000);
  if (error) throw error;
  const aBorrar = (mensajes || []).filter((m) => m.adjunto && m.adjunto.path && !m.adjunto.borrado
    && hiloCerradoParaArchivos(m.hilo_id, pedidos, ahora, m.created_at));
  if (!aBorrar.length) return 0;
  for (let i = 0; i < aBorrar.length; i += 100) {
    const tanda = aBorrar.slice(i, i + 100);
    const { error: e1 } = await supabase.storage.from(BUCKET_CHAT).remove(tanda.map((m) => m.adjunto.path));
    if (e1) throw e1;
    const fecha = new Date(ahora).toISOString();
    for (const m of tanda) {
      await supabase.from("chat_mensajes").update({ adjunto: { ...m.adjunto, borrado: true, borradoFecha: fecha } }).eq("id", m.id);
    }
  }
  return aBorrar.length;
}
