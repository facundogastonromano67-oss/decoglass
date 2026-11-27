// Un admin rechaza (elimina) una solicitud de cuenta pendiente.
// Verifica con el token del propio admin que quien llama es admin.
//
// Body:   { id }
// Header: Authorization: Bearer <access_token de la sesion del admin>

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo no permitido" });

  const url = (process.env.SUPABASE_URL || "").trim();
  const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !service) return res.status(500).json({ error: "Servidor no configurado." });

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return res.status(401).json({ error: "Falta la sesion." });

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "Falta el id." });

  const sb = createClient(url, service, { auth: { persistSession: false } });

  const { data: quien, error: eAuth } = await sb.auth.getUser(token);
  if (eAuth || !quien?.user) return res.status(401).json({ error: "Sesion invalida." });

  const { data: perfilQuien } = await sb.from("profiles").select("rol").eq("id", quien.user.id).maybeSingle();
  if (perfilQuien?.rol !== "admin") return res.status(403).json({ error: "Solo un administrador puede hacer esto." });

  const { data: objetivo } = await sb.from("profiles").select("aprobado").eq("id", id).maybeSingle();
  if (!objetivo) return res.status(404).json({ error: "La solicitud ya no existe." });
  if (objetivo.aprobado) return res.status(400).json({ error: "Esa cuenta ya esta activa; no se borra desde aca." });

  const { error } = await sb.auth.admin.deleteUser(id); // el perfil cae por cascade
  if (error) return res.status(500).json({ error: "No se pudo rechazar. Proba de nuevo." });

  return res.status(200).json({ ok: true });
}
