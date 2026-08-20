// Reemplazo de window.storage (el almacenamiento de los artifacts de Claude)
// usando una tabla simple de clave/valor en Supabase (Postgres).
//
// Mantiene la misma firma que usaba la app dentro de Claude:
//   storage.get(key)    -> { key, value } | null
//   storage.set(key, value) -> { key, value } | null
//   storage.delete(key) -> { key, deleted } | null
//   storage.list(prefix) -> { keys } | null
//
// Toda la app trata los datos como "compartidos" (una sola empresa, un solo
// set de datos), así que no hace falta distinguir shared/personal como en
// los artifacts — se ignora ese segundo parámetro si se llega a pasar.

import { supabase } from "./supabaseClient";

const TABLE = "kv_store";

export const storage = {
  async get(key) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("key, value")
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return { key: data.key, value: data.value };
  },

  async set(key, value) {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select("key, value")
      .maybeSingle();

    if (error) throw error;
    return data ? { key: data.key, value: data.value } : null;
  },

  async delete(key) {
    const { error } = await supabase.from(TABLE).delete().eq("key", key);
    if (error) throw error;
    return { key, deleted: true };
  },

  async list(prefix = "") {
    const query = supabase.from(TABLE).select("key");
    const { data, error } = prefix ? await query.like("key", `${prefix}%`) : await query;
    if (error) throw error;
    return { keys: (data || []).map((r) => r.key) };
  },
};
