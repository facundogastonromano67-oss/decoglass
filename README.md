# DECOGLASS · Actualización V3

Esta carpeta contiene el código fuente actualizado de la aplicación.

## Para actualizar la app existente

Subí el contenido de esta carpeta a la raíz del repositorio de GitHub, reemplazando los archivos anteriores. Si la aplicación actual ya funciona conectada a Supabase, **no hay que cambiar nada en Supabase**.

El archivo `.env.example` es solamente una referencia para instalaciones nuevas o pruebas locales. No es necesario completarlo para actualizar la aplicación publicada y no se debe subir un archivo `.env` personal al repositorio.

## Cambios incluidos

- Acciones masivas sobre pedidos filtrados.
- Rango de fechas desde/hasta para pedidos.
- Restauración masiva de pedidos entregados o cancelados.
- Borrado masivo con confirmación y cantidad visible.
- Taller separado en Simples, Esmerilados y Biselados.
- Clasificación automática de pedidos existentes según su tipo.
- Secuencia obligatoria: espejo listo → cliente avisado → entregado y archivado.
- Indicador persistente de cliente avisado.
- Adaptación de las nuevas herramientas a celular.

## Para ejecutar localmente —opcional—

```bash
npm install
npm run dev
```

Solamente para esta modalidad local se crea un archivo `.env` a partir de `.env.example` y se colocan allí las variables del proyecto existente.
