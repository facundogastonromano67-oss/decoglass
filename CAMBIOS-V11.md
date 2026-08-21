# DECOGLASS V11 — sincronización automática entre sectores

## Cambios en vivo

- Cuando Ventas carga o modifica un pedido, Fábrica recibe el cambio sin recargar la página.
- Los avances de producción, confirmaciones de PostVenta, entregas de Logística y demás estados también se actualizan automáticamente en las otras pantallas abiertas.
- La sincronización alcanza pedidos, tareas, stock, facturas, reclamos, finanzas, vendedores y el resto de la información compartida de la empresa.

## Funcionamiento

- La app utiliza un canal en vivo para avisar inmediatamente cada cambio a las demás sesiones conectadas.
- Además consulta únicamente las fechas de actualización cada 4 segundos. Este respaldo recupera cualquier aviso perdido o mantiene la app actualizada si el canal en vivo está temporalmente desconectado.
- Al volver a la pestaña o recuperar Internet se realiza una comprobación inmediata.
- Los cambios recibidos actualizan la pantalla, pero no se vuelven a guardar; esto evita bucles y escrituras duplicadas.
- Mientras una pantalla está guardando un cambio propio, una actualización anterior no puede pisarlo.

## Indicador

- `Sincronización en vivo`: el canal inmediato está conectado.
- `Actualización automática`: la app continúa sincronizando mediante el respaldo periódico.
- `Conectando...`: el canal está iniciando.

## Instalación y pruebas

- No requiere ejecutar ningún SQL nuevo ni modificar Supabase.
- Fue probado con dos pantallas abiertas simultáneamente: los pasos `Cortado`, `Armado` y `Embalado` se reflejaron entre ambas sin recargar.
- La compilación de producción finalizó correctamente.
