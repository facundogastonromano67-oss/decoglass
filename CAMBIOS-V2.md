# Cambios de diseño y experiencia · V2

## Dirección aplicada

El edificio sigue siendo la pieza central porque diferencia a la aplicación y permite entender la empresa de forma espacial. La mejora consistió en darle una estructura más creíble y ordenada: dos plantas, numeración, imágenes representativas y una lectura clara del estado de cada sector.

Fuera del edificio se redujo el ruido visual. La interfaz ahora usa una sola lógica de superficies, bordes, radios, tipografía, espaciado, colores de estado y tamaños de control.

## Cambios principales

- Portada enfocada en la operación, con título breve, resumen de estados y edificio dentro de una estructura única.
- Sectores agrupados en planta alta y planta baja en lugar de una cuadrícula genérica.
- Texto descriptivo estable en cada ambiente; los nombres de responsables aparecen dentro del sector, donde tienen contexto.
- Encabezado más compacto con identidad DECOGLASS, estado de operación, fecha y acceso.
- Pantalla de sector convertida en una cabecera contextual con imagen, responsable, estado y progreso diario.
- Barra de herramientas ordenada y con iconos; siempre muestra qué módulo está activo.
- Acciones primarias y secundarias con jerarquía consistente.
- Formularios, paneles, tablas, tarjetas y ventanas emergentes alineados al mismo sistema visual.
- Mensajes de acceso reescritos en tono operativo y directo.
- Navegación móvil optimizada con edificio de dos columnas y pestañas desplazables.
- Al cambiar de sector, la nueva vista vuelve automáticamente al inicio.

## Corrección funcional

La función **Desempañante** se normaliza aunque los datos históricos vengan escritos con variantes. Se muestra como aviso verde —`DESEMPAÑANTE 220` o `DESEMPAÑANTE T`— junto a las demás funciones y se excluye del texto de detalle para evitar duplicaciones.

## Recomendaciones para una siguiente etapa

1. Dividir `src/App.jsx` en módulos por sector para facilitar el mantenimiento.
2. Cargar de forma diferida los módulos pesados para reducir el archivo JavaScript inicial.
3. Incorporar filtros y búsquedas persistentes en las vistas con mayor volumen de pedidos.
4. Agregar indicadores operativos reales en la portada cuando exista suficiente historial de datos.
5. Reemplazar o complementar las imágenes de los sectores con fotografías reales de la empresa cuando estén disponibles.

La seguridad avanzada quedó fuera de esta versión por decisión del proyecto y por tratarse de una herramienta interna para un equipo pequeño.
