-- Ejecutar esto en Supabase: Panel del proyecto -> SQL Editor -> New query -> pegar y "Run"

create table if not exists kv_store (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Habilitamos Row Level Security (obligatorio en Supabase) y agregamos
-- una política abierta: cualquiera que tenga la URL y la clave "anon" de
-- tu proyecto puede leer y escribir esta tabla. Es lo más simple para que
-- la app funcione sin armar un sistema de usuarios de Supabase aparte;
-- la protección de "quién puede hacer qué" la sigue manejando la app
-- (claves de admin / sector) como hasta ahora.
--
-- OJO: esto significa que la base de datos no es privada a nivel de
-- Postgres, solo a nivel de la app. Si más adelante querés protegerla
-- mejor, se puede migrar a Supabase Auth + políticas por usuario.

alter table kv_store enable row level security;

create policy "Permitir todo con la clave anon"
  on kv_store
  for all
  using (true)
  with check (true);
