// Las cuentas del equipo, en UNA sola función (27/11/2026): el plan gratis de
// Vercel deja hasta 12 y hacía falta lugar para Mercado Libre (api/ml).
//   /api/cuentas/solicitar  → el formulario «No tengo cuenta»
//   /api/cuentas/rechazar   → un administrador rechaza una solicitud
// El código de cada una no cambió: está en api/_solicitar-cuenta.js y
// api/_rechazar-cuenta.js (el «_» hace que Vercel no las cuente como función).
// Las direcciones viejas (/api/solicitar-cuenta y /api/rechazar-cuenta) siguen
// andando por las redirecciones de vercel.json.

import solicitar from "../_solicitar-cuenta.js";
import rechazar from "../_rechazar-cuenta.js";

export default function handler(req, res) {
  const accion = String(req.query?.accion || "").toLowerCase();
  if (accion === "solicitar") return solicitar(req, res);
  if (accion === "rechazar") return rechazar(req, res);
  res.setHeader("Cache-Control", "no-store");
  return res.status(404).json({ error: "Acción desconocida." });
}
