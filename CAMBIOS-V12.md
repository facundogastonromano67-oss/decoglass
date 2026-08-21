# DECOGLASS V12 — un pedido, un número, varios espejos

## Numeración correcta

- Todos los espejos agregados mediante `Guardar y agregar otro espejo del mismo cliente` conservan el mismo número de orden.
- El segundo, tercer y siguientes espejos ya no consumen números de pedido nuevos.
- Al editar cualquier espejo, el número se vuelve a validar contra el pedido completo para evitar diferencias.

## Corrección de pedidos existentes

- Al iniciar, la app detecta grupos existentes cuyos espejos tienen números distintos.
- Todos los espejos del grupo adoptan automáticamente el primer número generado, que es el menor del grupo.
- La corrección se guarda en Supabase y se mantiene en las demás pantallas mediante la sincronización automática.
- Solo se corrigen registros que ya comparten el mismo `grupoId`; los pedidos independientes no se mezclan.

## Lista de pedidos

- Cada número de orden aparece una sola vez como tarjeta principal.
- La tarjeta cerrada muestra cliente, cantidad de espejos, método de entrega, paso más atrasado y saldo total.
- Al abrirla aparece el total del pedido y una subtarjeta por cada espejo diferente.
- Cada subtarjeta muestra medida, forma, modelo, estado y saldo propios.
- El proceso, las acciones y la edición continúan siendo individuales para cada espejo porque pueden avanzar por producción a ritmos distintos.
- Los filtros y las acciones masivas conservan el pedido completo: si coincide uno de sus espejos, la tarjeta contiene todos.

## Logística

- Cuando una entrega tiene varios espejos con el mismo número, Logística muestra ese número una sola vez.

## Verificación

- Se probó la migración de dos espejos guardados como `#401` y `#399`: ambos quedaron persistidos como pedido `#399`.
- La vista móvil mostró una sola tarjeta `#399`, dos subtarjetas y ningún desbordamiento horizontal.
- Se verificó que `Guardar y agregar otro espejo` abre el siguiente formulario con el mismo número.
- No requiere cambios nuevos en Supabase.
