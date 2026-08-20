# Cambios funcionales · Pedidos y taller

## Gestión masiva de pedidos

La lista de ventas incorpora un rango de fecha del pedido —desde y hasta— que se combina con los filtros existentes de vista, estado, vendedor y búsqueda.

Las acciones masivas operan únicamente sobre los resultados visibles:

- **Restaurar archivados:** los pedidos entregados vuelven a `Espejo listo`; los cancelados vuelven a `Sin pasar a fábrica`.
- **Borrar resultados:** elimina definitivamente los pedidos que coinciden con los filtros activos, mostrando previamente la cantidad y solicitando confirmación.

Las operaciones se incorporan también al registro de actividad.

## Colas del taller

La lista de fabricación se divide en tres procesos:

- **Simples:** corte, pulido y armado estándar.
- **Esmerilados:** grabado o esmerilado antes del armado.
- **Biselados:** biselado y terminación especial.

Los pedidos anteriores se clasifican automáticamente. Los tipos `Esm.` o con referencia a esmerilado se ubican en Esmerilados; `Biselado` o los pedidos en etapa de biselado se ubican en Biselados; el resto queda en Simples.

Cada cola muestra su cantidad y abre automáticamente el período correspondiente al cambiar de proceso.

## Secuencia de entrega

El botón `Marcar entregado y archivar` ya no aparece durante etapas anteriores.

El flujo queda así:

1. Fábrica marca el espejo como listo.
2. Ventas o PostVenta abre el mensaje de WhatsApp o avisa al cliente por otro medio.
3. Se confirma en la aplicación que el cliente fue avisado.
4. Recién entonces se habilita `Marcar entregado y archivar`.

La misma restricción se aplica al editor del pedido y a la pantalla de Logística para evitar saltarse el orden desde otro sector.

## Verificación

- Compilación de producción completada.
- Pruebas con pedidos Simples, Esmerilados y Biselados.
- Validación del desbloqueo del botón de entrega después del aviso.
- Revisión visual en escritorio y en pantalla móvil de 390 px.
- Sin errores de consola durante la prueba.
