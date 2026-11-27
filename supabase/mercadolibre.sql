-- ============================================================================
--  DECOGLASS · Conexión con Mercado Libre (26/11/2026)
--  Pegá esto en Supabase → SQL Editor → Run. Se puede correr más de una vez.
--
--  Guarda la llave que da Mercado Libre al autorizar la cuenta. Es como una
--  contraseña: la tabla queda con RLS prendido y SIN ningún permiso, así que
--  la app (ni nadie con la clave pública) la puede leer. Solo la usa el
--  servidor (api/ml/[accion].js) con la clave de servicio.
--
--  Los chats y las ventas NO se guardan acá: se le piden a Mercado Libre cada
--  vez, para no gastar del cupo gratis de Supabase.
-- ============================================================================

create table if not exists public.ml_cuenta (
  id            int primary key default 1 check (id = 1),
  seller_id     bigint,
  nickname      text,
  access_token  text,
  refresh_token text,
  expires_at    timestamptz,
  oauth_state   text,
  oauth_vence   timestamptz,
  avisados      jsonb not null default '[]'::jsonb,
  updated_at    timestamptz not null default now()
);

-- Desde cuándo está conectada: las ventas de antes no se arman solas (ya se
-- cargaron a mano).
alter table public.ml_cuenta add column if not exists conectado_at timestamptz;

alter table public.ml_cuenta enable row level security;
-- Sin policies a propósito: nadie desde la app la puede leer ni escribir.
revoke all on public.ml_cuenta from anon, authenticated;
