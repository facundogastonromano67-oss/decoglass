# Cambios funcionales · Producción compacta

## Checklist de Fábrica

Cada pedido tiene tres controles secuenciales:

1. Cortado.
2. Armado.
3. Embalado.

El botón principal muestra únicamente el próximo trabajo. Al marcar `Embalado`, el estado cambia automáticamente a `Espejo listo` y se habilita el flujo de confirmación con el cliente.

Los pedidos terminados pueden reabrirse desde Fábrica; vuelven al último control antes del embalado y se limpian las confirmaciones posteriores para evitar inconsistencias.

## Estados

- `Pasado a fábrica` ya no aparece en filtros ni formularios.
- Los pedidos antiguos con ese estado se muestran y guardan como `Verificado`.
- Los estados técnicos anteriores continúan siendo compatibles con los datos existentes.

## Diseño responsive

- Forma, Tipo y Tono de luz permanecen alineados y contenidos en celular.
- Los botones de Fábrica ya no salen de la tarjeta ni cortan el texto.
- El checklist muestra visualmente qué etapas están completas y cuál sigue.
- El carrusel de pedidos usa una cabecera de una sola línea y acciones en dos columnas.
- En una pantalla móvil de 375 px entran tres pedidos completos, sin desborde horizontal.

## Verificación

- Compilación de producción completada.
- Secuencia Cortado → Armado → Embalado probada de principio a fin.
- Cambio automático a `Espejo listo` comprobado.
- Formularios verificados sin la opción `Pasado a fábrica`.
- Revisión visual de Fábrica y Pedidos en 375 px.
- Consola del navegador sin errores.
