# Cambios funcionales · Flujo profesional de pedidos

## Recorrido por pasos

Cada pedido muestra una sola tarjeta dinámica con el paso operativo actual. Al completar una acción avanza automáticamente; las flechas y los indicadores numerados permiten consultar los demás pasos sin modificar el pedido.

### Pedidos con retiro — 4 pasos

1. Verificar pedido.
2. Esperar producción y confirmación de fábrica.
3. Coordinar el retiro con el cliente.
4. Confirmar la entrega y archivar.

### Pedidos con envío — 5 pasos

1. Verificar pedido.
2. Esperar producción y confirmación de fábrica.
3. Confirmar al cliente y confirmar el envío.
4. Habilitar el pedido en la lista del fletero.
5. Confirmar la entrega y archivar.

## Reglas incorporadas

- Fábrica solamente recibe pedidos que ya pasaron la verificación.
- La comunicación con el cliente se habilita después de que fábrica marca el espejo como listo.
- En pedidos con envío, `Envío confirmado` se habilita después de confirmar al cliente.
- Logística solamente ve pedidos listos con cliente y envío confirmados.
- La entrega final no puede archivarse si falta alguna confirmación anterior.
- Retiro y envío mantienen recorridos diferentes sin duplicar estados innecesarios.
- Los pedidos existentes se interpretan automáticamente desde su estado actual.
- Los nuevos avances guardan fecha de verificación, producción lista, confirmación de envío y entrega.
- En escritorio y celular se ve un solo paso por vez para mantener compacta la lista.

## Sectores sincronizados

- Ventas muestra el recorrido completo.
- Fábrica gestiona el paso 2.
- PostVenta confirma cliente y envío.
- Logística recibe solamente los envíos habilitados y completa el paso 5.

## Verificación

- Compilación de producción completada.
- Recorrido de retiro probado hasta la habilitación del archivado.
- Recorrido de envío probado desde verificación hasta Logística y archivado.
- Revisión visual del carrusel de cuatro y cinco pasos en escritorio.
- Revisión responsive en 390 px sin desborde horizontal.
