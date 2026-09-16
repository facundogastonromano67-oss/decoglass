import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Que el link de seguimiento abra también en teléfonos viejos de clientes
  // (iPhone con iOS 12-13, Android con Chrome 70+).
  build: { target: ["es2018", "chrome70", "safari12", "firefox68", "edge79"] },
});
