// Recibe una solicitud de cuenta desde el formulario "No tengo cuenta".
// Crea la cuenta en el portero PENDIENTE de aprobacion (aprobado = false).
// Un admin la aprueba desde Ajustes -> Usuarios.
//
// Variables de entorno en Vercel (ya estan para el cron):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Opcional:
//   CODIGO_REGISTRO  -> si se define, hay que enviarlo para poder solicitar

import { createClient } from "@supabase/supabase-js";

const SECTORES = ["ventas", "fabrica", "administracion", "postventa", "logistica", "marketing"];
const ROLES = ["encargado", "operario"];

function limpiarUsuario(n) {
  return (n || "").normalize("NFD").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo no permitido" });

  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return res.status(500).json({ error: "El servidor no esta configurado." });

  const { usuario, clave, rol, sectorId, codigo } = req.body || {};

  const codigoEsperado = (process.env.CODIGO_REGISTRO || "").trim();
  if (codigoEsperado && String(codigo || "").trim() !== codigoEsperado) {
    return res.status(403).json({ error: "El codigo de registro no es correcto. Pediselo a un administrador." });
  }

  const u = limpiarUsuario(usuario);
  if (!u || u.length < 2) return res.status(400).json({ error: "Elegi un nombre de usuario valido (letras y numeros)." });
  if (!clave || String(clave).length < 6) return res.status(400).json({ error: "La clave tiene que tener al menos 6 caracteres." });
  if (!ROLES.includes(rol)) return res.status(400).json({ error: "Rol invalido." });
  if (!SECTORES.includes(sectorId)) return res.status(400).json({ error: "Elegi un sector." });

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const email = `${u}@decoglass.app`;

  const { data: lst } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if ((lst?.users || []).some((x) => (x.email || "").toLowerCase() === email)) {
    return res.status(409).json({ error: "Ya existe un usuario con ese nombre. Proba con otro." });
  }

  const { count } = await sb.from("profiles").select("id", { count: "exact", head: true }).eq("aprobado", false);
  if ((count || 0) >= 25) {
    return res.status(429).json({ error: "Hay demasiadas solicitudes pendientes. Avisa a un administrador." });
  }

  const { data: nuevo, error } = await sb.auth.admin.createUser({
    email,
    password: String(clave),
    email_confirm: true,
    user_metadata: { nombre: (usuario || u).trim() },
  });
  if (error) return res.status(500).json({ error: "No se pudo crear la solicitud. Proba de nuevo." });

  const { error: ep } = await sb.from("profiles").upsert({
    id: nuevo.user.id,
    nombre: (usuario || u).trim(),
    rol,
    sector_id: sectorId,
    aprobado: false,
  });
  if (ep) {
    try { await sb.auth.admin.deleteUser(nuevo.user.id); } catch (e) {}
    return res.status(500).json({ error: "No se pudo completar la solicitud. Proba de nuevo." });
  }

  return res.status(200).json({ ok: true });
}
