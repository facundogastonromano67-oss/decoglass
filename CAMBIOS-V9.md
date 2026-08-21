# DECOGLASS V9 — pedidos desplegables y logística operativa

## Confirmación de envío en PostVenta

- Los datos de entrega quedaron dentro de un bloque plegable de 48 px cuando está cerrado.
- Al abrirlo, teléfono y piso/timbre comparten una fila, la dirección ocupa una fila completa y horario/fecha comparten la última fila.
- En celular, el formulario completo mide aproximadamente 240 px y mantiene campos cómodos para tocar.
- Si un pedido pertenece a un grupo de varios espejos, los cambios de teléfono, dirección, piso, horario o fecha se copian a todos los espejos de ese grupo.

## Logística y Distribución

- Los envíos del mismo grupo se muestran en una única tarjeta de entrega.
- También se agrupan pedidos independientes cuando coinciden cliente, teléfono, dirección y fecha de entrega.
- Cada tarjeta muestra en grande: Nombre, Teléfono, Dirección, Piso/Timbre, Espejos y Saldo restante total.
- Con dos o más espejos, aparece un desplegable individual por espejo con su medida, forma, pago del envío y proceso de entrega.
- Con un solo espejo, su proceso se muestra directamente.

## Lista normal de pedidos

- Cada pedido aparece inicialmente como una fila compacta de 75 px.
- La fila cerrada contiene solamente: Nombre, Medida, Método, Paso y Saldo restante.
- Al desplegarla aparecen los datos completos, estados, proceso actual y acceso a la ficha editable.
- En una pantalla móvil de 390 × 844 entran tres pedidos completos sin desbordamiento horizontal.

No requiere cambios nuevos en Supabase.
