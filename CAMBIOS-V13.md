# DECOGLASS V13 — lista de pedidos más compacta

## Resumen del pedido

- El nombre del cliente y el número de orden aparecen una sola vez.
- Se eliminó el bloque repetido `Pedido completo` que aparecía al desplegar la tarjeta.
- El encabezado conserva cliente, cantidad o medida, método de entrega, paso actual y saldo total.

## Detalle de los espejos

- Cada espejo mantiene su propia subtarjeta desplegable.
- La cabecera se simplificó a número de espejo, medida, forma, modelo, estado y saldo individual.
- Las funciones extra dejaron de formar una línea larga junto a la medida y ahora aparecen como etiquetas compactas dentro del detalle.
- Facturación y comisión también se muestran en una franja compacta.
- El estado y el saldo individual no se repiten al abrir el espejo.
- El proceso del pedido y las acciones de edición siguen funcionando por espejo.

## Alcance y verificación

- El cambio afecta únicamente la lista normal de pedidos de Ventas.
- No modifica Fábrica, PostVenta ni Logística.
- Se verificó en una pantalla móvil de 390 × 844 px con un pedido de dos espejos.
- El cliente apareció una sola vez, se mostraron dos subtarjetas y no hubo desbordamiento horizontal ni errores de consola.
- No requiere cambios en Supabase.
