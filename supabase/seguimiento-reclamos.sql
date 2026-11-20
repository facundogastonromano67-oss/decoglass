-- ============================================================================
--  DECOGLASS · El reclamo en el link del cliente (20/11/2026)
--  Pegá esto en Supabase → SQL Editor → Run. Se puede correr más de una vez.
--
--  El cliente sigue su reclamo con un link (/seguimiento/reclamo/<id>) y
--  también lo ve dentro del seguimiento de su pedido. La tabla de reclamos
--  está cerrada: el link pregunta por estas funciones, que devuelven SOLO lo
--  que el cliente puede ver (el motivo, la solución, los pasos y sus fechas).
--  No salen el teléfono, las notas internas, el origen del problema ni el
--  costo del reclamo.
-- ============================================================================

create or replace function public.reclamo_publico(d jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'id', d->>'id',
    'fecha', d->>'fecha',
    'cliente', d->>'cliente',
    'motivo', d->>'motivo',
    'tipo', d->>'tipo',
    'solucionId', d->>'solucionId',
    'comoLlega', d->>'comoLlega',
    'paso', d->>'paso',
    'pasosFechas', d->'pasosFechas',
    'fechaColecta', d->>'fechaColecta',
    'fechaEntrega', d->>'fechaEntrega',
    'fechaVisita', d->>'fechaVisita',
    'descuento', d->'descuento',
    'finalizado', d->'finalizado',
    'finalizadoFecha', d->>'finalizadoFecha',
    'estado', d->>'estado',
    'espejoTexto', d->>'espejoTexto',
    'ordenOrigen', d->'ordenOrigen',
    'pedidoOrigenId', d->>'pedidoOrigenId',
    'desdeLink', d->'desdeLink',
    'detalleCliente', d->>'detalleCliente'
  ))
$$;

-- Un reclamo, por su link.
create or replace function public.seguimiento_reclamo(p_id text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select public.reclamo_publico(data) from reclamos_rows where id = p_id
$$;

-- Los reclamos de un pedido (o de los espejos de un pedido), para mostrarlos
-- dentro de su seguimiento.
create or replace function public.seguimiento_reclamos_de(p_ids text[])
returns setof jsonb
language sql
stable
security definer
set search_path = public
as $$
  select public.reclamo_publico(data)
  from reclamos_rows
  where data->>'pedidoOrigenId' = any(p_ids)
  order by data->>'fecha' desc
  limit 20
$$;

grant execute on function public.reclamo_publico(jsonb) to anon, authenticated;
grant execute on function public.seguimiento_reclamo(text) to anon, authenticated;
grant execute on function public.seguimiento_reclamos_de(text[]) to anon, authenticated;
