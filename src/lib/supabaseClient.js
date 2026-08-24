import { createClient } from "@supabase/supabase-js";

// .trim() por las dudas: si alguna de estas dos variables se cargó con un
// espacio de más al final (algo muy fácil que pase al copiar y pegar en
// Vercel), rompe la conexión en tiempo real de forma silenciosa y rara.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env y completá los datos de tu proyecto de Supabase."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
