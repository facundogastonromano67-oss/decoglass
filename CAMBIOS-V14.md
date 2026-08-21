# DECOGLASS V14 — comisiones integradas a Sueldos

## Comisiones automáticas

- Al presionar `Liquidar` en Comisiones, cada pedido guarda el empleado asociado, el monto liquidado y la fecha.
- La planilla de Sueldos toma automáticamente esas comisiones en el mes de la liquidación.
- Para Oficina/Ventas, el total se calcula como `pago por horas + comisiones liquidadas + ajuste manual`.
- La columna de comisiones muestra el monto y la cantidad de pedidos incluidos.
- Al revertir una comisión como no pagada, deja de integrar el total salarial.
- Las liquidaciones anteriores siguen siendo compatibles mediante la coincidencia del nombre del vendedor.

## Edición de valores

- El botón principal ahora se llama `Configurar sueldos y valores`.
- Cada empleado tiene un lápiz visible directamente en su fila.
- Oficina/Ventas permite editar valor hora y porcentaje de comisión.
- Taller permite editar sueldo de recibo, complemento fijo, valor de hora extra y plus semanal.
- Se agregó un ajuste manual mensual en Oficina/Ventas para correcciones excepcionales sin modificar pedidos.

## Planilla más clara

- La carga semanal de Oficina/Ventas queda enfocada en las horas trabajadas.
- Las ventas ya no necesitan cargarse manualmente para calcular la comisión.
- Se incorporó un aviso que explica que las comisiones provienen de la sección Comisiones.
- Los datos manuales antiguos se conservan como compatibilidad cuando todavía no existe una comisión automática para ese período.

## Verificación

- Caso probado: 8 horas × $5.000 = $40.000, más una comisión liquidada de $18.000, total $58.000.
- Con un ajuste de $2.000, el total pasó a $60.000.
- Al aumentar el valor hora a $6.000, el total se actualizó a $68.000.
- Se verificó la tabla en escritorio y móvil sin desbordamiento de página ni errores de consola.
- No requiere cambios en Supabase.
