# DECOGLASS — análisis de producto, UX y arquitectura

## Diagnóstico ejecutivo

La app ya resuelve una cantidad valiosa de procesos reales: sectores, pedidos, fábrica, cobros, comisiones, CRM, stock, reclamos, sueldos, auditoría y presupuestos. El problema principal no es la falta de funciones; es que crecieron dentro de una única interfaz y una única estructura técnica. Eso produce la sensación de desorden visual y también aumenta el riesgo operativo.

La versión incluida en esta carpeta mejora la pantalla principal y corrige el tratamiento de **Desempañante**, pero para convertirla en un sistema empresarial profesional la prioridad siguiente debe ser seguridad, integridad de datos y arquitectura, antes de agregar más módulos.

## Cambios ya implementados

- Nuevo mapa visual con seis escenas coherentes y representativas:
  - Marketing: estudio creativo y producción de campaña.
  - Ventas: showroom de espejos iluminados.
  - Administración: escritorio financiero y archivo.
  - Fábrica: corte y armado de espejos con perfiles y LED.
  - PostVenta: banco de diagnóstico y reparación.
  - Logística: embalaje, carga y distribución.
- Se reemplazó la perspectiva inclinada del mapa por una grilla empresarial más limpia y legible.
- Se agregó una cabecera que explica la pantalla y agrupa los estados.
- En móvil se mantienen dos columnas desde 341 px para reducir el recorrido de aproximadamente 2.100 px a cerca de 1.000 px.
- **Desempañante** ahora se normaliza y se muestra como función verde en Fábrica.
- Compatibilidad con datos anteriores: reconoce `Desempañante`, `Sí`, `220`, `220V`, `Touch`, `T` y registros heredados desde el campo de detalle.
- Si la función estaba incluida en `Grabado / esmerilado`, se elimina de Observaciones para no duplicarla.
- Se agregó `.env.example`, que el README ya mencionaba pero no existía en el repositorio.
- Se excluyó de esta entrega la copia antigua anidada `decoglass-app/decoglass-app`, para evitar mantener dos versiones distintas.

## Qué modificaría en UX y diseño

### Prioridad alta

1. **Un tablero diferente por rol.** Un vendedor necesita clientes, pedidos y cotizaciones; Fábrica necesita producción y alertas; Administración necesita caja, pagos y liquidaciones. Mostrar la misma estructura a todos aumenta carga mental.

2. **Una cola de trabajo priorizada.** Además del mapa, la portada debería mostrar “requiere acción hoy”: pedidos demorados, saldos pendientes, facturas sin emitir, entregas próximas y stock crítico.

3. **Navegación principal persistente.** Hoy la navegación depende de entrar a cada sector. Conviene una barra estable con Inicio, Pedidos, Producción, Clientes, Finanzas y Más, filtrada por permiso.

4. **Formulario de pedido más corto.** El modal es largo y mezcla producto, funciones, cliente, cobro y entrega. Lo dividiría en cuatro pasos o secciones plegables con resumen lateral fijo.

5. **Jerarquía visual estricta.** Reservar verde para éxito/activo, amarillo para atención y rojo para bloqueo. El turquesa debe ser marca o acción principal, no competir con todos los estados.

6. **Texto más cómodo.** Hay etiquetas y metadatos de 10,5–12 px con gris tenue sobre fondo oscuro. Para uso diario llevaría texto operativo a 13–14 px y revisaría contraste WCAG.

### Prioridad media

- Unificar anchos de página, espaciados, radios y alturas de botones mediante tokens de diseño.
- Reemplazar confirmaciones nativas del navegador por diálogos consistentes con contexto y opción de deshacer cuando sea posible.
- Mantener filtros y vistas recientes por usuario.
- Permitir búsqueda global por cliente, número de pedido, teléfono o vendedor.
- Agregar estados vacíos con una acción clara y mensajes de error que expliquen cómo recuperar el trabajo.
- Mostrar la última sincronización y quién hizo el último cambio en registros sensibles.

## Riesgos técnicos y de seguridad

### P0 — resolver antes de usar información empresarial sensible

1. **La base está abierta.** `supabase/schema.sql` crea una política `for all` con `using (true)` y `with check (true)`. Cualquiera que obtenga la URL y la clave pública puede leer, modificar o borrar datos sin pasar por la interfaz.

2. **Las claves se guardan en texto plano.** Las claves de administradores, encargados y operarios viven dentro de los datos compartidos; incluso existe una pantalla para mostrarlas. Esto no debe considerarse autenticación empresarial.

3. **Los permisos se controlan en React.** Un usuario puede evitar la interfaz y operar directamente contra Supabase. Se necesita Supabase Auth, perfiles, roles y políticas RLS aplicadas en el servidor.

4. **La auditoría no es inmutable.** Está guardada en el mismo almacén editable. Un actor con acceso a la clave pública puede modificar también el historial.

### P1 — integridad y mantenibilidad

1. **Datos en grandes blobs JSON.** Pedidos, clientes, sectores y demás colecciones se guardan como un registro clave/valor completo. Dos personas que guardan casi al mismo tiempo pueden pisarse cambios. Conviene usar tablas normalizadas, claves foráneas, timestamps, índices y transacciones.

2. **Carga inicial secuencial.** La app solicita cada colección una detrás de otra. Con latencia real esto alarga la pantalla “Cargando”. Se puede paralelizar temporalmente, pero la solución correcta es consultar sólo los datos necesarios para cada página.

3. **Un archivo de 4.272 líneas.** `src/App.jsx` contiene lógica de negocio, datos, componentes y CSS. Lo dividiría por dominio (`pedidos`, `fabrica`, `finanzas`, `crm`, `rrhh`) y extraería un sistema de componentes compartidos.

4. **Dos copias de la app en el repositorio.** La carpeta anidada contiene una versión anterior y puede provocar despliegues o correcciones sobre el archivo equivocado.

5. **No hay pruebas automatizadas.** Los cálculos de presupuestos, comisiones, saldos, liquidaciones y transiciones de pedidos necesitan pruebas unitarias; los flujos críticos necesitan pruebas de integración y E2E.

6. **Configuración frágil.** Sin variables de Supabase la app se rompe al crear el cliente. La entrega suma `.env.example`, pero conviene agregar una pantalla de configuración faltante y una verificación de salud.

### P2 — rendimiento y operación

- El bundle principal quedó alrededor de 983 kB minificado y Vite advierte que supera 500 kB. Separaría por rutas y cargaría Recharts sólo en reportes.
- El fondo visual ocupa unos 2,47 MB; conviene servir una versión WebP/AVIF responsive y precargar sólo la portada.
- Recharts 2 aparece como rama sin mantenimiento en la instalación de verificación; planificar migración a v3.
- Agregar monitoreo de errores, métricas de sincronización, copias de seguridad, restauración y exportaciones programadas.

## Arquitectura objetivo recomendada

1. **Autenticación:** Supabase Auth con usuarios individuales, recuperación de contraseña y MFA para administradores.
2. **Autorización:** roles `admin`, `ventas`, `fabrica`, `postventa`, `logistica`, con RLS por tabla y acciones.
3. **Datos:** tablas para usuarios, clientes, pedidos, productos, funciones, pagos, envíos, tareas, stock y auditoría.
4. **Frontend:** React por módulos, React Router, componentes compartidos, formularios con esquema de validación y caché de consultas.
5. **Operación:** auditoría server-side, backups, entornos desarrollo/prueba/producción y pipeline de despliegue.
6. **Calidad:** pruebas de reglas de negocio, pruebas E2E de pedido completo y checklist de accesibilidad.

## Plan sugerido

- **Fase 1 — Base segura:** Auth, roles, RLS, modelo de datos y migración. No agregar módulos nuevos en esta fase.
- **Fase 2 — Operación central:** pedidos, producción, cobros, entregas y clientes sobre la nueva base.
- **Fase 3 — Experiencia:** dashboards por rol, navegación, formularios, búsqueda global y responsive completo.
- **Fase 4 — Gestión:** finanzas, sueldos, stock, reportes, auditoría y automatizaciones.

## Verificación realizada

- Build de producción de Vite completado correctamente.
- Revisión visual en 1440×1000 y 390×844.
- Sin overflow horizontal en ambas resoluciones.
- Los seis recortes del fondo corresponden al sector correcto.
- Pruebas de compatibilidad de Desempañante con datos actuales y heredados: 220, Touch, `Sí`, función dentro del detalle y estado apagado.
