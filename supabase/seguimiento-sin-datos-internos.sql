-- ============================================================================
--  DECOGLASS · Lo que el link de seguimiento NO le tiene que mandar al cliente
--  Pegá esto en Supabase → SQL Editor → Run. Se puede correr más de una vez.
--
--  El link del cliente pide su pedido a dos funciones (seguimiento_pedido y
--  seguimiento_grupo) que le devuelven la fila entera MENOS lo interno. Hasta
--  ahora se sacaba la comisión, el vendedor y el fletero. Desde el 27/10/2026
--  el pedido tiene datos nuevos que tampoco son para el cliente:
--    · la aclaración interna y la del taller (ej: «le hicimos precio»);
--    · la foto de la orden en papel;
--    · lo que se lleva el flete y su teléfono;
--    · los pagos con sus comprobantes y las fotos de la entrega;
--    · la rendición del flete (lo que cobró y lo que entregó).
--  La pantalla del cliente no los muestra, pero viajaban igual: alguien que
--  mire los datos de la página los podía leer. Con esto ya no salen.
--
--  «create or replace» deja los permisos como estaban: el link sigue andando.
-- ============================================================================

create or replace function public.seguimiento_pedido(p_id text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select data - 'comision' - 'comisionPagada' - 'comisionExcluida'
              - 'comisionLiquidadaMonto' - 'comisionEmpleadoId' - 'comisionFechaPago'
              - 'vendedor' - 'fletero' - 'fleteLiquidado' - 'fleteLiquidadoMonto'
              - 'aclaracionInterna' - 'aclaracionTaller' - 'ordenPapel'
              - 'fletePago' - 'fleteroTel' - 'pagos' - 'fotosEntrega'
              - 'rendicionFlete' - 'saldoPorTransferencia'
  from pedidos_rows
  where id = p_id
$$;

create or replace function public.seguimiento_grupo(p_grupo text)
returns setof jsonb
language sql
stable
security definer
set search_path = public
as $$
  select data - 'comision' - 'comisionPagada' - 'comisionExcluida'
              - 'comisionLiquidadaMonto' - 'comisionEmpleadoId' - 'comisionFechaPago'
              - 'vendedor' - 'fletero' - 'fleteLiquidado' - 'fleteLiquidadoMonto'
              - 'aclaracionInterna' - 'aclaracionTaller' - 'ordenPapel'
              - 'fletePago' - 'fleteroTel' - 'pagos' - 'fotosEntrega'
              - 'rendicionFlete' - 'saldoPorTransferencia'
  from pedidos_rows
  where data->>'grupoId' = p_grupo
$$;
