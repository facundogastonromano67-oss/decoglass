# DECOGLASS V10 — saldo del espejo y costo de envío

## Confirmación con el cliente

- En pedidos con envío, el mensaje para WhatsApp ahora separa el saldo del espejo, el costo de envío pendiente y el total final a pagar.
- Ejemplo: saldo del espejo `$ 50.000` + envío `$ 15.000` = total a pagar `$ 65.000`.
- Antes de copiar el mensaje, PostVenta muestra el total que se confirmará con el cliente.
- Si el envío ya fue pagado, se informa como pagado y no vuelve a sumarse al total.
- Si todavía no se cargó el costo del envío, el total se identifica como parcial para evitar comunicar un importe incompleto como definitivo.

## Logística y Distribución

- La tarjeta de entrega muestra por separado el saldo restante de los espejos, el monto del envío y el total a cobrar.
- El flete puede ver claramente si el envío está pendiente, pagado o todavía sin monto cargado.
- El pago del envío se marca una sola vez desde la tarjeta general de la entrega.
- Cuando varios espejos pertenecen a una misma entrega, el costo de envío se cuenta una sola vez aunque esté guardado en cada pedido del grupo.
- Al marcar el envío como pagado, deja de formar parte del total que queda por cobrar.

## Compatibilidad

- No requiere cambios nuevos en Supabase.
- La vista fue verificada en formato móvil de 390 × 844 sin desbordamiento horizontal.
