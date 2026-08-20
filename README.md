# DECOGLASS · Sistema de gestión V2

Versión reorganizada de la aplicación interna de DECOGLASS. Mantiene el edificio interactivo como navegación principal y unifica el resto de la experiencia con una interfaz profesional, clara y adaptable a escritorio y celular.

## Puesta en marcha

1. Copiar `.env.example` como `.env`.
2. Completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los datos del proyecto.
3. Instalar dependencias y ejecutar la app:

```bash
npm install
npm run dev
```

Para generar una versión de producción:

```bash
npm run build
```

El directorio `dist/` incluido corresponde a la compilación verificada de esta entrega.

## Qué incluye esta versión

- Edificio operativo organizado en planta alta y planta baja.
- Imágenes ambientales propias para los seis sectores.
- Nueva portada con resumen de estados y jerarquía más limpia.
- Cabecera, navegación contextual y pantallas de sector rediseñadas.
- Pestañas con iconos y nombre del espacio de trabajo activo.
- Formularios, tarjetas, botones, modales y estados bloqueados unificados.
- Diseño responsive en dos columnas para el edificio en celular.
- Retorno automático al inicio de la pantalla al cambiar de sector.
- Desempañante mostrado como aviso verde junto con las demás funciones y eliminado del detalle técnico.

## Alcance

Por decisión del proyecto, esta iteración no incorpora una nueva capa de seguridad. Conserva el esquema de acceso existente, adecuado al uso interno planteado para un equipo pequeño.

No se publicó ningún cambio en GitHub. Este paquete es una copia local lista para revisar, ejecutar y luego integrar al repositorio cuando se decida.
