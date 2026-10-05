import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El commit con el que se está compilando. Vercel lo pone solo en el build, y
// la función /api/version devuelve exactamente el mismo valor en ese deploy.
// Comparar los dos es comparar "qué versión tengo abierta" contra "qué versión
// está publicada". Fuera de Vercel queda vacío y el aviso usa el método viejo.
const VERSION_DEL_BUILD =
  process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || "";

export default defineConfig({
  plugins: [react()],
  define: { __DG_VERSION__: JSON.stringify(VERSION_DEL_BUILD) },
  // Que el link de seguimiento abra también en teléfonos viejos de clientes
  // (iPhone con iOS 12-13, Android con Chrome 70+).
  build: { target: ["es2018", "chrome70", "safari12", "firefox68", "edge79"] },
});
