# Cambios funcionales · Historial de Fábrica

## Movimiento automático

- La vista predeterminada de Fábrica muestra solamente pedidos en producción.
- Al marcar `Embalado`, el pedido pasa a `Espejo listo` y desaparece inmediatamente de la lista activa.
- El pedido terminado se incorpora automáticamente a `Historial de terminados`.

## Trazabilidad

Cada pedido terminado conserva:

- Fecha, hora y responsable de Cortado.
- Fecha, hora y responsable de Armado.
- Fecha, hora y responsable de Embalado.

Los pedidos existentes sin trazabilidad permanecen visibles y muestran `Sin registro` o `Responsable sin registrar` según corresponda.

## Correcciones

Desde el historial se puede usar `Reabrir producción`. El pedido vuelve a la etapa previa al embalado, reaparece en la lista activa y se limpian las confirmaciones posteriores para evitar inconsistencias.

## Verificación

- Pase automático de En producción a Historial probado.
- Contadores de ambas vistas comprobados.
- Fecha, hora y responsable verificados con datos ficticios.
- Historial revisado en 375 px sin desborde horizontal.
- Compilación de producción completada.
