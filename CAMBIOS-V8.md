# DECOGLASS · Actualización V8 — Canal de venta y costo por canal

## Qué archivo se reemplaza

**Uno solo: `src/App.jsx`.** No hay ningún otro archivo tocado. No hace falta cambiar nada en Supabase, ni en Vercel, ni en la configuración guardada.

Podés arrastrar la carpeta entera a la raíz del repo (sólo va a pisar `src/App.jsx`) o reemplazar ese archivo directamente.

---

## El problema que resuelve

El presupuestador cotizaba igual un espejo que sale por el local que uno que sale por Mercado Libre. Como ML se lleva comisión y, si el envío es gratis, también el flete, el "margen real" que mostraba la app era en realidad el margen **antes** de pagarle al canal.

Y no se podía corregir midiendo, porque el pedido no guardaba por qué canal había entrado la venta. Mercado Libre ni siquiera figuraba en la lista de canales del CRM (`LEAD_CHANNELS`), siendo el canal que mueve la mayor parte de la facturación.

---

## Cambios

### 1. Una sola lista de canales, con Mercado Libre adentro

`CANALES_VENTA` reemplaza a `LEAD_CHANNELS` y la alimenta, así que el CRM y el pedido usan la misma lista:

Mercado Libre · WhatsApp · Instagram · Local / Showroom · Constructora / Arquitecto · Otro

Las claves viejas (`whatsapp`, `instagram`, `local`, `otro`) no cambiaron, así que **los leads ya cargados se siguen viendo igual**.

### 2. Canal de venta en el pedido

- Campo nuevo `canal` en el pedido, en la ficha al lado de **Vendedor**.
- Filtro **"Todos los canales"** en la lista de pedidos, con la opción *Sin canal cargado* para encontrar rápido lo que falta completar.
- Al cargar varios espejos del mismo pedido, el canal se arrastra solo al siguiente.
- Los pedidos históricos quedan sin canal y se agrupan aparte como **"Sin canal"** — no se cuentan como "Otro" para no ensuciar los números.

### 3. Costo de vender por cada canal

Sección nueva en *Ver/editar configuración de costos*, con tres valores por canal:

| Valor | Qué es | Default |
|---|---|---|
| `comision` | % sobre el precio final que se queda el canal | ML 0.15, resto 0 |
| `envioAbsorbido` | $ de flete que paga la empresa y no el cliente | ML 30.000, resto 0 |
| `publicidad` | % sobre el precio final gastado en pauta del canal | ML/WhatsApp/IG 0.02 |

**Estos números son un punto de partida, no una medición.** Poné los tuyos: tu comisión real de ML según categoría, y cuánto flete absorbés de verdad.

### 4. El presupuestador muestra qué queda después del canal

Selector de canal en *Cliente y entrega*, y en *Costos y márgenes* aparecen dos bloques:

- **Margen de fábrica** — el de siempre: precio menos lo que cuesta hacerlo.
- **Después de pagar el canal** — lo que se lleva el canal, el margen neto real, la ganancia neta, y el precio que habría que cobrar para sostener el margen objetivo.

Además avisa solo cuando el margen neto queda por debajo del 15%, o cuando la venta pierde plata.

> **El precio que se cotiza no cambió.** Todo esto es informativo. El "precio que sostendría el margen" es una referencia para decidir el precio de publicación en ML — no se aplica solo. Se hizo así a propósito: cambiar los precios de golpe, sin que vos los revises, sería peor que el problema.

### 5. Rentabilidad por canal en el tablero

Cuadro nuevo en el panel principal: por cada canal del mes, pedidos, venta, costo de fábrica, lo que se llevó el canal, ganancia y margen. Verde arriba de 15%, amarillo abajo, rojo en negativo.

Mientras haya entregas sin canal cargado, el cuadro avisa cuántas son y aclara que sirve para ver la tendencia, no para decidir precios.

---

## Verificación hecha

- Build de producción de Vite completado sin errores.
- **Regresión:** un presupuesto sin canal da exactamente el mismo precio y margen que antes (`$192.471` / `44,0%` en un 50×70 Simple+Touch).
- **El precio no cambia entre canales:** mismo espejo, los seis canales, siempre `$192.471`. Sólo cambia el margen neto informado.
- **Fórmula del precio sugerido:** cobrando lo sugerido, el margen neto vuelve exactamente al objetivo (40,00% sobre 40%).
- **Caso negativo:** constructora 20+ por ML da −13,4% neto y dispara el aviso de que pierde plata.
- **Configuración vieja:** una config guardada sin la sección `canales` no rompe nada — se completa canal por canal con los valores del código.

---

## Lo primero que conviene hacer después de subirlo

1. Entrar a *Ver/editar configuración de costos* y poner la **comisión real de ML** y el **flete que absorbés de verdad**. Los defaults son estimaciones mías.
2. Decirle a Cande y a Fran que el campo **Canal de venta** es obligatorio en cada pedido nuevo. Sin eso el cuadro de rentabilidad queda a medias.
3. Mirar el cuadro de rentabilidad por canal recién cuando haya un mes completo cargado.

---

## Lo que sigue sin resolver

La base de Supabase sigue abierta: la política `using(true) with check(true)` más la clave anon dentro del bundle público permiten leer y escribir todo — pedidos, comisiones y sueldos — sin pasar por la app. Este cambio no lo toca, y es el punto más urgente que queda.
