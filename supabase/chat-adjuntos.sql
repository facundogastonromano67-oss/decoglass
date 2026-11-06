-- ============================================================================
--  DECOGLASS · Fotos y audios en el chat del seguimiento (06/11/2026)
--  Pegá TODO esto en Supabase → SQL Editor → Run. Se puede correr más de una vez.
--
--  Qué hace:
--    1. Crea el lugar donde se guardan las fotos y los audios del chat
--       («chat-adjuntos»): PRIVADO, con un máximo de 3 MB por archivo y solo
--       fotos y audios (nada de videos ni otra cosa).
--    2. Le agrega a cada mensaje un lugar para el archivo («adjunto»).
--    3. Una función nueva para que el cliente mande una foto o un audio. El
--       cliente no tiene login: no puede tocar las tablas ni subir archivos
--       por su cuenta. El permiso para subir lo da el servidor, solo después
--       de comprobar los últimos 4 números del teléfono del pedido.
--    4. El equipo (con login) puede ver los archivos.
--
--  Los archivos se borran solos cuando la conversación se cierra (7 días
--  después de entregado el pedido). Eso lo hace la revisión diaria del
--  servidor; los mensajes de texto quedan.
-- ============================================================================

-- 1) El lugar de los archivos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-adjuntos', 'chat-adjuntos', false, 3145728,
  array['image/jpeg', 'image/png', 'image/webp',
        'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/aac', 'audio/x-m4a']
)
on conflict (id) do update set
  public             = false,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2) El archivo de cada mensaje: { path, tipo: 'imagen'|'audio', segundos, bytes }
alter table public.chat_mensajes add column if not exists adjunto jsonb;

-- 3) El cliente manda una foto o un audio que ya subió con el permiso del servidor.
--    Comprueba que el archivo exista y que esté en la carpeta de SU conversación.
create or replace function public.seguimiento_escribir_adjunto(
  p_hilo text, p_adjunto jsonb, p_meta jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public, storage
as $$
declare
  ruta    text := coalesce(p_adjunto->>'path', '');
  tipo    text := coalesce(p_adjunto->>'tipo', '');
  carpeta text := 'chat/' || regexp_replace(coalesce(p_hilo, ''), '[^a-zA-Z0-9_-]', '_', 'g') || '/';
  quien   text := coalesce(nullif(p_meta->>'clienteNombre', ''), 'Cliente');
  aviso   text;
  tamano  bigint;
  segs    numeric := 0;
begin
  if p_hilo is null or tipo not in ('imagen', 'audio') then return; end if;
  if left(ruta, length(carpeta)) <> carpeta then
    raise exception 'El archivo no es de esta conversación';
  end if;
  select (o.metadata->>'size')::bigint into tamano
    from storage.objects o
   where o.bucket_id = 'chat-adjuntos' and o.name = ruta;
  if not found then
    raise exception 'El archivo no se terminó de subir';
  end if;
  begin segs := least(greatest(coalesce((p_adjunto->>'segundos')::numeric, 0), 0), 600);
  exception when others then segs := 0; end;

  aviso := case tipo when 'imagen' then '📷 Foto' else '🎤 Audio' end;

  insert into chat_hilos (id, pedido_id, grupo_id, orden, cliente_nombre, entregado_at,
                          ultimo_mensaje, ultimo_mensaje_at, ultimo_autor_tipo)
  values (p_hilo,
          nullif(p_meta->>'pedidoId', ''),
          nullif(p_meta->>'grupoId', ''),
          nullif(p_meta->>'orden', ''),
          nullif(p_meta->>'clienteNombre', ''),
          nullif(p_meta->>'entregadoAt', '')::timestamptz,
          aviso, now(), 'cliente')
  on conflict (id) do update set
    pedido_id       = coalesce(chat_hilos.pedido_id,      excluded.pedido_id),
    grupo_id        = coalesce(chat_hilos.grupo_id,       excluded.grupo_id),
    orden           = coalesce(chat_hilos.orden,          excluded.orden),
    cliente_nombre  = coalesce(chat_hilos.cliente_nombre, excluded.cliente_nombre),
    entregado_at    = coalesce(chat_hilos.entregado_at,   excluded.entregado_at),
    ultimo_mensaje    = excluded.ultimo_mensaje,
    ultimo_mensaje_at = excluded.ultimo_mensaje_at,
    ultimo_autor_tipo = 'cliente';

  -- El mismo archivo no se manda dos veces.
  if exists (select 1 from chat_mensajes where hilo_id = p_hilo and adjunto->>'path' = ruta) then return; end if;

  insert into chat_mensajes (hilo_id, autor_tipo, autor_nombre, cuerpo, adjunto)
  values (p_hilo, 'cliente', quien, aviso,
          jsonb_build_object('path', ruta, 'tipo', tipo, 'segundos', segs, 'bytes', tamano));
end;
$$;

revoke all on function public.seguimiento_escribir_adjunto(text, jsonb, jsonb) from public;
grant execute on function public.seguimiento_escribir_adjunto(text, jsonb, jsonb) to anon, authenticated;

-- 4) El equipo (con login) ve los archivos. El cliente NO tiene permisos
--    sobre el lugar de archivos: los ve con un link que arma el servidor.
drop policy if exists "equipo ve adjuntos del chat" on storage.objects;
create policy "equipo ve adjuntos del chat" on storage.objects
  for select to authenticated using (bucket_id = 'chat-adjuntos');

-- 5) Comprobación: tiene que aparecer una fila con chat-adjuntos, false y 3145728.
select id, public, file_size_limit from storage.buckets where id = 'chat-adjuntos';
