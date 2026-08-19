import { useState, useEffect } from "react";
import { storage } from "./lib/storage";
import {
  Megaphone, ShoppingCart, Calculator, Factory, Truck, Headphones,
  Lock, Plus, Trash2, X, ShieldCheck, User, LogOut, Loader2, Wallet,
  Pencil, RotateCcw, Sparkles, Building2, TrendingUp, TrendingDown,
  FileText, Printer, Copy, Settings2, AlertTriangle, Save, ClipboardList, Check,
  Instagram, MessageCircle, UserPlus, Users, Filter, ExternalLink, BarChart3,
  Wrench, Package, CheckCircle2, XCircle, CircleDollarSign, ArrowLeft, Download, PackagePlus, ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

const ICONS = { Megaphone, ShoppingCart, Calculator, Factory, Truck, Headphones };
const METODO_ICONS = { "Retira": Building2, "Envío": Truck, "Envío flex": Truck, "Interior": Truck, "Colocación": Wrench, "Otro": Package };
const QUICK_ICONS = { MessageCircle, Check, ShoppingCart };

const SECTOR_VISUAL = {
  marketing:      { accent: "#E8739E", pattern: "arcs" },
  ventas:         { accent: "#5BB8E0", pattern: "bars" },
  administracion: { accent: "#7C8FE8", pattern: "ledger" },
  fabrica:        { accent: "#9098A8", pattern: "hazard" },
  postventa:      { accent: "#B583DE", pattern: "rings" },
  logistica:      { accent: "#4FA0D8", pattern: "lanes" },
};

function RoomScene({ sector }) {
  const visual = SECTOR_VISUAL[sector.id] || { accent: "#48E0D8", pattern: "arcs" };
  const Icon = ICONS[sector.icon];
  return (
    <div className="dg-room-scene" style={{ "--accent": visual.accent }}>
      <div className={`dg-scene-pattern dg-scene-pattern-${visual.pattern}`} />
      {Icon && <Icon className="dg-scene-watermark" />}
    </div>
  );
}
const CHART_PALETTE = ["#48E0D8", "#F5C451", "#F16565", "#8B96A8", "#7DD3FC", "#C4B5FD"];

const DEFAULT_SECTORS = [
  { id: "marketing",      name: "Marketing y Publicidad",  icon: "Megaphone",    tipo: "oficina",  encargado: "", clave: null, tasks: [] },
  { id: "ventas",         name: "Ventas",                   icon: "ShoppingCart", tipo: "oficina",  encargado: "", clave: null, tasks: [] },
  { id: "administracion", name: "Administración",           icon: "Calculator",   tipo: "oficina",  encargado: "", clave: null, tasks: [] },
  { id: "fabrica",        name: "Fábrica",                  icon: "Factory",      tipo: "fabrica",  encargado: "", clave: null, tasks: [] },
  { id: "postventa",      name: "PostVenta",                 icon: "Headphones",   tipo: "oficina",  encargado: "", clave: null, tasks: [] },
  { id: "logistica",      name: "Logística y Distribución", icon: "Truck",        tipo: "despacho", encargado: "", clave: null, tasks: [] },
];

const SUGGESTED_TASKS = {
  marketing: [
    "Definir identidad de marca (logo, colores, tono)",
    "Organizar catálogo de productos con fotos profesionales",
    "Armar calendario de contenido para redes sociales",
    "Configurar campañas de Meta Ads / Google Ads",
    "Reportar resultados de campañas cada mes",
    "Recolectar testimonios y reseñas de clientes",
  ],
  ventas: [
    "Definir lista de precios mayorista y minorista actualizada",
    "Armar script de atención y seguimiento de consultas",
    "Llevar planilla o CRM de seguimiento de clientes",
    "Definir metas de venta mensuales por canal",
    "Capacitar sobre las líneas de espejos LED",
    "Definir proceso de cotización y cierre de venta",
  ],
  administracion: [
    "Ordenar facturación y control de caja diario",
    "Definir proceso de cobros y cuentas por cobrar",
    "Controlar pagos a proveedores e importaciones",
    "Comparar costos de fabricación propia vs. importación",
    "Preparar reporte mensual de rentabilidad",
    "Coordinar temas impositivos y contables",
  ],
  fabrica: [
    "Estandarizar fichas técnicas por modelo de espejo",
    "Controlar stock de insumos (vidrio, LED, marcos, transformadores)",
    "Definir control de calidad antes de despacho",
    "Armar cronograma de producción según pedidos",
    "Planificar mantenimiento preventivo de maquinaria",
    "Capacitar al personal en seguridad e higiene",
  ],
  postventa: [
    "Definir política de garantía y devoluciones",
    "Armar protocolo de atención a reclamos",
    "Hacer seguimiento post-entrega al cliente",
    "Documentar problemas frecuentes y soluciones",
    "Medir tiempo de respuesta a reclamos",
  ],
  logistica: [
    "Definir zonas de entrega y costos de envío",
    "Gestionar transportistas o flota propia",
    "Armar checklist de empaque para productos frágiles",
    "Controlar stock de producto terminado listo para despacho",
    "Coordinar agenda de despachos con fábrica y ventas",
    "Hacer seguimiento de envíos hasta la entrega",
  ],
};

const STATUS = {
  green:  { glow: "#52E08A", label: "Al día" },
  yellow: { glow: "#F5C451", label: "Atención" },
  red:    { glow: "#F16565", label: "Crítico" },
  gray:   { glow: "#5B6576", label: "Sin tareas" },
};

const PURCHASE_TYPES = {
  sueldos: "Sueldos", materiales: "Materiales", contenedor: "Contenedor", publicidad: "Publicidad",
  cargos_venta: "Cargos de venta", impuestos: "Impuestos", deudas: "Deudas y financiamiento",
  administracion: "Administración", operativos: "Operativos", combustible_logistica: "Combustible y logística",
  extraempresariales: "Extraempresariales", otros: "Otros", mov_entre_cuentas: "Egreso mov. entre cuentas",
};
const INCOME_CHANNELS = {
  meli_importados: "Meli Importados", meli_nuestros: "Meli Nuestros",
  wpp_ig_importados: "Wpp e IG Importados", wpp_ig_nuestros: "Wpp e IG Nuestros",
  tienda_nube_importados: "Tienda Nube Importados", tienda_nube_nuestros: "Tienda Nube Nuestros",
  local_importados: "Local Importados", local_nuestros: "Local Nuestros",
  mov_entre_cuentas: "Mov. entre cuentas", envios_extras: "Envíos o extras",
};
const PAYMENT_METHODS = {
  santander: "Santander", mercado_pago: "Mercado Pago", mp_efectivo: "Mp_Efectivo",
  icbc_importado: "ICBC Importado", icbc_nuestro: "ICBC Nuestro", credicoop: "Credicoop",
  efec_importados: "Efec. Importados", efectivo_nuestro: "Efectivo Nuestro", usd: "USD",
};
const CUENTA_INGRESO = { caja_efectivo: "Caja de efectivo", ingresos_bancarios: "Ingresos bancarios", ahorro_importados: "Ahorro de importados" };
const IVA_RATE = 0.21;

function determineCuentaPedido(pedido) {
  if (pedido.tipo === "Importado") return "ahorro_importados";
  if (pedido.tipoFactura === "Efectivo / No") return "caja_efectivo";
  return "ingresos_bancarios";
}

const LEAD_CHANNELS = { whatsapp: "WhatsApp", instagram: "Instagram", local: "Local / Showroom", otro: "Otro" };
const LEAD_STATES = {
  mensaje_enviado: { label: "Mensaje enviado", color: "#8B96A8" },
  respondio: { label: "Respondió", color: "#48E0D8" },
  no_respondio: { label: "No respondió", color: "#F16565" },
  venta_cerrada: { label: "Venta cerrada", color: "#52E08A" },
  perdido: { label: "Sin cerrar / Perdido", color: "#F5C451" },
};
const DEFAULT_VENDEDORES = ["Cande", "Dou", "Facu", "Fran", "Sergio"];

const QUICK_BUTTONS = [
  { estado: "mensaje_enviado", label: "Le escribí a alguien", icon: "MessageCircle", color: "#8B96A8" },
  { estado: "respondio", label: "Me respondió", icon: "Check", color: "#48E0D8" },
  { estado: "venta_cerrada", label: "¡Compró!", icon: "ShoppingCart", color: "#52E08A" },
];

const FORMA_OPTIONS = ["Rectangular", "Pastilla", "Circular", "P. Curvas", "Ovalado", "Orgánico", "Capilla Arriba", "Capilla Abajo", "Capilla Izquierda", "Soft Orgánico", "Otro"];
const TIPO_PEDIDO_OPTIONS = ["Simple", "Importado", "Esm.", "Sin led", "Biselado"];
const TOUCH_OPTIONS = ["Touch", "No"];
const DESEMP_OPTIONS = ["Desempañante", "No"];
const HORATEMP_OPTIONS = ["Hora y Temperatura", "No"];
const BLUETOOTH_PEDIDO_OPTIONS = ["No", "Bluetooth 1 parlante", "Bluetooth 2 parlantes"];
const TONO_OPTIONS = ["3 tonos", "Cálida", "Fría", "Neutra", "Sin led"];
const TIPOFACTURA_OPTIONS = ["Efectivo / No", "Cons. Final / B", "EcomApp", "Factura A", "No aplica", "Cambio de espejo"];
const COMISION_OPTIONS = ["No", "Liquidar", "Sí", "No aplica"];
const ESTADO_PEDIDO_OPTIONS = ["Sin pasar a fábrica", "Verificado", "Pasado a fábrica", "Mandar a grabar", "En grabado", "Pedir biselado", "Para armar", "Espejo listo", "Entregado", "Cancelado"];
const METODO_OPTIONS = ["Retira", "Envío", "Envío flex", "Interior", "Colocación", "Otro"];
const PULIDO_OPTIONS = ["No", "Sí"];
const ENVIO_METODOS = ["Envío", "Envío flex", "Interior", "Colocación"];

const SECTOR_SUBPAGES = {
  marketing: [{ id: "tareas", label: "Tareas" }],
  ventas: [
    { id: "presupuestador", label: "Presupuestador" },
    { id: "pedidos", label: "Pedidos" },
    { id: "crm", label: "CRM" },
    { id: "recursos", label: "Catálogos y precios" },
    { id: "tareas", label: "Tareas" },
  ],
  administracion: [
    { id: "pedidos", label: "Lista de ventas" },
    { id: "finanzas", label: "Finanzas" },
    { id: "sueldos", label: "Sueldos" },
    { id: "tareas", label: "Tareas" },
  ],
  fabrica: [
    { id: "pedidos", label: "Pedidos de fábrica" },
    { id: "stock", label: "Stock de espejos" },
    { id: "tareas", label: "Tareas" },
  ],
  postventa: [
    { id: "envios", label: "Envíos" },
    { id: "facturas", label: "Facturas pendientes" },
    { id: "reclamos", label: "Reclamos" },
    { id: "tareas", label: "Tareas" },
  ],
  logistica: [
    { id: "envios", label: "Envíos confirmados" },
    { id: "tareas", label: "Tareas" },
  ],
};

const RECLAMO_TIPOS = ["Producto dañado", "Demora en entrega", "Falla eléctrica/LED", "Error en el pedido", "Mal trato/atención", "Garantía", "Otro"];
const RECLAMO_COLORS = ["#F16565", "#F5C451", "#48E0D8", "#8B96A8", "#7DD3FC", "#C4B5FD", "#52E08A"];

const ESTADO_PEDIDO_COLOR = {
  "Sin pasar a fábrica": "#8B96A8", "Verificado": "#F5C451", "Pasado a fábrica": "#48E0D8", "Mandar a grabar": "#F5C451",
  "En grabado": "#F5C451", "Pedir biselado": "#F5C451", "Para armar": "#F5C451", "Espejo listo": "#48E0D8", "Entregado": "#52E08A",
  "Cancelado": "#F16565",
};
const COMISION_COLOR = { "No": "#8B96A8", "Liquidar": "#F5C451", "Sí": "#52E08A", "No aplica": "#5B6576" };

const METODO_ICON = { "Retira": "Building2", "Envío": "Truck", "Envío flex": "Truck", "Interior": "Truck", "Colocación": "Wrench", "Otro": "Package" };

const ESTADO_STAGE = {
  "Sin pasar a fábrica": { stage: "Sin verificar", color: "#8B96A8" },
  "Verificado": { stage: "Verificado", color: "#F5C451" },
  "Pasado a fábrica": { stage: "Pasado a fábrica", color: "#48E0D8" },
  "Mandar a grabar": { stage: "Para cortar / grabar", color: "#F5C451" },
  "En grabado": { stage: "Para cortar / grabar", color: "#F5C451" },
  "Pedir biselado": { stage: "Para cortar / grabar", color: "#F5C451" },
  "Para armar": { stage: "Para cortar / grabar", color: "#F5C451" },
  "Espejo listo": { stage: "Espejo listo", color: "#48E0D8" },
  "Entregado": { stage: "Entregado", color: "#52E08A" },
  "Cancelado": { stage: "Cancelado", color: "#F16565" },
};

function groupByMonth(items, dateField) {
  const groups = {};
  for (const it of items) {
    const key = (it[dateField] || "").slice(0, 7) || "sin-fecha";
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  }
  const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  return Object.entries(groups)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => {
      let label = "Sin fecha";
      if (key !== "sin-fecha") {
        const [y, m] = key.split("-");
        label = `${MESES[parseInt(m, 10) - 1]} ${y}`;
      }
      return { key, label, items };
    });
}

function groupByWeek(items, dateField) {
  const groups = {};
  for (const it of items) {
    const raw = it[dateField];
    let key = "sin-fecha";
    if (raw) {
      const d = new Date(raw + "T00:00:00");
      const day = d.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(d);
      monday.setDate(d.getDate() + diffToMonday);
      key = monday.toISOString().slice(0, 10);
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  }
  return Object.entries(groups)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => {
      let label = "Sin fecha";
      if (key !== "sin-fecha") {
        const [y, m, d] = key.split("-");
        label = `Semana del ${d}/${m}`;
      }
      return { key, label, items };
    });
}

function MonthAccordion({ groups, renderItem, defaultOpenCount = 1 }) {
  const [openKeys, setOpenKeys] = useState(() => new Set(groups.slice(0, defaultOpenCount).map((g) => g.key)));
  function toggle(key) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }
  return (
    <div className="dg-month-accordion">
      {groups.map((g) => (
        <div key={g.key} className="dg-month-group">
          <button className="dg-month-header" onClick={() => toggle(g.key)}>
            <ChevronRight size={15} className={`dg-month-chevron ${openKeys.has(g.key) ? "dg-month-chevron-open" : ""}`} />
            <span>{g.label}</span>
            <span className="dg-month-count">{g.items.length}</span>
          </button>
          {openKeys.has(g.key) && <div className="dg-month-items">{g.items.map(renderItem)}</div>}
        </div>
      ))}
    </div>
  );
}

function waLink(tel) {
  const clean = String(tel || "").replace(/[^0-9]/g, "");
  return clean ? `https://wa.me/${clean}` : null;
}
function igLink(user) {
  const clean = String(user || "").trim().replace(/^@/, "");
  return clean ? `https://instagram.com/${clean}` : null;
}

function entregaWaLink(p) {
  const base = waLink(p.celular);
  if (!base) return null;
  const nombre = p.cliente ? ` ${p.cliente}` : "";
  const saldo = pedidoSaldo(p);
  const saldoTexto = saldo > 0 ? `💰 Saldo pendiente: ${money(saldo)}` : "💰 Ya está todo abonado, no queda saldo pendiente.";
  let cuerpo;
  if (p.metodo === "Retira") {
    cuerpo = `te confirmamos que tu espejo ${p.ancho}×${p.alto} cm ya está listo para retirar. ¿Coordinamos un día y horario?\n\n${saldoTexto}`;
  } else if (p.metodo === "Colocación") {
    cuerpo = `te confirmamos que tu espejo ${p.ancho}×${p.alto} cm ya está listo. ¿Coordinamos día y horario para la colocación?\n\n${saldoTexto}`;
  } else {
    cuerpo = `te confirmamos que tu espejo ${p.ancho}×${p.alto} cm ya está listo para el envío. Por favor confirmanos que estos datos son correctos:\n\n📞 Teléfono: ${p.celular || "(sin dato)"}\n📍 Dirección: ${p.detalleEntrega || "(sin dato)"}\n🏢 Piso / Depto: ${p.piso || "(sin dato)"}\n🕐 Horario de entrega: ${p.horarioEntrega || "a coordinar"}\n\n${saldoTexto}`;
  }
  const mensaje = `Hola${nombre}! 👋 ${cuerpo}`;
  return `${base}?text=${encodeURIComponent(mensaje)}`;
}

// ---- Motor de presupuestos (replica del PRESUPUESTADOR_FRAN) ----
const TIPO_PRODUCTO_TABLE = {
  "Rectangular Simple":       { clase: "Simple",   esmerilado: "Ninguno",       cargaBase: "Simple / Touch", recargoForma: 0,     display: "Rectangular" },
  "Redondo Simple":           { clase: "Simple",   esmerilado: "Ninguno",       cargaBase: "Simple / Touch", recargoForma: 0,     display: "Redondo" },
  "Esmerilado Recto":         { clase: "Complejo", esmerilado: "Recto",         cargaBase: "Esmerilado",     recargoForma: 0,     display: "Rectangular" },
  "Esmerilado Redondo":       { clase: "Complejo", esmerilado: "Circular",      cargaBase: "Esmerilado",     recargoForma: 0,     display: "Redondo" },
  "Esmerilado Pastilla/Oval": { clase: "Complejo", esmerilado: "Pastilla/Oval", cargaBase: "Esmerilado",     recargoForma: 0,     display: "Pastilla/Oval" },
  "Pastilla Simple":          { clase: "Complejo", esmerilado: "Ninguno",       cargaBase: "Simple / Touch", recargoForma: 0.075, display: "Pastilla" },
  "Ovalado Simple":           { clase: "Complejo", esmerilado: "Ninguno",       cargaBase: "Simple / Touch", recargoForma: 0.075, display: "Ovalado" },
  "Puntas Curvas":            { clase: "Especial", esmerilado: "Ninguno",       cargaBase: "Simple / Touch", recargoForma: 0.075, display: "Puntas Curvas" },
  "Orgánico":                 { clase: "Especial", esmerilado: "Ninguno",       cargaBase: "Simple / Touch", recargoForma: 0.075, display: "Orgánico" },
  "Soft":                     { clase: "Especial", esmerilado: "Ninguno",       cargaBase: "Simple / Touch", recargoForma: 0.075, display: "Soft" },
};

const DEFAULT_QUOTE_CONFIG = {
  materiales: {
    aluminioPrecio: 16395, aluminioRendimiento: 4.09875,
    planchaPrecio: 181290, planchaRendimiento: 6.09,
    ledPrecio: 8300, ledRendimiento: 1,
    transformadorPrecio: 7500, transformadorRendimiento: 1,
    selladorPrecio: 129360, selladorRendimiento: 240,
    pulidoPrecio: 0, pulidoRendimiento: 1,
  },
  embalaje: {
    burbujaPrecio: 20249.1, burbujaRendimiento: 50, carasCubiertas: 2, mermaBurbuja: 0.15,
    stretchPrecio: 45372.48, stretchRendimiento: 16, vueltasPorExtremo: 4, cantidadExtremos: 2, metrosPorBobina: 180, espesorEmbalado: 0.05,
    cintaPrecio: 2500, cintaRendimiento: 30.12048,
    pitonPrecio: 26702, pitonRendimiento: 100, pitonesPorEspejo: 2,
    tarugoPrecio: 0, tarugoRendimiento: 100, tarugosPorEspejo: 2,
    alcoholPrecio: 2500, alcoholRendimiento: 30.12048,
    cartonPuntasPrecio: 0, cartonPuntasRendimiento: 1,
    maderaInteriorPrecio: 6000, telgoporInteriorPrecio: 3125, extraCaja: 10,
  },
  opcionales: {
    touch: { costo: 3500, carga: 0 },
    desemp: { costo: 4500, carga: 10000 },
    horaTemp: { costo: 6000, carga: 2000 },
    bluetooth: {
      "Sin Bluetooth": { componente: 0, parlantes: 0, carga: 0 },
      "Bluetooth 1 parlante": { componente: 3500, parlantes: 17000, carga: 6000 },
      "Bluetooth 2 parlantes": { componente: 3500, parlantes: 23500, carga: 10000 },
    },
    paneles: {
      "30x30": { costoReal: 3500, minimoAgregado: 40000 },
      "30x40": { costoReal: 4700, minimoAgregado: 40000 },
      "40x60": { costoReal: 8000, minimoAgregado: 40000 },
    },
    esmerilado: { Recto: 61000, Circular: 80430, "Pastilla/Oval": 99500 },
  },
  cargaOperativa: { "Simple / Touch": 48000, Esmerilado: 53000, embalajeInteriorAdicional: 15000, panelAdicional: 2500 },
  reglas: {
    iva: 0.21, factor3cuotas: 1.20407, limiteMedidaEstandar: 0.81,
    margenMinorista: 0.4, margenRevendedor: 0.3, margenConstructora10: 0.25, margenConstructora20: 0.2,
    recargoNoEstandar: 0.3, minRevendedorQty: 5, minConstructora10Qty: 10, minConstructora20Qty: 20,
    minimoAgregado: 20000, medidaMaxAncho: 240, medidaMaxAlto: 170, margenMinDesempCm: 18,
  },
};

function unitCost(precio, rendimiento) { return rendimiento ? precio / rendimiento : 0; }

function determinePanel(ancho, alto, margen) {
  if ((ancho >= 40 + margen && alto >= 60 + margen) || (ancho >= 60 + margen && alto >= 40 + margen)) return "40x60";
  if ((ancho >= 30 + margen && alto >= 40 + margen) || (ancho >= 40 + margen && alto >= 30 + margen)) return "30x40";
  if (ancho >= 30 + margen && alto >= 30 + margen) return "30x30";
  return "NO ENTRA";
}

function roundTo1000(n) { return Math.round(n / 1000) * 1000; }
function fmtMoney(n) { return "$" + Math.round(n).toLocaleString("es-AR"); }

function computeQuote(inputs, cfg) {
  const { tipoProducto, ancho, alto, touch, desemp, horaTemp, bluetoothSel, panelesAdicionales, envioInterior, tipoCliente, cantidad } = inputs;
  const { materiales: M, embalaje: E, opcionales: O, cargaOperativa: C, reglas: R } = cfg;

  const tipoRow = TIPO_PRODUCTO_TABLE[tipoProducto] || TIPO_PRODUCTO_TABLE["Rectangular Simple"];
  const area = (ancho * alto) / 10000;
  const perimetro = (2 * (ancho + alto)) / 100;
  const estandar = area <= R.limiteMedidaEstandar;
  const factorTamaño = estandar ? 1 : 1 + R.recargoNoEstandar;

  const alertaMedidaMaxima = (ancho <= R.medidaMaxAncho && alto <= R.medidaMaxAlto) || (ancho <= R.medidaMaxAlto && alto <= R.medidaMaxAncho) ? "OK" : `COTIZACIÓN MANUAL: supera ${R.medidaMaxAncho}×${R.medidaMaxAlto} cm`;

  const costoEspejo = area * unitCost(M.planchaPrecio, M.planchaRendimiento);
  const costoAluminio = perimetro * unitCost(M.aluminioPrecio, M.aluminioRendimiento);
  const costoPulido = perimetro * unitCost(M.pulidoPrecio, M.pulidoRendimiento);
  const costoLed = unitCost(M.ledPrecio, M.ledRendimiento);
  const costoTransformador = unitCost(M.transformadorPrecio, M.transformadorRendimiento);
  const costoSellador = unitCost(M.selladorPrecio, M.selladorRendimiento);
  const costoEsmerilado = tipoRow.esmerilado !== "Ninguno" ? area * (O.esmerilado[tipoRow.esmerilado] || 0) : 0;

  const unitBurbuja = unitCost(E.burbujaPrecio, E.burbujaRendimiento);
  const burbuja = area * E.carasCubiertas * unitBurbuja * (1 + E.mermaBurbuja);
  const unitStretch = unitCost(E.stretchPrecio, E.stretchRendimiento);
  const stretch = ((2 * (ancho / 100 + E.espesorEmbalado) * E.vueltasPorExtremo * E.cantidadExtremos) / E.metrosPorBobina) * unitStretch;
  const cinta = unitCost(E.cintaPrecio, E.cintaRendimiento);
  const pitones = unitCost(E.pitonPrecio, E.pitonRendimiento) * E.pitonesPorEspejo;
  const tarugos = unitCost(E.tarugoPrecio, E.tarugoRendimiento) * E.tarugosPorEspejo;
  const alcohol = unitCost(E.alcoholPrecio, E.alcoholRendimiento);
  const cartonPuntas = unitCost(E.cartonPuntasPrecio, E.cartonPuntasRendimiento);

  const areaCajaInterior = envioInterior === "Sí" ? ((ancho + E.extraCaja) * (alto + E.extraCaja)) / 10000 : 0;
  const materialesEmbalajeInterior = areaCajaInterior * (unitCost(E.maderaInteriorPrecio, 1) + unitCost(E.telgoporInteriorPrecio, 1));
  const cargaEmbalajeInterior = envioInterior === "Sí" ? C.embalajeInteriorAdicional : 0;

  const cargaBaseOperativa = C[tipoRow.cargaBase] || 0;

  const costoBaseSinFunciones = costoEspejo + costoAluminio + costoPulido + costoLed + costoTransformador + costoSellador
    + costoEsmerilado + burbuja + stretch + cinta + pitones + tarugos + alcohol + cargaBaseOperativa
    + cargaEmbalajeInterior + materialesEmbalajeInterior + cartonPuntas;

  const touchCostoReal = touch === "Sí" ? O.touch.costo : 0;
  const desempCostoReal = desemp === "Sí" ? O.desemp.costo : 0;
  const horaTempCostoReal = horaTemp === "Sí" ? O.horaTemp.costo : 0;
  const bt = O.bluetooth[bluetoothSel] || O.bluetooth["Sin Bluetooth"];
  const bluetoothCostoReal = bt.componente + bt.parlantes;

  const panelSize = desemp === "Sí" ? determinePanel(ancho, alto, R.margenMinDesempCm) : "No aplica";
  const panelDisponible = panelSize !== "No aplica" && panelSize !== "NO ENTRA";
  const panelPrincipalCosto = panelDisponible ? O.paneles[panelSize].costoReal : 0;
  const panelesAdicionalesCosto = panelDisponible ? panelesAdicionales * O.paneles[panelSize].costoReal : 0;
  const cantidadTotalPaneles = panelDisponible ? 1 + panelesAdicionales : 0;
  const precioAdicionalPaneles = panelDisponible && panelesAdicionales > 0 ? panelesAdicionales * O.paneles[panelSize].minimoAgregado : 0;

  const cargaTouch = touch === "Sí" ? O.touch.carga : 0;
  const cargaDesemp = desemp === "Sí" ? O.desemp.carga : 0;
  const cargaHoraTemp = horaTemp === "Sí" ? O.horaTemp.carga : 0;
  const cargaBluetooth = bt.carga;
  const cargaPanelesAdicionales = desemp === "Sí" ? panelesAdicionales * C.panelAdicional : 0;

  const costoRealFunciones = touchCostoReal + desempCostoReal + horaTempCostoReal + bluetoothCostoReal + panelPrincipalCosto + panelesAdicionalesCosto
    + cargaTouch + cargaDesemp + cargaHoraTemp + cargaBluetooth + cargaPanelesAdicionales;

  const costoTotalEstimado = costoBaseSinFunciones + costoRealFunciones;

  const alertaPaneles = desemp !== "Sí" && panelesAdicionales > 0
    ? "REVISAR: panel adicional sin desempañante"
    : panelSize === "NO ENTRA"
    ? `NO ENTRA: medida insuficiente con margen de ${R.margenMinDesempCm} cm`
    : (ancho > 100 || alto > 100) && desemp === "Sí" && panelesAdicionales === 0
    ? "RECOMENDACIÓN: agregar panel adicional"
    : "OK";

  function precioPorMargen(m) {
    if (alertaMedidaMaxima !== "OK" || panelSize === "NO ENTRA") return 0;
    const base = (costoBaseSinFunciones / (1 - m)) * factorTamaño * (1 + tipoRow.recargoForma) * (1 + R.iva);
    const term = (costo, carga, activo) => (activo ? Math.max(R.minimoAgregado, ((costo + carga) / (1 - m)) * (1 + R.iva)) : 0);
    const funciones =
      term(touchCostoReal, cargaTouch, touch === "Sí") +
      term(desempCostoReal + panelPrincipalCosto, cargaDesemp, desemp === "Sí") +
      term(horaTempCostoReal, cargaHoraTemp, horaTemp === "Sí") +
      term(bluetoothCostoReal, cargaBluetooth, bluetoothSel !== "Sin Bluetooth");
    return base + funciones + precioAdicionalPaneles;
  }

  const precioMinorista = precioPorMargen(R.margenMinorista);
  const precioRevendedor = precioPorMargen(R.margenRevendedor);
  const precioConstructora10 = precioPorMargen(R.margenConstructora10);
  const precioConstructora20 = precioPorMargen(R.margenConstructora20);

  const escalaComercial = tipoCliente === "Consumidor Final" ? "Minorista"
    : cantidad < R.minRevendedorQty ? "No habilitado: precio minorista"
    : cantidad < R.minConstructora10Qty ? "Revendedor 5–9"
    : cantidad < R.minConstructora20Qty ? "Constructora 10–19"
    : "Constructora 20+";

  const alertaComercial = tipoCliente === "Consumidor Final" ? "OK" : (cantidad < R.minRevendedorQty ? `Mínimo ${R.minRevendedorQty} unidades idénticas` : "OK");

  const precioTransferencia = tipoCliente === "Consumidor Final" ? precioMinorista
    : cantidad < R.minRevendedorQty ? precioMinorista
    : cantidad < R.minConstructora10Qty ? precioRevendedor
    : cantidad < R.minConstructora20Qty ? precioConstructora10
    : precioConstructora20;

  const margenAplicado = tipoCliente === "Consumidor Final" ? R.margenMinorista
    : cantidad < R.minRevendedorQty ? R.margenMinorista
    : cantidad < R.minConstructora10Qty ? R.margenRevendedor
    : cantidad < R.minConstructora20Qty ? R.margenConstructora10
    : R.margenConstructora20;

  const precio3Cuotas = tipoCliente === "Consumidor Final" && precioTransferencia ? precioTransferencia * R.factor3cuotas : null;
  const precioEfectivoSinIva = precioTransferencia ? precioTransferencia / (1 + R.iva) : 0;
  const totalPedidoTransferencia = precioTransferencia * cantidad;
  const margenReal = precioEfectivoSinIva ? (precioEfectivoSinIva - costoTotalEstimado) / precioEfectivoSinIva : 0;

  const esEsmeriladoOBiselado = tipoRow.esmerilado !== "Ninguno" || tipoProducto === "Biselado";
  const tiempoFabricacion = esEsmeriladoOBiselado ? "25 días hábiles" : (desemp === "Sí" || bluetoothSel !== "Sin Bluetooth") ? "10 a 12 días hábiles" : "5 a 7 días hábiles";

  const modeloComercial = (tipoRow.esmerilado !== "Ninguno" ? "Esmerilado" : "Simple")
    + (touch === "Sí" ? " + Touch" : "")
    + (desemp === "Sí" ? " + Desempañante" : "")
    + (horaTemp === "Sí" ? " + Hora/Temperatura" : "")
    + (bluetoothSel !== "Sin Bluetooth" ? ` + ${bluetoothSel}` : "")
    + (desemp === "Sí" && panelesAdicionales > 0 ? ` (${1 + panelesAdicionales} paneles)` : "");

  return {
    area, perimetro, estandar, factorTamaño, alertaMedidaMaxima, alertaPaneles, alertaComercial,
    costoTotalEstimado, escalaComercial, margenAplicado, margenReal,
    panelSize, cantidadTotalPaneles,
    precioMinorista, precioRevendedor, precioConstructora10, precioConstructora20,
    precioTransferencia, precio3Cuotas, precioEfectivoSinIva, totalPedidoTransferencia,
    tiempoFabricacion, modeloComercial, tipoComercialDisplay: tipoRow.display,
  };
}

function buildWhatsappMessage(inputs, result) {
  const { cliente, ancho, alto, envioInterior } = inputs;
  const saludo = cliente ? `Hola ${cliente}, te paso el presupuesto:` : "Hola, te paso el presupuesto:";
  let msg = `${saludo}\n\nEspejo ${result.tipoComercialDisplay} retroiluminado\n• Modelo: ${result.modeloComercial}\n\n📏 Medida: ${ancho} × ${alto} cm\n\n`;
  if (result.precio3Cuotas) msg += `💰 ${fmtMoney(roundTo1000(result.precio3Cuotas))} - Hasta 3 cuotas\n`;
  if (result.precioTransferencia) msg += `💰 ${fmtMoney(roundTo1000(result.precioTransferencia))} - Transferencia`;
  msg += `\n\n🕛 Tiempo de fabricación: ${result.tiempoFabricacion}\n\n`;
  msg += envioInterior === "Sí"
    ? "Se puede encargar con un anticipo del 50% y el saldo restante antes del despacho."
    : "Se puede encargar con un anticipo del 50% y el saldo restante al momento de retirar o antes de la entrega.";
  return msg;
}

function getStatus(tasks) {
  if (!tasks || tasks.length === 0) return { key: "gray", pct: null };
  const done = tasks.filter((t) => t.completed).length;
  const pct = Math.round((done / tasks.length) * 100);
  const key = pct >= 80 ? "green" : pct >= 50 ? "yellow" : "red";
  return { key, pct };
}
function uid() { return Math.random().toString(36).slice(2, 10); }
function money(n) { return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n || 0); }
function monthLabel(ym) {
  const [y, m] = ym.split("-");
  const names = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${names[parseInt(m, 10) - 1]} '${y.slice(2)}`;
}
function last6Months() {
  const out = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}
function monthlyTotals(entries) {
  const months = last6Months();
  const byMonth = {};
  months.forEach((m) => (byMonth[m] = 0));
  entries.forEach((e) => {
    const ym = (e.fecha || "").slice(0, 7);
    if (byMonth[ym] !== undefined) byMonth[ym] += Number(e.monto || 0);
  });
  return months.map((m) => ({ mes: monthLabel(m), total: byMonth[m] }));
}
function breakdownBy(entries, field, labels) {
  const totals = {};
  entries.forEach((e) => { totals[e[field]] = (totals[e[field]] || 0) + Number(e.monto || 0); });
  return Object.entries(totals).map(([k, v]) => ({ name: labels[k] || k, value: v }));
}

export default function App() {
  const [sectors, setSectors] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [incomes, setIncomes] = useState(null);
  const [quoteConfig, setQuoteConfig] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const [leads, setLeads] = useState(null);
  const [vendedores, setVendedores] = useState(null);
  const [pedidos, setPedidos] = useState(null);
  const [recursos, setRecursos] = useState(null);
  const [facturas, setFacturas] = useState(null);
  const [reclamos, setReclamos] = useState(null);
  const [stockEspejos, setStockEspejos] = useState(null);
  const [empleadosSueldo, setEmpleadosSueldo] = useState(null);
  const [liquidaciones, setLiquidaciones] = useState(null);
  const [adminKeyExists, setAdminKeyExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeSectorId, setActiveSectorId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    let loadedSectors = DEFAULT_SECTORS;
    try {
      const s = await storage.get("sectors", true);
      loadedSectors = s ? JSON.parse(s.value) : DEFAULT_SECTORS;
    } catch (e) { loadedSectors = DEFAULT_SECTORS; }

    const today = new Date().toISOString().slice(0, 10);
    let lastReset = null;
    try {
      const lr = await storage.get("last-reset-date", true);
      lastReset = lr ? lr.value : null;
    } catch (e) { lastReset = null; }
    if (lastReset !== today) {
      loadedSectors = loadedSectors.map((sec) => ({ ...sec, tasks: sec.tasks.map((t) => ({ ...t, completed: false })) }));
      try {
        await storage.set("sectors", JSON.stringify(loadedSectors), true);
        await storage.set("last-reset-date", today, true);
      } catch (e) {}
    }
    setSectors(loadedSectors);

    try {
      const p = await storage.get("payments", true);
      setPurchases(p ? JSON.parse(p.value) : []);
    } catch (e) { setPurchases([]); }
    try {
      const inc = await storage.get("incomes", true);
      setIncomes(inc ? JSON.parse(inc.value) : []);
    } catch (e) { setIncomes([]); }
    try {
      const qc = await storage.get("quote-config", true);
      setQuoteConfig(qc ? JSON.parse(qc.value) : DEFAULT_QUOTE_CONFIG);
    } catch (e) { setQuoteConfig(DEFAULT_QUOTE_CONFIG); }
    try {
      const q = await storage.get("quotes", true);
      setQuotes(q ? JSON.parse(q.value) : []);
    } catch (e) { setQuotes([]); }
    try {
      const l = await storage.get("leads", true);
      setLeads(l ? JSON.parse(l.value) : []);
    } catch (e) { setLeads([]); }
    try {
      const v = await storage.get("vendedores", true);
      setVendedores(v ? JSON.parse(v.value) : DEFAULT_VENDEDORES);
    } catch (e) { setVendedores(DEFAULT_VENDEDORES); }
    try {
      const p = await storage.get("pedidos", true);
      setPedidos(p ? JSON.parse(p.value) : []);
    } catch (e) { setPedidos([]); }
    try {
      const r = await storage.get("recursos-venta", true);
      setRecursos(r ? JSON.parse(r.value) : []);
    } catch (e) { setRecursos([]); }
    try {
      const f = await storage.get("facturas-manuales", true);
      setFacturas(f ? JSON.parse(f.value) : []);
    } catch (e) { setFacturas([]); }
    try {
      const rc = await storage.get("reclamos", true);
      setReclamos(rc ? JSON.parse(rc.value) : []);
    } catch (e) { setReclamos([]); }
    try {
      const st = await storage.get("stock-espejos", true);
      setStockEspejos(st ? JSON.parse(st.value) : []);
    } catch (e) { setStockEspejos([]); }
    try {
      const emp = await storage.get("empleados-sueldo", true);
      setEmpleadosSueldo(emp ? JSON.parse(emp.value) : []);
    } catch (e) { setEmpleadosSueldo([]); }
    try {
      const liq = await storage.get("liquidaciones-sueldo", true);
      setLiquidaciones(liq ? JSON.parse(liq.value) : []);
    } catch (e) { setLiquidaciones([]); }
    try {
      const a = await storage.get("admin-key", true);
      setAdminKeyExists(!!a);
    } catch (e) { setAdminKeyExists(false); }
    setLoading(false);
  }

  async function persistSectors(next) { setSectors(next); try { await storage.set("sectors", JSON.stringify(next), true); } catch (e) {} }
  async function persistPurchases(next) { setPurchases(next); try { await storage.set("payments", JSON.stringify(next), true); } catch (e) {} }
  async function persistIncomes(next) { setIncomes(next); try { await storage.set("incomes", JSON.stringify(next), true); } catch (e) {} }
  async function persistQuoteConfig(next) { setQuoteConfig(next); try { await storage.set("quote-config", JSON.stringify(next), true); } catch (e) {} }
  async function persistQuotes(next) { setQuotes(next); try { await storage.set("quotes", JSON.stringify(next), true); } catch (e) {} }
  async function persistLeads(next) { setLeads(next); try { await storage.set("leads", JSON.stringify(next), true); } catch (e) {} }
  async function persistVendedores(next) { setVendedores(next); try { await storage.set("vendedores", JSON.stringify(next), true); } catch (e) {} }
  async function persistPedidos(next) { setPedidos(next); try { await storage.set("pedidos", JSON.stringify(next), true); } catch (e) {} }
  async function persistRecursos(next) { setRecursos(next); try { await storage.set("recursos-venta", JSON.stringify(next), true); } catch (e) {} }
  async function persistEmpleadosSueldo(next) { setEmpleadosSueldo(next); try { await storage.set("empleados-sueldo", JSON.stringify(next), true); } catch (e) {} }
  async function persistLiquidaciones(next) { setLiquidaciones(next); try { await storage.set("liquidaciones-sueldo", JSON.stringify(next), true); } catch (e) {} }
  async function persistFacturas(next) { setFacturas(next); try { await storage.set("facturas-manuales", JSON.stringify(next), true); } catch (e) {} }
  async function persistReclamos(next) { setReclamos(next); try { await storage.set("reclamos", JSON.stringify(next), true); } catch (e) {} }
  async function persistStockEspejos(next) { setStockEspejos(next); try { await storage.set("stock-espejos", JSON.stringify(next), true); } catch (e) {} }
  function createIncomeFromPedido(entry) { persistIncomes([entry, ...incomes]); }

  function updateSector(id, patch) { persistSectors(sectors.map((s) => (s.id === id ? { ...s, ...patch } : s))); }

  const counts = sectors ? sectors.reduce((acc, s) => { const { key } = getStatus(s.tasks); acc[key] = (acc[key] || 0) + 1; return acc; }, {}) : {};
  const isAdmin = session?.role === "admin";
  const isVentas = session?.role === "sector" && session.sectorId === "ventas";
  const canQuote = isAdmin || isVentas;
  const canSeePedidos = !!session;
  const canEditPedidoFull = isAdmin || isVentas;

  if (loading || !sectors || !purchases || !incomes || !quoteConfig || !quotes || !leads || !vendedores || !pedidos || !recursos || !facturas || !reclamos || !stockEspejos || !empleadosSueldo || !liquidaciones) {
    return (<div style={wrap}><Style /><div className="dg-app dg-loading"><Loader2 className="dg-spin" size={28} /><span>Cargando DECOGLASS...</span></div></div>);
  }

  const activeSector = sectors.find((s) => s.id === activeSectorId) || null;

  return (
    <div style={wrap}>
      <Style />
      <div className="dg-app">
        <header className="dg-header">
          <div className="dg-brand">
            <div className="dg-brand-mark">DG</div>
            <div><div className="dg-brand-title">DECOGLASS</div><div className="dg-brand-sub">Gestión de sectores · Espejos LED</div></div>
          </div>
          {session ? (
            <div className="dg-session">
              <span className="dg-session-badge">
                {session.role === "admin" ? <ShieldCheck size={14} /> : <User size={14} />}
                {session.role === "admin" ? "Admin" : sectors.find((s) => s.id === session.sectorId)?.name || "Encargado"}
              </span>
              <button className="dg-icon-btn" onClick={() => setSession(null)} title="Cerrar sesión"><LogOut size={16} /></button>
            </div>
          ) : (
            <button className="dg-login-btn" onClick={() => setLoginOpen(true)}><Lock size={14} /> Iniciar sesión</button>
          )}
        </header>

        <nav className="dg-nav dg-nav-breadcrumb">
          <button className={`dg-nav-btn ${!activeSectorId ? "dg-nav-on" : ""}`} onClick={() => setActiveSectorId(null)}><Building2 size={14} /> Edificio</button>
          {activeSector && (
            <span className="dg-nav-btn dg-nav-on dg-nav-crumb"><ChevronRight size={13} /> {activeSector.name}</span>
          )}
        </nav>

        {!activeSector && (
          <>
            <div className="dg-summary">
              {["green", "yellow", "red", "gray"].map((k) => (
                <div className="dg-chip" key={k} style={{ "--c": STATUS[k].glow }}><span className="dg-chip-dot" />{counts[k] || 0} {STATUS[k].label}</div>
              ))}
            </div>
            <div className="dg-plant-outer">
              <div className="dg-plant-grid">
                {sectors.map((sector, i) => {
                  const { key, pct } = getStatus(sector.tasks);
                  const glow = STATUS[key].glow;
                  const Icon = ICONS[sector.icon];
                  return (
                    <button key={sector.id} className={`dg-room-tile dg-room-tile-${sector.tipo}`} style={{ "--glow": glow }} onClick={() => setActiveSectorId(sector.id)}>
                      <RoomScene sector={sector} />
                      <div className="dg-room-plate" style={{ "--glow": glow }}>
                        <span className="dg-room-plate-num">{String(i + 1).padStart(2, "0")}</span>
                        <div className="dg-room-plate-icon" style={{ "--glow": glow }}>{Icon && <Icon size={16} />}</div>
                        <div className="dg-room-plate-text">
                          <span className="dg-room-plate-name">{sector.name}</span>
                          <span className="dg-room-plate-sub">{sector.encargado || "Sin encargado"}</span>
                        </div>
                        <span className="dg-room-plate-pct" style={{ color: glow }}>{pct === null ? "—" : `${pct}%`}</span>
                      </div>
                      <div className="dg-room-enter"><ChevronRight size={16} /></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeSector && (
          <SectorPage
            sector={activeSector}
            index={sectors.findIndex((s) => s.id === activeSector.id)}
            session={session}
            isAdmin={isAdmin}
            onUpdate={(patch) => updateSector(activeSector.id, patch)}
            onRequestLogin={() => setLoginOpen(true)}
            onBack={() => setActiveSectorId(null)}
            pedidos={pedidos} onChangePedidos={persistPedidos}
            vendedores={vendedores} onChangeVendedores={persistVendedores}
            incomes={incomes} onChangeIncomes={persistIncomes}
            purchases={purchases} onChangePurchases={persistPurchases}
            quoteConfig={quoteConfig} onChangeQuoteConfig={persistQuoteConfig}
            quotes={quotes} onChangeQuotes={persistQuotes}
            leads={leads} onChangeLeads={persistLeads}
            onCreateIncome={createIncomeFromPedido}
            sectors={sectors}
            recursos={recursos} onChangeRecursos={persistRecursos}
            facturas={facturas} onChangeFacturas={persistFacturas}
            reclamos={reclamos} onChangeReclamos={persistReclamos}
            stockEspejos={stockEspejos} onChangeStockEspejos={persistStockEspejos}
            empleadosSueldo={empleadosSueldo} onChangeEmpleadosSueldo={persistEmpleadosSueldo}
            liquidaciones={liquidaciones} onChangeLiquidaciones={persistLiquidaciones}
          />
        )}
      </div>

      {loginOpen && (
        <LoginModal
          sectors={sectors} adminKeyExists={adminKeyExists}
          onClose={() => setLoginOpen(false)}
          onAdminKeyCreated={() => setAdminKeyExists(true)}
          onSectorUpdate={updateSector}
          onSuccess={(s) => { setSession(s); setLoginOpen(false); }}
        />
      )}
    </div>
  );
}

function LockedPage({ label, onLogin }) {
  return (
    <div className="dg-page dg-locked-page">
      <Lock size={24} />
      <p>{label} es información sensible del negocio. Iniciá sesión como admin para verla.</p>
      <button className="dg-btn-primary" onClick={onLogin}><Lock size={14} /> Iniciar sesión</button>
    </div>
  );
}

const SUELDOS_SECTORES = ["Oficina/Ventas", "Taller"];

function emptyEmpleadoSueldo() {
  return { id: uid(), nombre: "", sector: "Oficina/Ventas", valorHora: 0, comisionPct: 0, sueldoBase: 0, complementoFijo: 0, valorHoraExtra: 0, plusSemanal: 0 };
}

function liquidacionTotal(emp, liq) {
  if (!emp) return 0;
  if (emp.sector === "Oficina/Ventas") {
    return (Number(liq.horas) || 0) * (Number(emp.valorHora) || 0) + (Number(liq.ventasCobradas) || 0) * ((Number(emp.comisionPct) || 0) / 100);
  }
  return (Number(emp.sueldoBase) || 0) + (Number(emp.complementoFijo) || 0)
    + (Number(liq.horasExtra) || 0) * (Number(emp.valorHoraExtra) || 0)
    + (Number(liq.plusesAplicados) || 0) * (Number(emp.plusSemanal) || 0)
    - (Number(liq.adelanto) || 0);
}

function SueldosPanel({ empleados, onChangeEmpleados, liquidaciones, onChangeLiquidaciones }) {
  const [tab, setTab] = useState("liquidaciones");
  const [editingEmp, setEditingEmp] = useState(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");

  const [empleadoId, setEmpleadoId] = useState(empleados[0]?.id || "");
  const [periodo, setPeriodo] = useState("");
  const [horas, setHoras] = useState("");
  const [ventasCobradas, setVentasCobradas] = useState("");
  const [horasExtra, setHorasExtra] = useState("");
  const [adelanto, setAdelanto] = useState("");
  const [plusesAplicados, setPlusesAplicados] = useState("");

  const empSel = empleados.find((e) => e.id === empleadoId);
  const periodos = [...new Set(liquidaciones.map((l) => l.periodo))];

  function saveEmpleado(emp) {
    const exists = empleados.some((e) => e.id === emp.id);
    onChangeEmpleados(exists ? empleados.map((e) => (e.id === emp.id ? emp : e)) : [...empleados, emp]);
    setEditingEmp(null);
  }
  function removeEmpleado(id) { onChangeEmpleados(empleados.filter((e) => e.id !== id)); }

  function addLiquidacion() {
    if (!empSel || !periodo.trim()) return;
    onChangeLiquidaciones([{
      id: uid(), empleadoId, empleadoNombre: empSel.nombre, sector: empSel.sector, periodo: periodo.trim(),
      horas: Number(horas) || 0, ventasCobradas: Number(ventasCobradas) || 0,
      horasExtra: Number(horasExtra) || 0, adelanto: Number(adelanto) || 0, plusesAplicados: Number(plusesAplicados) || 0,
      fecha: new Date().toISOString().slice(0, 10),
    }, ...liquidaciones]);
    setHoras(""); setVentasCobradas(""); setHorasExtra(""); setAdelanto(""); setPlusesAplicados("");
  }
  function removeLiquidacion(id) { onChangeLiquidaciones(liquidaciones.filter((l) => l.id !== id)); }

  const visibles = liquidaciones.filter((l) => filtroPeriodo === "todos" || l.periodo === filtroPeriodo);
  const totalPorSector = SUELDOS_SECTORES.map((s) => ({
    sector: s,
    total: visibles.filter((l) => l.sector === s).reduce((a, l) => a + liquidacionTotal(empleados.find((e) => e.id === l.empleadoId), l), 0),
  }));
  const totalGeneral = totalPorSector.reduce((a, s) => a + s.total, 0);

  return (
    <div className="dg-page">
      <div className="dg-quickviews" style={{ marginBottom: 16 }}>
        <button className={`dg-quickview-btn ${tab === "liquidaciones" ? "dg-quickview-on" : ""}`} onClick={() => setTab("liquidaciones")}>Liquidaciones</button>
        <button className={`dg-quickview-btn ${tab === "empleados" ? "dg-quickview-on" : ""}`} onClick={() => setTab("empleados")}>Empleados</button>
      </div>

      {tab === "empleados" && (
        <>
          <div className="dg-section-card">
            <div className="dg-section-header"><UserPlus size={14} /> {editingEmp ? "Editar empleado" : "Nuevo empleado"}</div>
            <EmpleadoForm empleado={editingEmp || emptyEmpleadoSueldo()} onSave={saveEmpleado} onCancel={() => setEditingEmp(null)} />
          </div>
          <div className="dg-task-list">
            {empleados.length === 0 && <div className="dg-empty">No hay empleados cargados.</div>}
            {empleados.map((e) => (
              <div className="dg-task" key={e.id}>
                <div className="dg-pago-info">
                  <span>{e.nombre} <span className="dg-badge" style={{ "--bc": e.sector === "Taller" ? "#F5C451" : "#48E0D8" }}>{e.sector}</span></span>
                  <span className="dg-pago-meta">
                    {e.sector === "Oficina/Ventas"
                      ? `Valor hora: ${money(e.valorHora)} · Comisión: ${e.comisionPct}%`
                      : `Sueldo: ${money(e.sueldoBase)} + ${money(e.complementoFijo)} · HE: ${money(e.valorHoraExtra)} · Plus: ${money(e.plusSemanal)}`}
                  </span>
                </div>
                <button className="dg-icon-btn" onClick={() => setEditingEmp(e)}><Pencil size={14} /></button>
                <button className="dg-icon-btn dg-task-del" onClick={() => removeEmpleado(e.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "liquidaciones" && (
        <>
          <div className="dg-totales">
            {totalPorSector.map((s) => (
              <div className="dg-total-card" style={{ "--c": s.sector === "Taller" ? "#F5C451" : "#48E0D8" }} key={s.sector}><span>Total {s.sector}</span><strong>{money(s.total)}</strong></div>
            ))}
            <div className="dg-total-card" style={{ "--c": "#52E08A" }}><span>Total general</span><strong>{money(totalGeneral)}</strong></div>
          </div>

          <div className="dg-section-card">
            <div className="dg-section-header"><Plus size={14} /> Nueva liquidación</div>
            <div className="dg-field-grid">
              <Field label="Empleado">
                <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}>
                  {empleados.map((e) => (<option key={e.id} value={e.id}>{e.nombre} ({e.sector})</option>))}
                </select>
              </Field>
              <Field label="Período"><input value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="Ej: Semana 1 - Agosto 2026" /></Field>
            </div>
            {empSel?.sector === "Oficina/Ventas" ? (
              <div className="dg-field-grid" style={{ marginTop: 12 }}>
                <Field label="Horas trabajadas"><input type="number" value={horas} onChange={(e) => setHoras(e.target.value)} /></Field>
                <Field label="Ventas cobradas ($)"><input type="number" value={ventasCobradas} onChange={(e) => setVentasCobradas(e.target.value)} /></Field>
              </div>
            ) : (
              <div className="dg-field-grid" style={{ marginTop: 12 }}>
                <Field label="Horas extra"><input type="number" value={horasExtra} onChange={(e) => setHorasExtra(e.target.value)} /></Field>
                <Field label="Adelantos ($)"><input type="number" value={adelanto} onChange={(e) => setAdelanto(e.target.value)} /></Field>
                <Field label="Semanas con plus"><input type="number" value={plusesAplicados} onChange={(e) => setPlusesAplicados(e.target.value)} /></Field>
              </div>
            )}
            <div className="dg-form-actions"><button className="dg-btn-primary" onClick={addLiquidacion}><Plus size={16} /> Agregar liquidación</button></div>
          </div>

          <div className="dg-crm-filters">
            <Filter size={14} />
            <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
              <option value="todos">Todos los períodos</option>
              {periodos.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>

          <div className="dg-task-list">
            {visibles.length === 0 && <div className="dg-empty">No hay liquidaciones en esta vista.</div>}
            {visibles.map((l) => {
              const emp = empleados.find((e) => e.id === l.empleadoId);
              return (
                <div className="dg-task" key={l.id}>
                  <div className="dg-pago-info">
                    <span>{l.empleadoNombre} — {l.periodo}</span>
                    <span className="dg-pago-meta">
                      {l.sector === "Oficina/Ventas" ? `${l.horas} hs · ${money(l.ventasCobradas)} vendido` : `${l.horasExtra} hs extra · ${money(l.adelanto)} adelanto · ${l.plusesAplicados} plus`}
                    </span>
                  </div>
                  <span className="dg-pago-monto">{money(liquidacionTotal(emp, l))}</span>
                  <button className="dg-icon-btn dg-task-del" onClick={() => removeLiquidacion(l.id)}><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function EmpleadoForm({ empleado, onSave, onCancel }) {
  const [draft, setDraft] = useState(empleado);
  function set(f, v) { setDraft((d) => ({ ...d, [f]: v })); }
  return (
    <>
      <div className="dg-field-grid">
        <Field label="Nombre"><input value={draft.nombre} onChange={(e) => set("nombre", e.target.value)} /></Field>
        <Field label="Sector"><select value={draft.sector} onChange={(e) => set("sector", e.target.value)}>{SUELDOS_SECTORES.map((s) => (<option key={s}>{s}</option>))}</select></Field>
      </div>
      {draft.sector === "Oficina/Ventas" ? (
        <div className="dg-field-grid" style={{ marginTop: 12 }}>
          <Field label="Valor hora"><input type="number" value={draft.valorHora} onChange={(e) => set("valorHora", e.target.value)} /></Field>
          <Field label="Comisión % (ej: 3)"><input type="number" value={draft.comisionPct} onChange={(e) => set("comisionPct", e.target.value)} /></Field>
        </div>
      ) : (
        <div className="dg-field-grid" style={{ marginTop: 12 }}>
          <Field label="Sueldo recibo"><input type="number" value={draft.sueldoBase} onChange={(e) => set("sueldoBase", e.target.value)} /></Field>
          <Field label="Complemento fijo"><input type="number" value={draft.complementoFijo} onChange={(e) => set("complementoFijo", e.target.value)} /></Field>
          <Field label="Valor hora extra"><input type="number" value={draft.valorHoraExtra} onChange={(e) => set("valorHoraExtra", e.target.value)} /></Field>
          <Field label="Plus semanal"><input type="number" value={draft.plusSemanal} onChange={(e) => set("plusSemanal", e.target.value)} /></Field>
        </div>
      )}
      <div className="dg-form-actions">
        {onCancel && <button className="dg-btn-ghost" onClick={onCancel}>Cancelar</button>}
        <button className="dg-btn-primary" onClick={() => onSave(draft)}><Save size={14} /> Guardar</button>
      </div>
    </>
  );
}

function FinanzasPanel({ incomes, purchases, sectors, onChangeIncomes, onChangePurchases }) {
  const [tab, setTab] = useState("ingresos");
  return (
    <div className="dg-page">
      <div className="dg-quickviews" style={{ marginBottom: 16 }}>
        <button className={`dg-quickview-btn ${tab === "ingresos" ? "dg-quickview-on" : ""}`} onClick={() => setTab("ingresos")}><TrendingUp size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />Ingresos</button>
        <button className={`dg-quickview-btn ${tab === "compras" ? "dg-quickview-on" : ""}`} onClick={() => setTab("compras")}><TrendingDown size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />Compras</button>
      </div>
      {tab === "ingresos"
        ? <MoneyPage kind="income" entries={incomes} sectors={sectors} onChange={onChangeIncomes} />
        : <MoneyPage kind="purchase" entries={purchases} sectors={sectors} onChange={onChangePurchases} />}
    </div>
  );
}

const RECURSO_TIPOS = { precios: "Lista de precios", catalogo: "Catálogo", reglamento: "Reglamento de ventas", garantia: "Garantía", imagenes: "Imágenes de muestra", otro: "Otro" };

function RecursosVentaPanel({ recursos, onChange, isAdmin }) {
  const [tipo, setTipo] = useState("catalogo");
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");

  function addRecurso() {
    if (!titulo.trim() || !url.trim()) return;
    onChange([{ id: uid(), tipo, titulo: titulo.trim(), url: url.trim() }, ...recursos]);
    setTitulo(""); setUrl("");
  }
  function removeRecurso(id) { onChange(recursos.filter((r) => r.id !== id)); }

  const grupos = Object.keys(RECURSO_TIPOS).map((k) => ({ tipo: k, label: RECURSO_TIPOS[k], items: recursos.filter((r) => r.tipo === k) }));

  return (
    <div className="dg-page">
      {isAdmin && (
        <div className="dg-form dg-pago-form">
          <div className="dg-form-row">
            <div style={{ flex: 1 }}>
              <label>Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>{Object.entries(RECURSO_TIPOS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select>
            </div>
            <div style={{ flex: 2 }}><label>Título</label><input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Catálogo espejos redondos 2026" /></div>
          </div>
          <label>Link (Google Drive, Dropbox, etc.)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
          <div className="dg-form-actions"><button className="dg-btn-primary" onClick={addRecurso}><Plus size={16} /> Agregar recurso</button></div>
          <p className="dg-hint" style={{ marginTop: 10 }}>Subí el archivo a Google Drive o Dropbox, compartilo con "cualquiera con el link" y pegá ese link acá.</p>
        </div>
      )}

      {grupos.every((g) => g.items.length === 0) && (
        <div className="dg-empty">Todavía no hay catálogos, precios ni documentos cargados.</div>
      )}
      {grupos.map((g) => g.items.length > 0 && (
        <div key={g.tipo} className="dg-section-card">
          <div className="dg-section-header"><Download size={14} /> {g.label}</div>
          <div className="dg-task-list">
            {g.items.map((r) => (
              <div className="dg-task" key={r.id}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="dg-recurso-link"><Download size={14} /> {r.titulo}</a>
                {isAdmin && <button className="dg-icon-btn dg-task-del" onClick={() => removeRecurso(r.id)}><Trash2 size={14} /></button>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MoneyPage({ kind, entries, sectors, onChange }) {
  const isIncome = kind === "income";
  const TYPES = isIncome ? INCOME_CHANNELS : PURCHASE_TYPES;
  const typeField = isIncome ? "canal" : "tipo";
  const partyField = isIncome ? "cliente" : "proveedor";
  const partyLabel = isIncome ? "Cliente" : "Proveedor";

  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState(Object.keys(TYPES)[0]);
  const [party, setParty] = useState("");
  const [metodo, setMetodo] = useState(Object.keys(PAYMENT_METHODS)[0]);
  const [cuenta, setCuenta] = useState("ingresos_bancarios");
  const [sectorId, setSectorId] = useState("");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [filtro, setFiltro] = useState("todos");

  const totalPendiente = entries.filter((e) => e.estado === "pendiente").reduce((a, e) => a + Number(e.monto || 0), 0);
  const totalConfirmado = entries.filter((e) => e.estado === "pagado").reduce((a, e) => a + Number(e.monto || 0), 0);
  const chartData = monthlyTotals(entries);
  const breakdown = breakdownBy(entries, typeField, TYPES);

  const cuentaTotals = isIncome ? Object.keys(CUENTA_INGRESO).map((k) => ({
    key: k, label: CUENTA_INGRESO[k], total: entries.filter((e) => (e.cuenta || "ingresos_bancarios") === k).reduce((a, e) => a + Number(e.monto || 0), 0),
  })) : [];
  const bancarizadoPagado = entries.filter((e) => (e.cuenta || "ingresos_bancarios") === "ingresos_bancarios" && e.estado === "pagado").reduce((a, e) => a + Number(e.monto || 0), 0);
  const ivaAPagar = bancarizadoPagado * (IVA_RATE / (1 + IVA_RATE));
  const ivaChartData = isIncome ? monthlyTotals(entries.filter((e) => (e.cuenta || "ingresos_bancarios") === "ingresos_bancarios" && e.estado === "pagado")).map((m) => ({ mes: m.mes, total: m.total * (IVA_RATE / (1 + IVA_RATE)) })) : [];

  const visibles = entries.filter((e) => filtro === "todos" || e.estado === filtro).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  function addEntry() {
    if (!concepto.trim() || !monto) return;
    const next = [...entries, {
      id: uid(), concepto: concepto.trim(), monto: Number(monto), [typeField]: tipo,
      [partyField]: party.trim(), ...(isIncome ? { metodo, cuenta } : {}), sectorId, fecha, estado: "pendiente",
    }];
    onChange(next);
    setConcepto(""); setMonto(""); setParty("");
  }
  function toggleEstado(id) { onChange(entries.map((e) => (e.id === id ? { ...e, estado: e.estado === "pendiente" ? "pagado" : "pendiente" } : e))); }
  function removeEntry(id) { onChange(entries.filter((e) => e.id !== id)); }

  return (
    <div className="dg-page">
      <div className="dg-totales">
        <div className="dg-total-card" style={{ "--c": "#F16565" }}><span>Pendiente</span><strong>{money(totalPendiente)}</strong></div>
        <div className="dg-total-card" style={{ "--c": "#52E08A" }}><span>{isIncome ? "Cobrado" : "Pagado"}</span><strong>{money(totalConfirmado)}</strong></div>
      </div>

      {isIncome && (
        <div className="dg-totales dg-cuenta-totales">
          {cuentaTotals.map((c) => (
            <div className="dg-total-card" style={{ "--c": "#48E0D8" }} key={c.key}><span>{c.label}</span><strong>{money(c.total)}</strong></div>
          ))}
        </div>
      )}

      {isIncome && (
        <div className="dg-iva-card">
          <div className="dg-iva-head">
            <div><span className="dg-chart-title">IVA estimado a pagar (solo ingresos bancarizados y cobrados)</span><strong className="dg-iva-amount">{money(ivaAPagar)}</strong></div>
            <span className="dg-iva-note">Base: {money(bancarizadoPagado)} × {Math.round((IVA_RATE / (1 + IVA_RATE)) * 1000) / 10}% — cálculo estimado, no reemplaza la liquidación real.</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={ivaChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="mes" stroke="#8B96A8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B96A8" fontSize={10} tickLine={false} axisLine={false} width={36} />
              <Tooltip contentStyle={{ background: "#161B26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
              <Bar dataKey="total" fill="#F5C451" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="dg-charts">
        <div className="dg-chart-card">
          <div className="dg-chart-title">Últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="mes" stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ background: "#161B26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
              <Bar dataKey="total" fill={isIncome ? "#52E08A" : "#F16565"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="dg-chart-card">
          <div className="dg-chart-title">Por {isIncome ? "canal" : "tipo"}</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                {breakdown.map((_, i) => (<Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: "#161B26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dg-form dg-pago-form">
        <div className="dg-form-row">
          <div style={{ flex: 2 }}><label>Concepto</label><input value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder={isIncome ? "Ej: Venta 4 espejos LED redondos" : "Ej: Vidrio importado - contenedor"} /></div>
          <div style={{ flex: 1 }}><label>Monto</label><input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0" /></div>
        </div>
        <div className="dg-form-row">
          <div style={{ flex: 1 }}><label>{isIncome ? "Canal" : "Tipo"}</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>{Object.entries(TYPES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select>
          </div>
          <div style={{ flex: 1 }}><label>{partyLabel}</label><input value={party} onChange={(e) => setParty(e.target.value)} placeholder="Opcional" /></div>
          {isIncome && (
            <div style={{ flex: 1 }}><label>Banco / Medio</label>
              <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>{Object.entries(PAYMENT_METHODS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select>
            </div>
          )}
          {isIncome && (
            <div style={{ flex: 1 }}><label>Cuenta destino</label>
              <select value={cuenta} onChange={(e) => setCuenta(e.target.value)}>{Object.entries(CUENTA_INGRESO).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select>
            </div>
          )}
        </div>
        <div className="dg-form-row">
          <div style={{ flex: 1 }}><label>Sector (opcional)</label>
            <select value={sectorId} onChange={(e) => setSectorId(e.target.value)}><option value="">General</option>{sectors.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}</select>
          </div>
          <div style={{ flex: 1 }}><label>Fecha</label><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
            <button className="dg-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={addEntry}><Plus size={16} /> Registrar</button>
          </div>
        </div>
      </div>

      <div className="dg-filtros">
        {["todos", "pendiente", "pagado"].map((f) => (
          <button key={f} className={`dg-filtro-btn ${filtro === f ? "dg-filtro-on" : ""}`} onClick={() => setFiltro(f)}>{f === "todos" ? "Todos" : f === "pendiente" ? "Pendientes" : isIncome ? "Cobrados" : "Pagados"}</button>
        ))}
      </div>

      <div className="dg-task-list dg-pago-list">
        {visibles.length === 0 && <div className="dg-empty">No hay registros en esta vista.</div>}
        {visibles.map((e) => (
          <div className="dg-task dg-pago-row" key={e.id}>
            <button className={`dg-checkbox ${e.estado === "pagado" ? "dg-checkbox-on" : ""}`} onClick={() => toggleEstado(e.id)} title="Marcar cobrado/pagado" />
            <div className="dg-pago-info">
              <span className={e.estado === "pagado" ? "dg-task-done" : ""}>{e.concepto}</span>
              <span className="dg-pago-meta">{TYPES[e[typeField]]} · {e[partyField] || "—"} · {sectors.find((s) => s.id === e.sectorId)?.name || "General"} · {e.fecha}{isIncome && e.cuenta ? ` · ${CUENTA_INGRESO[e.cuenta]}` : ""}</span>
            </div>
            <span className="dg-pago-monto">{money(e.monto)}</span>
            <button className="dg-icon-btn dg-task-del" onClick={() => removeEntry(e.id)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function emptyPedido(prefill) {
  return {
    id: uid(), orden: null, grupoId: prefill?.grupoId || null, fecha: new Date().toISOString().slice(0, 10),
    vendedor: prefill?.vendedor || "", cliente: prefill?.cliente || "", celular: prefill?.celular || "", dniCuit: prefill?.dniCuit || "",
    ancho: "", alto: "", cant: 1, pulido: "No", forma: "Rectangular", tipo: "Simple", grabado: "",
    touch: "No", desemp: "No", horaTemp: "No", bluetooth: "No", tono: "3 tonos",
    tipoFactura: prefill?.tipoFactura || "Cons. Final / B", monto: "", anticipo: "", comision: "No aplica", facturado: false, montoRegistrado: 0,
    estado: "Sin pasar a fábrica", demorado: false, listo: "", metodo: prefill?.metodo || "Retira", detalleEntrega: prefill?.detalleEntrega || "", piso: prefill?.piso || "", horarioEntrega: "", envioPagado: false, envioConfirmado: false,
  };
}

const QUICK_VIEWS = [
  { id: "todos", label: "Todos" },
  { id: "verificados", label: "Verificados → listos para fábrica" },
  { id: "facturar", label: "Pendiente de facturar" },
  { id: "comision_candidatos", label: "Comisión: candidatos a liquidar" },
  { id: "comision_liquidar", label: "Comisión: a pagar" },
  { id: "envios", label: "Envíos de la semana" },
];

function pedidoSaldo(p) { return (Number(p.monto) || 0) - (Number(p.anticipo) || 0); }

function PedidosPage({ pedidos, onChange, vendedores, canEditFull, sessionSectorId, incomes, onCreateIncome }) {
  const [quickView, setQuickView] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroVendedor, setFiltroVendedor] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [openPedido, setOpenPedido] = useState(null);
  const [creating, setCreating] = useState(false);
  const [nextDraft, setNextDraft] = useState(null);
  const [agrupado, setAgrupado] = useState("mes");

  const canEditEstadoOnly = !canEditFull && ["fabrica", "logistica", "postventa"].includes(sessionSectorId);

  let visibles = pedidos.slice();
  if (quickView === "verificados") visibles = visibles.filter((p) => p.estado === "Verificado");
  else if (quickView === "facturar") visibles = visibles.filter((p) => !p.facturado);
  else if (quickView === "comision_candidatos") visibles = visibles.filter((p) => p.comision === "No" && pedidoSaldo(p) === 0);
  else if (quickView === "comision_liquidar") visibles = visibles.filter((p) => p.comision === "Liquidar");
  else if (quickView === "envios") visibles = visibles.filter((p) => ENVIO_METODOS.includes(p.metodo) && p.estado !== "Entregado");
  else visibles = visibles.filter((p) => filtroEstado === "todos" || p.estado === filtroEstado);

  visibles = visibles
    .filter((p) => filtroVendedor === "todos" || p.vendedor === filtroVendedor)
    .filter((p) => !busqueda.trim() || p.cliente.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));

  const totalComision = visibles.reduce((a, p) => a + (Number(p.monto) || 0), 0);

  function nextOrden() { return pedidos.reduce((m, p) => Math.max(m, p.orden || 0), 0) + 1; }

  function savePedido(pedido, opts) {
    const exists = pedidos.some((p) => p.id === pedido.id);
    let withOrden = pedido.orden ? pedido : { ...pedido, orden: nextOrden() };
    if (!withOrden.grupoId) withOrden = { ...withOrden, grupoId: withOrden.id };

    const yaRegistrado = Number(withOrden.montoRegistrado) || 0;
    const anticipoActual = Number(withOrden.anticipo) || 0;
    const delta = anticipoActual - yaRegistrado;
    let toSave = withOrden;
    if (delta > 0 && onCreateIncome) {
      const cuenta = determineCuentaPedido(withOrden);
      onCreateIncome({
        id: uid(), concepto: `Anticipo pedido #${withOrden.orden || "?"} — ${withOrden.cliente || "Sin nombre"}`,
        monto: delta, canal: withOrden.tipo === "Importado" ? "local_importados" : "local_nuestros", cuenta, cliente: withOrden.cliente || "",
        metodo: cuenta === "caja_efectivo" ? "efectivo_nuestro" : "mercado_pago",
        sectorId: "ventas", fecha: new Date().toISOString().slice(0, 10), estado: "pagado",
      });
      toSave = { ...withOrden, montoRegistrado: anticipoActual };
    }
    onChange(exists ? pedidos.map((p) => (p.id === pedido.id ? toSave : p)) : [...pedidos, toSave]);

    if (opts?.addAnother) {
      setOpenPedido(null);
      setCreating(false);
      setTimeout(() => {
        setNextDraft(emptyPedido({
          grupoId: toSave.grupoId, cliente: toSave.cliente, celular: toSave.celular, dniCuit: toSave.dniCuit,
          vendedor: toSave.vendedor, tipoFactura: toSave.tipoFactura, metodo: toSave.metodo, detalleEntrega: toSave.detalleEntrega,
        }));
      }, 0);
    } else {
      setOpenPedido(null); setCreating(false);
    }
  }
  function removePedido(id) { onChange(pedidos.filter((p) => p.id !== id)); setOpenPedido(null); }
  function bulkSetComision(ids, val) { onChange(pedidos.map((p) => (ids.includes(p.id) ? { ...p, comision: val } : p))); }

  const activeViewLabel = QUICK_VIEWS.find((v) => v.id === quickView)?.label || "Todos";
  const grupoCounts = pedidos.reduce((acc, p) => { const g = p.grupoId || p.id; acc[g] = (acc[g] || 0) + 1; return acc; }, {});

  return (
    <div className="dg-page">
      <div className="dg-quickviews">
        {QUICK_VIEWS.map((v) => (
          <button key={v.id} className={`dg-quickview-btn ${quickView === v.id ? "dg-quickview-on" : ""}`} onClick={() => setQuickView(v.id)}>{v.label}</button>
        ))}
      </div>

      {quickView === "comision_candidatos" && visibles.length > 0 && canEditFull && (
        <div className="dg-comision-banner">
          <span>{visibles.length} pedido(s) saldados y sin liquidar — {money(totalComision)} en total.</span>
          <button className="dg-btn-primary" onClick={() => bulkSetComision(visibles.map((p) => p.id), "Liquidar")}>Marcar todos como "Liquidar"</button>
        </div>
      )}
      {quickView === "comision_liquidar" && visibles.length > 0 && canEditFull && (
        <div className="dg-comision-banner">
          <span>A pagar: {visibles.length} pedido(s) — {money(totalComision)} en total{filtroVendedor !== "todos" ? ` de ${filtroVendedor}` : ""}.</span>
          <button className="dg-btn-primary" onClick={() => bulkSetComision(visibles.map((p) => p.id), "Sí")}>Marcar todos como pagados</button>
        </div>
      )}

      <div className="dg-crm-filters">
        <Filter size={14} />
        {quickView === "todos" && (
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {ESTADO_PEDIDO_OPTIONS.map((e) => (<option key={e} value={e}>{e}</option>))}
          </select>
        )}
        <select value={filtroVendedor} onChange={(e) => setFiltroVendedor(e.target.value)}>
          <option value="todos">Todos los vendedores</option>
          {vendedores.map((v) => (<option key={v} value={v}>{v}</option>))}
        </select>
        <input className="dg-pedido-search" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <div className="dg-periodo-toggle">
          <button className={agrupado === "mes" ? "dg-periodo-on" : ""} onClick={() => setAgrupado("mes")}>Mes</button>
          <button className={agrupado === "semana" ? "dg-periodo-on" : ""} onClick={() => setAgrupado("semana")}>Semana</button>
        </div>
        <button className="dg-btn-ghost" onClick={() => window.print()}><Printer size={14} /> Imprimir esta vista</button>
        {canEditFull && (
          <button className="dg-btn-primary" style={{ marginLeft: "auto" }} onClick={() => setCreating(true)}><Plus size={14} /> Nuevo pedido</button>
        )}
      </div>

      {(() => {
        const renderCard = (p) => {
          const saldo = pedidoSaldo(p);
          const stage = ESTADO_STAGE[p.estado] || { stage: p.estado, color: "#8B96A8" };
          const MetodoIcon = METODO_ICONS[p.metodo] || Package;
          const waEntrega = p.estado === "Espejo listo" ? entregaWaLink(p) : null;
          return (
            <div className="dg-pedido-card" key={p.id} onClick={() => setOpenPedido(p)}>
              <div className="dg-pedido-card-top">
                <span className="dg-pedido-orden">#{p.orden}</span>
                <span className="dg-lead-name">{p.cliente || "Sin nombre"}</span>
                <span className="dg-pago-monto">{p.monto ? money(p.monto) : "—"}</span>
              </div>
              <div className="dg-pago-meta">{p.ancho}×{p.alto} cm · {p.forma} · {p.vendedor || "—"} · {p.fecha}</div>
              <div className="dg-pedido-badges">
                <span className="dg-badge" style={{ "--bc": stage.color }}>{stage.stage}</span>
                <span className="dg-badge" style={{ "--bc": p.facturado ? "#52E08A" : "#F16565" }}>
                  {p.facturado ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {p.facturado ? "Facturado" : "Sin facturar"}
                </span>
                <span className="dg-badge" style={{ "--bc": saldo > 0 ? "#F16565" : "#52E08A" }}>
                  <CircleDollarSign size={12} /> {saldo > 0 ? `${money(saldo)} pendiente` : "Saldado"}
                </span>
                <span className="dg-badge" style={{ "--bc": "#8B96A8" }}><MetodoIcon size={12} /> {p.metodo}</span>
                {p.comision === "Liquidar" && <span className="dg-badge" style={{ "--bc": "#F5C451" }}>Liquidar comisión</span>}
                {grupoCounts[p.grupoId || p.id] > 1 && <span className="dg-badge" style={{ "--bc": "#48E0D8" }}><PackagePlus size={12} /> {grupoCounts[p.grupoId || p.id]} espejos del cliente</span>}
              </div>
              {waEntrega && (
                <a className="dg-btn-primary dg-confirmar-entrega-btn" href={waEntrega} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <MessageCircle size={14} /> Confirmar entrega por WhatsApp
                </a>
              )}
              {p.estado === "Espejo listo" && !p.celular && (
                <p className="dg-hint" style={{ marginTop: 8 }}>Sin celular cargado — no se puede armar el link de WhatsApp.</p>
              )}
            </div>
          );
        };
        const grupos = agrupado === "semana" ? groupByWeek(visibles, "fecha") : groupByMonth(visibles, "fecha");
        return (
          <>
            {visibles.length === 0 && <div className="dg-empty">No hay pedidos en esta vista.</div>}
            {visibles.length > 0 && <MonthAccordion groups={grupos} renderItem={renderCard} />}
          </>
        );
      })()}

      {(openPedido || creating || nextDraft) && (
        <PedidoModal
          pedido={openPedido || nextDraft || emptyPedido()}
          vendedores={vendedores}
          canEditFull={canEditFull}
          canEditEstadoOnly={canEditEstadoOnly}
          onClose={() => { setOpenPedido(null); setCreating(false); setNextDraft(null); }}
          onSave={savePedido}
          onDelete={openPedido ? () => removePedido(openPedido.id) : null}
        />
      )}

      <div className="dg-print-area dg-print-pedidos">
        <div className="dg-print-head">
          <div className="dg-print-brand">DECOGLASS</div>
          <div className="dg-print-sub">
            {activeViewLabel}{filtroVendedor !== "todos" ? ` · Vendedor: ${filtroVendedor}` : ""} — {new Date().toLocaleDateString("es-AR")} · {visibles.length} pedido(s)
          </div>
        </div>
        <table className="dg-print-table">
          <thead>
            <tr><th>Orden</th><th>Cliente</th><th>Medida</th><th>Vendedor</th><th>Monto</th><th>Saldo</th><th>Estado</th><th>Comisión</th><th>Factura</th><th>Método</th></tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td>#{p.orden}</td><td>{p.cliente}</td><td>{p.ancho}×{p.alto}</td><td>{p.vendedor}</td>
                <td>{money(p.monto)}</td><td>{money(pedidoSaldo(p))}</td><td>{p.estado}</td><td>{p.comision}</td>
                <td>{p.facturado ? "Sí" : "No"}</td><td>{p.metodo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(quickView === "comision_candidatos" || quickView === "comision_liquidar") && (
          <div className="dg-print-total">Total: {money(totalComision)}</div>
        )}
      </div>
    </div>
  );
}

function Field({ label, computed, children }) {
  return (
    <div className={`dg-field ${computed ? "dg-field-computed" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function PedidoModal({ pedido, vendedores, canEditFull, canEditEstadoOnly, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(pedido);
  const readOnly = !canEditFull && !canEditEstadoOnly;
  const saldo = (Number(draft.monto) || 0) - (Number(draft.anticipo) || 0);

  function set(field, val) { setDraft((d) => ({ ...d, [field]: val })); }

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal dg-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head">
          <div className="dg-modal-title">{draft.orden ? `Pedido #${draft.orden}` : "Nuevo pedido"}</div>
          <button className="dg-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="dg-section-card">
          <div className="dg-section-header"><Calculator size={14} /> Medida y producto</div>
          <div className="dg-field-grid">
            <Field label="Ancho (cm)"><input type="number" disabled={!canEditFull} value={draft.ancho} onChange={(e) => set("ancho", e.target.value)} /></Field>
            <Field label="Alto (cm)"><input type="number" disabled={!canEditFull} value={draft.alto} onChange={(e) => set("alto", e.target.value)} /></Field>
            <Field label="Cantidad"><input type="number" disabled={!canEditFull} value={draft.cant} onChange={(e) => set("cant", e.target.value)} /></Field>
            <Field label="Pulido"><select disabled={!canEditFull} value={draft.pulido} onChange={(e) => set("pulido", e.target.value)}>{PULIDO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
          </div>
          <div className="dg-field-grid" style={{ marginTop: 12 }}>
            <Field label="Forma"><select disabled={!canEditFull} value={draft.forma} onChange={(e) => set("forma", e.target.value)}>{FORMA_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Tipo"><select disabled={!canEditFull} value={draft.tipo} onChange={(e) => set("tipo", e.target.value)}>{TIPO_PEDIDO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Grabado / esmerilado"><input disabled={!canEditFull} placeholder="Ej: 15+30" value={draft.grabado} onChange={(e) => set("grabado", e.target.value)} /></Field>
          </div>
        </div>

        <div className="dg-section-card">
          <div className="dg-section-header"><Sparkles size={14} /> Funciones</div>
          <div className="dg-field-grid">
            <Field label="Touch"><select disabled={!canEditFull} value={draft.touch} onChange={(e) => set("touch", e.target.value)}>{TOUCH_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Desempañante"><select disabled={!canEditFull} value={draft.desemp} onChange={(e) => set("desemp", e.target.value)}>{DESEMP_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Hora / Temp"><select disabled={!canEditFull} value={draft.horaTemp} onChange={(e) => set("horaTemp", e.target.value)}>{HORATEMP_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Bluetooth"><select disabled={!canEditFull} value={draft.bluetooth} onChange={(e) => set("bluetooth", e.target.value)}>{BLUETOOTH_PEDIDO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Tono de luz"><select disabled={!canEditFull} value={draft.tono} onChange={(e) => set("tono", e.target.value)}>{TONO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
          </div>
        </div>

        <div className="dg-section-card">
          <div className="dg-section-header"><User size={14} /> Cliente y pago</div>
          <div className="dg-field-grid">
            <Field label="Cliente"><input disabled={!canEditFull} value={draft.cliente} onChange={(e) => set("cliente", e.target.value)} /></Field>
            <Field label="Vendedor"><select disabled={!canEditFull} value={draft.vendedor} onChange={(e) => set("vendedor", e.target.value)}><option value="">—</option>{vendedores.map((v) => (<option key={v}>{v}</option>))}</select></Field>
            <Field label="Celular"><input disabled={!canEditFull} value={draft.celular} onChange={(e) => set("celular", e.target.value)} /></Field>
            <Field label="DNI/CUIT"><input disabled={!canEditFull} value={draft.dniCuit} onChange={(e) => set("dniCuit", e.target.value)} /></Field>
            <Field label="Tipo factura"><select disabled={!canEditFull} value={draft.tipoFactura} onChange={(e) => set("tipoFactura", e.target.value)}>{TIPOFACTURA_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Facturado">
              <button type="button" disabled={!canEditFull} className={`dg-checkbox-field ${draft.facturado ? "dg-checkbox-field-on" : ""}`} onClick={() => set("facturado", !draft.facturado)}>
                {draft.facturado ? <Check size={14} /> : null} {draft.facturado ? "Facturado" : "Sin facturar"}
              </button>
            </Field>
            <Field label="Comisión"><select disabled={!canEditFull} value={draft.comision} onChange={(e) => set("comision", e.target.value)}>{COMISION_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
          </div>
          <div className="dg-field-grid dg-money-row">
            <Field label="Monto"><input type="number" disabled={!canEditFull} value={draft.monto} onChange={(e) => set("monto", e.target.value)} /></Field>
            <Field label="Anticipo"><input type="number" disabled={!canEditFull} value={draft.anticipo} onChange={(e) => set("anticipo", e.target.value)} /></Field>
            <Field label="Saldo" computed><input disabled value={money(saldo)} /></Field>
          </div>
          {canEditFull && Number(draft.anticipo) > 0 && (
            <p className="dg-hint" style={{ marginTop: 10 }}>
              Al guardar, {money(Math.max(0, Number(draft.anticipo || 0) - Number(draft.montoRegistrado || 0)))} se registran como ingreso en <strong>{CUENTA_INGRESO[determineCuentaPedido(draft)]}</strong>.
            </p>
          )}
        </div>

        <div className="dg-section-card">
          <div className="dg-section-header"><Truck size={14} /> Entrega</div>
          <div className="dg-field-grid">
            <Field label="Estado"><select disabled={readOnly} value={draft.estado} onChange={(e) => set("estado", e.target.value)}>{ESTADO_PEDIDO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Listo para (fecha)"><input type="date" disabled={readOnly} value={draft.listo} onChange={(e) => set("listo", e.target.value)} /></Field>
            <Field label="Método de entrega"><select disabled={!canEditFull} value={draft.metodo} onChange={(e) => set("metodo", e.target.value)}>{METODO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
          </div>
          <div className="dg-field-grid" style={{ marginTop: 12 }}>
            <Field label="Dirección / detalle de entrega"><input disabled={!canEditFull} value={draft.detalleEntrega} onChange={(e) => set("detalleEntrega", e.target.value)} placeholder="Dirección, costo de envío..." /></Field>
            <Field label="Piso / Depto"><input disabled={!canEditFull} value={draft.piso} onChange={(e) => set("piso", e.target.value)} /></Field>
            <Field label="Horario de entrega"><input disabled={!canEditFull} value={draft.horarioEntrega} onChange={(e) => set("horarioEntrega", e.target.value)} placeholder="Ej: Mañana 9 a 13 hs" /></Field>
          </div>
        </div>

        <div className="dg-form-actions" style={{ marginTop: 4 }}>
          {onDelete && canEditFull && <button className="dg-btn-ghost" onClick={onDelete}><Trash2 size={14} /> Eliminar</button>}
          {canEditFull && (
            <button className="dg-btn-ghost" onClick={() => onSave(draft, { addAnother: true })}>
              <PackagePlus size={14} /> Guardar y agregar otro espejo del mismo cliente
            </button>
          )}
          {!readOnly && <button className="dg-btn-primary" onClick={() => onSave(draft)}><Save size={14} /> Guardar</button>}
        </div>
      </div>
    </div>
  );
}

function EnviosPostventaPanel({ pedidos, onChange, canEdit }) {
  const [busqueda, setBusqueda] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const envios = pedidos
    .filter((p) => p.metodo === "Envío" || p.metodo === "Envío flex" || p.metodo === "Interior")
    .filter((p) => p.estado !== "Entregado")
    .filter((p) => !busqueda.trim() || p.cliente.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));

  function update(id, patch) { onChange(pedidos.map((p) => (p.id === id ? { ...p, ...patch } : p))); }

  function mensaje(p) {
    const saldo = pedidoSaldo(p);
    const saldoTexto = saldo > 0 ? `💰 Saldo pendiente: ${money(saldo)}` : "💰 Ya está todo abonado, no queda saldo pendiente.";
    return `Hola ${p.cliente || ""}, te confirmamos los datos de tu envío:\n\nEspejo ${p.ancho}×${p.alto} cm\n📞 Teléfono: ${p.celular || "(sin dato)"}\n📍 Dirección: ${p.detalleEntrega || "(a confirmar)"}\n🏢 Piso / Depto: ${p.piso || "(sin dato)"}\n🕐 Horario de entrega: ${p.horarioEntrega || "a coordinar"}\n📅 Fecha estimada: ${p.listo || "a coordinar"}\n\n${saldoTexto}\n\n¿Podés confirmarnos que estos datos son correctos?`;
  }
  function copiar(p) {
    if (navigator.clipboard) navigator.clipboard.writeText(mensaje(p)).then(() => { setCopiedId(p.id); setTimeout(() => setCopiedId(null), 2000); });
  }

  return (
    <div className="dg-page">
      <div className="dg-crm-filters"><Filter size={14} /><input className="dg-pedido-search" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
      <div className="dg-task-list dg-pedido-list">
        {envios.length === 0 && <div className="dg-empty">No hay pedidos con envío o interior pendientes.</div>}
        {envios.map((p) => (
          <div className="dg-section-card" key={p.id}>
            <div className="dg-section-header"><Truck size={14} /> #{p.orden} · {p.cliente} {p.envioConfirmado && <span className="dg-badge" style={{ "--bc": "#52E08A", marginLeft: 8 }}><CheckCircle2 size={12} /> Confirmado</span>}</div>
            <div className="dg-pago-meta" style={{ marginBottom: 10 }}>{p.ancho}×{p.alto} cm · {p.forma} · Método: {p.metodo}</div>
            <div className="dg-field-grid">
              <Field label="Teléfono de contacto"><input disabled={!canEdit} value={p.celular} onChange={(e) => update(p.id, { celular: e.target.value })} /></Field>
              <Field label="Dirección"><input disabled={!canEdit} value={p.detalleEntrega} onChange={(e) => update(p.id, { detalleEntrega: e.target.value })} /></Field>
              <Field label="Piso / Depto"><input disabled={!canEdit} value={p.piso} onChange={(e) => update(p.id, { piso: e.target.value })} /></Field>
            </div>
            <div className="dg-field-grid" style={{ marginTop: 12 }}>
              <Field label="Horario de entrega"><input disabled={!canEdit} value={p.horarioEntrega} onChange={(e) => update(p.id, { horarioEntrega: e.target.value })} placeholder="Ej: Mañana 9 a 13 hs" /></Field>
              <Field label="Fecha estimada"><input type="date" disabled={!canEdit} value={p.listo} onChange={(e) => update(p.id, { listo: e.target.value })} /></Field>
            </div>
            <div className="dg-quote-actions" style={{ marginTop: 10 }}>
              <button className="dg-btn-ghost" onClick={() => copiar(p)}>{copiedId === p.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === p.id ? "Copiado" : "Copiar mensaje para el cliente"}</button>
              {p.estado === "Espejo listo" && entregaWaLink(p) && (
                <a className="dg-btn-primary dg-confirmar-entrega-btn" href={entregaWaLink(p)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={14} /> Confirmar entrega por WhatsApp
                </a>
              )}
              {canEdit && !p.envioConfirmado && (
                <button className="dg-btn-primary" onClick={() => update(p.id, { envioConfirmado: true })}><CheckCircle2 size={14} /> Confirmar envío</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacturasManualesPanel({ facturas, onChange, isAdmin }) {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [cuit, setCuit] = useState("");
  const [detalle, setDetalle] = useState("");

  function addFactura() {
    if (!nombre.trim()) return;
    onChange([{ id: uid(), nombre: nombre.trim(), monto: Number(monto) || 0, cuit: cuit.trim(), detalle: detalle.trim(), listo: false, fecha: new Date().toISOString().slice(0, 10) }, ...facturas]);
    setNombre(""); setMonto(""); setCuit(""); setDetalle("");
  }
  function toggleListo(id) { onChange(facturas.map((f) => (f.id === id ? { ...f, listo: !f.listo } : f))); }
  function removeFactura(id) { onChange(facturas.filter((f) => f.id !== id)); }

  return (
    <div className="dg-page">
      {isAdmin && (
        <div className="dg-section-card">
          <div className="dg-section-header"><FileText size={14} /> Cargar factura a hacer</div>
          <div className="dg-field-grid">
            <Field label="Nombre / Cliente"><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></Field>
            <Field label="Monto"><input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} /></Field>
            <Field label="CUIT"><input value={cuit} onChange={(e) => setCuit(e.target.value)} /></Field>
          </div>
          <div className="dg-field-grid" style={{ marginTop: 12 }}>
            <Field label="Detalle"><input value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Concepto de la factura" /></Field>
          </div>
          <div className="dg-form-actions"><button className="dg-btn-primary" onClick={addFactura}><Plus size={16} /> Agregar</button></div>
        </div>
      )}
      <div className="dg-task-list">
        {facturas.length === 0 && <div className="dg-empty">No hay facturas pendientes cargadas.</div>}
        {facturas.map((f) => (
          <div className="dg-task" key={f.id}>
            <button className={`dg-checkbox ${f.listo ? "dg-checkbox-on" : ""}`} onClick={() => toggleListo(f.id)} />
            <div className="dg-pago-info">
              <span className={f.listo ? "dg-task-done" : ""}>{f.nombre} — {money(f.monto)}</span>
              <span className="dg-pago-meta">CUIT: {f.cuit || "—"} · {f.detalle || "sin detalle"} · {f.fecha}</span>
            </div>
            {isAdmin && <button className="dg-icon-btn dg-task-del" onClick={() => removeFactura(f.id)}><Trash2 size={14} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReclamosPanel({ reclamos, onChange }) {
  const [tipo, setTipo] = useState(null);
  const [cliente, setCliente] = useState("");
  const [notas, setNotas] = useState("");

  function addReclamo() {
    if (!tipo) return;
    onChange([{ id: uid(), tipo, cliente: cliente.trim(), notas: notas.trim(), fecha: new Date().toISOString().slice(0, 10) }, ...reclamos]);
    setTipo(null); setCliente(""); setNotas("");
  }
  function removeReclamo(id) { onChange(reclamos.filter((r) => r.id !== id)); }

  const chartData = RECLAMO_TIPOS.map((t, i) => ({ tipo: t, cantidad: reclamos.filter((r) => r.tipo === t).length, fill: RECLAMO_COLORS[i] }));

  return (
    <div className="dg-page">
      <div className="dg-chart-card" style={{ marginBottom: 16 }}>
        <div className="dg-chart-title">Reclamos por tipo — qué falla más seguido</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="tipo" stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} width={130} />
            <Tooltip contentStyle={{ background: "#161B26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
              {chartData.map((d, i) => (<Cell key={i} fill={d.fill} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dg-section-card">
        <div className="dg-section-header"><AlertTriangle size={14} /> Cargar reclamo</div>
        <div className="dg-quick-buttons" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {RECLAMO_TIPOS.map((t, i) => (
            <button key={t} className="dg-quick-btn" style={{ "--c": RECLAMO_COLORS[i], opacity: tipo === t ? 1 : 0.75 }} onClick={() => setTipo(t)}>
              <AlertTriangle size={18} /><span>{t}</span>
            </button>
          ))}
        </div>
        {tipo && (
          <div className="dg-quick-inline" style={{ marginTop: 12 }}>
            <input placeholder="Cliente (opcional)" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            <input placeholder="Notas (opcional)" value={notas} onChange={(e) => setNotas(e.target.value)} />
            <button className="dg-btn-ghost" onClick={() => setTipo(null)}>Cancelar</button>
            <button className="dg-btn-primary" onClick={addReclamo}><Check size={14} /> Guardar reclamo: {tipo}</button>
          </div>
        )}
      </div>

      <div className="dg-task-list" style={{ marginTop: 14 }}>
        {reclamos.length === 0 && <div className="dg-empty">No hay reclamos cargados todavía.</div>}
        {reclamos.slice(0, 100).map((r) => (
          <div className="dg-task dg-reclamo-row" key={r.id}>
            <span className="dg-badge" style={{ "--bc": RECLAMO_COLORS[RECLAMO_TIPOS.indexOf(r.tipo)] || "#8B96A8" }}>{r.tipo}</span>
            <div className="dg-pago-info">
              <span>{r.cliente || "Sin cliente"}{r.notas ? ` — ${r.notas}` : ""}</span>
              {r.solucion && <span className="dg-pago-meta">Solución: {r.solucion}</span>}
            </div>
            {r.estado && <span className="dg-badge" style={{ "--bc": r.estado.toLowerCase().includes("final") ? "#52E08A" : "#F5C451" }}>{r.estado}</span>}
            <span className="dg-pago-meta">{r.fecha}</span>
            <button className="dg-icon-btn dg-task-del" onClick={() => removeReclamo(r.id)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnviosLogisticaPanel({ pedidos, onChange, canEdit }) {
  const confirmados = pedidos
    .filter((p) => ENVIO_METODOS.includes(p.metodo) && p.envioConfirmado && p.estado !== "Entregado")
    .sort((a, b) => (a.listo || "9999").localeCompare(b.listo || "9999"));

  function toggle(id, field) { onChange(pedidos.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))); }
  function marcarEntregado(id) { onChange(pedidos.map((p) => (p.id === id ? { ...p, estado: "Entregado" } : p))); }

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>Estos son los envíos que PostVenta ya confirmó con el cliente, ordenados por fecha estimada.</p>
      <div className="dg-task-list dg-pedido-list">
        {confirmados.length === 0 && <div className="dg-empty">No hay envíos confirmados pendientes de entregar.</div>}
        {confirmados.map((p) => (
          <div className="dg-pedido-card" key={p.id}>
            <div className="dg-pedido-card-top">
              <span className="dg-pedido-orden">#{p.orden}</span>
              <span className="dg-lead-name">{p.cliente}</span>
              <span className="dg-pago-meta">{p.listo || "sin fecha"}</span>
            </div>
            <div className="dg-pago-meta">{p.ancho}×{p.alto} cm · {p.metodo} · {p.detalleEntrega || "sin dirección"}</div>
            {canEdit && (
              <div className="dg-fabrica-actions">
                <button className={`dg-fabrica-btn ${p.envioPagado ? "dg-fabrica-btn-listo dg-checkbox-on" : ""}`} onClick={() => toggle(p.id, "envioPagado")}>
                  <CircleDollarSign size={16} /> {p.envioPagado ? "Envío pagado ✓" : "Marcar envío pagado"}
                </button>
                <button className="dg-fabrica-btn dg-fabrica-btn-listo" onClick={() => marcarEntregado(p.id)}><Check size={16} /> Marcar entregado</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StockEspejosPanel({ stock, onChange, canEdit }) {
  const [modelo, setModelo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [espesor, setEspesor] = useState("");
  const [funciones, setFunciones] = useState("");
  const [cantidad, setCantidad] = useState("");

  function addItem() {
    if (!descripcion.trim()) return;
    onChange([{ id: uid(), modelo: modelo.trim(), descripcion: descripcion.trim(), espesor: espesor.trim(), funciones: funciones.trim(), cantidad: Number(cantidad) || 0 }, ...stock]);
    setModelo(""); setDescripcion(""); setEspesor(""); setFunciones(""); setCantidad("");
  }
  function updateCantidad(id, val) { onChange(stock.map((s) => (s.id === id ? { ...s, cantidad: Number(val) || 0 } : s))); }
  function removeItem(id) { onChange(stock.filter((s) => s.id !== id)); }

  return (
    <div className="dg-page">
      {canEdit && (
        <div className="dg-section-card">
          <div className="dg-section-header"><Package size={14} /> Agregar modelo al stock</div>
          <div className="dg-field-grid">
            <Field label="Modelo / código"><input value={modelo} onChange={(e) => setModelo(e.target.value)} /></Field>
            <Field label="Descripción"><input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: 70Ø - Esmerilado" /></Field>
            <Field label="Espesor"><input value={espesor} onChange={(e) => setEspesor(e.target.value)} placeholder="4mm" /></Field>
          </div>
          <div className="dg-field-grid" style={{ marginTop: 12 }}>
            <Field label="Funciones"><input value={funciones} onChange={(e) => setFunciones(e.target.value)} placeholder="Touch 3 tonos + Desempañante" /></Field>
            <Field label="Cantidad"><input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} /></Field>
          </div>
          <div className="dg-form-actions"><button className="dg-btn-primary" onClick={addItem}><Plus size={16} /> Agregar</button></div>
        </div>
      )}
      <div className="dg-task-list">
        {stock.length === 0 && <div className="dg-empty">No hay modelos cargados en stock.</div>}
        {stock.map((s) => (
          <div className="dg-task" key={s.id}>
            <div className="dg-pago-info">
              <span>{s.modelo ? `#${s.modelo} — ` : ""}{s.descripcion}</span>
              <span className="dg-pago-meta">{s.espesor || "—"} · {s.funciones || "sin funciones"}</span>
            </div>
            <input type="number" className="dg-stock-cantidad" disabled={!canEdit} value={s.cantidad} onChange={(e) => updateCantidad(s.id, e.target.value)} />
            {canEdit && <button className="dg-icon-btn dg-task-del" onClick={() => removeItem(s.id)}><Trash2 size={14} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function FabricaPedidosPage({ pedidos, onChange, canEdit }) {
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [busqueda, setBusqueda] = useState("");
  const [agrupado, setAgrupado] = useState("mes");

  const activos = pedidos.filter((p) => p.estado !== "Entregado" && p.estado !== "Cancelado");
  let visibles = filtroEstado === "activos" ? activos : filtroEstado === "demorados" ? pedidos.filter((p) => p.demorado) : pedidos;
  visibles = visibles
    .filter((p) => !busqueda.trim() || p.cliente.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));

  function setEstado(id, estado) { onChange(pedidos.map((p) => (p.id === id ? { ...p, estado } : p))); }
  function toggleDemorado(id) { onChange(pedidos.map((p) => (p.id === id ? { ...p, demorado: !p.demorado } : p))); }
  function cancelar(id) { if (window.confirm("¿Cancelar este pedido?")) setEstado(id, "Cancelado"); }
  function borrar(id) { if (window.confirm("¿Borrar este pedido definitivamente? No se puede deshacer.")) onChange(pedidos.filter((p) => p.id !== id)); }

  const funcionesTexto = (p) => {
    const f = [];
    if (p.touch === "Touch") f.push("Touch");
    if (p.desemp === "Desempañante") f.push("Desempañante");
    if (p.horaTemp === "Hora y Temperatura") f.push("Hora/Temp");
    if (p.bluetooth !== "No") f.push(p.bluetooth);
    return f.length ? f.join(" · ") : "Sin funciones extra";
  };

  const grupos = agrupado === "semana" ? groupByWeek(visibles, "fecha") : groupByMonth(visibles, "fecha");

  const renderCard = (p) => {
    const stage = ESTADO_STAGE[p.estado] || { stage: p.estado, color: "#8B96A8" };
    return (
      <div className="dg-pedido-card dg-fabrica-card" key={p.id}>
        <div className="dg-pedido-card-top">
          <span className="dg-pedido-orden">#{p.orden}</span>
          <span className="dg-lead-name">{p.cliente || "Sin nombre"}</span>
        </div>
        <div className="dg-pago-meta">{p.ancho}×{p.alto} cm · {p.forma} · {p.tipo}{p.grabado ? ` (${p.grabado})` : ""}</div>
        <div className="dg-pago-meta">{funcionesTexto(p)}</div>
        <div className="dg-pedido-badges">
          <span className="dg-badge" style={{ "--bc": stage.color }}>{stage.stage}</span>
          {p.demorado && <span className="dg-badge" style={{ "--bc": "#F16565" }}><AlertTriangle size={12} /> Demorado</span>}
          {p.listo && <span className="dg-badge dg-badge-entrega"><Truck size={12} /> Entrega: {p.listo}</span>}
        </div>
        {canEdit && (
          <div className="dg-fabrica-actions">
            <button className="dg-fabrica-btn dg-fabrica-btn-listo" onClick={() => setEstado(p.id, "Espejo listo")}><Check size={15} /> Listo</button>
            <button className={`dg-fabrica-btn dg-fabrica-btn-demora ${p.demorado ? "dg-fabrica-btn-demora-on" : ""}`} onClick={() => toggleDemorado(p.id)}><AlertTriangle size={15} /> {p.demorado ? "Sin demora" : "Demorado"}</button>
            <button className="dg-fabrica-btn dg-fabrica-btn-cancel" onClick={() => cancelar(p.id)}><XCircle size={15} /> Cancelar</button>
            <button className="dg-fabrica-btn dg-fabrica-btn-cancel" onClick={() => borrar(p.id)}><Trash2 size={15} /> Borrar</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dg-page">
      <div className="dg-crm-filters">
        <Filter size={14} />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="activos">Pedidos activos</option>
          <option value="demorados">Solo demorados</option>
          <option value="todos">Todos</option>
        </select>
        <input className="dg-pedido-search" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <div className="dg-periodo-toggle">
          <button className={agrupado === "mes" ? "dg-periodo-on" : ""} onClick={() => setAgrupado("mes")}>Mes</button>
          <button className={agrupado === "semana" ? "dg-periodo-on" : ""} onClick={() => setAgrupado("semana")}>Semana</button>
        </div>
      </div>

      {visibles.length === 0 && <div className="dg-empty">No hay pedidos en esta vista.</div>}
      {visibles.length > 0 && <MonthAccordion groups={grupos} renderItem={renderCard} />}
    </div>
  );
}

function CRMPage({ leads, onLeadsChange, vendedores, onVendedoresChange, isAdmin }) {
  const [soyYo, setSoyYo] = useState(vendedores[0] || "");
  const [filtroVendedor, setFiltroVendedor] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [nuevoVendedor, setNuevoVendedor] = useState("");
  const [quickType, setQuickType] = useState(null);
  const [quickNombre, setQuickNombre] = useState("");
  const [quickMonto, setQuickMonto] = useState("");
  const [justAdded, setJustAdded] = useState(null);

  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [instagram, setInstagram] = useState("");
  const [canal, setCanal] = useState("whatsapp");
  const [vendedorLead, setVendedorLead] = useState(vendedores[0] || "");
  const [estado, setEstado] = useState("mensaje_enviado");
  const [monto, setMonto] = useState("");
  const [notas, setNotas] = useState("");

  function quickAdd() {
    if (!quickType) return;
    const lead = {
      id: uid(), cliente: quickNombre.trim() || "Contacto rápido", telefono: "", instagram: "",
      canal: "whatsapp", vendedor: soyYo, estado: quickType,
      monto: quickType === "venta_cerrada" ? Number(quickMonto) || 0 : 0,
      notas: "", fecha: new Date().toISOString().slice(0, 10),
    };
    onLeadsChange([lead, ...leads]);
    setQuickType(null); setQuickNombre(""); setQuickMonto("");
    setJustAdded(QUICK_BUTTONS.find((b) => b.estado === lead.estado)?.label || "Agregado");
    setTimeout(() => setJustAdded(null), 1800);
  }

  const stats = vendedores.map((v) => {
    const propios = leads.filter((l) => l.vendedor === v);
    const mensajesIniciados = propios.length;
    const respondieron = propios.filter((l) => l.estado === "respondio" || l.estado === "venta_cerrada" || l.estado === "perdido").length;
    const noRespondieron = propios.filter((l) => l.estado === "no_respondio").length;
    const ventasCerradas = propios.filter((l) => l.estado === "venta_cerrada").length;
    const importeVendido = propios.filter((l) => l.estado === "venta_cerrada").reduce((a, l) => a + Number(l.monto || 0), 0);
    return {
      vendedor: v, mensajesIniciados, respondieron, noRespondieron, ventasCerradas, importeVendido,
      pctRespuesta: mensajesIniciados ? Math.round((respondieron / mensajesIniciados) * 100) : 0,
      pctConversion: mensajesIniciados ? Math.round((ventasCerradas / mensajesIniciados) * 100) : 0,
    };
  });

  const chartData = stats.map((s) => ({ vendedor: s.vendedor, Mensajes: s.mensajesIniciados, Respondieron: s.respondieron, Ventas: s.ventasCerradas }));

  const visibles = leads
    .filter((l) => filtroVendedor === "todos" || l.vendedor === filtroVendedor)
    .filter((l) => filtroEstado === "todos" || l.estado === filtroEstado)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  function addLead() {
    if (!cliente.trim()) return;
    const next = [{ id: uid(), cliente: cliente.trim(), telefono: telefono.trim(), instagram: instagram.trim(), canal, vendedor: vendedorLead, estado, monto: Number(monto) || 0, notas: notas.trim(), fecha: new Date().toISOString().slice(0, 10) }, ...leads];
    onLeadsChange(next);
    setCliente(""); setTelefono(""); setInstagram(""); setMonto(""); setNotas("");
  }
  function updateLeadEstado(id, val) { onLeadsChange(leads.map((l) => (l.id === id ? { ...l, estado: val } : l))); }
  function removeLead(id) { onLeadsChange(leads.filter((l) => l.id !== id)); }
  function addVendedor() {
    if (!nuevoVendedor.trim() || vendedores.includes(nuevoVendedor.trim())) return;
    onVendedoresChange([...vendedores, nuevoVendedor.trim()]);
    setNuevoVendedor("");
  }
  function removeVendedor(v) { onVendedoresChange(vendedores.filter((x) => x !== v)); }

  return (
    <div className="dg-page">
      <div className="dg-crm-top">
        <div className="dg-crm-soyyo">
          <User size={14} />
          <span>Soy:</span>
          <select value={soyYo} onChange={(e) => { setSoyYo(e.target.value); setVendedorLead(e.target.value); }}>
            {vendedores.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
        </div>
        {isAdmin && (
          <div className="dg-crm-vendedores-admin">
            <input placeholder="Nuevo vendedor..." value={nuevoVendedor} onChange={(e) => setNuevoVendedor(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addVendedor()} />
            <button className="dg-btn-ghost" onClick={addVendedor}><UserPlus size={14} /></button>
            {vendedores.map((v) => (
              <span key={v} className="dg-vendedor-chip">{v}<button onClick={() => removeVendedor(v)}><X size={11} /></button></span>
            ))}
          </div>
        )}
      </div>

      <div className="dg-quick-actions">
        <div className="dg-quick-title">Registro rápido — {soyYo}</div>
        <div className="dg-quick-buttons">
          {QUICK_BUTTONS.map((b) => {
            const Icon = QUICK_ICONS[b.icon];
            return (
              <button key={b.estado} className="dg-quick-btn" style={{ "--c": b.color }} onClick={() => setQuickType(b.estado)}>
                <Icon size={22} />
                <span>{b.label}</span>
              </button>
            );
          })}
        </div>
        {quickType && (
          <div className="dg-quick-inline">
            <input placeholder="Nombre del cliente (opcional)" value={quickNombre} onChange={(e) => setQuickNombre(e.target.value)} autoFocus />
            {quickType === "venta_cerrada" && (
              <input type="number" placeholder="Monto vendido" value={quickMonto} onChange={(e) => setQuickMonto(e.target.value)} />
            )}
            <button className="dg-btn-ghost" onClick={() => { setQuickType(null); setQuickNombre(""); setQuickMonto(""); }}>Cancelar</button>
            <button className="dg-btn-primary" onClick={quickAdd}><Check size={14} /> Confirmar</button>
          </div>
        )}
        {justAdded && <div className="dg-quick-toast">✓ {justAdded} — agregado</div>}
      </div>

      <div className="dg-chart-card" style={{ marginBottom: 16 }}>
        <div className="dg-chart-title"><BarChart3 size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "-2px" }} />Comparativa por vendedor</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="vendedor" stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} width={30} />
            <Tooltip contentStyle={{ background: "#161B26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="Mensajes" fill="#8B96A8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Respondieron" fill="#48E0D8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Ventas" fill="#52E08A" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dg-vendor-stats">
        {stats.map((s) => (
          <div className="dg-vendor-card" key={s.vendedor}>
            <div className="dg-vendor-name">{s.vendedor}</div>
            <div className="dg-vendor-metrics">
              <div><span>Mensajes</span><strong>{s.mensajesIniciados}</strong></div>
              <div><span>Respondieron</span><strong>{s.respondieron}</strong></div>
              <div><span>No respondieron</span><strong>{s.noRespondieron}</strong></div>
              <div><span>Ventas cerradas</span><strong>{s.ventasCerradas}</strong></div>
              <div><span>% respuesta</span><strong>{s.pctRespuesta}%</strong></div>
              <div><span>% conversión</span><strong>{s.pctConversion}%</strong></div>
            </div>
            <div className="dg-vendor-importe">{money(s.importeVendido)} vendido</div>
          </div>
        ))}
      </div>

      <div className="dg-crm-filters">
        <Filter size={14} />
        <select value={filtroVendedor} onChange={(e) => setFiltroVendedor(e.target.value)}>
          <option value="todos">Todos los vendedores</option>
          {vendedores.map((v) => (<option key={v} value={v}>{v}</option>))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {Object.entries(LEAD_STATES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
        </select>
        <button className="dg-btn-primary" style={{ marginLeft: "auto" }} onClick={() => setShowForm((v) => !v)}><Plus size={14} /> Nuevo contacto</button>
      </div>

      {showForm && (
        <div className="dg-form dg-pago-form">
          <div className="dg-form-row">
            <div style={{ flex: 1 }}><label>Cliente</label><input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nombre" /></div>
            <div style={{ flex: 1 }}><label>Vendedor</label>
              <select value={vendedorLead} onChange={(e) => setVendedorLead(e.target.value)}>{vendedores.map((v) => (<option key={v} value={v}>{v}</option>))}</select>
            </div>
          </div>
          <div className="dg-form-row">
            <div style={{ flex: 1 }}><label>Teléfono (WhatsApp)</label><input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: 1122334455" /></div>
            <div style={{ flex: 1 }}><label>Usuario Instagram</label><input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@usuario" /></div>
          </div>
          <div className="dg-form-row">
            <div style={{ flex: 1 }}><label>Canal de origen</label>
              <select value={canal} onChange={(e) => setCanal(e.target.value)}>{Object.entries(LEAD_CHANNELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select>
            </div>
            <div style={{ flex: 1 }}><label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>{Object.entries(LEAD_STATES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}</select>
            </div>
          </div>
          {estado === "venta_cerrada" && (<><label>Monto vendido</label><input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} /></>)}
          <label>Notas</label><input value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Opcional" />
          <div className="dg-form-actions"><button className="dg-btn-primary" onClick={addLead}><Plus size={16} /> Guardar contacto</button></div>
        </div>
      )}

      <div className="dg-task-list dg-lead-list">
        {visibles.length === 0 && <div className="dg-empty">No hay contactos en esta vista.</div>}
        {visibles.map((l) => {
          const wa = waLink(l.telefono);
          const ig = igLink(l.instagram);
          const st = LEAD_STATES[l.estado] || LEAD_STATES.mensaje_enviado;
          return (
            <div className="dg-lead-row" key={l.id}>
              <div className="dg-lead-main">
                <span className="dg-lead-dot" style={{ background: st.color }} />
                <div className="dg-lead-info">
                  <span className="dg-lead-name">{l.cliente}</span>
                  <span className="dg-pago-meta">{l.vendedor} · {LEAD_CHANNELS[l.canal]} · {l.fecha}{l.notas ? ` · ${l.notas}` : ""}</span>
                </div>
              </div>
              <div className="dg-lead-actions">
                {wa && <a className="dg-icon-btn" href={wa} target="_blank" rel="noopener noreferrer" title="Abrir WhatsApp"><MessageCircle size={15} /></a>}
                {ig && <a className="dg-icon-btn" href={ig} target="_blank" rel="noopener noreferrer" title="Abrir Instagram"><Instagram size={15} /></a>}
                <select className="dg-lead-estado-select" value={l.estado} onChange={(e) => updateLeadEstado(l.id, e.target.value)} style={{ color: st.color }}>
                  {Object.entries(LEAD_STATES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
                </select>
                <button className="dg-icon-btn dg-task-del" onClick={() => removeLead(l.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TIPOS_PRODUCTO_LIST = Object.keys(TIPO_PRODUCTO_TABLE);

function QuotePage({ config, onConfigChange, quotes, onQuotesChange, isAdmin }) {
  const [tipoProducto, setTipoProducto] = useState(TIPOS_PRODUCTO_LIST[0]);
  const [ancho, setAncho] = useState(60);
  const [alto, setAlto] = useState(60);
  const [touch, setTouch] = useState("No");
  const [desemp, setDesemp] = useState("No");
  const [horaTemp, setHoraTemp] = useState("No");
  const [bluetoothSel, setBluetoothSel] = useState("Sin Bluetooth");
  const [panelesAdicionales, setPanelesAdicionales] = useState(0);
  const [envioInterior, setEnvioInterior] = useState("No");
  const [tipoCliente, setTipoCliente] = useState("Consumidor Final");
  const [cantidad, setCantidad] = useState(1);
  const [cliente, setCliente] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputs = { tipoProducto, ancho: Number(ancho) || 0, alto: Number(alto) || 0, touch, desemp, horaTemp, bluetoothSel, panelesAdicionales: Number(panelesAdicionales) || 0, envioInterior, tipoCliente, cantidad: Number(cantidad) || 1, cliente };
  const result = computeQuote(inputs, config);
  const mensaje = buildWhatsappMessage(inputs, result);

  function copyMessage() {
    if (navigator.clipboard) navigator.clipboard.writeText(mensaje).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  function saveQuote() {
    const q = { id: uid(), fecha: new Date().toISOString().slice(0, 10), cliente: cliente || "Sin nombre", tipoProducto, medida: `${ancho}x${alto}`, cantidad: inputs.cantidad, precioTransferencia: result.precioTransferencia, precio3Cuotas: result.precio3Cuotas };
    onQuotesChange([q, ...quotes]);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }
  function removeQuote(id) { onQuotesChange(quotes.filter((q) => q.id !== id)); }

  return (
    <div className="dg-page">
      <div className="dg-quote-grid">
        <div className="dg-quote-form">
          <div className="dg-section-card">
            <div className="dg-section-header"><Calculator size={14} /> Datos del espejo</div>
            <div className="dg-field-grid">
              <Field label="Tipo de producto">
                <select value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)}>
                  {TIPOS_PRODUCTO_LIST.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </Field>
              <Field label="Ancho (cm)"><input type="number" value={ancho} onChange={(e) => setAncho(e.target.value)} /></Field>
              <Field label="Alto (cm)"><input type="number" value={alto} onChange={(e) => setAlto(e.target.value)} /></Field>
            </div>
          </div>

          <div className="dg-section-card">
            <div className="dg-section-header"><Sparkles size={14} /> Funciones</div>
            <div className="dg-field-grid">
              <Field label="Touch"><select value={touch} onChange={(e) => setTouch(e.target.value)}><option>No</option><option>Sí</option></select></Field>
              <Field label="Desempañante"><select value={desemp} onChange={(e) => setDesemp(e.target.value)}><option>No</option><option>Sí</option></select></Field>
              <Field label="Hora / Temperatura"><select value={horaTemp} onChange={(e) => setHoraTemp(e.target.value)}><option>No</option><option>Sí</option></select></Field>
              <Field label="Bluetooth">
                <select value={bluetoothSel} onChange={(e) => setBluetoothSel(e.target.value)}>
                  {Object.keys(config.opcionales.bluetooth).map((k) => (<option key={k} value={k}>{k}</option>))}
                </select>
              </Field>
              {desemp === "Sí" && (
                <Field label="Paneles adicionales"><input type="number" min="0" value={panelesAdicionales} onChange={(e) => setPanelesAdicionales(e.target.value)} /></Field>
              )}
            </div>
          </div>

          <div className="dg-section-card">
            <div className="dg-section-header"><User size={14} /> Cliente y entrega</div>
            <div className="dg-field-grid">
              <Field label="Tipo de cliente">
                <select value={tipoCliente} onChange={(e) => setTipoCliente(e.target.value)}>
                  <option>Consumidor Final</option><option>Revendedor</option>
                </select>
              </Field>
              <Field label="Cantidad idéntica"><input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} /></Field>
              <Field label="Envío interior"><select value={envioInterior} onChange={(e) => setEnvioInterior(e.target.value)}><option>No</option><option>Sí</option></select></Field>
              <Field label="Nombre del cliente"><input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Opcional" /></Field>
            </div>
          </div>

          {isAdmin && (
            <button className="dg-btn-ghost dg-suggest-btn" onClick={() => setShowConfig((v) => !v)}>
              <Settings2 size={14} /> {showConfig ? "Ocultar" : "Ver/editar"} configuración de costos y márgenes
            </button>
          )}
          {showConfig && isAdmin && <ConfigEditor config={config} onChange={onConfigChange} />}
        </div>

        <div className="dg-quote-result">
          {result.alertaMedidaMaxima !== "OK" && (
            <div className="dg-alert"><AlertTriangle size={14} /> {result.alertaMedidaMaxima}</div>
          )}
          {result.alertaPaneles !== "OK" && (
            <div className="dg-alert"><AlertTriangle size={14} /> {result.alertaPaneles}</div>
          )}
          {result.alertaComercial !== "OK" && (
            <div className="dg-alert"><AlertTriangle size={14} /> {result.alertaComercial}</div>
          )}

          <div className="dg-price-card">
            <span className="dg-price-label">Transferencia (con IVA)</span>
            <strong className="dg-price-main">{fmtMoney(roundTo1000(result.precioTransferencia))}</strong>
            {result.precio3Cuotas && <span className="dg-price-sub">{fmtMoney(roundTo1000(result.precio3Cuotas))} en 3 cuotas</span>}
          </div>

          <div className="dg-quote-meta">
            <div><span>Escala</span><strong>{result.escalaComercial}</strong></div>
            <div><span>Margen aplicado</span><strong>{Math.round(result.margenAplicado * 100)}%</strong></div>
            <div><span>Margen real estimado</span><strong>{Math.round(result.margenReal * 100)}%</strong></div>
            <div><span>Costo total estimado</span><strong>{fmtMoney(result.costoTotalEstimado)}</strong></div>
            <div><span>Total pedido ({inputs.cantidad} u.)</span><strong>{fmtMoney(result.totalPedidoTransferencia)}</strong></div>
            <div><span>Tiempo de fabricación</span><strong>{result.tiempoFabricacion}</strong></div>
          </div>

          <div className="dg-mensaje-box">
            <div className="dg-quote-section-title">Mensaje para el cliente</div>
            <pre className="dg-mensaje-text">{mensaje}</pre>
            <div className="dg-quote-actions">
              <button className="dg-btn-ghost" onClick={copyMessage}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar mensaje"}</button>
              <button className="dg-btn-ghost" onClick={() => window.print()}><Printer size={14} /> Vista de impresión (PDF)</button>
              <button className="dg-btn-primary" onClick={saveQuote}>{saved ? <Check size={14} /> : <Save size={14} />} {saved ? "Guardado" : "Guardar cotización"}</button>
            </div>
          </div>
        </div>
      </div>

      {quotes.length > 0 && (
        <div className="dg-quotes-history">
          <div className="dg-quote-section-title"><ClipboardList size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />Cotizaciones guardadas</div>
          <div className="dg-task-list">
            {quotes.slice(0, 12).map((q) => (
              <div className="dg-task dg-pago-row" key={q.id}>
                <div className="dg-pago-info">
                  <span>{q.cliente} — {q.tipoProducto} {q.medida} cm {q.cantidad > 1 ? `x${q.cantidad}` : ""}</span>
                  <span className="dg-pago-meta">{q.fecha}</span>
                </div>
                <span className="dg-pago-monto">{fmtMoney(roundTo1000(q.precioTransferencia))}</span>
                <button className="dg-icon-btn dg-task-del" onClick={() => removeQuote(q.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dg-print-area">
        <div className="dg-print-head">
          <div className="dg-print-brand">DECOGLASS</div>
          <div className="dg-print-sub">Espejos LED — Presupuesto</div>
        </div>
        <div className="dg-print-row"><span>Fecha</span><span>{new Date().toLocaleDateString("es-AR")}</span></div>
        {cliente && <div className="dg-print-row"><span>Cliente</span><span>{cliente}</span></div>}
        <div className="dg-print-row"><span>Producto</span><span>Espejo {result.tipoComercialDisplay} retroiluminado</span></div>
        <div className="dg-print-row"><span>Modelo</span><span>{result.modeloComercial}</span></div>
        <div className="dg-print-row"><span>Medida</span><span>{ancho} × {alto} cm{inputs.cantidad > 1 ? ` — Cantidad: ${inputs.cantidad}` : ""}</span></div>
        <div className="dg-print-row"><span>Tiempo de fabricación</span><span>{result.tiempoFabricacion}</span></div>
        <div className="dg-print-price">
          <div>{fmtMoney(roundTo1000(result.precioTransferencia))} <small>transferencia</small></div>
          {result.precio3Cuotas && <div>{fmtMoney(roundTo1000(result.precio3Cuotas))} <small>hasta 3 cuotas</small></div>}
          {inputs.cantidad > 1 && <div>{fmtMoney(result.totalPedidoTransferencia)} <small>total del pedido</small></div>}
        </div>
        <div className="dg-print-terms">
          {envioInterior === "Sí" ? "Se puede encargar con un anticipo del 50% y el saldo restante antes del despacho." : "Se puede encargar con un anticipo del 50% y el saldo restante al momento de retirar o antes de la entrega."}
        </div>
      </div>
    </div>
  );
}

function ConfigField({ label, value, onChange }) {
  return (
    <div className="dg-config-field">
      <label>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function ConfigEditor({ config, onChange }) {
  function set(section, key, val) {
    onChange({ ...config, [section]: { ...config[section], [key]: val } });
  }
  function setNested(section, group, key, val) {
    onChange({ ...config, [section]: { ...config[section], [group]: { ...config[section][group], [key]: val } } });
  }
  const M = config.materiales, E = config.embalaje, O = config.opcionales, C = config.cargaOperativa, R = config.reglas;

  return (
    <div className="dg-config-editor">
      <p className="dg-hint">Estos son los mismos costos y márgenes de tu presupuestador en Excel. Cambiá lo que haga falta — se guarda automáticamente para todos.</p>

      <div className="dg-config-group-title">Materiales (precio de compra)</div>
      <div className="dg-config-grid">
        <ConfigField label="Aluminio $" value={M.aluminioPrecio} onChange={(v) => set("materiales", "aluminioPrecio", v)} />
        <ConfigField label="Plancha espejo $" value={M.planchaPrecio} onChange={(v) => set("materiales", "planchaPrecio", v)} />
        <ConfigField label="Tira LED $" value={M.ledPrecio} onChange={(v) => set("materiales", "ledPrecio", v)} />
        <ConfigField label="Transformador $" value={M.transformadorPrecio} onChange={(v) => set("materiales", "transformadorPrecio", v)} />
        <ConfigField label="Sellador/silicona $" value={M.selladorPrecio} onChange={(v) => set("materiales", "selladorPrecio", v)} />
      </div>

      <div className="dg-config-group-title">Funciones (costo componente / carga operativa)</div>
      <div className="dg-config-grid">
        <ConfigField label="Touch — costo" value={O.touch.costo} onChange={(v) => setNested("opcionales", "touch", "costo", v)} />
        <ConfigField label="Desempañante — costo" value={O.desemp.costo} onChange={(v) => setNested("opcionales", "desemp", "costo", v)} />
        <ConfigField label="Desempañante — carga" value={O.desemp.carga} onChange={(v) => setNested("opcionales", "desemp", "carga", v)} />
        <ConfigField label="Hora/Temp — costo" value={O.horaTemp.costo} onChange={(v) => setNested("opcionales", "horaTemp", "costo", v)} />
        <ConfigField label="Hora/Temp — carga" value={O.horaTemp.carga} onChange={(v) => setNested("opcionales", "horaTemp", "carga", v)} />
      </div>

      <div className="dg-config-group-title">Carga operativa y reglas comerciales</div>
      <div className="dg-config-grid">
        <ConfigField label="Carga base simple $" value={C["Simple / Touch"]} onChange={(v) => onChange({ ...config, cargaOperativa: { ...C, "Simple / Touch": v } })} />
        <ConfigField label="Carga base esmerilado $" value={C.Esmerilado} onChange={(v) => onChange({ ...config, cargaOperativa: { ...C, Esmerilado: v } })} />
        <ConfigField label="IVA (%, ej 0.21)" value={R.iva} onChange={(v) => set("reglas", "iva", v)} />
        <ConfigField label="Factor 3 cuotas" value={R.factor3cuotas} onChange={(v) => set("reglas", "factor3cuotas", v)} />
        <ConfigField label="Margen minorista (0-1)" value={R.margenMinorista} onChange={(v) => set("reglas", "margenMinorista", v)} />
        <ConfigField label="Margen revendedor 5-9 (0-1)" value={R.margenRevendedor} onChange={(v) => set("reglas", "margenRevendedor", v)} />
        <ConfigField label="Margen constructora 10-19 (0-1)" value={R.margenConstructora10} onChange={(v) => set("reglas", "margenConstructora10", v)} />
        <ConfigField label="Margen constructora 20+ (0-1)" value={R.margenConstructora20} onChange={(v) => set("reglas", "margenConstructora20", v)} />
        <ConfigField label="Recargo medida no estándar (0-1)" value={R.recargoNoEstandar} onChange={(v) => set("reglas", "recargoNoEstandar", v)} />
        <ConfigField label="Mínimo agregado por función $" value={R.minimoAgregado} onChange={(v) => set("reglas", "minimoAgregado", v)} />
      </div>
    </div>
  );
}

function LoginModal({ sectors, adminKeyExists, onClose, onAdminKeyCreated, onSectorUpdate, onSuccess }) {
  const [mode, setMode] = useState("choose");
  const [sectorId, setSectorId] = useState(sectors[0]?.id || "");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const sector = sectors.find((s) => s.id === sectorId);
  const sectorNeedsSetup = sector && !sector.clave;

  async function handleAdmin() {
    setError("");
    if (!adminKeyExists) {
      if (clave.length < 4) return setError("La clave debe tener al menos 4 caracteres.");
      if (clave !== clave2) return setError("Las claves no coinciden.");
      try { await storage.set("admin-key", clave, true); onAdminKeyCreated(); onSuccess({ role: "admin" }); }
      catch (e) { setError("No se pudo guardar la clave. Probá de nuevo."); }
      return;
    }
    try {
      const res = await storage.get("admin-key", true);
      if (res && res.value === clave) onSuccess({ role: "admin" }); else setError("Clave incorrecta.");
    } catch (e) { setError("No se pudo verificar la clave."); }
  }
  function handleSector() {
    setError("");
    if (!sector) return;
    if (sectorNeedsSetup) {
      if (!nombre.trim()) return setError("Ingresá el nombre del encargado.");
      if (clave.length < 4) return setError("La clave debe tener al menos 4 caracteres.");
      if (clave !== clave2) return setError("Las claves no coinciden.");
      onSectorUpdate(sector.id, { encargado: nombre.trim(), clave });
      onSuccess({ role: "sector", sectorId: sector.id });
      return;
    }
    if (sector.clave === clave) onSuccess({ role: "sector", sectorId: sector.id }); else setError("Clave incorrecta.");
  }

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head"><div className="dg-modal-title">Iniciar sesión</div><button className="dg-icon-btn" onClick={onClose}><X size={18} /></button></div>
        {mode === "choose" && (
          <div className="dg-choice-grid">
            <button className="dg-choice-btn" onClick={() => setMode("admin")}><ShieldCheck size={20} /><div>Soy Facundo (Admin)</div><span>Tareas, encargados, ingresos y compras</span></button>
            <button className="dg-choice-btn" onClick={() => setMode("sector")}><User size={20} /><div>Soy encargado de un sector</div><span>Actualizo mis propias tareas</span></button>
          </div>
        )}
        {mode === "admin" && (
          <div className="dg-form">
            {!adminKeyExists && <p className="dg-hint">Primera vez: creá tu clave de administrador.</p>}
            <label>Clave{!adminKeyExists ? " nueva" : ""}</label><input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
            {!adminKeyExists && (<><label>Repetir clave</label><input type="password" value={clave2} onChange={(e) => setClave2(e.target.value)} /></>)}
            {error && <div className="dg-error">{error}</div>}
            <div className="dg-form-actions"><button className="dg-btn-ghost" onClick={() => setMode("choose")}>Volver</button><button className="dg-btn-primary" onClick={handleAdmin}>{adminKeyExists ? "Entrar" : "Crear clave y entrar"}</button></div>
          </div>
        )}
        {mode === "sector" && (
          <div className="dg-form">
            <label>Sector</label>
            <select value={sectorId} onChange={(e) => { setSectorId(e.target.value); setError(""); }}>{sectors.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}</select>
            {sectorNeedsSetup ? (
              <>
                <p className="dg-hint">Este sector no tiene encargado configurado. Poné tu nombre y clave.</p>
                <label>Tu nombre</label><input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <label>Clave nueva</label><input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
                <label>Repetir clave</label><input type="password" value={clave2} onChange={(e) => setClave2(e.target.value)} />
              </>
            ) : (<><label>Clave de {sector?.encargado || "encargado"}</label><input type="password" value={clave} onChange={(e) => setClave(e.target.value)} /></>)}
            {error && <div className="dg-error">{error}</div>}
            <div className="dg-form-actions"><button className="dg-btn-ghost" onClick={() => setMode("choose")}>Volver</button><button className="dg-btn-primary" onClick={handleSector}>{sectorNeedsSetup ? "Guardar y entrar" : "Entrar"}</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectorTasksPanel({ sector, session, isAdmin, onUpdate, onRequestLogin }) {
  const [newTask, setNewTask] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(sector.encargado || "");
  const isThisSector = session?.role === "sector" && session.sectorId === sector.id;
  const suggested = SUGGESTED_TASKS[sector.id] || [];

  function addTask() { if (!newTask.trim()) return; onUpdate({ tasks: [...sector.tasks, { id: uid(), text: newTask.trim(), completed: false }] }); setNewTask(""); }
  function removeTask(id) { onUpdate({ tasks: sector.tasks.filter((t) => t.id !== id) }); }
  function toggleTask(id) { onUpdate({ tasks: sector.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) }); }
  function loadSuggested() { onUpdate({ tasks: [...sector.tasks, ...suggested.map((text) => ({ id: uid(), text, completed: false }))] }); }
  function saveName() { onUpdate({ encargado: nameDraft.trim() }); setEditingName(false); }
  function resetClave() { onUpdate({ clave: null }); }

  return (
    <div className="dg-page">
      <div className="dg-sector-meta-row">
        <div className="dg-encargado-box dg-encargado-box-compact">
          <User size={13} />
          {!editingName ? (<span>{sector.encargado || "Sin encargado asignado"}</span>) : (<input className="dg-inline-input" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus />)}
          {isAdmin && !editingName && (<button className="dg-icon-btn dg-encargado-edit" onClick={() => setEditingName(true)} title="Editar encargado"><Pencil size={12} /></button>)}
          {isAdmin && editingName && (<button className="dg-btn-primary dg-mini-btn" onClick={saveName}>Guardar</button>)}
          {isAdmin && sector.clave && !editingName && (<button className="dg-icon-btn dg-encargado-edit" onClick={resetClave} title="Restablecer clave"><RotateCcw size={12} /></button>)}
        </div>
      </div>

      <div className="dg-task-table-wrap">
        <div className="dg-task-table-head">
          <span>Checklist del día</span>
          <span>{sector.tasks.filter((t) => t.completed).length}/{sector.tasks.length}</span>
        </div>
        <div className="dg-task-table">
          {sector.tasks.length === 0 && <div className="dg-empty">Todavía no hay tareas asignadas a este sector.</div>}
          {sector.tasks.map((t) => (
            <div className={`dg-task-table-row ${t.completed ? "dg-task-table-row-done" : ""}`} key={t.id}>
              <button className={`dg-checkbox ${t.completed ? "dg-checkbox-on" : ""}`} disabled={!isThisSector && !isAdmin} onClick={() => toggleTask(t.id)} />
              <span className={t.completed ? "dg-task-done" : ""}>{t.text}</span>
              {isAdmin && <button className="dg-icon-btn dg-task-del" onClick={() => removeTask(t.id)}><Trash2 size={14} /></button>}
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <>
          <div className="dg-add-task">
            <input placeholder="Nueva tarea para este sector..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
            <button className="dg-btn-primary" onClick={addTask}><Plus size={16} /> Agregar</button>
          </div>
          {suggested.length > 0 && (<button className="dg-btn-ghost dg-suggest-btn" onClick={loadSuggested}><Sparkles size={14} /> Cargar tareas sugeridas para este sector</button>)}
        </>
      )}

      {!isAdmin && !isThisSector && (
        <div className="dg-locked-note"><Lock size={14} /> Iniciá sesión como admin o como encargado de este sector para modificar tareas.
          <button className="dg-btn-ghost dg-inline-btn" onClick={onRequestLogin}>Iniciar sesión</button>
        </div>
      )}
    </div>
  );
}

function SectorPage({
  sector, index, session, isAdmin, onUpdate, onRequestLogin, onBack,
  pedidos, onChangePedidos, vendedores, onChangeVendedores, incomes, onChangeIncomes,
  purchases, onChangePurchases, quoteConfig, onChangeQuoteConfig, quotes, onChangeQuotes,
  leads, onChangeLeads, onCreateIncome, sectors, recursos, onChangeRecursos,
  facturas, onChangeFacturas, reclamos, onChangeReclamos, stockEspejos, onChangeStockEspejos,
  empleadosSueldo, onChangeEmpleadosSueldo, liquidaciones, onChangeLiquidaciones,
}) {
  const tabs = SECTOR_SUBPAGES[sector.id] || [{ id: "tareas", label: "Tareas" }];
  const [subpage, setSubpage] = useState(tabs[0].id);
  const Icon = ICONS[sector.icon];
  const { key, pct } = getStatus(sector.tasks);
  const glow = STATUS[key].glow;

  const isVentasSession = session?.role === "sector" && session.sectorId === "ventas";
  const canQuote = isAdmin || isVentasSession;
  const canSeePedidos = !!session;
  const sessionSectorId = session?.role === "sector" ? session.sectorId : null;
  const canEditPedidoFull = isAdmin || isVentasSession;
  const canEditFabrica = isAdmin || sessionSectorId === "fabrica";
  const canEditPostventa = isAdmin || sessionSectorId === "postventa";
  const canEditLogistica = isAdmin || sessionSectorId === "logistica";

  return (
    <div className="dg-sector-page">
      <div className="dg-sector-page-head">
        <button className="dg-back-btn" onClick={onBack}><ArrowLeft size={15} /> Edificio</button>
        <div className="dg-sector-page-title">
          <div className="dg-modal-icon" style={{ "--glow": glow }}>{Icon && <Icon size={20} />}</div>
          <div>
            <div className="dg-modal-title">{sector.name}</div>
            <div className="dg-modal-sub">Piso {String(index + 1).padStart(2, "0")} · {sector.encargado || "Sin encargado"}</div>
          </div>
        </div>
        <div className="dg-status-pill" style={{ "--glow": glow }}>{pct === null ? "Sin tareas" : `${pct}% hoy`}</div>
      </div>

      <div className="dg-room-strip" style={{ "--glow": glow }}><RoomScene sector={sector} /></div>

      {tabs.length > 1 && (
        <div className="dg-sector-tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`dg-sector-tab ${subpage === t.id ? "dg-sector-tab-on" : ""}`} onClick={() => setSubpage(t.id)}>{t.label}</button>
          ))}
        </div>
      )}

      {subpage === "tareas" && (
        <SectorTasksPanel sector={sector} session={session} isAdmin={isAdmin} onUpdate={onUpdate} onRequestLogin={onRequestLogin} />
      )}

      {subpage === "presupuestador" && (
        canQuote ? <QuotePage config={quoteConfig} onConfigChange={onChangeQuoteConfig} quotes={quotes} onQuotesChange={onChangeQuotes} isAdmin={isAdmin} />
          : <LockedPage label="El Presupuestador" onLogin={onRequestLogin} />
      )}

      {subpage === "crm" && (
        canQuote ? <CRMPage leads={leads} onLeadsChange={onChangeLeads} vendedores={vendedores} onVendedoresChange={onChangeVendedores} isAdmin={isAdmin} />
          : <LockedPage label="El CRM" onLogin={onRequestLogin} />
      )}

      {subpage === "recursos" && <RecursosVentaPanel recursos={recursos} onChange={onChangeRecursos} isAdmin={isAdmin} />}

      {subpage === "pedidos" && sector.id !== "fabrica" && (
        canSeePedidos ? (
          <PedidosPage pedidos={pedidos} onChange={onChangePedidos} vendedores={vendedores} canEditFull={sector.id === "administracion" ? isAdmin : canEditPedidoFull} sessionSectorId={sessionSectorId} incomes={incomes} onCreateIncome={onCreateIncome} />
        ) : <LockedPage label="Pedidos" onLogin={onRequestLogin} />
      )}

      {subpage === "pedidos" && sector.id === "fabrica" && (
        canSeePedidos ? <FabricaPedidosPage pedidos={pedidos} onChange={onChangePedidos} canEdit={canEditFabrica} />
          : <LockedPage label="Pedidos de fábrica" onLogin={onRequestLogin} />
      )}

      {subpage === "stock" && sector.id === "fabrica" && (
        canSeePedidos ? <StockEspejosPanel stock={stockEspejos} onChange={onChangeStockEspejos} canEdit={canEditFabrica} />
          : <LockedPage label="Stock de espejos" onLogin={onRequestLogin} />
      )}

      {subpage === "finanzas" && (
        isAdmin ? <FinanzasPanel incomes={incomes} purchases={purchases} sectors={sectors} onChangeIncomes={onChangeIncomes} onChangePurchases={onChangePurchases} />
          : <LockedPage label="Finanzas" onLogin={onRequestLogin} />
      )}

      {subpage === "sueldos" && (
        isAdmin ? <SueldosPanel empleados={empleadosSueldo} onChangeEmpleados={onChangeEmpleadosSueldo} liquidaciones={liquidaciones} onChangeLiquidaciones={onChangeLiquidaciones} />
          : <LockedPage label="Sueldos" onLogin={onRequestLogin} />
      )}

      {subpage === "envios" && sector.id === "postventa" && (
        canSeePedidos ? <EnviosPostventaPanel pedidos={pedidos} onChange={onChangePedidos} canEdit={canEditPostventa} />
          : <LockedPage label="Envíos" onLogin={onRequestLogin} />
      )}

      {subpage === "envios" && sector.id === "logistica" && (
        canSeePedidos ? <EnviosLogisticaPanel pedidos={pedidos} onChange={onChangePedidos} canEdit={canEditLogistica} />
          : <LockedPage label="Envíos confirmados" onLogin={onRequestLogin} />
      )}

      {subpage === "facturas" && (
        canSeePedidos ? <FacturasManualesPanel facturas={facturas} onChange={onChangeFacturas} isAdmin={isAdmin} />
          : <LockedPage label="Facturas pendientes" onLogin={onRequestLogin} />
      )}

      {subpage === "reclamos" && (
        canSeePedidos ? <ReclamosPanel reclamos={reclamos} onChange={onChangeReclamos} />
          : <LockedPage label="Reclamos" onLogin={onRequestLogin} />
      )}
    </div>
  );
}

const wrap = { minHeight: "100%", background: "#0A0D13" };

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
      .dg-app { --bg:#0A0D13; --panel: rgba(22,28,40,0.78); --panel-border: rgba(255,255,255,0.08); --text:#E7ECF2; --text-dim:#8B96A8; --cyan:#48E0D8;
        font-family:'Inter', sans-serif; color: var(--text);
        background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(72,224,216,0.08), transparent), var(--bg);
        min-height:100vh; padding:28px 16px 60px; box-sizing:border-box; }
      .dg-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; min-height:60vh; color: var(--text-dim); }
      .dg-spin { animation: dg-spin 1s linear infinite; color:#48E0D8; }
      @keyframes dg-spin { to { transform: rotate(360deg); } }

      .dg-header { display:flex; align-items:center; justify-content:space-between; max-width:680px; margin:0 auto 16px; gap:12px; flex-wrap:wrap; }
      .dg-brand { display:flex; align-items:center; gap:12px; }
      .dg-brand-mark { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:15px; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; background: linear-gradient(145deg, rgba(72,224,216,0.18), rgba(72,224,216,0.04)); border:1px solid rgba(72,224,216,0.35); color:#48E0D8; box-shadow: 0 0 18px rgba(72,224,216,0.25); }
      .dg-brand-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:18px; letter-spacing:0.5px; }
      .dg-brand-sub { font-size:12px; color: var(--text-dim); }
      .dg-session { display:flex; align-items:center; gap:8px; }
      .dg-session-badge { display:flex; align-items:center; gap:6px; font-size:12px; padding:7px 12px; border-radius:100px; background: var(--panel); border:1px solid var(--panel-border); }
      .dg-login-btn, .dg-btn-primary { display:flex; align-items:center; gap:6px; font-family:'Inter',sans-serif; font-weight:600; font-size:13px; background: linear-gradient(145deg, #48E0D8, #2FB8B0); color:#03181A; border:none; border-radius:10px; padding:9px 14px; cursor:pointer; box-shadow: 0 0 20px rgba(72,224,216,0.3); }
      .dg-login-btn:hover, .dg-btn-primary:hover { filter: brightness(1.08); }
      .dg-icon-btn { background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:6px; border-radius:8px; display:flex; }
      .dg-icon-btn:hover { background: rgba(255,255,255,0.06); color:var(--text); }
      .dg-btn-ghost { background:transparent; border:1px solid var(--panel-border); color:var(--text-dim); border-radius:10px; padding:9px 14px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px; }
      .dg-btn-ghost:hover { color:var(--text); border-color: rgba(255,255,255,0.2); }
      .dg-inline-btn { padding:4px 10px; font-size:12px; margin-left:8px; }
      .dg-mini-btn { padding:5px 10px; font-size:12px; }

      .dg-nav { display:flex; gap:6px; max-width:680px; margin:0 auto 22px; background: var(--panel); border:1px solid var(--panel-border); border-radius:12px; padding:4px; }
      .dg-nav-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:transparent; border:none; color:var(--text-dim); font-family:'Inter',sans-serif; font-size:13px; font-weight:600; padding:9px; border-radius:9px; cursor:pointer; }
      .dg-nav-on { background: rgba(72,224,216,0.14); color:#48E0D8; }
      .dg-nav-breadcrumb { justify-content:flex-start; }
      .dg-nav-breadcrumb .dg-nav-btn { flex:none; }
      .dg-nav-crumb { cursor:default; }

      .dg-back-btn { display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:9px; padding:7px 12px; font-size:12.5px; font-weight:600; cursor:pointer; margin-bottom:14px; }
      .dg-back-btn:hover { color:#E7ECF2; border-color:rgba(255,255,255,0.2); }
      .dg-sector-page { max-width:760px; margin:0 auto; min-width:0; }
      .dg-sector-page-head { display:flex; align-items:center; gap:12px; margin-bottom:2px; flex-wrap:wrap; }
      .dg-sector-page-title { display:flex; align-items:center; gap:12px; flex:1; }
      .dg-sector-tabs { display:flex; gap:6px; flex-wrap:wrap; margin:14px 0 18px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px; }
      .dg-sector-tab { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:100px; padding:7px 14px; font-size:12.5px; font-weight:600; cursor:pointer; }
      .dg-sector-tab:hover { color:#E7ECF2; }
      .dg-sector-tab-on { background: rgba(72,224,216,0.15); border-color:#48E0D8; color:#48E0D8; }

      .dg-room-enter { position:absolute; top:10px; right:10px; width:26px; height:26px; border-radius:50%; background: rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color:#E7ECF2; opacity:0; transform: translateX(-4px); transition: opacity 0.15s ease, transform 0.15s ease; }
      .dg-room-tile:hover .dg-room-enter { opacity:1; transform:translateX(0); }

      .dg-fabrica-card { cursor:default; min-width:0; }
      .dg-fabrica-actions { display:grid; grid-template-columns:repeat(auto-fit, minmax(96px, 1fr)); gap:6px; margin-top:8px; }
      .dg-fabrica-btn { min-width:0; display:flex; align-items:center; justify-content:center; gap:5px; padding:9px 6px; border-radius:9px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,0.1); background:#161B26; color:#8B96A8; white-space:nowrap; }
      .dg-fabrica-btn-listo:hover { border-color:#52E08A; color:#52E08A; }
      .dg-fabrica-btn-demora:hover { border-color:#F5C451; color:#F5C451; }
      .dg-fabrica-btn-demora-on { background: rgba(241,101,101,0.14); border-color:#F16565; color:#F16565; }
      .dg-fabrica-btn-cancel:hover { border-color:#F16565; color:#F16565; }
      .dg-recurso-link { display:flex; align-items:center; gap:8px; color:#48E0D8; text-decoration:none; font-size:13px; flex:1; }
      .dg-recurso-link:hover { text-decoration:underline; }
      .dg-badge-entrega { --bc:#F5C451; }

      .dg-month-accordion { display:flex; flex-direction:column; gap:10px; }
      .dg-month-group { border:1px solid rgba(255,255,255,0.07); border-radius:12px; overflow:hidden; }
      .dg-month-header { width:100%; display:flex; align-items:center; gap:8px; padding:12px 14px; background: rgba(255,255,255,0.025); border:none; color:#E7ECF2; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13.5px; cursor:pointer; text-transform:capitalize; }
      .dg-month-chevron { transition: transform 0.15s ease; color:#8B96A8; }
      .dg-month-chevron-open { transform: rotate(90deg); }
      .dg-month-count { margin-left:auto; font-family:'JetBrains Mono', monospace; font-size:11px; color:#8B96A8; background:#161B26; padding:2px 8px; border-radius:100px; }
      .dg-month-items { display:flex; flex-direction:column; gap:8px; padding:10px; }

      .dg-summary { display:flex; gap:8px; max-width:640px; margin:0 auto 28px; flex-wrap:wrap; }
      .dg-chip { --c:#888; display:flex; align-items:center; gap:6px; font-size:12px; padding:6px 12px; border-radius:100px; background: var(--panel); border:1px solid var(--panel-border); color: var(--text-dim); font-family:'JetBrains Mono', monospace; }
      .dg-chip-dot { width:7px; height:7px; border-radius:50%; background: var(--c); box-shadow: 0 0 8px var(--c); }


      .dg-page { max-width:680px; margin:0 auto; min-width:0; }
      .dg-locked-page { display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; color: var(--text-dim); padding:60px 20px; background: var(--panel); border:1px solid var(--panel-border); border-radius:16px; }
      .dg-locked-page p { max-width:320px; font-size:13px; }

      .dg-totales { display:flex; gap:10px; margin-bottom:16px; }
      .dg-cuenta-totales { margin-top:-6px; }
      .dg-iva-card { background:#161B26; border:1px solid rgba(245,196,81,0.3); border-radius:12px; padding:14px; margin-bottom:16px; }
      .dg-iva-head { display:flex; flex-direction:column; gap:2px; margin-bottom:8px; }
      .dg-iva-head > div { display:flex; align-items:baseline; gap:10px; }
      .dg-iva-amount { font-family:'JetBrains Mono', monospace; font-size:20px; color:#F5C451; }
      .dg-iva-note { font-size:11px; color:#8B96A8; }
      .dg-total-card { --c:#888; flex:1; background:#161B26; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; display:flex; flex-direction:column; gap:4px; }
      .dg-total-card span { font-size:11px; color:#8B96A8; }
      .dg-total-card strong { font-family:'JetBrains Mono', monospace; font-size:16px; color: var(--c); }

      .dg-charts { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
      .dg-chart-card { flex:1; min-width:220px; background:#161B26; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; }
      .dg-chart-title { font-size:12px; color:#8B96A8; margin-bottom:6px; font-family:'JetBrains Mono', monospace; }

      .dg-overlay { position:fixed; inset:0; background: rgba(5,7,11,0.72); backdrop-filter: blur(4px); display:flex; align-items:center; justify-content:center; padding:16px; z-index:50; }
      .dg-modal { font-family:'Inter', sans-serif; color:#E7ECF2; width:100%; max-width:400px; background:#10141D; border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:20px; max-height:88vh; overflow-y:auto; }
      .dg-modal-lg { max-width:540px; }
      .dg-modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
      .dg-modal-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:17px; }
      .dg-modal-icon { --glow:#48E0D8; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--glow) 15%, transparent); color: var(--glow); border:1px solid color-mix(in srgb, var(--glow) 40%, transparent); }
      .dg-modal-sub { font-size:12px; color:#8B96A8; margin-top:2px; }
      .dg-encargado-box { display:flex; align-items:center; gap:8px; font-size:13px; color:#8B96A8; background:#161B26; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:9px 12px; margin-bottom:14px; }
      .dg-sector-meta-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
      .dg-encargado-box-compact { flex:1; margin-bottom:0; padding:7px 10px; }
      .dg-status-pill { --glow:#48E0D8; font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color: var(--glow); background: color-mix(in srgb, var(--glow) 14%, transparent); border:1px solid color-mix(in srgb, var(--glow) 40%, transparent); border-radius:100px; padding:7px 12px; white-space:nowrap; }
      .dg-room-strip { --glow:#48E0D8; position:relative; height:74px; border-radius:10px; overflow:hidden; margin-bottom:14px; background:#151a26; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--glow) 30%, transparent); }
      .dg-task-table-wrap { background: rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:4px; margin-bottom:14px; }
      .dg-task-table-head { display:flex; justify-content:space-between; align-items:center; padding:10px 12px 8px; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:#E7ECF2; }
      .dg-task-table-head span:last-child { font-family:'JetBrains Mono', monospace; color:#48E0D8; font-size:12px; }
      .dg-task-table { display:flex; flex-direction:column; max-height:340px; overflow-y:auto; }
      .dg-task-table-row { display:flex; align-items:center; gap:10px; padding:12px 12px; font-size:14px; border-top:1px solid rgba(255,255,255,0.05); }
      .dg-task-table-row:nth-child(even) { background: rgba(255,255,255,0.018); }
      .dg-task-table-row-done { opacity:0.6; }
      .dg-encargado-box span { color:#E7ECF2; }
      .dg-encargado-edit { margin-left:auto; }
      .dg-inline-input { flex:1; background:#0F1420; border:1px solid rgba(72,224,216,0.4); border-radius:6px; padding:5px 8px; color:#E7ECF2; font-size:13px; outline:none; }
      .dg-choice-grid { display:flex; flex-direction:column; gap:10px; }
      .dg-choice-btn { display:flex; flex-direction:column; align-items:flex-start; gap:4px; text-align:left; background:#161B26; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px; color:#E7ECF2; cursor:pointer; }
      .dg-choice-btn:hover { border-color:#48E0D8; }
      .dg-choice-btn div { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:14px; margin-top:4px; }
      .dg-choice-btn span { font-size:12px; color:#8B96A8; }
      .dg-form { display:flex; flex-direction:column; gap:8px; }
      .dg-form label { font-size:12px; color:#8B96A8; margin-top:6px; display:block; }
      .dg-app, .dg-app *, .dg-modal, .dg-modal * { box-sizing: border-box; }
      .dg-app { overflow-x: hidden; }
      .dg-app, .dg-modal { color-scheme: dark; }
      select { color-scheme: dark; }
      select option { background:#161B26; color:#E7ECF2; }
      .dg-form input, .dg-form select { width:100%; background:#161B26; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 12px; color:#E7ECF2; font-family:'Inter',sans-serif; font-size:14px; outline:none; box-sizing:border-box; }
      .dg-form input:focus, .dg-form select:focus { border-color:#48E0D8; }
      .dg-form-row { display:flex; gap:10px; }
      .dg-hint { font-size:12px; color:#8B96A8; background:rgba(72,224,216,0.06); border:1px solid rgba(72,224,216,0.2); border-radius:8px; padding:8px 10px; }
      .dg-error { font-size:12px; color:#F16565; }
      .dg-form-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:10px; }
      .dg-status-bar { display:flex; flex-direction:column; gap:6px; margin-bottom:18px; }
      .dg-status-track { height:6px; border-radius:100px; background:rgba(255,255,255,0.08); overflow:hidden; }
      .dg-status-fill { height:100%; border-radius:100px; transition: width 0.3s ease; }
      .dg-status-bar span { font-size:12px; font-family:'JetBrains Mono', monospace; }
      .dg-task-list { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; max-height:280px; overflow-y:auto; }
      .dg-empty { font-size:13px; color:#8B96A8; padding:14px; text-align:center; border:1px dashed rgba(255,255,255,0.1); border-radius:10px; }
      .dg-task { display:flex; align-items:center; gap:10px; background:#161B26; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px 12px; font-size:13px; }
      .dg-task-done { text-decoration: line-through; color:#8B96A8; }
      .dg-task-del { margin-left:auto; }
      .dg-checkbox { width:18px; height:18px; min-width:18px; border-radius:6px; border:1.5px solid rgba(255,255,255,0.25); background:transparent; cursor:pointer; }
      .dg-checkbox-on { background:#48E0D8; border-color:#48E0D8; }
      .dg-checkbox:disabled { cursor:not-allowed; opacity:0.5; }
      .dg-add-task { display:flex; gap:8px; }
      .dg-add-task input { flex:1; background:#161B26; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 12px; color:#E7ECF2; font-family:'Inter',sans-serif; font-size:13px; outline:none; }
      .dg-add-task input:focus { border-color:#48E0D8; }
      .dg-suggest-btn { margin-top:10px; width:100%; justify-content:center; }
      .dg-locked-note { display:flex; align-items:center; flex-wrap:wrap; gap:6px; font-size:12px; color:#8B96A8; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:10px 12px; }
      .dg-pago-form { margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08); }
      .dg-filtros { display:flex; gap:6px; margin-bottom:10px; }
      .dg-filtro-btn { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:100px; padding:5px 12px; font-size:12px; cursor:pointer; }
      .dg-filtro-on { background: rgba(72,224,216,0.15); border-color:#48E0D8; color:#48E0D8; }
      .dg-pago-row { align-items:center; }
      .dg-pago-info { display:flex; flex-direction:column; flex:1; gap:2px; }
      .dg-pago-meta { font-size:11px; color:#8B96A8; }
      .dg-pago-monto { font-family:'JetBrains Mono', monospace; font-size:13px; margin-right:6px; }
      .dg-pago-list { max-height:320px; }

      .dg-section-card { background: rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:14px 14px 16px; margin-bottom:12px; }
      .dg-section-header { display:flex; align-items:center; gap:7px; margin-bottom:12px; color:#48E0D8; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; text-transform:uppercase; letter-spacing:0.4px; }
      .dg-field-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(130px,1fr)); gap:12px; }
      .dg-money-row { margin-top:12px; padding-top:12px; border-top:1px dashed rgba(255,255,255,0.08); }
      .dg-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
      .dg-field label { font-size:10.5px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase; color:#7A8699; }
      .dg-field input, .dg-field select {
        background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
        border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:9px 10px; color:#E7ECF2;
        font-family:'Inter',sans-serif; font-size:13.5px; outline:none; box-sizing:border-box; width:100%;
        transition: border-color .15s ease, box-shadow .15s ease;
      }
      .dg-field input:focus, .dg-field select:focus { border-color:#48E0D8; box-shadow: 0 0 0 3px rgba(72,224,216,0.12); }
      .dg-field input:disabled, .dg-field select:disabled { opacity:0.5; cursor:not-allowed; }
      .dg-field-computed input { background: rgba(72,224,216,0.08); border-color: rgba(72,224,216,0.35); color:#48E0D8; font-family:'JetBrains Mono', monospace; font-weight:600; opacity:1; }

      .dg-quote-grid { display:flex; gap:16px; align-items:flex-start; }
      .dg-quote-form, .dg-quote-result { flex:1; min-width:280px; background:#161B26; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px; }
      .dg-quote-section-title { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:#48E0D8; margin:14px 0 6px; }
      .dg-quote-section-title:first-child { margin-top:0; }
      .dg-alert { display:flex; align-items:center; gap:8px; font-size:12px; color:#F5C451; background:rgba(245,196,81,0.1); border:1px solid rgba(245,196,81,0.3); border-radius:8px; padding:8px 10px; margin-bottom:10px; }
      .dg-price-card { display:flex; flex-direction:column; gap:2px; background: rgba(72,224,216,0.08); border:1px solid rgba(72,224,216,0.3); border-radius:12px; padding:14px; margin-bottom:14px; }
      .dg-price-label { font-size:11px; color:#8B96A8; }
      .dg-price-main { font-family:'JetBrains Mono', monospace; font-size:26px; color:#48E0D8; }
      .dg-price-sub { font-size:12px; color:#8B96A8; }
      .dg-quote-meta { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
      .dg-quote-meta div { background:#10141D; border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:8px 10px; display:flex; flex-direction:column; gap:2px; }
      .dg-quote-meta span { font-size:10px; color:#8B96A8; }
      .dg-quote-meta strong { font-family:'JetBrains Mono', monospace; font-size:13px; }
      .dg-mensaje-box { margin-top:4px; }
      .dg-mensaje-text { white-space:pre-wrap; font-family:'Inter',sans-serif; font-size:12.5px; background:#10141D; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px; margin:6px 0 10px; line-height:1.5; }
      .dg-quote-actions { display:flex; gap:8px; flex-wrap:wrap; }
      .dg-quotes-history { margin-top:18px; }
      .dg-config-editor { margin-top:12px; background:#0F1420; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px; }
      .dg-config-group-title { font-size:12px; font-weight:600; color:#8B96A8; margin:12px 0 6px; }
      .dg-config-group-title:first-of-type { margin-top:4px; }
      .dg-config-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
      .dg-config-field label { font-size:10.5px; font-weight:600; text-transform:uppercase; letter-spacing:0.3px; color:#7A8699; display:block; margin-bottom:5px; }
      .dg-config-field input { width:100%; background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)); border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:8px 10px; color:#E7ECF2; font-size:12.5px; box-sizing:border-box; outline:none; transition: border-color .15s ease, box-shadow .15s ease; }
      .dg-config-field input:focus { border-color:#48E0D8; box-shadow: 0 0 0 3px rgba(72,224,216,0.12); }

      .dg-quick-actions { background: var(--panel); border:1px solid var(--panel-border); border-radius:14px; padding:14px; margin-bottom:16px; }
      .dg-quick-title { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:#8B96A8; margin-bottom:10px; }
      .dg-quick-buttons { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
      .dg-quick-btn { --c:#48E0D8; display:flex; flex-direction:column; align-items:center; gap:8px; background: color-mix(in srgb, var(--c) 10%, #161B26); border:1.5px solid color-mix(in srgb, var(--c) 45%, transparent); color: var(--c); border-radius:14px; padding:18px 10px; cursor:pointer; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; text-align:center; transition: transform 0.1s ease, box-shadow 0.15s ease; }
      .dg-quick-btn:hover { transform: translateY(-2px); box-shadow: 0 0 20px -4px var(--c); }
      .dg-quick-btn:active { transform: scale(0.97); }
      .dg-quick-inline { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
      .dg-quick-inline input { flex:1; min-width:140px; background:#161B26; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:9px 12px; color:#E7ECF2; font-size:13px; outline:none; }
      .dg-quick-inline input:focus { border-color:#48E0D8; }
      .dg-quick-toast { margin-top:10px; font-size:12px; color:#52E08A; font-family:'JetBrains Mono', monospace; }

      .dg-crm-top { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px; }
      .dg-crm-soyyo { display:flex; align-items:center; gap:8px; font-size:13px; color:#8B96A8; background:#161B26; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:8px 12px; }
      .dg-crm-soyyo select { background:transparent; border:none; color:#48E0D8; font-weight:600; font-size:13px; outline:none; }
      .dg-crm-vendedores-admin { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
      .dg-crm-vendedores-admin input { background:#161B26; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:6px 10px; color:#E7ECF2; font-size:12px; width:140px; }
      .dg-vendedor-chip { display:flex; align-items:center; gap:4px; font-size:11px; background:#161B26; border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:4px 8px; color:#8B96A8; }
      .dg-vendedor-chip button { background:none; border:none; color:#8B96A8; cursor:pointer; display:flex; padding:0; }

      .dg-vendor-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:10px; margin-bottom:16px; }
      .dg-vendor-card { background:#161B26; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; }
      .dg-vendor-name { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; margin-bottom:8px; color:#48E0D8; }
      .dg-vendor-metrics { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px; }
      .dg-vendor-metrics div { display:flex; flex-direction:column; gap:1px; }
      .dg-vendor-metrics span { font-size:10px; color:#8B96A8; }
      .dg-vendor-metrics strong { font-family:'JetBrains Mono', monospace; font-size:13px; }
      .dg-vendor-importe { font-size:12px; color:#52E08A; font-family:'JetBrains Mono', monospace; border-top:1px solid rgba(255,255,255,0.06); padding-top:6px; }

      .dg-crm-filters { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; color:#8B96A8; }
      .dg-periodo-toggle { display:flex; background:#161B26; border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:3px; }
      .dg-periodo-toggle button { background:transparent; border:none; color:#8B96A8; font-size:12px; font-weight:600; padding:6px 12px; border-radius:7px; cursor:pointer; }
      .dg-periodo-on { background: rgba(72,224,216,0.15) !important; color:#48E0D8 !important; }
      .dg-crm-filters select { background:#161B26; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:7px 10px; color:#E7ECF2; font-size:12px; }

      .dg-pedido-search { background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)); border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:8px 12px; color:#E7ECF2; font-size:12.5px; min-width:160px; outline:none; }
      .dg-pedido-search:focus { border-color:#48E0D8; }
      .dg-pedido-list { max-height:none; }
      .dg-pedido-orden { font-family:'JetBrains Mono', monospace; font-size:11px; color:#8B96A8; }
      .dg-pedido-card { display:flex; flex-direction:column; gap:8px; width:100%; max-width:100%; text-align:left; background: rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:12px 14px; color:#E7ECF2; cursor:pointer; font-family:'Inter',sans-serif; min-width:0; overflow:hidden; }
      .dg-confirmar-entrega-btn { justify-content:center; text-decoration:none; background: linear-gradient(145deg, #52E08A, #2FB86A); }
      .dg-pedido-card:hover { border-color:rgba(72,224,216,0.3); }
      .dg-pedido-card-top { display:flex; align-items:center; gap:10px; min-width:0; }
      .dg-pedido-card-top .dg-lead-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .dg-pedido-badges { display:flex; gap:6px; flex-wrap:wrap; min-width:0; }
      .dg-badge { --bc:#8B96A8; display:inline-flex; align-items:center; gap:4px; font-size:10.5px; font-weight:600; padding:4px 9px; border-radius:100px; background: color-mix(in srgb, var(--bc) 14%, transparent); color: var(--bc); border:1px solid color-mix(in srgb, var(--bc) 35%, transparent); white-space:nowrap; max-width:100%; overflow:hidden; text-overflow:ellipsis; }
      .dg-pago-meta { overflow-wrap:break-word; word-break:break-word; }
      .dg-lead-list { max-height:none; }
      .dg-lead-row { display:flex; align-items:center; justify-content:space-between; gap:10px; background:#161B26; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px 12px; flex-wrap:wrap; }
      .dg-lead-main { display:flex; align-items:center; gap:10px; min-width:0; }
      .dg-lead-dot { width:8px; height:8px; min-width:8px; border-radius:50%; }
      .dg-lead-info { display:flex; flex-direction:column; gap:2px; min-width:0; }
      .dg-lead-name { font-size:13px; font-weight:600; }
      .dg-lead-actions { display:flex; align-items:center; gap:6px; }
      .dg-lead-estode-select { }
      .dg-lead-estado-select { background:#0F1420; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:5px 8px; font-size:11px; }
      .dg-stock-cantidad { width:64px; text-align:center; background:#0F1420; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:6px 4px; color:#48E0D8; font-family:'JetBrains Mono', monospace; font-weight:700; font-size:13px; }

      .dg-quickviews { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
      .dg-quickview-btn { background:#161B26; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:100px; padding:7px 13px; font-size:12px; cursor:pointer; white-space:nowrap; }
      .dg-quickview-btn:hover { color:#E7ECF2; }
      .dg-quickview-on { background: rgba(72,224,216,0.15); border-color:#48E0D8; color:#48E0D8; font-weight:600; }
      .dg-comision-banner { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; background: rgba(245,196,81,0.08); border:1px solid rgba(245,196,81,0.3); border-radius:10px; padding:10px 14px; margin-bottom:12px; font-size:13px; color:#F5C451; }
      .dg-pedido-flag { font-size:11px; }
      .dg-checkbox-field { width:100%; display:flex; align-items:center; justify-content:center; gap:6px; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:9px 10px; color:#8B96A8; font-size:12.5px; cursor:pointer; font-family:'Inter',sans-serif; }
      .dg-checkbox-field-on { background: rgba(82,224,138,0.12); border-color:#52E08A; color:#52E08A; font-weight:600; }
      .dg-checkbox-field:disabled { cursor:not-allowed; opacity:0.6; }
      .dg-print-table { display:none; }

      @media print {
        body * { visibility:hidden; }
        .dg-print-area, .dg-print-area * { visibility:visible; }
        .dg-print-area { display:block; position:absolute; top:0; left:0; width:100%; padding:24px; background:#fff; color:#111; font-family:'Inter',sans-serif; }
        .dg-print-brand { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:22px; color:#0f766e; letter-spacing:1px; }
        .dg-print-sub { font-size:13px; color:#555; margin-bottom:20px; }
        .dg-print-row { display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:8px 0; font-size:13px; }
        .dg-print-row span:first-child { color:#666; }
        .dg-print-price { margin:20px 0; padding:16px; border:2px solid #0f766e; border-radius:10px; }
        .dg-print-price div { font-family:'JetBrains Mono', monospace; font-size:20px; font-weight:700; color:#0f766e; margin-bottom:4px; }
        .dg-print-price small { font-size:12px; color:#555; font-weight:400; }
        .dg-print-terms { margin-top:16px; font-size:12px; color:#555; }
        .dg-print-table { display:table; width:100%; border-collapse:collapse; font-size:11px; }
        .dg-print-table th, .dg-print-table td { border-bottom:1px solid #ddd; padding:6px 8px; text-align:left; }
        .dg-print-table th { color:#555; font-weight:600; text-transform:uppercase; font-size:10px; }
        .dg-print-total { margin-top:14px; font-family:'JetBrains Mono', monospace; font-size:15px; font-weight:700; color:#0f766e; text-align:right; }
      }

      .dg-plant-outer { max-width:760px; margin:0 auto; padding:14px 4px 64px; perspective:1900px; position:relative; }
      .dg-plant-outer::after { content:''; position:absolute; left:6%; right:6%; bottom:16px; height:42px; background: radial-gradient(ellipse, rgba(0,0,0,0.6), transparent 72%); filter:blur(5px); z-index:-1; }
      .dg-plant-grid { display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,1fr); gap:6px; background:#03050a; padding:6px; border-radius:18px; transform:rotateX(35deg); transform-style:preserve-3d; box-shadow: 0 52px 80px -26px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06); }
      .dg-room-tile { position:relative; aspect-ratio:auto; min-height:210px; border-radius:0; padding:0; cursor:pointer; box-sizing:border-box; background:#151a26; overflow:hidden; transition: box-shadow 0.18s ease, filter 0.18s ease, transform 0.18s ease; transform-style:preserve-3d; transform: translateZ(6px);
        border-top:5px solid rgba(255,255,255,0.14); border-left:5px solid rgba(255,255,255,0.08); border-bottom:5px solid rgba(0,0,0,0.45); border-right:5px solid rgba(0,0,0,0.32);
        box-shadow: inset 0 22px 26px -14px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.03);
      }
      .dg-room-tile:hover { transform: translateZ(14px); box-shadow: inset 0 22px 26px -14px rgba(0,0,0,0.65), inset 0 0 0 3px var(--glow), inset 0 0 30px -8px var(--glow); filter:brightness(1.1); z-index:2; }
      .dg-room-tile:nth-child(1) { border-radius:16px 0 0 0; }
      .dg-room-tile:nth-child(3) { border-radius:0 16px 0 0; }
      .dg-room-tile:nth-child(4) { border-radius:0 0 0 16px; }
      .dg-room-tile:nth-child(6) { border-radius:0 0 16px 0; }
      .dg-room-tile-oficina { background: #151a26; }
      .dg-room-tile-fabrica { background: #171b22; }
      .dg-room-tile-despacho { background: #171b22; }

      .dg-room-scene { position:absolute; inset:0; background: radial-gradient(circle at 30% 22%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 62%); }
      .dg-scene-pattern { position:absolute; inset:0; opacity:0.55; }
      .dg-scene-pattern-arcs { background: repeating-radial-gradient(circle at 88% 12%, transparent 0 9px, color-mix(in srgb, var(--accent) 32%, transparent) 9px 10.5px, transparent 10.5px 20px); }
      .dg-scene-pattern-bars {
        background-repeat:no-repeat;
        background-image:
          linear-gradient(color-mix(in srgb, var(--accent) 30%, transparent), color-mix(in srgb, var(--accent) 30%, transparent)),
          linear-gradient(color-mix(in srgb, var(--accent) 30%, transparent), color-mix(in srgb, var(--accent) 30%, transparent)),
          linear-gradient(color-mix(in srgb, var(--accent) 30%, transparent), color-mix(in srgb, var(--accent) 30%, transparent));
        background-size: 9% 26%, 9% 42%, 9% 60%;
        background-position: right 16% bottom 12%, right 27% bottom 12%, right 38% bottom 12%;
      }
      .dg-scene-pattern-ledger { background: repeating-linear-gradient(0deg, color-mix(in srgb, var(--accent) 26%, transparent) 0 1px, transparent 1px 15px); }
      .dg-scene-pattern-hazard { background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--accent) 20%, transparent) 0 10px, transparent 10px 20px); }
      .dg-scene-pattern-rings { background: repeating-radial-gradient(circle at 50% 58%, transparent 0 13px, color-mix(in srgb, var(--accent) 30%, transparent) 13px 14.5px, transparent 14.5px 26px); }
      .dg-scene-pattern-lanes { background: repeating-linear-gradient(90deg, color-mix(in srgb, var(--accent) 26%, transparent) 0 18px, transparent 18px 38px); }
      .dg-scene-watermark { position:absolute; right:-8%; bottom:-12%; width:58%; height:58%; color: var(--accent); opacity:0.24; stroke-width:1.3; }

      .dg-room-plate { position:absolute; left:6%; right:6%; bottom:7%; display:flex; align-items:center; gap:7px; background: rgba(8,10,15,0.82); border:1px solid var(--glow); border-radius:10px; padding:8px 10px; box-shadow:0 0 14px -2px var(--glow); backdrop-filter: blur(2px); }
      .dg-room-plate-num { font-family:'JetBrains Mono', monospace; font-size:10px; color:#8B96A8; }
      .dg-room-plate-icon { --glow:#48E0D8; width:26px; height:26px; min-width:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--glow) 18%, transparent); color: var(--glow); }
      .dg-room-plate-text { display:flex; flex-direction:column; min-width:0; flex:1; }
      .dg-room-plate-name { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-room-plate-sub { font-size:10.5px; color:#8B96A8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-room-plate-pct { font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; }

      @media (max-width:680px) {
        .dg-plant-grid { grid-template-columns:repeat(2,1fr); grid-template-rows:repeat(3,1fr); transform:rotateX(20deg); }
        .dg-room-tile:nth-child(1) { border-radius:16px 0 0 0; }
        .dg-room-tile:nth-child(2) { border-radius:0 16px 0 0; }
        .dg-room-tile:nth-child(5) { border-radius:0 0 0 16px; }
        .dg-room-tile:nth-child(6) { border-radius:0 0 16px 0; }
        .dg-room-tile:nth-child(3), .dg-room-tile:nth-child(4) { border-radius:0; }
        .dg-form-row { flex-direction:column; }
        .dg-charts { flex-direction:column; }
        .dg-quote-grid { flex-direction:column; }
        .dg-quote-meta { grid-template-columns:1fr; }
        .dg-config-grid { grid-template-columns:1fr; }
      }
      @media (prefers-reduced-motion: reduce) {
        .dg-spin { animation:none; }
      }
    `}</style>
  );
}
