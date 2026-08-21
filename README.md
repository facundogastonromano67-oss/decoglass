# DECOGLASS · Actualización V4

Esta carpeta contiene el código fuente actualizado de la aplicación.

## Para actualizar la app existente

Subí el contenido de esta carpeta a la raíz del repositorio de GitHub, reemplazando los archivos anteriores. Si la aplicación actual ya funciona conectada a Supabase, **no hay que cambiar nada en Supabase**.

En Vercel, `Root Directory` debe quedar vacío o configurado como `./` para que se construya esta copia de la raíz.

## Cambios incluidos

- Flujo visual compacto: una sola tarjeta dinámica por pedido, con avance automático, indicadores y flechas de navegación.
- Cuatro pasos para pedidos con retiro y cinco para pedidos con envío.
- Verificación obligatoria antes de habilitar el pedido en fábrica.
- Confirmación de cliente y envío separadas y ordenadas.
- Alta automática en la lista del fletero después de confirmar el envío.
- Entrega y archivado habilitados solamente al completar los pasos anteriores.
- Acciones masivas sobre pedidos filtrados.
- Taller separado en Simples, Esmerilados y Biselados.
- Secuencia sincronizada entre Ventas, Fábrica, PostVenta y Logística.
- Diseño adaptable a escritorio y celular.

## Para ejecutar localmente —opcional—

```bash
npm install
npm run dev
```

Solamente para esta modalidad local se crea un archivo `.env` a partir de `.env.example` y se colocan allí las variables del proyecto existente.
