-- ============================================================================
--  DECOGLASS · Registro de acciones (quién hizo qué y a qué hora)
--  Pegá esto en Supabase → SQL Editor → Run. Una sola vez.
--
--  Una fila por cada cosa que alguien hace en la app. Antes se guardaba todo
--  junto en un solo bloque (kv_store, clave "auditoria") con las últimas 500,
--  que se reescribía entero en cada acción y que cada celular volvía a bajar.
--  Ahora que se anota TODO, eso se comería el egreso del plan gratis.
--
--  Hasta que esto se corra, la app sigue usando el bloque viejo: no se rompe.
-- ============================================================================

create table if not exists public.registro_acciones (
  id       text primary key,
  fecha    timestamptz not null default now(),
  quien    text not null default '',
  persona  text not null default '',
  sector   text not null default '',
  accion   text not null,
  detalle  text not null default ''
);
create index if not exists registro_acciones_fecha_idx on public.registro_acciones (fecha desc);
create index if not exists registro_acciones_persona_idx on public.registro_acciones (persona, fecha desc);

alter table public.registro_acciones enable row level security;

-- Igual que el chat interno: solo usuarios logueados. El cliente del link de
-- seguimiento no lo puede ver.
drop policy if exists registro_acciones_auth on public.registro_acciones;
create policy registro_acciones_auth on public.registro_acciones
  for all to authenticated using (true) with check (true);

-- Para que lo que hace uno le aparezca al otro en vivo.
alter publication supabase_realtime add table public.registro_acciones;

-- Para comprobar que quedó (tiene que devolver 7 filas):
--   select column_name from information_schema.columns
--   where table_name = 'registro_acciones';
