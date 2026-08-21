# DECOGLASS V8 — contraste y orden visual

Esta versión trabaja sobre tres problemas concretos detectados en el uso móvil y de escritorio.

## Tema claro con contraste real

- El fondo general ahora es gris cálido y se diferencia claramente de tarjetas, formularios y paneles.
- Los textos, bordes y controles tienen más contraste en modo claro.
- Las imágenes del edificio y de cada sector son más luminosas, manteniendo una estética neutra y sin tonos azules o cian.
- El tema oscuro conserva fondos neutros y el acento naranja.

## Cabecera de los sectores más simple

- Se eliminaron datos repetidos: botón de regreso duplicado, número de sector, progreso y título secundario del espacio de trabajo.
- La imagen de cada sector ocupa menos alto.
- Las herramientas quedaron en una única barra horizontal compacta y desplazable en celular.

## Pedidos más fáciles de leer

- Cada tarjeta quedó dividida visualmente en dos zonas:
  - **Datos del espejo:** cliente, importe, medidas, forma, vendedor y estados.
  - **Proceso del pedido:** paso actual, navegación y acciones del flujo.
- Las dos zonas usan fondos distintos tanto en claro como en oscuro.
- Los controles principales ocupan menos espacio en celular.
- Fechas y acciones masivas siguen disponibles, pero dentro de un panel plegable para no recargar la vista.
- Se pueden ver aproximadamente tres o cuatro pedidos por pantalla, según el contenido de cada paso.

## Instalación

No requiere cambios nuevos en Supabase. Subí el contenido de esta carpeta a GitHub, reemplazando la versión anterior, y Vercel volverá a publicar la aplicación.
