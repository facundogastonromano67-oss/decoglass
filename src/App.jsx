import { useState, useEffect, useRef } from "react";
import { storage, pedidosStore, pushStore, notificacionesStore, documentosStore, stockMaterialesStore, stockEspejosStore, reclamosStore } from "./lib/storage";
import { supabase } from "./lib/supabaseClient";
import {
  Megaphone, ShoppingCart, Calculator, Factory, Truck, Headphones,
  Lock, Plus, Trash2, X, ShieldCheck, User, LogOut, Loader2, Wallet,
  Pencil, RotateCcw, Sparkles, Building2, TrendingUp, TrendingDown,
  FileText, Printer, Copy, Settings2, AlertTriangle, Save, ClipboardList, Check,
  Instagram, MessageCircle, UserPlus, Users, Filter, ExternalLink, BarChart3,
  Wrench, Package, CheckCircle2, XCircle, CircleDollarSign, ArrowLeft, Download, PackagePlus, ChevronRight, CalendarDays, MoreVertical, Sun, Moon, Phone, MapPin, Bell, BellOff, Bluetooth, AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";
import sectorScenes from "./assets/sector-scenes.webp";

const ICONS = { Megaphone, ShoppingCart, Calculator, Factory, Truck, Headphones };
const METODO_ICONS = { "Retira": Building2, "Envío": Truck, "Envío flex": Truck, "Interior": Truck, "Colocación": Wrench, "Otro": Package };
const QUICK_ICONS = { MessageCircle, Check, ShoppingCart };
const SUBPAGE_ICONS = {
  presupuestador: Calculator,
  pedidos: ClipboardList,
  crm: Users,
  recursos: FileText,
  tareas: CheckCircle2,
  finanzas: Wallet,
  comisiones: CircleDollarSign,
  sueldos: Users,
  materiales: Package,
  stock: Building2,
  envios: Truck,
  facturas: FileText,
  reclamos: AlertTriangle,
};

const SECTOR_DESCRIPTIONS = {
  marketing: "Marca, campañas y contenidos",
  ventas: "Presupuestos, clientes y pedidos",
  administracion: "Finanzas, equipo y control",
  fabrica: "Producción, materiales y stock",
  postventa: "Entregas, facturación y reclamos",
  logistica: "Despachos y distribución",
};

const SECTOR_VISUAL = {
  marketing:      { accent: "#C96F5D", position: "0% 0%" },
  ventas:         { accent: "#C28B47", position: "50% 0%" },
  administracion: { accent: "#8A9161", position: "100% 0%" },
  fabrica:        { accent: "#A89782", position: "0% 100%" },
  postventa:      { accent: "#A66A75", position: "50% 100%" },
  logistica:      { accent: "#B46F43", position: "100% 100%" },
};

function RoomScene({ sector }) {
  const visual = SECTOR_VISUAL[sector.id] || { accent: "var(--dg-accent)", position: "50% 50%" };
  const Icon = ICONS[sector.icon];
  return (
    <div className="dg-room-scene" style={{ "--accent": visual.accent }}>
      <div className="dg-scene-image" style={{ backgroundImage: `url(${sectorScenes})`, backgroundPosition: visual.position }} />
      <div className="dg-scene-shade" />
      {Icon && <Icon className="dg-scene-watermark" />}
    </div>
  );
}
const CHART_PALETTE = ["var(--dg-accent)", "var(--dg-warning)", "var(--dg-danger)", "var(--dg-success)", "#A66A75", "#8A9161"];

const DEFAULT_SECTORS = [
  { id: "marketing",      name: "Marketing y Publicidad",  icon: "Megaphone",    tipo: "oficina",  encargado: "", clave: null, operarios: [], tasks: [] },
  { id: "ventas",         name: "Ventas",                   icon: "ShoppingCart", tipo: "oficina",  encargado: "", clave: null, operarios: [], tasks: [] },
  { id: "administracion", name: "Administración",           icon: "Calculator",   tipo: "oficina",  encargado: "", clave: null, operarios: [], tasks: [] },
  { id: "fabrica",        name: "Fábrica",                  icon: "Factory",      tipo: "fabrica",  encargado: "", clave: null, operarios: [], tasks: [] },
  { id: "postventa",      name: "PostVenta",                 icon: "Headphones",   tipo: "oficina",  encargado: "", clave: null, operarios: [], tasks: [] },
  { id: "logistica",      name: "Logística y Distribución", icon: "Truck",        tipo: "despacho", encargado: "", clave: null, operarios: [], tasks: [] },
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
  green:  { glow: "var(--dg-success)", label: "Al día" },
  yellow: { glow: "var(--dg-warning)", label: "Atención" },
  red:    { glow: "var(--dg-danger)", label: "Crítico" },
  gray:   { glow: "var(--dg-text-faint)", label: "Sin tareas" },
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

// Suma lo que se le paga a TODOS los empleados en un mes puntual (formato
// "YYYY-MM"), usando exactamente el mismo cálculo que ya usa la planilla de
// Sueldos — así "gastos fijos" nunca queda desactualizado con lo real.
function totalSueldosDelMes(mes, empleados, liquidaciones, pedidos) {
  if (!empleados || !liquidaciones) return 0;
  return empleados.reduce((acc, emp) => {
    const fila = liquidaciones.find((l) => l.empleadoId === emp.id && l.periodo === mes && l.semanas) || null;
    const comisionAutomatica = emp.sector !== "Taller" ? (resumenComisionesLiquidadas(pedidos || [], emp, mes)?.total || 0) : 0;
    return acc + totalesFila(emp, fila, comisionAutomatica).total;
  }, 0);
}

function sumarMeses(mes, n) {
  const [y, m] = String(mes || "").split("-").map(Number);
  if (!y || !m) return mes;
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Cómo funciona el IVA acá (así lo pediste vos):
// - El IVA de lo que se vende (débito) generado en un mes, se paga recién 2
//   meses después.
// - El IVA de lo que se compra (crédito) se descuenta el MISMO mes en que se
//   compra, contra el débito que corresponde pagar ese mes.
// Entonces: lo que hay que pagar de IVA en el mes M = débito generado en
// (M-2), menos el crédito de las compras hechas en M.
function ivaDebitoGeneradoEnMes(mes, incomes) {
  const base = (incomes || [])
    .filter((i) => (i.fecha || "").slice(0, 7) === mes && (i.cuenta || "ingresos_bancarios") === "ingresos_bancarios" && i.estado === "pagado")
    .reduce((a, i) => a + Number(i.monto || 0), 0);
  return base * (IVA_RATE / (1 + IVA_RATE));
}
function ivaCreditoDeMes(mes, purchases) {
  const base = (purchases || [])
    .filter((p) => (p.fecha || "").slice(0, 7) === mes && p.conIva && p.estado === "pagado")
    .reduce((a, p) => a + Number(p.monto || 0), 0);
  return base * (IVA_RATE / (1 + IVA_RATE));
}
function ivaAPagarEnMes(mesDePago, incomes, purchases) {
  const mesDeVentaOrigen = sumarMeses(mesDePago, -2);
  const debito = ivaDebitoGeneradoEnMes(mesDeVentaOrigen, incomes);
  const credito = ivaCreditoDeMes(mesDePago, purchases);
  return { debito, credito, mesDeVentaOrigen, aPagar: Math.max(0, debito - credito) };
}

function determineCuentaPedido(pedido) {
  if (pedido.tipo === "Importado") return "ahorro_importados";
  if (pedido.tipoFactura === "Efectivo / No") return "caja_efectivo";
  return "ingresos_bancarios";
}

const LEAD_CHANNELS = { whatsapp: "WhatsApp", instagram: "Instagram", local: "Local / Showroom", otro: "Otro" };
const LEAD_STATES = {
  mensaje_enviado: { label: "Mensaje enviado", color: "var(--dg-text-dim)" },
  respondio: { label: "Respondió", color: "var(--dg-accent)" },
  no_respondio: { label: "No respondió", color: "var(--dg-danger)" },
  venta_cerrada: { label: "Venta cerrada", color: "var(--dg-success)" },
  perdido: { label: "Sin cerrar / Perdido", color: "var(--dg-warning)" },
};
const DEFAULT_VENDEDORES = ["Cande", "Dou", "Facu", "Fran", "Sergio"];

const QUICK_BUTTONS = [
  { estado: "mensaje_enviado", label: "Le escribí a alguien", icon: "MessageCircle", color: "var(--dg-text-dim)" },
  { estado: "respondio", label: "Me respondió", icon: "Check", color: "var(--dg-accent)" },
  { estado: "venta_cerrada", label: "¡Compró!", icon: "ShoppingCart", color: "var(--dg-success)" },
];

const FORMA_OPTIONS = ["Rectangular", "Pastilla", "Circular", "P. Curvas", "Ovalado", "Orgánico", "Capilla Arriba", "Capilla Abajo", "Capilla Izquierda", "Soft Orgánico", "Otro"];
const TIPO_PEDIDO_OPTIONS = ["Simple", "Importado", "Esm.", "Sin led", "Biselado"];
const TOUCH_OPTIONS = ["Touch", "Doble touch (frontal + perimetral)", "No"];
const DESEMP_OPTIONS = ["Desempañante", "No"];
const DESEMP_TIPO_OPTIONS = ["220", "Touch"];
const HORATEMP_OPTIONS = ["Hora y Temperatura", "No"];
const BLUETOOTH_PEDIDO_OPTIONS = ["No", "Bluetooth 1 parlante", "Bluetooth 2 parlantes"];
const TONO_OPTIONS = ["3 tonos", "Cálida", "Fría", "Neutra", "Sin led"];
const TIPOFACTURA_OPTIONS = ["Efectivo / No", "Cons. Final / B", "EcomApp", "Factura A", "No aplica", "Cambio de espejo"];
const ESTADO_PEDIDO_OPTIONS = ["Sin pasar a fábrica", "Verificado", "Mandar a grabar", "En grabado", "Sin pedir", "En biseladora", "Pedir biselado", "Para armar", "Espejo listo", "Despachado", "Entregado", "Cancelado"];
const MOTIVOS_CANCELACION = ["Cliente se arrepintió", "Precio", "Demora en la entrega", "Cliente no responde", "Error de carga", "Otro"];
const MOTIVOS_REPROCESO = ["Espejo dañado en fábrica", "Medida incorrecta", "Cliente pidió un cambio", "Falla en una función (touch, luz, etc)", "Se rompió en el transporte", "Otro"];
const METODO_OPTIONS = ["A confirmar", "Retira", "Envío", "Envío flex", "Interior", "Colocación", "Otro"];
const PULIDO_OPTIONS = ["No", "Sí"];
const TALLER_MODELOS = [
  { id: "simples", label: "Simples", description: "Corte, pulido y armado estándar", color: "var(--dg-accent)" },
  { id: "esmerilados", label: "Esmerilados", description: "Grabado o esmerilado antes del armado", color: "var(--dg-warning)" },
  { id: "biselados", label: "Biselados", description: "Proceso de biselado y terminación especial", color: "#A66A75" },
];
const TALLER_LISTAS = [
  { id: "armar", label: "Espejos para armar", shortLabel: "Para armar", description: "Corte, armado y embalado dentro del taller", color: "var(--dg-accent)" },
  { id: "mandar_grabar", label: "Para mandar a grabar", shortLabel: "A grabar", description: "Esmerilados ya cortados que todavía no salieron", color: "var(--dg-warning)" },
  { id: "en_grabado", label: "En grabado", shortLabel: "En grabado", description: "Esmerilados que están trabajando afuera", color: "#8A9161" },
  { id: "bisel_sin_pedir", label: "Biselados sin pedir", shortLabel: "Sin pedir", description: "Biselados que todavía hay que encargar", color: "#A66A75" },
  { id: "bisel_pedidos", label: "Biselados pedidos", shortLabel: "En biseladora", description: "Biselados pedidos que todavía no regresaron", color: "#B46F43" },
];
const PRODUCCION_PASOS = [
  { id: "cortado", label: "Cortado", accion: "Marcar cortado", fechaCampo: "produccionCortadoFecha", responsableCampo: "produccionCortadoPor" },
  { id: "armado", label: "Armado", accion: "Marcar armado", fechaCampo: "produccionArmadoFecha", responsableCampo: "produccionArmadoPor" },
  { id: "embalado", label: "Embalado", accion: "Marcar embalado", fechaCampo: "produccionEmbaladoFecha", responsableCampo: "produccionEmbaladoPor" },
];
const ENTREGA_ESTILO = {
  "Interior": { clase: "interior", color: "#A66A75", icono: "🚚" },
  "Envío flex": { clase: "flex", color: "var(--dg-warning)", icono: "⚡" },
  "Envío": { clase: "envio", color: "var(--dg-accent)", icono: "🚚" },
  "Colocación": { clase: "coloca", color: "#8A9161", icono: "🔧" },
  "Retira": { clase: "retira", color: "var(--dg-text-dim)", icono: "🏢" },
  default: { clase: "otro", color: "var(--dg-text-dim)", icono: "📦" },
};

const ENVIO_METODOS = ["Envío", "Envío flex", "Interior", "Colocación"];
const METODOS_ENVIO_GENERAL = ["Envío", "Envío flex", "Colocación"];

function esPedidoConEnvio(pedido) {
  return ENVIO_METODOS.includes(pedido?.metodo);
}

function costoEnvioPedido(pedido) {
  return Math.max(0, Number(pedido?.costoEnvio) || 0);
}

function envioPendientePedido(pedido) {
  return esPedidoConEnvio(pedido) && !pedido?.envioPagado ? costoEnvioPedido(pedido) : 0;
}

function totalPendientePedido(pedido) {
  return Math.max(0, pedidoSaldo(pedido)) + envioPendientePedido(pedido);
}

function detalleCobroEntrega(pedido) {
  const saldoEspejo = Math.max(0, pedidoSaldo(pedido));
  if (!esPedidoConEnvio(pedido)) {
    return saldoEspejo > 0 ? `💰 Saldo pendiente: ${money(saldoEspejo)}` : "💰 Ya está todo abonado, no queda saldo pendiente.";
  }

  const costoEnvio = costoEnvioPedido(pedido);
  const envioPendiente = envioPendientePedido(pedido);
  const total = totalPendientePedido(pedido);
  const lineas = [
    saldoEspejo > 0 ? `🪞 Saldo del espejo: ${money(saldoEspejo)}` : "🪞 Espejo: saldado",
    costoEnvio > 0
      ? pedido?.envioPagado
        ? `🚚 Envío: ${money(costoEnvio)} (pagado)`
        : `🚚 Envío pendiente: ${money(costoEnvio)}`
      : "🚚 Envío: monto a confirmar",
  ];
  if (total > 0) lineas.push(`💰 ${costoEnvio > 0 ? "Total a pagar" : "Total parcial"}: ${money(total)}`);
  else lineas.push("💰 No queda saldo pendiente.");
  return lineas.join("\n");
}

function pedidoFueVerificado(pedido) {
  return Boolean(pedido) && pedido.estado !== "Sin pasar a fábrica" && pedido.estado !== "Cancelado";
}

function pedidoEstaListo(pedido) {
  return pedido?.estado === "Espejo listo" || pedido?.estado === "Entregado" || pedido?.estado === "Despachado";
}

function pasosProduccionCompletados(pedido) {
  if (pedidoEstaListo(pedido)) return PRODUCCION_PASOS.length;
  const index = PRODUCCION_PASOS.findIndex((paso) => paso.id === pedido?.produccionEtapa);
  if (index >= 0) return index + 1;
  // Compatibilidad con pedidos antiguos que usaban estados operativos del Excel.
  if (pedido?.estado === "Para armar") return 1;
  return 0;
}

const SECTOR_SUBPAGES = {
  marketing: [{ id: "biblioteca", label: "Biblioteca" }, { id: "calendario", label: "Calendario de contenido" }, { id: "tareas", label: "Tareas" }],
  ventas: [
    { id: "presupuestador", label: "Presupuestador" },
    { id: "pedidos", label: "Pedidos" },
    { id: "crm", label: "CRM (Kommo)" },
    { id: "recursos", label: "Catálogos y precios" },
    { id: "tareas", label: "Tareas" },
  ],
  administracion: [
    { id: "pedidos", label: "Lista de ventas" },
    { id: "finanzas", label: "Finanzas" },
    { id: "comisiones", label: "Comisiones" },
    { id: "sueldos", label: "Sueldos" },
    { id: "tareas", label: "Tareas" },
  ],
  fabrica: [
    { id: "pedidos", label: "Pedidos de fábrica" },
    { id: "materiales", label: "Stock de materiales" },
    { id: "stock", label: "Stock de espejos" },
    { id: "tareas", label: "Tareas" },
  ],
  postventa: [
    { id: "envios", label: "Envíos" },
    { id: "interior", label: "Envíos al interior" },
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
const RECLAMO_COLORS = ["var(--dg-danger)", "var(--dg-warning)", "var(--dg-accent)", "var(--dg-text-dim)", "#A66A75", "#8A9161", "var(--dg-success)"];

const ESTADO_PEDIDO_COLOR = {
  "Sin pasar a fábrica": "var(--dg-text-dim)", "Verificado": "var(--dg-warning)", "Pasado a fábrica": "var(--dg-accent)", "Mandar a grabar": "var(--dg-warning)",
  "En grabado": "#8A9161", "Sin pedir": "#A66A75", "En biseladora": "#B46F43", "Pedir biselado": "#A66A75", "Para armar": "var(--dg-warning)", "Espejo listo": "var(--dg-accent)", "Entregado": "var(--dg-success)",
  "Cancelado": "var(--dg-danger)",
};
const COMISION_COLOR = { "No": "var(--dg-text-dim)", "Liquidar": "var(--dg-warning)", "Sí": "var(--dg-success)", "No aplica": "var(--dg-text-faint)" };

const METODO_ICON = { "Retira": "Building2", "Envío": "Truck", "Envío flex": "Truck", "Interior": "Truck", "Colocación": "Wrench", "Otro": "Package" };

const ESTADO_STAGE = {
  "Sin pasar a fábrica": { stage: "Sin verificar", color: "var(--dg-text-dim)" },
  "Verificado": { stage: "Verificado", color: "var(--dg-warning)" },
  "Pasado a fábrica": { stage: "Verificado", color: "var(--dg-warning)" },
  "Mandar a grabar": { stage: "Para mandar a grabar", color: "var(--dg-warning)" },
  "En grabado": { stage: "En grabado", color: "#8A9161" },
  "Sin pedir": { stage: "Biselado sin pedir", color: "#A66A75" },
  "En biseladora": { stage: "Biselado pedido · en biseladora", color: "#B46F43" },
  "Pedir biselado": { stage: "Biselado sin pedir", color: "#A66A75" },
  "Para armar": { stage: "Para armar", color: "var(--dg-warning)" },
  "Espejo listo": { stage: "Espejo listo", color: "var(--dg-accent)" },
  "Despachado": { stage: "Despachado", color: "var(--dg-success)" },
  "Entregado": { stage: "Entregado", color: "var(--dg-success)" },
  "Cancelado": { stage: "Cancelado", color: "var(--dg-danger)" },
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
  const groupKeySignature = groups.map((g) => g.key).join("|");
  useEffect(() => {
    if (groups.length === 0) return;
    setOpenKeys((prev) => {
      if (groups.some((g) => prev.has(g.key))) return prev;
      return new Set(groups.slice(0, defaultOpenCount).map((g) => g.key));
    });
  }, [groupKeySignature, defaultOpenCount]);
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
  const saldoTexto = detalleCobroEntrega(p);
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

// Convierte el usuario que la persona tipea ("Facundo", "franco") en el
// email interno con el que está registrada en el portero (Supabase Auth).
function usuarioAEmail(nombre) {
  const limpio = (nombre || "").normalize("NFD").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${limpio}@decoglass.app`;
}

const SESSION_KEY = "dg-session-v1";
function loadSavedSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function saveSession(s) {
  try {
    if (s) window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch (e) { /* si el navegador lo bloquea, la sesión simplemente no persiste */ }
}

const MATERIAL_CATEGORIAS = ["Vidrio", "Perfilería", "Iluminación", "Electrónica", "Químicos", "Embalaje", "Ferretería", "Otro"];

const DEFAULT_MATERIALES = [
  { categoria: "Vidrio", nombre: "Plancha de espejo", unidad: "u", minimo: 3 },
  { categoria: "Perfilería", nombre: "Aluminio (perfil)", unidad: "u", minimo: 7 },
  { categoria: "Iluminación", nombre: "Tira LED 3 tonos", unidad: "u", minimo: 20 },
  { categoria: "Electrónica", nombre: "Transformador", unidad: "u", minimo: 20 },
  { categoria: "Electrónica", nombre: "Sensor touch", unidad: "u", minimo: 15 },
  { categoria: "Electrónica", nombre: "Panel desempañante 30x30", unidad: "u", minimo: 5 },
  { categoria: "Electrónica", nombre: "Panel desempañante 30x40", unidad: "u", minimo: 5 },
  { categoria: "Electrónica", nombre: "Panel desempañante 40x60", unidad: "u", minimo: 5 },
  { categoria: "Electrónica", nombre: "Módulo hora y temperatura", unidad: "u", minimo: 10 },
  { categoria: "Electrónica", nombre: "Módulo Bluetooth", unidad: "u", minimo: 10 },
  { categoria: "Electrónica", nombre: "Parlante", unidad: "u", minimo: 10 },
  { categoria: "Químicos", nombre: "Sellador / silicona", unidad: "u", minimo: 6 },
  { categoria: "Químicos", nombre: "Alcohol isopropílico", unidad: "u", minimo: 6 },
  { categoria: "Embalaje", nombre: "Film burbuja", unidad: "u", minimo: 2 },
  { categoria: "Embalaje", nombre: "Film stretch", unidad: "u", minimo: 2 },
  { categoria: "Embalaje", nombre: "Cinta de embalar", unidad: "u", minimo: 10 },
  { categoria: "Embalaje", nombre: "Cartón para puntas", unidad: "u", minimo: 40 },
  { categoria: "Embalaje", nombre: "Madera para cajón (interior)", unidad: "u", minimo: 3 },
  { categoria: "Embalaje", nombre: "Telgopor (interior)", unidad: "u", minimo: 10 },
  { categoria: "Ferretería", nombre: "Pitones", unidad: "u", minimo: 50 },
  { categoria: "Ferretería", nombre: "Tarugos", unidad: "u", minimo: 50 },
];
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

const SHARED_SYNC_KEYS = [
  "sectors", "payments", "incomes", "quote-config", "quotes", "leads",
  "vendedores", "recursos-venta", "facturas-manuales",
  "empleados-sueldo", "liquidaciones-sueldo",
  "auditoria", "admins", "integraciones", "proveedores", "gastos-fijos-plantillas",
  "marketing-biblioteca", "marketing-contenido",
];

function App() {
  const [sectors, setSectors] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [incomes, setIncomes] = useState(null);
  const [quoteConfig, setQuoteConfig] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const [leads, setLeads] = useState(null);
  const [vendedores, setVendedores] = useState(null);
  const [proveedores, setProveedores] = useState(null);
  const [gastosFijosPlantillas, setGastosFijosPlantillas] = useState(null);
  const [bibliotecaMarketing, setBibliotecaMarketing] = useState(null);
  const [contenidoMarketing, setContenidoMarketing] = useState(null);
  const [pedidos, setPedidos] = useState(null);
  const [recursos, setRecursos] = useState(null);
  const [facturas, setFacturas] = useState(null);
  const [reclamos, setReclamos] = useState(null);
  const [stockEspejos, setStockEspejos] = useState(null);
  const [stockMateriales, setStockMateriales] = useState(null);
  const [empleadosSueldo, setEmpleadosSueldo] = useState(null);
  const [liquidaciones, setLiquidaciones] = useState(null);
  const [adminKeyExists, setAdminKeyExists] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [integraciones, setIntegraciones] = useState({ kommoSubdominio: "" });
  const [auditoria, setAuditoria] = useState([]);
  const [saveState, setSaveState] = useState({ estado: "idle" });
  const [syncState, setSyncState] = useState("connecting");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(() => loadSavedSession());
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem("dg-theme");
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch (e) { return "dark"; }
  });
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { window.localStorage.setItem("dg-theme", next); } catch (e) {}
  }
  useEffect(() => {
    document.documentElement.dataset.dgTheme = theme;
    document.documentElement.style.colorScheme = theme;
    document.body.style.backgroundColor = theme === "dark" ? "#0C0C0D" : "#E6E3DE";
  }, [theme]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [ajustesOpen, setAjustesOpen] = useState(false);
  const [panelNotifOpen, setPanelNotifOpen] = useState(false);
  const [vistaPanel, setVistaPanel] = useState(false);
  const [activeSectorId, setActiveSectorId] = useState(null);
  const syncVersionsRef = useRef({});
  const syncRefreshingRef = useRef(false);
  const pedidosRefreshingRef = useRef(false);
  const localWritesRef = useRef({});

  function startSession(s) {
    setSession(s);
    saveSession(s);
    setLoginOpen(false);
    // Recargar los datos ahora que hay sesión: así cada uno ve lo que le
    // corresponde según su rol, sin tener que refrescar la página.
    load();
  }
  async function endSession() {
    setSession(null);
    saveSession(null);
    try { await supabase.auth.signOut(); } catch (e) { /* no bloquea el cierre de sesión local */ }
    // Recargar sin sesión: saca de memoria los datos que ya no corresponden.
    load();
  }

  useEffect(() => { load(); }, []);
  // Al abrir: si hay una sesión guardada localmente pero el portero ya no la
  // reconoce (entró con el sistema viejo, o la sesión venció), la limpiamos.
  // Así vuelve a iniciar sesión y queda una sesión real del portero, que es
  // lo que necesitan las reglas de seguridad de la base.
  useEffect(() => {
    let vivo = true;
    (async () => {
      if (!loadSavedSession()) return;
      try {
        const { data } = await supabase.auth.getSession();
        if (vivo && !data?.session) { setSession(null); saveSession(null); }
      } catch (e) { /* sin conexión: no forzamos nada */ }
    })();
    return () => { vivo = false; };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("notificaciones") === "1") {
      setPanelNotifOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeSectorId]);

  useEffect(() => {
    if (saveState.estado !== "ok") return;
    const t = setTimeout(() => setSaveState({ estado: "idle" }), 1800);
    return () => clearTimeout(t);
  }, [saveState]);

  function applySharedRow(row) {
    if (!row?.key || typeof row.value !== "string" || !SHARED_SYNC_KEYS.includes(row.key)) return;

    const knownVersion = syncVersionsRef.current[row.key];
    if (row.updated_at && knownVersion && row.updated_at <= knownVersion) return;

    // Mientras esta pantalla está guardando una versión propia, no deja que
    // un aviso anterior pise el cambio optimista que la persona acaba de hacer.
    const localValue = localWritesRef.current[row.key];
    if (localValue && localValue !== row.value) return;

    let parsed;
    try { parsed = JSON.parse(row.value); } catch (error) { return; }

    const setters = {
      sectors: setSectors,
      payments: setPurchases,
      incomes: setIncomes,
      "quote-config": setQuoteConfig,
      quotes: setQuotes,
      leads: setLeads,
      vendedores: setVendedores,
      "recursos-venta": setRecursos,
      "facturas-manuales": setFacturas,
      "empleados-sueldo": setEmpleadosSueldo,
      "liquidaciones-sueldo": setLiquidaciones,
      auditoria: setAuditoria,
      admins: setAdmins,
      integraciones: setIntegraciones,
      proveedores: setProveedores,
      "gastos-fijos-plantillas": setGastosFijosPlantillas,
      "marketing-biblioteca": setBibliotecaMarketing,
      "marketing-contenido": setContenidoMarketing,
    };

    setters[row.key]?.(parsed);
    if (row.key === "admins") setAdminKeyExists(Array.isArray(parsed) && parsed.length > 0);
    if (row.updated_at) syncVersionsRef.current[row.key] = row.updated_at;
  }

  async function refreshSharedData(full = false) {
    if (syncRefreshingRef.current) return;
    syncRefreshingRef.current = true;
    try {
      if (full) {
        const rows = await storage.getMany(SHARED_SYNC_KEYS);
        rows.forEach(applySharedRow);
        return;
      }

      const versions = await storage.getVersions(SHARED_SYNC_KEYS);
      const changedKeys = versions
        .filter((row) => !syncVersionsRef.current[row.key] || row.updated_at > syncVersionsRef.current[row.key])
        .map((row) => row.key);
      if (!changedKeys.length) return;

      const rows = await storage.getMany(changedKeys);
      rows.forEach(applySharedRow);
    } catch (error) {
      // Si no hay conexión, conserva la información ya visible y vuelve a
      // intentar en el siguiente ciclo automático.
    } finally {
      syncRefreshingRef.current = false;
    }
  }

  useEffect(() => {
    if (loading) return undefined;

    let active = true;
    const unsubscribe = storage.subscribe(
      (row) => { if (active) applySharedRow(row); },
      (status) => {
        if (!active) return;
        setSyncState(status === "SUBSCRIBED" ? "live" : status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED" ? "fallback" : "connecting");
      }
    );

    refreshSharedData(true);
    const interval = window.setInterval(() => refreshSharedData(false), 4000);
    const refreshNow = () => refreshSharedData(false);
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refreshNow(); };
    window.addEventListener("focus", refreshNow);
    window.addEventListener("online", refreshNow);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      active = false;
      unsubscribe();
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshNow);
      window.removeEventListener("online", refreshNow);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loading]);

  // Sincronización de pedidos: como cada uno vive en su propia fila, refrescar
  // siempre trae la versión real de todos — nunca puede "perder" el cambio de
  // otra persona, porque nadie reescribe el conjunto entero al guardar.
  async function refreshPedidos() {
    if (pedidosRefreshingRef.current) return;
    pedidosRefreshingRef.current = true;
    try {
      const frescos = normalizarOrdenesPorGrupo(await pedidosStore.getAll());
      setPedidos(frescos);
    } catch (e) {
      // sin conexión: se mantiene lo que ya está visible
    } finally {
      pedidosRefreshingRef.current = false;
    }
  }

  function crearRefrescador(store, setter, refreshingRef) {
    return async function refrescar() {
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      try {
        setter(await store.getAll());
      } catch (e) {
        // sin conexión: se mantiene lo que ya está visible
      } finally {
        refreshingRef.current = false;
      }
    };
  }
  const reclamosRefreshingRef = useRef(false);
  const stockEspejosRefreshingRef = useRef(false);
  const stockMaterialesRefreshingRef = useRef(false);
  const refreshReclamos = crearRefrescador(reclamosStore, setReclamos, reclamosRefreshingRef);
  const refreshStockEspejos = crearRefrescador(stockEspejosStore, setStockEspejos, stockEspejosRefreshingRef);
  const refreshStockMateriales = crearRefrescador(stockMaterialesStore, setStockMateriales, stockMaterialesRefreshingRef);

  useEffect(() => {
    if (loading) return undefined;
    let active = true;
    const unsubPedidos = pedidosStore.subscribeRealtime(() => { if (active) refreshPedidos(); });
    const unsubReclamos = reclamosStore.subscribeRealtime(() => { if (active) refreshReclamos(); });
    const unsubStockEspejos = stockEspejosStore.subscribeRealtime(() => { if (active) refreshStockEspejos(); });
    const unsubStockMateriales = stockMaterialesStore.subscribeRealtime(() => { if (active) refreshStockMateriales(); });
    const refrescarTodo = () => { if (!active) return; refreshPedidos(); refreshReclamos(); refreshStockEspejos(); refreshStockMateriales(); };
    const interval = window.setInterval(refrescarTodo, 4000);
    const refreshWhenVisible = () => { if (active && document.visibilityState === "visible") refrescarTodo(); };
    window.addEventListener("focus", refreshWhenVisible);
    window.addEventListener("online", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      unsubPedidos(); unsubReclamos(); unsubStockEspejos(); unsubStockMateriales();
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      window.removeEventListener("online", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [loading]);

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
      const pr = await storage.get("proveedores", true);
      setProveedores(pr ? JSON.parse(pr.value) : []);
    } catch (e) { setProveedores([]); }
    try {
      const gf = await storage.get("gastos-fijos-plantillas", true);
      setGastosFijosPlantillas(gf ? JSON.parse(gf.value) : []);
    } catch (e) { setGastosFijosPlantillas([]); }
    try {
      const bm = await storage.get("marketing-biblioteca", true);
      setBibliotecaMarketing(bm ? JSON.parse(bm.value) : []);
    } catch (e) { setBibliotecaMarketing([]); }
    try {
      const cm = await storage.get("marketing-contenido", true);
      setContenidoMarketing(cm ? JSON.parse(cm.value) : []);
    } catch (e) { setContenidoMarketing([]); }
    try {
      let pedidosGuardados = await pedidosStore.getAll();
      if (pedidosGuardados.length === 0) {
        // Migración de una sola vez: si la tabla nueva está vacía pero el
        // bloque viejo (kv_store, clave "pedidos") tiene datos, los pasamos
        // a filas individuales. No se borra el bloque viejo, por las dudas.
        try {
          const viejo = await storage.get("pedidos", true);
          const viejosArray = viejo ? JSON.parse(viejo.value) : [];
          if (Array.isArray(viejosArray) && viejosArray.length > 0) {
            await pedidosStore.upsertMany(viejosArray);
            pedidosGuardados = viejosArray;
          }
        } catch (e) { /* sin datos viejos para migrar, sigue con lista vacía */ }
      }
      const pedidosNormalizados = normalizarOrdenesPorGrupo(pedidosGuardados);
      setPedidos(pedidosNormalizados);
      if (JSON.stringify(pedidosNormalizados) !== JSON.stringify(pedidosGuardados)) {
        try { await pedidosStore.upsertMany(pedidosNormalizados); } catch (error) {}
      }
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
      let reclamosGuardados = await reclamosStore.getAll();
      if (reclamosGuardados.length === 0) {
        try {
          const viejo = await storage.get("reclamos", true);
          const viejosArray = viejo ? JSON.parse(viejo.value) : [];
          if (Array.isArray(viejosArray) && viejosArray.length > 0) {
            await reclamosStore.upsertMany(viejosArray);
            reclamosGuardados = viejosArray;
          }
        } catch (e) { /* sin datos viejos para migrar */ }
      }
      setReclamos(reclamosGuardados);
    } catch (e) { setReclamos([]); }
    try {
      let espejosGuardados = await stockEspejosStore.getAll();
      if (espejosGuardados.length === 0) {
        try {
          const viejo = await storage.get("stock-espejos", true);
          const viejosArray = viejo ? JSON.parse(viejo.value) : [];
          if (Array.isArray(viejosArray) && viejosArray.length > 0) {
            await stockEspejosStore.upsertMany(viejosArray);
            espejosGuardados = viejosArray;
          }
        } catch (e) { /* sin datos viejos para migrar */ }
      }
      setStockEspejos(espejosGuardados);
    } catch (e) { setStockEspejos([]); }
    try {
      let materialesGuardados = await stockMaterialesStore.getAll();
      if (materialesGuardados.length === 0) {
        try {
          const viejo = await storage.get("stock-materiales", true);
          const viejosArray = viejo ? JSON.parse(viejo.value) : [];
          if (Array.isArray(viejosArray) && viejosArray.length > 0) {
            await stockMaterialesStore.upsertMany(viejosArray);
            materialesGuardados = viejosArray;
          }
        } catch (e) { /* sin datos viejos para migrar */ }
      }
      setStockMateriales(materialesGuardados);
    } catch (e) { setStockMateriales([]); }
    try {
      const emp = await storage.get("empleados-sueldo", true);
      setEmpleadosSueldo(emp ? JSON.parse(emp.value) : []);
    } catch (e) { setEmpleadosSueldo([]); }
    try {
      const liq = await storage.get("liquidaciones-sueldo", true);
      setLiquidaciones(liq ? JSON.parse(liq.value) : []);
    } catch (e) { setLiquidaciones([]); }
    try {
      const au = await storage.get("auditoria", true);
      setAuditoria(au ? JSON.parse(au.value) : []);
    } catch (e) { setAuditoria([]); }
    try {
      const ad = await storage.get("admins", true);
      let lista = ad ? JSON.parse(ad.value) : [];
      if (lista.length === 0) {
        const viejo = await storage.get("admin-key", true);
        if (viejo) lista = [{ id: uid(), nombre: "Facundo", clave: viejo.value }];
      }
      // Migración al modelo unificado: si hay entradas sin "rol" (formato viejo,
      // donde solo existían administradores), les asigna rol admin y además
      // incorpora el encargado/operarios que tuviera cada sector como usuarios propios.
      const necesitaMigrar = lista.some((u) => !u.rol);
      if (necesitaMigrar) {
        lista = lista.map((u) => (u.rol ? u : { ...u, rol: "admin", sectorId: null }));
        for (const sec of loadedSectors) {
          if (sec.clave && sec.encargado) lista.push({ id: uid(), nombre: sec.encargado, clave: sec.clave, rol: "encargado", sectorId: sec.id });
          for (const op of sec.operarios || []) lista.push({ id: uid(), nombre: op.nombre, clave: op.clave, rol: "operario", sectorId: sec.id });
        }
        try { await storage.set("admins", JSON.stringify(lista), true); } catch (e) {}
      }
      setAdmins(lista); setAdminKeyExists(lista.length > 0);
    } catch (e) { setAdminKeyExists(false); }
    try {
      const ig = await storage.get("integraciones", true);
      setIntegraciones(ig ? JSON.parse(ig.value) : { kommoSubdominio: "" });
    } catch (e) { setIntegraciones({ kommoSubdominio: "" }); }
    setLoading(false);
  }

  // Guardado con aviso: si falla, la persona se entera en vez de perder el dato en silencio.
  async function guardar(clave, valor, aplicarEnPantalla, revertir) {
    const serialized = JSON.stringify(valor);
    localWritesRef.current[clave] = serialized;
    aplicarEnPantalla();
    setSaveState({ estado: "guardando" });
    try {
      const saved = await storage.set(clave, serialized, true);
      if (saved?.updated_at) syncVersionsRef.current[clave] = saved.updated_at;
      delete localWritesRef.current[clave];
      setSaveState({ estado: "ok", ts: Date.now() });
    } catch (e) {
      delete localWritesRef.current[clave];
      setSaveState({ estado: "error", clave, mensaje: "No se pudo guardar. Revisá la conexión.", reintentar: () => guardar(clave, valor, aplicarEnPantalla, revertir) });
    }
  }

  async function persistSectors(next) { guardar("sectors", next, () => setSectors(next)); }
  async function persistPurchases(next) { guardar("payments", next, () => setPurchases(next)); }
  async function persistIncomes(next) { guardar("incomes", next, () => setIncomes(next)); }
  async function persistQuoteConfig(next) { guardar("quote-config", next, () => setQuoteConfig(next)); }
  async function persistQuotes(next) { guardar("quotes", next, () => setQuotes(next)); }
  async function persistLeads(next) { guardar("leads", next, () => setLeads(next)); }
  async function persistVendedores(next) { guardar("vendedores", next, () => setVendedores(next)); }
  // Guarda pedidos por fila individual: solo toca en la base los pedidos que
  // realmente cambiaron (se agregaron, se editaron o se borraron). Así, si
  // dos personas guardan pedidos distintos casi al mismo tiempo, nunca se
  // pisan entre sí — cada una solo escribe su propia fila.
  const pedidosRef = useRef(pedidos);
  pedidosRef.current = pedidos;

  // Helper genérico para las colecciones que ahora se guardan fila por fila
  // (igual que pedidos): solo escribe lo que cambió, nunca reemplaza el
  // conjunto entero — así dos personas editando cosas distintas al mismo
  // tiempo no se pisan el cambio.
  function crearPersistidorDeFilas(refActual, setter, store, claveError) {
    return async function persist(next) {
      const anterior = refActual.current || [];
      const prevById = new Map(anterior.map((item) => [item.id, item]));
      const nextIds = new Set(next.map((item) => item.id));
      const aGuardar = next.filter((item) => JSON.stringify(prevById.get(item.id)) !== JSON.stringify(item));
      const aBorrar = anterior.filter((item) => !nextIds.has(item.id)).map((item) => item.id);

      setter(next);
      if (aGuardar.length === 0 && aBorrar.length === 0) return;
      setSaveState({ estado: "guardando" });
      try {
        if (aGuardar.length) await store.upsertMany(aGuardar);
        if (aBorrar.length) await store.removeMany(aBorrar);
        setSaveState({ estado: "ok", ts: Date.now() });
      } catch (e) {
        setSaveState({ estado: "error", clave: claveError, mensaje: "No se pudo guardar. Revisá la conexión.", reintentar: () => persist(next) });
      }
    };
  }

  const reclamosRef = useRef(reclamos);
  reclamosRef.current = reclamos;
  const stockEspejosRef = useRef(stockEspejos);
  stockEspejosRef.current = stockEspejos;
  const stockMaterialesRef = useRef(stockMateriales);
  stockMaterialesRef.current = stockMateriales;

  const persistReclamos = crearPersistidorDeFilas(reclamosRef, setReclamos, reclamosStore, "reclamos");
  const persistStockEspejos = crearPersistidorDeFilas(stockEspejosRef, setStockEspejos, stockEspejosStore, "stock-espejos");
  const persistStockMateriales = crearPersistidorDeFilas(stockMaterialesRef, setStockMateriales, stockMaterialesStore, "stock-materiales");

  async function persistPedidos(next) {
    const anterior = pedidosRef.current || [];
    const prevById = new Map(anterior.map((p) => [p.id, p]));
    const nextIds = new Set(next.map((p) => p.id));
    const aGuardar = next.filter((p) => JSON.stringify(prevById.get(p.id)) !== JSON.stringify(p));
    const aBorrar = anterior.filter((p) => !nextIds.has(p.id)).map((p) => p.id);

    setPedidos(next);
    if (aGuardar.length === 0 && aBorrar.length === 0) return;
    setSaveState({ estado: "guardando" });
    try {
      if (aGuardar.length) await pedidosStore.upsertMany(aGuardar);
      if (aBorrar.length) await pedidosStore.removeMany(aBorrar);
      setSaveState({ estado: "ok", ts: Date.now() });
    } catch (e) {
      setSaveState({ estado: "error", clave: "pedidos", mensaje: "No se pudo guardar. Revisá la conexión.", reintentar: () => persistPedidos(next) });
    }
  }
  async function persistRecursos(next) { guardar("recursos-venta", next, () => setRecursos(next)); }
  async function persistFacturas(next) { guardar("facturas-manuales", next, () => setFacturas(next)); }
  async function persistAdmins(next) { guardar("admins", next, () => setAdmins(next)); }
  async function persistIntegraciones(next) { guardar("integraciones", next, () => setIntegraciones(next)); }
  async function persistProveedores(next) { guardar("proveedores", next, () => setProveedores(next)); }
  async function persistGastosFijosPlantillas(next) { guardar("gastos-fijos-plantillas", next, () => setGastosFijosPlantillas(next)); }
  async function persistBibliotecaMarketing(next) { guardar("marketing-biblioteca", next, () => setBibliotecaMarketing(next)); }
  async function persistContenidoMarketing(next) { guardar("marketing-contenido", next, () => setContenidoMarketing(next)); }
  async function persistEmpleadosSueldo(next) { guardar("empleados-sueldo", next, () => setEmpleadosSueldo(next)); }
  async function persistLiquidaciones(next) { guardar("liquidaciones-sueldo", next, () => setLiquidaciones(next)); }

  // Registro de actividad: queda quién hizo qué y cuándo.
  async function registrarActividad(accion, detalle) {
    const quien = session?.role === "admin" ? (session.nombre || "Admin")
      : session?.role === "sector" ? (sectors.find((x) => x.id === session.sectorId)?.name || "Sector")
      : "Sin sesión";
    const entrada = { id: uid(), fecha: new Date().toISOString(), quien, accion, detalle };
    const next = [entrada, ...auditoria].slice(0, 500);
    setAuditoria(next);
    try { await storage.set("auditoria", JSON.stringify(next), true); } catch (e) {}
  }

  function createIncomeFromPedido(entry) {
    const arr = Array.isArray(entry) ? entry : [entry];
    if (!arr.length) return;
    persistIncomes([...arr, ...incomes]);
  }
  function createPurchaseEntry(entry) { persistPurchases([entry, ...purchases]); }

  function updateSector(id, patch) { persistSectors(sectors.map((s) => (s.id === id ? { ...s, ...patch } : s))); }

  const counts = sectors ? sectors.reduce((acc, s) => { const { key } = getStatus(s.tasks); acc[key] = (acc[key] || 0) + 1; return acc; }, {}) : {};
  const isAdmin = session?.role === "admin";
  const isVentas = session?.role === "sector" && session.sectorId === "ventas";
  const canQuote = isAdmin || isVentas;
  const canSeePedidos = !!session;
  const canEditPedidoFull = isAdmin || isVentas;

  if (loading || !sectors || !purchases || !incomes || !quoteConfig || !quotes || !leads || !vendedores || !pedidos || !recursos || !facturas || !reclamos || !stockEspejos || !stockMateriales || !empleadosSueldo || !liquidaciones) {
    return (<div style={wrap}><Style /><div className="dg-app dg-loading" data-theme={theme}><Loader2 className="dg-spin" size={28} /><span>Cargando DECOGLASS...</span></div></div>);
  }

  const activeSector = sectors.find((s) => s.id === activeSectorId) || null;
  const rawDateLabel = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  const dateLabel = rawDateLabel.charAt(0).toUpperCase() + rawDateLabel.slice(1);

  function renderSectorRoom(sector, i) {
    const { key, pct } = getStatus(sector.tasks);
    const glow = STATUS[key].glow;
    const Icon = ICONS[sector.icon];
    return (
      <button
        key={sector.id}
        className={`dg-room-tile dg-room-tile-${sector.tipo}`}
        style={{ "--glow": glow }}
        onClick={() => { setActiveSectorId(sector.id); setVistaPanel(false); }}
        aria-label={`Abrir sector ${sector.name}`}
      >
        <RoomScene sector={sector} />
        <div className="dg-room-plate" style={{ "--glow": glow }}>
          <span className="dg-room-plate-num">{String(i + 1).padStart(2, "0")}</span>
          <div className="dg-room-plate-icon" style={{ "--glow": glow }}>{Icon && <Icon size={16} />}</div>
          <div className="dg-room-plate-text">
            <span className="dg-room-plate-name">{sector.name}</span>
            <span className="dg-room-plate-sub">{SECTOR_DESCRIPTIONS[sector.id]}</span>
          </div>
          <span className="dg-room-plate-pct" style={{ color: glow }}>{pct === null ? "—" : `${pct}%`}</span>
        </div>
        <div className="dg-room-enter" aria-hidden="true"><ChevronRight size={16} /></div>
      </button>
    );
  }

  return (
    <div style={wrap}>
      <Style />
      <div className="dg-app" data-theme={theme}>
        <header className="dg-header">
          <div className="dg-brand">
            <div className="dg-brand-mark">DG</div>
            <div><div className="dg-brand-title">DECOGLASS</div><div className="dg-brand-sub">Gestión de sectores · Espejos LED</div></div>
          </div>
          <div className="dg-header-context" aria-label="Estado de la plataforma">
            <span className="dg-live-label"><span className="dg-live-dot" /> {syncState === "live" ? "Sincronización en vivo" : syncState === "fallback" ? "Actualización automática" : "Conectando..."}</span>
            <span className="dg-header-date">{dateLabel}</span>
          </div>
          <button
            className="dg-icon-btn dg-theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === "dark" ? "Claro" : "Oscuro"}</span>
          </button>
          {session && <BotonNotificaciones session={session} />}
          {session && (
            <button className="dg-icon-btn" onClick={() => setPanelNotifOpen(true)} title="Ver resumen del día">
              <ClipboardList size={17} />
            </button>
          )}
          {session ? (
            <div className="dg-session">
              <span className="dg-session-badge">
                {session.role === "admin" ? <ShieldCheck size={14} /> : <User size={14} />}
                {session.role === "admin" ? (session.nombre || "Admin") : `${session.nombre || "Sector"} · ${sectors.find((s) => s.id === session.sectorId)?.name || ""}`}
              </span>
              {isAdmin && <button className="dg-icon-btn" onClick={() => setAjustesOpen(true)} title="Ajustes del sistema"><Settings2 size={17} /></button>}
              <button className="dg-icon-btn" onClick={endSession} title="Cerrar sesión"><LogOut size={16} /></button>
            </div>
          ) : (
            <button className="dg-login-btn" onClick={() => setLoginOpen(true)}><Lock size={14} /> Iniciar sesión</button>
          )}
        </header>

        <nav className="dg-nav dg-nav-breadcrumb">
          <button className={`dg-nav-btn ${!activeSectorId && !vistaPanel ? "dg-nav-on" : ""}`} onClick={() => { setActiveSectorId(null); setVistaPanel(false); }} aria-current={!activeSectorId && !vistaPanel ? "page" : undefined}><Building2 size={14} /> Edificio</button>
          {isAdmin && (
            <button className={`dg-nav-btn ${vistaPanel ? "dg-nav-on" : ""}`} onClick={() => { setVistaPanel(true); setActiveSectorId(null); }} aria-current={vistaPanel ? "page" : undefined}><BarChart3 size={14} /> Panel de control</button>
          )}
          {activeSector && !vistaPanel && (
            <span className="dg-nav-btn dg-nav-on dg-nav-crumb"><ChevronRight size={13} /> {activeSector.name}</span>
          )}
        </nav>

        {vistaPanel && isAdmin && (
          <PanelControlAdmin pedidos={pedidos} incomes={incomes} reclamos={reclamos} stockMateriales={stockMateriales} sectors={sectors} quoteConfig={quoteConfig} />
        )}

        {!activeSector && !vistaPanel && (
          <>
            <section className="dg-overview-head">
              <div className="dg-overview-copy">
                <span className="dg-eyebrow">Centro de operaciones</span>
                <h1>Tu empresa, sector por sector</h1>
                <p>Una vista simple de la operación. Elegí un ambiente para entrar a sus tareas y herramientas.</p>
              </div>
              <div className="dg-summary" aria-label="Resumen de estados">
                {["green", "yellow", "red", "gray"].map((k) => (
                  <div className="dg-chip" key={k} style={{ "--c": STATUS[k].glow }}><span className="dg-chip-dot" />{counts[k] || 0} {STATUS[k].label}</div>
                ))}
              </div>
            </section>
            <div className="dg-plant-outer">
              <div className="dg-building-shell">
                <div className="dg-building-head">
                  <div>
                    <span className="dg-building-kicker">Mapa de trabajo</span>
                    <strong>Edificio operativo</strong>
                  </div>
                  <span className="dg-building-count"><Building2 size={14} /> 6 sectores conectados</span>
                </div>
                <div className="dg-building-floor">
                  <div className="dg-floor-label"><strong>02</strong><span>Planta alta</span></div>
                  <div className="dg-plant-grid">{sectors.slice(0, 3).map((sector, i) => renderSectorRoom(sector, i))}</div>
                </div>
                <div className="dg-building-floor dg-building-ground">
                  <div className="dg-floor-label"><strong>01</strong><span>Planta baja</span></div>
                  <div className="dg-plant-grid">{sectors.slice(3).map((sector, i) => renderSectorRoom(sector, i + 3))}</div>
                </div>
                <div className="dg-building-foot"><span className="dg-live-dot" /> Seleccioná un ambiente para ver su operación</div>
              </div>
            </div>
          </>
        )}

        {activeSector && !vistaPanel && (
          <button className="dg-mobile-back-fab" onClick={() => setActiveSectorId(null)} aria-label="Volver al edificio" title="Volver al edificio">
            <ArrowLeft size={19} />
          </button>
        )}

        {activeSector && !vistaPanel && (
          <SectorPage
            sector={activeSector}
            index={sectors.findIndex((s) => s.id === activeSector.id)}
            session={session}
            isAdmin={isAdmin}
            onUpdate={(patch) => updateSector(activeSector.id, patch)}
            onRequestLogin={() => setLoginOpen(true)}
            onBack={() => setActiveSectorId(null)}
            pedidos={pedidos} onChangePedidos={persistPedidos} onRegistrar={registrarActividad}
            vendedores={vendedores} onChangeVendedores={persistVendedores}
            incomes={incomes} onChangeIncomes={persistIncomes}
            purchases={purchases} onChangePurchases={persistPurchases}
            quoteConfig={quoteConfig} onChangeQuoteConfig={persistQuoteConfig}
            quotes={quotes} onChangeQuotes={persistQuotes}
            leads={leads} onChangeLeads={persistLeads}
            onCreateIncome={createIncomeFromPedido}
            onCreatePurchase={createPurchaseEntry}
            admins={admins} onChangeAdmins={persistAdmins}
            auditoria={auditoria}
            kommoSubdominio={integraciones?.kommoSubdominio}
            sectors={sectors}
            recursos={recursos} onChangeRecursos={persistRecursos}
            facturas={facturas} onChangeFacturas={persistFacturas}
            reclamos={reclamos} onChangeReclamos={persistReclamos}
            stockEspejos={stockEspejos} onChangeStockEspejos={persistStockEspejos}
            stockMateriales={stockMateriales} onChangeStockMateriales={persistStockMateriales}
            empleadosSueldo={empleadosSueldo} onChangeEmpleadosSueldo={persistEmpleadosSueldo}
            liquidaciones={liquidaciones} onChangeLiquidaciones={persistLiquidaciones}
            proveedores={proveedores} onChangeProveedores={persistProveedores}
            gastosFijosPlantillas={gastosFijosPlantillas} onChangeGastosFijosPlantillas={persistGastosFijosPlantillas}
            bibliotecaMarketing={bibliotecaMarketing} onChangeBibliotecaMarketing={persistBibliotecaMarketing}
            contenidoMarketing={contenidoMarketing} onChangeContenidoMarketing={persistContenidoMarketing}
          />
        )}
      </div>

      {panelNotifOpen && session && <PanelNotificaciones session={session} onClose={() => setPanelNotifOpen(false)} />}

      {ajustesOpen && isAdmin && (
        <AjustesModal
          onClose={() => setAjustesOpen(false)}
          admins={admins} onChangeAdmins={persistAdmins} session={session}
          sectors={sectors}
          vendedores={vendedores} onChangeVendedores={persistVendedores}
          auditoria={auditoria}
          integraciones={integraciones} onChangeIntegraciones={persistIntegraciones}
          datos={{ pedidos, incomes, purchases, leads, reclamos, facturas, stockEspejos, stockMateriales, liquidaciones, empleados: empleadosSueldo, sectors, recursos, quotes, admins, auditoria }}
        />
      )}

      <SaveIndicator state={saveState} onDismiss={() => setSaveState({ estado: "idle" })} />

      {loginOpen && (
        <LoginModal
          usuarios={admins}
          sectors={sectors}
          onClose={() => setLoginOpen(false)}
          onCreateUsuario={(u) => persistAdmins([...(admins || []), u])}
          onSuccess={startSession}
        />
      )}
    </div>
  );
}

function SaveIndicator({ state, onDismiss }) {
  if (state.estado === "idle") return null;
  if (state.estado === "error") {
    return (
      <div className="dg-save-toast dg-save-error">
        <AlertTriangle size={16} />
        <div>
          <strong>No se guardó</strong>
          <span>{state.mensaje}</span>
        </div>
        {state.reintentar && <button className="dg-btn-primary dg-mini-btn" onClick={state.reintentar}>Reintentar</button>}
        <button className="dg-icon-btn" onClick={onDismiss}><X size={15} /></button>
      </div>
    );
  }
  return (
    <div className={`dg-save-toast ${state.estado === "ok" ? "dg-save-ok" : "dg-save-going"}`}>
      {state.estado === "ok" ? <Check size={15} /> : <Loader2 size={15} className="dg-spin" />}
      <span>{state.estado === "ok" ? "Guardado" : "Guardando..."}</span>
    </div>
  );
}

function LockedPage({ label, onLogin }) {
  return (
    <div className="dg-page dg-locked-page">
      <div className="dg-locked-icon"><Lock size={22} /></div>
      <div><strong>{label}</strong><p>Iniciá sesión para abrir este espacio y trabajar con los datos del equipo.</p></div>
      <button className="dg-btn-primary" onClick={onLogin}><Lock size={14} /> Iniciar sesión</button>
    </div>
  );
}

function audienciaDeSession(session) {
  if (!session) return null;
  if (session.role === "admin") return "admin";
  const mapa = { fabrica: "fabrica", ventas: "ventas", administracion: "administracion" };
  return mapa[session.sectorId] || "otros";
}

const NOTIF_SECCIONES = [
  { key: "demorados", label: "Pedidos demorados", icon: AlertTriangle, color: "var(--dg-danger)" },
  { key: "sinConfirmar", label: "Pedidos sin confirmar", icon: ClipboardList, color: "var(--dg-warning)" },
  { key: "pasadosDeFecha", label: "Pasados de fecha de entrega", icon: CalendarDays, color: "var(--dg-danger)" },
  { key: "reclamosSinResolver", label: "Reclamos sin resolver (+48hs)", icon: MessageCircle, color: "var(--dg-danger)" },
  { key: "comisionesPendientes", label: "Comisiones pendientes (+7 días)", icon: CircleDollarSign, color: "var(--dg-warning)" },
  { key: "stockBajo", label: "Materiales bajo el mínimo", icon: Package, color: "var(--dg-warning)" },
];

function detalleItemTexto(item) {
  if (item.tipo) return item.tipo;
  if (item.vendedor) return `Vendedor: ${item.vendedor}`;
  if (item.listo) return `Entrega: ${item.listo}`;
  if (item.cantidad !== undefined) return `${item.cantidad} / mínimo ${item.minimo} ${item.unidad || ""}`;
  return item.metodo || "";
}

function PanelNotificaciones({ session, onClose }) {
  const [resumen, setResumen] = useState(undefined);
  const audiencia = audienciaDeSession(session);

  useEffect(() => {
    let activo = true;
    if (!audiencia) { setResumen(null); return; }
    notificacionesStore.getUltimoDe(audiencia)
      .then((r) => { if (activo) setResumen(r); })
      .catch(() => { if (activo) setResumen(null); });
    return () => { activo = false; };
  }, [audiencia]);

  const detalle = resumen?.detalle || {};
  const seccionesConDatos = NOTIF_SECCIONES.filter((s) => detalle[s.key]?.length > 0);
  const totalGeneral = seccionesConDatos.reduce((a, s) => a + detalle[s.key].length, 0);

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal dg-modal-notificaciones" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head">
          <div>
            <div className="dg-modal-title">Resumen del día</div>
            {resumen && <div className="dg-modal-sub">{resumen.fecha}</div>}
          </div>
          <button className="dg-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {resumen === undefined && <div className="dg-loading" style={{ minHeight: 120 }}><Loader2 className="dg-spin" size={22} /></div>}
        {resumen === null && <div className="dg-empty">Todavía no hay ningún resumen generado para tu sector.</div>}
        {resumen && totalGeneral === 0 && <div className="dg-empty">Sin novedades hoy. 🎉</div>}
        {resumen && totalGeneral > 0 && (
          <div className="dg-notificaciones-secciones">
            {seccionesConDatos.map((s) => {
              const Ic = s.icon;
              return (
                <div className="dg-section-card" key={s.key}>
                  <div className="dg-section-header" style={{ color: s.color }}><Ic size={14} /> {s.label} ({detalle[s.key].length})</div>
                  <div className="dg-task-list" style={{ marginBottom: 0 }}>
                    {detalle[s.key].map((item) => (
                      <div className="dg-task" key={item.id}>
                        <div className="dg-pago-info">
                          <span>{item.orden ? `#${item.orden} — ` : ""}{item.cliente || item.nombre}</span>
                          <span className="dg-pago-meta">{detalleItemTexto(item)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const AUDIENCIA_LABEL = { admin: "Administradores", fabrica: "Fábrica", ventas: "Ventas", administracion: "Administración", otros: "Otros sectores" };

function HistorialNotificacionesPanel() {
  const [historial, setHistorial] = useState(undefined);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    notificacionesStore.getHistorial(90).then(setHistorial).catch(() => setHistorial([]));
  }, []);

  if (historial === undefined) return <div className="dg-loading" style={{ minHeight: 120 }}><Loader2 className="dg-spin" size={22} /></div>;
  if (historial.length === 0) return <div className="dg-empty">Todavía no se generó ningún resumen. Se arma solo, una vez por día.</div>;

  return (
    <div className="dg-task-list" style={{ maxHeight: "none" }}>
      {historial.map((r) => {
        const detalle = r.detalle || {};
        const total = Object.values(detalle).reduce((a, l) => a + (l?.length || 0), 0);
        const abierto = expandido === r.id;
        return (
          <div key={r.id} className="dg-notif-historial-fila">
            <button className="dg-notif-historial-head" onClick={() => setExpandido(abierto ? null : r.id)}>
              <ChevronRight size={14} className={abierto ? "dg-chev-open" : ""} />
              <div className="dg-pago-info">
                <span>{r.fecha} — {AUDIENCIA_LABEL[r.audiencia] || r.audiencia}</span>
                <span className="dg-pago-meta">{total === 0 ? "Sin novedades" : `${total} aviso(s)`}</span>
              </div>
            </button>
            {abierto && total > 0 && (
              <div className="dg-notif-historial-detalle">
                {NOTIF_SECCIONES.filter((s) => detalle[s.key]?.length > 0).map((s) => (
                  <div key={s.key} style={{ marginBottom: 8 }}>
                    <strong style={{ fontSize: 11.5, color: s.color }}>{s.label} ({detalle[s.key].length})</strong>
                    {detalle[s.key].map((item, i) => (
                      <div key={i} className="dg-pago-meta">{item.orden ? `#${item.orden} — ` : ""}{item.cliente || item.nombre} {detalleItemTexto(item) ? `· ${detalleItemTexto(item)}` : ""}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function mesesAtras(n) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 7); // "YYYY-MM"
}
function labelMes(ym) {
  const [y, m] = ym.split("-").map(Number);
  const nombre = new Date(y, m - 1, 1).toLocaleDateString("es-AR", { month: "short" });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "");
}

// Fecha de entrega en formato corto para el equipo: "27 ago", sin año (no
// hace falta para pedidos del año en curso, que es lo único que se ve acá).
function fechaEntregaCorta(fechaISO) {
  if (!fechaISO) return null;
  const [y, m, d] = fechaISO.split("-").map(Number);
  if (!y || !m || !d) return fechaISO;
  const nombre = new Date(y, m - 1, d).toLocaleDateString("es-AR", { month: "short" }).replace(".", "");
  return `${d} ${nombre}`;
}

function PanelControlAdmin({ pedidos, incomes, reclamos, stockMateriales, sectors, quoteConfig }) {
  const [resumenAlertas, setResumenAlertas] = useState(undefined);
  const [verDetalleMargen, setVerDetalleMargen] = useState(false);

  useEffect(() => {
    let activo = true;
    notificacionesStore.getUltimoDe("admin").then((r) => { if (activo) setResumenAlertas(r); }).catch(() => { if (activo) setResumenAlertas(null); });
    return () => { activo = false; };
  }, []);

  const mesActual = mesesAtras(0);
  const mesAnterior = mesesAtras(1);
  const facturacionMes = incomes.filter((i) => (i.fecha || "").slice(0, 7) === mesActual).reduce((a, i) => a + (Number(i.monto) || 0), 0);
  const facturacionMesAnterior = incomes.filter((i) => (i.fecha || "").slice(0, 7) === mesAnterior).reduce((a, i) => a + (Number(i.monto) || 0), 0);
  const variacion = facturacionMesAnterior > 0 ? ((facturacionMes - facturacionMesAnterior) / facturacionMesAnterior) * 100 : null;

  // Margen estimado: usa la misma fórmula de costos del presupuestador, con
  // los precios de materiales ACTUALES — no es contabilidad exacta, es una
  // referencia de tendencia (ver aviso en la propia tarjeta).
  const entregadosMesParaMargen = pedidos.filter((p) => p.estado === "Entregado" && (p.entregadoFecha || "").slice(0, 7) === mesActual);
  const ventaEntregadosMes = entregadosMesParaMargen.reduce((a, p) => a + (Number(p.monto) || 0), 0);
  const costoEntregadosMes = quoteConfig ? entregadosMesParaMargen.reduce((a, p) => a + estimarCostoPedido(p, quoteConfig), 0) : 0;
  const margenMes = ventaEntregadosMes - costoEntregadosMes;
  const margenPorcentaje = ventaEntregadosMes > 0 ? (margenMes / ventaEntregadosMes) * 100 : null;

  const activos = pedidos.filter((p) => p.estado !== "Cancelado");
  const etapas = [
    { id: "sinConfirmar", label: "Sin confirmar", color: "var(--dg-text-dim)", count: totalUnidades(activos.filter((p) => p.estado === "Sin pasar a fábrica")) },
    { id: "produccion", label: "En producción", color: "var(--dg-warning)", count: totalUnidades(activos.filter((p) => p.estado === "Verificado" || p.estado === "Pasado a fábrica")) },
    { id: "listos", label: "Listos para entregar", color: "var(--dg-accent)", count: totalUnidades(activos.filter((p) => p.estado === "Espejo listo")) },
    { id: "entregadosMes", label: "Entregados este mes", color: "var(--dg-success)", count: totalUnidades(pedidos.filter((p) => p.estado === "Entregado" && (p.entregadoFecha || "").slice(0, 7) === mesActual)) },
  ];

  const meses6 = Array.from({ length: 6 }, (_, i) => mesesAtras(5 - i));
  const datosGrafico = meses6.map((ym) => ({
    mes: labelMes(ym),
    ventas: incomes.filter((i) => (i.fecha || "").slice(0, 7) === ym).reduce((a, i) => a + (Number(i.monto) || 0), 0),
    reclamos: reclamos.filter((r) => (r.fecha || "").slice(0, 7) === ym).length,
  }));

  const detalle = resumenAlertas?.detalle || {};
  const alertasConDatos = NOTIF_SECCIONES.filter((s) => detalle[s.key]?.length > 0);
  const totalAlertas = alertasConDatos.reduce((a, s) => a + detalle[s.key].length, 0);

  return (
    <div className="dg-page dg-panel-control">
      <section className="dg-overview-head">
        <div className="dg-overview-copy">
          <span className="dg-eyebrow">Panel de control</span>
          <h1>Cómo está el negocio hoy</h1>
          <p>Un resumen para no tener que entrar sector por sector a buscar los números.</p>
        </div>
      </section>

      <div className="dg-panel-grid">
        <div className="dg-panel-card">
          <div className="dg-panel-card-label">Facturación de {labelMes(mesActual)}</div>
          <div className="dg-panel-card-valor">{money(facturacionMes)}</div>
          {variacion !== null ? (
            <div className={`dg-panel-card-variacion ${variacion >= 0 ? "dg-panel-up" : "dg-panel-down"}`}>
              {variacion >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {Math.abs(variacion).toFixed(0)}% vs {labelMes(mesAnterior)}
            </div>
          ) : (
            <div className="dg-panel-card-variacion">Sin datos de {labelMes(mesAnterior)} para comparar</div>
          )}
        </div>

        {quoteConfig && (
          <div className="dg-panel-card">
            <div className="dg-panel-card-label">
              Margen estimado del mes (entregados)
              {ventaEntregadosMes > 0 && (
                <button type="button" className="dg-panel-info-btn" onClick={() => setVerDetalleMargen(true)} title="Ver el detalle pedido por pedido">
                  <AlertCircle size={13} />
                </button>
              )}
            </div>
            {ventaEntregadosMes > 0 ? (
              <>
                <div className="dg-panel-card-valor" style={{ color: margenMes >= 0 ? "var(--dg-success)" : "var(--dg-danger)" }}>
                  {money(margenMes)} {margenPorcentaje !== null && <small style={{ fontSize: 13 }}>({margenPorcentaje.toFixed(0)}%)</small>}
                </div>
                <div className="dg-panel-card-variacion">Venta {money(ventaEntregadosMes)} − costo est. {money(costoEntregadosMes)}</div>
              </>
            ) : (
              <div className="dg-panel-card-valor" style={{ fontSize: 14, color: "var(--dg-text-dim)" }}>Sin entregas este mes</div>
            )}
          </div>
        )}

        {etapas.map((e) => (
          <div className="dg-panel-card" key={e.id}>
            <div className="dg-panel-card-label">{e.label}</div>
            <div className="dg-panel-card-valor" style={{ color: e.color }}>{e.count}</div>
          </div>
        ))}
      </div>

      {quoteConfig && ventaEntregadosMes > 0 && (
        <p className="dg-hint" style={{ marginTop: -10, marginBottom: 18 }}>
          El margen es una estimación con los precios de materiales de hoy, no el costo exacto de cada pedido en su momento — sirve para ver la tendencia, no como número contable exacto.
        </p>
      )}

      <div className="dg-section-card">
        <div className="dg-section-header"><Bell size={14} /> Alertas activas {totalAlertas > 0 && <span className="dg-badge" style={{ "--bc": "var(--dg-danger)" }}>{totalAlertas}</span>}</div>
        {resumenAlertas === undefined && <div className="dg-loading" style={{ minHeight: 80 }}><Loader2 className="dg-spin" size={20} /></div>}
        {resumenAlertas !== undefined && totalAlertas === 0 && <div className="dg-empty">Sin alertas activas. Todo en orden.</div>}
        {alertasConDatos.length > 0 && (
          <div className="dg-panel-alertas">
            {alertasConDatos.map((s) => {
              const Ic = s.icon;
              return (
                <div className="dg-panel-alerta-fila" key={s.key} style={{ "--ac": s.color }}>
                  <Ic size={14} />
                  <span>{s.label}</span>
                  <strong>{detalle[s.key].length}</strong>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="dg-section-card">
        <div className="dg-section-header"><BarChart3 size={14} /> Facturación de los últimos 6 meses</div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--dg-line-rgb),0.1)" />
              <XAxis dataKey="mes" stroke="var(--dg-text-faint)" fontSize={12} />
              <YAxis stroke="var(--dg-text-faint)" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => money(v)} contentStyle={{ background: "var(--dg-surface-2)", border: "1px solid rgba(var(--dg-line-rgb),0.15)", borderRadius: 8, color: "var(--dg-text)" }} />
              <Bar dataKey="ventas" name="Facturación" fill="var(--dg-accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dg-section-card">
        <div className="dg-section-header"><AlertTriangle size={14} /> Reclamos por mes (últimos 6 meses)</div>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--dg-line-rgb),0.1)" />
              <XAxis dataKey="mes" stroke="var(--dg-text-faint)" fontSize={12} />
              <YAxis stroke="var(--dg-text-faint)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--dg-surface-2)", border: "1px solid rgba(var(--dg-line-rgb),0.15)", borderRadius: 8, color: "var(--dg-text)" }} />
              <Bar dataKey="reclamos" name="Reclamos" fill="var(--dg-danger)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {verDetalleMargen && (
        <div className="dg-overlay" onClick={() => setVerDetalleMargen(false)}>
          <div className="dg-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="dg-modal-head">
              <div className="dg-modal-title">Detalle del margen — {labelMes(mesActual)}</div>
              <button className="dg-icon-btn" onClick={() => setVerDetalleMargen(false)}><X size={18} /></button>
            </div>
            <p className="dg-hint" style={{ marginBottom: 12 }}>
              Un pedido en rojo es uno donde el costo estimado quedó por encima de lo que se cobró — puede ser porque se vendió con descuento, porque el "Monto" quedó mal cargado, o porque el tipo de espejo se está estimando distinto a como es en realidad.
            </p>
            <div className="dg-task-list" style={{ marginBottom: 0, maxHeight: "50vh", overflowY: "auto" }}>
              {entregadosMesParaMargen
                .map((p) => ({ p, costo: estimarCostoPedido(p, quoteConfig), venta: Number(p.monto) || 0 }))
                .sort((a, b) => (a.venta - a.costo) - (b.venta - b.costo))
                .map(({ p, costo, venta }) => {
                  const margenItem = venta - costo;
                  return (
                    <div className="dg-task dg-pago-row" key={p.id}>
                      <div className="dg-pago-info">
                        <span>#{p.orden} · {p.cliente || "Sin nombre"}</span>
                        <span className="dg-pago-meta">{p.ancho}×{p.alto} cm · {p.forma} · venta {money(venta)} − costo est. {money(costo)}</span>
                      </div>
                      <span className="dg-pago-monto" style={{ color: margenItem >= 0 ? "var(--dg-success)" : "var(--dg-danger)" }}>{money(margenItem)}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AjustesModal({ onClose, admins, onChangeAdmins, session, sectors, vendedores, onChangeVendedores, datos, auditoria, integraciones, onChangeIntegraciones }) {
  const [tab, setTab] = useState("usuarios");

  const tabs = [
    { id: "usuarios", label: "Usuarios y accesos", icon: ShieldCheck },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "respaldo", label: "Respaldo y datos", icon: Save },
    { id: "actividad", label: "Actividad", icon: ClipboardList },
  ];

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal dg-modal-ajustes" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head">
          <div className="dg-sector-page-title">
            <div className="dg-modal-icon" style={{ "--glow": "var(--dg-accent)" }}><Settings2 size={19} /></div>
            <div>
              <div className="dg-modal-title">Ajustes del sistema</div>
              <div className="dg-modal-sub">Solo administradores · sesión de {session?.nombre || "Admin"}</div>
            </div>
          </div>
          <button className="dg-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="dg-sector-tabs">
          {tabs.map((t) => {
            const Ic = t.icon;
            return (
              <button key={t.id} className={`dg-sector-tab ${tab === t.id ? "dg-sector-tab-on" : ""}`} onClick={() => setTab(t.id)}>
                <Ic size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />{t.label}
              </button>
            );
          })}
        </div>

        {tab === "usuarios" && (
          <>
            <UsuariosPanel usuarios={admins} onChange={onChangeAdmins} session={session} sectors={sectors} />
            <div className="dg-section-card">
              <div className="dg-section-header"><Users size={14} /> Vendedores del CRM</div>
              <div className="dg-vendedores-chips">
                {vendedores.map((v) => (
                  <span key={v} className="dg-vendedor-chip">{v}<button onClick={() => onChangeVendedores(vendedores.filter((x) => x !== v))}><X size={11} /></button></span>
                ))}
              </div>
            </div>
            <div className="dg-section-card">
              <div className="dg-section-header"><ExternalLink size={14} /> Integraciones</div>
              <p className="dg-pago-meta" style={{ marginBottom: 10 }}>
                Se usa en la tarjeta de "Verificar pedido" para abrir el contacto directo en Kommo. Es el nombre que aparece antes de ".kommo.com" en tu cuenta.
              </p>
              <Field label="Subdominio de Kommo">
                <input value={integraciones?.kommoSubdominio || ""} onChange={(e) => onChangeIntegraciones({ ...integraciones, kommoSubdominio: e.target.value })} placeholder="Ej: midecoglass" />
              </Field>
            </div>
          </>
        )}

        {tab === "notificaciones" && (
          <div className="dg-page">
            <p className="dg-hint" style={{ marginBottom: 14 }}>
              Un resumen se arma solo una vez por día. A cada persona le llega solo lo de su sector: Fábrica ve demorados,
              Ventas ve sin confirmar y vencidos, Administración ve ambas cosas, y los administradores ven todo, incluidos
              reclamos y comisiones.
            </p>
            <HistorialNotificacionesPanel />
          </div>
        )}

        {tab === "respaldo" && <RespaldoPanel datos={datos} auditoria={[]} />}

        {tab === "actividad" && (
          <div className="dg-page">
            <p className="dg-hint" style={{ marginBottom: 14 }}>Últimos movimientos del sistema: quién cargó, editó o borró cada cosa.</p>
            {auditoria.length === 0 ? <div className="dg-empty">Todavía no hay movimientos registrados.</div> : (
              <div className="dg-task-list">
                {auditoria.slice(0, 100).map((a) => (
                  <div className="dg-task" key={a.id}>
                    <div className="dg-pago-info">
                      <span>{a.accion}{a.detalle ? ` — ${a.detalle}` : ""}</span>
                      <span className="dg-pago-meta">{a.quien} · {new Date(a.fecha).toLocaleString("es-AR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RespaldoPanel({ datos, auditoria }) {
  const [aviso, setAviso] = useState("");

  function bajarArchivo(contenido, nombre, tipo) {
    try {
      const blob = new Blob([contenido], { type: tipo });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = nombre;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setAviso(`Descargado: ${nombre}`);
      setTimeout(() => setAviso(""), 4000);
    } catch (e) { setAviso("No se pudo descargar el archivo."); }
  }

  const hoy = new Date().toISOString().slice(0, 10);

  function respaldoCompleto() {
    bajarArchivo(JSON.stringify(datos, null, 2), `decoglass-respaldo-${hoy}.json`, "application/json");
  }

  function aCSV(filas) {
    if (!filas.length) return "";
    const cols = [...new Set(filas.flatMap((f) => Object.keys(f)))];
    const esc = (v) => {
      if (v === null || v === undefined) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [cols.join(";"), ...filas.map((f) => cols.map((c) => esc(f[c])).join(";"))].join("\n");
  }

  const tablas = [
    { key: "pedidos", label: "Pedidos", filas: datos.pedidos || [] },
    { key: "incomes", label: "Ingresos", filas: datos.incomes || [] },
    { key: "purchases", label: "Compras", filas: datos.purchases || [] },
    { key: "leads", label: "CRM (contactos)", filas: datos.leads || [] },
    { key: "reclamos", label: "Reclamos", filas: datos.reclamos || [] },
    { key: "facturas", label: "Facturas pendientes", filas: datos.facturas || [] },
    { key: "stockEspejos", label: "Stock de espejos", filas: datos.stockEspejos || [] },
    { key: "stockMateriales", label: "Stock de materiales", filas: datos.stockMateriales || [] },
    { key: "liquidaciones", label: "Sueldos", filas: datos.liquidaciones || [] },
  ];

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>
        Bajate un respaldo cada tanto (una vez por semana está bien). Si alguien borra algo por error, con el archivo se puede recuperar.
      </p>
      {aviso && <div className="dg-comision-banner" style={{ background: "rgba(var(--dg-success-rgb),0.1)", borderColor: "rgba(var(--dg-success-rgb),0.35)", color: "var(--dg-success)" }}><Check size={15} /> {aviso}</div>}

      <div className="dg-section-card">
        <div className="dg-section-header"><Save size={14} /> Respaldo completo</div>
        <p className="dg-pago-meta" style={{ marginBottom: 12 }}>Un solo archivo con absolutamente todo. Es el que sirve para restaurar.</p>
        <button className="dg-btn-primary" onClick={respaldoCompleto}><Download size={15} /> Descargar respaldo completo (.json)</button>
      </div>

      <div className="dg-section-card">
        <div className="dg-section-header"><FileText size={14} /> Exportar a Excel</div>
        <p className="dg-pago-meta" style={{ marginBottom: 12 }}>Cada tabla por separado. Se abren directo en Excel haciendo doble clic.</p>
        <div className="dg-export-grid">
          {tablas.map((t) => (
            <button key={t.key} className="dg-btn-ghost" disabled={!t.filas.length}
              onClick={() => bajarArchivo("\uFEFF" + aCSV(t.filas), `decoglass-${t.key}-${hoy}.csv`, "text/csv;charset=utf-8")}>
              <Download size={13} /> {t.label} ({t.filas.length})
            </button>
          ))}
        </div>
      </div>

      <div className="dg-section-card">
        <div className="dg-section-header"><ClipboardList size={14} /> Últimos movimientos</div>
        {auditoria.length === 0 ? (
          <div className="dg-empty">Todavía no hay movimientos registrados.</div>
        ) : (
          <>
            <div className="dg-task-list" style={{ marginBottom: 10 }}>
              {auditoria.slice(0, 40).map((a) => (
                <div className="dg-task" key={a.id}>
                  <div className="dg-pago-info">
                    <span>{a.accion}{a.detalle ? ` — ${a.detalle}` : ""}</span>
                    <span className="dg-pago-meta">{a.quien} · {new Date(a.fecha).toLocaleString("es-AR")}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="dg-btn-ghost" onClick={() => bajarArchivo("\uFEFF" + aCSV(auditoria), `decoglass-actividad-${hoy}.csv`, "text/csv;charset=utf-8")}>
              <Download size={13} /> Descargar historial completo ({auditoria.length})
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const ROLES_USUARIO = [
  { id: "admin", label: "Administrador" },
  { id: "encargado", label: "Encargado" },
  { id: "operario", label: "Operario" },
];

function UsuariosPanel({ usuarios, onChange, session, sectors }) {
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [rol, setRol] = useState("encargado");
  const [sectorId, setSectorId] = useState(sectors[0]?.id || "");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  function agregar() {
    setError("");
    if (!nombre.trim()) return setError("Poné el nombre de usuario.");
    if (usuarios.some((u) => u.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())) return setError("Ya existe un usuario con ese nombre.");
    if (clave.length < 4) return setError("La clave debe tener al menos 4 caracteres.");
    if (clave !== clave2) return setError("Las claves no coinciden.");
    const nuevo = { id: uid(), nombre: nombre.trim(), clave, rol, sectorId: rol === "admin" ? null : sectorId, aprobado: true };
    onChange([...usuarios, nuevo]);
    setNombre(""); setClave(""); setClave2("");
    setAviso("Usuario agregado."); setTimeout(() => setAviso(""), 4000);
  }
  function quitar(id) {
    setError("");
    const u = usuarios.find((x) => x.id === id);
    if (!u) return;
    if (u.rol === "admin" && usuarios.filter((x) => x.rol === "admin").length <= 1) { setError("Tiene que quedar al menos un administrador."); return; }
    if (u.nombre === session?.nombre) { setError("No podés eliminar tu propio usuario."); return; }
    onChange(usuarios.filter((x) => x.id !== id));
  }
  function aprobar(id) { onChange(usuarios.map((x) => (x.id === id ? { ...x, aprobado: true } : x))); }
  function rechazar(id) { onChange(usuarios.filter((x) => x.id !== id)); }

  // --- Solicitudes de acceso (auto-registro -> tabla profiles) ---
  const [solicitudes, setSolicitudes] = useState([]);
  const [msgSol, setMsgSol] = useState("");
  async function cargarSolicitudes() {
    try {
      const { data } = await supabase.from("profiles").select("id, nombre, rol, sector_id").eq("aprobado", false);
      setSolicitudes(data || []);
    } catch (e) { setSolicitudes([]); }
  }
  useEffect(() => { cargarSolicitudes(); }, []);
  async function aprobarSolicitud(id) {
    setMsgSol("");
    try {
      const { error: e } = await supabase.from("profiles").update({ aprobado: true }).eq("id", id);
      if (e) throw e;
      setMsgSol("Cuenta aprobada. La persona ya puede entrar.");
      cargarSolicitudes();
    } catch (e) { setMsgSol("No se pudo aprobar. Probá de nuevo."); }
  }
  async function rechazarSolicitud(id) {
    setMsgSol("");
    try {
      const { data: ses } = await supabase.auth.getSession();
      const resp = await fetch("/api/rechazar-cuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ses?.session?.access_token || ""}` },
        body: JSON.stringify({ id }),
      });
      const d = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(d.error || "Error");
      setMsgSol("Solicitud rechazada.");
      cargarSolicitudes();
    } catch (e) { setMsgSol(e.message || "No se pudo rechazar."); }
  }

  const pendientes = usuarios.filter((u) => u.aprobado === false);
  const aprobados = usuarios.filter((u) => u.aprobado !== false);

  const sectorNombre = (id) => sectors.find((s) => s.id === id)?.name || "—";
  const rolLabel = (r) => ROLES_USUARIO.find((x) => x.id === r)?.label || r;
  const rolColor = (r) => (r === "admin" ? "var(--dg-accent)" : r === "encargado" ? "var(--dg-warning)" : "var(--dg-text-dim)");

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>
        Un solo formulario de acceso para todos: usuario y clave. El sistema reconoce solo si es <strong>administrador</strong> (ve finanzas, comisiones, sueldos y ajustes) o <strong>encargado/operario</strong> de un sector.
      </p>

      {solicitudes.length > 0 && (
        <div className="dg-section-card" style={{ borderColor: "rgba(var(--dg-warning-rgb),0.35)" }}>
          <div className="dg-section-header" style={{ color: "var(--dg-warning)" }}><AlertTriangle size={14} /> Solicitudes de acceso ({solicitudes.length})</div>
          <div className="dg-task-list" style={{ marginBottom: 0 }}>
            {solicitudes.map((sol) => (
              <div className="dg-task" key={sol.id}>
                <UserPlus size={14} style={{ color: "var(--dg-warning)" }} />
                <div className="dg-pago-info">
                  <span>{sol.nombre}</span>
                  <span className="dg-pago-meta">Pidió entrar como {rolLabel(sol.rol)}{sol.sector_id ? ` de ${sectorNombre(sol.sector_id)}` : ""}</span>
                </div>
                <button className="dg-btn-ghost dg-mini-btn" onClick={() => rechazarSolicitud(sol.id)}><XCircle size={13} /> Rechazar</button>
                <button className="dg-btn-primary dg-mini-btn" onClick={() => aprobarSolicitud(sol.id)}><Check size={13} /> Aprobar</button>
              </div>
            ))}
          </div>
          {msgSol && <div style={{ marginTop: 8, fontSize: 12, color: "var(--dg-text-dim)" }}>{msgSol}</div>}
        </div>
      )}

      {pendientes.length > 0 && (
        <div className="dg-section-card" style={{ borderColor: "rgba(var(--dg-warning-rgb),0.35)" }}>
          <div className="dg-section-header" style={{ color: "var(--dg-warning)" }}><AlertTriangle size={14} /> Solicitudes pendientes ({pendientes.length})</div>
          <div className="dg-task-list" style={{ marginBottom: 0 }}>
            {pendientes.map((u) => (
              <div className="dg-task" key={u.id}>
                <AlertTriangle size={14} style={{ color: "var(--dg-warning)" }} />
                <div className="dg-pago-info">
                  <span>{u.nombre}</span>
                  <span className="dg-pago-meta">
                    Pidió ser {rolLabel(u.rol)}{u.sectorId ? ` de ${sectorNombre(u.sectorId)}` : ""}
                  </span>
                </div>
                <button className="dg-btn-ghost dg-mini-btn" onClick={() => rechazar(u.id)}><XCircle size={13} /> Rechazar</button>
                <button className="dg-btn-primary dg-mini-btn" onClick={() => aprobar(u.id)}><Check size={13} /> Aprobar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dg-section-card">
        <div className="dg-section-header"><Users size={14} /> Usuarios ({aprobados.length})</div>
        <div className="dg-task-list" style={{ marginBottom: 0 }}>
          {aprobados.map((u) => (
            <div className="dg-task" key={u.id}>
              <ShieldCheck size={14} style={{ color: rolColor(u.rol) }} />
              <div className="dg-pago-info">
                <span>{u.nombre}{u.nombre === session?.nombre ? " (vos)" : ""}</span>
                <span className="dg-pago-meta">
                  {rolLabel(u.rol)}{u.sectorId ? ` · ${sectorNombre(u.sectorId)}` : ""}
                </span>
              </div>
              <button className="dg-icon-btn dg-task-del" onClick={() => quitar(u.id)}><Trash2 size={14} /></button>
            </div>
          ))}
          {aprobados.length === 0 && <div className="dg-empty">Todavía no hay usuarios cargados.</div>}
        </div>
      </div>

      <div className="dg-section-card">
        <div className="dg-section-header"><UserPlus size={14} /> Agregar usuario</div>
        <EnterFlow onSubmit={agregar} autoFocus={false}>
          <div className="dg-field-grid">
            <Field label="Nombre de usuario"><input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Sergio" /></Field>
            <Field label="Clave"><input type="password" value={clave} onChange={(e) => setClave(e.target.value)} /></Field>
            <Field label="Repetir clave"><input type="password" value={clave2} onChange={(e) => setClave2(e.target.value)} /></Field>
            <Field label="Rol">
              <select value={rol} onChange={(e) => setRol(e.target.value)}>
                {ROLES_USUARIO.map((r) => (<option key={r.id} value={r.id}>{r.label}</option>))}
              </select>
            </Field>
            {rol !== "admin" && (
              <Field label="Sector">
                <select value={sectorId} onChange={(e) => setSectorId(e.target.value)}>
                  {sectors.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </Field>
            )}
          </div>
        </EnterFlow>
        {error && <div className="dg-error" style={{ marginTop: 8 }}>{error}</div>}
        {aviso && <div style={{ marginTop: 8, fontSize: 12, color: "var(--dg-success)" }}>{aviso}</div>}
        <div className="dg-form-actions"><button className="dg-btn-primary" onClick={agregar}><Plus size={16} /> Agregar</button></div>
      </div>
    </div>
  );
}

function ComisionesPanel({ pedidos, onChangePedidos, empleados, onCreatePurchase }) {
  const [vendedorAbierto, setVendedorAbierto] = useState(null);
  const [verPagadas, setVerPagadas] = useState(false);
  const [aviso, setAviso] = useState(null);

  const elegibles = pedidos.filter(comisionElegible);
  const pendientes = elegibles.filter((p) => !p.comisionPagada);
  const pagadas = elegibles.filter((p) => p.comisionPagada);
  const lista = verPagadas ? pagadas : pendientes;

  // agrupar por vendedor
  const porVendedor = {};
  for (const p of lista) {
    const v = String(p.vendedor).trim();
    if (!porVendedor[v]) porVendedor[v] = [];
    porVendedor[v].push(p);
  }
  const grupos = Object.entries(porVendedor)
    .map(([vendedor, items]) => ({
      vendedor, items,
      pct: porcentajeVendedor(vendedor, empleados),
      totalVendido: items.reduce((a, p) => a + comisionBase(p), 0),
      totalComision: items.reduce((a, p) => a + (verPagadas ? Number(p.comisionLiquidadaMonto) || 0 : comisionMonto(p, empleados)), 0),
    }))
    .sort((a, b) => b.totalComision - a.totalComision);

  const totalGeneral = grupos.reduce((a, g) => a + g.totalComision, 0);
  const sinPorcentaje = grupos.filter((g) => g.pct === 0);

  function liquidar(grupo) {
    const monto = grupo.totalComision;
    if (monto <= 0) return;
    const ids = grupo.items.map((p) => p.id);
    const montos = {};
    const empleado = (empleados || []).find((emp) => vendedorCoincideConEmpleado(grupo.vendedor, emp));
    grupo.items.forEach((p) => { montos[p.id] = comisionMonto(p, empleados); });
    onChangePedidos(pedidos.map((p) => (ids.includes(p.id)
      ? { ...p, comisionPagada: true, comisionLiquidadaMonto: montos[p.id], comisionFechaPago: new Date().toISOString().slice(0, 10), comisionEmpleadoId: empleado?.id || null }
      : p)));
    if (onCreatePurchase) {
      onCreatePurchase({
        id: uid(), concepto: `Comisiones ${grupo.vendedor} — ${grupo.items.length} pedido(s)`,
        monto, tipo: "sueldos", proveedor: grupo.vendedor, sectorId: "ventas",
        fecha: new Date().toISOString().slice(0, 10), estado: "pagado",
      });
    }
    setAviso(`Liquidaste ${money(monto)} a ${grupo.vendedor}. Se registró como gasto en Compras → Sueldos.`);
    setTimeout(() => setAviso(null), 5000);
  }

  function excluir(id) { onChangePedidos(pedidos.map((p) => (p.id === id ? { ...p, comisionExcluida: true } : p))); }
  function revertir(id) { onChangePedidos(pedidos.map((p) => (p.id === id ? { ...p, comisionPagada: false, comisionLiquidadaMonto: 0 } : p))); }

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>
        Un pedido entra acá automáticamente cuando queda <strong>totalmente cobrado</strong> (saldo $0) y tiene vendedor asignado.
        La comisión se calcula sobre el monto <strong>sin contar el envío</strong>, con el % de cada vendedor cargado en Sueldos.
      </p>

      {aviso && <div className="dg-comision-banner" style={{ background: "rgba(var(--dg-success-rgb),0.1)", borderColor: "rgba(var(--dg-success-rgb),0.35)", color: "var(--dg-success)" }}><Check size={15} /> {aviso}</div>}

      {sinPorcentaje.length > 0 && !verPagadas && (
        <div className="dg-comision-banner">
          <AlertTriangle size={15} />
          <span>
            {sinPorcentaje.map((g) => g.vendedor).join(", ")} no tiene% de comisión cargado en <strong>Sueldos → Empleados</strong>, así que su comisión da $0.
          </span>
        </div>
      )}

      <div className="dg-quickviews" style={{ marginBottom: 14 }}>
        <button className={`dg-quickview-btn ${!verPagadas ? "dg-quickview-on" : ""}`} onClick={() => setVerPagadas(false)}>A liquidar ({pendientes.length})</button>
        <button className={`dg-quickview-btn ${verPagadas ? "dg-quickview-on" : ""}`} onClick={() => setVerPagadas(true)}>Ya pagadas ({pagadas.length})</button>
      </div>

      <div className="dg-totales">
        <div className="dg-total-card" style={{ "--c": verPagadas ? "var(--dg-success)" : "var(--dg-warning)" }}>
          <span>{verPagadas ? "Total pagado en comisiones" : "Total a pagar en comisiones"}</span>
          <strong>{money(totalGeneral)}</strong>
        </div>
        <div className="dg-total-card" style={{ "--c": "var(--dg-accent)" }}><span>Pedidos involucrados</span><strong>{lista.length}</strong></div>
      </div>

      {grupos.length === 0 && (
        <div className="dg-empty">{verPagadas ? "Todavía no liquidaste ninguna comisión." : "No hay comisiones pendientes. Un pedido aparece acá cuando su saldo llega a $0."}</div>
      )}

      {grupos.map((g) => (
        <div className="dg-section-card" key={g.vendedor}>
          <div className="dg-comision-head">
            <button className="dg-comision-toggle" onClick={() => setVendedorAbierto(vendedorAbierto === g.vendedor ? null : g.vendedor)}>
              <ChevronRight size={15} className={vendedorAbierto === g.vendedor ? "dg-chev-open" : ""} />
              <span className="dg-comision-nombre">{g.vendedor}</span>
              <span className="dg-badge" style={{ "--bc": g.pct > 0 ? "var(--dg-accent)" : "var(--dg-danger)" }}>{g.pct}%</span>
              <span className="dg-pago-meta">{g.items.length} pedido(s) · {money(g.totalVendido)} vendido</span>
            </button>
            <div className="dg-comision-total">
              <strong>{money(g.totalComision)}</strong>
              {!verPagadas && g.totalComision > 0 && (
                <button className="dg-btn-primary" onClick={() => liquidar(g)}><CircleDollarSign size={14} /> Liquidar</button>
              )}
            </div>
          </div>

          {vendedorAbierto === g.vendedor && (
            <div className="dg-task-list" style={{ marginTop: 12, marginBottom: 0 }}>
              {g.items.map((p) => (
                <div className="dg-task" key={p.id}>
                  <span className="dg-pedido-orden">#{p.orden}</span>
                  <div className="dg-pago-info">
                    <span>{p.cliente}</span>
                    <span className="dg-pago-meta">
                      {money(p.monto)}{Number(p.costoEnvio) > 0 ? ` − ${money(p.costoEnvio)} envío` : ""} = {money(comisionBase(p))} base · {p.fecha}
                    </span>
                  </div>
                  <span className="dg-pago-monto" style={{ color: "var(--dg-warning)" }}>
                    {money(verPagadas ? p.comisionLiquidadaMonto : comisionMonto(p, empleados))}
                  </span>
                  {verPagadas
                    ? <button className="dg-icon-btn" title="Marcar como no pagada" onClick={() => revertir(p.id)}><RotateCcw size={14} /></button>
                    : <button className="dg-icon-btn dg-task-del" title="Este pedido no lleva comisión" onClick={() => excluir(p.id)}><XCircle size={14} /></button>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const SUELDOS_SECTORES = ["Oficina/Ventas", "Taller"];

function emptyEmpleadoSueldo() {
  return { id: uid(), nombre: "", sector: "Oficina/Ventas", valorHora: 0, comisionPct: 0, sueldoBase: 0, complementoFijo: 0, valorHoraExtra: 0 };
}

const SEMANAS = [1, 2, 3, 4, 5];
const MESES_NOM = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function periodoActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function periodoLabel(per) {
  const [y, m] = per.split("-");
  return `${MESES_NOM[parseInt(m, 10) - 1]} ${y}`;
}
function periodosCercanos() {
  const out = [];
  const d = new Date();
  for (let i = 3; i >= -1; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`);
  }
  return out.reverse();
}
function celdaVacia() { return { horas: "", ventas: "", he: "", adelanto: "", ajusteComision: "" }; }
function filaVacia(empleadoId, periodo) {
  const semanas = {};
  SEMANAS.forEach((n) => { semanas[n] = celdaVacia(); });
  return { id: uid(), empleadoId, periodo, semanas, ajusteComision: "", nota: "" };
}
const nnum = (v) => Number(v) || 0;

function totalesFila(emp, fila, comisionAutomatica = 0) {
  const sem = fila?.semanas || {};
  const horas = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.horas), 0);
  const ventas = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.ventas), 0);
  const he = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.he), 0);
  const adelantos = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.adelanto), 0);
  const ajusteComisionSemanal = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.ajusteComision), 0);
  const pagoHoras = horas * nnum(emp?.valorHora);
  const comisionManualAnterior = ventas * (nnum(emp?.comisionPct) / 100);
  const tieneAjusteExplicito = fila && Object.prototype.hasOwnProperty.call(fila, "ajusteComision");
  const ajusteComisionGeneral = tieneAjusteExplicito
    ? nnum(fila.ajusteComision)
    : (nnum(comisionAutomatica) > 0 ? 0 : comisionManualAnterior);
  const ajusteComision = ajusteComisionGeneral + ajusteComisionSemanal;
  const pagoComision = nnum(comisionAutomatica);
  const pagoHE = he * nnum(emp?.valorHoraExtra);
  const complementoNeto = nnum(emp?.complementoFijo) - adelantos;
  const total = emp?.sector === "Taller"
    ? nnum(emp?.sueldoBase) + complementoNeto + pagoHE
    : pagoHoras + pagoComision + ajusteComision;
  return { horas, ventas, he, adelantos, pagoHoras, pagoComision, ajusteComision, ajusteComisionGeneral, ajusteComisionSemanal, pagoHE, complementoNeto, total };
}

function totalSemanaOficina(emp, fila, numero, resumenComision) {
  const horas = nnum(fila?.semanas?.[numero]?.horas);
  const pagoHoras = horas * nnum(emp?.valorHora);
  const comisionAutomatica = nnum(resumenComision?.semanas?.[numero]?.total);
  const ajusteComision = nnum(fila?.semanas?.[numero]?.ajusteComision);
  const pagoComision = comisionAutomatica + ajusteComision;
  return { horas, pagoHoras, comisionAutomatica, ajusteComision, pagoComision, total: pagoHoras + pagoComision };
}

function rangoSemanaLabel(periodo, numero) {
  const [year, month] = String(periodo).split("-").map(Number);
  const ultimoDia = new Date(year, month, 0).getDate();
  const desde = ((numero - 1) * 7) + 1;
  const hasta = Math.min(numero * 7, ultimoDia);
  return `${desde}–${hasta}`;
}

function CargarSemanasModal({ empleado, periodo, fila, resumenComision, onGuardar, onClose }) {
  const esOficina = empleado.sector === "Oficina/Ventas";
  const [semanas, setSemanas] = useState(() => {
    const base = {};
    SEMANAS.forEach((n) => { base[n] = { ...celdaVacia(), ...(fila?.semanas?.[n] || {}) }; });
    return base;
  });
  const [ajusteComision, setAjusteComision] = useState(fila?.ajusteComision ?? "");
  const [nota, setNota] = useState(fila?.nota ?? "");

  function setCampo(n, campo, valor) {
    setSemanas((prev) => ({ ...prev, [n]: { ...prev[n], [campo]: valor } }));
  }
  function guardar() {
    onGuardar({ semanas, ajusteComision, nota });
    onClose();
  }

  const filaPreview = { ...(fila || {}), semanas, ajusteComision };
  const preview = totalesFila(empleado, filaPreview, resumenComision?.total || 0);

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal dg-modal-semanas" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head">
          <div>
            <div className="dg-modal-title">{esOficina ? "Horas y comisiones" : "Horas extra y adelantos"} — {empleado.nombre}</div>
            <div className="dg-modal-sub">{periodoLabel(periodo)}</div>
          </div>
          <button type="button" className="dg-icon-btn" aria-label="Cerrar carga de sueldo" onClick={onClose}><X size={18} /></button>
        </div>

        <EnterFlow onSubmit={guardar} autoFocus={false}>
          <div className="dg-sueldo-semanas-form">
            {SEMANAS.map((n) => (
              <div className="dg-sueldo-semana-bloque" key={n}>
                <div className="dg-sueldo-semana-num"><span>Semana {n}</span><small>Días {rangoSemanaLabel(periodo, n)}</small></div>
                {esOficina ? (
                  <>
                    <div className="dg-field-grid">
                      <Field label="Horas trabajadas">
                        <input type="number" inputMode="decimal" value={semanas[n].horas} onChange={(e) => setCampo(n, "horas", e.target.value)} placeholder="0" />
                      </Field>
                      <Field label="Ajuste de comisión ($)">
                        <input type="number" inputMode="decimal" value={semanas[n].ajusteComision || ""} onChange={(e) => setCampo(n, "ajusteComision", e.target.value)} placeholder="0" />
                      </Field>
                    </div>
                    <div className="dg-sueldo-semana-preview">
                      <span>Sueldo {money(nnum(semanas[n].horas) * nnum(empleado.valorHora))}</span>
                      <span>Comisión {money(nnum(resumenComision?.semanas?.[n]?.total) + nnum(semanas[n].ajusteComision))}</span>
                      <strong>Total {money(totalSemanaOficina(empleado, filaPreview, n, resumenComision).total)}</strong>
                    </div>
                  </>
                ) : (
                  <div className="dg-field-grid">
                    <Field label="Horas extra">
                      <input type="number" inputMode="decimal" value={semanas[n].he} onChange={(e) => setCampo(n, "he", e.target.value)} placeholder="0" />
                    </Field>
                    <Field label="Adelanto ($)">
                      <input type="number" inputMode="decimal" value={semanas[n].adelanto} onChange={(e) => setCampo(n, "adelanto", e.target.value)} placeholder="0" />
                    </Field>
                  </div>
                )}
              </div>
            ))}

            {esOficina && (
              <div className="dg-sueldo-semana-bloque">
                <Field label="Ajuste general del mes (opcional)">
                  <input type="number" inputMode="decimal" value={ajusteComision} onChange={(e) => setAjusteComision(e.target.value)} placeholder="Solo si no corresponde a una semana" />
                </Field>
              </div>
            )}

            <div className="dg-sueldo-semana-bloque">
              <Field label="Anotador (opcional)">
                <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej: le debo 2,5 hs de la semana 3..." />
              </Field>
            </div>

            <div className={`dg-sueldo-modal-summary ${esOficina ? "dg-sueldo-modal-summary-oficina" : "dg-sueldo-modal-summary-taller"}`}>
              {esOficina ? (
                <>
                  <span><small>Horas</small><strong>{preview.horas} hs · {money(preview.pagoHoras)}</strong></span>
                  <span><small>Comisiones</small><strong>{money(preview.pagoComision + preview.ajusteComision)}</strong></span>
                  <span className="dg-sueldo-modal-total"><small>Total del mes</small><strong>{money(preview.total)}</strong></span>
                </>
              ) : (
                <>
                  <span><small>Sueldo por transferencia</small><strong>{money(empleado.sueldoBase)}</strong></span>
                  <span><small>Complemento fijo</small><strong>{money(empleado.complementoFijo)}</strong></span>
                  <span><small>Adelantos descontados</small><strong className="dg-td-neg">−{money(preview.adelantos)}</strong></span>
                  <span><small>Complemento a pagar</small><strong>{money(preview.complementoNeto)}</strong></span>
                  <span className="dg-sueldo-modal-total"><small>Total del mes + HE</small><strong>{money(preview.total)}</strong></span>
                </>
              )}
            </div>
          </div>
        </EnterFlow>

        <div className="dg-form-actions" style={{ marginTop: 14 }}>
          <button type="button" className="dg-btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="dg-btn-primary" onClick={guardar}><Save size={14} /> Guardar mes</button>
        </div>
      </div>
    </div>
  );
}

function SueldosPanel({ empleados, onChangeEmpleados, liquidaciones, onChangeLiquidaciones, pedidos }) {
  const [periodo, setPeriodo] = useState(periodoActual());
  const [verEmpleados, setVerEmpleados] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [cargandoSemanas, setCargandoSemanas] = useState(null);

  const oficina = empleados.filter((e) => e.sector === "Oficina/Ventas");
  const taller = empleados.filter((e) => e.sector === "Taller");

  function filaDe(empId) {
    return liquidaciones.find((l) => l.empleadoId === empId && l.periodo === periodo && l.semanas) || null;
  }
  function setCampoFila(empId, campo, valor) {
    const existe = filaDe(empId);
    if (existe) onChangeLiquidaciones(liquidaciones.map((l) => (l.id === existe.id ? { ...l, [campo]: valor } : l)));
    else onChangeLiquidaciones([{ ...filaVacia(empId, periodo), [campo]: valor }, ...liquidaciones]);
  }
  function guardarSemanasDe(empId, datos) {
    const existe = filaDe(empId);
    if (existe) onChangeLiquidaciones(liquidaciones.map((l) => (l.id === existe.id ? { ...l, ...datos } : l)));
    else onChangeLiquidaciones([{ ...filaVacia(empId, periodo), ...datos }, ...liquidaciones]);
  }
  function saveEmpleado(emp) {
    const exists = empleados.some((e) => e.id === emp.id);
    onChangeEmpleados(exists ? empleados.map((e) => (e.id === emp.id ? emp : e)) : [...empleados, emp]);
    setEditingEmp(null);
    setVerEmpleados(false);
  }
  function removeEmpleado(id, nombre) {
    if (!window.confirm(`¿Borrar a ${nombre} de la planilla de sueldos?\n\nSus liquidaciones ya guardadas no se borran, pero dejará de aparecer en la grilla.`)) return;
    onChangeEmpleados(empleados.filter((e) => e.id !== id));
    if (editingEmp?.id === id) setEditingEmp(null);
  }
  function editarEmpleado(emp) {
    setEditingEmp(emp);
    setVerEmpleados(true);
  }
  function cerrarEditorEmpleados() {
    setEditingEmp(null);
    setVerEmpleados(false);
  }

  const comisionesPorEmpleado = Object.fromEntries(oficina.map((emp) => [emp.id, resumenComisionesLiquidadas(pedidos, emp, periodo)]));
  const totalEmpleado = (emp) => totalesFila(emp, filaDe(emp.id), comisionesPorEmpleado[emp.id]?.total || 0);
  const oficinaPorSemana = Object.fromEntries(SEMANAS.map((numero) => {
    const total = oficina.reduce((acum, emp) => {
      const semana = totalSemanaOficina(emp, filaDe(emp.id), numero, comisionesPorEmpleado[emp.id]);
      acum.horas += semana.horas;
      acum.pagoHoras += semana.pagoHoras;
      acum.pagoComision += semana.pagoComision;
      acum.total += semana.total;
      return acum;
    }, { horas: 0, pagoHoras: 0, pagoComision: 0, total: 0 });
    return [numero, total];
  }));
  const totOficina = oficina.reduce((a, e) => a + totalEmpleado(e).total, 0);
  const totTaller = taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).total, 0);
  const totHorasOficina = oficina.reduce((a, e) => a + totalEmpleado(e).pagoHoras, 0);
  const totComisionesOficina = oficina.reduce((a, e) => a + totalEmpleado(e).pagoComision + totalEmpleado(e).ajusteComision, 0);
  const totSueldoTaller = taller.reduce((a, e) => a + nnum(e.sueldoBase), 0);
  const totComplementoTaller = taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).complementoNeto, 0);
  const totHETaller = taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).pagoHE, 0);
  const totAdelantosTaller = taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).adelantos, 0);

  return (
    <div className="dg-page">
      <div className="dg-sueldo-topbar">
        <div className="dg-periodo-sel">
          <span>Mes:</span>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            {periodosCercanos().map((p) => (<option key={p} value={p}>{periodoLabel(p)}</option>))}
          </select>
        </div>
        <button className="dg-btn-ghost" onClick={() => { setEditingEmp(null); setVerEmpleados(true); }}>
          <Settings2 size={14} /> Empleados y valores
        </button>
        <button className="dg-btn-ghost" onClick={() => window.print()}><Printer size={14} /> Imprimir</button>
      </div>

      <div className="dg-sueldo-resumen-head">
        <div><small>Resumen mensual</small><h2>{periodoLabel(periodo)}</h2></div>
        <div className="dg-sueldo-resumen-total"><small>Total general</small><strong>{money(totOficina + totTaller)}</strong></div>
      </div>

      <div className="dg-sueldo-resumen-grid">
        <article className="dg-sueldo-resumen-card dg-sueldo-resumen-oficina">
          <div className="dg-sueldo-resumen-card-title"><Users size={15} /> Oficina / Ventas</div>
          <div className="dg-sueldo-resumen-metricas">
            <span><small>Sueldo por horas</small><strong>{money(totHorasOficina)}</strong></span>
            <span><small>Comisiones</small><strong>{money(totComisionesOficina)}</strong></span>
            <span className="dg-sueldo-resumen-card-total"><small>Total oficina</small><strong>{money(totOficina)}</strong></span>
          </div>
        </article>
        <article className="dg-sueldo-resumen-card dg-sueldo-resumen-taller">
          <div className="dg-sueldo-resumen-card-title"><Wrench size={15} /> Taller</div>
          <div className="dg-sueldo-resumen-metricas">
            <span><small>Sueldo por transferencia</small><strong>{money(totSueldoTaller)}</strong></span>
            <span><small>Complemento neto</small><strong>{money(totComplementoTaller)}</strong></span>
            <span><small>Horas extra</small><strong>{money(totHETaller)}</strong></span>
            <span className="dg-sueldo-resumen-card-total"><small>Total taller</small><strong>{money(totTaller)}</strong></span>
          </div>
          {totAdelantosTaller > 0 && <div className="dg-sueldo-adelantos-aviso">Adelantos descontados del complemento: −{money(totAdelantosTaller)}</div>}
        </article>
      </div>

      {verEmpleados && (
        <div className="dg-overlay" onClick={cerrarEditorEmpleados}>
          <div className="dg-modal dg-modal-empleados" onClick={(e) => e.stopPropagation()}>
            <div className="dg-modal-head">
              <div>
                <div className="dg-modal-title">Empleados y valores salariales</div>
                <div className="dg-modal-sub">Todos los importes se pueden modificar cuando haya aumentos.</div>
              </div>
              <button type="button" className="dg-icon-btn" aria-label="Cerrar configuración de empleados" onClick={cerrarEditorEmpleados}><X size={18} /></button>
            </div>
            <div className="dg-empleados-modal-body">
              <div className="dg-sueldo-editor-form">
                <div className="dg-section-header"><UserPlus size={14} /> {editingEmp ? `Editar a ${editingEmp.nombre}` : "Agregar empleado"}</div>
                <EmpleadoForm key={editingEmp?.id || "nuevo"} empleado={editingEmp || emptyEmpleadoSueldo()} onSave={saveEmpleado} onCancel={editingEmp ? () => setEditingEmp(null) : null} />
              </div>
              <div className="dg-empleados-config-list">
                {empleados.map((e) => (
                  <div className="dg-empleado-config-row" key={e.id}>
                    <div className="dg-empleado-config-nombre">
                      <strong>{e.nombre}</strong>
                      <span>{e.sector}</span>
                    </div>
                    <div className="dg-empleado-config-valores">
                      {e.sector === "Oficina/Ventas"
                        ? `${money(e.valorHora)}/hora · ${e.comisionPct}% comisión`
                        : `${money(e.sueldoBase)} transferencia · ${money(e.complementoFijo)} complemento · HE ${money(e.valorHoraExtra)}`}
                    </div>
                    <div className="dg-empleado-config-actions">
                      <button type="button" className="dg-icon-btn" aria-label={`Editar valores de ${e.nombre}`} title="Editar sueldo y valores" onClick={() => setEditingEmp(e)}><Pencil size={14} /></button>
                      <button type="button" className="dg-icon-btn dg-task-del" aria-label={`Borrar a ${e.nombre}`} title="Borrar empleado" onClick={() => removeEmpleado(e.id, e.nombre)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dg-form-actions dg-modal-sticky-actions">
              <button type="button" className="dg-btn-ghost" onClick={cerrarEditorEmpleados}>Cerrar configuración</button>
            </div>
          </div>
        </div>
      )}

      {/* ---- OFICINA / VENTAS ---- */}
      <div className="dg-sueldo-block">
        <div className="dg-sueldo-section-heading">
          <div><small>Pago semanal</small><h3>Oficina / Ventas</h3></div>
          <div><small>Total del mes</small><strong>{money(totOficina)}</strong></div>
        </div>
        <p className="dg-hint dg-sueldo-auto-note"><CircleDollarSign size={13} /><span>Cada comisión se asigna a la semana de su fecha de liquidación. El mes queda separado entre <strong>sueldo por horas</strong> y <strong>comisiones</strong>.</span></p>
        {oficina.length > 0 && (
          <div className="dg-sueldo-week-team-grid">
            {SEMANAS.map((numero) => {
              const semana = oficinaPorSemana[numero];
              return (
                <div className="dg-sueldo-week-team-card" key={numero}>
                  <div><strong>Semana {numero}</strong><small>Días {rangoSemanaLabel(periodo, numero)}</small></div>
                  <span><small>Horas</small><strong>{semana.horas} hs</strong></span>
                  <span><small>Sueldo</small><strong>{money(semana.pagoHoras)}</strong></span>
                  <span><small>Comisión</small><strong>{money(semana.pagoComision)}</strong></span>
                  <span className="dg-sueldo-week-total"><small>Total</small><strong>{money(semana.total)}</strong></span>
                </div>
              );
            })}
          </div>
        )}
        {oficina.length === 0 ? <div className="dg-empty">No hay empleados de Oficina/Ventas cargados.</div> : (
          <div className="dg-payroll-list">
            {oficina.map((e) => {
              const fila = filaDe(e.id);
              const resumenComision = comisionesPorEmpleado[e.id] || { cantidad: 0, total: 0, semanas: {} };
              const t = totalEmpleado(e);
              return (
                <article className="dg-payroll-card" key={e.id}>
                  <div className="dg-payroll-employee-head">
                    <div className="dg-payroll-employee-name"><strong>{e.nombre}</strong><small>{money(e.valorHora)}/hora · {e.comisionPct}% comisión</small></div>
                    <div className="dg-payroll-month-metrics">
                      <span><small>Horas del mes</small><strong>{t.horas} hs</strong></span>
                      <span><small>Sueldo</small><strong>{money(t.pagoHoras)}</strong></span>
                      <span><small>Comisiones</small><strong>{money(t.pagoComision + t.ajusteComision)}</strong></span>
                      <span className="dg-payroll-month-total"><small>Total mensual</small><strong>{money(t.total)}</strong></span>
                    </div>
                    <div className="dg-payroll-actions">
                      <button type="button" className="dg-btn-primary dg-mini-btn" onClick={() => setCargandoSemanas(e)}><CalendarDays size={13} /> Cargar horas</button>
                      <button type="button" className="dg-icon-btn" aria-label={`Editar valores de ${e.nombre}`} title="Editar valores" onClick={() => editarEmpleado(e)}><Pencil size={14} /></button>
                    </div>
                  </div>
                  <div className="dg-payroll-week-table">
                    <div className="dg-payroll-week-row dg-payroll-week-header"><span>Semana</span><span>Horas</span><span>Sueldo</span><span>Comisión</span><span>Total semanal</span></div>
                    {SEMANAS.map((numero) => {
                      const semana = totalSemanaOficina(e, fila, numero, resumenComision);
                      return (
                        <div className="dg-payroll-week-row" key={numero}>
                          <span><strong>S{numero}</strong><small>{rangoSemanaLabel(periodo, numero)}</small></span>
                          <span><small className="dg-payroll-mobile-label">Horas</small>{semana.horas || "—"}{semana.horas ? " hs" : ""}</span>
                          <span><small className="dg-payroll-mobile-label">Sueldo</small>{money(semana.pagoHoras)}</span>
                          <span className={semana.pagoComision ? "dg-payroll-positive" : ""}><small className="dg-payroll-mobile-label">Comisión</small>{money(semana.pagoComision)}{resumenComision.semanas?.[numero]?.cantidad > 0 && <small>{resumenComision.semanas[numero].cantidad} pedido(s)</small>}</span>
                          <span className="dg-payroll-week-row-total"><small className="dg-payroll-mobile-label">Total semanal</small>{money(semana.total)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {t.ajusteComisionGeneral !== 0 && <div className="dg-payroll-adjustment">Ajuste general del mes: {money(t.ajusteComisionGeneral)}</div>}
                  {fila?.nota && <p className="dg-sueldo-nota-fija"><strong>Nota:</strong> {fila.nota}</p>}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- TALLER ---- */}
      <div className="dg-sueldo-block">
        <div className="dg-sueldo-section-heading dg-sueldo-section-heading-taller">
          <div><small>Pago mensual</small><h3>Taller</h3></div>
          <div><small>Total del mes</small><strong>{money(totTaller)}</strong></div>
        </div>
        <p className="dg-hint dg-sueldo-adelanto-note"><Wallet size={13} /><span>Los adelantos se descuentan únicamente del <strong>complemento mensual en efectivo</strong>. El sueldo por transferencia permanece separado.</span></p>
        {taller.length === 0 ? <div className="dg-empty">No hay empleados de Taller cargados.</div> : (
          <div className="dg-payroll-list">
            {taller.map((e) => {
              const fila = filaDe(e.id);
              const t = totalesFila(e, fila);
              return (
                <article className="dg-payroll-card dg-payroll-card-taller" key={e.id}>
                  <div className="dg-payroll-employee-head dg-payroll-employee-head-taller">
                    <div className="dg-payroll-employee-name"><strong>{e.nombre}</strong><small>Hora extra: {money(e.valorHoraExtra)}</small></div>
                    <div className="dg-payroll-month-metrics dg-payroll-workshop-metrics">
                      <span><small>Sueldo transferencia</small><strong>{money(e.sueldoBase)}</strong></span>
                      <span><small>Complemento fijo</small><strong>{money(e.complementoFijo)}</strong></span>
                      <span><small>Adelantos</small><strong className="dg-td-neg">−{money(t.adelantos)}</strong></span>
                      <span className="dg-payroll-complement-net"><small>Complemento a pagar</small><strong>{money(t.complementoNeto)}</strong></span>
                      <span><small>Horas extra</small><strong>{t.he} hs · {money(t.pagoHE)}</strong></span>
                      <span className="dg-payroll-month-total"><small>Total mensual</small><strong>{money(t.total)}</strong></span>
                    </div>
                    <div className="dg-payroll-actions">
                      <button type="button" className="dg-btn-primary dg-mini-btn" onClick={() => setCargandoSemanas(e)}><CalendarDays size={13} /> Cargar HE / adelanto</button>
                      <button type="button" className="dg-icon-btn" aria-label={`Editar valores de ${e.nombre}`} title="Editar valores" onClick={() => editarEmpleado(e)}><Pencil size={14} /></button>
                    </div>
                  </div>
                  <div className="dg-workshop-weeks">
                    {SEMANAS.map((numero) => {
                      const he = nnum(fila?.semanas?.[numero]?.he);
                      const adelanto = nnum(fila?.semanas?.[numero]?.adelanto);
                      return (
                        <div className="dg-workshop-week" key={numero}>
                          <div><strong>Semana {numero}</strong><small>Días {rangoSemanaLabel(periodo, numero)}</small></div>
                          <span><small>Horas extra</small><strong>{he || 0} hs{he > 0 ? ` · ${money(he * nnum(e.valorHoraExtra))}` : ""}</strong></span>
                          <span><small>Adelanto</small><strong className={adelanto ? "dg-td-neg" : ""}>{adelanto ? `−${money(adelanto)}` : money(0)}</strong></span>
                        </div>
                      );
                    })}
                  </div>
                  {t.adelantos > 0 && <div className="dg-payroll-deduction-line"><span>Complemento fijo {money(e.complementoFijo)}</span><span>− Adelantos {money(t.adelantos)}</span><strong>= Complemento a pagar {money(t.complementoNeto)}</strong></div>}
                  {fila?.nota && <p className="dg-sueldo-nota-fija"><strong>Nota:</strong> {fila.nota}</p>}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {cargandoSemanas && (
        <CargarSemanasModal
          empleado={cargandoSemanas}
          periodo={periodo}
          fila={filaDe(cargandoSemanas.id)}
          resumenComision={comisionesPorEmpleado[cargandoSemanas.id]}
          onGuardar={(datos) => guardarSemanasDe(cargandoSemanas.id, datos)}
          onClose={() => setCargandoSemanas(null)}
        />
      )}
    </div>
  );
}

function EmpleadoForm({ empleado, onSave, onCancel }) {
  const [draft, setDraft] = useState(empleado);
  function set(f, v) { setDraft((d) => ({ ...d, [f]: v })); }
  return (
    <EnterFlow onSubmit={() => onSave(draft)} autoFocus={false}>
      <div className="dg-field-grid">
        <Field label="Nombre"><input value={draft.nombre} onChange={(e) => set("nombre", e.target.value)} /></Field>
        <Field label="Sector"><select value={draft.sector} onChange={(e) => set("sector", e.target.value)}>{SUELDOS_SECTORES.map((s) => (<option key={s}>{s}</option>))}</select></Field>
      </div>
      {draft.sector === "Oficina/Ventas" ? (
        <div className="dg-field-grid" style={{ marginTop: 12 }}>
          <Field label="Valor hora"><input type="number" min="0" step="0.01" value={draft.valorHora} onChange={(e) => set("valorHora", e.target.value)} /></Field>
          <Field label="Comisión % (ej: 3)"><input type="number" min="0" step="0.01" value={draft.comisionPct} onChange={(e) => set("comisionPct", e.target.value)} /></Field>
        </div>
      ) : (
        <div className="dg-field-grid" style={{ marginTop: 12 }}>
          <Field label="Sueldo de recibo"><input type="number" min="0" step="0.01" value={draft.sueldoBase} onChange={(e) => set("sueldoBase", e.target.value)} /></Field>
          <Field label="Complemento fijo"><input type="number" min="0" step="0.01" value={draft.complementoFijo} onChange={(e) => set("complementoFijo", e.target.value)} /></Field>
          <Field label="Valor hora extra"><input type="number" min="0" step="0.01" value={draft.valorHoraExtra} onChange={(e) => set("valorHoraExtra", e.target.value)} /></Field>
        </div>
      )}
      <div className="dg-form-actions">
        {onCancel && <button type="button" className="dg-btn-ghost" onClick={onCancel}>Cancelar edición</button>}
        <button type="button" className="dg-btn-primary" onClick={() => onSave(draft)}><Save size={14} /> Guardar empleado</button>
      </div>
    </EnterFlow>
  );
}

function ProveedoresPanel({ proveedores, purchases, onChange }) {
  const [editando, setEditando] = useState(null); // objeto en edición, o null
  const vacio = { id: "", nombre: "", rubro: "", contacto: "", telefono: "", cuit: "", notas: "" };

  function guardar(prov) {
    const existe = (proveedores || []).some((p) => p.id === prov.id);
    onChange(existe ? proveedores.map((p) => (p.id === prov.id ? prov : p)) : [{ ...prov, id: uid() }, ...(proveedores || [])]);
    setEditando(null);
  }
  function borrar(id) {
    if (!window.confirm("¿Borrar este proveedor? Las compras que ya le cargaste no se borran.")) return;
    onChange((proveedores || []).filter((p) => p.id !== id));
  }
  function totalGastadoEn(id) {
    return (purchases || []).filter((p) => p.proveedorId === id).reduce((a, p) => a + Number(p.monto || 0), 0);
  }

  return (
    <div className="dg-page">
      <div className="dg-form-actions" style={{ justifyContent: "flex-start", marginBottom: 14 }}>
        <button className="dg-btn-primary" onClick={() => setEditando(vacio)}><Plus size={14} /> Nuevo proveedor</button>
      </div>

      {(proveedores || []).length === 0 && <div className="dg-empty">Todavía no cargaste ningún proveedor.</div>}
      <div className="dg-task-list">
        {(proveedores || []).map((p) => (
          <div className="dg-task dg-pago-row" key={p.id}>
            <div className="dg-pago-info">
              <span>{p.nombre}</span>
              <span className="dg-pago-meta">{p.rubro || "Sin rubro"} · {p.contacto || "—"} · {p.telefono || "—"}{p.cuit ? ` · CUIT ${p.cuit}` : ""}</span>
            </div>
            <span className="dg-pago-monto">{money(totalGastadoEn(p.id))}</span>
            <button className="dg-icon-btn" onClick={() => setEditando(p)}><Pencil size={14} /></button>
            <button className="dg-icon-btn dg-task-del" onClick={() => borrar(p.id)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {editando && (
        <div className="dg-overlay" onClick={() => setEditando(null)}>
          <div className="dg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dg-modal-head"><div className="dg-modal-title">{editando.id ? "Editar proveedor" : "Nuevo proveedor"}</div><button className="dg-icon-btn" onClick={() => setEditando(null)}><X size={18} /></button></div>
            <div className="dg-form">
              <label>Nombre</label><input value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} autoFocus />
              <label>Rubro</label><input value={editando.rubro} onChange={(e) => setEditando({ ...editando, rubro: e.target.value })} placeholder="Ej: Vidrio, Aluminio, Electrónica, Embalaje" />
              <label>Contacto</label><input value={editando.contacto} onChange={(e) => setEditando({ ...editando, contacto: e.target.value })} placeholder="Nombre de la persona de contacto" />
              <label>Teléfono</label><input value={editando.telefono} onChange={(e) => setEditando({ ...editando, telefono: e.target.value })} />
              <label>CUIT</label><input value={editando.cuit} onChange={(e) => setEditando({ ...editando, cuit: e.target.value })} />
              <label>Notas</label><input value={editando.notas} onChange={(e) => setEditando({ ...editando, notas: e.target.value })} placeholder="Condiciones de pago, plazos, lo que sea útil" />
            </div>
            <div className="dg-form-actions">
              <button className="dg-btn-ghost" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="dg-btn-primary" disabled={!editando.nombre.trim()} onClick={() => guardar(editando)}><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GastosFijosPanel({ plantillas, onChangePlantillas, proveedores, purchases, onChangePurchases }) {
  const [editando, setEditando] = useState(null);
  const vacio = { id: "", concepto: "", montoEstimado: "", proveedorId: "" };
  const mesActual = new Date().toISOString().slice(0, 7);

  function guardar(pl) {
    const existe = (plantillas || []).some((p) => p.id === pl.id);
    const limpio = { ...pl, montoEstimado: Number(pl.montoEstimado) || 0 };
    onChangePlantillas(existe ? plantillas.map((p) => (p.id === pl.id ? limpio : p)) : [{ ...limpio, id: uid() }, ...(plantillas || [])]);
    setEditando(null);
  }
  function borrar(id) {
    if (!window.confirm("¿Borrar esta plantilla de gasto fijo?")) return;
    onChangePlantillas((plantillas || []).filter((p) => p.id !== id));
  }
  function yaCargadoEsteMes(plantillaId) {
    return (purchases || []).some((p) => p.plantillaId === plantillaId && (p.fecha || "").slice(0, 7) === mesActual);
  }
  function cargarEsteMes(pl) {
    const nueva = {
      id: uid(), concepto: pl.concepto, monto: pl.montoEstimado, tipo: "administracion",
      proveedorId: pl.proveedorId || "", sectorId: "", fecha: new Date().toISOString().slice(0, 10),
      estado: "pendiente", conIva: false, gastoFijo: true, plantillaId: pl.id,
    };
    onChangePurchases([...(purchases || []), nueva]);
  }

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>
        Estas son plantillas con el monto habitual — no se cargan solas cada mes. Tocá "Cargar este mes" cuando corresponda, así queda como una compra real (editable, con su propio estado de pago) y no como un número fantasma.
      </p>
      <div className="dg-form-actions" style={{ justifyContent: "flex-start", marginBottom: 14 }}>
        <button className="dg-btn-primary" onClick={() => setEditando(vacio)}><Plus size={14} /> Nueva plantilla</button>
      </div>

      {(plantillas || []).length === 0 && <div className="dg-empty">Todavía no armaste ninguna plantilla de gasto fijo (alquiler, servicios, etc.).</div>}
      <div className="dg-task-list">
        {(plantillas || []).map((pl) => {
          const cargado = yaCargadoEsteMes(pl.id);
          return (
            <div className="dg-task dg-pago-row" key={pl.id}>
              <div className="dg-pago-info">
                <span>{pl.concepto}</span>
                <span className="dg-pago-meta">{(proveedores || []).find((p) => p.id === pl.proveedorId)?.nombre || "Sin proveedor"}</span>
              </div>
              <span className="dg-pago-monto">{money(pl.montoEstimado)}</span>
              {cargado
                ? <span className="dg-badge" style={{ "--bc": "var(--dg-success)" }}><CheckCircle2 size={12} /> Ya cargado este mes</span>
                : <button className="dg-btn-ghost dg-mini-btn" onClick={() => cargarEsteMes(pl)}><Plus size={13} /> Cargar este mes</button>}
              <button className="dg-icon-btn" onClick={() => setEditando(pl)}><Pencil size={14} /></button>
              <button className="dg-icon-btn dg-task-del" onClick={() => borrar(pl.id)}><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>

      {editando && (
        <div className="dg-overlay" onClick={() => setEditando(null)}>
          <div className="dg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dg-modal-head"><div className="dg-modal-title">{editando.id ? "Editar plantilla" : "Nueva plantilla de gasto fijo"}</div><button className="dg-icon-btn" onClick={() => setEditando(null)}><X size={18} /></button></div>
            <div className="dg-form">
              <label>Concepto</label><input value={editando.concepto} onChange={(e) => setEditando({ ...editando, concepto: e.target.value })} placeholder="Ej: Alquiler del local" autoFocus />
              <label>Monto habitual</label><input type="number" value={editando.montoEstimado} onChange={(e) => setEditando({ ...editando, montoEstimado: e.target.value })} />
              <label>Proveedor (opcional)</label>
              <select value={editando.proveedorId} onChange={(e) => setEditando({ ...editando, proveedorId: e.target.value })}>
                <option value="">Sin especificar</option>
                {(proveedores || []).map((p) => (<option key={p.id} value={p.id}>{p.nombre}</option>))}
              </select>
            </div>
            <div className="dg-form-actions">
              <button className="dg-btn-ghost" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="dg-btn-primary" disabled={!editando.concepto.trim()} onClick={() => guardar(editando)}><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FinanzasPanel({ incomes, purchases, sectors, onChangeIncomes, onChangePurchases, proveedores, onChangeProveedores, gastosFijosPlantillas, onChangeGastosFijosPlantillas, empleadosSueldo, liquidaciones, pedidos }) {
  const [tab, setTab] = useState("resumen");
  const mesActual = new Date().toISOString().slice(0, 7);

  const facturacionMes = incomes.filter((i) => (i.fecha || "").slice(0, 7) === mesActual && i.estado === "pagado").reduce((a, i) => a + Number(i.monto || 0), 0);
  const sueldosMes = totalSueldosDelMes(mesActual, empleadosSueldo || [], liquidaciones || [], pedidos || []);
  const gastosFijosCargados = purchases.filter((p) => p.gastoFijo && (p.fecha || "").slice(0, 7) === mesActual).reduce((a, p) => a + Number(p.monto || 0), 0);
  const plantillasPendientes = (gastosFijosPlantillas || []).filter((pl) => !purchases.some((p) => p.plantillaId === pl.id && (p.fecha || "").slice(0, 7) === mesActual));
  const gastosFijosPendientesEstimado = plantillasPendientes.reduce((a, pl) => a + Number(pl.montoEstimado || 0), 0);
  const gastosFijosTotalMes = sueldosMes + gastosFijosCargados + gastosFijosPendientesEstimado;

  const iva = ivaAPagarEnMes(mesActual, incomes, purchases);

  return (
    <div className="dg-page">
      <div className="dg-quickviews" style={{ marginBottom: 16 }}>
        <button className={`dg-quickview-btn ${tab === "resumen" ? "dg-quickview-on" : ""}`} onClick={() => setTab("resumen")}><Wallet size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />Resumen</button>
        <button className={`dg-quickview-btn ${tab === "ingresos" ? "dg-quickview-on" : ""}`} onClick={() => setTab("ingresos")}><TrendingUp size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />Ingresos</button>
        <button className={`dg-quickview-btn ${tab === "compras" ? "dg-quickview-on" : ""}`} onClick={() => setTab("compras")}><TrendingDown size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />Compras</button>
        <button className={`dg-quickview-btn ${tab === "proveedores" ? "dg-quickview-on" : ""}`} onClick={() => setTab("proveedores")}><Truck size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />Proveedores</button>
        <button className={`dg-quickview-btn ${tab === "fijos" ? "dg-quickview-on" : ""}`} onClick={() => setTab("fijos")}><CalendarDays size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />Gastos fijos</button>
      </div>

      {tab === "resumen" && (
        <div className="dg-fin-resumen">
          <div className="dg-panel-grid">
            <div className="dg-panel-card">
              <div className="dg-panel-card-label">Facturación de {labelMes(mesActual)}</div>
              <div className="dg-panel-card-valor">{money(facturacionMes)}</div>
            </div>
            <div className="dg-panel-card">
              <div className="dg-panel-card-label">Gastos fijos de {labelMes(mesActual)}</div>
              <div className="dg-panel-card-valor" style={{ color: "var(--dg-danger)" }}>{money(gastosFijosTotalMes)}</div>
              <div className="dg-panel-card-variacion">Sueldos {money(sueldosMes)} + fijos {money(gastosFijosCargados + gastosFijosPendientesEstimado)}</div>
            </div>
            <div className="dg-panel-card">
              <div className="dg-panel-card-label">IVA a pagar este mes</div>
              <div className="dg-panel-card-valor" style={{ color: "var(--dg-warning)" }}>{money(iva.aPagar)}</div>
              <div className="dg-panel-card-variacion">Débito de {labelMes(iva.mesDeVentaOrigen)}: {money(iva.debito)} − crédito de compras de este mes: {money(iva.credito)}</div>
            </div>
          </div>

          {plantillasPendientes.length > 0 && (
            <div className="dg-section-card" style={{ borderColor: "rgba(var(--dg-warning-rgb),0.35)" }}>
              <div className="dg-section-header" style={{ color: "var(--dg-warning)" }}><AlertTriangle size={14} /> Gastos fijos sin cargar este mes ({plantillasPendientes.length})</div>
              <div className="dg-task-list" style={{ marginBottom: 0 }}>
                {plantillasPendientes.map((pl) => (
                  <div className="dg-task dg-pago-row" key={pl.id}>
                    <div className="dg-pago-info"><span>{pl.concepto}</span></div>
                    <span className="dg-pago-monto">{money(pl.montoEstimado)}</span>
                    <button className="dg-btn-ghost dg-mini-btn" onClick={() => setTab("fijos")}><ChevronRight size={13} /> Ir a cargar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="dg-hint" style={{ marginTop: 4 }}>
            El IVA se calcula así: el IVA de lo que se vendió y cobró bancarizado en un mes se paga recién 2 meses después. El IVA de las compras con factura se descuenta el mismo mes en que se compra. Es una estimación — no reemplaza la liquidación real de tu contador.
          </p>
        </div>
      )}

      {tab === "ingresos" && <MoneyPage kind="income" entries={incomes} sectors={sectors} onChange={onChangeIncomes} proveedores={proveedores} onChangeProveedores={onChangeProveedores} />}
      {tab === "compras" && <MoneyPage kind="purchase" entries={purchases} sectors={sectors} onChange={onChangePurchases} proveedores={proveedores} onChangeProveedores={onChangeProveedores} />}
      {tab === "proveedores" && <ProveedoresPanel proveedores={proveedores} purchases={purchases} onChange={onChangeProveedores} />}
      {tab === "fijos" && <GastosFijosPanel plantillas={gastosFijosPlantillas} onChangePlantillas={onChangeGastosFijosPlantillas} proveedores={proveedores} purchases={purchases} onChangePurchases={onChangePurchases} />}
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
        <EnterFlow className="dg-form dg-pago-form" onSubmit={addRecurso} autoFocus={false}>
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
        </EnterFlow>
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

function ProveedorPicker({ proveedores, value, onChange, onCrearRapido }) {
  const [creando, setCreando] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");

  if (creando) {
    return (
      <div className="dg-proveedor-picker-nuevo">
        <input autoFocus value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)} placeholder="Nombre del proveedor" />
        <button type="button" className="dg-btn-ghost dg-mini-btn" onClick={() => {
          if (!nombreNuevo.trim()) return;
          const id = onCrearRapido(nombreNuevo.trim());
          onChange(id);
          setNombreNuevo(""); setCreando(false);
        }}><Check size={13} /></button>
        <button type="button" className="dg-btn-ghost dg-mini-btn" onClick={() => { setCreando(false); setNombreNuevo(""); }}><X size={13} /></button>
      </div>
    );
  }
  return (
    <select value={value || ""} onChange={(e) => { if (e.target.value === "__nuevo__") setCreando(true); else onChange(e.target.value); }}>
      <option value="">Sin especificar</option>
      {proveedores.map((p) => (<option key={p.id} value={p.id}>{p.nombre}</option>))}
      <option value="__nuevo__">+ Nuevo proveedor…</option>
    </select>
  );
}

function MoneyPage({ kind, entries, sectors, onChange, proveedores, onChangeProveedores }) {
  const isIncome = kind === "income";
  const TYPES = isIncome ? INCOME_CHANNELS : PURCHASE_TYPES;
  const typeField = isIncome ? "canal" : "tipo";
  const partyField = isIncome ? "cliente" : "proveedorId";
  const partyLabel = isIncome ? "Cliente" : "Proveedor";

  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [masDetalles, setMasDetalles] = useState(false);
  const [tipo, setTipo] = useState(Object.keys(TYPES)[0]);
  const [party, setParty] = useState("");
  const [metodo, setMetodo] = useState(Object.keys(PAYMENT_METHODS)[0]);
  const [cuenta, setCuenta] = useState("ingresos_bancarios");
  const [sectorId, setSectorId] = useState("");
  const [conIva, setConIva] = useState(false);
  const [gastoFijo, setGastoFijo] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  const totalPendiente = entries.filter((e) => e.estado === "pendiente").reduce((a, e) => a + Number(e.monto || 0), 0);
  const totalConfirmado = entries.filter((e) => e.estado === "pagado").reduce((a, e) => a + Number(e.monto || 0), 0);
  const chartData = monthlyTotals(entries);
  const breakdown = breakdownBy(entries, typeField, TYPES);

  const cuentaTotals = isIncome ? Object.keys(CUENTA_INGRESO).map((k) => ({
    key: k, label: CUENTA_INGRESO[k], total: entries.filter((e) => (e.cuenta || "ingresos_bancarios") === k).reduce((a, e) => a + Number(e.monto || 0), 0),
  })) : [];

  const visibles = entries.filter((e) => filtro === "todos" || e.estado === filtro).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  function crearProveedorRapido(nombre) {
    const id = uid();
    onChangeProveedores([{ id, nombre, rubro: "", contacto: "", telefono: "", cuit: "", notas: "" }, ...(proveedores || [])]);
    return id;
  }

  function addEntry() {
    if (!concepto.trim() || !monto) return;
    const next = [...entries, {
      id: uid(), concepto: concepto.trim(), monto: Number(monto), [typeField]: tipo,
      [partyField]: isIncome ? party.trim() : (party || ""), ...(isIncome ? { metodo, cuenta } : { conIva, gastoFijo }), sectorId, fecha, estado: "pendiente",
    }];
    onChange(next);
    setConcepto(""); setMonto(""); setParty(""); setConIva(false); setGastoFijo(false);
  }
  function toggleEstado(id) { onChange(entries.map((e) => (e.id === id ? { ...e, estado: e.estado === "pendiente" ? "pagado" : "pendiente" } : e))); }
  function removeEntry(id) { onChange(entries.filter((e) => e.id !== id)); }
  function nombreProveedor(id) { return (proveedores || []).find((p) => p.id === id)?.nombre || "—"; }

  return (
    <div className="dg-page">
      <div className="dg-totales">
        <div className="dg-total-card" style={{ "--c": "var(--dg-danger)" }}><span>Pendiente</span><strong>{money(totalPendiente)}</strong></div>
        <div className="dg-total-card" style={{ "--c": "var(--dg-success)" }}><span>{isIncome ? "Cobrado" : "Pagado"}</span><strong>{money(totalConfirmado)}</strong></div>
      </div>

      {isIncome && (
        <div className="dg-totales dg-cuenta-totales">
          {cuentaTotals.map((c) => (
            <div className="dg-total-card" style={{ "--c": "var(--dg-accent)" }} key={c.key}><span>{c.label}</span><strong>{money(c.total)}</strong></div>
          ))}
        </div>
      )}

      <div className="dg-charts">
        <div className="dg-chart-card">
          <div className="dg-chart-title">Últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--dg-line-rgb),0.06)" vertical={false} />
              <XAxis dataKey="mes" stroke="var(--dg-text-dim)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--dg-text-dim)" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ background: "var(--dg-surface)", border: "1px solid rgba(var(--dg-line-rgb),0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
              <Bar dataKey="total" fill={isIncome ? "var(--dg-success)" : "var(--dg-danger)"} radius={[4, 4, 0, 0]} />
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
              <Tooltip contentStyle={{ background: "var(--dg-surface)", border: "1px solid rgba(var(--dg-line-rgb),0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <EnterFlow className="dg-form dg-pago-form" onSubmit={addEntry} autoFocus={false}>
        <div className="dg-form-row">
          <div style={{ flex: 2 }}><label>Concepto</label><input value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder={isIncome ? "Ej: Venta 4 espejos LED redondos" : "Ej: Vidrio importado - contenedor"} /></div>
          <div style={{ flex: 1 }}><label>Monto</label><input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0" /></div>
          <div style={{ flex: 1 }}><label>Fecha</label><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
        </div>

        <button type="button" className="dg-btn-ghost dg-mini-btn" style={{ marginTop: 4 }} onClick={() => setMasDetalles((v) => !v)}>
          {masDetalles ? <ChevronRight size={13} style={{ transform: "rotate(90deg)" }} /> : <ChevronRight size={13} />} {masDetalles ? "Ocultar detalles" : "Más detalles (opcional)"}
        </button>

        {masDetalles && (
          <>
            <div className="dg-form-row">
              <div style={{ flex: 1 }}><label>{isIncome ? "Canal" : "Tipo"}</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>{Object.entries(TYPES).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select>
              </div>
              <div style={{ flex: 1 }}><label>{partyLabel}</label>
                {isIncome
                  ? <input value={party} onChange={(e) => setParty(e.target.value)} placeholder="Opcional" />
                  : <ProveedorPicker proveedores={proveedores || []} value={party} onChange={setParty} onCrearRapido={crearProveedorRapido} />}
              </div>
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
              {!isIncome && (
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 14, paddingBottom: 8 }}>
                  <label className="dg-check-inline"><input type="checkbox" checked={conIva} onChange={(e) => setConIva(e.target.checked)} /> Con IVA discriminado</label>
                  <label className="dg-check-inline"><input type="checkbox" checked={gastoFijo} onChange={(e) => setGastoFijo(e.target.checked)} /> Gasto fijo mensual</label>
                </div>
              )}
            </div>
          </>
        )}

        <div className="dg-form-actions" style={{ marginTop: 8 }}>
          <button className="dg-btn-primary" onClick={addEntry}><Plus size={16} /> Registrar</button>
        </div>
      </EnterFlow>

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
              <span className="dg-pago-meta">
                {TYPES[e[typeField]]} · {isIncome ? (e.cliente || "—") : nombreProveedor(e.proveedorId)} · {sectors.find((s) => s.id === e.sectorId)?.name || "General"} · {e.fecha}
                {isIncome && e.cuenta ? ` · ${CUENTA_INGRESO[e.cuenta]}` : ""}
                {!isIncome && e.conIva ? " · con IVA" : ""}
                {!isIncome && e.gastoFijo ? " · gasto fijo" : ""}
              </span>
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
    id: uid(), orden: prefill?.orden || null, grupoId: prefill?.grupoId || null, fecha: new Date().toISOString().slice(0, 10),
    vendedor: prefill?.vendedor || "", cliente: prefill?.cliente || "", celular: prefill?.celular || "", dniCuit: prefill?.dniCuit || "",
    provincia: prefill?.provincia || "", localidad: prefill?.localidad || "", codigoPostal: prefill?.codigoPostal || "",
    ancho: "", alto: "", cant: 1, pulido: "No", forma: "Rectangular", tipo: "Simple", grabado: "",
    touch: "No", desemp: "No", desempTipo: "220", desempCantidad: 1, horaTemp: "No", bluetooth: "No", tono: "3 tonos",
    tipoFactura: prefill?.tipoFactura || "Cons. Final / B", monto: "", anticipo: "", comision: "No aplica", facturado: false, montoRegistrado: 0,
    estado: "Sin pasar a fábrica", demorado: false, listo: "", metodo: prefill?.metodo || "A confirmar", detalleEntrega: prefill?.detalleEntrega || "", costoEnvio: "", piso: prefill?.piso || "", horarioEntrega: "", envioPagado: false, envioConfirmado: false, clienteAvisado: false, clienteAvisadoFecha: "", pedidoVerificadoFecha: "", produccionEtapa: "", produccionCortadoFecha: "", produccionCortadoPor: "", grabadoEnviadoFecha: "", grabadoEnviadoPor: "", grabadoRegresoFecha: "", grabadoRegresoPor: "", biseladoPedidoFecha: "", biseladoPedidoPor: "", biseladoRegresoFecha: "", biseladoRegresoPor: "", produccionArmadoFecha: "", produccionArmadoPor: "", produccionEmbaladoFecha: "", produccionEmbaladoPor: "", produccionListaFecha: "", envioConfirmadoFecha: "", entregadoFecha: "",
    comisionPagada: false, comisionExcluida: false, comisionLiquidadaMonto: 0, comisionEmpleadoId: null,
    facturaUrl: "", remitoUrl: "", remitoNumeroGuia: "",
    motivoCancelacion: "", motivoReproceso: "", cantidadReprocesos: 0, stockEspejoId: "",
  };
}

function pedidoGroupKey(pedido) {
  return pedido?.grupoId ? `grupo:${pedido.grupoId}` : `pedido:${pedido?.id}`;
}

function normalizarOrdenesPorGrupo(items) {
  const ordenPorGrupo = new Map();
  items.forEach((pedido) => {
    if (!pedido?.grupoId) return;
    const orden = Number(pedido.orden);
    if (!Number.isFinite(orden) || orden <= 0) return;
    const key = pedidoGroupKey(pedido);
    const actual = ordenPorGrupo.get(key);
    if (!actual || orden < actual) ordenPorGrupo.set(key, orden);
  });

  return items.map((pedido) => {
    const ordenGrupo = ordenPorGrupo.get(pedidoGroupKey(pedido));
    return ordenGrupo && pedido.orden !== ordenGrupo ? { ...pedido, orden: ordenGrupo } : pedido;
  });
}

function agruparEspejosPorPedido(items) {
  const grupos = new Map();
  items.forEach((pedido) => {
    const key = pedidoGroupKey(pedido);
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key).push(pedido);
  });

  return Array.from(grupos.entries()).map(([key, espejos]) => {
    const principal = espejos.find((pedido) => pedido.grupoId && pedido.id === pedido.grupoId) || espejos[0];
    return {
      key,
      orden: principal?.orden,
      fecha: principal?.fecha || espejos[0]?.fecha,
      principal,
      espejos,
    };
  });
}

function textoComparable(value) {
  return String(value ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Traduce un pedido real (que usa sus propios nombres de campo) al formato
// que espera computeQuote (el mismo motor de costos del presupuestador), para
// poder estimar cuánto costó ese pedido puntual sin duplicar la fórmula.
function tipoProductoDePedido(pedido) {
  const forma = textoComparable(pedido?.forma || "");
  const esEsmerilado = pedidoProcesoTaller(pedido) === "esmerilados";
  if (esEsmerilado) {
    if (forma.includes("redondo") || forma.includes("circular")) return "Esmerilado Redondo";
    if (forma.includes("pastilla") || forma.includes("oval")) return "Esmerilado Pastilla/Oval";
    return "Esmerilado Recto";
  }
  if (forma.includes("redondo") || forma.includes("circular")) return "Redondo Simple";
  if (forma.includes("pastilla")) return "Pastilla Simple";
  if (forma.includes("oval")) return "Ovalado Simple";
  if (forma.includes("curva")) return "Puntas Curvas";
  if (forma.includes("organico") || forma.includes("orgánico")) return "Orgánico";
  if (forma.includes("soft")) return "Soft";
  return "Rectangular Simple";
}

function pedidoAInputsCosteo(pedido) {
  const bt = pedido?.bluetooth && pedido.bluetooth !== "No" ? pedido.bluetooth : "Sin Bluetooth";
  return {
    tipoProducto: tipoProductoDePedido(pedido),
    ancho: Number(pedido?.ancho) || 0,
    alto: Number(pedido?.alto) || 0,
    touch: (pedido?.touch === "Touch" || pedido?.touch === "Doble touch (frontal + perimetral)") ? "Sí" : "No",
    desemp: pedidoTieneDesempanante(pedido) ? "Sí" : "No",
    horaTemp: pedido?.horaTemp === "Hora y Temperatura" ? "Sí" : "No",
    bluetoothSel: bt,
    panelesAdicionales: Math.max(0, (Number(pedido?.desempCantidad) || 1) - 1),
    envioInterior: pedido?.metodo === "Interior" ? "Sí" : "No",
    tipoCliente: "Consumidor Final",
    cantidad: 1,
  };
}

// Estimación, no un costo exacto: usa la configuración de precios ACTUAL, así
// que un pedido viejo se recalcula como si se hubiera hecho hoy, no con los
// precios de materiales de ese momento. Sirve para ver la tendencia, no para
// contabilidad exacta.
function estimarCostoPedido(pedido, cfg) {
  if (!cfg) return 0;
  try {
    const inputs = pedidoAInputsCosteo(pedido);
    if (!inputs.ancho || !inputs.alto) return 0;
    const r = computeQuote(inputs, cfg);
    return (Number(r.costoTotalEstimado) || 0) * (Number(pedido?.cant) || 1);
  } catch (e) {
    return 0;
  }
}

function pedidoProcesoTaller(pedido) {
  const descripcion = textoComparable(`${pedido?.tipo || ""} ${pedido?.grabado || ""}`);
  if (descripcion.includes("bisel") || ["Pedir biselado", "Sin pedir", "En biseladora"].includes(pedido?.estado)) return "biselados";
  if (descripcion.includes("esmeril") || /(?:^|\s)esm\.?($|\s)/.test(descripcion) || ["Mandar a grabar", "En grabado"].includes(pedido?.estado)) return "esmerilados";
  return "simples";
}

function pedidoListaFabrica(pedido) {
  if (pedido?.estado === "Mandar a grabar") return "mandar_grabar";
  if (pedido?.estado === "En grabado") return "en_grabado";
  if (pedido?.estado === "Sin pedir" || pedido?.estado === "Pedir biselado") return "bisel_sin_pedir";
  if (pedido?.estado === "En biseladora") return "bisel_pedidos";
  if (pedidoEstaListo(pedido) || pedido?.estado === "Para armar" || pedido?.produccionEtapa) return "armar";
  return pedidoProcesoTaller(pedido) === "biselados" ? "bisel_sin_pedir" : "armar";
}

// Agrupa la lista "Espejos para armar" para que no se mezclen simples,
// esmerilados y biselados entre sí: primero simples (por método de entrega:
// retira, envío, interior), después esmerilados (los que ya volvieron y hay
// que armar, y recién después los que hay que cortar para mandar a grabar),
// y al final los biselados que ya volvieron y hay que armar.
function grupoListaArmar(pedido) {
  const proceso = pedidoProcesoTaller(pedido);
  if (proceso === "simples") return "simples";
  if (proceso === "esmerilados") return pedido?.estado === "Para armar" ? "esmerilados_armar" : "esmerilados_cortar";
  return "biselados_armar";
}
const ORDEN_GRUPOS_ARMAR = ["simples", "esmerilados_armar", "esmerilados_cortar", "biselados_armar"];
const ETIQUETAS_GRUPO_ARMAR = {
  simples: "Simples",
  esmerilados_armar: "Esmerilados — para armar",
  esmerilados_cortar: "Esmerilados — para cortar y mandar a grabar",
  biselados_armar: "Biselados — para armar",
};
function prioridadListaArmar(pedido) {
  // Dentro de cada grupo (simples, esmerilados, biselados) el único criterio
  // de orden es la fecha de entrega — ya no se sub-ordena por método.
  return ORDEN_GRUPOS_ARMAR.indexOf(grupoListaArmar(pedido));
}

function estadoProduccionLabel(pedido) {
  if (pedidoEstaListo(pedido)) return "Espejo listo";
  const lista = TALLER_LISTAS.find((item) => item.id === pedidoListaFabrica(pedido));
  return lista?.shortLabel || pedido?.estado || "En producción";
}

function pasosVisualesFabrica(pedido) {
  const modelo = pedidoProcesoTaller(pedido);
  const completados = pasosProduccionCompletados(pedido);
  const terminado = pedidoEstaListo(pedido) || completados >= PRODUCCION_PASOS.length;
  let pasos;

  if (modelo === "esmerilados") {
    const cortado = completados >= 1 || Boolean(pedido?.produccionCortadoFecha);
    const enviado = Boolean(pedido?.grabadoEnviadoFecha) || ["En grabado", "Para armar", "Espejo listo", "Entregado"].includes(pedido?.estado);
    const regreso = Boolean(pedido?.grabadoRegresoFecha) || ["Para armar", "Espejo listo", "Entregado"].includes(pedido?.estado);
    pasos = [
      { id: "cortado", label: "Cortado", done: cortado },
      { id: "mandar_grabar", label: "A grabar", done: enviado },
      { id: "en_grabado", label: "En grabado", done: regreso },
      { id: "armado", label: "Armado", done: completados >= 2 },
      { id: "embalado", label: "Embalado", done: terminado },
    ];
  } else if (modelo === "biselados") {
    const pedidoHecho = Boolean(pedido?.biseladoPedidoFecha) || ["En biseladora", "Para armar", "Espejo listo", "Entregado"].includes(pedido?.estado) || completados >= 1;
    const regreso = Boolean(pedido?.biseladoRegresoFecha) || ["Para armar", "Espejo listo", "Entregado"].includes(pedido?.estado) || completados >= 1;
    pasos = [
      { id: "pedir_biselado", label: "Pedir", done: pedidoHecho },
      { id: "en_biseladora", label: "En biseladora", done: regreso },
      { id: "armado", label: "Armado", done: completados >= 2 },
      { id: "embalado", label: "Embalado", done: terminado },
    ];
  } else {
    pasos = PRODUCCION_PASOS.map((paso, index) => ({ ...paso, done: index < completados }));
  }

  const actual = pasos.findIndex((paso) => !paso.done);
  return pasos.map((paso, index) => ({ ...paso, current: !terminado && index === actual }));
}

function registrosFabrica(pedido) {
  const modelo = pedidoProcesoTaller(pedido);
  const embalado = { label: "Embalado", fecha: pedido?.produccionEmbaladoFecha || pedido?.produccionListaFecha, responsable: pedido?.produccionEmbaladoPor };
  if (modelo === "esmerilados") {
    return [
      { label: "Cortado", fecha: pedido?.produccionCortadoFecha, responsable: pedido?.produccionCortadoPor },
      { label: "Enviado a grabar", fecha: pedido?.grabadoEnviadoFecha, responsable: pedido?.grabadoEnviadoPor },
      { label: "Volvió de grabado", fecha: pedido?.grabadoRegresoFecha, responsable: pedido?.grabadoRegresoPor },
      { label: "Armado", fecha: pedido?.produccionArmadoFecha, responsable: pedido?.produccionArmadoPor },
      embalado,
    ];
  }
  if (modelo === "biselados") {
    return [
      { label: "Biselado pedido", fecha: pedido?.biseladoPedidoFecha, responsable: pedido?.biseladoPedidoPor },
      { label: "Volvió de biseladora", fecha: pedido?.biseladoRegresoFecha, responsable: pedido?.biseladoRegresoPor },
      { label: "Armado", fecha: pedido?.produccionArmadoFecha, responsable: pedido?.produccionArmadoPor },
      embalado,
    ];
  }
  return [
    { label: "Cortado", fecha: pedido?.produccionCortadoFecha, responsable: pedido?.produccionCortadoPor },
    { label: "Armado", fecha: pedido?.produccionArmadoFecha, responsable: pedido?.produccionArmadoPor },
    embalado,
  ];
}

function proximoControlTaller(pedido) {
  if (pedido?.estado === "Mandar a grabar") return "Mandar a grabar";
  if (pedido?.estado === "En grabado") return "Esperando regreso del grabado";
  if (["Sin pedir", "Pedir biselado"].includes(pedido?.estado) || (pedidoProcesoTaller(pedido) === "biselados" && !pedido?.produccionEtapa && pedido?.estado === "Verificado")) return "Pedir biselado";
  if (pedido?.estado === "En biseladora") return "Esperando regreso de la biseladora";
  return PRODUCCION_PASOS[pasosProduccionCompletados(pedido)]?.label || "Producción";
}

function partesDetallePedido(detalle) {
  return String(detalle ?? "").split(/\s*(?:[·|;,]|\+(?=\s*[A-Za-zÁÉÍÓÚáéíóúÑñ]))\s*/).filter(Boolean);
}

function esFuncionDesempanante(value) {
  return /^desempanante(?:\s*(?:220v?|touch|t))?$/.test(textoComparable(value));
}

function pedidoTieneDesempanante(pedido) {
  const value = textoComparable(pedido?.desemp);
  return ["desempanante", "si", "true", "220", "220v", "touch", "t"].includes(value)
    || partesDetallePedido(pedido?.grabado).some(esFuncionDesempanante);
}

function pedidoTipoDesempanante(pedido) {
  const value = textoComparable(`${pedido?.desempTipo || ""} ${pedido?.desemp || ""} ${pedido?.grabado || ""}`);
  return /(?:^|\s)(?:touch|t)(?:\s|$)/.test(value) ? "Touch" : "220";
}

function normalizarPedidoFunciones(pedido) {
  const tieneDesempanante = pedidoTieneDesempanante(pedido);
  return {
    ...pedido,
    estado: pedido?.estado === "Pasado a fábrica" ? "Verificado" : pedido?.estado,
    desemp: tieneDesempanante ? "Desempañante" : "No",
    desempTipo: tieneDesempanante ? pedidoTipoDesempanante(pedido) : (pedido?.desempTipo || "220"),
  };
}

function funcionesPedido(pedido, incluirPulido = false) {
  const funciones = [
    { on: pedido?.touch === "Touch" || pedido?.touch === "Doble touch (frontal + perimetral)", label: pedido?.touch === "Doble touch (frontal + perimetral)" ? "DOBLE TOUCH" : "TOUCH" },
    { on: pedidoTieneDesempanante(pedido), label: (pedidoTipoDesempanante(pedido) === "Touch" ? "DESEMPAÑANTE T" : "DESEMPAÑANTE 220") + (Number(pedido?.desempCantidad) > 1 ? ` ×${pedido.desempCantidad}` : "") },
    { on: pedido?.horaTemp === "Hora y Temperatura", label: "HORA Y TEMP" },
    { on: pedido?.bluetooth && pedido.bluetooth !== "No", label: String(pedido.bluetooth).toUpperCase() },
    { on: incluirPulido && pedido?.pulido === "Sí", label: "PULIDO" },
  ];
  return funciones.filter((funcion) => funcion.on && funcion.label);
}

function detalleFabrica(pedido) {
  return partesDetallePedido(pedido?.grabado).filter((parte) => !esFuncionDesempanante(parte)).join(" · ");
}

const QUICK_VIEWS = [
  { id: "todos", label: "Activos" },
  { id: "historial", label: "Historial (entregados)" },
  { id: "retiros", label: "Retiros de la semana" },
  { id: "envios", label: "Envíos de la semana" },
  { id: "verificados", label: "Verificados → listos para fábrica" },
  { id: "facturar", label: "Pendiente de facturar" },
];

function pedidoSaldo(p) { return (Number(p.monto) || 0) - (Number(p.anticipo) || 0); }
// Un pedido puede tener varias unidades iguales (cant > 1) en un solo registro.
// Para contar "espejos" hay que sumar cant, no contar registros — si no, un
// grupo de 3 registros donde uno tiene cant=2 muestra "3 espejos" en vez de 4.
function totalUnidades(lista) { return (lista || []).reduce((total, p) => total + (Number(p?.cant) || 1), 0); }

function resumenPasoPedido(pedido) {
  const conEnvio = esPedidoConEnvio(pedido);
  const total = conEnvio ? 5 : 4;
  if (pedido?.estado === "Cancelado") return { numero: 0, total, label: "Cancelado" };
  if (pedido?.estado === "Entregado") return { numero: total, total, label: "Entregado" };
  if (!pedidoFueVerificado(pedido)) return { numero: 1, total, label: "Verificar pedido" };
  if (!pedidoEstaListo(pedido)) return { numero: 2, total, label: proximoControlTaller(pedido) };
  if (!pedido?.clienteAvisado || (conEnvio && !pedido?.envioConfirmado)) {
    return { numero: 3, total, label: conEnvio ? "Confirmar cliente y envío" : "Coordinar retiro" };
  }
  return { numero: total, total, label: "Confirmar entrega" };
}

function FichaEspejoPaso({ pedido }) {
  const funciones = funcionesPedido(pedido, true);
  return (
    <div className="dg-ficha-espejo-paso">
      <div className="dg-fab-medida">
        <strong>{pedido.ancho} × {pedido.alto}</strong><small>cm</small>
        {Number(pedido.cant) > 1 && <span className="dg-fab-cant">× {pedido.cant}</span>}
      </div>
      <div className="dg-fab-linea">{pedido.forma} · {pedido.tipo} · <span className="dg-fab-tono">{pedido.tono || "—"}</span></div>
      {funciones.length > 0 && (
        <div className="dg-fab-funciones">
          {funciones.map((f, i) => (<span className="dg-fab-func" key={i}>{f.label}</span>))}
        </div>
      )}
      {pedido.grabado && <div className="dg-fab-obs"><span>Observaciones</span> {pedido.grabado}</div>}
    </div>
  );
}

function PasoPedido({ numero, titulo, detalle, estado = "pending", children }) {
  const estadoLabel = estado === "done" ? "Completado" : estado === "active" ? "En curso" : "Pendiente";
  return (
    <div className={`dg-order-step dg-order-step-${estado}`}>
      <div className="dg-order-step-head">
        <span className="dg-order-step-number">{estado === "done" ? <Check size={13} /> : numero}</span>
        <div><small>Paso {numero}</small><strong>{titulo}</strong></div>
        <span className="dg-order-step-state">{estadoLabel}</span>
      </div>
      <p>{detalle}</p>
      {children && <div className="dg-order-step-actions">{children}</div>}
    </div>
  );
}

function VerificacionModal({ pedido, onClose, onConfirmar, kommoSubdominio, onEditarCantidadDesemp }) {
  const funciones = funcionesPedido(pedido, true);
  const tieneDesemp = pedidoTieneDesempanante(pedido);
  const linkWhatsapp = waLink(pedido.celular);
  const linkKommo = kommoSubdominio?.trim()
    ? `https://${kommoSubdominio.trim()}.kommo.com/contacts/list/?query=${encodeURIComponent(pedido.celular || pedido.cliente || "")}`
    : null;

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal dg-modal-verificacion" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head">
          <div className="dg-modal-title">Verificar pedido #{pedido.orden}</div>
          <button className="dg-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <p className="dg-hint" style={{ marginBottom: 14 }}>
          Antes de habilitarlo para fábrica, confirmá que estos datos coincidan con lo que pidió {pedido.cliente || "el cliente"}.
        </p>

        <div className="dg-verif-specs">
          <div className="dg-fab-medida">
            <strong>{pedido.ancho} × {pedido.alto}</strong><small>cm</small>
            {Number(pedido.cant) > 1 && <span className="dg-fab-cant">× {pedido.cant}</span>}
          </div>
          <div className="dg-fab-linea">{pedido.forma} · {pedido.tipo} · <span className="dg-fab-tono">{pedido.tono || "—"}</span></div>
          {funciones.length > 0 && (
            <div className="dg-fab-funciones">
              {funciones.map((f, i) => (<span className="dg-fab-func" key={i}>{f.label}</span>))}
            </div>
          )}
          {pedido.grabado && <div className="dg-fab-obs"><span>Observaciones</span> {pedido.grabado}</div>}
          {tieneDesemp && onEditarCantidadDesemp && (
            <div className="dg-verif-desemp-cantidad">
              <span>¿Cuántos paneles desempañante lleva?</span>
              <input
                type="number" min="1"
                value={pedido.desempCantidad || 1}
                onChange={(e) => onEditarCantidadDesemp(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
          )}
        </div>

        <div className="dg-verif-contacto">
          <span className="dg-verif-cliente">{pedido.cliente || "Sin nombre"}</span>
          <span className="dg-pago-meta">{pedido.celular || "Sin celular cargado"}</span>
        </div>

        <div className="dg-verif-links">
          {linkWhatsapp
            ? <a className="dg-btn-ghost" href={linkWhatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> Abrir chat de WhatsApp</a>
            : <span className="dg-pago-meta">Sin celular: no se puede abrir WhatsApp</span>}
          {linkKommo
            ? <a className="dg-btn-ghost" href={linkKommo} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Buscar en Kommo</a>
            : <span className="dg-pago-meta">Configurá el subdominio de Kommo en Ajustes para habilitar este botón</span>}
        </div>

        <div className="dg-form-actions" style={{ marginTop: 16 }}>
          <button className="dg-btn-ghost" onClick={onClose}>Todavía no</button>
          <button className="dg-btn-primary" onClick={onConfirmar}><CheckCircle2 size={14} /> Coincide, marcar Verificado</button>
        </div>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const salida = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) salida[i] = rawData.charCodeAt(i);
  return salida;
}

function BotonNotificaciones({ session }) {
  const [estado, setEstado] = useState("cargando"); // cargando | inactivo | activo | no-soportado | denegado

  useEffect(() => {
    async function chequear() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || typeof Notification === "undefined") { setEstado("no-soportado"); return; }
      if (Notification.permission === "denied") { setEstado("denegado"); return; }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setEstado(sub ? "activo" : "inactivo");
      } catch (e) { setEstado("inactivo"); }
    }
    chequear();
  }, []);

  async function activar() {
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") { setEstado("denegado"); return; }
      const vapidKey = (import.meta.env.VITE_VAPID_PUBLIC_KEY || "").trim();
      if (!vapidKey) { window.alert("Falta configurar la clave pública de notificaciones (VITE_VAPID_PUBLIC_KEY)."); return; }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidKey) });
      await pushStore.guardarSuscripcion(sub.toJSON(), session);
      setEstado("activo");
    } catch (e) {
      console.error("Error al activar notificaciones:", e);
      window.alert(`No se pudo activar.\n\nDetalle: ${e?.name || ""} ${e?.message || e}\n\n(En iPhone además hace falta agregar la app a la pantalla de inicio antes de activarlas.)`);
    }
  }

  async function desactivar() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) { await pushStore.borrarSuscripcion(sub.endpoint); await sub.unsubscribe(); }
    } catch (e) {}
    setEstado("inactivo");
  }

  if (estado === "no-soportado" || estado === "cargando") return null;
  if (estado === "denegado") {
    return <button className="dg-icon-btn" title="Las notificaciones están bloqueadas en este navegador. Activalas desde la configuración del sitio para habilitarlas de nuevo." disabled><BellOff size={17} /></button>;
  }
  return (
    <button className="dg-icon-btn" onClick={estado === "activo" ? desactivar : activar}
      title={estado === "activo" ? "Notificaciones activadas en este teléfono (tocá para desactivar)" : "Activar notificaciones en este teléfono"}>
      {estado === "activo" ? <Bell size={17} style={{ color: "var(--dg-accent)" }} /> : <BellOff size={17} />}
    </button>
  );
}

function BotonCompartirSeguimiento({ pedido }) {
  const [copiado, setCopiado] = useState(false);
  const link = linkSeguimiento(pedido);

  async function compartir() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (e) {
      window.prompt("Copiá el link de seguimiento:", link);
    }
  }

  return (
    <button className="dg-btn-ghost dg-mini-btn" onClick={compartir} title="Copiar link para que el cliente vea el estado de su pedido">
      {copiado ? <><Check size={12} /> Copiado</> : <><ExternalLink size={12} /> Link de seguimiento</>}
    </button>
  );
}

function FlujoPedido({ pedido, canEdit = false, onVerificar, onClienteConfirmado, onEnvioConfirmado, onEntregar }) {
  const conEnvio = esPedidoConEnvio(pedido);
  const entregado = pedido.estado === "Entregado";
  const verificado = pedidoFueVerificado(pedido) || entregado;
  const listo = pedidoEstaListo(pedido);
  const clienteConfirmado = Boolean(pedido.clienteAvisado) || entregado;
  const envioConfirmado = !conEnvio || Boolean(pedido.envioConfirmado) || entregado;
  const confirmacionCompleta = clienteConfirmado && envioConfirmado;
  const waEntrega = listo && !entregado ? entregaWaLink(pedido) : null;
  const produccionCompletada = pasosProduccionCompletados(pedido);
  const proximoPasoProduccion = PRODUCCION_PASOS[produccionCompletada];
  const controlTaller = proximoControlTaller(pedido);
  const totalPasos = conEnvio ? 5 : 4;
  const pasoActual = entregado
    ? totalPasos - 1
    : !verificado
      ? 0
      : !listo
        ? 1
        : !confirmacionCompleta
          ? 2
          : totalPasos - 1;
  const [pasoVisible, setPasoVisible] = useState(pasoActual);

  useEffect(() => {
    setPasoVisible(pasoActual);
  }, [pedido.id, pasoActual]);

  if (pedido.estado === "Cancelado") {
    return <div className="dg-order-flow-cancelled"><XCircle size={14} /> Pedido cancelado · el flujo quedó detenido</div>;
  }

  const pasos = [
    <PasoPedido
      key="verificacion"
      numero={1}
      titulo={verificado ? "Pedido verificado" : "Verificar pedido"}
      detalle={verificado ? "Los datos fueron revisados y el pedido ya está habilitado para fábrica." : "Confirmá que medidas, modelo, funciones y entrega estén correctamente cargados."}
      estado={verificado ? "done" : "active"}
    >
      {canEdit && !verificado && onVerificar && (
        <button className="dg-step-action" onClick={() => onVerificar(pedido)}><CheckCircle2 size={13} /> Verificar pedido</button>
      )}
    </PasoPedido>,
    <PasoPedido
      key="produccion"
      numero={2}
      titulo={listo ? "Producción terminada" : verificado ? `Producción · ${controlTaller}` : "Esperando producción"}
      detalle={listo ? "Fábrica completó corte, armado y embalado." : verificado ? `Estado actual del taller: ${controlTaller || proximoPasoProduccion?.label || "producción"}.` : "Se habilita después de verificar el pedido."}
      estado={listo ? "done" : verificado ? "active" : "pending"}
    />,
    <PasoPedido
      key="confirmacion"
      numero={3}
      titulo={confirmacionCompleta ? (conEnvio ? "Cliente y envío confirmados" : "Retiro confirmado con el cliente") : conEnvio ? "Confirmación con el cliente" : "Coordinar retiro con el cliente"}
      detalle={!listo
        ? "Se habilita cuando fábrica marque el espejo como listo."
        : confirmacionCompleta
          ? conEnvio ? "El cliente confirmó los datos y el envío quedó coordinado." : "El cliente confirmó el retiro del espejo."
          : conEnvio ? "Confirmá primero los datos con el cliente y luego dejá asentado que el envío quedó coordinado." : "Avisale al cliente que el espejo está listo y confirmá el retiro."}
      estado={confirmacionCompleta ? "done" : listo ? "active" : "pending"}
    >
      {listo && !entregado && waEntrega && !clienteConfirmado && (
        <a className="dg-step-whatsapp" href={waEntrega} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> Abrir WhatsApp</a>
      )}
      {canEdit && listo && !entregado && !clienteConfirmado && onClienteConfirmado && (
        <button className="dg-step-action" onClick={() => onClienteConfirmado(pedido)}><Check size={13} /> Cliente confirmado</button>
      )}
      {clienteConfirmado && !entregado && <span className="dg-step-check"><CheckCircle2 size={12} /> Cliente confirmado</span>}
      {conEnvio && canEdit && listo && !entregado && !envioConfirmado && onEnvioConfirmado && (
        <button className="dg-step-action dg-step-action-primary" disabled={!clienteConfirmado} onClick={() => onEnvioConfirmado(pedido)}><Truck size={13} /> Envío confirmado</button>
      )}
      {conEnvio && envioConfirmado && !entregado && <span className="dg-step-check"><CheckCircle2 size={12} /> Envío confirmado</span>}
    </PasoPedido>,
  ];

  if (conEnvio) {
    pasos.push(
      <PasoPedido
        key="logistica"
        numero={4}
        titulo={envioConfirmado ? "Disponible para el fletero" : "Esperando confirmación de envío"}
        detalle={envioConfirmado ? "El pedido ya aparece en la lista de Logística para organizar la entrega." : listo ? "PostVenta debe confirmar el envío para habilitarlo en Logística." : "Se habilita después de producción y la coordinación con el cliente."}
        estado={envioConfirmado ? "done" : listo && clienteConfirmado ? "active" : "pending"}
      />,
      <PasoPedido
        key="entrega"
        numero={5}
        titulo={entregado ? "Entregado y archivado" : "Confirmar entrega y archivar"}
        detalle={entregado ? "El fletero confirmó la entrega y el pedido pasó al historial." : envioConfirmado ? "Queda pendiente la confirmación final de entrega." : "Se habilita cuando el envío esté confirmado."}
        estado={entregado ? "done" : confirmacionCompleta ? "active" : "pending"}
      >
        {canEdit && !entregado && confirmacionCompleta && onEntregar && (
          <button className="dg-step-action dg-step-action-finish" onClick={() => onEntregar(pedido)}><CheckCircle2 size={13} /> Confirmar entrega y archivar</button>
        )}
      </PasoPedido>,
    );
  } else {
    pasos.push(
      <PasoPedido
        key="entrega"
        numero={4}
        titulo={entregado ? "Entregado y archivado" : "Confirmar entrega y archivar"}
        detalle={entregado ? "El retiro fue confirmado y el pedido pasó al historial." : clienteConfirmado ? "Cuando el cliente retire el espejo, confirmá la entrega." : "Se habilita después de coordinar el retiro con el cliente."}
        estado={entregado ? "done" : clienteConfirmado ? "active" : "pending"}
      >
        {canEdit && !entregado && clienteConfirmado && onEntregar && (
          <button className="dg-step-action dg-step-action-finish" onClick={() => onEntregar(pedido)}><CheckCircle2 size={13} /> Confirmar entrega y archivar</button>
        )}
      </PasoPedido>,
    );
  }

  return (
    <div className={`dg-order-flow ${conEnvio ? "dg-order-flow-five" : "dg-order-flow-four"}`} onClick={(e) => e.stopPropagation()}>
      <div className="dg-order-flow-title-row">
        <div className="dg-order-flow-title">Proceso del pedido</div>
        <BotonCompartirSeguimiento pedido={pedido} />
      </div>
      <div className="dg-order-flow-nav">
        <div className="dg-order-flow-label">
          <span>{conEnvio ? "Envío" : "Retiro"}</span>
          <strong>Paso {pasoVisible + 1} de {totalPasos}</strong>
        </div>
        <div className="dg-order-flow-dots" aria-label="Pasos del pedido">
          {pasos.map((_, index) => {
            const completado = entregado ? index <= pasoActual : index < pasoActual;
            return (
              <button
                key={index}
                type="button"
                className={`dg-flow-dot${completado ? " dg-flow-dot-done" : ""}${index === pasoActual ? " dg-flow-dot-active" : ""}${index === pasoVisible ? " dg-flow-dot-selected" : ""}`}
                aria-label={`Ver paso ${index + 1}`}
                aria-current={index === pasoVisible ? "step" : undefined}
                onClick={() => setPasoVisible(index)}
              >
                {completado ? <Check size={10} /> : index + 1}
              </button>
            );
          })}
        </div>
        <div className="dg-order-flow-arrows">
          <button type="button" aria-label="Paso anterior" disabled={pasoVisible === 0} onClick={() => setPasoVisible((actual) => Math.max(0, actual - 1))}><ArrowLeft size={14} /></button>
          <button type="button" aria-label="Paso siguiente" disabled={pasoVisible === totalPasos - 1} onClick={() => setPasoVisible((actual) => Math.min(totalPasos - 1, actual + 1))}><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="dg-order-flow-slide" key={`${pedido.id}-${pasoVisible}`}>
        {pasos[pasoVisible]}
      </div>
    </div>
  );
}

// --- COMISIONES ---
// Base de cálculo: monto total del pedido MENOS el costo del envío.
function comisionBase(p) {
  return Math.max(0, (Number(p.monto) || 0) - (Number(p.costoEnvio) || 0));
}
// Un pedido da derecho a comisión cuando está totalmente cobrado (saldo $0),
// tiene vendedor asignado, no está cancelado y no fue excluido a mano.
function comisionElegible(p) {
  if (p.comisionExcluida) return false;
  if (p.estado === "Cancelado") return false;
  if (!p.vendedor || !String(p.vendedor).trim()) return false;
  if ((Number(p.monto) || 0) <= 0) return false;
  return pedidoSaldo(p) <= 0;
}
// Relaciona el nombre usado en Pedidos con la ficha de Sueldos (tolera "Dou" vs "Douglas").
function vendedorCoincideConEmpleado(nombreVendedor, empleado) {
  const vendedor = String(nombreVendedor || "").trim().toLowerCase();
  const nombre = String(empleado?.nombre || "").trim().toLowerCase();
  return !!vendedor && !!nombre && (nombre === vendedor || nombre.startsWith(vendedor) || vendedor.startsWith(nombre));
}
function porcentajeVendedor(nombre, empleados) {
  if (!nombre) return 0;
  const emp = (empleados || []).find((e) => vendedorCoincideConEmpleado(nombre, e));
  return emp ? Number(emp.comisionPct) || 0 : 0;
}
function comisionMonto(p, empleados) {
  return comisionBase(p) * (porcentajeVendedor(p.vendedor, empleados) / 100);
}

function resumenComisionesLiquidadas(pedidos, empleado, periodo) {
  const items = (pedidos || []).filter((pedido) => {
    const perteneceAlEmpleado = pedido?.comisionEmpleadoId === empleado?.id
      || vendedorCoincideConEmpleado(pedido?.vendedor, empleado);
    if (!pedido?.comisionPagada || !perteneceAlEmpleado) return false;
    const fechaLiquidacion = String(pedido.comisionFechaPago || pedido.fecha || "");
    return fechaLiquidacion.startsWith(periodo);
  });
  const semanas = Object.fromEntries(SEMANAS.map((numero) => [numero, { cantidad: 0, total: 0 }]));
  items.forEach((pedido) => {
    const fechaLiquidacion = String(pedido.comisionFechaPago || pedido.fecha || "");
    const dia = Number(fechaLiquidacion.slice(8, 10)) || 1;
    const numero = Math.min(5, Math.max(1, Math.ceil(dia / 7)));
    semanas[numero].cantidad += 1;
    semanas[numero].total += Number(pedido.comisionLiquidadaMonto) || 0;
  });
  return {
    cantidad: items.length,
    total: items.reduce((suma, pedido) => suma + (Number(pedido.comisionLiquidadaMonto) || 0), 0),
    semanas,
  };
}

// Campos que no pueden faltar al pasar un pedido. Devuelve { campo: "motivo" }
function validarPedido(p) {
  const errores = {};
  const falta = (v) => v === undefined || v === null || String(v).trim() === "";
  if (falta(p.cliente)) errores.cliente = "Falta el nombre del cliente";
  if (falta(p.celular)) errores.celular = "Falta el celular de contacto";
  if (falta(p.vendedor)) errores.vendedor = "Falta indicar quién vendió";
  if (falta(p.ancho) || Number(p.ancho) <= 0) errores.ancho = "Falta el ancho";
  if (falta(p.alto) || Number(p.alto) <= 0) errores.alto = "Falta el alto";
  if (falta(p.cant) || Number(p.cant) <= 0) errores.cant = "Falta la cantidad";
  if (falta(p.monto) || Number(p.monto) <= 0) errores.monto = "Falta el monto de la venta";
  if (falta(p.anticipo)) errores.anticipo = "Poné el anticipo (0 si no dejó nada)";
  if (Number(p.anticipo) > Number(p.monto)) errores.anticipo = "El anticipo no puede ser mayor al monto";
  if (falta(p.metodo) || p.metodo === "A confirmar") errores.metodo = "Confirmá el método de entrega";
  if (["Envío", "Envío flex", "Interior", "Colocación"].includes(p.metodo) && falta(p.detalleEntrega)) {
    errores.detalleEntrega = "Con envío hace falta la dirección";
  }
  if (falta(p.tipoFactura) || p.tipoFactura === "No aplica") errores.tipoFactura = "Definí el tipo de factura";
  return errores;
}

function PedidosPage({ pedidos, onChange, vendedores, canEditFull, puedeBorrar = true, sessionSectorId, incomes, onCreateIncome, onRegistrar, kommoSubdominio, stockEspejos, onChangeStockEspejos }) {
  const [quickView, setQuickView] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroVendedor, setFiltroVendedor] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [openPedido, setOpenPedido] = useState(null);
  const [creating, setCreating] = useState(false);
  const [verificando, setVerificando] = useState(null);
  const [nextDraft, setNextDraft] = useState(null);
  const [agrupado, setAgrupado] = useState("mes");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const canEditEstadoOnly = !canEditFull && ["fabrica", "logistica", "postventa"].includes(sessionSectorId);

  let visibles = pedidos.slice();
  if (quickView === "historial") visibles = visibles.filter((p) => p.estado === "Entregado" || p.estado === "Cancelado");
  else if (quickView === "verificados") visibles = visibles.filter((p) => p.estado === "Verificado" || p.estado === "Pasado a fábrica");
  else if (quickView === "facturar") visibles = visibles.filter((p) => !p.facturado);
  else if (quickView === "envios") visibles = visibles.filter((p) => METODOS_ENVIO_GENERAL.includes(p.metodo) && p.estado !== "Entregado");
  else if (quickView === "retiros") visibles = visibles.filter((p) => p.metodo === "Retira" && p.estado !== "Entregado");
  else visibles = visibles
    .filter((p) => p.estado !== "Entregado" && p.estado !== "Cancelado" && p.estado !== "Despachado")
    .filter((p) => filtroEstado === "todos" || p.estado === filtroEstado || (filtroEstado === "Verificado" && p.estado === "Pasado a fábrica"));

  visibles = visibles
    .filter((p) => !fechaDesde || (p.fecha && p.fecha >= fechaDesde))
    .filter((p) => !fechaHasta || (p.fecha && p.fecha <= fechaHasta))
    .filter((p) => filtroVendedor === "todos" || p.vendedor === filtroVendedor)
    .filter((p) => !busqueda.trim() || String(p.cliente || "").toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (!a.listo && !b.listo) return (b.orden || 0) - (a.orden || 0);
      if (!a.listo) return 1;
      if (!b.listo) return -1;
      return a.listo < b.listo ? -1 : a.listo > b.listo ? 1 : 0;
    });

  // Si un espejo del pedido coincide con los filtros, la tarjeta conserva
  // todos los espejos de ese mismo número de orden para no partir el pedido.
  const gruposCoincidentes = new Set(visibles.map(pedidoGroupKey));
  visibles = pedidos
    .filter((pedido) => gruposCoincidentes.has(pedidoGroupKey(pedido)))
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));
  const pedidosAgrupadosVisibles = agruparEspejosPorPedido(visibles)
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));

  const totalVisible = visibles.reduce((a, p) => a + (Number(p.monto) || 0), 0);
  const restaurablesVisibles = visibles.filter((p) => p.estado === "Entregado" || p.estado === "Cancelado");
  const cantidadPedidosVisibles = pedidosAgrupadosVisibles.length;
  const cantidadPedidosRestaurables = new Set(restaurablesVisibles.map(pedidoGroupKey)).size;

  function nextOrden() { return pedidos.reduce((m, p) => Math.max(m, p.orden || 0), 0) + 1; }

  function savePedido(pedido, opts) {
    pedido = normalizarPedidoFunciones(pedido);
    const exists = pedidos.some((p) => p.id === pedido.id);
    const previous = pedidos.find((p) => p.id === pedido.id);
    const ordenDelGrupo = pedido.grupoId
      ? pedidos
        .filter((p) => p.grupoId === pedido.grupoId && Number(p.orden) > 0)
        .reduce((menor, p) => menor === null || Number(p.orden) < menor ? Number(p.orden) : menor, null)
      : null;
    let withOrden = { ...pedido, orden: ordenDelGrupo || pedido.orden || nextOrden() };
    if (!withOrden.grupoId) withOrden = { ...withOrden, grupoId: withOrden.id };
    if (previous?.estado === "Sin pasar a fábrica" && pedidoFueVerificado(withOrden)) {
      withOrden = { ...withOrden, pedidoVerificadoFecha: withOrden.pedidoVerificadoFecha || new Date().toISOString() };
    }
    if (withOrden.estado === "Espejo listo" && previous && previous.estado !== "Espejo listo" && previous.estado !== "Entregado") {
      withOrden = { ...withOrden, clienteAvisado: false, clienteAvisadoFecha: "", envioConfirmado: false, envioConfirmadoFecha: "", produccionListaFecha: new Date().toISOString() };
    }
    if (withOrden.estado === "Entregado") {
      if (previous?.estado !== "Espejo listo" && previous?.estado !== "Entregado") {
        window.alert("Antes de entregarlo, el taller debe guardar el pedido como “Espejo listo”.");
        return;
      }
      if (!withOrden.clienteAvisado) {
        window.alert("Antes de archivar el pedido, marcá que el cliente ya fue avisado de que el espejo está listo.");
        return;
      }
      if (esPedidoConEnvio(withOrden) && !withOrden.envioConfirmado) {
        window.alert("Antes de archivar un pedido con envío, PostVenta debe confirmar que el envío quedó coordinado.");
        return;
      }
      if (previous?.estado !== "Entregado") withOrden = { ...withOrden, entregadoFecha: new Date().toISOString() };
    }

    // Cuánto plata entró realmente por este pedido:
    // si ya se entregó, se cobró todo; si no, solo el anticipo.
    const cobradoAhora = withOrden.estado === "Entregado"
      ? Number(withOrden.monto) || 0
      : Number(withOrden.anticipo) || 0;
    const yaRegistrado = Number(withOrden.montoRegistrado) || 0;
    const delta = cobradoAhora - yaRegistrado;

    let toSave = withOrden;
    if (delta !== 0 && onCreateIncome) {
      const cuenta = determineCuentaPedido(withOrden);
      const esAjuste = delta < 0;
      const esSaldo = yaRegistrado > 0 && delta > 0;
      const etiqueta = esAjuste ? "Ajuste" : esSaldo ? "Saldo" : "Anticipo";
      onCreateIncome({
        id: uid(),
        concepto: `${etiqueta} pedido #${withOrden.orden || "?"} — ${withOrden.cliente || "Sin nombre"}`,
        monto: delta,
        canal: withOrden.tipo === "Importado" ? "local_importados" : "local_nuestros",
        cuenta, cliente: withOrden.cliente || "",
        metodo: cuenta === "caja_efectivo" ? "efectivo_nuestro" : "mercado_pago",
        sectorId: "ventas", fecha: new Date().toISOString().slice(0, 10), estado: "pagado",
      });
      toSave = { ...withOrden, montoRegistrado: cobradoAhora };
    }
    const pedidosActualizados = exists ? pedidos.map((p) => (p.id === pedido.id ? toSave : p)) : [...pedidos, toSave];
    onChange(normalizarOrdenesPorGrupo(pedidosActualizados));
    if (onRegistrar) onRegistrar(exists ? "Editó un pedido" : "Cargó un pedido", `#${toSave.orden} — ${toSave.cliente} — ${money(toSave.monto)}`);

    if (!exists && toSave.stockEspejoId && stockEspejos && onChangeStockEspejos) {
      const cantidadUsada = Number(toSave.cant) || 1;
      onChangeStockEspejos(stockEspejos.map((s) => (s.id === toSave.stockEspejoId ? { ...s, cantidad: Math.max(0, Number(s.cantidad || 0) - cantidadUsada) } : s)));
    }

    if (opts?.addAnother) {
      setOpenPedido(null);
      setCreating(false);
      setTimeout(() => {
        setNextDraft(emptyPedido({
          orden: toSave.orden, grupoId: toSave.grupoId, cliente: toSave.cliente, celular: toSave.celular, dniCuit: toSave.dniCuit,
          vendedor: toSave.vendedor, tipoFactura: toSave.tipoFactura, metodo: toSave.metodo, detalleEntrega: toSave.detalleEntrega,
        }));
      }, 0);
    } else {
      setOpenPedido(null); setCreating(false);
    }
  }
  function marcarEntregado(p) {
    if (p.estado !== "Espejo listo") {
      window.alert("Primero el taller debe marcar el espejo como listo.");
      return;
    }
    if (!p.clienteAvisado) {
      window.alert("Antes de entregarlo, confirmá que el cliente ya fue avisado.");
      return;
    }
    if (esPedidoConEnvio(p) && !p.envioConfirmado) {
      window.alert("Antes de entregarlo, confirmá el envío para habilitarlo en la lista del fletero.");
      return;
    }
    const saldo = pedidoSaldo(p);
    if (saldo > 0 && !window.confirm(`Este pedido todavía tiene ${money(saldo)} de saldo pendiente.\n\nAl marcarlo entregado se va a registrar ese saldo como ingreso cobrado. ¿Confirmás?`)) return;
    savePedido({ ...p, estado: "Entregado" });
    if (onRegistrar) onRegistrar("Marcó entregado", `#${p.orden} — ${p.cliente}`);
  }
  function marcarVerificado(p) {
    if (p.estado !== "Sin pasar a fábrica") return;
    const estadoInicialFabrica = pedidoProcesoTaller(p) === "biselados" ? "Sin pedir" : "Verificado";
    onChange(pedidos.map((x) => (x.id === p.id ? { ...x, estado: estadoInicialFabrica, pedidoVerificadoFecha: new Date().toISOString() } : x)));
    if (onRegistrar) onRegistrar("Verificó un pedido", `#${p.orden} — ${p.cliente} — habilitado para fábrica`);
  }
  function facturarGrupo(espejosDelGrupo) {
    const idsGrupo = new Set(espejosDelGrupo.map((e) => e.id));
    onChange(pedidos.map((x) => (idsGrupo.has(x.id) ? { ...x, facturado: true } : x)));
    const primero = espejosDelGrupo[0];
    if (onRegistrar && primero) onRegistrar("Facturó un pedido completo", `#${primero.orden} — ${primero.cliente} — ${espejosDelGrupo.length} espejo(s)`);
  }

  // --- Acciones sobre TODO el pedido: todos los espejos del grupo de una sola vez ---
  function avisarClienteGrupo(espejos) {
    const elegibles = espejos.filter((e) => pedidoEstaListo(e) && !e.clienteAvisado && e.estado !== "Entregado");
    if (!elegibles.length) return;
    const ids = new Set(elegibles.map((e) => e.id));
    const fecha = new Date().toISOString();
    onChange(pedidos.map((x) => (ids.has(x.id) ? { ...x, clienteAvisado: true, clienteAvisadoFecha: fecha } : x)));
    if (onRegistrar) onRegistrar("Avisó al cliente", `#${espejos[0].orden} — ${espejos[0].cliente} — ${elegibles.length} espejo(s)`);
  }
  function confirmarEnvioGrupo(espejos) {
    const elegibles = espejos.filter((e) => pedidoEstaListo(e) && e.clienteAvisado && !e.envioConfirmado && e.estado !== "Entregado");
    if (!elegibles.length) return;
    const ids = new Set(elegibles.map((e) => e.id));
    const fecha = new Date().toISOString();
    onChange(pedidos.map((x) => (ids.has(x.id) ? { ...x, envioConfirmado: true, envioConfirmadoFecha: fecha } : x)));
    if (onRegistrar) onRegistrar("Confirmó un envío", `#${espejos[0].orden} — ${espejos[0].cliente} — ${elegibles.length} espejo(s)`);
  }
  function entregarGrupo(espejos) {
    const pendientes = espejos.filter((e) => e.estado === "Espejo listo");
    if (!pendientes.length) return;
    if (pendientes.some((e) => !e.clienteAvisado)) { window.alert("Antes de entregar, avisá al cliente que el pedido está listo."); return; }
    if (pendientes.some((e) => esPedidoConEnvio(e) && !e.envioConfirmado)) { window.alert("Antes de entregar, confirmá el envío del pedido."); return; }
    const saldoTotal = pendientes.reduce((t, e) => t + Math.max(0, (Number(e.monto) || 0) - (Number(e.montoRegistrado) || 0)), 0);
    const cuantos = pendientes.length;
    const msg = saldoTotal > 0
      ? `El pedido tiene ${money(saldoTotal)} de saldo pendiente en total.\n\nAl marcarlo entregado se registra ese saldo como ingreso cobrado.\n\n¿Confirmás la entrega de los ${cuantos} espejo(s)?`
      : `¿Confirmás la entrega de los ${cuantos} espejo(s) de este pedido?`;
    if (!window.confirm(msg)) return;
    const ingresos = [];
    pendientes.forEach((e) => {
      const delta = (Number(e.monto) || 0) - (Number(e.montoRegistrado) || 0);
      if (delta !== 0) {
        const cuenta = determineCuentaPedido(e);
        ingresos.push({
          id: uid(),
          concepto: `${(Number(e.montoRegistrado) || 0) > 0 ? "Saldo" : "Anticipo"} pedido #${e.orden || "?"} — ${e.cliente || "Sin nombre"}`,
          monto: delta,
          canal: e.tipo === "Importado" ? "local_importados" : "local_nuestros",
          cuenta, cliente: e.cliente || "",
          metodo: cuenta === "caja_efectivo" ? "efectivo_nuestro" : "mercado_pago",
          sectorId: "ventas", fecha: new Date().toISOString().slice(0, 10), estado: "pagado",
        });
      }
    });
    if (ingresos.length && onCreateIncome) onCreateIncome(ingresos);
    const ids = new Set(pendientes.map((e) => e.id));
    const ahora = new Date().toISOString();
    onChange(normalizarOrdenesPorGrupo(pedidos.map((x) => (ids.has(x.id)
      ? { ...x, estado: "Entregado", entregadoFecha: ahora, montoRegistrado: Number(x.monto) || 0 }
      : x))));
    if (onRegistrar) onRegistrar("Marcó entregado", `#${espejos[0].orden} — ${espejos[0].cliente} — ${cuantos} espejo(s)`);
  }
  function reabrir(p) {
    onChange(pedidos.map((x) => (x.id === p.id ? { ...x, estado: "Espejo listo", entregadoFecha: "" } : x)));
    if (onRegistrar) onRegistrar("Reabrió un pedido", `#${p.orden} — ${p.cliente}`);
  }
  // Abre la verificacion del primer espejo sin verificar del pedido.
  // Al confirmar cada uno, el modal salta solo al siguiente (ver abajo).
  function verificarPrimeroDelGrupo(espejos) {
    const primero = espejos.find((e) => e.estado === "Sin pasar a fábrica");
    if (primero) setVerificando(primero);
  }
  function removePedido(id) {
    const p = pedidos.find((x) => x.id === id);
    onChange(pedidos.filter((x) => x.id !== id));
    if (onRegistrar && p) onRegistrar("Borró un pedido", `#${p.orden} — ${p.cliente} — ${money(p.monto)}`);
    setOpenPedido(null);
  }
  function marcarClienteAvisado(p) {
    if (!pedidoEstaListo(p)) {
      window.alert("La confirmación con el cliente se habilita cuando fábrica marque el espejo como listo.");
      return;
    }
    const fechaAviso = new Date().toISOString();
    onChange(pedidos.map((x) => (x.id === p.id ? { ...x, clienteAvisado: true, clienteAvisadoFecha: fechaAviso } : x)));
    if (onRegistrar) onRegistrar("Avisó al cliente", `#${p.orden} — ${p.cliente} — espejo listo`);
  }
  function marcarEnvioConfirmado(p) {
    if (!pedidoEstaListo(p) || !p.clienteAvisado) {
      window.alert("Primero confirmá con el cliente que los datos del envío sean correctos.");
      return;
    }
    onChange(pedidos.map((x) => (x.id === p.id ? { ...x, envioConfirmado: true, envioConfirmadoFecha: new Date().toISOString() } : x)));
    if (onRegistrar) onRegistrar("Confirmó un envío", `#${p.orden} — ${p.cliente} — visible para Logística`);
  }
  function restaurarVisibles() {
    if (restaurablesVisibles.length === 0) return;
    if (!window.confirm(`Se van a restaurar ${cantidadPedidosRestaurables} pedido(s), con ${totalUnidades(restaurablesVisibles)} espejo(s).\n\nLos entregados volverán a “Espejo listo” y los cancelados a “Sin pasar a fábrica”. ¿Continuar?`)) return;
    const ids = new Set(restaurablesVisibles.map((p) => p.id));
    onChange(pedidos.map((p) => {
      if (!ids.has(p.id)) return p;
      if (p.estado === "Entregado") return { ...p, estado: "Espejo listo", entregadoFecha: "" };
      return { ...p, estado: "Sin pasar a fábrica", clienteAvisado: false, clienteAvisadoFecha: "" };
    }));
    if (onRegistrar) onRegistrar("Restauró pedidos en masa", `${cantidadPedidosRestaurables} pedido(s) · ${totalUnidades(restaurablesVisibles)} espejo(s)`);
  }
  function borrarVisibles() {
    if (visibles.length === 0) return;
    if (!window.confirm(`Vas a borrar definitivamente ${cantidadPedidosVisibles} pedido(s), que contienen ${totalUnidades(visibles)} espejo(s).\n\nEsta acción no se puede deshacer. ¿Confirmás?`)) return;
    const ids = new Set(visibles.map((p) => p.id));
    onChange(pedidos.filter((p) => !ids.has(p.id)));
    if (onRegistrar) onRegistrar("Borró pedidos en masa", `${cantidadPedidosVisibles} pedido(s) · ${totalUnidades(visibles)} espejo(s)`);
  }

  const activeViewLabel = QUICK_VIEWS.find((v) => v.id === quickView)?.label || "Todos";
  const VISTAS_PRINCIPALES = ["todos", "historial", "retiros", "envios", "interior"];
  const vistasSecundarias = QUICK_VIEWS.filter((v) => !VISTAS_PRINCIPALES.includes(v.id));
  const enSecundaria = vistasSecundarias.some((v) => v.id === quickView);

  return (
    <div className="dg-page">
      <div className="dg-quickviews">
        {QUICK_VIEWS.filter((v) => VISTAS_PRINCIPALES.includes(v.id)).map((v) => (
          <button key={v.id} className={`dg-quickview-btn ${quickView === v.id ? "dg-quickview-on" : ""}`} onClick={() => setQuickView(v.id)}>{v.label}</button>
        ))}
        <select className={`dg-quickview-mas ${enSecundaria ? "dg-quickview-mas-on" : ""}`} value={enSecundaria ? quickView : ""} onChange={(e) => e.target.value && setQuickView(e.target.value)}>
          <option value="">Más filtros…</option>
          {vistasSecundarias.map((v) => (<option key={v.id} value={v.id}>{v.label}</option>))}
        </select>
      </div>


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

      <details className="dg-order-tools-details">
        <summary>
          <span><CalendarDays size={14} /> Fechas y acciones masivas</span>
          <small>{fechaDesde || fechaHasta ? "Filtro de fecha activo" : `${cantidadPedidosVisibles} pedidos · ${totalUnidades(visibles)} espejos`}</small>
        </summary>
        <div className="dg-order-tools-content">
          <div className="dg-date-filter-bar">
            <span><CalendarDays size={14} /> Fecha del pedido</span>
            <label>Desde<input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} /></label>
            <label>Hasta<input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} /></label>
            {(fechaDesde || fechaHasta) && <button className="dg-btn-ghost dg-mini-btn" onClick={() => { setFechaDesde(""); setFechaHasta(""); }}><X size={13} /> Limpiar fechas</button>}
          </div>

          {canEditFull && puedeBorrar && (
            <div className="dg-bulk-bar">
              <div>
                <strong>Acciones masivas</strong>
                <span>Se aplican a {cantidadPedidosVisibles} pedidos completos ({totalUnidades(visibles)} espejos).</span>
              </div>
              <div className="dg-bulk-actions">
                <button className="dg-btn-ghost" disabled={restaurablesVisibles.length === 0} onClick={restaurarVisibles}><RotateCcw size={14} /> Restaurar pedidos ({cantidadPedidosRestaurables})</button>
                <button className="dg-btn-danger" disabled={visibles.length === 0} onClick={borrarVisibles}><Trash2 size={14} /> Borrar pedidos ({cantidadPedidosVisibles})</button>
              </div>
            </div>
          )}
        </div>
      </details>

      {(() => {
        const renderCard = (grupo) => {
          const { principal: p, espejos } = grupo;
          const cantidadEspejos = totalUnidades(espejos);
          const cantidadListos = totalUnidades(espejos.filter((espejo) => espejo.estado === "Espejo listo"));
          const grupoTieneListos = cantidadListos > 0;
          const grupoCompletamenteListo = cantidadEspejos > 0 && cantidadListos === cantidadEspejos;
          const saldo = espejos.reduce((total, espejo) => total + Math.max(0, pedidoSaldo(espejo)), 0);
          const metodos = [...new Set(espejos.map((espejo) => espejo.metodo || "A confirmar"))];
          const metodoLabel = metodos.length === 1 ? metodos[0] : "Entrega mixta";
          const MetodoIcon = metodos.length === 1 ? (METODO_ICONS[metodoLabel] || Package) : Package;
          const pasos = espejos.map(resumenPasoPedido);
          const paso = pasos.reduce((anterior, actual) => {
            if (!anterior) return actual;
            return (actual.numero / actual.total) < (anterior.numero / anterior.total) ? actual : anterior;
          }, null);
          const todosFacturados = espejos.every((e) => e.facturado);
          return (
            <details
              className={`dg-pedido-card dg-order-card dg-order-disclosure dg-order-group-card ${grupoTieneListos ? "dg-order-group-con-listos" : ""} ${grupoCompletamenteListo ? "dg-order-group-listo" : ""}`}
              key={grupo.key}
            >
              <summary className="dg-order-compact" aria-label={`Abrir pedido de ${p.cliente || "cliente sin nombre"}`}>
                <span className="dg-order-compact-item dg-order-compact-client">
                  <small>Nombre</small>
                  <strong><i>#{p.orden}</i> {p.cliente || "Sin nombre"}</strong>
                </span>
                <span className="dg-order-compact-item dg-order-compact-measure">
                  <small>{cantidadEspejos === 1 ? "Medida" : "Espejos"}</small>
                  <strong>{cantidadEspejos === 1 ? `${p.ancho}×${p.alto} cm` : `${cantidadEspejos} espejos`}</strong>
                </span>
                <span className="dg-order-compact-item dg-order-compact-method">
                  <small>Método</small>
                  <strong><MetodoIcon size={12} /> {metodoLabel}</strong>
                </span>
                <span className="dg-order-compact-item dg-order-compact-step">
                  <small className={grupoTieneListos ? "dg-order-ready-label" : ""}>
                    {grupoCompletamenteListo ? "✓ Pedido listo" : grupoTieneListos ? `✓ ${cantidadListos}/${cantidadEspejos} listos` : "Paso"}
                  </small>
                  <strong>{paso?.numero}/{paso?.total} · {paso?.label}</strong>
                </span>
                {canEditFull && (
                  <button
                    type="button"
                    className={`dg-order-compact-facturar ${todosFacturados ? "dg-order-compact-facturado" : ""}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!todosFacturados) facturarGrupo(espejos); }}
                    title={todosFacturados ? "Pedido completo facturado" : "Marcar todo el pedido como facturado (una sola factura)"}
                  >
                    {todosFacturados ? <CheckCircle2 size={13} /> : <FileText size={13} />} {todosFacturados ? "Facturado" : "Facturar todo"}
                  </button>
                )}
                <span className={`dg-order-compact-item dg-order-compact-balance ${saldo > 0 ? "dg-order-balance-pending" : "dg-order-balance-paid"}`}>
                  <small>Saldo restante</small>
                  <strong>{saldo > 0 ? money(saldo) : "Saldado"}</strong>
                </span>
                <ChevronRight size={17} className="dg-order-disclosure-chevron" />
              </summary>

              <div className="dg-order-expanded">
                {canEditFull && (() => {
                  const activos = espejos.filter((e) => e.estado !== "Entregado" && e.estado !== "Cancelado");
                  if (activos.length === 0) return null;
                  const nEsp = activos.length;
                  const unico = nEsp === 1;
                  const sinVerificar = activos.filter((e) => e.estado === "Sin pasar a fábrica");
                  const listos = activos.filter((e) => e.estado === "Espejo listo");
                  const enFabrica = activos.filter((e) => e.estado !== "Sin pasar a fábrica" && e.estado !== "Espejo listo");
                  const conEnvio = activos.some((e) => esPedidoConEnvio(e));
                  const faltaAviso = listos.filter((e) => !e.clienteAvisado);
                  const faltaEnvio = listos.filter((e) => e.clienteAvisado && esPedidoConEnvio(e) && !e.envioConfirmado);
                  const paraEntregar = activos.filter((e) => e.estado === "Espejo listo" && e.clienteAvisado && (!esPedidoConEnvio(e) || e.envioConfirmado));
                  return (
                    <div className="dg-order-group-flow" onClick={(ev) => ev.stopPropagation()}>
                      <span className="dg-order-group-flow-label">{unico ? "Este pedido" : `Todo el pedido · ${nEsp} espejos`}</span>
                      {sinVerificar.length > 0 && (
                        <button className="dg-btn-primary dg-mini-btn" onClick={() => verificarPrimeroDelGrupo(espejos)}>
                          <CheckCircle2 size={13} /> {unico ? "Verificar y pasar a fábrica" : `Verificar y pasar a fábrica (${sinVerificar.length})`}
                        </button>
                      )}
                      {sinVerificar.length === 0 && enFabrica.length > 0 && (
                        <span className="dg-order-group-flow-wait">Fábrica está trabajando · {listos.length}/{nEsp} listos</span>
                      )}
                      {faltaAviso.length > 0 && (
                        <button className="dg-btn-primary dg-mini-btn" onClick={() => avisarClienteGrupo(espejos)}>
                          <MessageCircle size={13} /> {unico ? "Cliente avisado" : `Cliente avisado (${faltaAviso.length})`}
                        </button>
                      )}
                      {conEnvio && faltaAviso.length === 0 && faltaEnvio.length > 0 && (
                        <button className="dg-btn-primary dg-mini-btn" onClick={() => confirmarEnvioGrupo(espejos)}>
                          <Truck size={13} /> {unico ? "Envío confirmado" : `Envío confirmado (${faltaEnvio.length})`}
                        </button>
                      )}
                      {paraEntregar.length > 0 && (
                        <button className="dg-btn-primary dg-mini-btn dg-order-group-flow-entregar" onClick={() => entregarGrupo(espejos)}>
                          <CheckCircle2 size={13} /> {unico ? "Entregar y archivar" : `Entregar los ${paraEntregar.length} espejos`}
                        </button>
                      )}
                    </div>
                  );
                })()}
                <div className="dg-order-mirror-list">
                  {espejos.map((espejo, index) => {
                    const espejoSaldo = Math.max(0, pedidoSaldo(espejo));
                    const espejoStage = ESTADO_STAGE[espejo.estado] || { stage: espejo.estado, color: "var(--dg-text-dim)" };
                    const funciones = funcionesPedido(espejo, true);
                    const espejoListo = pedidoEstaListo(espejo) && espejo.estado !== "Entregado";
                    return (
                      <details className={`dg-order-mirror ${espejoListo ? "dg-order-mirror-listo" : ""}`} key={espejo.id}>
                        <summary>
                          <span className="dg-order-mirror-index">Espejo {index + 1}</span>
                          <span className="dg-order-mirror-main">
                            <strong>{espejo.ancho}×{espejo.alto} cm</strong>
                            <small>{espejo.forma} · {espejo.tipo || "Simple"}</small>
                          </span>
                          <span className="dg-order-mirror-state" style={{ "--mirror-color": espejoStage.color }}>{espejoStage.stage}</span>
                          <span className={`dg-order-mirror-balance ${espejoSaldo > 0 ? "dg-order-balance-pending" : "dg-order-balance-paid"}`}>{espejoSaldo > 0 ? money(espejoSaldo) : "Saldado"}</span>
                          <ChevronRight size={16} />
                        </summary>
                        <div className="dg-order-mirror-body">
                          <div className="dg-order-mirror-meta">
                            <span className={`dg-order-mirror-invoice ${espejo.facturado ? "dg-order-mirror-invoice-on" : "dg-order-mirror-invoice-off"}`}>
                              {espejo.facturado ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {espejo.facturado ? "Facturado" : "Sin facturar"}
                            </span>
                            <div className="dg-order-mirror-functions">
                              {funciones.length > 0
                                ? funciones.map((funcion) => <span key={funcion.label}>{funcion.label}</span>)
                                : <small>Sin funciones extra</small>}
                            </div>
                            {comisionElegible(espejo) && !espejo.comisionPagada && <span className="dg-order-mirror-commission"><CircleDollarSign size={12} /> Comisión a liquidar</span>}
                          </div>
                          <FichaEspejoPaso pedido={espejo} />
                          <FlujoPedido
                            pedido={espejo}
                            canEdit={canEditFull}
                            onVerificar={(p) => setVerificando(p)}
                            onClienteConfirmado={marcarClienteAvisado}
                            onEnvioConfirmado={marcarEnvioConfirmado}
                            onEntregar={marcarEntregado}
                          />
                          <div className="dg-order-detail-actions">
                            <button className="dg-btn-ghost dg-mini-btn" onClick={() => setOpenPedido(espejo)}>
                              <Pencil size={13} /> {canEditFull ? "Ver o editar este espejo" : "Ver este espejo"}
                            </button>
                            {espejo.estado === "Entregado" && canEditFull && (
                              <button className="dg-btn-ghost dg-mini-btn" onClick={() => reabrir(espejo)}>
                                <RotateCcw size={13} /> Reabrir espejo
                              </button>
                            )}
                          </div>
                          {pedidoEstaListo(espejo) && !espejo.celular && !espejo.clienteAvisado && (
                            <p className="dg-hint dg-order-expanded-hint">Sin celular cargado: avisale por otro medio y después confirmá el aviso.</p>
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            </details>
          );
        };
        const grupos = agrupado === "semana" ? groupByWeek(pedidosAgrupadosVisibles, "fecha") : groupByMonth(pedidosAgrupadosVisibles, "fecha");
        return (
          <>
            {pedidosAgrupadosVisibles.length === 0 && <div className="dg-empty">No hay pedidos en esta vista.</div>}
            {pedidosAgrupadosVisibles.length > 0 && <MonthAccordion groups={grupos} renderItem={renderCard} />}
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
          onDelete={openPedido && puedeBorrar ? () => removePedido(openPedido.id) : null}
          stockEspejos={stockEspejos}
          esNuevo={!openPedido}
        />
      )}

      <div className="dg-print-area dg-print-pedidos">
        <div className="dg-print-head">
          <div className="dg-print-brand">DECOGLASS</div>
          <div className="dg-print-sub">
            {activeViewLabel}{filtroVendedor !== "todos" ? ` · Vendedor: ${filtroVendedor}` : ""} — {new Date().toLocaleDateString("es-AR")} · {cantidadPedidosVisibles} pedido(s) · {totalUnidades(visibles)} espejo(s)
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
        <div className="dg-print-total">Total: {money(totalVisible)}</div>
      </div>

      {verificando && (
        <VerificacionModal
          pedido={verificando}
          kommoSubdominio={kommoSubdominio}
          onClose={() => setVerificando(null)}
          onConfirmar={() => {
            marcarVerificado(verificando);
            const gk = verificando.grupoId || verificando.id;
            const siguiente = pedidos.find((x) => (x.grupoId || x.id) === gk && x.id !== verificando.id && x.estado === "Sin pasar a fábrica");
            setVerificando(siguiente || null);
          }}
          onEditarCantidadDesemp={(cantidad) => {
            onChange(pedidos.map((x) => (x.id === verificando.id ? { ...x, desempCantidad: cantidad } : x)));
            setVerificando((v) => (v ? { ...v, desempCantidad: cantidad } : v));
          }}
        />
      )}
    </div>
  );
}

// Hace que Enter salte al siguiente campo del formulario, y en el último dispare onSubmit.
// Además enfoca automáticamente el primer campo vacío al abrirse.
function EnterFlow({ children, onSubmit, autoFocus = true, className }) {
  const ref = useRef(null);

  function campos() {
    if (!ref.current) return [];
    return Array.from(ref.current.querySelectorAll("input, select, textarea"))
      .filter((el) => !el.disabled && el.type !== "hidden" && el.offsetParent !== null);
  }

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => {
      const els = campos();
      const target = els.find((el) => !el.value) || els[0];
      if (target) { try { target.focus(); if (target.select) target.select(); } catch (e) {} }
    }, 60);
    return () => clearTimeout(t);
  }, []);

  function handleKeyDown(e) {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (e.target.tagName === "TEXTAREA") return;

    // En los desplegables: el primer Enter abre la lista, el segundo confirma y avanza.
    if (e.target.tagName === "SELECT") {
      if (!e.target.dataset.dgOpen) {
        e.preventDefault();
        e.target.dataset.dgOpen = "1";
        try {
          if (typeof e.target.showPicker === "function") e.target.showPicker();
          else e.target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        } catch (err) { /* si el navegador no lo permite, el usuario usa las flechas igual */ }
        return;
      }
      delete e.target.dataset.dgOpen;
    }

    const els = campos();
    const i = els.indexOf(e.target);
    if (i === -1) return;
    e.preventDefault();
    if (i < els.length - 1) {
      const next = els[i + 1];
      next.focus();
      if (next.select) try { next.select(); } catch (err) {}
    } else if (onSubmit) {
      onSubmit();
    }
  }

  function handleBlur(e) {
    if (e.target.tagName === "SELECT") delete e.target.dataset.dgOpen;
  }

  return <div ref={ref} onKeyDown={handleKeyDown} onBlur={handleBlur} className={className}>{children}</div>;
}

function Field({ label, computed, error, children }) {
  return (
    <div className={`dg-field ${computed ? "dg-field-computed" : ""} ${error ? "dg-field-error" : ""}`}>
      <label>{label}{error ? " *" : ""}</label>
      {children}
      {error && <span className="dg-field-error-msg">{error}</span>}
    </div>
  );
}

async function leerNumeroGuiaDeImagen(archivo) {
  const Tesseract = (await import("tesseract.js")).default;
  const resultado = await Tesseract.recognize(archivo, "spa");
  const texto = resultado?.data?.text || "";
  // Primero busca el número justo al lado de la palabra "GUIA" (más confiable).
  const conEtiqueta = texto.match(/GU[IÍ1]A\s*N?[°oO0]?\.?\s*[:.]?\s*(\d{6,15})/i);
  if (conEtiqueta) return conEtiqueta[1];
  // Si no lo encuentra, usa el número más largo de toda la hoja (suele ser la guía).
  const numeros = texto.match(/\d{8,15}/g) || [];
  if (numeros.length) return numeros.sort((a, b) => b.length - a.length)[0];
  return null;
}

function RemitoViaCargoCampo({ pedido, canEdit, onCambiar }) {
  const [subiendo, setSubiendo] = useState(false);
  const [leyendoGuia, setLeyendoGuia] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState("");

  // Cargar el número de guía significa que el paquete ya salió hacia Vía
  // Cargo — para Interior eso pasa el pedido a "Despachado" (no a
  // "Entregado" todavía: eso queda para cuando se confirme que llegó).
  function aplicarCambios(cambios) {
    const yaTieneGuia = pedido.remitoNumeroGuia?.trim();
    const nuevaGuia = cambios.remitoNumeroGuia?.trim();
    if (nuevaGuia && !yaTieneGuia && pedido.metodo === "Interior" && pedido.estado !== "Despachado" && pedido.estado !== "Entregado") {
      onCambiar({ ...cambios, estado: "Despachado", despachadoFecha: new Date().toISOString().slice(0, 10) });
    } else {
      onCambiar(cambios);
    }
  }

  async function handleFile(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setError(""); setSubiendo(true);
    try {
      const url = await documentosStore.subirRemito(pedido.id, archivo);
      const cambios = { remitoUrl: url };

      if (archivo.type.startsWith("image/") && !pedido.remitoNumeroGuia?.trim()) {
        setSubiendo(false); setLeyendoGuia(true);
        try {
          const guia = await leerNumeroGuiaDeImagen(archivo);
          if (guia) cambios.remitoNumeroGuia = guia;
        } catch (ocrErr) { /* si falla la lectura automática, se puede escribir a mano igual */ }
        setLeyendoGuia(false);
      }

      aplicarCambios(cambios);
    } catch (err) {
      setError("No se pudo subir. Revisá la conexión e intentá de nuevo.");
    } finally {
      setSubiendo(false); setLeyendoGuia(false);
      e.target.value = "";
    }
  }

  async function handleBorrar() {
    if (!window.confirm("¿Quitar este remito? Si lo subiste por error, se elimina del pedido.")) return;
    setError(""); setBorrando(true);
    try {
      await documentosStore.borrarRemito(pedido.remitoUrl);
      onCambiar({ remitoUrl: "" });
    } catch (err) {
      setError("No se pudo quitar. Revisá la conexión e intentá de nuevo.");
    } finally {
      setBorrando(false);
    }
  }

  return (
    <div className="dg-section-card">
      <div className="dg-section-header"><Package size={14} /> Remito de Vía Cargo</div>
      <div className="dg-field-grid">
        <Field label="Número de guía">
          <input
            disabled={!canEdit}
            value={pedido.remitoNumeroGuia || ""}
            onChange={(e) => aplicarCambios({ remitoNumeroGuia: e.target.value })}
            placeholder="Ej: 999036524031"
          />
        </Field>
        <Field label="Comprobante (foto o PDF)">
          <div className="dg-factura-campo">
            {pedido.remitoUrl && (
              <a href={pedido.remitoUrl} target="_blank" rel="noopener noreferrer" className="dg-factura-actual">
                <FileText size={13} /> Ver remito
              </a>
            )}
            {canEdit && pedido.remitoUrl && (
              <button type="button" className="dg-btn-ghost dg-mini-btn dg-btn-danger-ghost" onClick={handleBorrar} disabled={borrando}>
                {borrando ? <Loader2 size={13} className="dg-spin" /> : <Trash2 size={13} />} Quitar
              </button>
            )}
            {canEdit && (
              <label className={`dg-btn-ghost dg-mini-btn dg-factura-upload-btn ${leyendoGuia ? "dg-btn-leyendo" : ""}`}>
                {subiendo || leyendoGuia ? <Loader2 size={13} className="dg-spin" /> : <PackagePlus size={13} />}
                {subiendo ? "Subiendo..." : leyendoGuia ? "Leyendo guía..." : pedido.remitoUrl ? "Reemplazar" : "Subir remito"}
                <input type="file" accept="application/pdf,image/*" onChange={handleFile} disabled={subiendo || leyendoGuia} style={{ display: "none" }} />
              </label>
            )}
          </div>
          {error && <div className="dg-error" style={{ marginTop: 4 }}>{error}</div>}
          {canEdit && !pedido.remitoNumeroGuia?.trim() && pedido.metodo === "Interior" && (
            <p className="dg-hint" style={{ marginTop: 6, fontSize: 11 }}>
              Si subís una foto (no un PDF), el número de guía se completa solo — revisalo antes de guardar por si lo leyó mal. En cuanto quede cargada la guía, el pedido pasa solo a "Despachado" y sale de la lista general.
            </p>
          )}
        </Field>
      </div>
      {pedido.remitoNumeroGuia?.trim() && (
        <a href={linkViaCargo(pedido.remitoNumeroGuia)} target="_blank" rel="noopener noreferrer" className="dg-link-ecomapp" style={{ marginTop: 10 }}>
          <ExternalLink size={12} /> Ver seguimiento en Vía Cargo
        </a>
      )}
    </div>
  );
}

function SubirFacturaCampo({ pedido, canEdit, onSubido }) {
  const [subiendo, setSubiendo] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setError(""); setSubiendo(true);
    try {
      const url = await documentosStore.subirFactura(pedido.id, archivo);
      onSubido(url);
    } catch (err) {
      setError("No se pudo subir. Revisá la conexión e intentá de nuevo.");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  async function handleBorrar() {
    if (!window.confirm("¿Quitar esta factura? Si la subiste por error, se elimina del pedido.")) return;
    setError(""); setBorrando(true);
    try {
      await documentosStore.borrarFactura(pedido.facturaUrl);
      onSubido("");
    } catch (err) {
      setError("No se pudo quitar. Revisá la conexión e intentá de nuevo.");
    } finally {
      setBorrando(false);
    }
  }

  return (
    <div className="dg-factura-campo">
      {pedido.facturaUrl && (
        <a href={pedido.facturaUrl} target="_blank" rel="noopener noreferrer" className="dg-factura-actual">
          <FileText size={13} /> Ver factura cargada
        </a>
      )}
      {canEdit && pedido.facturaUrl && (
        <button type="button" className="dg-btn-ghost dg-mini-btn dg-btn-danger-ghost" onClick={handleBorrar} disabled={borrando}>
          {borrando ? <Loader2 size={13} className="dg-spin" /> : <Trash2 size={13} />} Quitar
        </button>
      )}
      {canEdit && (
        <label className="dg-btn-ghost dg-mini-btn dg-factura-upload-btn">
          {subiendo ? <Loader2 size={13} className="dg-spin" /> : <PackagePlus size={13} />}
          {subiendo ? "Subiendo..." : pedido.facturaUrl ? "Reemplazar" : "Subir factura"}
          <input type="file" accept="application/pdf" onChange={handleFile} disabled={subiendo} style={{ display: "none" }} />
        </label>
      )}
      {error && <div className="dg-error" style={{ marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function ModalMotivo({ titulo, opciones, onConfirmar, onCancelar, etapaOpciones }) {
  const [motivo, setMotivo] = useState(opciones[0]);
  const [detalle, setDetalle] = useState("");
  const [etapa, setEtapa] = useState(etapaOpciones ? etapaOpciones[0].value : undefined);

  return (
    <div className="dg-overlay" onClick={onCancelar}>
      <div className="dg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head"><div className="dg-modal-title">{titulo}</div><button className="dg-icon-btn" onClick={onCancelar}><X size={18} /></button></div>
        <div className="dg-form">
          {etapaOpciones && (
            <>
              <label>¿En qué etapa está el espejo de verdad?</label>
              <select value={etapa} onChange={(e) => setEtapa(e.target.value)}>
                {etapaOpciones.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </>
          )}
          <label>Motivo</label>
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)}>
            {opciones.map((o) => (<option key={o}>{o}</option>))}
          </select>
          <label>Detalle (opcional)</label>
          <input value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Agregá algún detalle más si hace falta" />
        </div>
        <div className="dg-form-actions">
          <button className="dg-btn-ghost" onClick={onCancelar}>Volver</button>
          <button className="dg-btn-primary" onClick={() => onConfirmar(detalle.trim() ? `${motivo} — ${detalle.trim()}` : motivo, etapa)}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

function PedidoModal({ pedido, vendedores, canEditFull, canEditEstadoOnly, onClose, onSave, onDelete, stockEspejos, esNuevo }) {
  const [draft, setDraft] = useState(() => normalizarPedidoFunciones(pedido));
  const [intentoGuardar, setIntentoGuardar] = useState(false);
  const readOnly = !canEditFull && !canEditEstadoOnly;
  const saldo = (Number(draft.monto) || 0) - (Number(draft.anticipo) || 0);
  const puedeMarcarEntregado = draft.estado === "Entregado" || (pedido.estado === "Espejo listo" && draft.clienteAvisado && (!esPedidoConEnvio(draft) || draft.envioConfirmado));
  const estadoOptions = ESTADO_PEDIDO_OPTIONS.filter((estado) => estado !== "Entregado" || puedeMarcarEntregado);

  const errores = validarPedido(draft);
  const cantErrores = Object.keys(errores).length;
  const err = (campo) => (intentoGuardar && errores[campo]) || null;

  function set(field, val) { setDraft((d) => ({ ...d, [field]: val })); }
  const [pidiendoMotivoCancelacion, setPidiendoMotivoCancelacion] = useState(false);

  function intentarGuardar(opts) {
    setIntentoGuardar(true);
    if (Object.keys(validarPedido(draft)).length > 0) {
      const primer = ref_scrollTop();
      return;
    }
    onSave(draft, opts);
  }
  function ref_scrollTop() {
    try {
      const el = document.querySelector(".dg-validacion-banner");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
  }

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal dg-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head">
          <div className="dg-modal-title">{draft.orden ? `Pedido #${draft.orden}` : "Nuevo pedido"}</div>
          <button className="dg-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {intentoGuardar && cantErrores > 0 && (
          <div className="dg-validacion-banner">
            <AlertTriangle size={15} />
            <div>
              <strong>Faltan {cantErrores} dato(s) para pasar el pedido</strong>
              <ul>{Object.values(errores).map((m, i) => (<li key={i}>{m}</li>))}</ul>
            </div>
          </div>
        )}

        <EnterFlow onSubmit={intentarGuardar}>
        <div className="dg-section-card">
          <div className="dg-section-header"><Calculator size={14} /> Medida y producto</div>
          <div className="dg-field-grid">
            <Field label="Ancho (cm)" error={err("ancho")}><input type="number" disabled={!canEditFull} value={draft.ancho} onChange={(e) => set("ancho", e.target.value)} /></Field>
            <Field label="Alto (cm)" error={err("alto")}><input type="number" disabled={!canEditFull} value={draft.alto} onChange={(e) => set("alto", e.target.value)} /></Field>
            <Field label="Cantidad" error={err("cant")}><input type="number" disabled={!canEditFull} value={draft.cant} onChange={(e) => set("cant", e.target.value)} /></Field>
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
            {draft.desemp === "Desempañante" && (
              <Field label="Tipo de desempañante"><select disabled={!canEditFull} value={draft.desempTipo || "220"} onChange={(e) => set("desempTipo", e.target.value)}>{DESEMP_TIPO_OPTIONS.map((o) => (<option key={o} value={o}>{o === "220" ? "220V (enchufe)" : "Touch (T)"}</option>))}</select></Field>
            )}
            {draft.desemp === "Desempañante" && (
              <Field label="Cantidad de paneles">
                <input type="number" min="1" disabled={!canEditFull} value={draft.desempCantidad || 1} onChange={(e) => set("desempCantidad", Math.max(1, Number(e.target.value) || 1))} />
              </Field>
            )}
            <Field label="Hora / Temp"><select disabled={!canEditFull} value={draft.horaTemp} onChange={(e) => set("horaTemp", e.target.value)}>{HORATEMP_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Bluetooth"><select disabled={!canEditFull} value={draft.bluetooth} onChange={(e) => set("bluetooth", e.target.value)}>{BLUETOOTH_PEDIDO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Tono de luz"><select disabled={!canEditFull} value={draft.tono} onChange={(e) => set("tono", e.target.value)}>{TONO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
          </div>
        </div>

        {esNuevo && stockEspejos && stockEspejos.length > 0 && (
          <div className="dg-section-card">
            <div className="dg-section-header"><Package size={14} /> ¿Es un espejo que ya está en stock?</div>
            <div className="dg-field-grid">
              <Field label="Espejo de stock (opcional)">
                <select disabled={!canEditFull} value={draft.stockEspejoId || ""} onChange={(e) => set("stockEspejoId", e.target.value)}>
                  <option value="">No — se fabrica a medida</option>
                  {stockEspejos.map((s) => (
                    <option key={s.id} value={s.id} disabled={Number(s.cantidad) <= 0}>
                      {s.modelo ? `#${s.modelo} — ` : ""}{s.descripcion} ({s.cantidad} disponible{s.cantidad === 1 ? "" : "s"})
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {draft.stockEspejoId && (
              <p className="dg-hint" style={{ marginTop: 6 }}>Al guardar, se descuenta {Number(draft.cant) || 1} unidad(es) de este modelo del stock de espejos.</p>
            )}
          </div>
        )}

        <div className="dg-section-card">
          <div className="dg-section-header"><User size={14} /> Cliente y pago</div>
          <div className="dg-field-grid">
            <Field label="Cliente" error={err("cliente")}><input disabled={!canEditFull} value={draft.cliente} onChange={(e) => set("cliente", e.target.value)} /></Field>
            <Field label="Fecha de compra"><input type="date" disabled={!canEditFull} value={draft.fecha || ""} onChange={(e) => set("fecha", e.target.value)} /></Field>
            <Field label="Vendedor" error={err("vendedor")}><select disabled={!canEditFull} value={draft.vendedor} onChange={(e) => set("vendedor", e.target.value)}><option value="">—</option>{vendedores.map((v) => (<option key={v}>{v}</option>))}</select></Field>
            <Field label="Celular" error={err("celular")}><input disabled={!canEditFull} value={draft.celular} onChange={(e) => set("celular", e.target.value)} /></Field>
            <Field label="DNI/CUIT"><input disabled={!canEditFull} value={draft.dniCuit} onChange={(e) => set("dniCuit", e.target.value)} /></Field>
            <Field label="Tipo factura" error={err("tipoFactura")}><select disabled={!canEditFull} value={draft.tipoFactura} onChange={(e) => set("tipoFactura", e.target.value)}>{TIPOFACTURA_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Facturado">
              <button type="button" disabled={!canEditFull} className={`dg-checkbox-field ${draft.facturado ? "dg-checkbox-field-on" : ""}`} onClick={() => set("facturado", !draft.facturado)}>
                {draft.facturado ? <Check size={14} /> : null} {draft.facturado ? "Facturado" : "Sin facturar"}
              </button>
              {!draft.facturado && (
                <a href="https://admin.ecomm-app.com/facturacion/factura/editar" target="_blank" rel="noopener noreferrer" className="dg-link-ecomapp">
                  <ExternalLink size={12} /> Facturar en EcomApp
                </a>
              )}
            </Field>
            <Field label="Comprobante de factura (PDF)">
              <SubirFacturaCampo pedido={draft} canEdit={canEditFull} onSubido={(url) => set("facturaUrl", url)} />
            </Field>
            <Field label="Comisión">
              <div className="dg-comision-info">
                {draft.comisionPagada
                  ? <><CheckCircle2 size={13} /> Ya liquidada</>
                  : comisionElegible(draft)
                  ? <><CircleDollarSign size={13} /> Lista para liquidar</>
                  : <>Se habilita al cobrar todo</>}
              </div>
            </Field>
          </div>
          <div className="dg-field-grid dg-money-row">
            <Field label="Monto" error={err("monto")}><input type="number" disabled={!canEditFull} value={draft.monto} onChange={(e) => set("monto", e.target.value)} /></Field>
            <Field label="Anticipo" error={err("anticipo")}><input type="number" disabled={!canEditFull} value={draft.anticipo} onChange={(e) => set("anticipo", e.target.value)} /></Field>
            <Field label="Saldo" computed><input disabled value={money(saldo)} /></Field>
          </div>
          {canEditFull && (() => {
            const cobrado = draft.estado === "Entregado" ? Number(draft.monto) || 0 : Number(draft.anticipo) || 0;
            const delta = cobrado - (Number(draft.montoRegistrado) || 0);
            if (delta === 0) return null;
            return (
              <p className="dg-hint" style={{ marginTop: 10 }}>
                Al guardar se {delta > 0 ? "registran" : "descuentan"} <strong>{money(Math.abs(delta))}</strong> en <strong>{CUENTA_INGRESO[determineCuentaPedido(draft)]}</strong>
                {draft.estado === "Entregado" ? " (pedido entregado: se cobra el total)." : " (anticipo)."}
              </p>
            );
          })()}
        </div>

        <div className="dg-section-card">
          <div className="dg-section-header"><Truck size={14} /> Entrega</div>
          <div className="dg-field-grid">
            <Field label="Estado"><select disabled={readOnly} value={draft.estado} onChange={(e) => {
              const nuevo = e.target.value;
              if (nuevo === "Cancelado" && draft.estado !== "Cancelado") setPidiendoMotivoCancelacion(true);
              else set("estado", nuevo);
            }}>{estadoOptions.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Listo para (fecha)"><input type="date" disabled={readOnly} value={draft.listo} onChange={(e) => set("listo", e.target.value)} /></Field>
            <Field label="Método de entrega" error={err("metodo")}><select disabled={!canEditFull} value={draft.metodo} onChange={(e) => set("metodo", e.target.value)}>{METODO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
          </div>
          <div className="dg-field-grid" style={{ marginTop: 12 }}>
            <Field label="Dirección / detalle de entrega" error={err("detalleEntrega")}><input disabled={!canEditFull} value={draft.detalleEntrega} onChange={(e) => set("detalleEntrega", e.target.value)} placeholder="Dirección, costo de envío..." /></Field>
            <Field label="Piso / Depto"><input disabled={!canEditFull} value={draft.piso} onChange={(e) => set("piso", e.target.value)} /></Field>
            <Field label="Costo del envío"><input type="number" disabled={!canEditFull} value={draft.costoEnvio} onChange={(e) => set("costoEnvio", e.target.value)} placeholder="0" /></Field>
            <Field label="Horario de entrega"><input disabled={!canEditFull} value={draft.horarioEntrega} onChange={(e) => set("horarioEntrega", e.target.value)} placeholder="Ej: Mañana 9 a 13 hs" /></Field>
          </div>
        </div>

        {draft.metodo === "Interior" && (
          <div className="dg-section-card">
            <div className="dg-section-header"><MapPin size={14} /> Dirección para el envío al interior</div>
            <div className="dg-field-grid">
              <Field label="Provincia"><input disabled={!canEditFull} value={draft.provincia} onChange={(e) => set("provincia", e.target.value)} /></Field>
              <Field label="Localidad"><input disabled={!canEditFull} value={draft.localidad} onChange={(e) => set("localidad", e.target.value)} /></Field>
              <Field label="Código postal"><input disabled={!canEditFull} value={draft.codigoPostal} onChange={(e) => set("codigoPostal", e.target.value)} /></Field>
            </div>
          </div>
        )}

        {draft.metodo === "Interior" && (
          <RemitoViaCargoCampo pedido={draft} canEdit={canEditFull} onCambiar={(cambios) => setDraft((d) => ({ ...d, ...cambios }))} />
        )}

        {draft.metodo === "Interior" && draft.ancho && draft.alto && (
          <div className="dg-form-actions" style={{ justifyContent: "flex-start", marginTop: 4 }}>
            <button type="button" className="dg-btn-ghost" onClick={() => abrirRotulos(draft)}><Printer size={14} /> Imprimir rótulo del paquete</button>
          </div>
        )}

        </EnterFlow>

        <div className="dg-form-actions" style={{ marginTop: 4 }}>
          {onDelete && canEditFull && <button className="dg-btn-ghost" onClick={onDelete}><Trash2 size={14} /> Eliminar</button>}
          {canEditFull && (
            <button className="dg-btn-ghost" onClick={() => intentarGuardar({ addAnother: true })}>
              <PackagePlus size={14} /> Guardar y agregar otro espejo del mismo cliente
            </button>
          )}
          {!readOnly && (
            <button className={`dg-btn-primary ${cantErrores > 0 ? "dg-btn-warn" : ""}`} onClick={() => intentarGuardar()}>
              <Save size={14} /> Guardar{cantErrores > 0 ? ` (${cantErrores} faltan)` : ""}
            </button>
          )}
        </div>
      </div>

      {pidiendoMotivoCancelacion && (
        <ModalMotivo
          titulo="¿Por qué se cancela este pedido?"
          opciones={MOTIVOS_CANCELACION}
          onCancelar={() => setPidiendoMotivoCancelacion(false)}
          onConfirmar={(motivo) => {
            setDraft((d) => ({ ...d, estado: "Cancelado", motivoCancelacion: motivo }));
            setPidiendoMotivoCancelacion(false);
          }}
        />
      )}
    </div>
  );
}

function EnviosInteriorPanel({ pedidos, onChange, canEdit }) {
  const [busqueda, setBusqueda] = useState("");

  const interior = pedidos
    .filter((p) => p.metodo === "Interior")
    .filter((p) => p.estado !== "Entregado" && p.estado !== "Cancelado" && p.estado !== "Despachado")
    .filter((p) => !busqueda.trim() || (p.cliente || "").toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      const aListo = pedidoEstaListo(a), bListo = pedidoEstaListo(b);
      if (aListo !== bListo) return aListo ? -1 : 1; // los listos para despachar van primero
      return (b.orden || 0) - (a.orden || 0);
    });

  const despachados = pedidos
    .filter((p) => p.metodo === "Interior" && p.estado === "Despachado")
    .filter((p) => !busqueda.trim() || (p.cliente || "").toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => (b.despachadoFecha || "").localeCompare(a.despachadoFecha || ""));

  // Solo se imprime lo que ya está terminado y todavía no se despachó — no
  // tiene sentido armar un rótulo de algo que sigue en fábrica, ni de algo
  // que ya salió.
  const listosParaDespachar = interior.filter((p) => p.estado === "Espejo listo" && p.ancho && p.alto);

  function update(id, patch) { onChange(pedidos.map((p) => (p.id === id ? { ...p, ...patch } : p))); }
  function updateGrupo(pedido, patch) {
    const grupo = pedido.grupoId || pedido.id;
    onChange(pedidos.map((p) => ((p.grupoId || p.id) === grupo ? { ...p, ...patch } : p)));
  }
  function marcarEntregado(id) { update(id, { estado: "Entregado", entregadoFecha: new Date().toISOString().slice(0, 10) }); }

  return (
    <div className="dg-page">
      <div className="dg-crm-filters">
        <Filter size={14} />
        <input className="dg-pedido-search" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>

      {listosParaDespachar.length > 0 && (
        <div className="dg-section-card" style={{ borderColor: "rgba(var(--dg-success-rgb),.35)" }}>
          <div className="dg-section-header" style={{ color: "var(--dg-success)" }}><Truck size={14} /> Listos para despachar ({listosParaDespachar.length})</div>
          <p className="dg-hint" style={{ marginBottom: 10 }}>Los 3 pasos del despacho — solo incluyen los espejos que ya están terminados, nunca los que siguen en fábrica ni los que ya se despacharon.</p>
          <div className="dg-order-despacho-btns">
            <button className="dg-btn-ghost" onClick={() => abrirDatosDespacho(listosParaDespachar)}><FileText size={14} /> 1. Datos para Vía Cargo</button>
            <button className="dg-btn-ghost" onClick={() => abrirRotulos(listosParaDespachar)}><Printer size={14} /> 2. Rótulos ({listosParaDespachar.length})</button>
            <button className="dg-btn-ghost" onClick={() => abrirTirasContieneEspejo(listosParaDespachar.reduce((a, p) => a + (Number(p.cant) > 1 ? p.cant : 1), 0))}><AlertTriangle size={14} /> 3. Tiras "Contiene espejo"</button>
          </div>
        </div>
      )}

      <div className="dg-task-list dg-pedido-list">
        {interior.length === 0 && <div className="dg-empty">No hay pedidos al interior pendientes.</div>}
        {interior.map((p) => {
          const listo = pedidoEstaListo(p);
          return (
            <div className={`dg-section-card dg-shipping-confirm-card ${listo ? "dg-fab-terminado" : ""}`} key={p.id}>
              <div className="dg-section-header">
                <Truck size={14} /> #{p.orden} · {p.cliente}
                {listo && <span className="dg-badge" style={{ "--bc": "var(--dg-success)", marginLeft: 8 }}><CheckCircle2 size={12} /> Listo</span>}
              </div>
              <div className="dg-pago-meta" style={{ marginBottom: 10 }}>{p.ancho}×{p.alto} cm · {p.forma}{!listo && " · todavía en producción"}</div>

              <div className="dg-field-grid">
                <Field label="Provincia"><input disabled={!canEdit} value={p.provincia || ""} onChange={(e) => updateGrupo(p, { provincia: e.target.value })} /></Field>
                <Field label="Localidad"><input disabled={!canEdit} value={p.localidad || ""} onChange={(e) => updateGrupo(p, { localidad: e.target.value })} /></Field>
                <Field label="Código postal"><input disabled={!canEdit} value={p.codigoPostal || ""} onChange={(e) => updateGrupo(p, { codigoPostal: e.target.value })} /></Field>
              </div>

              <RemitoViaCargoCampo pedido={p} canEdit={canEdit} onCambiar={(cambios) => update(p.id, cambios)} />

              {listo && p.ancho && p.alto && (
                <div className="dg-form-actions" style={{ justifyContent: "flex-start", marginTop: 10 }}>
                  <button className="dg-btn-ghost dg-mini-btn" onClick={() => abrirRotulos(p)}><Printer size={13} /> Rótulo de este pedido</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="dg-section-card" style={{ marginTop: 22 }}>
        <div className="dg-section-header"><Check size={14} /> Despachados ({despachados.length})</div>
        <p className="dg-hint" style={{ marginBottom: 10 }}>Ya salieron hacia Vía Cargo. No aparecen en la lista general de pedidos para no hacer bulto. Marcá "Confirmar entrega" recién cuando sepas que el cliente ya lo recibió.</p>
        {despachados.length === 0 && <div className="dg-empty">Todavía no despachaste ninguno.</div>}
        <div className="dg-task-list" style={{ marginBottom: 0 }}>
          {despachados.map((p) => (
            <div className="dg-task dg-pago-row" key={p.id}>
              <div className="dg-pago-info">
                <span>#{p.orden} · {p.cliente}</span>
                <span className="dg-pago-meta">Despachado el {p.despachadoFecha || "—"} · Guía: {p.remitoNumeroGuia || "—"} · {p.localidad || "—"}{p.provincia ? `, ${p.provincia}` : ""}</span>
              </div>
              {p.remitoNumeroGuia?.trim() && (
                <a className="dg-btn-ghost dg-mini-btn" href={linkViaCargo(p.remitoNumeroGuia)} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} /> Ver en Vía Cargo</a>
              )}
              <button className="dg-btn-primary dg-mini-btn" onClick={() => marcarEntregado(p.id)}><CheckCircle2 size={13} /> Confirmar entrega</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnviosPostventaPanel({ pedidos, onChange, canEdit }) {
  const [busqueda, setBusqueda] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const envios = pedidos
    .filter((p) => esPedidoConEnvio(p) && p.metodo !== "Interior")
    .filter((p) => p.estado !== "Entregado" && pedidoEstaListo(p))
    .filter((p) => !busqueda.trim() || p.cliente.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));

  function update(id, patch) { onChange(pedidos.map((p) => (p.id === id ? { ...p, ...patch } : p))); }
  function updateShipping(pedido, patch) {
    const grupo = pedido.grupoId || pedido.id;
    onChange(pedidos.map((p) => ((p.grupoId || p.id) === grupo ? { ...p, ...patch } : p)));
  }

  function mensaje(p) {
    const saldoTexto = detalleCobroEntrega(p);
    return `Hola ${p.cliente || ""}, te confirmamos los datos de tu envío:\n\nEspejo ${p.ancho}×${p.alto} cm\n📞 Teléfono: ${p.celular || "(sin dato)"}\n📍 Dirección: ${p.detalleEntrega || "(a confirmar)"}\n🏢 Piso / Depto: ${p.piso || "(sin dato)"}\n🕐 Horario de entrega: ${p.horarioEntrega || "a coordinar"}\n📅 Fecha estimada: ${p.listo || "a coordinar"}\n\n${saldoTexto}\n\n¿Podés confirmarnos que estos datos son correctos?`;
  }
  function copiar(p) {
    if (navigator.clipboard) navigator.clipboard.writeText(mensaje(p)).then(() => { setCopiedId(p.id); setTimeout(() => setCopiedId(null), 2000); });
  }
  function marcarClienteAvisado(p) {
    if (!pedidoEstaListo(p)) {
      window.alert("Esperá a que fábrica marque el espejo como listo antes de confirmar con el cliente.");
      return;
    }
    update(p.id, { clienteAvisado: true, clienteAvisadoFecha: new Date().toISOString() });
  }
  function marcarEnvioConfirmado(p) {
    if (!pedidoEstaListo(p) || !p.clienteAvisado) {
      window.alert("Primero confirmá con el cliente que los datos del envío sean correctos.");
      return;
    }
    update(p.id, { envioConfirmado: true, envioConfirmadoFecha: new Date().toISOString() });
  }

  return (
    <div className="dg-page">
      <div className="dg-crm-filters"><Filter size={14} /><input className="dg-pedido-search" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
      <div className="dg-task-list dg-pedido-list">
        {envios.length === 0 && <div className="dg-empty">No hay pedidos con envío o interior pendientes.</div>}
        {envios.map((p) => (
          <div className="dg-section-card dg-shipping-confirm-card" key={p.id}>
            <div className="dg-section-header"><Truck size={14} /> #{p.orden} · {p.cliente} {p.envioConfirmado && <span className="dg-badge" style={{ "--bc": "var(--dg-success)", marginLeft: 8 }}><CheckCircle2 size={12} /> Confirmado</span>}</div>
            <div className="dg-pago-meta" style={{ marginBottom: 10 }}>{p.ancho}×{p.alto} cm · {p.forma} · Método: {p.metodo}</div>
            <details className="dg-shipping-editor">
              <summary>
                <span className="dg-shipping-editor-icon"><Pencil size={14} /></span>
                <span><strong>Cargar o corregir datos de entrega</strong><small>{p.detalleEntrega || "Sin dirección"} {p.listo && <span className="dg-fecha-entrega-badge"><CalendarDays size={11} /> {fechaEntregaCorta(p.listo)}</span>}</small></span>
                <ChevronRight size={16} />
              </summary>
              <EnterFlow autoFocus={false} className="dg-shipping-editor-body">
                <div className="dg-shipping-fields">
                  <div className="dg-shipping-field"><Field label="Teléfono"><input disabled={!canEdit} value={p.celular || ""} onChange={(e) => updateShipping(p, { celular: e.target.value })} /></Field></div>
                  <div className="dg-shipping-field"><Field label="Piso / Timbre"><input disabled={!canEdit} value={p.piso || ""} onChange={(e) => updateShipping(p, { piso: e.target.value })} /></Field></div>
                  <div className="dg-shipping-field dg-shipping-address"><Field label="Dirección"><input disabled={!canEdit} value={p.detalleEntrega || ""} onChange={(e) => updateShipping(p, { detalleEntrega: e.target.value })} /></Field></div>
                  <div className="dg-shipping-field"><Field label="Horario"><input disabled={!canEdit} value={p.horarioEntrega || ""} onChange={(e) => updateShipping(p, { horarioEntrega: e.target.value })} placeholder="Ej: 13 a 17 hs" /></Field></div>
                  <div className="dg-shipping-field"><Field label="Fecha estimada"><input type="date" disabled={!canEdit} value={p.listo || ""} onChange={(e) => updateShipping(p, { listo: e.target.value })} /></Field></div>
                </div>
              </EnterFlow>
            </details>
            <div className={`dg-shipping-total-preview ${costoEnvioPedido(p) > 0 ? "" : "dg-shipping-total-missing"}`}>
              <span>{costoEnvioPedido(p) > 0 ? "Total a confirmar con el cliente" : "Total parcial · falta cargar el envío"}</span>
              <strong>{money(totalPendientePedido(p))}</strong>
            </div>
            <div className="dg-quote-actions dg-shipping-copy">
              <button className="dg-btn-ghost" onClick={() => copiar(p)}>{copiedId === p.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === p.id ? "Copiado" : "Copiar mensaje para el cliente"}</button>
            </div>
            <FlujoPedido
              pedido={p}
              canEdit={canEdit}
              onClienteConfirmado={marcarClienteAvisado}
              onEnvioConfirmado={marcarEnvioConfirmado}
            />
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
          <EnterFlow onSubmit={addFactura} autoFocus={false}>
          <div className="dg-field-grid">
            <Field label="Nombre / Cliente"><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></Field>
            <Field label="Monto"><input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} /></Field>
            <Field label="CUIT"><input value={cuit} onChange={(e) => setCuit(e.target.value)} /></Field>
          </div>
          <div className="dg-field-grid" style={{ marginTop: 12 }}>
            <Field label="Detalle"><input value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Concepto de la factura" /></Field>
          </div>
          </EnterFlow>
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

function reclamoFinalizado(r) {
  return r.finalizado === true || (typeof r.estado === "string" && r.estado.toLowerCase().includes("final"));
}

function mensajeSolucionReclamo(r) {
  const saludo = r.cliente ? `Hola ${r.cliente}! 👋` : "Hola! 👋";
  const contexto = r.notas ? ` (${r.notas})` : "";
  return `${saludo} Con respecto a tu reclamo por "${r.tipo}"${contexto}, te contamos cómo lo solucionamos:\n\n${r.solucion || "(completá la solución antes de enviar)"}\n\nCualquier consulta quedamos a disposición.`;
}

function ReclamosPanel({ reclamos, onChange }) {
  const [tipo, setTipo] = useState(null);
  const [cliente, setCliente] = useState("");
  const [celular, setCelular] = useState("");
  const [notas, setNotas] = useState("");
  const [vista, setVista] = useState("activos");
  const [copiadoId, setCopiadoId] = useState(null);

  function addReclamo() {
    if (!tipo) return;
    onChange([{
      id: uid(), tipo, cliente: cliente.trim(), celular: celular.trim(), notas: notas.trim(),
      solucion: "", finalizado: false, fecha: new Date().toISOString().slice(0, 10),
    }, ...reclamos]);
    setTipo(null); setCliente(""); setCelular(""); setNotas("");
  }
  function removeReclamo(id) { onChange(reclamos.filter((r) => r.id !== id)); }
  function setSolucion(id, solucion) { onChange(reclamos.map((r) => (r.id === id ? { ...r, solucion } : r))); }
  function finalizar(id) { onChange(reclamos.map((r) => (r.id === id ? { ...r, finalizado: true, estado: "Finalizado", finalizadoFecha: new Date().toISOString().slice(0, 10) } : r))); }
  function reabrir(id) { onChange(reclamos.map((r) => (r.id === id ? { ...r, finalizado: false, estado: "Pendiente" } : r))); }

  function enviarWhatsapp(r) {
    const link = waLink(r.celular);
    if (!link) return;
    const url = `${link}?text=${encodeURIComponent(mensajeSolucionReclamo(r))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCopiadoId(r.id);
    setTimeout(() => setCopiadoId(null), 2000);
  }

  const activos = reclamos.filter((r) => !reclamoFinalizado(r));
  const finalizados = reclamos.filter((r) => reclamoFinalizado(r));
  const visibles = vista === "activos" ? activos : finalizados;

  const chartData = RECLAMO_TIPOS.map((t, i) => ({ tipo: t, cantidad: reclamos.filter((r) => r.tipo === t).length, fill: RECLAMO_COLORS[i] }));

  return (
    <div className="dg-page">
      <div className="dg-chart-card" style={{ marginBottom: 16 }}>
        <div className="dg-chart-title">Reclamos por tipo — qué falla más seguido</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--dg-line-rgb),0.06)" horizontal={false} />
            <XAxis type="number" stroke="var(--dg-text-dim)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="tipo" stroke="var(--dg-text-dim)" fontSize={11} tickLine={false} axisLine={false} width={130} />
            <Tooltip contentStyle={{ background: "var(--dg-surface)", border: "1px solid rgba(var(--dg-line-rgb),0.1)", borderRadius: 8, fontSize: 12 }} />
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
          <EnterFlow onSubmit={addReclamo} autoFocus={false}>
            <div className="dg-field-grid" style={{ marginTop: 12 }}>
              <Field label="Cliente"><input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nombre (opcional)" /></Field>
              <Field label="Celular (para la solución por WhatsApp)"><input value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ej: 1122334455" /></Field>
              <Field label="Notas"><input value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Opcional" /></Field>
            </div>
            <div className="dg-form-actions" style={{ marginTop: 10 }}>
              <button className="dg-btn-ghost" onClick={() => setTipo(null)}>Cancelar</button>
              <button className="dg-btn-primary" onClick={addReclamo}><Check size={14} /> Guardar reclamo: {tipo}</button>
            </div>
          </EnterFlow>
        )}
      </div>

      <div className="dg-quickviews" style={{ margin: "16px 0" }}>
        <button className={`dg-quickview-btn ${vista === "activos" ? "dg-quickview-on" : ""}`} onClick={() => setVista("activos")}>Activos ({activos.length})</button>
        <button className={`dg-quickview-btn ${vista === "finalizados" ? "dg-quickview-on" : ""}`} onClick={() => setVista("finalizados")}>Finalizados ({finalizados.length})</button>
      </div>

      {visibles.length === 0 && <div className="dg-empty">{vista === "activos" ? "No hay reclamos activos. ¡Buenas noticias!" : "Todavía no finalizaste ningún reclamo."}</div>}

      <div className="dg-reclamo-lista">
        {visibles.map((r) => {
          const tieneCelular = !!waLink(r.celular);
          return (
            <div className="dg-section-card dg-reclamo-card" key={r.id}>
              <div className="dg-reclamo-head">
                <span className="dg-badge" style={{ "--bc": RECLAMO_COLORS[RECLAMO_TIPOS.indexOf(r.tipo)] || "var(--dg-text-dim)" }}>{r.tipo}</span>
                <span className="dg-reclamo-cliente">{r.cliente || "Sin cliente"}</span>
                <span className="dg-pago-meta">{r.fecha}</span>
                {!reclamoFinalizado(r) && <button className="dg-icon-btn dg-task-del" onClick={() => removeReclamo(r.id)}><Trash2 size={14} /></button>}
              </div>
              {r.notas && <div className="dg-pago-meta" style={{ marginBottom: 8 }}>{r.notas}</div>}

              {reclamoFinalizado(r) ? (
                <>
                  {r.solucion && <div className="dg-fab-obs"><span>Solución aplicada</span> {r.solucion}</div>}
                  <div className="dg-form-actions" style={{ marginTop: 8 }}>
                    <button className="dg-btn-ghost" onClick={() => reabrir(r.id)}><RotateCcw size={13} /> Reabrir reclamo</button>
                  </div>
                </>
              ) : (
                <>
                  <Field label="Solución que le ofrecemos al cliente">
                    <input value={r.solucion || ""} onChange={(e) => setSolucion(r.id, e.target.value)} placeholder="Ej: te reemplazamos el espejo sin cargo esta semana" />
                  </Field>
                  <div className="dg-form-actions" style={{ marginTop: 10 }}>
                    {tieneCelular ? (
                      <button className="dg-btn-ghost" onClick={() => enviarWhatsapp(r)}>
                        <MessageCircle size={14} /> {copiadoId === r.id ? "Abriendo WhatsApp…" : "Ofrecer solución por WhatsApp"}
                      </button>
                    ) : (
                      <span className="dg-pago-meta">Cargá el celular del cliente para poder escribirle.</span>
                    )}
                    <button className="dg-btn-primary" onClick={() => finalizar(r.id)}><CheckCircle2 size={14} /> Marcar como finalizado</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EnviosLogisticaPanel({ pedidos, onChange, canEdit }) {
  const confirmados = pedidos
    .filter((p) => esPedidoConEnvio(p) && p.clienteAvisado && p.envioConfirmado && p.estado === "Espejo listo")
    .sort((a, b) => (a.listo || "9999").localeCompare(b.listo || "9999"));

  const grupoIdCounts = confirmados.reduce((acc, p) => {
    if (p.grupoId) acc[p.grupoId] = (acc[p.grupoId] || 0) + 1;
    return acc;
  }, {});
  const gruposMap = confirmados.reduce((acc, p) => {
    const normal = (valor) => String(valor || "").trim().toLowerCase();
    const comparteGrupo = p.grupoId && grupoIdCounts[p.grupoId] > 1;
    const key = comparteGrupo
      ? `grupo:${p.grupoId}`
      : `entrega:${normal(p.cliente)}|${normal(p.celular)}|${normal(p.detalleEntrega)}|${p.listo || ""}`;
    if (!acc[key]) acc[key] = { key, pedidos: [] };
    acc[key].pedidos.push(p);
    return acc;
  }, {});
  const entregas = Object.values(gruposMap)
    .map((grupo) => ({ ...grupo, pedidos: grupo.pedidos.sort((a, b) => (a.orden || 0) - (b.orden || 0)) }))
    .sort((a, b) => (a.pedidos[0]?.listo || "9999").localeCompare(b.pedidos[0]?.listo || "9999"));

  function setEnvioPagadoGrupo(items, pagado) {
    const ids = new Set(items.map((p) => p.id));
    onChange(pedidos.map((p) => (ids.has(p.id) ? { ...p, envioPagado: pagado } : p)));
  }
  function marcarEntregado(pedido) {
    if (!pedido.clienteAvisado || !pedido.envioConfirmado || pedido.estado !== "Espejo listo") {
      window.alert("PostVenta debe confirmar al cliente y el envío antes de habilitar la entrega.");
      return;
    }
    onChange(pedidos.map((p) => (p.id === pedido.id ? { ...p, estado: "Entregado", entregadoFecha: new Date().toISOString() } : p)));
  }
  function datoEntrega(items, field, fallback) {
    const pedido = items.find((p) => String(p[field] || "").trim());
    return pedido ? pedido[field] : fallback;
  }
  function controlesEspejo(p) {
    return (
      <FlujoPedido pedido={p} canEdit={canEdit} onEntregar={marcarEntregado} />
    );
  }

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>Estos son los envíos que PostVenta ya confirmó con el cliente, ordenados por fecha estimada.</p>
      <div className="dg-task-list dg-logistics-list">
        {entregas.length === 0 && <div className="dg-empty">No hay envíos confirmados pendientes de entregar.</div>}
        {entregas.map((grupo) => {
          const items = grupo.pedidos;
          const principal = items[0];
          const nombre = datoEntrega(items, "cliente", "Sin nombre");
          const telefono = datoEntrega(items, "celular", "Sin teléfono");
          const direccion = datoEntrega(items, "detalleEntrega", "Sin dirección");
          const piso = datoEntrega(items, "piso", "Sin piso / timbre");
          const fecha = datoEntrega(items, "listo", "Sin fecha");
          const saldo = items.reduce((total, p) => total + Math.max(0, pedidoSaldo(p)), 0);
          const costoEnvio = items.reduce((mayor, p) => Math.max(mayor, costoEnvioPedido(p)), 0);
          const pedidosConCosto = items.filter((p) => costoEnvioPedido(p) > 0);
          const envioPagado = costoEnvio > 0 && pedidosConCosto.every((p) => Boolean(p.envioPagado));
          const envioPendiente = envioPagado ? 0 : costoEnvio;
          const totalACobrar = saldo + envioPendiente;
          const medidas = items.map((p) => `${p.ancho}×${p.alto} cm`).join(" · ");
          const ordenes = [...new Set(items.map((p) => p.orden))].map((orden) => `#${orden}`).join(" · ");
          return (
            <article className="dg-section-card dg-logistics-card" key={grupo.key}>
              <div className="dg-logistics-head">
                <span><Truck size={15} /> Entrega confirmada</span>
                <strong>{ordenes}</strong>
                <time>{fecha}</time>
              </div>

              <div className="dg-logistics-data">
                <div className="dg-logistics-datum dg-logistics-name">
                  <span><User size={13} /> Nombre</span>
                  <strong>{nombre}</strong>
                </div>
                <div className="dg-logistics-datum dg-logistics-phone">
                  <span><Phone size={13} /> Teléfono</span>
                  <strong>{telefono}</strong>
                </div>
                <div className="dg-logistics-datum dg-logistics-address">
                  <span><MapPin size={13} /> Dirección</span>
                  <strong>{direccion}</strong>
                </div>
                <div className="dg-logistics-datum dg-logistics-floor">
                  <span><Building2 size={13} /> Piso / Timbre</span>
                  <strong>{piso}</strong>
                </div>
                <div className="dg-logistics-datum dg-logistics-mirror-total">
                  <span><Package size={13} /> Espejos</span>
                  <strong>{totalUnidades(items)} {totalUnidades(items) === 1 ? "espejo" : "espejos"}</strong>
                  <small>{medidas}</small>
                </div>
                <div className={`dg-logistics-datum dg-logistics-balance ${saldo > 0 ? "dg-logistics-balance-pending" : "dg-logistics-balance-paid"}`}>
                  <span><CircleDollarSign size={13} /> Saldo restante</span>
                  <strong>{saldo > 0 ? money(saldo) : "Saldado"}</strong>
                  <small>Solo espejos</small>
                </div>
                <div className={`dg-logistics-datum dg-logistics-shipping ${costoEnvio <= 0 ? "dg-logistics-shipping-missing" : envioPagado ? "dg-logistics-shipping-paid" : "dg-logistics-shipping-pending"}`}>
                  <span><Truck size={13} /> Monto del envío</span>
                  <strong>{costoEnvio > 0 ? money(costoEnvio) : "Sin cargar"}</strong>
                  <small>{costoEnvio <= 0 ? "Falta definir cuánto se paga al flete" : envioPagado ? "Envío pagado" : "Pendiente de pago"}</small>
                </div>
                <div className={`dg-logistics-datum dg-logistics-total ${totalACobrar > 0 ? "dg-logistics-balance-pending" : "dg-logistics-balance-paid"}`}>
                  <span><CircleDollarSign size={13} /> Total a cobrar</span>
                  <strong>{totalACobrar > 0 ? money(totalACobrar) : "Saldado"}</strong>
                  <small>{envioPendiente > 0 ? "Incluye el envío pendiente" : "No suma un envío ya pagado"}</small>
                </div>
              </div>

              {canEdit && costoEnvio > 0 && (
                <div className="dg-logistics-shipping-action">
                  <button className={`dg-fabrica-btn ${envioPagado ? "dg-fabrica-btn-listo dg-checkbox-on" : ""}`} onClick={() => setEnvioPagadoGrupo(items, !envioPagado)}>
                    <CircleDollarSign size={16} /> {envioPagado ? `Envío pagado · ${money(costoEnvio)}` : `Marcar envío pagado · ${money(costoEnvio)}`}
                  </button>
                </div>
              )}

              {items.length > 1 ? (
                <div className="dg-logistics-mirrors">
                  {items.map((p, index) => (
                    <details className="dg-logistics-mirror" key={p.id}>
                      <summary>
                        <span>Espejo {index + 1}</span>
                        <strong>{p.ancho}×{p.alto} cm · {p.forma}</strong>
                        <small>#{p.orden}</small>
                        <ChevronRight size={16} />
                      </summary>
                      <div className="dg-logistics-mirror-body">{controlesEspejo(p)}</div>
                    </details>
                  ))}
                </div>
              ) : (
                <div className="dg-logistics-single">
                  <div className="dg-logistics-single-head"><span>Espejo</span><strong>{principal.ancho}×{principal.alto} cm · {principal.forma}</strong></div>
                  {controlesEspejo(principal)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function StockMaterialesPanel({ stock, onChange, canEdit, puedeBorrar = true }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(MATERIAL_CATEGORIAS[0]);
  const [unidad, setUnidad] = useState("u");
  const [cantidad, setCantidad] = useState("");
  const [minimo, setMinimo] = useState("");
  const [filtroCat, setFiltroCat] = useState("todas");

  function addItem() {
    if (!nombre.trim()) return;
    onChange([...stock, { id: uid(), nombre: nombre.trim(), categoria, unidad: unidad.trim() || "u", cantidad: Number(cantidad) || 0, minimo: Number(minimo) || 0 }]);
    setNombre(""); setCantidad(""); setMinimo("");
  }
  function update(id, patch) { onChange(stock.map((s) => (s.id === id ? { ...s, ...patch } : s))); }
  function removeItem(id) { onChange(stock.filter((s) => s.id !== id)); }
  function cargarLista() {
    const existentes = new Set(stock.map((s) => s.nombre.toLowerCase()));
    const nuevos = DEFAULT_MATERIALES.filter((m) => !existentes.has(m.nombre.toLowerCase()))
      .map((m) => ({ id: uid(), ...m, cantidad: 0 }));
    onChange([...stock, ...nuevos]);
  }

  const bajos = stock.filter((s) => Number(s.cantidad) <= Number(s.minimo));
  const cats = MATERIAL_CATEGORIAS.filter((c) => stock.some((s) => s.categoria === c));
  const visibles = filtroCat === "todas" ? stock : stock.filter((s) => s.categoria === filtroCat);
  const porCategoria = cats
    .filter((c) => filtroCat === "todas" || c === filtroCat)
    .map((c) => ({ categoria: c, items: visibles.filter((s) => s.categoria === c) }));

  return (
    <div className="dg-page">
      {bajos.length > 0 && (
        <div className="dg-comision-banner" style={{ background: "rgba(var(--dg-danger-rgb),0.08)", borderColor: "rgba(var(--dg-danger-rgb),0.3)", color: "var(--dg-danger)" }}>
          <span><AlertTriangle size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />{bajos.length} material(es) en el mínimo o por debajo — hay que reponer.</span>
        </div>
      )}

      {canEdit && stock.length === 0 && (
        <button className="dg-btn-ghost dg-suggest-btn" onClick={cargarLista}>
          <Sparkles size={14} /> Cargar la lista de materiales que usamos (21 ítems)
        </button>
      )}

      {canEdit && stock.length > 0 && (
        <div className="dg-section-card">
          <div className="dg-section-header"><PackagePlus size={14} /> Agregar material</div>
          <EnterFlow onSubmit={addItem} autoFocus={false}>
          <div className="dg-field-grid">
            <Field label="Material"><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></Field>
            <Field label="Categoría"><select value={categoria} onChange={(e) => setCategoria(e.target.value)}>{MATERIAL_CATEGORIAS.map((c) => (<option key={c}>{c}</option>))}</select></Field>
            <Field label="Unidad"><input value={unidad} onChange={(e) => setUnidad(e.target.value)} placeholder="u" /></Field>
            <Field label="Cantidad"><input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} /></Field>
            <Field label="Mínimo de alerta"><input type="number" value={minimo} onChange={(e) => setMinimo(e.target.value)} /></Field>
          </div>
          </EnterFlow>
          <div className="dg-form-actions"><button className="dg-btn-primary" onClick={addItem}><Plus size={16} /> Agregar</button></div>
        </div>
      )}

      {stock.length > 0 && (
        <div className="dg-crm-filters">
          <Filter size={14} />
          <select value={filtroCat} onChange={(e) => setFiltroCat(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {cats.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          {canEdit && <button className="dg-btn-ghost" onClick={cargarLista}><Sparkles size={14} /> Completar faltantes de la lista base</button>}
        </div>
      )}

      {stock.length === 0 && <div className="dg-empty">No hay materiales cargados todavía.</div>}

      {porCategoria.map((g) => g.items.length > 0 && (
        <div className="dg-section-card" key={g.categoria}>
          <div className="dg-section-header"><Package size={14} /> {g.categoria}</div>
          <div className="dg-task-list" style={{ marginBottom: 0 }}>
            {g.items.map((s) => {
              const bajo = Number(s.cantidad) <= Number(s.minimo);
              return (
                <div className="dg-task" key={s.id}>
                  <div className="dg-pago-info">
                    <span>{s.nombre}</span>
                    {canEdit ? (
                      <span className="dg-pago-meta dg-stock-minimo-editable">
                        Mínimo:
                        <input type="number" className="dg-stock-minimo-input" value={s.minimo} onChange={(e) => update(s.id, { minimo: Number(e.target.value) || 0 })} />
                        <input className="dg-stock-unidad-input" value={s.unidad} onChange={(e) => update(s.id, { unidad: e.target.value })} placeholder="u" />
                      </span>
                    ) : (
                      <span className="dg-pago-meta">mínimo: {s.minimo} {s.unidad}</span>
                    )}
                  </div>
                  {bajo && <span className="dg-badge" style={{ "--bc": "var(--dg-danger)" }}>Reponer</span>}
                  <input type="number" className="dg-stock-cantidad" style={bajo ? { color: "var(--dg-danger)", borderColor: "rgba(var(--dg-danger-rgb),0.4)" } : undefined}
                    disabled={!canEdit} value={s.cantidad} onChange={(e) => update(s.id, { cantidad: Number(e.target.value) || 0 })} />
                  {!canEdit && <span className="dg-stock-unidad">{s.unidad}</span>}
                  {canEdit && puedeBorrar && <button className="dg-icon-btn dg-task-del" onClick={() => removeItem(s.id)}><Trash2 size={14} /></button>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
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
          <EnterFlow onSubmit={addItem} autoFocus={false}>
          <div className="dg-field-grid">
            <Field label="Modelo / código"><input value={modelo} onChange={(e) => setModelo(e.target.value)} /></Field>
            <Field label="Descripción"><input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: 70Ø - Esmerilado" /></Field>
            <Field label="Espesor"><input value={espesor} onChange={(e) => setEspesor(e.target.value)} placeholder="4mm" /></Field>
          </div>
          <div className="dg-field-grid" style={{ marginTop: 12 }}>
            <Field label="Funciones"><input value={funciones} onChange={(e) => setFunciones(e.target.value)} placeholder="Touch 3 tonos + Desempañante" /></Field>
            <Field label="Cantidad"><input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} /></Field>
          </div>
          </EnterFlow>
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

function FabricaPedidosPage({ pedidos, onChange, canEdit, puedeBorrar = true, session, onRegistrar }) {
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [busqueda, setBusqueda] = useState("");
  const [lista, setLista] = useState("armar");
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [pedidoParaCancelar, setPedidoParaCancelar] = useState(null);
  const [pedidoParaReabrir, setPedidoParaReabrir] = useState(null);
  const [gruposArmarAbiertos, setGruposArmarAbiertos] = useState(() => new Set()); // vacío = los 3 empiezan cerrados
  function toggleGrupoArmar(grupo) {
    setGruposArmarAbiertos((prev) => {
      const next = new Set(prev);
      if (next.has(grupo)) next.delete(grupo); else next.add(grupo);
      return next;
    });
  }

  // Fábrica solo ve pedidos ya verificados por PostVenta. Los "Sin pasar a fábrica" no aparecen.
  const enFabrica = pedidos.filter((p) => p.estado !== "Sin pasar a fábrica" && p.estado !== "Cancelado");
  const activos = enFabrica.filter((p) => !pedidoEstaListo(p));
  const historial = enFabrica.filter((p) => pedidoEstaListo(p));
  const demorados = activos.filter((p) => p.demorado);
  let baseVisibles = filtroEstado === "activos"
    ? activos
    : filtroEstado === "historial"
      ? historial
      : filtroEstado === "demorados"
        ? demorados
        : enFabrica;
  baseVisibles = baseVisibles
    .filter((p) => !busqueda.trim() || String(p.cliente || "").toLowerCase().includes(busqueda.toLowerCase()));
  const listaCounts = TALLER_LISTAS.reduce((acc, item) => {
    acc[item.id] = totalUnidades(baseVisibles.filter((p) => pedidoListaFabrica(p) === item.id));
    return acc;
  }, {});
  let visibles = filtroEstado === "historial" ? [...baseVisibles] : baseVisibles.filter((p) => pedidoListaFabrica(p) === lista);
  visibles = filtroEstado === "historial"
    ? visibles.sort((a, b) => (b.produccionListaFecha || b.fecha || "").localeCompare(a.produccionListaFecha || a.fecha || ""))
    : lista === "armar"
    ? visibles.sort((a, b) => {
        const pa = prioridadListaArmar(a), pb = prioridadListaArmar(b);
        if (pa !== pb) return pa - pb;
        if (!a.listo && !b.listo) return (b.orden || 0) - (a.orden || 0);
        if (!a.listo) return 1;
        if (!b.listo) return -1;
        return a.listo < b.listo ? -1 : a.listo > b.listo ? 1 : 0;
      })
    : visibles.sort((a, b) => {
        if (!a.listo && !b.listo) return (b.orden || 0) - (a.orden || 0);
        if (!a.listo) return 1;
        if (!b.listo) return -1;
        return a.listo < b.listo ? -1 : a.listo > b.listo ? 1 : 0;
      });

  function setEstado(id, estado) {
    onChange(pedidos.map((p) => {
      if (p.id !== id) return p;
      if (estado === "Espejo listo" && p.estado !== "Espejo listo") {
        return { ...p, estado, produccionListaFecha: new Date().toISOString(), clienteAvisado: false, clienteAvisadoFecha: "", envioConfirmado: false, envioConfirmadoFecha: "" };
      }
      if (p.estado === "Espejo listo" && estado !== "Espejo listo") {
        return { ...p, estado, produccionListaFecha: "", clienteAvisado: false, clienteAvisadoFecha: "", envioConfirmado: false, envioConfirmadoFecha: "" };
      }
      return { ...p, estado };
    }));
    setMenuAbierto(null);
  }
  function avanzarProduccion(id) {
    const ahora = new Date().toISOString();
    const pedidoActual = pedidos.find((p) => p.id === id);
    const pasoActual = PRODUCCION_PASOS[pasosProduccionCompletados(pedidoActual)];
    const responsable = session?.nombre || (session?.role === "admin" ? "Administrador" : "Fábrica");
    onChange(pedidos.map((p) => {
      if (p.id !== id) return p;
      const completados = pasosProduccionCompletados(p);
      const paso = PRODUCCION_PASOS[completados];
      if (!paso) return p;
      const esUltimoPaso = paso.id === "embalado";
      const actualizado = {
        ...p,
        estado: p.estado === "Pasado a fábrica" ? "Verificado" : p.estado,
        produccionEtapa: paso.id,
        [paso.fechaCampo]: ahora,
        [paso.responsableCampo]: responsable,
      };
      if (paso.id === "cortado" && pedidoProcesoTaller(p) === "esmerilados") {
        return { ...actualizado, estado: "Mandar a grabar" };
      }
      if (!esUltimoPaso) return actualizado;
      return {
        ...actualizado,
        estado: "Espejo listo",
        produccionListaFecha: ahora,
        clienteAvisado: false,
        clienteAvisadoFecha: "",
        envioConfirmado: false,
        envioConfirmadoFecha: "",
      };
    }));
    if (onRegistrar && pedidoActual && pasoActual) onRegistrar("Actualizó producción", `#${pedidoActual.orden} — ${pedidoActual.cliente} — ${pasoActual.label}`);
  }
  function avanzarFlujoFabrica(id) {
    const pedidoActual = pedidos.find((p) => p.id === id);
    if (!pedidoActual) return;
    const cola = pedidoListaFabrica(pedidoActual);
    if (cola === "armar") {
      avanzarProduccion(id);
      return;
    }

    const ahora = new Date().toISOString();
    const responsable = session?.nombre || (session?.role === "admin" ? "Administrador" : "Fábrica");
    let cambios = null;
    let accion = "Actualizó producción externa";
    let detalle = "";

    if (cola === "mandar_grabar") {
      cambios = { estado: "En grabado", grabadoEnviadoFecha: ahora, grabadoEnviadoPor: responsable };
      accion = "Envió a grabar";
      detalle = "enviado a grabado";
    } else if (cola === "en_grabado") {
      cambios = { estado: "Para armar", grabadoRegresoFecha: ahora, grabadoRegresoPor: responsable };
      accion = "Recibió de grabado";
      detalle = "volvió de grabado y queda para armar";
    } else if (cola === "bisel_sin_pedir") {
      cambios = { estado: "En biseladora", biseladoPedidoFecha: ahora, biseladoPedidoPor: responsable };
      accion = "Pidió biselado";
      detalle = "biselado pedido y enviado a biseladora";
    } else if (cola === "bisel_pedidos") {
      cambios = {
        estado: "Para armar",
        biseladoRegresoFecha: ahora,
        biseladoRegresoPor: responsable,
        produccionEtapa: "cortado",
        produccionCortadoFecha: ahora,
        produccionCortadoPor: `Biseladora · recibido por ${responsable}`,
      };
      accion = "Recibió de biseladora";
      detalle = "volvió cortado y biselado; queda para armar";
    }

    if (!cambios) return;
    onChange(pedidos.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    if (onRegistrar) onRegistrar(accion, `#${pedidoActual.orden} — ${pedidoActual.cliente} — ${detalle}`);
  }
  const esAdmin = session?.role === "admin";
  function reabrirProduccion(id) { setMenuAbierto(null); setPedidoParaReabrir(id); }
  function confirmarReabrirProduccion(motivo, etapaElegida) {
    // etapaElegida: "" (nada hecho, ni cortar) | "cortado" | "armado" (ya cortado y armado, falta embalar)
    // Solo el administrador puede elegir la etapa; los encargados siempre vuelven a "falta embalar" (el comportamiento de siempre).
    const etapa = esAdmin ? etapaElegida : "armado";
    const id = pedidoParaReabrir;
    const pedidoActual = pedidos.find((p) => p.id === id);
    onChange(pedidos.map((p) => {
      if (p.id !== id) return p;
      const esEsmerilado = pedidoProcesoTaller(p) === "esmerilados";
      const esBiselado = pedidoProcesoTaller(p) === "biselados";
      const cambiosBase = {
        ...p,
        produccionEtapa: etapa,
        produccionListaFecha: "", clienteAvisado: false, clienteAvisadoFecha: "",
        envioConfirmado: false, envioConfirmadoFecha: "", entregadoFecha: "",
        produccionEmbaladoFecha: "", produccionEmbaladoPor: "",
        motivoReproceso: motivo, cantidadReprocesos: (Number(p.cantidadReprocesos) || 0) + 1,
      };
      if (etapa === "armado") {
        // Ya cortado (y si vino de afuera, ya grabado/biselado) — falta armar y embalar.
        return { ...cambiosBase, estado: "Para armar" };
      }
      if (etapa === "cortado") {
        // Ya cortado, pero todavía no se armó ni se mandó a grabar/biselar si correspondía.
        return {
          ...cambiosBase,
          estado: esEsmerilado ? "Mandar a grabar" : esBiselado ? "Sin pedir" : "Verificado",
          produccionArmadoFecha: "", produccionArmadoPor: "",
        };
      }
      // etapa === "": nada hecho todavía, ni siquiera cortado — vuelve al principio de todo.
      return {
        ...cambiosBase,
        estado: "Verificado",
        produccionCortadoFecha: "", produccionCortadoPor: "",
        produccionArmadoFecha: "", produccionArmadoPor: "",
        grabadoEnviadoFecha: "", grabadoEnviadoPor: "", grabadoRegresoFecha: "", grabadoRegresoPor: "",
        biseladoPedidoFecha: "", biseladoPedidoPor: "", biseladoRegresoFecha: "", biseladoRegresoPor: "",
      };
    }));
    const etapaLabel = etapa === "armado" ? "falta embalar" : etapa === "cortado" ? "falta armar" : "no se empezó (falta cortar)";
    if (onRegistrar && pedidoActual) onRegistrar("Reabrió producción", `#${pedidoActual.orden} — ${pedidoActual.cliente} — ${etapaLabel} — motivo: ${motivo}`);
    setPedidoParaReabrir(null);
  }
  function toggleDemorado(id) { onChange(pedidos.map((p) => (p.id === id ? { ...p, demorado: !p.demorado } : p))); setMenuAbierto(null); }
  function cancelar(id) { setMenuAbierto(null); setPedidoParaCancelar(id); }
  function confirmarCancelar(motivo) {
    onChange(pedidos.map((p) => (p.id === pedidoParaCancelar ? { ...p, estado: "Cancelado", motivoCancelacion: motivo } : p)));
    setPedidoParaCancelar(null);
  }
  function borrar(id) { if (window.confirm("¿Borrar este pedido definitivamente? No se puede deshacer.")) { onChange(pedidos.filter((p) => p.id !== id)); setMenuAbierto(null); } }

  const fechaHoraProduccion = (value) => {
    if (!value) return "Sin registro";
    const fecha = new Date(value);
    if (Number.isNaN(fecha.getTime())) return "Sin registro";
    return fecha.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const renderCard = (p, unidad, totalUnidadesPedido) => {
    const listaActual = pedidoListaFabrica(p);
    const listaInfo = TALLER_LISTAS.find((item) => item.id === listaActual);
    const stage = pedidoEstaListo(p)
      ? (ESTADO_STAGE[p.estado] || { stage: p.estado || "Terminado", color: "var(--dg-success)" })
      : { stage: estadoProduccionLabel(p), color: listaInfo?.color || "var(--dg-text-dim)" };
    const entrega = ENTREGA_ESTILO[p.metodo] || ENTREGA_ESTILO.default;
    const procesoInfo = TALLER_MODELOS.find((item) => item.id === pedidoProcesoTaller(p));
    const funciones = funcionesPedido(p, true);
    const observaciones = detalleFabrica(p);
    const produccionCompletada = pasosProduccionCompletados(p);
    const proximoPaso = PRODUCCION_PASOS[produccionCompletada];
    const terminado = produccionCompletada >= PRODUCCION_PASOS.length;
    const pasosVisuales = pasosVisualesFabrica(p);
    const registros = registrosFabrica(p);
    const tieneRegistro = registros.some((registro) => registro.fecha);
    const accionPrincipal = listaActual === "mandar_grabar" ? "Marcar enviado a grabar"
      : listaActual === "en_grabado" ? "Marcar regreso del grabado"
      : listaActual === "bisel_sin_pedir" ? "Pedir biselado"
      : listaActual === "bisel_pedidos" ? "Marcar regreso de biseladora"
      : proximoPaso?.accion || "Continuar producción";
    const menuOpen = menuAbierto === p.id;
    return (
      <div className={`dg-fab-card dg-fab-${entrega.clase} ${terminado ? "dg-fab-terminado" : ""}`} key={totalUnidadesPedido > 1 ? `${p.id}-${unidad}` : p.id}>
        <div className="dg-fab-zona-datos">
          {totalUnidadesPedido > 1 && (
            <div className="dg-fab-unidad-badge">Unidad {unidad} de {totalUnidadesPedido} — mismo pedido, misma medida</div>
          )}
          <div className="dg-fab-head">
            <span className="dg-fab-orden">{p.orden}</span>
            <span className="dg-fab-cliente">{p.cliente || "Sin nombre"}</span>
            <span className="dg-fab-entrega" style={{ "--ec": entrega.color }}>{p.metodo}</span>
          </div>

          <div className="dg-fab-medida">
            <strong>{p.ancho} × {p.alto}</strong><small>cm</small>
            {Number(p.cant) > 1 && totalUnidadesPedido <= 1 && <span className="dg-fab-cant">× {p.cant}</span>}
          </div>

          <div className="dg-fab-linea">{p.forma} · {p.tipo} · <span className="dg-fab-tono">{p.tono || "—"}</span> · <span className="dg-fab-proceso" style={{ color: procesoInfo?.color }}>{procesoInfo?.label || "Simple"}</span></div>

          {funciones.length > 0 && (
            <div className="dg-fab-funciones">
              {funciones.map((f, i) => (<span className="dg-fab-func" key={i}>{f.label}</span>))}
            </div>
          )}

          {observaciones && <div className="dg-fab-obs"><span>Observaciones</span> {observaciones}</div>}
        </div>

        <div className="dg-fab-zona-proceso">
          <div className="dg-fab-steps" aria-label="Avance de producción">
            {pasosVisuales.map((paso, index) => (
              <span key={paso.id} className={`dg-fab-step ${paso.done ? "dg-fab-step-done" : ""}${paso.current ? " dg-fab-step-current" : ""}`}>
                {paso.done ? <Check size={11} /> : <em>{index + 1}</em>}{paso.label}
              </span>
            ))}
          </div>

          {tieneRegistro && (
            <details className="dg-fab-audit">
              <summary><ClipboardList size={12} /> Registro de fabricación</summary>
              <div>
                {registros.map((registro) => (
                  <span key={registro.label}>
                    <strong>{registro.label}</strong>
                    <time>{fechaHoraProduccion(registro.fecha)}</time>
                    <small>{registro.responsable || "Responsable sin registrar"}</small>
                  </span>
                ))}
              </div>
            </details>
          )}

          <div className="dg-fab-foot">
            <span className="dg-fab-foot-txt">
              {stage.stage}
              {p.listo && <span className="dg-fecha-entrega-badge"><CalendarDays size={11} /> {fechaEntregaCorta(p.listo)}</span>}
              {p.demorado && <span className="dg-fab-flag-demora"> · demorado</span>}
              {p.clienteAvisado && <span className="dg-fab-flag-ok"> · cliente avisado</span>}
            </span>
            {canEdit && (
              <div className="dg-fab-acciones">
                {!terminado && <button className="dg-fab-btn-listo" onClick={() => avanzarFlujoFabrica(p.id)}><Check size={14} /> {accionPrincipal}</button>}
                <div className="dg-fab-menu-wrap">
                  <button className="dg-icon-btn" aria-label="Más acciones" onClick={() => setMenuAbierto(menuOpen ? null : p.id)}><MoreVertical size={16} /></button>
                  {menuOpen && (
                    <>
                      <div className="dg-fab-menu-backdrop" onClick={() => setMenuAbierto(null)} />
                      <div className="dg-fab-menu">
                        {terminado && <button onClick={() => reabrirProduccion(p.id)}><RotateCcw size={13} /> Reabrir producción</button>}
                        <button onClick={() => toggleDemorado(p.id)}><AlertTriangle size={13} /> {p.demorado ? "Quitar demora" : "Marcar demorado"}</button>
                        <button onClick={() => cancelar(p.id)}><XCircle size={13} /> Cancelar pedido</button>
                        {puedeBorrar && <button className="dg-fab-menu-danger" onClick={() => borrar(p.id)}><Trash2 size={13} /> Borrar</button>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dg-page">
      {filtroEstado !== "historial" ? (
        <>
          <div className="dg-process-tabs dg-factory-queue-tabs" role="tablist" aria-label="Listas de fabricación">
            {TALLER_LISTAS.map((item) => (
              <button key={item.id} role="tab" aria-selected={lista === item.id} className={lista === item.id ? "dg-process-tab-on" : ""} style={{ "--pc": item.color }} onClick={() => setLista(item.id)}>
                <span>{item.label}<small>{listaCounts[item.id] || 0}</small></span>
              </button>
            ))}
          </div>
          <div className="dg-factory-queue-info" style={{ "--qc": TALLER_LISTAS.find((item) => item.id === lista)?.color }}>
            <strong>{TALLER_LISTAS.find((item) => item.id === lista)?.label}</strong>
            <span>{TALLER_LISTAS.find((item) => item.id === lista)?.description}</span>
          </div>
        </>
      ) : (
        <div className="dg-factory-queue-info" style={{ "--qc": "var(--dg-success)" }}><strong>Historial de fabricación</strong><span>Espejos terminados, con el registro de cada etapa.</span></div>
      )}
      <div className="dg-crm-filters">
        <Filter size={14} />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="activos">En producción ({activos.length})</option>
          <option value="historial">Historial de terminados ({historial.length})</option>
          <option value="demorados">Solo demorados ({demorados.length})</option>
          <option value="todos">Todos ({enFabrica.length})</option>
        </select>
        <input className="dg-pedido-search" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <button className="dg-btn-ghost" onClick={() => window.print()}><Printer size={14} /> Imprimir esta vista</button>
      </div>

      <div className="dg-fab-leyenda">
        <span style={{ "--ec": "#A66A75" }}>Interior</span>
        <span style={{ "--ec": "var(--dg-warning)" }}>Envío flex</span>
        <span style={{ "--ec": "var(--dg-accent)" }}>Envío</span>
        <span style={{ "--ec": "#8A9161" }}>Colocación</span>
        <span style={{ "--ec": "var(--dg-text-dim)" }}>Retira</span>
      </div>

      {visibles.length === 0 && <div className="dg-empty">{filtroEstado === "historial" ? "Todavía no hay espejos terminados en el historial." : `No hay espejos en “${TALLER_LISTAS.find((item) => item.id === lista)?.label || "esta lista"}”.`}</div>}
      <div className="dg-fab-lista">
        {lista === "armar" ? (() => {
          const mapaGrupos = new Map();
          visibles.forEach((p) => {
            const grupo = grupoListaArmar(p);
            if (!mapaGrupos.has(grupo)) mapaGrupos.set(grupo, []);
            mapaGrupos.get(grupo).push(p);
          });
          const grupos = [
            ...ORDEN_GRUPOS_ARMAR.filter((g) => mapaGrupos.has(g)),
            ...[...mapaGrupos.keys()].filter((g) => !ORDEN_GRUPOS_ARMAR.includes(g)),
          ].map((grupo) => ({ grupo, items: mapaGrupos.get(grupo) }));

          return grupos.map(({ grupo, items }) => {
            const abierto = gruposArmarAbiertos.has(grupo);
            const totalGrupo = items.reduce((a, p) => a + Math.max(1, Number(p.cant) || 1), 0);
            return (
              <div className="dg-fab-grupo-bloque" key={`grupo-${grupo}`}>
                <button type="button" className={`dg-fab-grupo-header ${abierto ? "dg-fab-grupo-abierto" : ""}`} onClick={() => toggleGrupoArmar(grupo)}>
                  <ChevronRight size={16} className="dg-fab-grupo-chevron" />
                  <span>{ETIQUETAS_GRUPO_ARMAR[grupo]}</span>
                  <span className="dg-fab-grupo-count">{totalGrupo}</span>
                </button>
                {abierto && items.flatMap((p) => {
                  const cant = Math.max(1, Number(p.cant) || 1);
                  if (cant <= 1) return [renderCard(p, 1, 1)];
                  return Array.from({ length: cant }, (_, i) => renderCard(p, i + 1, cant));
                })}
              </div>
            );
          });
        })() : visibles.flatMap((p) => {
          const cant = Math.max(1, Number(p.cant) || 1);
          if (cant <= 1) return [renderCard(p, 1, 1)];
          return Array.from({ length: cant }, (_, i) => renderCard(p, i + 1, cant));
        })}
      </div>

      <div className="dg-print-area dg-print-fabrica">
        <div className="dg-print-head">
          <div className="dg-print-brand">DECOGLASS — Fábrica</div>
          <div className="dg-print-sub">
            {filtroEstado === "historial" ? "Historial de fabricación" : TALLER_LISTAS.find((t) => t.id === lista)?.label || lista} — {new Date().toLocaleDateString("es-AR")} · {totalUnidades(visibles)} espejo(s)
          </div>
        </div>
        <table className="dg-print-table">
          <thead>
            <tr><th>Orden</th><th>Cliente</th><th>Medida</th><th>Forma / Tipo</th><th>Tono</th><th>Funciones</th><th>Entrega</th><th>Estado</th><th>Entrega estimada</th></tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td>#{p.orden}</td><td>{p.cliente}</td><td>{p.ancho}×{p.alto}{Number(p.cant) > 1 ? ` ×${p.cant}` : ""}</td>
                <td>{p.forma} / {p.tipo}</td><td>{p.tono}</td>
                <td>{funcionesPedido(p, true).map((f) => f.label).join(", ") || "—"}</td>
                <td>{p.metodo}</td><td>{p.estado}{p.demorado ? " (demorado)" : ""}</td><td>{p.listo || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pedidoParaCancelar && (
        <ModalMotivo
          titulo="¿Por qué se cancela este pedido?"
          opciones={MOTIVOS_CANCELACION}
          onCancelar={() => setPedidoParaCancelar(null)}
          onConfirmar={confirmarCancelar}
        />
      )}
      {pedidoParaReabrir && (
        <ModalMotivo
          titulo="¿Por qué hay que rehacerlo?"
          opciones={MOTIVOS_REPROCESO}
          onCancelar={() => setPedidoParaReabrir(null)}
          onConfirmar={confirmarReabrirProduccion}
          etapaOpciones={esAdmin ? [
            { value: "armado", label: "Ya está cortado y armado — falta embalar" },
            { value: "cortado", label: "Ya está cortado — falta armar" },
            { value: "", label: "No se empezó — falta cortar" },
          ] : undefined}
        />
      )}
    </div>
  );
}

function BibliotecaMarketingPanel({ biblioteca, onChange }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length === 0) return;
    setError(""); setSubiendo(true);
    try {
      const nuevos = [];
      for (const archivo of archivos) {
        const url = await documentosStore.subirArchivoMarketing(archivo);
        nuevos.push({ id: uid(), url, nombre: archivo.name, fecha: new Date().toISOString().slice(0, 10) });
      }
      onChange([...nuevos, ...(biblioteca || [])]);
    } catch (err) {
      setError("No se pudo subir. Revisá la conexión e intentá de nuevo.");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  async function borrar(item) {
    if (!window.confirm("¿Borrar este archivo de la biblioteca?")) return;
    try { await documentosStore.borrarArchivoMarketing(item.url); } catch (e) { /* si ya no existe, seguimos igual */ }
    onChange((biblioteca || []).filter((b) => b.id !== item.id));
  }

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>
        Subí fotos reales de tus espejos acá. Desde el Calendario de contenido las vas a poder usar como referencia para que la IA genere imágenes de marketing.
      </p>
      <div className="dg-form-actions" style={{ justifyContent: "flex-start", marginBottom: 16 }}>
        <label className="dg-btn-primary" style={{ cursor: "pointer" }}>
          {subiendo ? <Loader2 size={14} className="dg-spin" /> : <PackagePlus size={14} />} {subiendo ? "Subiendo..." : "Subir fotos"}
          <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={subiendo} style={{ display: "none" }} />
        </label>
      </div>
      {error && <div className="dg-error" style={{ marginBottom: 12 }}>{error}</div>}
      {(biblioteca || []).length === 0 && <div className="dg-empty">Todavía no subiste ninguna foto.</div>}
      <div className="dg-marketing-grid">
        {(biblioteca || []).map((item) => (
          <div className="dg-marketing-thumb" key={item.id}>
            <img src={item.url} alt={item.nombre} />
            <button type="button" className="dg-marketing-thumb-del" onClick={() => borrar(item)}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

const CONTENIDO_TIPOS = ["Historia", "Post", "Reel/Video", "Carrusel"];
const CONTENIDO_ESTADOS = ["Idea", "En progreso", "Listo", "Publicado"];

function emptyContenido() {
  return { id: uid(), fecha: new Date().toISOString().slice(0, 10), tipo: "Post", estado: "Idea", texto: "", imagenUrl: "", promptImagen: "" };
}

function CalendarioContenidoPanel({ contenido, onChange, biblioteca }) {
  const [editando, setEditando] = useState(null);
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [errorImagen, setErrorImagen] = useState("");

  const ordenado = [...(contenido || [])].sort((a, b) => (a.fecha < b.fecha ? -1 : 1));

  function guardar(item) {
    const existe = (contenido || []).some((c) => c.id === item.id);
    onChange(existe ? contenido.map((c) => (c.id === item.id ? item : c)) : [item, ...(contenido || [])]);
    setEditando(null);
  }
  function borrar(id) {
    if (!window.confirm("¿Borrar esta idea de contenido?")) return;
    onChange((contenido || []).filter((c) => c.id !== id));
  }

  async function generarImagen() {
    if (!editando?.promptImagen?.trim()) return;
    setErrorImagen(""); setGenerandoImagen(true);
    try {
      const resp = await fetch("/api/generar-imagen-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: editando.promptImagen.trim() }),
      });
      const datos = await resp.json();
      if (!resp.ok) throw new Error(datos?.error || "Falló la generación.");
      const url = await documentosStore.subirImagenGenerada(datos.base64);
      setEditando((d) => ({ ...d, imagenUrl: url }));
    } catch (err) {
      setErrorImagen(err.message || "No se pudo generar la imagen.");
    } finally {
      setGenerandoImagen(false);
    }
  }

  return (
    <div className="dg-page">
      <div className="dg-form-actions" style={{ justifyContent: "flex-start", marginBottom: 16 }}>
        <button className="dg-btn-primary" onClick={() => setEditando(emptyContenido())}><Plus size={14} /> Nueva idea de contenido</button>
      </div>

      {ordenado.length === 0 && <div className="dg-empty">Todavía no armaste ningún contenido.</div>}
      <div className="dg-task-list">
        {ordenado.map((c) => (
          <div className="dg-task dg-pago-row" key={c.id}>
            {c.imagenUrl && <img src={c.imagenUrl} alt="" className="dg-marketing-mini-thumb" />}
            <div className="dg-pago-info">
              <span>{c.tipo} — {c.texto ? c.texto.slice(0, 60) : "Sin texto todavía"}{c.texto?.length > 60 ? "…" : ""}</span>
              <span className="dg-pago-meta">{c.fecha} · {c.estado}</span>
            </div>
            <button className="dg-icon-btn" onClick={() => setEditando(c)}><Pencil size={14} /></button>
            <button className="dg-icon-btn dg-task-del" onClick={() => borrar(c.id)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {editando && (
        <div className="dg-overlay" onClick={() => setEditando(null)}>
          <div className="dg-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="dg-modal-head">
              <div className="dg-modal-title">{(contenido || []).some((c) => c.id === editando.id) ? "Editar contenido" : "Nueva idea de contenido"}</div>
              <button className="dg-icon-btn" onClick={() => setEditando(null)}><X size={18} /></button>
            </div>
            <div className="dg-form">
              <div className="dg-form-row">
                <div style={{ flex: 1 }}><label>Fecha</label><input type="date" value={editando.fecha} onChange={(e) => setEditando({ ...editando, fecha: e.target.value })} /></div>
                <div style={{ flex: 1 }}><label>Tipo</label>
                  <select value={editando.tipo} onChange={(e) => setEditando({ ...editando, tipo: e.target.value })}>
                    {CONTENIDO_TIPOS.map((t) => (<option key={t}>{t}</option>))}
                  </select>
                </div>
                <div style={{ flex: 1 }}><label>Estado</label>
                  <select value={editando.estado} onChange={(e) => setEditando({ ...editando, estado: e.target.value })}>
                    {CONTENIDO_ESTADOS.map((s) => (<option key={s}>{s}</option>))}
                  </select>
                </div>
              </div>
              <label>Texto / caption</label>
              <textarea rows={3} value={editando.texto} onChange={(e) => setEditando({ ...editando, texto: e.target.value })} placeholder="El texto que va a acompañar la publicación" />

              <label>Describí la imagen que querés generar</label>
              <input value={editando.promptImagen} onChange={(e) => setEditando({ ...editando, promptImagen: e.target.value })} placeholder="Ej: espejo redondo con luz cálida en un baño moderno minimalista" />
              <div className="dg-form-actions" style={{ justifyContent: "flex-start", marginTop: 6 }}>
                <button type="button" className="dg-btn-ghost dg-mini-btn" disabled={generandoImagen || !editando.promptImagen?.trim()} onClick={generarImagen}>
                  {generandoImagen ? <Loader2 size={13} className="dg-spin" /> : <Sparkles size={13} />} {generandoImagen ? "Generando..." : "Generar imagen con IA"}
                </button>
              </div>
              {errorImagen && <div className="dg-error" style={{ marginTop: 6 }}>{errorImagen}</div>}
              {editando.imagenUrl && (
                <div style={{ marginTop: 10 }}>
                  <img src={editando.imagenUrl} alt="Generada" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
                </div>
              )}
              {biblioteca && biblioteca.length > 0 && (
                <p className="dg-hint" style={{ marginTop: 8 }}>Tip: describí tu espejo real con detalle (forma, luz, ambiente) para que la imagen generada se le parezca lo más posible — no es una foto real, es una ilustración creada por IA.</p>
              )}
            </div>
            <div className="dg-form-actions">
              <button className="dg-btn-ghost" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="dg-btn-primary" onClick={() => guardar(editando)}><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AccesoKommoPanel({ kommoSubdominio, isAdmin }) {
  const configurado = kommoSubdominio?.trim();
  const link = configurado ? `https://${kommoSubdominio.trim()}.kommo.com` : null;

  return (
    <div className="dg-page">
      <div className="dg-section-card" style={{ textAlign: "center", padding: "36px 24px" }}>
        <ExternalLink size={32} style={{ color: "var(--dg-accent)", marginBottom: 12 }} />
        <h2 style={{ margin: "0 0 8px", fontFamily: "'Space Grotesk', sans-serif" }}>El CRM de DECOGLASS es Kommo</h2>
        <p className="dg-hint" style={{ maxWidth: 440, margin: "0 auto 20px" }}>
          Los leads, el seguimiento de clientes y el pipeline de ventas se manejan directamente en Kommo, no acá adentro.
        </p>
        {link ? (
          <a className="dg-btn-primary" href={link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex" }}>
            <ExternalLink size={15} /> Abrir Kommo
          </a>
        ) : (
          <div className="dg-empty" style={{ maxWidth: 440, margin: "0 auto" }}>
            {isAdmin
              ? <>Todavía no configuraste el subdominio de Kommo. Entrá a Ajustes → Integraciones para completarlo y que este botón funcione.</>
              : <>Todavía no está configurado el acceso directo a Kommo. Pedile a un administrador que lo complete en Ajustes.</>}
          </div>
        )}
      </div>
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
            <input placeholder="Nombre del cliente (opcional)" value={quickNombre} onChange={(e) => setQuickNombre(e.target.value)} onKeyDown={(e) => e.key === "Enter" && quickAdd()} autoFocus />
            {quickType === "venta_cerrada" && (
              <input type="number" placeholder="Monto vendido" value={quickMonto} onChange={(e) => setQuickMonto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && quickAdd()} />
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--dg-line-rgb),0.06)" vertical={false} />
            <XAxis dataKey="vendedor" stroke="var(--dg-text-dim)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--dg-text-dim)" fontSize={11} tickLine={false} axisLine={false} width={30} />
            <Tooltip contentStyle={{ background: "var(--dg-surface)", border: "1px solid rgba(var(--dg-line-rgb),0.1)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="Mensajes" fill="var(--dg-text-dim)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Respondieron" fill="var(--dg-accent)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Ventas" fill="var(--dg-success)" radius={[3, 3, 0, 0]} />
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
        <EnterFlow className="dg-form dg-pago-form" onSubmit={addLead}>
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
        </EnterFlow>
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

function LoginModal({ usuarios, sectors, onClose, onCreateUsuario, onSuccess }) {
  const [modo, setModo] = useState("entrar"); // "entrar" | "solicitar" | "solicitud-enviada"
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [rol, setRol] = useState("encargado");
  const [sectorId, setSectorId] = useState(sectors[0]?.id || "");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verClave, setVerClave] = useState(false);
  // El sistema ya está en uso (hay admins en el portero). El modo "crear primer
  // admin" no aplica más y además la lista vieja ya no se lee sin sesión.
  const bootstrap = false;

  // Entra con el usuario que la persona ya conoce, pero verificando contra el
  // portero (Supabase Auth). Si el portero no lo reconoce (o hay algún problema),
  // cae al sistema viejo como red de seguridad. El resto de la app no cambia:
  // la "session" tiene la misma forma de siempre.
  async function handleEntrar() {
    setError("");
    const usuario = nombre.trim();
    if (!usuario || !clave) return setError("Completá usuario y clave.");
    setCargando(true);
    try {
      const { data, error: errAuth } = await supabase.auth.signInWithPassword({
        email: usuarioAEmail(usuario),
        password: clave,
      });
      if (!errAuth && data?.user) {
        let perfil = null;
        try {
          const r = await supabase.from("profiles").select("nombre, rol, sector_id, aprobado").eq("id", data.user.id).maybeSingle();
          perfil = r.data;
        } catch (e) { /* decido abajo */ }
        if (!perfil) {
          await supabase.auth.signOut();
          return setError("Tu cuenta no está habilitada. Hablá con un administrador.");
        }
        if (perfil.aprobado === false) {
          await supabase.auth.signOut();
          return setError("Tu cuenta está pendiente de aprobación por un administrador.");
        }
        const rolReal = perfil.rol || "operario";
        const nombreMostrar = perfil.nombre || usuario;
        if (rolReal === "admin") onSuccess({ role: "admin", nombre: nombreMostrar, via: "portero" });
        else onSuccess({ role: "sector", sectorId: perfil.sector_id || null, tipo: rolReal, nombre: nombreMostrar, via: "portero" });
        return;
      }
      const match = usuarios.find((u) => u.nombre.trim().toLowerCase() === usuario.toLowerCase() && u.clave === clave);
      if (!match) return setError("Usuario o clave incorrectos.");
      if (match.aprobado === false) return setError("Tu cuenta todavía está pendiente de aprobación por un administrador.");
      if (match.rol === "admin") onSuccess({ role: "admin", nombre: match.nombre, via: "viejo" });
      else onSuccess({ role: "sector", sectorId: match.sectorId, tipo: match.rol, nombre: match.nombre, via: "viejo" });
    } catch (e) {
      setError("No se pudo iniciar sesión. Revisá tu conexión e intentá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function handleCrearPrimerAdmin() {
    setError("");
    if (!nombre.trim()) return setError("Elegí un nombre de usuario.");
    if (clave.length < 4) return setError("La clave debe tener al menos 4 caracteres.");
    if (clave !== clave2) return setError("Las claves no coinciden.");
    const nuevo = { id: uid(), nombre: nombre.trim(), clave, rol: "admin", sectorId: null, aprobado: true };
    onCreateUsuario(nuevo);
    onSuccess({ role: "admin", nombre: nuevo.nombre });
  }

  async function handleSolicitar() {
    setError("");
    if (!nombre.trim()) return setError("Elegí un nombre de usuario.");
    if (clave.length < 6) return setError("La clave debe tener al menos 6 caracteres.");
    if (clave !== clave2) return setError("Las claves no coinciden.");
    setCargando(true);
    try {
      const resp = await fetch("/api/solicitar-cuenta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: nombre.trim(), clave, rol, sectorId }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) return setError(data.error || "No se pudo enviar la solicitud.");
      setModo("solicitud-enviada");
    } catch (e) {
      setError("No se pudo conectar. Probá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  const submit = bootstrap ? handleCrearPrimerAdmin : modo === "solicitar" ? handleSolicitar : handleEntrar;

  if (modo === "solicitud-enviada") {
    return (
      <div className="dg-overlay" onClick={onClose}>
        <div className="dg-modal" onClick={(e) => e.stopPropagation()}>
          <div className="dg-modal-head"><div className="dg-modal-title">Solicitud enviada</div><button className="dg-icon-btn" onClick={onClose}><X size={18} /></button></div>
          <p className="dg-hint">
            Le llegó a un administrador para que la apruebe. Una vez aprobada, ya podés entrar con el mismo usuario y clave que elegiste.
          </p>
          <div className="dg-form-actions" style={{ justifyContent: "flex-end" }}>
            <button className="dg-btn-primary" onClick={onClose}>Entendido</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head"><div className="dg-modal-title">{bootstrap ? "Crear cuenta" : modo === "solicitar" ? "Solicitar cuenta" : "Iniciar sesión"}</div><button className="dg-icon-btn" onClick={onClose}><X size={18} /></button></div>
        <EnterFlow className="dg-form" onSubmit={submit}>
          {bootstrap && <p className="dg-hint">Primera vez que se usa el sistema: esta cuenta va a ser la de administrador principal.</p>}
          {!bootstrap && modo === "solicitar" && <p className="dg-hint">Un administrador tiene que aprobar tu solicitud antes de que puedas entrar con esta cuenta.</p>}
          <label>Usuario</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoCapitalize="off" autoCorrect="off" />
          <label>Clave{bootstrap || modo === "solicitar" ? " nueva" : ""}</label>
          <input type={verClave ? "text" : "password"} value={clave} onChange={(e) => setClave(e.target.value)} />
          {(bootstrap || modo === "solicitar") && (<><label>Repetir clave</label><input type={verClave ? "text" : "password"} value={clave2} onChange={(e) => setClave2(e.target.value)} /></>)}
          <button type="button" className="dg-btn-ghost" style={{ alignSelf: "flex-start", fontSize: 13, padding: "2px 4px", opacity: 0.85 }} onClick={() => setVerClave((v) => !v)}>
            {verClave ? "Ocultar clave" : "Ver clave"}
          </button>
          {!bootstrap && modo === "solicitar" && (
            <>
              <label>Sos</label>
              <select value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="encargado">Encargado de sector</option>
                <option value="operario">Operario de sector</option>
              </select>
              <label>Sector</label>
              <select value={sectorId} onChange={(e) => setSectorId(e.target.value)}>
                {sectors.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </>
          )}
          {error && <div className="dg-error">{error}</div>}
          <div className="dg-form-actions" style={{ justifyContent: "space-between" }}>
            {!bootstrap && (
              <button className="dg-btn-ghost" onClick={() => { setError(""); setModo(modo === "solicitar" ? "entrar" : "solicitar"); }}>
                {modo === "solicitar" ? "Ya tengo cuenta" : "No tengo cuenta"}
              </button>
            )}
            <button className="dg-btn-primary" onClick={submit} disabled={cargando}>{cargando ? "Entrando…" : bootstrap ? "Crear cuenta y entrar" : modo === "solicitar" ? "Enviar solicitud" : "Entrar"}</button>
          </div>
        </EnterFlow>
      </div>
    </div>
  );
}

function SectorTasksPanel({ sector, session, isAdmin, onUpdate, onRequestLogin }) {
  const [newTask, setNewTask] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(sector.encargado || "");
  const puedeMarcarTareas = isAdmin
    || (session?.role === "sector" && session.tipo === "encargado")
    || (session?.role === "sector" && session.tipo === "operario" && session.sectorId === sector.id);
  const suggested = SUGGESTED_TASKS[sector.id] || [];

  function addTask() { if (!newTask.trim()) return; onUpdate({ tasks: [...sector.tasks, { id: uid(), text: newTask.trim(), completed: false }] }); setNewTask(""); }
  function removeTask(id) { onUpdate({ tasks: sector.tasks.filter((t) => t.id !== id) }); }
  function toggleTask(id) { onUpdate({ tasks: sector.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) }); }
  function loadSuggested() { onUpdate({ tasks: [...sector.tasks, ...suggested.map((text) => ({ id: uid(), text, completed: false }))] }); }
  function saveName() { onUpdate({ encargado: nameDraft.trim() }); setEditingName(false); }

  return (
    <div className="dg-page">
      <div className="dg-sector-meta-row">
        <div className="dg-encargado-box dg-encargado-box-compact">
          <User size={13} />
          {!editingName ? (<span>{sector.encargado || "Sin encargado asignado"}</span>) : (<input className="dg-inline-input" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus />)}
          {isAdmin && !editingName && (<button className="dg-icon-btn dg-encargado-edit" onClick={() => setEditingName(true)} title="Editar encargado"><Pencil size={12} /></button>)}
          {isAdmin && editingName && (<button className="dg-btn-primary dg-mini-btn" onClick={saveName}>Guardar</button>)}
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
              <button className={`dg-checkbox ${t.completed ? "dg-checkbox-on" : ""}`} disabled={!puedeMarcarTareas} onClick={() => toggleTask(t.id)} />
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

      {!puedeMarcarTareas && (
        <div className="dg-locked-note"><Lock size={14} /> Iniciá sesión como admin o como encargado de este sector para modificar tareas.
          <button className="dg-btn-ghost dg-inline-btn" onClick={onRequestLogin}>Iniciar sesión</button>
        </div>
      )}
    </div>
  );
}

function SectorPage({
  sector, session, isAdmin, onUpdate, onRequestLogin, onBack,
  pedidos, onChangePedidos, vendedores, onChangeVendedores, incomes, onChangeIncomes,
  purchases, onChangePurchases, quoteConfig, onChangeQuoteConfig, quotes, onChangeQuotes,
  leads, onChangeLeads, onCreateIncome, sectors, recursos, onChangeRecursos,
  facturas, onChangeFacturas, reclamos, onChangeReclamos, stockEspejos, onChangeStockEspejos,
  stockMateriales, onChangeStockMateriales,
  empleadosSueldo, onChangeEmpleadosSueldo, liquidaciones, onChangeLiquidaciones, onCreatePurchase,
  admins, onChangeAdmins, auditoria, onRegistrar, kommoSubdominio,
  proveedores, onChangeProveedores, gastosFijosPlantillas, onChangeGastosFijosPlantillas,
  bibliotecaMarketing, onChangeBibliotecaMarketing, contenidoMarketing, onChangeContenidoMarketing,
}) {
  const tabs = SECTOR_SUBPAGES[sector.id] || [{ id: "tareas", label: "Tareas" }];
  const [subpage, setSubpage] = useState(tabs[0].id);
  const Icon = ICONS[sector.icon];
  const { key } = getStatus(sector.tasks);
  const glow = STATUS[key].glow;
  const esEncargado = session?.role === "sector" && session.tipo !== "operario";
  const puedeBorrar = isAdmin || esEncargado; // los operarios no borran registros
  // Cualquier encargado (de cualquier sector) tiene acceso operativo completo a
  // Ventas, PostVenta, Fábrica y Logística. Lo único reservado para admin son
  // Finanzas, Comisiones y Sueldos (eso ya se controla aparte, con isAdmin).
  // Los operarios siguen limitados solo al sector donde tienen su usuario.
  //
  // EXCEPCIÓN: a pedido explícito, quien se registra como encargado u operario
  // de Fábrica queda encerrado en Fábrica — no puede ver ni abrir ningún otro
  // sector, ni siquiera de solo lectura. El resto de los sectores conserva el
  // acceso ampliado de arriba.
  const restringidoAFabrica = session?.role === "sector" && session.sectorId === "fabrica";
  if (restringidoAFabrica && sector.id !== "fabrica") {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, textAlign: "center", padding: "40px 20px", background: "#0C0C0D", color: "#F1F1EF" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(242,98,47,0.12)", border: "1px solid rgba(242,98,47,0.3)", color: "#F2622F" }}>
          <Lock size={26} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>No tenés acceso a {sector.name}</div>
          <p style={{ color: "#9C9C99", fontSize: 13.5, margin: 0, maxWidth: 320 }}>Tu usuario de Fábrica solo puede ver y trabajar dentro de Fábrica.</p>
        </div>
        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "12px 22px", borderRadius: 12, background: "#F2622F", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
        >
          <ArrowLeft size={17} /> Volver al edificio
        </button>
      </div>
    );
  }
  const canQuote = isAdmin || esEncargado;
  const canSeePedidos = !!session;
  const sessionSectorId = session?.role === "sector" ? session.sectorId : null;
  const canEditPedidoFull = isAdmin || esEncargado;
  const canEditFabrica = isAdmin || esEncargado;
  // El stock lo pueden cargar también los operarios de Fábrica (no solo el
  // encargado): es trabajo del día a día del taller, a pedido explícito.
  const esOperarioFabrica = session?.role === "sector" && session.tipo === "operario" && session.sectorId === "fabrica";
  const canEditStock = canEditFabrica || esOperarioFabrica;
  const canEditPostventa = isAdmin || esEncargado;
  const canEditLogistica = isAdmin || esEncargado;

  return (
    <div className="dg-sector-page">
      <section className="dg-sector-hero" style={{ "--glow": glow }}>
        <RoomScene sector={sector} />
        <div className="dg-sector-hero-content">
          <div className="dg-sector-hero-title">
            <div className="dg-sector-hero-icon">{Icon && <Icon size={22} />}</div>
            <div><h1>{sector.name}</h1><p>{SECTOR_DESCRIPTIONS[sector.id]}</p></div>
          </div>
          <div className="dg-sector-hero-meta">
            <span><User size={13} /> {sector.encargado || "Responsable por asignar"}</span>
            <span style={{ "--glow": glow }}><i /> {STATUS[key].label}</span>
          </div>
        </div>
      </section>

      {tabs.length > 1 && (
        <div className="dg-sector-workbar">
          <div className="dg-sector-tabs" role="tablist" aria-label={`Herramientas de ${sector.name}`}>
            {tabs.map((t) => {
              const TabIcon = SUBPAGE_ICONS[t.id] || FileText;
              return <button key={t.id} role="tab" aria-selected={subpage === t.id} className={`dg-sector-tab ${subpage === t.id ? "dg-sector-tab-on" : ""}`} onClick={() => setSubpage(t.id)}><TabIcon size={14} />{t.label}</button>;
            })}
          </div>
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
        canQuote ? <AccesoKommoPanel kommoSubdominio={kommoSubdominio} isAdmin={isAdmin} />
          : <LockedPage label="El CRM" onLogin={onRequestLogin} />
      )}

      {subpage === "biblioteca" && sector.id === "marketing" && (
        <BibliotecaMarketingPanel biblioteca={bibliotecaMarketing} onChange={onChangeBibliotecaMarketing} />
      )}

      {subpage === "calendario" && sector.id === "marketing" && (
        <CalendarioContenidoPanel contenido={contenidoMarketing} onChange={onChangeContenidoMarketing} biblioteca={bibliotecaMarketing} />
      )}

      {subpage === "recursos" && <RecursosVentaPanel recursos={recursos} onChange={onChangeRecursos} isAdmin={isAdmin} />}

      {subpage === "pedidos" && sector.id !== "fabrica" && (
        canSeePedidos ? (
          <PedidosPage pedidos={pedidos} onChange={onChangePedidos} vendedores={vendedores} canEditFull={canEditPedidoFull} puedeBorrar={puedeBorrar} sessionSectorId={sessionSectorId} incomes={incomes} onCreateIncome={onCreateIncome} onRegistrar={onRegistrar} kommoSubdominio={kommoSubdominio} stockEspejos={stockEspejos} onChangeStockEspejos={onChangeStockEspejos} />
        ) : <LockedPage label="Pedidos" onLogin={onRequestLogin} />
      )}

      {subpage === "pedidos" && sector.id === "fabrica" && (
        canSeePedidos ? <FabricaPedidosPage pedidos={pedidos} onChange={onChangePedidos} canEdit={canEditFabrica} puedeBorrar={puedeBorrar} session={session} onRegistrar={onRegistrar} />
          : <LockedPage label="Pedidos de fábrica" onLogin={onRequestLogin} />
      )}

      {subpage === "materiales" && sector.id === "fabrica" && (
        canSeePedidos ? <StockMaterialesPanel stock={stockMateriales} onChange={onChangeStockMateriales} canEdit={canEditStock} puedeBorrar={puedeBorrar} />
          : <LockedPage label="Stock de materiales" onLogin={onRequestLogin} />
      )}

      {subpage === "stock" && sector.id === "fabrica" && (
        canSeePedidos ? <StockEspejosPanel stock={stockEspejos} onChange={onChangeStockEspejos} canEdit={canEditStock} />
          : <LockedPage label="Stock de espejos" onLogin={onRequestLogin} />
      )}

      {subpage === "finanzas" && (
        isAdmin ? <FinanzasPanel
            incomes={incomes} purchases={purchases} sectors={sectors} onChangeIncomes={onChangeIncomes} onChangePurchases={onChangePurchases}
            proveedores={proveedores} onChangeProveedores={onChangeProveedores}
            gastosFijosPlantillas={gastosFijosPlantillas} onChangeGastosFijosPlantillas={onChangeGastosFijosPlantillas}
            empleadosSueldo={empleadosSueldo} liquidaciones={liquidaciones} pedidos={pedidos}
          />
          : <LockedPage label="Finanzas" onLogin={onRequestLogin} />
      )}

      {subpage === "comisiones" && (
        isAdmin ? <ComisionesPanel pedidos={pedidos} onChangePedidos={onChangePedidos} empleados={empleadosSueldo} onCreatePurchase={onCreatePurchase} />
          : <LockedPage label="Comisiones" onLogin={onRequestLogin} />
      )}

      {subpage === "sueldos" && (
        isAdmin ? <SueldosPanel empleados={empleadosSueldo} onChangeEmpleados={onChangeEmpleadosSueldo} liquidaciones={liquidaciones} onChangeLiquidaciones={onChangeLiquidaciones} pedidos={pedidos} />
          : <LockedPage label="Sueldos" onLogin={onRequestLogin} />
      )}

      {subpage === "envios" && sector.id === "postventa" && (
        canSeePedidos ? <EnviosPostventaPanel pedidos={pedidos} onChange={onChangePedidos} canEdit={canEditPostventa} />
          : <LockedPage label="Envíos" onLogin={onRequestLogin} />
      )}

      {subpage === "interior" && sector.id === "postventa" && (
        canSeePedidos ? <EnviosInteriorPanel pedidos={pedidos} onChange={onChangePedidos} canEdit={canEditPostventa} />
          : <LockedPage label="Envíos al interior" onLogin={onRequestLogin} />
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

const wrap = { minHeight: "100%", background: "var(--dg-bg)" };

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
      * { -webkit-tap-highlight-color: transparent; }
      .dg-app ::selection { background: rgba(var(--dg-accent-rgb),0.3); }
      .dg-app ::-webkit-scrollbar { width:9px; height:9px; }
      .dg-app ::-webkit-scrollbar-track { background: transparent; }
      .dg-app ::-webkit-scrollbar-thumb { background: rgba(var(--dg-line-rgb),0.13); border-radius:100px; }
      .dg-app ::-webkit-scrollbar-thumb:hover { background: rgba(var(--dg-line-rgb),0.22); }
      .dg-app {
        --dg-bg:#0C0C0D; --dg-surface:#19191A; --dg-surface-2:#212122; --dg-surface-3:#29292A;
        --dg-order-info:#242425; --dg-order-flow:#141415;
        --dg-line-rgb:235,235,233;
        --dg-text:#F1F1EF; --dg-text-dim:#9C9C99; --dg-text-faint:#6E6E6B;
        --dg-accent:#F2622F; --dg-accent-rgb:242,98,47; --dg-accent-2:#FF8352; --dg-on-accent:#FFFFFF;
        --dg-success:#7FA35C; --dg-success-rgb:127,163,92;
        --dg-warning:#D9A441; --dg-warning-rgb:217,164,65;
        --dg-danger:#C2574A; --dg-danger-rgb:194,87,74;
        --dg-shadow:rgba(0,0,0,.6);
        --bg:var(--dg-bg); --panel:rgba(var(--dg-line-rgb),.05); --panel-border:rgba(var(--dg-line-rgb),.22); --text:var(--dg-text); --text-dim:var(--dg-text-dim);
        font-family:'Inter', sans-serif; color: var(--text);
        color-scheme:dark;
        background:radial-gradient(ellipse 80% 45% at 50% -10%,rgba(var(--dg-accent-rgb),.06),transparent),var(--bg);
        min-height:100vh; min-height:100dvh;
        padding:calc(28px + env(safe-area-inset-top, 0px)) calc(16px + env(safe-area-inset-right, 0px)) calc(60px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px));
        box-sizing:border-box; transition: background .2s ease, color .2s ease; }
      .dg-app[data-theme="light"] {
        --dg-bg:#E6E3DE; --dg-surface:#FAF9F6; --dg-surface-2:#FFFFFF; --dg-surface-3:#DCD8D1;
        --dg-order-info:#FFFFFF; --dg-order-flow:#DDD8D0;
        --dg-line-rgb:35,34,31;
        --dg-text:#1F1F1D; --dg-text-dim:#5D5C57; --dg-text-faint:#74716A;
        --dg-accent:#C1501F; --dg-accent-rgb:193,80,31; --dg-accent-2:#A6431A; --dg-on-accent:#FFFFFF;
        --dg-success:#4E673D; --dg-success-rgb:78,103,61;
        --dg-warning:#805515; --dg-warning-rgb:128,85,21;
        --dg-danger:#A44F43; --dg-danger-rgb:164,79,67;
        --dg-shadow:rgba(65,52,39,.16);
        --panel:rgba(var(--dg-line-rgb),.05); --panel-border:rgba(var(--dg-line-rgb),.22);
        color-scheme:light;
        background:radial-gradient(ellipse 75% 42% at 50% -10%,rgba(var(--dg-accent-rgb),.07),transparent),var(--dg-bg);
      }
      .dg-app[data-theme="light"] .dg-room-tile,
      .dg-app[data-theme="light"] .dg-modal,
      .dg-app[data-theme="light"] .dg-fab-card,
      .dg-app[data-theme="light"] .dg-section-card,
      .dg-app[data-theme="light"] .dg-task-list { box-shadow:0 1px 3px rgba(65,52,39,.06); }
      .dg-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; min-height:60vh; color: var(--text-dim); }
      .dg-spin { animation: dg-spin 1s linear infinite; color:var(--dg-accent); }
      @keyframes dg-spin { to { transform: rotate(360deg); } }

      .dg-header { display:flex; align-items:center; justify-content:space-between; max-width:960px; margin:0 auto 18px; gap:12px; flex-wrap:wrap; }
      .dg-brand { display:flex; align-items:center; gap:12px; }
      .dg-brand-mark { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:15px; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: linear-gradient(145deg, rgba(var(--dg-accent-rgb),0.18), rgba(var(--dg-accent-rgb),0.04)); border:1px solid rgba(var(--dg-accent-rgb),0.35); color:var(--dg-accent); box-shadow: 0 0 18px rgba(var(--dg-accent-rgb),0.25); }
      .dg-brand-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:18px; letter-spacing:0.5px; }
      .dg-brand-sub { font-size:12px; color: var(--text-dim); }
      .dg-session { display:flex; align-items:center; gap:8px; }
      .dg-session-badge { display:flex; align-items:center; gap:6px; font-size:12px; padding:7px 12px; border-radius:100px; background: var(--panel); border:1px solid var(--panel-border); }
      .dg-login-btn, .dg-btn-primary { display:flex; align-items:center; gap:6px; font-family:'Inter',sans-serif; font-weight:600; font-size:13px; background: linear-gradient(145deg, var(--dg-accent), var(--dg-accent-2)); color:var(--dg-on-accent); border:none; border-radius:10px; padding:9px 14px; cursor:pointer; box-shadow: 0 2px 14px -2px rgba(var(--dg-accent-rgb),0.45); transition: filter .15s ease, transform .1s ease, box-shadow .15s ease; }
      .dg-login-btn:active, .dg-btn-primary:active { transform: scale(0.97); }
      .dg-login-btn:hover, .dg-btn-primary:hover { filter: brightness(1.08); }
      .dg-icon-btn { background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:6px; border-radius:8px; display:flex; transition: background .15s ease, color .15s ease; }
      .dg-theme-toggle { min-height:38px; gap:6px; border:1px solid rgba(var(--dg-line-rgb),0.1); padding:8px 10px; font-size:11px; font-weight:600; }
      .dg-theme-toggle:hover { color: var(--dg-accent); border-color: rgba(var(--dg-accent-rgb),0.4); background: rgba(var(--dg-accent-rgb),0.08); }
      .dg-icon-btn:hover { background: rgba(var(--dg-line-rgb),0.06); color:var(--text); }
      .dg-btn-ghost { background:transparent; border:1px solid var(--panel-border); color:var(--text-dim); border-radius:10px; padding:9px 14px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px; transition: color .15s ease, border-color .15s ease, background .15s ease; }
      .dg-btn-ghost:active { transform: scale(0.98); }
      .dg-btn-ghost:hover { color:var(--text); border-color: rgba(var(--dg-line-rgb),0.2); }
      .dg-inline-btn { padding:4px 10px; font-size:12px; margin-left:8px; }
      .dg-mini-btn { padding:5px 10px; font-size:12px; }
      .dg-btn-danger-ghost { color:var(--dg-danger); border-color:rgba(var(--dg-danger-rgb),0.35); }
      .dg-btn-danger-ghost:hover { background:rgba(var(--dg-danger-rgb),0.1); border-color:rgba(var(--dg-danger-rgb),0.55); }

      .dg-nav { display:flex; gap:6px; max-width:960px; margin:0 auto 26px; background: var(--panel); border:1px solid var(--panel-border); border-radius:12px; padding:4px; }
      .dg-nav-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:transparent; border:none; color:var(--text-dim); font-family:'Inter',sans-serif; font-size:13px; font-weight:600; padding:9px; border-radius:9px; cursor:pointer; position:relative; z-index:1; pointer-events:auto; touch-action:manipulation; }
      .dg-nav-on { background: rgba(var(--dg-accent-rgb),0.14); color:var(--dg-accent); }
      .dg-nav-breadcrumb { justify-content:flex-start; }
      .dg-nav-breadcrumb .dg-nav-btn { flex:none; }
      .dg-nav-crumb { cursor:default; }

      .dg-back-btn { display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid rgba(var(--dg-line-rgb),0.1); color:var(--dg-text-dim); border-radius:9px; padding:7px 12px; font-size:12.5px; font-weight:600; cursor:pointer; margin-bottom:14px; }
      .dg-back-btn:hover { color:var(--dg-text); border-color:rgba(var(--dg-line-rgb),0.2); }
      .dg-sector-page { max-width:760px; margin:0 auto; min-width:0; }
      .dg-sector-page-head { display:flex; align-items:center; gap:12px; margin-bottom:2px; flex-wrap:wrap; }
      .dg-sector-page-title { display:flex; align-items:center; gap:12px; flex:1; }
      .dg-sector-page-head-v2 { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
      .dg-back-circle { display:flex; align-items:center; justify-content:center; width:38px; height:38px; min-width:38px;
        border-radius:50%; background: rgba(var(--dg-line-rgb),0.05); border:1px solid rgba(var(--dg-line-rgb),0.12); color:var(--dg-text-dim); cursor:pointer;
        transition: all .15s ease; position:relative; z-index:41; pointer-events:auto; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
      .dg-back-circle:hover { background: rgba(var(--dg-accent-rgb),0.15); border-color: rgba(var(--dg-accent-rgb),0.4); color:var(--dg-accent); transform: translateX(-2px); }
      .dg-sector-page-title-v2 { display:flex; align-items:center; gap:10px; flex:1; min-width:0; }
      .dg-sector-page-name { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:17px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-sector-tabs { display:flex; gap:6px; flex-wrap:wrap; margin:14px 0 18px; border-bottom:1px solid rgba(var(--dg-line-rgb),0.08); padding-bottom:12px; }
      .dg-sector-tab { background:transparent; border:1px solid rgba(var(--dg-line-rgb),0.1); color:var(--dg-text-dim); border-radius:100px; padding:8px 15px; font-size:12.5px; font-weight:600; cursor:pointer; transition: all .15s ease; }
      .dg-sector-tab:hover { color:var(--dg-text); }
      .dg-sector-tab-on { background: rgba(var(--dg-accent-rgb),0.15); border-color:var(--dg-accent); color:var(--dg-accent); }

      .dg-room-enter { position:absolute; top:10px; right:10px; width:26px; height:26px; border-radius:50%; background: rgba(var(--dg-line-rgb),0.08); display:flex; align-items:center; justify-content:center; color:var(--dg-text); opacity:0; transform: translateX(-4px); transition: opacity 0.15s ease, transform 0.15s ease; }
      .dg-room-tile:hover .dg-room-enter { opacity:1; transform:translateX(0); }

      .dg-fabrica-card { cursor:default; min-width:0; }
      .dg-fabrica-actions { display:grid; grid-template-columns:repeat(auto-fit, minmax(96px, 1fr)); gap:6px; margin-top:8px; }
      .dg-fabrica-btn { min-width:0; display:flex; align-items:center; justify-content:center; gap:5px; padding:9px 6px; border-radius:9px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(var(--dg-line-rgb),0.1); background:var(--dg-surface); color:var(--dg-text-dim); white-space:nowrap; }
      .dg-fabrica-btn-listo:hover { border-color:var(--dg-success); color:var(--dg-success); }
      .dg-fabrica-btn-demora:hover { border-color:var(--dg-warning); color:var(--dg-warning); }
      .dg-fabrica-btn-undo { border-color: rgba(var(--dg-warning-rgb),0.5); color:var(--dg-warning); }
      .dg-fabrica-btn-demora-on { background: rgba(var(--dg-danger-rgb),0.14); border-color:var(--dg-danger); color:var(--dg-danger); }
      .dg-fabrica-btn-cancel:hover { border-color:var(--dg-danger); color:var(--dg-danger); }
      .dg-recurso-link { display:flex; align-items:center; gap:8px; color:var(--dg-accent); text-decoration:none; font-size:13px; flex:1; }
      .dg-recurso-link:hover { text-decoration:underline; }
      .dg-badge-entrega { --bc:var(--dg-warning); }

      .dg-month-accordion { display:flex; flex-direction:column; gap:10px; }
      .dg-month-group { border:1px solid rgba(var(--dg-line-rgb),0.07); border-radius:12px; overflow:hidden; }
      .dg-month-header { width:100%; display:flex; align-items:center; gap:8px; padding:12px 14px; background: rgba(var(--dg-line-rgb),0.025); border:none; color:var(--dg-text); font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13.5px; cursor:pointer; text-transform:capitalize; }
      .dg-month-chevron { transition: transform 0.15s ease; color:var(--dg-text-dim); }
      .dg-month-chevron-open { transform: rotate(90deg); }
      .dg-month-count { margin-left:auto; font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--dg-text-dim); background:var(--dg-surface); padding:2px 8px; border-radius:100px; }
      .dg-month-items { display:flex; flex-direction:column; gap:8px; padding:10px; }

      .dg-overview-head { max-width:960px; margin:0 auto 18px; padding:22px 24px; box-sizing:border-box; display:flex; align-items:flex-end; justify-content:space-between; gap:24px; background:linear-gradient(135deg,rgba(var(--dg-accent-rgb),.09),var(--dg-surface) 48%,rgba(var(--dg-line-rgb),.02)); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:18px; box-shadow:0 18px 50px -34px rgba(0,0,0,0.85); }

      .dg-panel-control { max-width:960px; }
      .dg-panel-grid { display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:12px; margin:18px 0 22px; }
      .dg-panel-card { background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:14px; padding:16px; }
      .dg-panel-card-label { font-size:11.5px; color:var(--dg-text-dim); font-weight:600; margin-bottom:8px; display:flex; align-items:center; gap:5px; }
      .dg-panel-info-btn { display:inline-flex; color:var(--dg-text-faint); background:none; border:none; padding:0; cursor:pointer; }
      .dg-panel-info-btn:hover { color:var(--dg-accent); }
      .dg-panel-card-valor { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:22px; }
      .dg-panel-card-variacion { display:flex; align-items:center; gap:5px; font-size:11.5px; margin-top:8px; color:var(--dg-text-faint); }
      .dg-panel-up { color:var(--dg-success); }
      .dg-panel-down { color:var(--dg-danger); }
      .dg-panel-alertas { display:flex; flex-direction:column; gap:6px; }
      .dg-panel-alerta-fila { display:flex; align-items:center; gap:9px; padding:8px 10px; background:rgba(var(--dg-line-rgb),0.03); border-left:3px solid var(--ac); border-radius:8px; font-size:13px; }
      .dg-panel-alerta-fila span { flex:1; color:var(--dg-text-dim); }
      .dg-panel-alerta-fila strong { color:var(--ac); font-family:'JetBrains Mono', monospace; }
      @media (max-width:900px) { .dg-panel-grid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
      .dg-overview-copy { min-width:0; }
      .dg-eyebrow { display:block; margin-bottom:6px; color:var(--dg-accent); font-size:10.5px; font-weight:700; letter-spacing:1.25px; text-transform:uppercase; }
      .dg-overview-copy h1 { margin:0; font-family:'Space Grotesk',sans-serif; font-size:24px; line-height:1.1; letter-spacing:-0.35px; }
      .dg-overview-copy p { margin:8px 0 0; max-width:470px; color:var(--text-dim); font-size:12.5px; line-height:1.5; }
      .dg-summary { display:flex; justify-content:flex-end; gap:7px; margin:0; flex-wrap:wrap; }
      .dg-chip { --c:#888; display:flex; align-items:center; gap:6px; font-size:12px; padding:6px 12px; border-radius:100px; background: var(--panel); border:1px solid var(--panel-border); color: var(--text-dim); font-family:'JetBrains Mono', monospace; }
      .dg-chip-dot { width:7px; height:7px; border-radius:50%; background: var(--c); box-shadow: 0 0 8px var(--c); }


      .dg-page { max-width:680px; margin:0 auto; min-width:0; }
      .dg-locked-page { display:flex; flex-direction:column; align-items:center; gap:12px; text-align:center; color: var(--text-dim); padding:60px 20px; background: var(--panel); border:1px solid var(--panel-border); border-radius:16px; }
      .dg-locked-page p { max-width:320px; font-size:13px; }

      .dg-totales { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
      .dg-cuenta-totales { margin-top:-6px; }
      .dg-iva-card { background:var(--dg-surface); border:1px solid rgba(var(--dg-warning-rgb),0.3); border-radius:12px; padding:14px; margin-bottom:16px; }
      .dg-iva-head { display:flex; flex-direction:column; gap:2px; margin-bottom:8px; }
      .dg-iva-head > div { display:flex; align-items:baseline; gap:10px; }
      .dg-iva-amount { font-family:'JetBrains Mono', monospace; font-size:20px; color:var(--dg-warning); }
      .dg-iva-note { font-size:11px; color:var(--dg-text-dim); }
      .dg-total-card { --c:#888; flex:1; min-width:120px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:12px; padding:13px 14px; display:flex; flex-direction:column; gap:5px; position:relative; overflow:hidden; }
      .dg-total-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background: var(--c); opacity:0.8; }
      .dg-total-card span { font-size:11px; color:var(--dg-text-dim); }
      .dg-total-card strong { font-family:'JetBrains Mono', monospace; font-size:16px; color: var(--c); }

      .dg-charts { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
      .dg-chart-card { flex:1; min-width:220px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:12px; padding:12px; }
      .dg-chart-title { font-size:12px; color:var(--dg-text-dim); margin-bottom:6px; font-family:'JetBrains Mono', monospace; }

      .dg-overlay { position:fixed; inset:0; background:#0A0A0B; display:flex; flex-direction:column; align-items:center; overflow-y:auto; padding:calc(16px + env(safe-area-inset-top, 0px)) calc(16px + env(safe-area-inset-right, 0px)) calc(16px + env(safe-area-inset-bottom, 0px)) calc(16px + env(safe-area-inset-left, 0px)); z-index:50; }
      .dg-overlay::before, .dg-overlay::after { content:""; display:block; flex:0 0 auto; margin:auto 0; }
      .dg-modal { font-family:'Inter', sans-serif; color:var(--dg-text); width:100%; max-width:400px; background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:18px; padding:20px; max-height:88vh; overflow-y:auto; box-shadow: 0 24px 60px -12px rgba(0,0,0,0.8); animation: dg-modal-in .18s ease-out; }
      @keyframes dg-modal-in { from { opacity:0; transform: translateY(8px) scale(0.99); } to { opacity:1; transform:none; } }
      .dg-modal-lg { max-width:540px; }
      .dg-modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
      .dg-modal-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:17px; }
      .dg-modal-icon { --glow:var(--dg-accent); width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--glow) 15%, transparent); color: var(--glow); border:1.5px solid color-mix(in srgb, var(--glow) 45%, transparent); }
      .dg-modal-sub { font-size:12px; color:var(--dg-text-dim); margin-top:2px; }
      .dg-encargado-box { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--dg-text-dim); background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:10px; padding:9px 12px; margin-bottom:14px; }
      .dg-sector-meta-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
      .dg-encargado-box-compact { flex:1; margin-bottom:0; padding:7px 10px; }
      .dg-status-pill { --glow:var(--dg-accent); font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color: var(--glow); background: color-mix(in srgb, var(--glow) 14%, transparent); border:1px solid color-mix(in srgb, var(--glow) 40%, transparent); border-radius:100px; padding:7px 12px; white-space:nowrap; }
      .dg-room-strip { --glow:var(--dg-accent); position:relative; height:74px; border-radius:10px; overflow:hidden; margin-bottom:14px; background:var(--dg-surface-2); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--glow) 30%, transparent); }
      .dg-task-table-wrap { background: rgba(var(--dg-line-rgb),0.025); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:14px; padding:4px; margin-bottom:14px; }
      .dg-task-table-head { display:flex; justify-content:space-between; align-items:center; padding:10px 12px 8px; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:var(--dg-text); }
      .dg-task-table-head span:last-child { font-family:'JetBrains Mono', monospace; color:var(--dg-accent); font-size:12px; }
      .dg-task-table { display:flex; flex-direction:column; max-height:340px; overflow-y:auto; }
      .dg-task-table-row { display:flex; align-items:center; gap:10px; padding:12px 12px; font-size:14px; border-top:1px solid rgba(var(--dg-line-rgb),0.05); }
      .dg-task-table-row:nth-child(even) { background: rgba(var(--dg-line-rgb),0.018); }
      .dg-task-table-row-done { opacity:0.6; }
      .dg-encargado-box span { color:var(--dg-text); }
      .dg-encargado-edit { margin-left:auto; }
      .dg-inline-input { flex:1; background:var(--dg-surface-2); border:1px solid rgba(var(--dg-accent-rgb),0.4); border-radius:6px; padding:5px 8px; color:var(--dg-text); font-size:13px; outline:none; }
      .dg-choice-grid { display:flex; flex-direction:column; gap:10px; }
      .dg-choice-btn { display:flex; flex-direction:column; align-items:flex-start; gap:4px; text-align:left; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:14px; padding:14px; color:var(--dg-text); cursor:pointer; }
      .dg-choice-btn:hover { border-color:var(--dg-accent); }
      .dg-choice-btn div { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:14px; margin-top:4px; }
      .dg-choice-btn span { font-size:12px; color:var(--dg-text-dim); }
      .dg-form { display:flex; flex-direction:column; gap:8px; }
      .dg-form label { font-size:12px; color:var(--dg-text-dim); margin-top:6px; display:block; }
      .dg-app, .dg-app *, .dg-modal, .dg-modal * { box-sizing: border-box; }
      .dg-app { overflow-x: hidden; }
      .dg-app, .dg-modal { color-scheme:inherit; }
      .dg-app select, .dg-app input, .dg-app textarea { color-scheme:inherit; }
      select option { background:var(--dg-surface); color:var(--dg-text); }
      .dg-form input, .dg-form select { width:100%; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:10px; padding:10px 12px; color:var(--dg-text); font-family:'Inter',sans-serif; font-size:14px; outline:none; box-sizing:border-box; }
      .dg-form input:focus, .dg-form select:focus { border-color:var(--dg-accent); }
      .dg-form-row { display:flex; gap:10px; }
      .dg-hint { font-size:12px; color:var(--dg-text-dim); background:rgba(var(--dg-accent-rgb),0.06); border:1px solid rgba(var(--dg-accent-rgb),0.2); border-radius:8px; padding:8px 10px; }
      .dg-error { font-size:12px; color:var(--dg-danger); }
      .dg-form-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:10px; }
      .dg-status-bar { display:flex; flex-direction:column; gap:6px; margin-bottom:18px; }
      .dg-status-track { height:6px; border-radius:100px; background:rgba(var(--dg-line-rgb),0.08); overflow:hidden; }
      .dg-status-fill { height:100%; border-radius:100px; transition: width 0.3s ease; }
      .dg-status-bar span { font-size:12px; font-family:'JetBrains Mono', monospace; }
      .dg-task-list { display:flex; flex-direction:column; margin-bottom:14px; max-height:280px; overflow-y:auto;
        border:1px solid rgba(var(--dg-line-rgb),0.07); border-radius:12px; background: rgba(var(--dg-line-rgb),0.015); }
      .dg-task-list:empty { display:none; }
      .dg-empty { font-size:13px; color:var(--dg-text-dim); padding:14px; text-align:center; border:1px dashed rgba(var(--dg-line-rgb),0.1); border-radius:10px; }
      .dg-task { display:flex; align-items:center; gap:10px; background:transparent; border:none; border-bottom:1px solid rgba(var(--dg-line-rgb),0.055);
        border-radius:0; padding:11px 13px; font-size:13px; transition: background .12s ease; }
      .dg-task:last-child { border-bottom:none; }
      .dg-task:hover { background: rgba(var(--dg-line-rgb),0.025); }
      .dg-task-done { text-decoration: line-through; color:var(--dg-text-dim); }
      .dg-task-del { margin-left:auto; }
      .dg-checkbox { width:18px; height:18px; min-width:18px; border-radius:6px; border:1.5px solid rgba(var(--dg-line-rgb),0.25); background:transparent; cursor:pointer; }
      .dg-checkbox-on { background:var(--dg-accent); border-color:var(--dg-accent); }
      .dg-checkbox:disabled { cursor:not-allowed; opacity:0.5; }
      .dg-add-task { display:flex; gap:8px; }
      .dg-add-task input { flex:1; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:10px; padding:10px 12px; color:var(--dg-text); font-family:'Inter',sans-serif; font-size:13px; outline:none; }
      .dg-add-task input:focus { border-color:var(--dg-accent); }
      .dg-suggest-btn { margin-top:10px; width:100%; justify-content:center; }
      .dg-locked-note { display:flex; align-items:center; flex-wrap:wrap; gap:6px; font-size:12px; color:var(--dg-text-dim); background:rgba(var(--dg-line-rgb),0.03); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:10px; padding:10px 12px; }
      .dg-pago-form { margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(var(--dg-line-rgb),0.08); }
      .dg-proveedor-picker-nuevo { display:flex; gap:6px; align-items:center; }
      .dg-proveedor-picker-nuevo input { flex:1; }
      .dg-check-inline { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--dg-text-dim); white-space:nowrap; cursor:pointer; }
      .dg-check-inline input { width:auto; }
      .dg-fin-resumen { display:flex; flex-direction:column; gap:16px; }
      .dg-marketing-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:10px; }
      .dg-marketing-thumb { position:relative; aspect-ratio:1; border-radius:10px; overflow:hidden; background:var(--dg-surface-2); }
      .dg-marketing-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
      .dg-marketing-thumb-del { position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.6); border:none; border-radius:6px; color:#fff; padding:5px; cursor:pointer; }
      .dg-marketing-mini-thumb { width:44px; height:44px; border-radius:8px; object-fit:cover; flex-shrink:0; }
      .dg-filtros { display:flex; gap:6px; margin-bottom:10px; }
      .dg-filtro-btn { background:transparent; border:1px solid rgba(var(--dg-line-rgb),0.1); color:var(--dg-text-dim); border-radius:100px; padding:5px 12px; font-size:12px; cursor:pointer; }
      .dg-filtro-on { background: rgba(var(--dg-accent-rgb),0.15); border-color:var(--dg-accent); color:var(--dg-accent); }
      .dg-pago-row { align-items:center; }
      .dg-pago-info { display:flex; flex-direction:column; flex:1; gap:2px; }
      .dg-pago-meta { font-size:11px; color:var(--dg-text-dim); }
      .dg-pago-monto { font-family:'JetBrains Mono', monospace; font-size:13px; margin-right:6px; }
      .dg-pago-list { max-height:320px; }

      .dg-section-card { background: rgba(var(--dg-line-rgb),0.02); border:1px solid rgba(var(--dg-line-rgb),0.055); border-radius:14px; padding:16px 17px 18px; margin-bottom:14px; transition: border-color .15s ease; }
      .dg-section-card:hover { border-color: rgba(var(--dg-line-rgb),0.12); }
      .dg-section-header { display:flex; align-items:center; gap:7px; margin-bottom:12px; color:var(--dg-accent); font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; text-transform:uppercase; letter-spacing:0.4px; }
      .dg-field-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(130px,1fr)); gap:12px; }
      .dg-money-row { margin-top:12px; padding-top:12px; border-top:1px dashed rgba(var(--dg-line-rgb),0.08); }
      .dg-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
      .dg-field label { font-size:10.5px; font-weight:600; letter-spacing:0.4px; text-transform:uppercase; color:var(--dg-text-faint); }
      .dg-field input, .dg-field select {
        background: linear-gradient(180deg, rgba(var(--dg-line-rgb),0.05), rgba(var(--dg-line-rgb),0.015));
        border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:9px; padding:9px 10px; color:var(--dg-text);
        font-family:'Inter',sans-serif; font-size:13.5px; outline:none; box-sizing:border-box; width:100%;
        transition: border-color .15s ease, box-shadow .15s ease;
      }
      .dg-field input:focus, .dg-field select:focus { border-color:var(--dg-accent); box-shadow: 0 0 0 3px rgba(var(--dg-accent-rgb),0.12); }
      .dg-field input:disabled, .dg-field select:disabled { opacity:0.5; cursor:not-allowed; }
      .dg-comision-info { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--dg-text-dim); background: rgba(var(--dg-line-rgb),0.03); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:9px; padding:10px; }
      .dg-sector-usuarios { border:1px solid rgba(var(--dg-line-rgb),0.07); border-radius:12px; padding:8px; margin-bottom:10px; background: rgba(var(--dg-line-rgb),0.015); }
      .dg-operarios-box { padding:0 4px 4px; }
      .dg-operario-form { display:flex; gap:6px; flex-wrap:wrap; }
      .dg-operario-form input { flex:1 1 130px; min-width:0; background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:8px; padding:8px 10px; color:var(--dg-text); font-size:12px; outline:none; }
      .dg-operario-form input:focus { border-color:var(--dg-accent); }
      .dg-mobile-back-fab { display:none; }
      @media (max-width:680px) {
        .dg-mobile-back-fab {
          display:flex; align-items:center; justify-content:center;
          position:fixed; top:calc(10px + env(safe-area-inset-top, 0px)); left:calc(10px + env(safe-area-inset-left, 0px));
          width:42px; height:42px; border-radius:50%; z-index:200;
          background:var(--dg-surface-2); border:1.5px solid rgba(var(--dg-line-rgb),0.28); color:var(--dg-text);
          box-shadow:0 8px 22px -8px rgba(0,0,0,0.7);
          -webkit-tap-highlight-color:transparent; touch-action:manipulation;
        }
        .dg-mobile-back-fab:active { transform:scale(0.94); }
      }

      /* Contraste alto y explícito dentro de modales (login, ajustes): colores
         fijos, no dependen de variables de tema que otra regla pueda pisar. */
      .dg-modal {
        background: #26262B !important;
        border: 1.5px solid rgba(255,255,255,0.18) !important;
      }
      .dg-modal .dg-modal-title { color: #FFFFFF !important; font-weight: 700; }
      .dg-modal .dg-modal-sub { color: #B8B8C0 !important; }
      .dg-modal .dg-hint { color: #C7C7CE !important; }
      .dg-modal .dg-form label {
        color: #FFFFFF !important; font-weight: 700; font-size: 13px !important;
      }
      .dg-modal .dg-form input,
      .dg-modal .dg-form select {
        background: #FFFFFF !important;
        border: 1.5px solid #8A8A94 !important;
        color: #16161A !important;
        font-weight: 500;
      }
      .dg-modal .dg-form input::placeholder { color: #6B6B74 !important; }
      .dg-modal .dg-form input:focus,
      .dg-modal .dg-form select:focus {
        border-color: var(--dg-accent) !important;
        box-shadow: 0 0 0 3px rgba(var(--dg-accent-rgb), 0.35) !important;
      }
      .dg-modal .dg-btn-primary {
        background: var(--dg-accent) !important;
        color: #FFFFFF !important;
        font-weight: 700 !important;
        border: none !important;
        box-shadow: 0 4px 16px -4px rgba(var(--dg-accent-rgb), 0.6) !important;
      }
      .dg-modal .dg-btn-ghost {
        background: rgba(255,255,255,0.09) !important;
        border: 1.5px solid rgba(255,255,255,0.3) !important;
        color: #FFFFFF !important;
        font-weight: 600 !important;
      }
      .dg-modal .dg-btn-ghost:hover { background: rgba(255,255,255,0.16) !important; }
      .dg-modal .dg-icon-btn { color: #FFFFFF !important; }
      .dg-modal .dg-error { color: #FF8A80 !important; font-weight: 600; }
      .dg-modal-ajustes { max-width:820px; }
      .dg-modal-notificaciones { max-width:480px; max-height:82vh; }
      .dg-notificaciones-secciones { display:flex; flex-direction:column; gap:12px; }
      .dg-notif-historial-fila { border-bottom:1px solid rgba(var(--dg-line-rgb),0.06); }
      .dg-notif-historial-fila:last-child { border-bottom:none; }
      .dg-notif-historial-head { display:flex; align-items:center; gap:10px; width:100%; background:transparent; border:none; padding:11px 13px; cursor:pointer; text-align:left; color:var(--dg-text); font-family:'Inter',sans-serif; }
      .dg-notif-historial-head:hover { background:rgba(var(--dg-line-rgb),0.025); }
      .dg-notif-historial-detalle { padding:4px 13px 14px 37px; }
      .dg-modal-verificacion { max-width:460px; }
      .dg-verif-specs { background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.12); border-radius:12px; padding:14px 16px; margin-bottom:14px; }
      .dg-verif-desemp-cantidad { display:flex; align-items:center; gap:10px; margin-top:10px; padding-top:10px; border-top:1px dashed rgba(var(--dg-line-rgb),0.15); font-size:13px; color:var(--dg-text-dim); }
      .dg-verif-desemp-cantidad input { width:56px; text-align:center; }
      .dg-verif-contacto { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 2px; border-top:1px solid rgba(var(--dg-line-rgb),0.08); border-bottom:1px solid rgba(var(--dg-line-rgb),0.08); margin-bottom:14px; }
      .dg-verif-cliente { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:14px; }
      .dg-verif-links { display:flex; flex-direction:column; gap:8px; }
      .dg-verif-links a.dg-btn-ghost { text-decoration:none; justify-content:center; }
      .dg-modal-ajustes .dg-page { max-width:none; }
      .dg-vendedores-chips { display:flex; gap:6px; flex-wrap:wrap; }
      .dg-export-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:8px; }
      .dg-export-grid .dg-btn-ghost { justify-content:flex-start; font-size:12px; }
      .dg-export-grid .dg-btn-ghost:disabled { opacity:0.4; cursor:not-allowed; }
      .dg-save-toast { position:fixed; bottom:18px; right:18px; z-index:200; display:flex; align-items:center; gap:10px;
        background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.12); border-radius:12px; padding:11px 14px; font-size:12.5px;
        color:var(--dg-text); box-shadow: 0 14px 34px -10px rgba(0,0,0,0.8); animation: dg-toast-in .2s ease-out; max-width:min(92vw, 380px); }
      @keyframes dg-toast-in { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }
      .dg-save-ok { border-color: rgba(var(--dg-success-rgb),0.4); color:var(--dg-success); }
      .dg-save-going { color:var(--dg-text-dim); }
      .dg-save-error { border-color: rgba(var(--dg-danger-rgb),0.5); align-items:flex-start; }
      .dg-save-error > div { display:flex; flex-direction:column; gap:2px; flex:1; }
      .dg-save-error strong { color:var(--dg-danger); font-size:13px; }
      .dg-save-error span { color:var(--dg-text-dim); font-size:11.5px; }
      @media (max-width:680px) { .dg-save-toast { left:12px; right:12px; bottom:12px; max-width:none; } }

      .dg-fab-leyenda { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
      .dg-fab-leyenda span { --ec:var(--dg-text-dim); font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px;
        padding:4px 10px; border-radius:100px; border-left:3px solid var(--ec); background: rgba(var(--dg-line-rgb),0.03); color:var(--dg-text-dim); }

      /* ---- FICHA DE FABRICA v3: un solo borde, checklist minimalista, menu de acciones ---- */
      .dg-fab-lista { display:flex; flex-direction:column; gap:10px; }
      .dg-fab-grupo-bloque { display:flex; flex-direction:column; gap:10px; }
      .dg-fab-grupo-header { display:flex; align-items:center; gap:8px; width:100%; text-align:left; cursor:pointer;
        background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:10px; padding:12px 14px;
        font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; color:var(--dg-text-dim); }
      .dg-fab-grupo-header span:first-of-type { flex:1; text-transform:uppercase; letter-spacing:0.4px; font-size:13px; }
      .dg-fab-grupo-chevron { transition:transform .15s ease; color:var(--dg-text-faint); flex-shrink:0; }
      .dg-fab-grupo-abierto .dg-fab-grupo-chevron { transform:rotate(90deg); }
      .dg-fab-grupo-abierto { background:rgba(var(--dg-accent-rgb),0.08); border-color:rgba(var(--dg-accent-rgb),0.3); color:var(--dg-text); }
      .dg-fab-grupo-count { font-family:'JetBrains Mono', monospace; font-weight:700; font-size:13px; color:var(--dg-accent);
        background:rgba(var(--dg-accent-rgb),0.12); border-radius:20px; padding:2px 9px; }
      .dg-fab-card { position:relative; background: var(--dg-surface); border:0.5px solid rgba(var(--dg-line-rgb),0.08);
        border-left:3px solid rgba(var(--dg-line-rgb),0.15); border-radius:10px; padding:0; }
      .dg-fab-interior { border-left-color:#A66A75; }
      .dg-fab-flex { border-left-color:var(--dg-warning); }
      .dg-fab-envio { border-left-color:var(--dg-accent); }
      .dg-fab-coloca { border-left-color:#8A9161; }
      .dg-fab-retira { border-left-color: rgba(var(--dg-line-rgb),0.15); }
      .dg-fab-terminado { box-shadow: 0 0 0 2px var(--dg-success); }
      .dg-fab-terminado .dg-fab-zona-datos { background: rgba(var(--dg-success-rgb),0.06); }

      .dg-fab-zona-datos { background: var(--dg-surface); padding:14px 16px 12px; border-radius:9px 9px 0 0; }
      .dg-fab-zona-proceso { background: var(--dg-bg); padding:12px 16px 14px; border-top:1px solid rgba(var(--dg-line-rgb),0.09); border-radius:0 0 9px 9px; }

      .dg-fab-head { display:flex; align-items:baseline; gap:9px; margin-bottom:6px; }
      .dg-fab-orden { font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--dg-text-faint); }
      .dg-fab-cliente { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:14.5px; flex:1; min-width:0;
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-fab-entrega { --ec:var(--dg-text-dim); font-size:11px; font-weight:600; color: var(--ec); white-space:nowrap; }

      .dg-fab-medida { display:flex; align-items:baseline; gap:7px; margin-bottom:3px; }
      .dg-fab-medida strong { font-family:'JetBrains Mono', monospace; font-size:24px; font-weight:700; color:var(--dg-text); letter-spacing:-0.4px; }
      .dg-fab-medida small { font-size:11px; color:var(--dg-text-faint); }
      .dg-fab-cant { font-size:11px; font-weight:700; color:var(--dg-warning); }
      .dg-fab-unidad-badge { display:inline-block; background:rgba(var(--dg-warning-rgb),0.15); border:1px solid rgba(var(--dg-warning-rgb),0.35); color:var(--dg-warning);
        font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; padding:4px 9px; border-radius:7px; margin-bottom:8px; }
      .dg-fab-linea { font-size:12.5px; color:var(--dg-text-dim); margin-bottom:10px; }
      .dg-fab-tono { color:var(--dg-warning); font-weight:600; }
      .dg-fab-proceso { font-weight:600; }

      .dg-fab-steps { display:flex; gap:14px; margin-bottom:10px; flex-wrap:wrap; }
      .dg-fab-step { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:var(--dg-text-faint); }
      .dg-fab-step em { display:flex; align-items:center; justify-content:center; width:15px; height:15px; border-radius:50%;
        border:1px solid rgba(var(--dg-line-rgb),0.15); font-style:normal; font-size:8.5px; color:var(--dg-text-faint); }
      .dg-fab-step-done { color:var(--dg-success); }
      .dg-fab-step-done svg { color:var(--dg-success); }
      .dg-fab-step-current { color:var(--dg-accent); }
      .dg-fab-step-current em { border-color:var(--dg-accent); color:var(--dg-accent); }

      .dg-fab-funciones { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px; }
      .dg-fab-func { font-size:11px; font-weight:600; padding:4px 9px; border-radius:6px; background: rgba(var(--dg-success-rgb),0.13); color:var(--dg-success); }

      .dg-fab-obs { font-size:12px; color:var(--dg-text-dim); margin-bottom:10px; line-height:1.4; }
      .dg-reclamo-lista { display:flex; flex-direction:column; gap:10px; }
      .dg-reclamo-card { margin-bottom:0; }
      .dg-reclamo-head { display:flex; align-items:center; gap:9px; margin-bottom:8px; flex-wrap:wrap; }
      .dg-reclamo-cliente { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:14px; flex:1; min-width:0; }
      .dg-fab-obs span { color:var(--dg-accent); font-weight:600; margin-right:5px; }

      .dg-fab-audit { margin-bottom:10px; font-size:11.5px; }
      .dg-fab-audit summary { cursor:pointer; color:var(--dg-text-faint); font-weight:600; list-style:none; display:flex; align-items:center; gap:5px; }
      .dg-fab-audit summary::-webkit-details-marker { display:none; }
      .dg-fab-audit summary:hover { color:var(--dg-accent); }
      .dg-fab-audit > div { margin-top:7px; display:flex; flex-direction:column; gap:5px; padding-left:2px; }
      .dg-fab-audit > div > span { display:flex; align-items:baseline; gap:8px; }
      .dg-fab-audit strong { min-width:66px; color:var(--dg-text-dim); font-weight:600; }
      .dg-fab-audit time { font-family:'JetBrains Mono', monospace; color:var(--dg-text-dim); font-size:10.5px; }
      .dg-fab-audit small { color:var(--dg-text-faint); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

      .dg-fab-foot { display:flex; align-items:center; gap:10px; padding-top:10px; border-top:0.5px solid rgba(var(--dg-line-rgb),0.07); flex-wrap:wrap; }
      .dg-fab-foot-txt { font-size:11.5px; color:var(--dg-text-faint); flex:1; min-width:0; }
      .dg-fab-flag-demora { color:var(--dg-danger); font-weight:600; }
      .dg-fecha-entrega-badge { display:inline-flex; align-items:center; gap:4px; margin-left:6px; padding:2px 8px; border:1px solid rgba(var(--dg-line-rgb),0.25); border-radius:6px; font-family:'JetBrains Mono', monospace; font-size:11.5px; font-weight:600; color:var(--dg-text); vertical-align:middle; }
      .dg-fab-flag-ok { color:var(--dg-success); font-weight:600; }
      .dg-fab-acciones { display:flex; align-items:center; gap:4px; }
      .dg-fab-btn-listo { display:flex; align-items:center; gap:6px; background: rgba(var(--dg-success-rgb),0.12); border:1px solid rgba(var(--dg-success-rgb),0.4);
        color:var(--dg-success); border-radius:8px; padding:7px 13px; font-size:12px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; white-space:nowrap; }
      .dg-fab-btn-listo:hover { background: rgba(var(--dg-success-rgb),0.2); }
      .dg-fab-menu-wrap { position:relative; }
      .dg-fab-menu-backdrop { position:fixed; inset:0; z-index:29; }
      .dg-fab-menu { position:absolute; right:0; top:calc(100% + 6px); z-index:30; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.12);
        border-radius:10px; padding:5px; min-width:180px; box-shadow: 0 14px 34px -10px rgba(0,0,0,0.7); }
      .dg-fab-menu button { display:flex; align-items:center; gap:8px; width:100%; background:transparent; border:none; color:var(--dg-text-dim);
        font-size:12.5px; padding:9px 10px; border-radius:7px; cursor:pointer; text-align:left; font-family:'Inter',sans-serif; white-space:nowrap; }
      .dg-fab-menu button:hover { background: rgba(var(--dg-line-rgb),0.06); }
      .dg-fab-menu-danger { color:var(--dg-danger) !important; }
      .dg-fab-menu-danger:hover { background: rgba(var(--dg-danger-rgb),0.12) !important; }

      @media (max-width:680px) {
        .dg-fab-medida strong { font-size:21px; }
        .dg-fab-zona-datos { padding:12px 13px 10px; }
        .dg-fab-zona-proceso { padding:10px 13px 12px; }
        .dg-fab-steps { gap:10px; }
      }
      @media (max-width:420px) {
        .dg-fab-medida strong { font-size:20px; }
        .dg-production-checklist strong { font-size:8.5px; }
      }

      /* ---- PLANILLA DE SUELDOS ---- */
      .dg-sueldo-topbar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:14px; }
      .dg-periodo-sel { display:flex; align-items:center; gap:8px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:10px; padding:7px 12px; font-size:13px; color:var(--dg-text-dim); }
      .dg-periodo-sel select { background:transparent; border:none; color:var(--dg-accent); font-weight:700; font-size:13px; outline:none; }
      .dg-sueldo-editor { scroll-margin-top:14px; }
      .dg-sueldo-editor-hint { margin:-2px 0 12px; }
      .dg-sueldo-block { margin-bottom:26px; }
      .dg-sueldo-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; color:var(--dg-text); margin-bottom:10px; padding-left:10px; border-left:3px solid var(--dg-accent); }
      .dg-sueldo-auto-note { display:flex; align-items:flex-start; gap:6px; margin:-2px 0 9px; padding:7px 9px; border:1px solid rgba(var(--dg-success-rgb),.16); border-radius:8px; background:rgba(var(--dg-success-rgb),.045); color:var(--dg-text-dim); line-height:1.35; }
      .dg-sueldo-auto-note svg { flex:0 0 auto; margin-top:1px; color:var(--dg-success); }
      .dg-tabla-scroll { overflow-x:auto; border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:12px; background:var(--dg-surface-2); }
      .dg-tabla { border-collapse:separate; border-spacing:0; width:100%; font-size:12px; }
      .dg-tabla th { background:var(--dg-surface-2); color:var(--dg-text-dim); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;
        padding:9px 8px; text-align:center; white-space:nowrap; border-bottom:1px solid rgba(var(--dg-line-rgb),0.1); }
      .dg-tabla th small { display:block; font-size:8.5px; font-weight:500; text-transform:none; letter-spacing:0; color:var(--dg-text-faint); margin-top:2px; }
      .dg-th-semana { min-width:82px; }
      .dg-th-total { background:var(--dg-surface-3) !important; color:var(--dg-accent) !important; }
      .dg-tabla td { padding:6px 8px; text-align:center; border-bottom:1px solid rgba(var(--dg-line-rgb),0.05); vertical-align:middle; }
      .dg-tabla tbody tr:hover td { background: rgba(var(--dg-line-rgb),0.02); }
      .dg-sticky-col { position:sticky; left:0; z-index:2; background:var(--dg-surface-2); text-align:left !important; min-width:96px; box-shadow: 2px 0 6px -3px rgba(0,0,0,0.7); }
      .dg-tabla thead .dg-sticky-col { background:var(--dg-surface-2); z-index:3; }
      .dg-td-nombre { font-weight:600; color:var(--dg-text); font-size:12.5px; }
      .dg-sueldo-row-edit { width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; margin-left:5px; padding:0; border:1px solid rgba(var(--dg-line-rgb),.12); border-radius:6px; background:var(--dg-surface); color:var(--dg-text-faint); cursor:pointer; vertical-align:middle; }
      .dg-sueldo-row-edit:hover { border-color:rgba(var(--dg-accent-rgb),.34); color:var(--dg-accent); }
      .dg-td-ref { color:var(--dg-text-dim); font-family:'JetBrains Mono', monospace; font-size:11px; white-space:nowrap; }
      .dg-td-calc { font-family:'JetBrains Mono', monospace; font-size:11.5px; color:var(--dg-text-dim); white-space:nowrap; }
      .dg-td-comision-auto strong { display:block; color:var(--dg-success); font-size:11.5px; }
      .dg-td-comision-auto small { display:block; margin-top:2px; color:var(--dg-text-faint); font-family:'Inter',sans-serif; font-size:8px; font-weight:600; }
      .dg-td-ajuste { min-width:78px; }
      .dg-td-neg { color:var(--dg-danger); }
      .dg-td-total { font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; color:var(--dg-success); background: rgba(var(--dg-success-rgb),0.06); white-space:nowrap; }
      .dg-td-semana { padding:5px 6px !important; }
      .dg-td-semana-lectura { font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--dg-text); text-align:center; white-space:nowrap; }
      .dg-sueldo-row-edit { background:transparent; border:none; color:var(--dg-text-faint); cursor:pointer; padding:3px; border-radius:5px; display:inline-flex; vertical-align:middle; margin-left:4px; }
      .dg-sueldo-row-edit:hover { color:var(--dg-accent); background:rgba(var(--dg-accent-rgb),0.1); }
      .dg-tr-total td { background:var(--dg-surface-2) !important; font-weight:700; border-top:2px solid rgba(var(--dg-accent-rgb),0.3); border-bottom:none; }
      .dg-tr-total .dg-sticky-col { background:var(--dg-surface-2) !important; color:var(--dg-accent); font-size:11px; letter-spacing:0.5px; }
      .dg-sueldo-nota-fija { margin:8px 0 0; padding:9px 12px; background:rgba(var(--dg-warning-rgb),0.06); border:1px solid rgba(var(--dg-warning-rgb),0.2); border-radius:8px; font-size:12.5px; color:var(--dg-text-dim); }
      .dg-sueldo-nota-fija strong { color:var(--dg-warning); font-weight:700; }

      .dg-modal-semanas { max-width:420px; }
      .dg-sueldo-semanas-form { display:flex; flex-direction:column; gap:12px; max-height:60vh; overflow-y:auto; padding-right:2px; }
      .dg-sueldo-semana-bloque { padding:10px 12px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:10px; }
      .dg-sueldo-semana-num { display:flex; align-items:center; justify-content:space-between; gap:10px; font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:12.5px; color:var(--dg-accent); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.4px; }
      .dg-sueldo-semana-num small { color:var(--dg-text-faint); font-family:'Inter',sans-serif; font-size:9px; font-weight:600; letter-spacing:0; text-transform:none; }
      .dg-sueldo-semana-preview { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; margin-top:8px; padding-top:8px; border-top:1px solid rgba(var(--dg-line-rgb),.08); }
      .dg-sueldo-semana-preview span, .dg-sueldo-semana-preview strong { font-family:'JetBrains Mono',monospace; font-size:9.5px; color:var(--dg-text-dim); white-space:nowrap; }
      .dg-sueldo-semana-preview strong { color:var(--dg-success); text-align:right; }
      .dg-sueldo-modal-summary { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; padding:12px; border:1px solid rgba(var(--dg-success-rgb),.2); border-radius:11px; background:rgba(var(--dg-success-rgb),.055); }
      .dg-sueldo-modal-summary > span { display:flex; flex-direction:column; gap:4px; min-width:0; }
      .dg-sueldo-modal-summary small { color:var(--dg-text-faint); font-size:9px; text-transform:uppercase; letter-spacing:.45px; }
      .dg-sueldo-modal-summary strong { color:var(--dg-text); font-family:'JetBrains Mono',monospace; font-size:12px; }
      .dg-sueldo-modal-total { grid-column:1/-1; padding-top:9px; border-top:1px solid rgba(var(--dg-success-rgb),.2); }
      .dg-sueldo-modal-total strong { color:var(--dg-success); font-size:17px; }

      .dg-sueldo-resumen-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin:4px 0 12px; padding:2px 2px 0; }
      .dg-sueldo-resumen-head small, .dg-sueldo-resumen-total small { display:block; color:var(--dg-text-faint); font-size:9px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; }
      .dg-sueldo-resumen-head h2 { margin:3px 0 0; color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:22px; line-height:1.1; }
      .dg-sueldo-resumen-total { text-align:right; }
      .dg-sueldo-resumen-total strong { display:block; margin-top:3px; color:var(--dg-success); font-family:'JetBrains Mono',monospace; font-size:24px; line-height:1.05; }
      .dg-sueldo-resumen-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:22px; }
      .dg-sueldo-resumen-card { padding:14px; border:1px solid rgba(var(--dg-line-rgb),.12); border-radius:13px; background:var(--dg-surface); box-shadow:0 10px 26px -24px var(--dg-shadow); }
      .dg-sueldo-resumen-oficina { border-top:3px solid var(--dg-accent); }
      .dg-sueldo-resumen-taller { border-top:3px solid var(--dg-warning); }
      .dg-sueldo-resumen-card-title { display:flex; align-items:center; gap:7px; margin-bottom:11px; color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:700; }
      .dg-sueldo-resumen-oficina .dg-sueldo-resumen-card-title svg { color:var(--dg-accent); }
      .dg-sueldo-resumen-taller .dg-sueldo-resumen-card-title svg { color:var(--dg-warning); }
      .dg-sueldo-resumen-metricas { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; }
      .dg-sueldo-resumen-oficina .dg-sueldo-resumen-metricas { grid-template-columns:repeat(3,minmax(0,1fr)); }
      .dg-sueldo-resumen-metricas > span { display:flex; flex-direction:column; gap:3px; min-width:0; padding:8px 9px; border-radius:8px; background:var(--dg-surface-2); }
      .dg-sueldo-resumen-metricas small { color:var(--dg-text-faint); font-size:8.5px; line-height:1.2; }
      .dg-sueldo-resumen-metricas strong { overflow:hidden; color:var(--dg-text); font-family:'JetBrains Mono',monospace; font-size:11.5px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-sueldo-resumen-card-total { background:rgba(var(--dg-success-rgb),.09) !important; }
      .dg-sueldo-resumen-card-total strong { color:var(--dg-success); }
      .dg-sueldo-adelantos-aviso { margin-top:9px; color:var(--dg-danger); font-size:10px; font-weight:600; text-align:right; }

      .dg-sueldo-section-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:14px; margin:0 0 10px; padding:0 2px 9px; border-bottom:1px solid rgba(var(--dg-accent-rgb),.28); }
      .dg-sueldo-section-heading-taller { border-bottom-color:rgba(var(--dg-warning-rgb),.28); }
      .dg-sueldo-section-heading small { display:block; color:var(--dg-text-faint); font-size:8.5px; font-weight:700; letter-spacing:.65px; text-transform:uppercase; }
      .dg-sueldo-section-heading h3 { margin:2px 0 0; color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:17px; }
      .dg-sueldo-section-heading > div:last-child { text-align:right; }
      .dg-sueldo-section-heading > div:last-child strong { display:block; margin-top:2px; color:var(--dg-success); font-family:'JetBrains Mono',monospace; font-size:17px; }
      .dg-sueldo-adelanto-note { display:flex; align-items:flex-start; gap:6px; margin:-2px 0 10px; padding:8px 9px; border:1px solid rgba(var(--dg-warning-rgb),.2); border-radius:8px; background:rgba(var(--dg-warning-rgb),.05); color:var(--dg-text-dim); line-height:1.35; }
      .dg-sueldo-adelanto-note svg { flex:0 0 auto; margin-top:1px; color:var(--dg-warning); }
      .dg-sueldo-week-team-grid { display:grid; grid-template-columns:repeat(5,minmax(150px,1fr)); gap:7px; margin:10px 0 12px; overflow-x:auto; padding-bottom:3px; }
      .dg-sueldo-week-team-card { min-width:150px; padding:9px; border:1px solid rgba(var(--dg-line-rgb),.1); border-radius:10px; background:var(--dg-surface-2); }
      .dg-sueldo-week-team-card > div { display:flex; align-items:baseline; justify-content:space-between; gap:5px; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid rgba(var(--dg-line-rgb),.08); }
      .dg-sueldo-week-team-card > div strong { color:var(--dg-text); font-size:10px; }
      .dg-sueldo-week-team-card > div small { color:var(--dg-text-faint); font-size:8px; }
      .dg-sueldo-week-team-card > span { display:flex; align-items:center; justify-content:space-between; gap:5px; margin-top:4px; }
      .dg-sueldo-week-team-card > span small { color:var(--dg-text-faint); font-size:8.5px; }
      .dg-sueldo-week-team-card > span strong { color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9.5px; }
      .dg-sueldo-week-team-card .dg-sueldo-week-total { margin-top:7px; padding-top:6px; border-top:1px solid rgba(var(--dg-success-rgb),.17); }
      .dg-sueldo-week-team-card .dg-sueldo-week-total strong { color:var(--dg-success); font-size:11px; }

      .dg-payroll-list { display:flex; flex-direction:column; gap:10px; }
      .dg-payroll-card { overflow:hidden; border:1px solid rgba(var(--dg-line-rgb),.13); border-radius:13px; background:var(--dg-surface); box-shadow:0 10px 24px -24px var(--dg-shadow); }
      .dg-payroll-card-taller { border-left:3px solid rgba(var(--dg-warning-rgb),.62); }
      .dg-payroll-employee-head { display:grid; grid-template-columns:minmax(160px,1fr) minmax(420px,2.2fr) auto; align-items:center; gap:12px; padding:12px 13px; background:var(--dg-surface-2); }
      .dg-payroll-employee-name { min-width:0; }
      .dg-payroll-employee-name strong { display:block; overflow:hidden; color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:700; text-overflow:ellipsis; white-space:nowrap; }
      .dg-payroll-employee-name small { display:block; overflow:hidden; margin-top:3px; color:var(--dg-text-faint); font-size:9px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-payroll-month-metrics { display:grid; grid-template-columns:repeat(4,minmax(90px,1fr)); gap:6px; }
      .dg-payroll-workshop-metrics { grid-template-columns:repeat(3,minmax(115px,1fr)); }
      .dg-payroll-month-metrics > span { display:flex; flex-direction:column; gap:3px; min-width:0; }
      .dg-payroll-month-metrics small { color:var(--dg-text-faint); font-size:8px; line-height:1.15; }
      .dg-payroll-month-metrics strong { overflow:hidden; color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:10.5px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-payroll-month-total strong, .dg-payroll-complement-net strong { color:var(--dg-success); }
      .dg-payroll-actions { display:flex; align-items:center; justify-content:flex-end; gap:5px; white-space:nowrap; }
      .dg-payroll-actions .dg-mini-btn { min-height:30px; padding:6px 9px; font-size:10px; }
      .dg-payroll-week-table { border-top:1px solid rgba(var(--dg-line-rgb),.08); }
      .dg-payroll-week-row { display:grid; grid-template-columns:minmax(90px,1.1fr) repeat(4,minmax(90px,1fr)); align-items:center; min-height:35px; padding:0 13px; border-bottom:1px solid rgba(var(--dg-line-rgb),.055); }
      .dg-payroll-week-row:last-child { border-bottom:none; }
      .dg-payroll-week-row > span { min-width:0; padding:7px 8px; color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:10px; text-align:right; }
      .dg-payroll-week-row > span:first-child { display:flex; align-items:baseline; gap:7px; padding-left:0; text-align:left; }
      .dg-payroll-week-row > span:first-child strong { color:var(--dg-text); }
      .dg-payroll-week-row small { display:block; color:var(--dg-text-faint); font-family:'Inter',sans-serif; font-size:7.5px; }
      .dg-payroll-week-row > span:first-child small { display:inline; }
      .dg-payroll-mobile-label { display:none !important; }
      .dg-payroll-week-header { min-height:27px; background:rgba(var(--dg-line-rgb),.025); }
      .dg-payroll-week-header > span { color:var(--dg-text-faint); font-family:'Inter',sans-serif; font-size:7.5px; font-weight:700; letter-spacing:.45px; text-transform:uppercase; }
      .dg-payroll-positive, .dg-payroll-week-row-total { color:var(--dg-success) !important; font-weight:700; }
      .dg-payroll-adjustment { padding:7px 13px; border-top:1px dashed rgba(var(--dg-warning-rgb),.2); color:var(--dg-warning); font-size:9px; text-align:right; }

      .dg-workshop-weeks { display:grid; grid-template-columns:repeat(5,minmax(130px,1fr)); gap:0; overflow-x:auto; border-top:1px solid rgba(var(--dg-line-rgb),.08); }
      .dg-workshop-week { min-width:130px; padding:10px 11px; border-right:1px solid rgba(var(--dg-line-rgb),.065); }
      .dg-workshop-week:last-child { border-right:none; }
      .dg-workshop-week > div { display:flex; align-items:baseline; justify-content:space-between; gap:5px; margin-bottom:7px; }
      .dg-workshop-week > div strong { color:var(--dg-text); font-size:9.5px; }
      .dg-workshop-week > div small { color:var(--dg-text-faint); font-size:7.5px; }
      .dg-workshop-week > span { display:flex; align-items:center; justify-content:space-between; gap:6px; margin-top:4px; }
      .dg-workshop-week > span small { color:var(--dg-text-faint); font-size:8px; }
      .dg-workshop-week > span strong { color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9.5px; }
      .dg-payroll-deduction-line { display:flex; align-items:center; justify-content:flex-end; gap:12px; padding:8px 13px; border-top:1px dashed rgba(var(--dg-warning-rgb),.2); background:rgba(var(--dg-warning-rgb),.035); font-family:'JetBrains Mono',monospace; font-size:9.5px; color:var(--dg-text-dim); }
      .dg-payroll-deduction-line strong { color:var(--dg-success); }

      .dg-modal-empleados { max-width:760px; overflow:hidden; }
      .dg-empleados-modal-body { max-height:66vh; overflow-y:auto; padding-right:3px; }
      .dg-sueldo-editor-form { padding:12px; border:1px solid rgba(var(--dg-line-rgb),.1); border-radius:11px; background:var(--dg-surface); }
      .dg-empleados-config-list { display:flex; flex-direction:column; gap:6px; margin-top:12px; }
      .dg-empleado-config-row { display:grid; grid-template-columns:170px minmax(0,1fr) auto; align-items:center; gap:10px; min-height:48px; padding:8px 10px; border:1px solid rgba(var(--dg-line-rgb),.09); border-radius:9px; background:var(--dg-surface); }
      .dg-empleado-config-nombre { min-width:0; }
      .dg-empleado-config-nombre strong { display:block; overflow:hidden; color:var(--dg-text); font-size:11.5px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-empleado-config-nombre span { display:block; margin-top:2px; color:var(--dg-text-faint); font-size:8.5px; }
      .dg-empleado-config-valores { overflow:hidden; color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9.5px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-empleado-config-actions { display:flex; align-items:center; gap:4px; }
      .dg-modal-sticky-actions { margin:13px -20px -20px; padding:12px 20px; border-top:1px solid rgba(var(--dg-line-rgb),.1); background:var(--dg-surface-2); }

      .dg-comision-head { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
      .dg-comision-toggle { display:flex; align-items:center; gap:8px; background:transparent; border:none; color:var(--dg-text); cursor:pointer; padding:0; flex:1; min-width:0; text-align:left; font-family:'Inter',sans-serif; flex-wrap:wrap; }
      .dg-comision-nombre { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:15px; }
      .dg-comision-total { display:flex; align-items:center; gap:10px; }
      .dg-comision-total strong { font-family:'JetBrains Mono', monospace; font-size:17px; color:var(--dg-warning); }
      .dg-chev-open { transform: rotate(90deg); }
      .dg-validacion-banner { display:flex; gap:10px; align-items:flex-start; background: rgba(var(--dg-danger-rgb),0.1); border:1px solid rgba(var(--dg-danger-rgb),0.35); border-radius:12px; padding:12px 14px; margin-bottom:14px; color:var(--dg-danger); font-size:12.5px; }
      .dg-validacion-banner strong { display:block; margin-bottom:4px; font-size:13px; }
      .dg-validacion-banner ul { margin:0; padding-left:16px; }
      .dg-validacion-banner li { margin-bottom:2px; }
      .dg-field-error input, .dg-field-error select { border-color: rgba(var(--dg-danger-rgb),0.6) !important; background: rgba(var(--dg-danger-rgb),0.06) !important; }
      .dg-field-error label { color:var(--dg-danger) !important; }
      .dg-field-error-msg { font-size:10.5px; color:var(--dg-danger); }
      .dg-btn-warn { background: linear-gradient(145deg, var(--dg-warning), #E0A828) !important; color:#2A1F05 !important; box-shadow: 0 2px 14px -2px rgba(var(--dg-warning-rgb),0.5) !important; }
      .dg-field-computed input { background: rgba(var(--dg-accent-rgb),0.08); border-color: rgba(var(--dg-accent-rgb),0.35); color:var(--dg-accent); font-family:'JetBrains Mono', monospace; font-weight:600; opacity:1; }

      .dg-quote-grid { display:flex; gap:16px; align-items:flex-start; }
      .dg-quote-form, .dg-quote-result { flex:1; min-width:280px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:14px; padding:16px; }
      .dg-quote-section-title { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:var(--dg-accent); margin:14px 0 6px; }
      .dg-quote-section-title:first-child { margin-top:0; }
      .dg-alert { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--dg-warning); background:rgba(var(--dg-warning-rgb),0.1); border:1px solid rgba(var(--dg-warning-rgb),0.3); border-radius:8px; padding:8px 10px; margin-bottom:10px; }
      .dg-price-card { display:flex; flex-direction:column; gap:2px; background: rgba(var(--dg-accent-rgb),0.08); border:1px solid rgba(var(--dg-accent-rgb),0.3); border-radius:12px; padding:14px; margin-bottom:14px; }
      .dg-price-label { font-size:11px; color:var(--dg-text-dim); }
      .dg-price-main { font-family:'JetBrains Mono', monospace; font-size:26px; color:var(--dg-accent); }
      .dg-price-sub { font-size:12px; color:var(--dg-text-dim); }
      .dg-quote-meta { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
      .dg-quote-meta div { background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.06); border-radius:8px; padding:8px 10px; display:flex; flex-direction:column; gap:2px; }
      .dg-quote-meta span { font-size:10px; color:var(--dg-text-dim); }
      .dg-quote-meta strong { font-family:'JetBrains Mono', monospace; font-size:13px; }
      .dg-mensaje-box { margin-top:4px; }
      .dg-mensaje-text { white-space:pre-wrap; font-family:'Inter',sans-serif; font-size:12.5px; background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:10px; padding:12px; margin:6px 0 10px; line-height:1.5; }
      .dg-quote-actions { display:flex; gap:8px; flex-wrap:wrap; }
      .dg-quotes-history { margin-top:18px; }
      .dg-config-editor { margin-top:12px; background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:10px; padding:12px; }
      .dg-config-group-title { font-size:12px; font-weight:600; color:var(--dg-text-dim); margin:12px 0 6px; }
      .dg-config-group-title:first-of-type { margin-top:4px; }
      .dg-config-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
      .dg-config-field label { font-size:10.5px; font-weight:600; text-transform:uppercase; letter-spacing:0.3px; color:var(--dg-text-faint); display:block; margin-bottom:5px; }
      .dg-config-field input { width:100%; background: linear-gradient(180deg, rgba(var(--dg-line-rgb),0.05), rgba(var(--dg-line-rgb),0.015)); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:9px; padding:8px 10px; color:var(--dg-text); font-size:12.5px; box-sizing:border-box; outline:none; transition: border-color .15s ease, box-shadow .15s ease; }
      .dg-config-field input:focus { border-color:var(--dg-accent); box-shadow: 0 0 0 3px rgba(var(--dg-accent-rgb),0.12); }

      .dg-quick-actions { background: var(--panel); border:1px solid var(--panel-border); border-radius:14px; padding:14px; margin-bottom:16px; }
      .dg-quick-title { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:var(--dg-text-dim); margin-bottom:10px; }
      .dg-quick-buttons { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
      .dg-quick-btn { --c:var(--dg-accent); display:flex; flex-direction:column; align-items:center; gap:8px; background: color-mix(in srgb, var(--c) 10%, var(--dg-surface)); border:1.5px solid color-mix(in srgb, var(--c) 45%, transparent); color: var(--c); border-radius:14px; padding:18px 10px; cursor:pointer; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; text-align:center; transition: transform 0.1s ease, box-shadow 0.15s ease; }
      .dg-quick-btn:hover { transform: translateY(-2px); box-shadow: 0 0 20px -4px var(--c); }
      .dg-quick-btn:active { transform: scale(0.97); }
      .dg-quick-inline { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
      .dg-quick-inline input { flex:1; min-width:140px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:10px; padding:9px 12px; color:var(--dg-text); font-size:13px; outline:none; }
      .dg-quick-inline input:focus { border-color:var(--dg-accent); }
      .dg-quick-toast { margin-top:10px; font-size:12px; color:var(--dg-success); font-family:'JetBrains Mono', monospace; }

      .dg-crm-top { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px; }
      .dg-crm-soyyo { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--dg-text-dim); background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:10px; padding:8px 12px; }
      .dg-crm-soyyo select { background:transparent; border:none; color:var(--dg-accent); font-weight:600; font-size:13px; outline:none; }
      .dg-crm-vendedores-admin { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
      .dg-crm-vendedores-admin input { background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:8px; padding:6px 10px; color:var(--dg-text); font-size:12px; width:140px; }
      .dg-vendedor-chip { display:flex; align-items:center; gap:4px; font-size:11px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:100px; padding:4px 8px; color:var(--dg-text-dim); }
      .dg-vendedor-chip button { background:none; border:none; color:var(--dg-text-dim); cursor:pointer; display:flex; padding:0; }

      .dg-vendor-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:10px; margin-bottom:16px; }
      .dg-vendor-card { background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.08); border-radius:12px; padding:12px; }
      .dg-vendor-name { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; margin-bottom:8px; color:var(--dg-accent); }
      .dg-vendor-metrics { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px; }
      .dg-vendor-metrics div { display:flex; flex-direction:column; gap:1px; }
      .dg-vendor-metrics span { font-size:10px; color:var(--dg-text-dim); }
      .dg-vendor-metrics strong { font-family:'JetBrains Mono', monospace; font-size:13px; }
      .dg-vendor-importe { font-size:12px; color:var(--dg-success); font-family:'JetBrains Mono', monospace; border-top:1px solid rgba(var(--dg-line-rgb),0.06); padding-top:6px; }

      .dg-crm-filters { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; color:var(--dg-text-dim); }
      .dg-periodo-toggle { display:flex; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:9px; padding:3px; }
      .dg-periodo-toggle button { background:transparent; border:none; color:var(--dg-text-dim); font-size:12px; font-weight:600; padding:6px 12px; border-radius:7px; cursor:pointer; }
      .dg-periodo-on { background: rgba(var(--dg-accent-rgb),0.15) !important; color:var(--dg-accent) !important; }
      .dg-crm-filters select { background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:8px; padding:7px 10px; color:var(--dg-text); font-size:12px; }

      .dg-pedido-search { background: linear-gradient(180deg, rgba(var(--dg-line-rgb),0.05), rgba(var(--dg-line-rgb),0.015)); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:9px; padding:8px 12px; color:var(--dg-text); font-size:12.5px; min-width:160px; outline:none; }
      .dg-pedido-search:focus { border-color:var(--dg-accent); }
      .dg-pedido-list { max-height:none; }
      .dg-pedido-orden { font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--dg-text-dim); }
      .dg-pedido-card { display:flex; flex-direction:column; gap:8px; width:100%; max-width:100%; text-align:left; background: rgba(var(--dg-line-rgb),0.025); border:1px solid rgba(var(--dg-line-rgb),0.07); border-radius:12px; padding:12px 14px; color:var(--dg-text); cursor:pointer; font-family:'Inter',sans-serif; min-width:0; box-sizing:border-box; }
      .dg-btn-entregado { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; background: rgba(var(--dg-success-rgb),0.12);
        border:1px solid rgba(var(--dg-success-rgb),0.45); color:var(--dg-success); border-radius:10px; padding:10px; font-size:12.5px; font-weight:600;
        cursor:pointer; font-family:'Inter',sans-serif; transition: all .15s ease; }
      .dg-btn-entregado:hover { background: rgba(var(--dg-success-rgb),0.2); }
      .dg-confirmar-entrega-btn { justify-content:center; text-decoration:none; background: linear-gradient(145deg, var(--dg-success), #2FB86A); }
      .dg-pedido-card:hover { border-color:rgba(var(--dg-accent-rgb),0.35); background: rgba(var(--dg-line-rgb),0.04); transform: translateY(-1px); }
      .dg-pedido-card { transition: border-color .15s ease, background .15s ease, transform .15s ease; }
      .dg-pedido-card-top { display:flex; align-items:center; gap:10px; min-width:0; }
      .dg-pedido-card-top .dg-lead-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .dg-pedido-badges { display:flex; gap:6px; flex-wrap:wrap; min-width:0; }
      .dg-badge { --bc:var(--dg-text-dim); display:inline-flex; align-items:center; gap:4px; font-size:10.5px; font-weight:600; padding:4px 9px; border-radius:100px; background: color-mix(in srgb, var(--bc) 15%, transparent); color: var(--bc); border:none; white-space:nowrap; max-width:100%; overflow:hidden; text-overflow:ellipsis; }
      .dg-pago-meta { overflow-wrap:break-word; word-break:break-word; }
      .dg-lead-list { max-height:none; }
      .dg-lead-row { display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.06); border-radius:10px; padding:10px 12px; flex-wrap:wrap; }
      .dg-lead-main { display:flex; align-items:center; gap:10px; min-width:0; }
      .dg-lead-dot { width:8px; height:8px; min-width:8px; border-radius:50%; }
      .dg-lead-info { display:flex; flex-direction:column; gap:2px; min-width:0; }
      .dg-lead-name { font-size:13px; font-weight:600; }
      .dg-lead-actions { display:flex; align-items:center; gap:6px; }
      .dg-lead-estode-select { }
      .dg-lead-estado-select { background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:8px; padding:5px 8px; font-size:11px; }
      .dg-stock-unidad { font-size:11px; color:var(--dg-text-dim); min-width:26px; }
      .dg-stock-cantidad { width:64px; text-align:center; background:var(--dg-surface-2); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:8px; padding:6px 4px; color:var(--dg-accent); font-family:'JetBrains Mono', monospace; font-weight:700; font-size:13px; }
      .dg-stock-minimo-editable { display:flex; align-items:center; gap:5px; }
      .dg-stock-minimo-input { width:44px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:6px; padding:3px 4px; color:var(--dg-text); font-size:11.5px; text-align:center; }
      .dg-stock-unidad-input { width:44px; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:6px; padding:3px 4px; color:var(--dg-text); font-size:11.5px; }

      .dg-quickviews { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
      .dg-quickview-btn { background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); color:var(--dg-text-dim); border-radius:100px; padding:7px 13px; font-size:12px; cursor:pointer; white-space:nowrap; transition: all .15s ease; }
      .dg-quickview-btn:hover { color:var(--dg-text); }
      .dg-quickview-on { background: rgba(var(--dg-accent-rgb),0.15); border-color:var(--dg-accent); color:var(--dg-accent); font-weight:600; }
      .dg-quickview-mas { background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); color:var(--dg-text-dim); border-radius:100px; padding:7px 13px; font-size:12px; cursor:pointer; }
      .dg-quickview-mas-on { border-color:var(--dg-accent); color:var(--dg-accent); }
      .dg-comision-banner { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; background: rgba(var(--dg-warning-rgb),0.08); border:1px solid rgba(var(--dg-warning-rgb),0.3); border-radius:10px; padding:10px 14px; margin-bottom:12px; font-size:13px; color:var(--dg-warning); }
      .dg-pedido-flag { font-size:11px; }
      .dg-checkbox-field { width:100%; display:flex; align-items:center; justify-content:center; gap:6px; background: rgba(var(--dg-line-rgb),0.03); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:9px; padding:9px 10px; color:var(--dg-text-dim); font-size:12.5px; cursor:pointer; font-family:'Inter',sans-serif; }
      .dg-checkbox-field-on { background: rgba(var(--dg-success-rgb),0.12); border-color:var(--dg-success); color:var(--dg-success); font-weight:600; }
      .dg-checkbox-field:disabled { cursor:not-allowed; opacity:0.6; }
      .dg-print-table { display:none; }

      @media print {
        body * { visibility:hidden; }
        .dg-print-area, .dg-print-area * { visibility:visible; }
        .dg-print-area { display:block; position:absolute; top:0; left:0; width:100%; padding:24px; background:#fff; color:#111; font-family:'Inter',sans-serif; }
        .dg-print-brand { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:22px; color:#7C4A27; letter-spacing:1px; }
        .dg-print-sub { font-size:13px; color:#555; margin-bottom:20px; }
        .dg-print-row { display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:8px 0; font-size:13px; }
        .dg-print-row span:first-child { color:#666; }
        .dg-print-price { margin:20px 0; padding:16px; border:2px solid #7C4A27; border-radius:10px; }
        .dg-print-price div { font-family:'JetBrains Mono', monospace; font-size:20px; font-weight:700; color:#7C4A27; margin-bottom:4px; }
        .dg-print-price small { font-size:12px; color:#555; font-weight:400; }
        .dg-print-terms { margin-top:16px; font-size:12px; color:#555; }
        .dg-print-table { display:table; width:100%; border-collapse:collapse; font-size:11px; }
        .dg-print-table th, .dg-print-table td { border-bottom:1px solid #ddd; padding:6px 8px; text-align:left; }
        .dg-print-table th { color:#555; font-weight:600; text-transform:uppercase; font-size:10px; }
        .dg-print-total { margin-top:14px; font-family:'JetBrains Mono', monospace; font-size:15px; font-weight:700; color:#7C4A27; text-align:right; }
      }

      .dg-plant-outer { max-width:960px; margin:0 auto; padding:0 0 64px; position:relative; }
      .dg-plant-outer::after { display:none; }
      .dg-plant-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); grid-template-rows:repeat(2,1fr); gap:14px; background:transparent; padding:0; }
      .dg-room-tile { position:relative; aspect-ratio:4/3; min-height:0; border-radius:18px; padding:0; cursor:pointer; box-sizing:border-box; background:var(--dg-surface-2); overflow:hidden; border:1px solid rgba(var(--dg-line-rgb),0.1); box-shadow:0 18px 36px -26px rgba(0,0,0,0.95); transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
      .dg-room-tile:hover { transform:translateY(-4px); border-color:color-mix(in srgb, var(--glow) 62%, rgba(var(--dg-line-rgb),0.12)); box-shadow:0 22px 45px -24px rgba(0,0,0,0.95), 0 0 0 1px color-mix(in srgb, var(--glow) 25%, transparent); z-index:2; }
      .dg-room-tile:nth-child(1), .dg-room-tile:nth-child(3), .dg-room-tile:nth-child(4), .dg-room-tile:nth-child(6) { border-radius:18px; }
      .dg-room-tile-oficina { background: var(--dg-surface-2); }
      .dg-room-tile-fabrica { background:#1A1815; }
      .dg-room-tile-despacho { background:#1A1815; }

      .dg-room-scene { position:absolute; inset:0; background:#12100E; }
      .dg-scene-image { position:absolute; inset:0; background-repeat:no-repeat; background-size:300% 200%; filter:saturate(.86) contrast(1.04); transform:scale(1.015); transition:transform .45s ease, filter .3s ease; }
      .dg-room-tile:hover .dg-scene-image { transform:scale(1.055); filter:saturate(1) contrast(1.05); }
      .dg-scene-shade { position:absolute; inset:0; background:linear-gradient(180deg,rgba(8,6,4,.04) 0%,rgba(8,6,4,.2) 43%,rgba(8,6,4,.92) 100%),linear-gradient(130deg,color-mix(in srgb,var(--accent) 10%,transparent),transparent 45%); }
      .dg-scene-watermark { display:none; }

      .dg-room-plate { position:absolute; left:12px; right:12px; bottom:12px; display:flex; align-items:center; gap:8px; background:rgba(12,9,7,.8); border:1px solid color-mix(in srgb, var(--glow) 54%, rgba(var(--dg-line-rgb),0.1)); border-radius:12px; padding:10px 11px; box-shadow:0 12px 30px -18px rgba(0,0,0,0.95); backdrop-filter:blur(14px); }
      .dg-room-plate-num { font-family:'JetBrains Mono', monospace; font-size:10px; color:var(--dg-text-dim); }
      .dg-room-plate-icon { --glow:var(--dg-accent); width:26px; height:26px; min-width:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--glow) 18%, transparent); color: var(--glow); }
      .dg-room-plate-text { display:flex; flex-direction:column; min-width:0; flex:1; }
      .dg-room-plate-name { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-room-plate-sub { font-size:10.5px; color:var(--dg-text-dim); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-room-plate-pct { font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; }

      @media (max-width:680px) {
        .dg-app { padding:16px 12px 48px; }
        .dg-overview-head { align-items:flex-start; flex-direction:column; gap:16px; padding:18px; }
        .dg-overview-copy h1 { font-size:21px; }
        .dg-summary { justify-content:flex-start; }
        .dg-plant-grid { grid-template-columns:repeat(2,1fr); grid-template-rows:repeat(3,1fr); transform:none; gap:8px; box-shadow:none; padding:0; background:transparent; }
        .dg-plant-outer { perspective:none; padding:0 0 24px; }
        .dg-plant-outer::after { display:none; }
        .dg-room-tile { min-height:150px; border-radius:14px !important; border-width:1px; border-color: rgba(var(--dg-line-rgb),0.1); transform:none; box-shadow: 0 6px 16px -8px rgba(0,0,0,0.6); }
        .dg-room-tile:hover { transform:none; }
        .dg-room-plate { left:5%; right:5%; bottom:5%; padding:6px 8px; gap:5px; }
        .dg-room-plate-icon { width:22px; height:22px; min-width:22px; }
        .dg-room-plate-name { font-size:11px; }
        .dg-room-plate-sub { font-size:9px; }
        .dg-room-plate-num { display:none; }

        /* Campos y botones mas grandes para el dedo */
        .dg-field input, .dg-field select { font-size:16px; padding:12px 12px; }
        .dg-form input, .dg-form select { font-size:16px; padding:12px; }
        .dg-field-grid { grid-template-columns:1fr 1fr; gap:10px; }
        .dg-btn-primary, .dg-btn-ghost, .dg-login-btn { padding:12px 16px; font-size:14px; }
        .dg-icon-btn { padding:9px; }
        .dg-checkbox { width:24px; height:24px; min-width:24px; }
        .dg-fabrica-btn { min-width:100%; padding:14px; font-size:14px; }
        .dg-quick-btn { padding:14px 8px; font-size:11.5px; }

        /* Navegacion y pestañas: scroll horizontal comodo en vez de apretadas */
        .dg-sector-tabs, .dg-quickviews { flex-wrap:nowrap; overflow-x:auto; padding-bottom:10px; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .dg-sector-tabs::-webkit-scrollbar, .dg-quickviews::-webkit-scrollbar { display:none; }
        .dg-sector-tab, .dg-quickview-btn { flex:0 0 auto; }
        .dg-nav { position:sticky; top:0; z-index:20; backdrop-filter: blur(8px); }

        .dg-sector-page-head { gap:8px; }
        .dg-modal { padding:16px; border-radius:16px; max-height:92vh; }
        .dg-modal-lg { max-width:100%; }
        .dg-section-card { padding:13px 13px 15px; }
        .dg-crm-filters { gap:6px; }
        .dg-crm-filters select, .dg-pedido-search { flex:1 1 auto; min-width:0; font-size:14px; padding:10px; }
        .dg-vendor-stats { grid-template-columns:1fr; }
        .dg-totales { gap:8px; }
        .dg-total-card { min-width:calc(50% - 4px); }
        .dg-room-strip { height:56px; }
        .dg-task-table-row { padding:14px 12px; font-size:14px; }
        .dg-sueldo-semanas-form { max-height:50vh; }
        .dg-anotador label { min-width:0; }
        .dg-sueldo-topbar > * { flex:1 1 auto; }
        .dg-sueldo-resumen-head { align-items:center; }
        .dg-sueldo-resumen-total strong { font-size:19px; }
        .dg-sueldo-resumen-grid { grid-template-columns:1fr; }
        .dg-sueldo-resumen-metricas, .dg-sueldo-resumen-oficina .dg-sueldo-resumen-metricas { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .dg-sueldo-resumen-card-total { grid-column:1/-1; }
        .dg-sueldo-week-team-grid { grid-template-columns:repeat(2,minmax(0,1fr)); overflow:visible; }
        .dg-sueldo-week-team-card { min-width:0; }
        .dg-sueldo-week-team-card:last-child:nth-child(odd) { grid-column:1/-1; }
        .dg-payroll-employee-head, .dg-payroll-employee-head-taller { grid-template-columns:minmax(0,1fr) auto; gap:9px; }
        .dg-payroll-month-metrics, .dg-payroll-workshop-metrics { grid-column:1/-1; grid-row:2; grid-template-columns:repeat(2,minmax(0,1fr)); padding-top:8px; border-top:1px solid rgba(var(--dg-line-rgb),.07); }
        .dg-payroll-month-total { grid-column:1/-1; }
        .dg-payroll-actions { grid-column:2; grid-row:1; }
        .dg-payroll-actions .dg-btn-primary { padding:8px 9px; font-size:0; }
        .dg-payroll-actions .dg-btn-primary svg { margin:0; }
        .dg-payroll-week-table { overflow:visible; }
        .dg-payroll-week-header { display:none; }
        .dg-payroll-week-row:not(.dg-payroll-week-header) { grid-template-columns:repeat(3,minmax(0,1fr)); min-width:0; gap:4px 8px; padding:9px 11px; }
        .dg-payroll-week-row:not(.dg-payroll-week-header) > span { padding:3px 0; text-align:left; }
        .dg-payroll-week-row:not(.dg-payroll-week-header) > span:first-child { grid-column:1/3; grid-row:1; }
        .dg-payroll-week-row:not(.dg-payroll-week-header) > span:nth-child(5) { grid-column:3; grid-row:1; text-align:right; }
        .dg-payroll-week-row:not(.dg-payroll-week-header) > span:nth-child(2) { grid-column:1; grid-row:2; }
        .dg-payroll-week-row:not(.dg-payroll-week-header) > span:nth-child(3) { grid-column:2; grid-row:2; }
        .dg-payroll-week-row:not(.dg-payroll-week-header) > span:nth-child(4) { grid-column:3; grid-row:2; }
        .dg-payroll-mobile-label { display:block !important; margin-bottom:2px; }
        .dg-workshop-weeks { grid-template-columns:repeat(2,minmax(0,1fr)); overflow:visible; }
        .dg-workshop-week { min-width:0; border-bottom:1px solid rgba(var(--dg-line-rgb),.065); }
        .dg-workshop-week:last-child:nth-child(odd) { grid-column:1/-1; }
        .dg-payroll-deduction-line { align-items:flex-end; flex-direction:column; gap:3px; }
        .dg-modal-empleados { max-width:100%; }
        .dg-empleado-config-row { grid-template-columns:minmax(0,1fr) auto; }
        .dg-empleado-config-valores { grid-column:1/-1; grid-row:2; white-space:normal; }
        .dg-empleado-config-actions { grid-column:2; grid-row:1; }
        .dg-modal-sticky-actions { margin:13px -16px -16px; padding:11px 16px; }
        .dg-room-tile:nth-child(1), .dg-room-tile:nth-child(2), .dg-room-tile:nth-child(3), .dg-room-tile:nth-child(4), .dg-room-tile:nth-child(5), .dg-room-tile:nth-child(6) { border-radius:14px; }
        .dg-form-row { flex-direction:column; }
        .dg-charts { flex-direction:column; }
        .dg-quote-grid { flex-direction:column; }
        .dg-quote-meta { grid-template-columns:1fr; }
        .dg-config-grid { grid-template-columns:1fr; }
      }
      @media (max-width:420px) {
        .dg-field-grid { grid-template-columns:1fr; }
        .dg-sueldo-resumen-head h2 { font-size:18px; }
        .dg-sueldo-resumen-total strong { font-size:16px; }
        .dg-sueldo-resumen-metricas, .dg-sueldo-resumen-oficina .dg-sueldo-resumen-metricas { grid-template-columns:1fr 1fr; }
        .dg-sueldo-semana-preview { grid-template-columns:1fr; }
        .dg-sueldo-semana-preview strong { text-align:left; }
        .dg-plant-grid { grid-template-columns:repeat(2,minmax(0,1fr)); grid-template-rows:repeat(3,1fr); }
        .dg-room-tile { min-height:150px; aspect-ratio:1/1; }
        .dg-room-plate { left:7px; right:7px; bottom:7px; padding:7px; }
        .dg-room-plate-pct { display:none; }
        .dg-quick-buttons { grid-template-columns:1fr !important; }
        .dg-total-card { min-width:100%; }
      }
      @media (max-width:340px) {
        .dg-plant-grid { grid-template-columns:1fr; grid-template-rows:none; }
        .dg-room-tile { min-height:190px; aspect-ratio:4/3; }
      }

      /* Sistema visual profesional · V2 */
      .dg-app {
        --panel-2:var(--dg-surface-2); --panel-3:var(--dg-surface-3);
        min-height:100vh; min-height:100dvh;
        padding:calc(20px + env(safe-area-inset-top, 0px)) calc(24px + env(safe-area-inset-right, 0px)) calc(80px + env(safe-area-inset-bottom, 0px)) calc(24px + env(safe-area-inset-left, 0px));
        line-height:1.45; color:var(--text);
        background:
          radial-gradient(circle at 50% -12%, rgba(var(--dg-accent-rgb),.09), transparent 34%),
          var(--dg-bg);
        -webkit-font-smoothing:antialiased;
      }
      .dg-app button, .dg-app input, .dg-app select, .dg-app textarea { font-family:'Inter',sans-serif; }
      .dg-header {
        position:sticky; top:env(safe-area-inset-top, 0px); z-index:40; max-width:1180px; min-height:76px; margin:0 auto;
        flex-wrap:nowrap; padding:12px 0; border-bottom:1px solid rgba(var(--dg-line-rgb),.08);
        background:color-mix(in srgb,var(--dg-bg) 88%,transparent); backdrop-filter:blur(18px);
        transform:translateZ(0); -webkit-transform:translateZ(0); will-change:transform;
      }
      .dg-brand { min-width:230px; }
      .dg-brand-mark { width:42px; height:42px; border-radius:50%; box-shadow:none; background:rgba(var(--dg-accent-rgb),.1); border-color:rgba(var(--dg-accent-rgb),.34); }
      .dg-brand-title { color:var(--dg-text); font-size:17px; letter-spacing:.9px; }
      .dg-brand-sub { margin-top:1px; font-size:11px; color:var(--dg-text-faint); }
      .dg-header-context { display:flex; flex-direction:column; align-items:center; gap:2px; color:var(--text-dim); }
      .dg-live-label { display:flex; align-items:center; gap:7px; color:var(--dg-text-dim); font-size:11px; font-weight:600; }
      .dg-live-dot { width:7px; height:7px; border-radius:50%; background:var(--dg-success); box-shadow:0 0 0 4px rgba(var(--dg-success-rgb),.11); }
      .dg-header-date { font-size:10.5px; color:var(--dg-text-faint); }
      .dg-login-btn, .dg-btn-primary { min-height:40px; border-radius:10px; padding:9px 15px; background:var(--dg-accent); color:var(--dg-on-accent); box-shadow:none; }
      .dg-login-btn:hover, .dg-btn-primary:hover { filter:none; background:var(--dg-accent-2); box-shadow:0 8px 24px -15px rgba(var(--dg-accent-rgb),.65); }
      .dg-btn-ghost { min-height:40px; border-radius:10px; border-color:rgba(var(--dg-line-rgb),.12); color:var(--dg-text-dim); background:rgba(var(--dg-line-rgb),.015); }
      .dg-btn-ghost:hover { background:rgba(var(--dg-line-rgb),.045); border-color:rgba(var(--dg-line-rgb),.22); }
      .dg-icon-btn { min-width:34px; min-height:34px; align-items:center; justify-content:center; }

      .dg-nav { max-width:1180px; min-height:30px; margin:16px auto 24px; padding:0; gap:4px; border:0; border-radius:0; background:transparent; }
      .dg-nav-btn { flex:none; min-height:30px; padding:5px 9px; border-radius:8px; justify-content:flex-start; color:var(--dg-text-faint); font-size:11.5px; }
      .dg-nav-btn.dg-nav-on { color:var(--dg-text); background:rgba(var(--dg-line-rgb),.045); }
      .dg-nav-crumb { padding-left:3px; color:var(--dg-text) !important; background:transparent !important; }

      .dg-overview-head { max-width:1180px; margin:0 auto 22px; padding:0 2px; align-items:flex-end; background:transparent; border:0; border-radius:0; box-shadow:none; }
      .dg-eyebrow { margin-bottom:8px; color:var(--dg-accent); font-size:10px; letter-spacing:1.6px; }
      .dg-overview-copy h1 { font-size:clamp(25px,3vw,34px); line-height:1.12; letter-spacing:-.75px; }
      .dg-overview-copy p { max-width:590px; margin-top:9px; color:var(--dg-text-faint); font-size:13px; }
      .dg-summary { max-width:480px; gap:6px; }
      .dg-chip { padding:6px 10px; background:var(--dg-surface); border-color:rgba(var(--dg-line-rgb),.09); color:var(--dg-text-dim); font-family:'Inter',sans-serif; font-size:10.5px; }
      .dg-chip-dot { width:6px; height:6px; box-shadow:0 0 7px color-mix(in srgb, var(--c) 70%, transparent); }

      .dg-plant-outer { max-width:1180px; margin:0 auto; padding:0 0 28px; }
      .dg-building-shell { overflow:hidden; border:1px solid rgba(var(--dg-line-rgb),.15); border-radius:24px; background:var(--dg-surface); box-shadow:0 18px 46px -38px var(--dg-shadow); }
      .dg-building-head { min-height:70px; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:15px 20px; border-bottom:1px solid rgba(var(--dg-line-rgb),.08); background:linear-gradient(90deg, rgba(var(--dg-accent-rgb),.055), transparent 48%); }
      .dg-building-head > div { display:flex; flex-direction:column; gap:1px; }
      .dg-building-kicker { color:var(--dg-text-faint); font-size:9.5px; font-weight:700; letter-spacing:1.35px; text-transform:uppercase; }
      .dg-building-head strong { font-family:'Space Grotesk',sans-serif; font-size:16px; letter-spacing:-.15px; }
      .dg-building-count { display:flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid rgba(var(--dg-line-rgb),.09); border-radius:9px; color:var(--dg-text-dim); font-size:10.5px; background:rgba(var(--dg-line-rgb),.018); }
      .dg-building-floor { display:grid; grid-template-columns:94px minmax(0,1fr); gap:16px; padding:16px 18px; }
      .dg-building-ground { border-top:1px solid rgba(var(--dg-line-rgb),.08); }
      .dg-floor-label { display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding-left:4px; }
      .dg-floor-label strong { font-family:'JetBrains Mono',monospace; color:var(--dg-text-faint); font-size:22px; line-height:1; }
      .dg-floor-label span { margin-top:7px; color:var(--dg-text-dim); font-size:10px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; }
      .dg-building-floor .dg-plant-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); grid-template-rows:none; gap:12px; }
      .dg-building-foot { min-height:38px; display:flex; align-items:center; justify-content:center; gap:9px; border-top:1px solid rgba(var(--dg-line-rgb),.08); color:var(--dg-text-faint); font-size:10.5px; background:rgba(var(--dg-line-rgb),.012); }
      .dg-building-foot .dg-live-dot { width:5px; height:5px; box-shadow:none; }
      .dg-room-tile { aspect-ratio:16/9; border-radius:14px !important; border-color:rgba(var(--dg-line-rgb),.105); background:var(--dg-bg); box-shadow:none; text-align:left; }
      .dg-room-tile:hover { transform:translateY(-2px); border-color:color-mix(in srgb, var(--glow) 58%, rgba(var(--dg-line-rgb),.12)); box-shadow:0 16px 34px -24px rgba(0,0,0,.9); }
      .dg-scene-image { filter:grayscale(1) sepia(.1) saturate(.76) contrast(.74) brightness(1.32); }
      .dg-room-tile:hover .dg-scene-image { transform:scale(1.045); filter:grayscale(1) sepia(.08) saturate(.82) contrast(.78) brightness(1.38); }
      .dg-scene-shade { background:linear-gradient(180deg,rgba(8,6,4,0),rgba(8,6,4,.025) 52%,rgba(8,6,4,.44) 100%),linear-gradient(125deg,color-mix(in srgb,var(--accent) 5%,transparent),transparent 54%); }
      .dg-room-plate { left:10px; right:10px; bottom:9px; gap:8px; padding:9px 10px; border:0; border-top:1px solid color-mix(in srgb,var(--glow) 45%,rgba(var(--dg-line-rgb),.08)); border-radius:10px; background:rgba(12,9,7,.76); box-shadow:none; }
      .dg-room-plate-num { color:#AFA394; font-size:9px; }
      .dg-room-plate-icon { width:25px; height:25px; min-width:25px; border-radius:50%; }
      .dg-room-plate-name { color:#F3EDE4; font-size:12px; }
      .dg-room-plate-sub { color:#B8AB9A; font-size:9.5px; }
      .dg-room-plate-pct { font-size:11.5px; }
      .dg-room-enter { top:9px; right:9px; width:28px; height:28px; background:rgba(12,9,7,.72); border:1px solid rgba(238,226,210,.16); color:#F3EDE4; }

      .dg-sector-page, .dg-page { max-width:1120px; }
      .dg-sector-hero { position:relative; min-height:148px; display:flex; align-items:flex-end; gap:18px; overflow:hidden; margin-bottom:10px; padding:18px 20px; border:1px solid rgba(var(--dg-line-rgb),.15); border-radius:16px; background:var(--dg-bg); }
      .dg-sector-hero .dg-room-scene { position:absolute; inset:0; }
      .dg-sector-hero .dg-scene-image { filter:grayscale(1) sepia(.1) saturate(.76) contrast(.72) brightness(1.28); background-size:300% 200%; }
      .dg-sector-hero .dg-scene-shade { background:linear-gradient(90deg,rgba(9,7,5,.76) 0%,rgba(9,7,5,.48) 52%,rgba(9,7,5,.12) 100%),linear-gradient(0deg,rgba(9,7,5,.46),transparent 72%); }
      .dg-sector-hero-back { position:absolute; z-index:2; top:16px; left:16px; min-height:34px; display:flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid rgba(238,226,210,.18); border-radius:9px; background:rgba(12,9,7,.62); color:#E6DCCF; font-size:11px; font-weight:600; cursor:pointer; backdrop-filter:blur(10px); }
      .dg-sector-hero-back:hover { color:#fff; border-color:rgba(var(--dg-accent-rgb),.45); }
      .dg-sector-hero-content { position:relative; z-index:2; flex:1; min-width:0; }
      .dg-sector-hero-eyebrow { display:block; margin-bottom:7px; color:#B8AB9A; font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:1.3px; text-transform:uppercase; }
      .dg-sector-hero-title { display:flex; align-items:center; gap:10px; }
      .dg-sector-hero-icon { width:36px; height:36px; min-width:36px; display:flex; align-items:center; justify-content:center; border:1px solid color-mix(in srgb,var(--glow) 46%,rgba(238,226,210,.14)); border-radius:10px; background:color-mix(in srgb,var(--glow) 12%,rgba(12,9,7,.7)); color:var(--glow); }
      .dg-sector-hero-title h1 { margin:0; color:#F3EDE4; font-family:'Space Grotesk',sans-serif; font-size:clamp(24px,3vw,31px); line-height:1; letter-spacing:-.6px; text-shadow:0 1px 12px rgba(0,0,0,.45); }
      .dg-sector-hero-title p { margin:4px 0 0; color:#E0D8CD; font-size:11px; text-shadow:0 1px 10px rgba(0,0,0,.5); }
      .dg-sector-hero-meta { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
      .dg-sector-hero-meta span { min-height:24px; display:flex; align-items:center; gap:5px; padding:4px 8px; border:1px solid rgba(238,226,210,.14); border-radius:7px; background:rgba(7,6,5,.42); color:#E2DBD2; font-size:9.5px; backdrop-filter:blur(8px); }
      .dg-sector-hero-meta i { width:6px; height:6px; border-radius:50%; background:var(--glow); }
      .dg-sector-hero-progress { position:relative; z-index:2; width:160px; align-self:flex-end; padding:13px; border:1px solid rgba(238,226,210,.14); border-radius:12px; background:rgba(12,9,7,.65); backdrop-filter:blur(12px); }
      .dg-sector-hero-progress > span { color:#AFA394; font-size:9.5px; text-transform:uppercase; letter-spacing:.75px; }
      .dg-sector-hero-progress > strong { display:block; margin:3px 0 10px; color:var(--glow); font-family:'JetBrains Mono',monospace; font-size:22px; }
      .dg-sector-hero-progress > div { height:4px; overflow:hidden; border-radius:10px; background:rgba(var(--dg-line-rgb),.09); }
      .dg-sector-hero-progress > div i { display:block; height:100%; border-radius:inherit; background:var(--glow); }
      .dg-sector-workbar { display:flex; align-items:center; margin-bottom:12px; padding:5px; border:1px solid rgba(var(--dg-line-rgb),.14); border-radius:11px; background:var(--dg-surface); }
      .dg-sector-workbar .dg-sector-tabs { width:100%; display:flex; justify-content:flex-start; flex-wrap:nowrap; gap:3px; margin:0; padding:0; overflow-x:auto; border:0; scrollbar-width:none; }
      .dg-sector-workbar .dg-sector-tabs::-webkit-scrollbar { display:none; }
      .dg-sector-tab { flex:0 0 auto; min-height:32px; display:flex; align-items:center; gap:5px; padding:6px 9px; border:1px solid transparent; border-radius:7px; color:var(--dg-text-faint); font-size:10px; background:transparent; }
      .dg-sector-tab:hover { color:var(--dg-text); background:rgba(var(--dg-line-rgb),.035); }
      .dg-sector-tab-on { color:var(--dg-accent-2); border-color:rgba(var(--dg-accent-rgb),.22); background:rgba(var(--dg-accent-rgb),.095); }

      .dg-section-card, .dg-quick-actions, .dg-task-table-wrap, .dg-chart-card, .dg-total-card, .dg-month-group {
        border-color:rgba(var(--dg-line-rgb),.095); border-radius:13px; background:var(--dg-surface); box-shadow:none;
      }
      .dg-section-card { padding:17px 18px 19px; }
      .dg-section-card:hover { border-color:rgba(var(--dg-line-rgb),.15); }
      .dg-task-table-wrap { padding:5px; }
      .dg-total-card { padding:14px 15px; }
      .dg-modal-overlay { background:rgba(7,5,4,.76); backdrop-filter:blur(8px); }
      .dg-modal { max-width:440px; border-color:rgba(var(--dg-line-rgb),.25); border-width:1.5px; border-radius:18px; background:var(--dg-surface-2); box-shadow:0 30px 80px -20px rgba(0,0,0,.9); }
      .dg-modal-lg { max-width:920px; }
      .dg-field input, .dg-field select, .dg-form input, .dg-form select, .dg-inline-input, .dg-pedido-search, textarea {
        border-color:rgba(var(--dg-line-rgb),.12); border-radius:9px; background:var(--dg-bg); color:var(--dg-text);
      }
      .dg-field input:focus, .dg-field select:focus, .dg-form input:focus, .dg-form select:focus, .dg-inline-input:focus, .dg-pedido-search:focus, textarea:focus {
        outline:none; border-color:rgba(var(--dg-accent-rgb),.7); box-shadow:0 0 0 3px rgba(var(--dg-accent-rgb),.1);
      }
      .dg-locked-page { min-height:250px; flex-direction:row; justify-content:center; text-align:left; padding:42px; border-style:dashed; background:var(--dg-surface); }
      .dg-locked-page > div:nth-child(2) { max-width:420px; }
      .dg-locked-page strong { display:block; margin-bottom:4px; color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:18px; }
      .dg-locked-page p { max-width:none; margin:0; color:var(--dg-text-faint); }
      .dg-locked-icon { width:48px; height:48px; min-width:48px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(var(--dg-accent-rgb),.22); border-radius:13px; background:rgba(var(--dg-accent-rgb),.08); color:var(--dg-accent); }

      .dg-order-tools-details { margin:0 0 12px; overflow:hidden; border:1px solid rgba(var(--dg-line-rgb),.13); border-radius:11px; background:var(--dg-surface); }
      .dg-order-tools-details > summary { min-height:40px; display:flex; align-items:center; gap:10px; padding:8px 11px; color:var(--dg-text-dim); cursor:pointer; list-style:none; }
      .dg-order-tools-details > summary::-webkit-details-marker { display:none; }
      .dg-order-tools-details > summary::after { content:"+"; margin-left:auto; color:var(--dg-accent); font-size:16px; line-height:1; }
      .dg-order-tools-details[open] > summary::after { content:"−"; }
      .dg-order-tools-details > summary > span { display:flex; align-items:center; gap:6px; color:var(--dg-text); font-size:10.5px; font-weight:600; }
      .dg-order-tools-details > summary > small { color:var(--dg-text-faint); font-size:9px; }
      .dg-order-tools-content { padding:0 10px 10px; border-top:1px solid rgba(var(--dg-line-rgb),.09); }
      .dg-order-tools-content .dg-date-filter-bar { margin:10px 0 0; }
      .dg-order-tools-content .dg-bulk-bar { margin:8px 0 0; }

      .dg-date-filter-bar { display:flex; align-items:center; gap:9px; flex-wrap:wrap; margin:-5px 0 12px; padding:10px 12px; border:1px solid rgba(var(--dg-line-rgb),.09); border-radius:11px; background:var(--dg-surface); }
      .dg-date-filter-bar > span { display:flex; align-items:center; gap:6px; margin-right:3px; color:var(--dg-text-dim); font-size:10.5px; font-weight:600; }
      .dg-date-filter-bar label { display:flex; align-items:center; gap:6px; color:var(--dg-text-faint); font-size:9.5px; text-transform:uppercase; letter-spacing:.45px; }
      .dg-date-filter-bar input { min-height:34px; padding:6px 8px; border:1px solid rgba(var(--dg-line-rgb),.11); border-radius:8px; background:var(--dg-bg); color:var(--dg-text); color-scheme:inherit; font-size:11px; }
      .dg-bulk-bar { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:14px; padding:13px 14px; border:1px solid rgba(var(--dg-warning-rgb),.2); border-radius:12px; background:linear-gradient(90deg,rgba(var(--dg-warning-rgb),.07),var(--dg-surface)); }
      .dg-bulk-bar > div:first-child { display:flex; flex-direction:column; gap:2px; min-width:220px; }
      .dg-bulk-bar strong { color:var(--dg-text); font-size:12px; }
      .dg-bulk-bar span { color:var(--dg-text-dim); font-size:10.5px; }
      .dg-bulk-actions { display:flex; align-items:center; justify-content:flex-end; gap:7px; flex-wrap:wrap; }
      .dg-btn-danger { min-height:40px; display:flex; align-items:center; gap:6px; padding:9px 14px; border:1px solid rgba(var(--dg-danger-rgb),.35); border-radius:10px; background:rgba(var(--dg-danger-rgb),.09); color:var(--dg-danger); font-size:12px; font-weight:600; cursor:pointer; }
      .dg-btn-danger:hover { border-color:rgba(var(--dg-danger-rgb),.58); background:rgba(var(--dg-danger-rgb),.15); }
      .dg-btn-primary:disabled, .dg-btn-ghost:disabled, .dg-btn-danger:disabled { opacity:.42; cursor:not-allowed; box-shadow:none; }

      .dg-client-notice { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:10px; padding:10px; border:1px solid rgba(var(--dg-warning-rgb),.2); border-radius:11px; background:rgba(var(--dg-warning-rgb),.045); }
      .dg-client-notice > div { display:flex; flex:1; min-width:190px; flex-direction:column; }
      .dg-client-notice > div span { color:var(--dg-warning); font-size:8.5px; font-weight:700; letter-spacing:.65px; text-transform:uppercase; }
      .dg-client-notice > div strong { margin-top:2px; color:var(--dg-text); font-size:11.5px; }
      .dg-client-notice .dg-btn-primary, .dg-client-notice .dg-btn-ghost { min-height:34px; padding:7px 10px; font-size:10.5px; }
      .dg-client-notice-done { border-color:rgba(var(--dg-success-rgb),.24); background:rgba(var(--dg-success-rgb),.055); }
      .dg-client-notice-badge { min-height:30px; display:inline-flex; align-items:center; gap:6px; padding:6px 9px; border:1px solid rgba(var(--dg-success-rgb),.3); border-radius:8px; background:rgba(var(--dg-success-rgb),.09); color:var(--dg-success) !important; font-size:10.5px !important; font-weight:600; }
      .dg-btn-entregado { margin-top:8px; }
      .dg-flow-pending { display:flex; align-items:center; gap:6px; padding:8px 10px; border:1px dashed rgba(var(--dg-warning-rgb),.3); border-radius:8px; color:var(--dg-warning); font-size:10.5px; }

      .dg-order-card { gap:0; overflow:hidden; padding:0; border-radius:12px; background:var(--dg-order-info); border-color:rgba(var(--dg-line-rgb),.18); box-shadow:0 8px 24px -22px var(--dg-shadow); }
      .dg-order-card:hover { transform:none; background:var(--dg-order-info); border-color:rgba(var(--dg-accent-rgb),.48); }
      .dg-order-card.dg-order-group-con-listos { box-shadow:inset 4px 0 0 var(--dg-success),0 8px 24px -22px var(--dg-shadow); }
      .dg-order-card.dg-order-group-listo { border:2px solid var(--dg-success); box-shadow:0 0 0 1px rgba(var(--dg-success-rgb),.12),0 10px 26px -20px rgba(var(--dg-success-rgb),.85); }
      .dg-order-card.dg-order-group-listo:hover { border-color:var(--dg-success); }
      .dg-order-group-listo > .dg-order-compact { background:linear-gradient(90deg,rgba(var(--dg-success-rgb),.105),var(--dg-order-info) 38%); }
      .dg-order-ready-label { color:var(--dg-success) !important; }
      .dg-order-summary { display:flex; flex-direction:column; gap:5px; padding:10px 12px 9px; background:var(--dg-order-info); }
      .dg-order-summary-label, .dg-order-flow-title { color:var(--dg-accent); font-size:7.5px; font-weight:750; letter-spacing:.85px; line-height:1; text-transform:uppercase; }
      .dg-order-card .dg-pedido-card-top { min-height:24px; }
      .dg-order-card .dg-pedido-orden { color:var(--dg-accent); }
      .dg-order-card .dg-lead-name { font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:600; }
      .dg-order-card .dg-pago-monto { color:var(--dg-text); font-size:12px; }
      .dg-order-card .dg-pago-meta { color:var(--dg-text-dim); font-size:10px; }
      .dg-order-card .dg-pedido-badges { gap:5px; }
      .dg-order-card .dg-badge { padding:3px 7px; font-size:9px; }
      .dg-order-flow { width:100%; margin:0; overflow:hidden; padding:7px 10px 8px; border:0; border-top:2px solid rgba(var(--dg-accent-rgb),.42); border-radius:0; background:var(--dg-order-flow); }
      .dg-order-flow-title { margin:0 0 3px; color:var(--dg-text-dim); }
      .dg-order-flow-title-row { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:3px; }
      .dg-order-flow-title-row .dg-order-flow-title { margin:0; }
      .dg-order-flow-nav { min-height:30px; display:grid; grid-template-columns:minmax(100px,1fr) auto minmax(100px,1fr); gap:8px; align-items:center; padding:2px 0 3px; border:0; background:transparent; }
      .dg-order-flow-label { min-width:0; display:flex; align-items:baseline; gap:6px; }
      .dg-order-flow-label span { color:var(--dg-text-faint); font-size:8px; font-weight:750; letter-spacing:.6px; text-transform:uppercase; }
      .dg-order-flow-label strong { color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9px; white-space:nowrap; }
      .dg-order-flow-dots { display:flex; align-items:center; justify-content:center; gap:5px; }
      .dg-flow-dot { width:21px; height:21px; display:flex; align-items:center; justify-content:center; padding:0; border:1px solid rgba(var(--dg-line-rgb),.18); border-radius:6px; background:rgba(var(--dg-line-rgb),.045); color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:750; cursor:pointer; transition:border-color .15s ease,background .15s ease,color .15s ease,transform .15s ease; }
      .dg-flow-dot:hover { border-color:rgba(var(--dg-accent-rgb),.36); color:var(--dg-text); }
      .dg-flow-dot-done { border-color:rgba(var(--dg-success-rgb),.23); background:rgba(var(--dg-success-rgb),.075); color:var(--dg-success); }
      .dg-flow-dot-active { border-color:rgba(var(--dg-accent-rgb),.42); background:rgba(var(--dg-accent-rgb),.1); color:var(--dg-accent-2); }
      .dg-flow-dot-selected { border-color:var(--dg-accent); box-shadow:0 0 0 2px rgba(var(--dg-accent-rgb),.12); transform:translateY(-1px); }
      .dg-order-flow-arrows { display:flex; justify-content:flex-end; gap:4px; }
      .dg-order-flow-arrows button { width:25px; height:25px; display:flex; align-items:center; justify-content:center; padding:0; border:1px solid rgba(var(--dg-line-rgb),.16); border-radius:7px; background:rgba(var(--dg-line-rgb),.035); color:var(--dg-text-dim); cursor:pointer; }
      .dg-order-flow-arrows button:hover:not(:disabled) { border-color:rgba(var(--dg-accent-rgb),.36); color:var(--dg-accent-2); }
      .dg-order-flow-arrows button:disabled { opacity:.25; cursor:not-allowed; }
      .dg-order-flow-slide { animation:dg-order-step-in .16s ease; }
      .dg-order-step { min-width:0; min-height:0; display:flex; flex-direction:column; padding:5px 0 0; border:0; border-radius:0; background:transparent; }
      .dg-order-step-done { border-color:transparent; background:transparent; }
      .dg-order-step-active { border-color:transparent; background:transparent; box-shadow:none; }
      .dg-order-step-pending { opacity:.68; }
      .dg-order-step-head { display:grid; grid-template-columns:22px minmax(0,1fr) auto; gap:6px; align-items:center; }
      .dg-order-step-number { width:22px; height:22px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(var(--dg-line-rgb),.23); border-radius:6px; color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; }
      .dg-order-step-done .dg-order-step-number { border-color:rgba(var(--dg-success-rgb),.4); background:rgba(var(--dg-success-rgb),.12); color:var(--dg-success); }
      .dg-order-step-active .dg-order-step-number { border-color:rgba(var(--dg-accent-rgb),.46); background:rgba(var(--dg-accent-rgb),.11); color:var(--dg-accent-2); }
      .dg-order-step-head > div { min-width:0; display:flex; flex-direction:column; gap:1px; }
      .dg-order-step-head small { display:none; }
      .dg-order-step-head strong { color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:10.5px; line-height:1.2; }
      .dg-order-step-state { width:max-content; max-width:100%; padding:2px 6px; border-radius:100px; background:rgba(var(--dg-line-rgb),.07); color:var(--dg-text-dim); font-size:7px; font-weight:700; letter-spacing:.3px; text-transform:uppercase; }
      .dg-order-step-done .dg-order-step-state { background:rgba(var(--dg-success-rgb),.1); color:var(--dg-success); }
      .dg-order-step-active .dg-order-step-state { background:rgba(var(--dg-accent-rgb),.1); color:var(--dg-accent-2); }
      .dg-order-step > p { display:-webkit-box; margin:4px 0 0; overflow:hidden; color:var(--dg-text-dim); font-size:8.5px; line-height:1.35; -webkit-box-orient:vertical; -webkit-line-clamp:1; }
      .dg-order-step-actions { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); align-items:stretch; gap:5px; margin-top:0; padding-top:6px; }
      .dg-ficha-espejo-paso { grid-column:1 / -1; background:var(--dg-surface); border:1px solid rgba(var(--dg-line-rgb),0.1); border-radius:10px; padding:10px 12px; margin-top:2px; }
      .dg-step-action, .dg-step-whatsapp { min-width:0; min-height:29px; display:flex; align-items:center; justify-content:center; gap:5px; padding:5px 8px; border:1px solid rgba(var(--dg-line-rgb),.18); border-radius:7px; background:rgba(var(--dg-line-rgb),.045); color:var(--dg-text-dim); font-family:'Inter',sans-serif; font-size:8.5px; font-weight:650; line-height:1.15; text-align:center; text-decoration:none; cursor:pointer; }
      .dg-step-action:hover, .dg-step-whatsapp:hover { border-color:rgba(var(--dg-accent-rgb),.45); color:var(--dg-accent-2); }
      .dg-step-action:disabled { opacity:.36; cursor:not-allowed; }
      .dg-step-action-primary { border-color:rgba(var(--dg-accent-rgb),.34); background:rgba(var(--dg-accent-rgb),.1); color:var(--dg-accent-2); }
      .dg-step-action-finish { border-color:rgba(var(--dg-success-rgb),.4); background:rgba(var(--dg-success-rgb),.12); color:var(--dg-success); }
      .dg-step-whatsapp { border-color:rgba(var(--dg-success-rgb),.3); color:var(--dg-success); }
      .dg-step-check { min-width:0; min-height:27px; display:flex; align-items:center; justify-content:center; gap:4px; color:var(--dg-success); font-size:8.5px; font-weight:650; text-align:center; }
      .dg-order-flow-cancelled { display:flex; align-items:center; gap:6px; margin-top:7px; padding:9px 10px; border:1px solid rgba(var(--dg-danger-rgb),.24); border-radius:9px; background:rgba(var(--dg-danger-rgb),.07); color:var(--dg-danger); font-size:10px; }
      @keyframes dg-order-step-in { from { opacity:.35; transform:translateX(5px); } to { opacity:1; transform:translateX(0); } }

      /* Pedidos: una fila operativa corta y el detalle completo solo al desplegar. */
      .dg-order-disclosure { display:block; cursor:default; }
      .dg-order-disclosure > summary::-webkit-details-marker,
      .dg-order-mirror > summary::-webkit-details-marker,
      .dg-shipping-editor > summary::-webkit-details-marker,
      .dg-logistics-mirror > summary::-webkit-details-marker { display:none; }
      .dg-order-compact { display:grid; grid-template-columns:minmax(150px,1.35fr) minmax(78px,.55fr) minmax(96px,.66fr) minmax(140px,1fr) auto minmax(104px,.62fr) 18px; align-items:center; gap:10px; min-height:61px; padding:9px 12px; list-style:none; background:var(--dg-order-info); cursor:pointer; }
      .dg-order-compact:hover { background:color-mix(in srgb,var(--dg-order-info) 92%,var(--dg-accent) 8%); }
      .dg-order-compact-item { min-width:0; display:flex; flex-direction:column; gap:2px; }
      .dg-order-compact-item small { color:var(--dg-text-faint); font-size:7.5px; font-weight:750; letter-spacing:.65px; line-height:1; text-transform:uppercase; }
      .dg-order-compact-item strong { min-width:0; overflow:hidden; color:var(--dg-text); font-size:10.5px; font-weight:650; line-height:1.25; text-overflow:ellipsis; white-space:nowrap; }
      .dg-order-compact-client strong { font-family:'Space Grotesk',sans-serif; font-size:13.5px; }
      .dg-order-compact-client i { margin-right:3px; color:var(--dg-accent); font-family:'JetBrains Mono',monospace; font-size:9px; font-style:normal; }
      .dg-order-compact-method strong { display:flex; align-items:center; gap:4px; }
      .dg-order-compact-step strong { color:var(--dg-accent-2); }
      .dg-order-compact-balance { align-items:flex-end; text-align:right; grid-column:6; }
      .dg-order-compact-facturar { display:flex; align-items:center; gap:5px; padding:6px 10px; border-radius:8px; font-size:11.5px; font-weight:700;
        background:rgba(var(--dg-accent-rgb),0.12); border:1px solid rgba(var(--dg-accent-rgb),0.35); color:var(--dg-accent); white-space:nowrap; flex-shrink:0; grid-column:5; justify-self:end; }
      .dg-order-compact-facturar:hover { background:rgba(var(--dg-accent-rgb),0.22); }
      .dg-order-compact-facturado { background:rgba(var(--dg-success-rgb),0.1); border-color:rgba(var(--dg-success-rgb),0.3); color:var(--dg-success); cursor:default; }
      .dg-order-compact-balance strong { font-family:'JetBrains Mono',monospace; font-size:11px; }
      .dg-order-balance-pending strong { color:var(--dg-danger); }
      .dg-order-balance-paid strong { color:var(--dg-success); }
      .dg-order-disclosure-chevron { color:var(--dg-text-faint); transition:transform .18s ease,color .18s ease; grid-column:7; }
      .dg-order-disclosure[open] .dg-order-disclosure-chevron { transform:rotate(90deg); color:var(--dg-accent); }
      .dg-order-expanded { overflow:hidden; border-top:1px solid rgba(var(--dg-line-rgb),.13); background:var(--dg-order-flow); }
      .dg-order-group-flow { display:flex; flex-wrap:wrap; align-items:center; gap:8px; padding:9px 11px; background:var(--dg-order-flow); border-bottom:1px solid rgba(var(--dg-line-rgb),.13); }
      .dg-order-group-flow-label { font-size:10px; font-weight:800; letter-spacing:.5px; color:var(--dg-text-dim); text-transform:uppercase; }
      .dg-order-group-flow-wait { font-size:11px; color:var(--dg-text-faint); }
      .dg-order-group-flow .dg-order-group-flow-entregar { background:rgba(var(--dg-success-rgb),.16); border-color:rgba(var(--dg-success-rgb),.42); color:var(--dg-success); }
      .dg-order-despacho-btns { display:flex; flex-wrap:wrap; gap:6px; }
      .dg-order-detail-actions { display:flex; justify-content:flex-end; gap:6px; padding:8px 10px; border-top:1px solid rgba(var(--dg-line-rgb),.1); background:var(--dg-order-flow); }
      .dg-order-detail-actions .dg-btn-ghost { min-height:31px; padding:6px 9px; font-size:9px; }
      .dg-order-expanded-hint { margin:0; padding:0 10px 9px; background:var(--dg-order-flow); }
      .dg-order-mirror-list { display:flex; flex-direction:column; gap:6px; padding:7px; }
      .dg-order-mirror { overflow:hidden; border:1px solid rgba(var(--dg-line-rgb),.16); border-radius:10px; background:var(--dg-order-info); }
      .dg-order-mirror-listo { box-shadow: 0 0 0 2px var(--dg-success); border-color: transparent; }
      .dg-order-mirror > summary { min-height:50px; display:grid; grid-template-columns:72px minmax(170px,1fr) minmax(105px,auto) minmax(95px,auto) 16px; align-items:center; gap:8px; padding:6px 10px; list-style:none; cursor:pointer; }
      .dg-order-mirror > summary:hover { background:rgba(var(--dg-line-rgb),.035); }
      .dg-order-mirror-index { color:var(--dg-accent); font-size:8px; font-weight:750; letter-spacing:.65px; text-transform:uppercase; }
      .dg-order-mirror-main { min-width:0; display:flex; flex-direction:column; gap:2px; }
      .dg-order-mirror-main strong { overflow:hidden; color:var(--dg-text); font-size:11px; font-weight:650; text-overflow:ellipsis; white-space:nowrap; }
      .dg-order-mirror-main small { overflow:hidden; color:var(--dg-text-dim); font-size:8.5px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-order-mirror-state { width:max-content; max-width:100%; padding:3px 7px; border:1px solid color-mix(in srgb,var(--mirror-color) 38%,transparent); border-radius:100px; background:color-mix(in srgb,var(--mirror-color) 10%,transparent); color:var(--mirror-color); font-size:8px; font-weight:700; white-space:nowrap; }
      .dg-order-mirror-balance { color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:650; text-align:right; white-space:nowrap; }
      .dg-order-mirror > summary > svg { color:var(--dg-text-faint); transition:transform .18s ease,color .18s ease; }
      .dg-order-mirror[open] > summary > svg { transform:rotate(90deg); color:var(--dg-accent); }
      .dg-order-mirror-body { overflow:hidden; border-top:1px solid rgba(var(--dg-line-rgb),.11); }
      .dg-order-mirror-meta { display:flex; align-items:center; flex-wrap:wrap; gap:5px; padding:6px 9px; background:var(--dg-order-info); }
      .dg-order-mirror-invoice,
      .dg-order-mirror-commission { min-height:22px; display:inline-flex; align-items:center; gap:4px; padding:3px 7px; border:1px solid currentColor; border-radius:100px; font-size:8px; font-weight:700; line-height:1; white-space:nowrap; }
      .dg-order-mirror-invoice-on { background:color-mix(in srgb,var(--dg-success) 9%,transparent); color:var(--dg-success); }
      .dg-order-mirror-invoice-off { background:color-mix(in srgb,var(--dg-danger) 9%,transparent); color:var(--dg-danger); }
      .dg-order-mirror-functions { min-width:140px; flex:1; display:flex; align-items:center; flex-wrap:wrap; gap:4px; }
      .dg-order-mirror-functions > span { min-height:22px; display:inline-flex; align-items:center; padding:3px 7px; border:1px solid rgba(var(--dg-line-rgb),.16); border-radius:100px; background:rgba(var(--dg-line-rgb),.035); color:var(--dg-text-dim); font-size:8px; font-weight:650; line-height:1; white-space:nowrap; }
      .dg-order-mirror-functions > small { padding:0 3px; color:var(--dg-text-faint); font-size:8px; font-style:italic; }
      .dg-order-mirror-commission { background:color-mix(in srgb,var(--dg-warning) 9%,transparent); color:var(--dg-warning); }
      .dg-order-mirror .dg-order-flow { border-top:1px solid rgba(var(--dg-accent-rgb),.32); }

      /* PostVenta: los cinco campos de coordinación permanecen disponibles sin ocupar toda la tarjeta. */
      .dg-pedido-list { max-height:none; overflow:visible; }
      .dg-shipping-confirm-card { flex-shrink:0; overflow:hidden; }
      .dg-shipping-editor { margin:8px 0 0; overflow:hidden; border:1px solid rgba(var(--dg-line-rgb),.13); border-radius:10px; background:var(--dg-surface-2); }
      .dg-shipping-editor > summary { min-height:48px; display:grid; grid-template-columns:29px minmax(0,1fr) 18px; align-items:center; gap:8px; padding:7px 10px; list-style:none; cursor:pointer; }
      .dg-shipping-editor > summary > span:nth-child(2) { min-width:0; display:flex; flex-direction:column; gap:1px; }
      .dg-shipping-editor > summary strong { color:var(--dg-text); font-size:10.5px; }
      .dg-shipping-editor > summary small { overflow:hidden; color:var(--dg-text-faint); font-size:8.5px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-shipping-editor > summary > svg { color:var(--dg-text-faint); transition:transform .18s ease; }
      .dg-shipping-editor[open] > summary > svg { transform:rotate(90deg); color:var(--dg-accent); }
      .dg-shipping-editor-icon { width:27px; height:27px; display:flex !important; align-items:center; justify-content:center; border-radius:7px; background:rgba(var(--dg-accent-rgb),.1); color:var(--dg-accent); }
      .dg-shipping-editor-body { padding:9px; border-top:1px solid rgba(var(--dg-line-rgb),.1); background:var(--dg-bg); }
      .dg-shipping-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
      .dg-shipping-field { min-width:0; }
      .dg-shipping-address { grid-column:1 / -1; }
      .dg-shipping-field .dg-field { gap:3px; }
      .dg-shipping-field .dg-field label { font-size:8.5px; }
      .dg-shipping-field .dg-field input { min-width:0; min-height:39px; padding:7px 9px; font-size:12px; }
      .dg-shipping-total-preview { min-height:36px; display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:7px; padding:7px 9px; border:1px solid rgba(var(--dg-accent-rgb),.2); border-radius:9px; background:rgba(var(--dg-accent-rgb),.06); }
      .dg-shipping-total-preview > span { color:var(--dg-text-dim); font-size:9px; font-weight:650; }
      .dg-shipping-total-preview > strong { color:var(--dg-accent-2); font-family:'JetBrains Mono',monospace; font-size:12px; white-space:nowrap; }
      .dg-shipping-total-missing { border-color:rgba(var(--dg-warning-rgb),.24); background:rgba(var(--dg-warning-rgb),.06); }
      .dg-shipping-total-missing > strong { color:var(--dg-warning); }
      .dg-shipping-copy { margin-top:7px; }
      .dg-shipping-copy .dg-btn-ghost { min-height:34px; padding:7px 10px; font-size:10px; }

      /* Logística: una entrega por cliente, con la información de calle a primera vista. */
      .dg-logistics-list { display:flex; flex-direction:column; gap:12px; max-height:none; overflow:visible; }
      .dg-logistics-card { flex-shrink:0; overflow:hidden; padding:0; border-color:rgba(var(--dg-accent-rgb),.28); }
      .dg-logistics-head { display:grid; grid-template-columns:minmax(0,1fr) auto auto; align-items:center; gap:8px; padding:10px 12px; border-bottom:1px solid rgba(var(--dg-line-rgb),.11); background:var(--dg-order-flow); }
      .dg-logistics-head > span { display:flex; align-items:center; gap:6px; color:var(--dg-accent); font-size:8.5px; font-weight:750; letter-spacing:.65px; text-transform:uppercase; }
      .dg-logistics-head > strong { color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9px; }
      .dg-logistics-head > time { color:var(--dg-text); font-family:'JetBrains Mono',monospace; font-size:10px; }
      .dg-logistics-data { display:grid; grid-template-columns:1fr 1.35fr .8fr; gap:7px; padding:10px; background:var(--dg-order-info); }
      .dg-logistics-datum { min-width:0; min-height:66px; display:flex; flex-direction:column; justify-content:center; gap:3px; padding:9px 10px; border:1px solid rgba(var(--dg-line-rgb),.12); border-radius:9px; background:var(--dg-surface-2); }
      .dg-logistics-datum > span { display:flex; align-items:center; gap:5px; color:var(--dg-text-faint); font-size:8px; font-weight:750; letter-spacing:.55px; text-transform:uppercase; }
      .dg-logistics-datum > strong { overflow-wrap:anywhere; color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:15px; line-height:1.15; }
      .dg-logistics-datum > small { overflow:hidden; color:var(--dg-text-dim); font-size:9px; line-height:1.25; text-overflow:ellipsis; white-space:nowrap; }
      .dg-logistics-name { grid-column:1; grid-row:1; }
      .dg-logistics-name > strong { font-size:20px; }
      .dg-logistics-phone { grid-column:2; grid-row:1; }
      .dg-logistics-address { grid-column:1 / 3; grid-row:2; }
      .dg-logistics-address > strong { font-size:17px; }
      .dg-logistics-floor { grid-column:3; grid-row:1; }
      .dg-logistics-mirror-total { grid-column:1 / 3; grid-row:3; }
      .dg-logistics-mirror-total > strong { font-size:18px; }
      .dg-logistics-balance { grid-column:3; grid-row:3; }
      .dg-logistics-shipping { grid-column:3; grid-row:2; }
      .dg-logistics-total { grid-column:1 / -1; grid-row:4; min-height:72px; }
      .dg-logistics-balance > strong, .dg-logistics-shipping > strong, .dg-logistics-total > strong { font-family:'JetBrains Mono',monospace; font-size:19px; }
      .dg-logistics-total > strong { font-size:23px; }
      .dg-logistics-balance-pending > strong { color:var(--dg-danger); }
      .dg-logistics-balance-paid > strong { color:var(--dg-success); }
      .dg-logistics-shipping-pending > strong, .dg-logistics-shipping-missing > strong { color:var(--dg-warning); }
      .dg-logistics-shipping-paid > strong { color:var(--dg-success); }
      .dg-logistics-shipping-action { padding:0 10px 10px; background:var(--dg-order-info); }
      .dg-logistics-shipping-action .dg-fabrica-btn { width:100%; min-height:38px; padding:8px 10px; font-size:10.5px; }
      .dg-logistics-mirrors, .dg-logistics-single { padding:9px 10px 10px; border-top:1px solid rgba(var(--dg-line-rgb),.11); background:var(--dg-order-flow); }
      .dg-logistics-mirrors { display:flex; flex-direction:column; gap:6px; }
      .dg-logistics-mirror { overflow:hidden; border:1px solid rgba(var(--dg-line-rgb),.14); border-radius:9px; background:var(--dg-surface); }
      .dg-logistics-mirror > summary { min-height:45px; display:grid; grid-template-columns:auto minmax(0,1fr) auto 17px; align-items:center; gap:8px; padding:7px 9px; list-style:none; cursor:pointer; }
      .dg-logistics-mirror > summary > span, .dg-logistics-single-head > span { color:var(--dg-accent); font-size:8px; font-weight:750; letter-spacing:.55px; text-transform:uppercase; }
      .dg-logistics-mirror > summary > strong { overflow:hidden; color:var(--dg-text); font-size:11px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-logistics-mirror > summary > small { color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9px; }
      .dg-logistics-mirror > summary > svg { color:var(--dg-text-faint); transition:transform .18s ease; }
      .dg-logistics-mirror[open] > summary > svg { transform:rotate(90deg); color:var(--dg-accent); }
      .dg-logistics-mirror-body { padding:0 8px 8px; border-top:1px solid rgba(var(--dg-line-rgb),.1); }
      .dg-logistics-single-head { display:flex; align-items:center; gap:8px; margin-bottom:7px; padding:0 2px; }
      .dg-logistics-single-head > strong { color:var(--dg-text); font-size:11px; }
      .dg-logistics-card .dg-order-flow { border:1px solid rgba(var(--dg-line-rgb),.12); border-top:2px solid rgba(var(--dg-accent-rgb),.42); border-radius:9px; }

      .dg-process-tabs { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-bottom:12px; }
      .dg-process-tabs button { --pc:var(--dg-accent); min-height:70px; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:11px 13px; border:1px solid rgba(var(--dg-line-rgb),.09); border-radius:12px; background:var(--dg-surface-2); color:var(--dg-text-dim); text-align:left; cursor:pointer; transition:border-color .15s ease,background .15s ease; }
      .dg-process-tabs button:hover { border-color:color-mix(in srgb,var(--pc) 38%,rgba(var(--dg-line-rgb),.1)); }
      .dg-process-tabs button > span { width:100%; display:flex; align-items:center; justify-content:space-between; color:var(--dg-text); font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; }
      .dg-process-tabs button small { min-width:25px; padding:2px 6px; border-radius:100px; background:rgba(var(--dg-line-rgb),.055); color:var(--dg-text-dim); font-family:'JetBrains Mono',monospace; font-size:9px; text-align:center; }
      .dg-process-tabs button em { margin-top:4px; color:var(--dg-text-faint); font-size:9.5px; font-style:normal; line-height:1.35; }
      .dg-process-tabs .dg-process-tab-on { border-color:color-mix(in srgb,var(--pc) 52%,rgba(var(--dg-line-rgb),.1)); background:color-mix(in srgb,var(--pc) 8%,var(--dg-surface-2)); box-shadow:inset 3px 0 0 var(--pc); }
      .dg-process-tabs .dg-process-tab-on > span { color:var(--pc); }
      .dg-factory-queue-tabs { grid-template-columns:repeat(5,minmax(0,1fr)); gap:6px; margin-bottom:7px; }
      .dg-factory-queue-tabs button { min-height:58px; padding:9px 10px; }
      .dg-factory-queue-tabs button > span { gap:7px; font-size:10.5px; line-height:1.2; }
      .dg-factory-queue-info { --qc:var(--dg-accent); display:flex; align-items:center; gap:9px; margin-bottom:10px; padding:7px 10px; border-left:3px solid var(--qc); border-radius:7px; background:color-mix(in srgb,var(--qc) 6%,var(--dg-surface)); }
      .dg-factory-queue-info strong { color:var(--qc); font-size:10.5px; white-space:nowrap; }
      .dg-factory-queue-info span { overflow:hidden; color:var(--dg-text-faint); font-size:9.5px; text-overflow:ellipsis; white-space:nowrap; }

      /* Contraste del tema claro: fondo de aplicación, superficies y controles se distinguen con claridad. */
      .dg-app[data-theme="light"] .dg-building-shell,
      .dg-app[data-theme="light"] .dg-sector-hero,
      .dg-app[data-theme="light"] .dg-sector-workbar,
      .dg-app[data-theme="light"] .dg-section-card,
      .dg-app[data-theme="light"] .dg-quick-actions,
      .dg-app[data-theme="light"] .dg-task-table-wrap,
      .dg-app[data-theme="light"] .dg-chart-card,
      .dg-app[data-theme="light"] .dg-total-card,
      .dg-app[data-theme="light"] .dg-month-group,
      .dg-app[data-theme="light"] .dg-date-filter-bar,
      .dg-app[data-theme="light"] .dg-bulk-bar {
        border-color:rgba(var(--dg-line-rgb),.18);
        box-shadow:0 10px 28px -25px rgba(35,34,31,.4);
      }
      .dg-app[data-theme="light"] .dg-building-head { background:#F0EEE9; border-bottom-color:rgba(var(--dg-line-rgb),.16); }
      .dg-app[data-theme="light"] .dg-building-floor { background:#FCFBF8; }
      .dg-app[data-theme="light"] .dg-building-ground { background:#F1EFEA; border-top-color:rgba(var(--dg-line-rgb),.16); }
      .dg-app[data-theme="light"] .dg-room-tile { border-color:rgba(var(--dg-line-rgb),.22); box-shadow:0 7px 18px -16px rgba(35,34,31,.58); }
      .dg-app[data-theme="light"] .dg-field input,
      .dg-app[data-theme="light"] .dg-field select,
      .dg-app[data-theme="light"] .dg-form input,
      .dg-app[data-theme="light"] .dg-form select,
      .dg-app[data-theme="light"] .dg-inline-input,
      .dg-app[data-theme="light"] .dg-pedido-search,
      .dg-app[data-theme="light"] textarea { background:#FFFFFF; border-color:rgba(var(--dg-line-rgb),.2); }
      .dg-app[data-theme="light"] .dg-order-card { border-color:rgba(var(--dg-line-rgb),.24); box-shadow:0 5px 14px -12px rgba(35,34,31,.52); }
      .dg-app[data-theme="light"] .dg-order-card.dg-order-group-con-listos { box-shadow:inset 4px 0 0 var(--dg-success),0 5px 14px -12px rgba(35,34,31,.52); }
      .dg-app[data-theme="light"] .dg-order-card.dg-order-group-listo { border-color:var(--dg-success); box-shadow:0 0 0 1px rgba(var(--dg-success-rgb),.15),0 8px 20px -16px rgba(var(--dg-success-rgb),.65); }
      .dg-app[data-theme="light"] .dg-order-flow { border-top-color:rgba(var(--dg-accent-rgb),.55); }

      @media (max-width:900px) {
        .dg-header-context { align-items:flex-start; margin-left:auto; }
        .dg-header-date { display:none; }
        .dg-overview-head { align-items:flex-start; flex-direction:column; }
        .dg-summary { justify-content:flex-start; }
        .dg-building-floor { grid-template-columns:1fr; gap:10px; }
        .dg-floor-label { flex-direction:row; align-items:center; gap:8px; padding:0 2px; }
        .dg-floor-label strong { font-size:14px; }
        .dg-floor-label span { margin:0; }
        .dg-sector-workbar { align-items:center; flex-direction:row; }
        .dg-sector-workbar .dg-sector-tabs { width:100%; justify-content:flex-start; }
      }
      @media (max-width:680px) {
        .dg-app {
          padding:calc(14px + env(safe-area-inset-top, 0px)) calc(12px + env(safe-area-inset-right, 0px)) calc(48px + env(safe-area-inset-bottom, 0px)) calc(12px + env(safe-area-inset-left, 0px));
        }
        .dg-header { min-height:66px; padding:9px 0; }
        .dg-brand { min-width:0; }
        .dg-brand-mark { width:37px; height:37px; }
        .dg-brand-title { display:none; }
        .dg-brand-sub, .dg-header-context { display:none; }
        .dg-login-btn { min-height:36px; padding:8px 10px; font-size:11.5px; }
        .dg-nav { position:relative; top:auto; z-index:auto; margin:12px auto 19px; backdrop-filter:none; }
        .dg-overview-head { gap:14px; padding:0 1px; }
        .dg-overview-copy h1 { font-size:25px; }
        .dg-building-shell { border-radius:17px; }
        .dg-building-head { min-height:60px; padding:12px; }
        .dg-building-count { display:none; }
        .dg-building-floor { padding:11px; }
        .dg-building-floor .dg-plant-grid { grid-template-columns:repeat(2,minmax(0,1fr)); grid-template-rows:none; gap:8px; }
        .dg-room-tile { min-height:0; aspect-ratio:1/1; border-radius:11px !important; }
        .dg-room-plate { left:6px; right:6px; bottom:6px; padding:7px; }
        .dg-room-plate-icon { display:none; }
        .dg-room-plate-name { font-size:10.5px; }
        .dg-room-plate-sub { font-size:8.5px; }
        .dg-room-enter { display:none; }
        .dg-sector-hero { min-height:138px; padding:15px; }
        .dg-sector-hero .dg-scene-shade { background:linear-gradient(0deg,rgba(9,7,5,.72) 0%,rgba(9,7,5,.34) 66%,rgba(9,7,5,.1) 100%); }
        .dg-sector-hero-content { padding-top:0; }
        .dg-sector-hero-title h1 { font-size:24px; }
        .dg-sector-hero-progress { display:none; }
        .dg-sector-workbar { padding:4px; }
        .dg-sector-workbar .dg-sector-tabs { flex-wrap:nowrap; overflow-x:auto; padding-bottom:0; }
        .dg-sector-tab { flex:0 0 auto; min-height:34px; }
        .dg-quickviews { gap:5px; margin-bottom:8px; padding-bottom:0 !important; }
        .dg-quickview-btn, .dg-quickview-mas { min-height:32px; padding:6px 10px; font-size:10.5px; }
        .dg-crm-filters { gap:6px; margin-bottom:8px; }
        .dg-crm-filters > svg { display:none; }
        .dg-crm-filters > select { flex:1 1 calc(50% - 3px); width:calc(50% - 3px); min-width:0; }
        .dg-crm-filters > .dg-pedido-search { flex:1 1 calc(60% - 3px); width:auto; min-width:0; }
        .dg-crm-filters > .dg-periodo-toggle { flex:1 1 calc(40% - 3px); justify-content:center; }
        .dg-crm-filters > .dg-btn-ghost, .dg-crm-filters > .dg-btn-primary { flex:1 1 calc(50% - 3px); justify-content:center; margin-left:0 !important; }
        .dg-crm-filters > select, .dg-crm-filters > .dg-pedido-search { min-height:38px; padding:7px 9px; font-size:13px; }
        .dg-crm-filters > .dg-periodo-toggle { min-height:38px; padding:2px; }
        .dg-crm-filters > .dg-periodo-toggle button { padding:5px 8px; font-size:10.5px; }
        .dg-crm-filters > .dg-btn-ghost, .dg-crm-filters > .dg-btn-primary { min-height:40px; padding:7px 10px; font-size:11.5px; }
        .dg-order-tools-details { margin-bottom:8px; }
        .dg-order-tools-details > summary { min-height:38px; padding:7px 10px; }
        .dg-order-tools-details > summary > small { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .dg-locked-page { min-height:300px; flex-direction:column; align-items:center; padding:30px 20px; text-align:center; }
        .dg-locked-page > div:nth-child(2) { max-width:330px; }
        .dg-date-filter-bar { align-items:stretch; }
        .dg-date-filter-bar > span { width:100%; }
        .dg-date-filter-bar label { flex:1 1 calc(50% - 5px); flex-direction:column; align-items:flex-start; }
        .dg-date-filter-bar input { width:100%; font-size:16px; }
        .dg-bulk-bar { align-items:stretch; flex-direction:column; }
        .dg-bulk-actions { justify-content:stretch; }
        .dg-bulk-actions button { flex:1 1 100%; justify-content:center; }
        .dg-process-tabs { grid-template-columns:1fr; gap:6px; }
        .dg-process-tabs button { min-height:57px; }
        .dg-factory-queue-tabs { display:flex; gap:6px; overflow-x:auto; padding-bottom:3px; scrollbar-width:none; }
        .dg-factory-queue-tabs::-webkit-scrollbar { display:none; }
        .dg-factory-queue-tabs button { flex:0 0 145px; min-height:48px; padding:8px 9px; }
        .dg-factory-queue-info { align-items:flex-start; flex-direction:column; gap:2px; padding:7px 9px; }
        .dg-factory-queue-info span { width:100%; white-space:normal; }
        .dg-client-notice { align-items:stretch; }
        .dg-client-notice > div, .dg-client-notice .dg-btn-primary, .dg-client-notice .dg-btn-ghost, .dg-client-notice-badge { width:100%; justify-content:center; }
        .dg-month-items { gap:6px; padding:7px; }
        .dg-month-header { padding:9px 11px; }
        .dg-pedido-card:not(.dg-fabrica-card) { gap:5px; padding:9px 10px; }
        .dg-order-card { gap:0 !important; padding:0 !important; }
        .dg-order-compact { grid-template-columns:minmax(0,1.25fr) minmax(82px,.8fr) minmax(100px,1fr) 16px; grid-template-rows:auto auto auto; gap:4px 8px; min-height:72px; padding:6px 9px; }
        .dg-order-compact-facturar { grid-column:1 / -1; grid-row:3; justify-self:start; }
        .dg-order-compact-client { grid-column:1 / 3; grid-row:1; }
        .dg-order-compact-balance { grid-column:3; grid-row:1; }
        .dg-order-compact-measure { grid-column:1; grid-row:2; }
        .dg-order-compact-method { grid-column:2; grid-row:2; }
        .dg-order-compact-step { grid-column:3; grid-row:2; }
        .dg-order-disclosure-chevron { grid-column:4; grid-row:1 / 3; align-self:center; }
        .dg-order-compact-item strong { font-size:9.5px; }
        .dg-order-compact-client strong { font-size:13px; }
        .dg-order-compact-step strong { white-space:normal; line-height:1.15; }
        .dg-order-compact-balance strong { font-size:10px; }
        .dg-order-flow { padding:7px 9px 8px; }
        .dg-order-mirror-list { gap:6px; padding:7px; }
        .dg-order-mirror > summary { grid-template-columns:minmax(0,1fr) auto 16px; grid-template-rows:auto auto auto; gap:2px 7px; min-height:68px; padding:6px 9px; }
        .dg-order-mirror-index { grid-column:1; grid-row:1; }
        .dg-order-mirror-balance { grid-column:2; grid-row:1; }
        .dg-order-mirror-main { grid-column:1 / 3; grid-row:2; }
        .dg-order-mirror-state { grid-column:1 / 3; grid-row:3; }
        .dg-order-mirror > summary > svg { grid-column:3; grid-row:1 / 4; align-self:center; }
        .dg-order-mirror-main strong { font-size:10.5px; }
        .dg-order-mirror-meta { flex-wrap:nowrap; overflow-x:auto; padding:6px 8px; scrollbar-width:none; }
        .dg-order-mirror-meta::-webkit-scrollbar { display:none; }
        .dg-order-mirror-functions { min-width:max-content; flex-wrap:nowrap; }
        .dg-pedido-card:not(.dg-fabrica-card) .dg-pago-meta { font-size:10px; line-height:1.25; }
        .dg-fabrica-btn { min-width:0; padding:7px 5px; font-size:10px; line-height:1.15; }
        .dg-fabrica-btn-next { grid-column:1 / -1; font-size:11px; }
        .dg-order-step { min-height:0; }
        .dg-shipping-confirm-card { padding:11px; }
        .dg-shipping-editor > summary { min-height:46px; padding:6px 8px; }
        .dg-shipping-editor-body { padding:7px; }
        .dg-shipping-fields { gap:6px; }
        .dg-shipping-field .dg-field input { min-height:40px; padding:7px 8px; font-size:16px; }
        .dg-logistics-head { grid-template-columns:minmax(0,1fr) auto; gap:5px; padding:9px 10px; }
        .dg-logistics-head > strong { grid-column:1; grid-row:2; }
        .dg-logistics-head > time { grid-column:2; grid-row:1 / 3; }
        .dg-logistics-data { grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; padding:8px; }
        .dg-logistics-name { grid-column:1 / -1; grid-row:1; }
        .dg-logistics-phone { grid-column:1; grid-row:2; }
        .dg-logistics-floor { grid-column:2; grid-row:2; }
        .dg-logistics-address { grid-column:1 / -1; grid-row:3; }
        .dg-logistics-mirror-total { grid-column:1 / -1; grid-row:4; }
        .dg-logistics-balance { grid-column:1; grid-row:5; min-height:68px; }
        .dg-logistics-shipping { grid-column:2; grid-row:5; min-height:68px; }
        .dg-logistics-total { grid-column:1 / -1; grid-row:6; min-height:68px; }
        .dg-logistics-datum { min-height:61px; padding:8px 9px; }
        .dg-logistics-datum > small { white-space:normal; }
        .dg-logistics-datum > strong { font-size:15px; }
        .dg-logistics-name > strong { font-size:21px; }
        .dg-logistics-address > strong { font-size:18px; }
        .dg-logistics-mirror-total > strong { font-size:18px; }
        .dg-logistics-balance > strong, .dg-logistics-shipping > strong { font-size:17px; }
        .dg-logistics-total > strong { font-size:23px; }
        .dg-logistics-shipping-action { padding:0 8px 8px; }
        .dg-logistics-shipping-action .dg-fabrica-btn { min-width:0; min-height:38px; padding:8px; font-size:10.5px; }
        .dg-logistics-mirror > summary { grid-template-columns:auto minmax(0,1fr) auto 16px; gap:6px; padding:7px 8px; }
      }
      @media (max-width:520px) {
        .dg-order-flow-nav { grid-template-columns:minmax(68px,1fr) auto auto; gap:5px; padding:4px 5px 4px 7px; }
        .dg-order-flow-label { grid-column:auto; }
        .dg-order-flow-label span { display:none; }
        .dg-order-flow-arrows { grid-column:auto; grid-row:auto; }
        .dg-order-flow-dots { grid-column:auto; grid-row:auto; justify-content:center; gap:3px; }
        .dg-flow-dot { width:20px; height:20px; }
        .dg-order-flow-arrows button { width:23px; height:23px; }
        .dg-order-step { min-height:0; }
        .dg-order-step-actions { grid-template-columns:repeat(2,minmax(0,1fr)); align-items:stretch; }
        .dg-step-action, .dg-step-whatsapp { min-width:0; }
      }
      @media (max-width:340px) {
        .dg-building-floor .dg-plant-grid { grid-template-columns:1fr; }
        .dg-room-tile { aspect-ratio:16/10; }
        .dg-shipping-fields { grid-template-columns:1fr; }
        .dg-shipping-address { grid-column:auto; }
      }
      @media (prefers-reduced-motion: reduce) {
        .dg-spin { animation:none; }
        .dg-room-tile, .dg-scene-image, .dg-flow-dot { transition:none; }
        .dg-order-flow-slide { animation:none; }
      }

      /* ---- Portal público de seguimiento ---- */
      .dg-seguimiento { display:flex; align-items:flex-start; justify-content:center; padding-top:calc(48px + env(safe-area-inset-top, 0px)); }
      .dg-seguimiento-wrap { width:100%; max-width:420px; }
      .dg-seguimiento-brand { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:15px; letter-spacing:1px; color:var(--dg-accent); text-align:center; margin-bottom:20px; }
      .dg-seguimiento-card { background:var(--dg-surface-2); border:1.5px solid rgba(var(--dg-line-rgb),0.14); border-radius:18px; padding:22px; box-shadow:0 24px 60px -20px rgba(0,0,0,0.6); }
      .dg-seguimiento-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:14px; }
      .dg-seguimiento-pasos { display:flex; flex-direction:column; gap:0; margin-top:20px; }
      .dg-seguimiento-paso { display:flex; align-items:center; gap:12px; padding:9px 0; color:var(--dg-text-faint); font-size:13.5px; position:relative; }
      .dg-seguimiento-paso::before { content:''; position:absolute; left:12px; top:-2px; bottom:-2px; width:2px; background:rgba(var(--dg-line-rgb),0.12); z-index:0; }
      .dg-seguimiento-paso:first-child::before { top:50%; }
      .dg-seguimiento-paso:last-child::before { bottom:50%; }
      .dg-seguimiento-punto { position:relative; z-index:1; display:flex; align-items:center; justify-content:center; width:25px; height:25px; min-width:25px;
        border-radius:50%; background:var(--dg-surface); border:2px solid rgba(var(--dg-line-rgb),0.18); font-size:11px; font-weight:700; color:var(--dg-text-faint); }
      .dg-seg-hecho { color:var(--dg-text); }
      .dg-seg-hecho .dg-seguimiento-punto { background:var(--dg-success); border-color:var(--dg-success); color:#FFFFFF; }
      .dg-seg-actual { color:var(--dg-text); font-weight:700; }
      .dg-seg-actual .dg-seguimiento-punto { border-color:var(--dg-accent); color:var(--dg-accent); background:rgba(var(--dg-accent-rgb),0.12); }
      .dg-seguimiento-footer { text-align:center; font-size:11.5px; color:var(--dg-text-faint); margin-top:16px; }
      .dg-seguimiento-whatsapp { justify-content:center; text-decoration:none; width:100%; margin-top:18px; background:linear-gradient(145deg, #25D366, #1DA851); }
      .dg-seguimiento-docs { display:flex; flex-direction:column; gap:8px; margin-top:14px; }
      .dg-seguimiento-espejo { padding:14px 0; border-top:1px solid rgba(var(--dg-line-rgb),0.1); }
      .dg-seguimiento-espejo:first-of-type { border-top:none; padding-top:4px; }
      .dg-seguimiento-espejo-titulo { display:flex; align-items:center; justify-content:space-between; gap:8px; font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:13px; color:var(--dg-text-dim); text-transform:uppercase; letter-spacing:0.3px; }
      .dg-seguimiento-docs a.dg-btn-ghost, .dg-seguimiento-docs button.dg-btn-ghost { text-decoration:none; justify-content:center; }
      .dg-seguimiento-doc-pendiente { text-align:center; padding:9px; }
      .dg-link-ecomapp { display:inline-flex; align-items:center; gap:5px; margin-top:6px; font-size:11.5px; color:var(--dg-accent); text-decoration:none; }
      .dg-link-ecomapp:hover { text-decoration:underline; }
      .dg-factura-campo { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
      .dg-factura-actual { display:inline-flex; align-items:center; gap:5px; font-size:12px; color:var(--dg-success); text-decoration:none; }
      .dg-factura-actual:hover { text-decoration:underline; }
      .dg-factura-upload-btn { display:inline-flex; align-items:center; gap:6px; cursor:pointer; }
      @media (max-width:480px) { .dg-seguimiento { padding-left:16px; padding-right:16px; } }
    `}</style>
  );
}

// ---- Portal público de seguimiento (sin login) ----
function pasosPublicosDe(pedido) {
  const pasos = [
    { id: "confirmado", label: "Pedido confirmado" },
    { id: "fabricacion", label: "En producción" },
    { id: "listo", label: "Espejo listo" },
  ];
  if (pedido?.metodo === "Interior") pasos.push({ id: "despachado", label: "Despachado" });
  pasos.push({ id: "entregado", label: "Entregado" });
  return pasos;
}

function pasoPublicoDe(pedido) {
  if (!pedido) return 0;
  const esInterior = pedido.metodo === "Interior";
  const despachado = !!pedido.remitoNumeroGuia?.trim();
  if (pedido.estado === "Entregado") return esInterior ? 5 : 4; // todos los pasos con tilde
  if (esInterior && despachado) return 4; // listo + despachado, falta entregado
  if (pedidoEstaListo(pedido)) return 3; // confirmado + producción + listo, los 3 con tilde
  if (pedido.estado === "Sin pasar a fábrica") return 0;
  return 1; // Verificado en adelante ya se muestra como "En producción"
}

const WHATSAPP_CONSULTAS = "1173571399";

// Tabla real de pesos y medidas de caja para envíos al interior (de la
// planilla de Vía Cargo). La caja siempre es la medida del espejo + 10cm de
// ancho y + 10cm de alto, con 10cm de espesor fijo — eso es una regla fija,
// no depende de la tabla. El peso sí depende de la medida exacta y la forma.
const TABLA_PESOS_INTERIOR = [
  { ancho: 50, alto: 70, forma: "rect", peso: 7.5 },
  { ancho: 50, alto: 80, forma: "rect", peso: 8 },
  { ancho: 60, alto: 80, forma: "rect", peso: 9 },
  { ancho: 60, alto: 90, forma: "rect", peso: 10 },
  { ancho: 50, alto: 85, forma: "pastilla", peso: 8.5 },
  { ancho: 60, alto: 85, forma: "pastilla", peso: 9.5 },
  { ancho: 50, alto: 50, forma: "redondo", peso: 4.5 },
  { ancho: 60, alto: 60, forma: "redondo", peso: 6.5 },
  { ancho: 70, alto: 70, forma: "redondo", peso: 9.5 },
];

function formaBucketInterior(pedido) {
  const f = textoComparable(pedido?.forma || "");
  if (f.includes("redondo") || f.includes("circular")) return "redondo";
  if (f.includes("pastilla")) return "pastilla";
  return "rect";
}

function medidasCajaInterior(pedido) {
  const ancho = Number(pedido?.ancho) || 0;
  const alto = Number(pedido?.alto) || 0;
  return { anchoCaja: ancho + 10, altoCaja: alto + 10, espesorCaja: 10 };
}

function pesoCajaInterior(pedido) {
  const bucket = formaBucketInterior(pedido);
  const ancho = Number(pedido?.ancho) || 0;
  const alto = Number(pedido?.alto) || 0;
  const exacto = TABLA_PESOS_INTERIOR.find((r) => r.forma === bucket && r.ancho === ancho && r.alto === alto);
  if (exacto) return { peso: exacto.peso, estimado: false };
  // No está en la tabla real: estimación aproximada según la tendencia de la
  // planilla. Se marca como estimado — conviene pesarlo en el taller antes
  // de despachar si no coincide con una medida conocida.
  const estimado = Math.max(3, Math.round((0.083 * (ancho + alto) - 2.2) * 10) / 10);
  return { peso: estimado, estimado: true };
}

// 1ra impresión del despacho: la planilla con los datos de la empresa y de
// cada cliente, para dársela al de Vía Cargo y que arme los remitos.
function abrirDatosDespacho(lista) {
  if (!lista || lista.length === 0) return;
  const filas = lista.map((p) => {
    const { anchoCaja, altoCaja, espesorCaja } = medidasCajaInterior(p);
    const { peso } = pesoCajaInterior(p);
    return `
        <tr>
          <td>${p.cliente || "—"}</td>
          <td>${p.celular || "—"}</td>
          <td>${p.dniCuit || "—"}</td>
          <td>${Number(p.cant) > 1 ? p.cant : 1}</td>
          <td>${anchoCaja} × ${altoCaja} × ${espesorCaja} cm</td>
          <td>${peso} kg</td>
          <td>${p.provincia || "—"}</td>
          <td>${p.localidad || "—"}</td>
          <td>${p.codigoPostal || "—"}</td>
        </tr>`;
  }).join("");

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Datos de despacho</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color:#111; margin:20px; }
  h1 { font-size:16px; margin:0 0 2px; }
  .remitente { font-size:12px; color:#555; margin-bottom:16px; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  th, td { border:1px solid #999; padding:5px 7px; text-align:left; }
  th { background:#eee; font-size:10.5px; text-transform:uppercase; }
  @media print { body { margin:8px; } }
</style></head>
<body>
  <h1>DECOGLASS SRL — Lista de envíos al interior</h1>
  <div class="remitente">CUIT: 30-71826423-3 · José Marmol 1660 · Tel: 11 7059-4088 · decoglass@hotmail.com · ${new Date().toLocaleDateString("es-AR")}</div>
  <table>
    <thead>
      <tr><th>Nombre</th><th>Tel</th><th>DNI/CUIT</th><th>Cant</th><th>Medida caja</th><th>Peso</th><th>Provincia</th><th>Localidad</th><th>CP</th></tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body></html>`;
  const ventana = window.open("", "_blank");
  if (ventana) { ventana.document.write(html); ventana.document.close(); }
}

// 3ra impresión del despacho: tiras "CONTIENE ESPEJO" para envolver los
// paquetes, varias por hoja A4, listas para cortar.
function abrirTirasContieneEspejo(cantidadEspejos) {
  const n = Math.max(1, Number(cantidadEspejos) || 1) * 3; // 3 tiras por cada espejo
  const tiras = Array.from({ length: n }).map(() => `
      <div class="tira">⚠ CONTIENE ESPEJO — FRÁGIL — MANEJAR CON CUIDADO ⚠</div>`).join("");

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Tiras — Contiene espejo</title>
<style>
  * { box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; margin:10mm; }
  .tira {
    width:100%; height:32mm; margin-bottom:6mm; border:3px solid #111; border-radius:6px;
    display:flex; align-items:center; justify-content:center; text-align:center;
    font-size:22px; font-weight:800; letter-spacing:1px; color:#111;
    page-break-inside:avoid;
  }
  @media print { body { margin:6mm; } }
</style></head>
<body>
  ${tiras}
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body></html>`;
  const ventana = window.open("", "_blank");
  if (ventana) { ventana.document.write(html); ventana.document.close(); }
}

function abrirRotulos(pedidosOPedido) {
  const lista = Array.isArray(pedidosOPedido) ? pedidosOPedido : [pedidosOPedido];
  if (lista.length === 0) return;

  const bloques = lista.map((pedido) => {
    const { anchoCaja, altoCaja, espesorCaja } = medidasCajaInterior(pedido);
    const { peso, estimado } = pesoCajaInterior(pedido);
    return `
    <div class="rotulo">
      <div class="pedido-num">PEDIDO #${pedido.orden}</div>

      <div class="bloque">
        <div class="titulo">Remitente</div>
        <div class="nombre">DECOGLASS SRL</div>
        <div class="dato">CUIT: 30-71826423-3</div>
        <div class="dato">José Marmol 1660</div>
        <div class="dato">Tel: 11 7059-4088</div>
      </div>

      <div class="bloque">
        <div class="titulo">Destinatario</div>
        <div class="nombre">${pedido.cliente || "—"}</div>
        ${pedido.dniCuit ? `<div class="dato">DNI/CUIT: ${pedido.dniCuit}</div>` : ""}
        <div class="dato">Tel: ${pedido.celular || "—"}</div>
        <div class="dato">${pedido.localidad || "—"}${pedido.provincia ? `, ${pedido.provincia}` : ""}</div>
        ${pedido.codigoPostal ? `<div class="dato">CP: ${pedido.codigoPostal}</div>` : ""}
      </div>

      <div class="bloque">
        <div class="titulo">Paquete</div>
        <div class="medidas"><span>Caja</span><strong>${anchoCaja} × ${altoCaja} × ${espesorCaja} cm</strong></div>
        <div class="medidas"><span>Peso aprox.</span><strong>${peso} kg</strong></div>
        ${estimado ? `<div class="aviso-peso">⚠ Peso estimado — pesar si hay dudas.</div>` : ""}
        <div class="medidas"><span>Bultos</span><strong>${Number(pedido.cant) > 1 ? pedido.cant : 1}</strong></div>
      </div>
    </div>`;
  }).join("");

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Rótulos (${lista.length})</title>
<style>
  * { box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color:#111; margin:8mm; }
  .grilla { display:grid; grid-template-columns:1fr 1fr; gap:6mm; }
  .rotulo { border:2.5px solid #111; border-radius:8px; padding:10px; page-break-inside:avoid; break-inside:avoid; }
  .bloque { margin-bottom:8px; padding-bottom:7px; border-bottom:1px dashed #999; }
  .bloque:last-child { border-bottom:none; margin-bottom:0; padding-bottom:0; }
  .titulo { font-size:9px; font-weight:700; letter-spacing:0.5px; color:#666; text-transform:uppercase; margin-bottom:3px; }
  .nombre { font-size:13px; font-weight:700; }
  .dato { font-size:11px; margin-top:1px; }
  .medidas { display:flex; justify-content:space-between; font-size:11px; margin-top:4px; }
  .medidas strong { font-size:12px; }
  .pedido-num { text-align:center; font-size:15px; font-weight:800; letter-spacing:0.5px; margin-bottom:8px; }
  .aviso-peso { font-size:9px; color:#a15c00; margin-top:3px; }
  @media print { body { margin:5mm; } }
</style></head>
<body>
  <div class="grilla">${bloques}
  </div>
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body></html>`;
  const ventana = window.open("", "_blank");
  if (ventana) { ventana.document.write(html); ventana.document.close(); }
}

function abrirGarantia(pedidosOEspejo) {
  const espejos = Array.isArray(pedidosOEspejo) ? pedidosOEspejo : [pedidosOEspejo];
  const primero = espejos[0];
  const fechaCompra = primero.fecha ? new Date(primero.fecha + "T00:00:00").toLocaleDateString("es-AR") : "—";
  const ordenes = [...new Set(espejos.map((e) => e.orden))].join(", ");
  const bloquesDatos = espejos.map((pedido, i) => {
    const medida = `${pedido.ancho} × ${pedido.alto} cm${Number(pedido.cant) > 1 ? ` (×${pedido.cant})` : ""}`;
    const funciones = funcionesPedido(pedido, true).map((f) => f.label).join(", ") || "—";
    return `
  <div class="datos">
    ${espejos.length > 1 ? `<div class="datos-titulo">Espejo ${i + 1} de ${espejos.length}</div>` : ""}
    <div><strong>Medida:</strong> ${medida}</div>
    <div><strong>Forma:</strong> ${pedido.forma || "—"}</div>
    <div><strong>Tipo:</strong> ${pedido.tipo || "—"}</div>
    <div><strong>Tono de luz:</strong> ${pedido.tono || "—"}</div>
    <div><strong>Funciones:</strong> ${funciones}</div>
  </div>`;
  }).join("");
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Garantía — Pedido #${ordenes}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color:#1a1a1a; max-width:720px; margin:40px auto; padding:0 24px; line-height:1.6; }
  h1 { font-size:22px; margin-bottom:4px; }
  .sub { color:#555; font-size:13px; margin-bottom:28px; }
  .datos { background:#f5f3ef; border:1px solid #ddd; border-radius:10px; padding:16px 20px; margin:16px 0; font-size:14px; }
  .datos-titulo { font-weight:700; margin-bottom:8px; color:#333; }
  .datos div { margin-bottom:4px; }
  .datos strong { display:inline-block; min-width:150px; }
  p { font-size:14px; text-align:justify; }
  ol { font-size:14px; padding-left:20px; }
  ol li { margin-bottom:10px; text-align:justify; }
  .firma { margin-top:50px; font-size:14px; }
  @media print { body { margin:20px auto; } }
</style></head>
<body>
  <h1>Garantía del Espejo por 6 (Seis) Meses</h1>
  <div class="sub">DECOGLASS ESPEJOS ILUMINADOS</div>

  <p>Nos comprometemos a proporcionar una garantía para el espejo que ha adquirido, sujeto a los términos y condiciones establecidos a continuación.</p>

  <div class="datos">
    <div><strong>Pedido:</strong> #${ordenes}</div>
    <div><strong>Cliente:</strong> ${primero.cliente || "—"}</div>
    <div><strong>Fecha de compra:</strong> ${fechaCompra}</div>
  </div>
  ${bloquesDatos}

  <ol>
    <li><strong>Duración:</strong> Esta garantía es válida por un período de seis meses a partir de la fecha de compra.</li>
    <li><strong>Cobertura:</strong> Garantizamos que el espejo estará libre de defectos de fabricación y mano de obra durante el período de garantía. Si se descubre cualquier defecto debido a un error de fabricación o defecto de material dentro de los seis meses, repararemos o reemplazaremos el espejo, a nuestra discreción, sin costo adicional para usted.</li>
    <li><strong>Exclusiones:</strong> Esta garantía no cubre los daños causados por un uso indebido, abuso, negligencia, accidentes, instalación inadecuada o cualquier modificación no autorizada realizada en el espejo. Además, no nos responsabilizamos por daños incidentales o consecuentes que puedan surgir como resultado del mal uso del espejo.</li>
    <li>Si desea presentar un reclamo bajo esta garantía, deberá ponerse en contacto con nuestro servicio de atención al cliente dentro del período de garantía. Le proporcionaremos instrucciones sobre cómo proceder.</li>
  </ol>

  <p>Si tiene alguna pregunta o inquietud relacionada con esta garantía, no dude en ponerse en contacto con nosotros.</p>

  <div class="firma">
    Atentamente,<br/>
    <strong>DECOGLASS</strong><br/>
    1159513250 — Sergio Romano
  </div>

  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body></html>`;
  const ventana = window.open("", "_blank");
  if (ventana) { ventana.document.write(html); ventana.document.close(); }
}

function SeguimientoPublico({ pedidoId }) {
  const [pedido, setPedido] = useState(undefined); // undefined = cargando, null = no encontrado
  const [tema] = useState(() => {
    try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "dark"; }
  });

  useEffect(() => {
    let activo = true;
    async function cargar() {
      try {
        const p = await pedidosStore.getOne(pedidoId);
        if (activo) setPedido(p || null);
      } catch (e) { if (activo) setPedido(null); }
    }
    cargar();
    const interval = window.setInterval(cargar, 20000);
    return () => { activo = false; window.clearInterval(interval); };
  }, [pedidoId]);

  if (pedido === undefined) {
    return (
      <div className="dg-app dg-seguimiento" data-theme={tema}>
        <Style />
        <div className="dg-loading"><Loader2 className="dg-spin" size={26} /><span>Buscando tu pedido...</span></div>
      </div>
    );
  }
  if (pedido === null || pedido.estado === "Cancelado") {
    const linkGenerico = `${waLink(WHATSAPP_CONSULTAS)}?text=${encodeURIComponent("Hola! Tengo una consulta sobre mi pedido")}`;
    return (
      <div className="dg-app dg-seguimiento" data-theme={tema}>
        <Style />
        <div className="dg-seguimiento-wrap">
          <div className="dg-seguimiento-brand">DECOGLASS</div>
          <div className="dg-empty" style={{ marginTop: 24 }}>
            {pedido === null ? "No encontramos ningún pedido con este link. Consultanos si creés que es un error." : "Este pedido fue cancelado. Consultanos si tenés dudas."}
          </div>
          <a className="dg-btn-primary dg-seguimiento-whatsapp" href={linkGenerico} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} /> Consultas y reclamos por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const pasoActual = pasoPublicoDe(pedido);
  const produccionCompletada = pasosProduccionCompletados(pedido);
  const entrega = ENTREGA_ESTILO[pedido.metodo] || ENTREGA_ESTILO.default;
  const funciones = funcionesPedido(pedido, true);
  const linkConsulta = `${waLink(WHATSAPP_CONSULTAS)}?text=${encodeURIComponent(`Hola! Tengo una consulta sobre mi pedido #${pedido.orden}`)}`;
  const puedeDescargarFactura = pedido.tipoFactura === "Cons. Final / B" || pedido.tipoFactura === "Factura A";
  const pasosPub = pasosPublicosDe(pedido);
  const esInterior = pedido.metodo === "Interior";

  return (
    <div className="dg-app dg-seguimiento" data-theme={tema}>
      <Style />
      <div className="dg-seguimiento-wrap">
        <div className="dg-seguimiento-brand">DECOGLASS</div>
        <div className="dg-seguimiento-card">
          <div className="dg-seguimiento-head">
            <span>Pedido #{pedido.orden}</span>
            <span className="dg-fab-entrega" style={{ "--ec": entrega.color }}>{pedido.metodo}</span>
          </div>

          <div className="dg-seguimiento-pasos">
            {pasosPub.map((paso, i) => (
              <div key={paso.id} className={`dg-seguimiento-paso ${i < pasoActual ? "dg-seg-hecho" : i === pasoActual ? "dg-seg-actual" : ""}`}>
                <span className="dg-seguimiento-punto">{i < pasoActual ? <Check size={13} /> : i + 1}</span>
                <span>{paso.label}</span>
              </div>
            ))}
          </div>

          {pasoActual === 1 && produccionCompletada < PRODUCCION_PASOS.length && (
            <p className="dg-hint" style={{ marginTop: 10 }}>
              Etapa actual en fábrica: <strong>{PRODUCCION_PASOS[produccionCompletada]?.label}</strong>
            </p>
          )}
          {pedido.listo && pasoActual < pasosPub.length && (
            <p className="dg-hint" style={{ marginTop: 6 }}>Fecha de entrega estimada: <strong>{pedido.listo}</strong></p>
          )}
          {pasoActual === 3 && !esInterior && (
            <p className="dg-hint" style={{ marginTop: 10, color: "var(--dg-success)" }}>
              <strong>Espejo listo para coordinar entrega.</strong>
            </p>
          )}
          {pasoActual === 3 && esInterior && (
            <p className="dg-hint" style={{ marginTop: 10, color: "var(--dg-success)" }}>
              <strong>Espejo listo. Lo estamos preparando para despachar por Vía Cargo.</strong>
            </p>
          )}
          {pasoActual === 4 && esInterior && (
            <p className="dg-hint" style={{ marginTop: 10, color: "var(--dg-success)" }}>
              <strong>Despachado. Ya podés seguirlo con el número de guía más abajo.</strong>
            </p>
          )}

          <div className="dg-verif-specs" style={{ marginTop: 16 }}>
            <div className="dg-fab-medida">
              <strong>{pedido.ancho} × {pedido.alto}</strong><small>cm</small>
              {Number(pedido.cant) > 1 && <span className="dg-fab-cant">× {pedido.cant}</span>}
            </div>
            <div className="dg-fab-linea">{pedido.forma} · {pedido.tipo} · <span className="dg-fab-tono">{pedido.tono || "—"}</span></div>
            {funciones.length > 0 && (
              <div className="dg-fab-funciones">
                {funciones.map((f, i) => (<span className="dg-fab-func" key={i}>{f.label}</span>))}
              </div>
            )}
            {pedido.grabado && <div className="dg-fab-obs"><span>Observaciones</span> {pedido.grabado}</div>}
          </div>

          <div className="dg-seguimiento-docs">
            {puedeDescargarFactura && (
              pedido.facturaUrl
                ? <a className="dg-btn-ghost" href={pedido.facturaUrl} target="_blank" rel="noopener noreferrer"><FileText size={14} /> Descargar factura</a>
                : <span className="dg-pago-meta dg-seguimiento-doc-pendiente">La factura todavía no fue cargada. Consultanos por WhatsApp.</span>
            )}
            {pedido.metodo === "Interior" && pedido.remitoUrl && (
              <a className="dg-btn-ghost" href={pedido.remitoUrl} target="_blank" rel="noopener noreferrer"><FileText size={14} /> Descargar remito de Vía Cargo</a>
            )}
            {pedido.metodo === "Interior" && pedido.remitoNumeroGuia?.trim() && (
              <a className="dg-btn-ghost" href={linkViaCargo(pedido.remitoNumeroGuia)} target="_blank" rel="noopener noreferrer"><Truck size={14} /> Seguir envío en Vía Cargo</a>
            )}
            <button className="dg-btn-ghost" onClick={() => abrirGarantia(pedido)}><ShieldCheck size={14} /> Descargar garantía</button>
          </div>

          <a className="dg-btn-primary dg-seguimiento-whatsapp" href={linkConsulta} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} /> Consultas y reclamos por WhatsApp
          </a>
        </div>
        <p className="dg-seguimiento-footer">Esta página se actualiza sola. Ante cualquier duda, escribinos.</p>
      </div>
    </div>
  );
}

function SeguimientoGrupoPublico({ grupoId }) {
  const [espejos, setEspejos] = useState(undefined); // undefined = cargando, null/[] = no encontrado
  const [tema] = useState(() => {
    try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "dark"; }
  });

  useEffect(() => {
    let activo = true;
    async function cargar() {
      try {
        const lista = await pedidosStore.getByGrupoId(grupoId);
        if (activo) setEspejos(lista);
      } catch (e) { if (activo) setEspejos([]); }
    }
    cargar();
    const interval = window.setInterval(cargar, 20000);
    return () => { activo = false; window.clearInterval(interval); };
  }, [grupoId]);

  if (espejos === undefined) {
    return (
      <div className="dg-app dg-seguimiento" data-theme={tema}>
        <Style />
        <div className="dg-loading"><Loader2 className="dg-spin" size={26} /><span>Buscando tu pedido...</span></div>
      </div>
    );
  }

  const primero = espejos[0];
  if (!primero) {
    return (
      <div className="dg-app dg-seguimiento" data-theme={tema}>
        <Style />
        <div className="dg-seguimiento-wrap">
          <div className="dg-seguimiento-brand">DECOGLASS</div>
          <div className="dg-empty" style={{ marginTop: 24 }}>No encontramos ningún pedido con este link. Consultanos si creés que es un error.</div>
          <a className="dg-btn-primary dg-seguimiento-whatsapp" href={`${waLink(WHATSAPP_CONSULTAS)}?text=${encodeURIComponent("Hola! Tengo una consulta sobre mi pedido")}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} /> Consultas y reclamos por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const todosCancelados = espejos.every((e) => e.estado === "Cancelado");
  const activos = espejos.filter((e) => e.estado !== "Cancelado");
  const conFacturaUrl = espejos.find((e) => e.facturaUrl);
  const conRemito = espejos.find((e) => e.remitoNumeroGuia?.trim());
  const puedeDescargarFactura = primero.tipoFactura === "Cons. Final / B" || primero.tipoFactura === "Factura A";
  const linkConsulta = `${waLink(WHATSAPP_CONSULTAS)}?text=${encodeURIComponent(`Hola! Tengo una consulta sobre mi pedido #${primero.orden}`)}`;

  return (
    <div className="dg-app dg-seguimiento" data-theme={tema}>
      <Style />
      <div className="dg-seguimiento-wrap">
        <div className="dg-seguimiento-brand">DECOGLASS</div>

        {todosCancelados ? (
          <div className="dg-empty" style={{ marginTop: 12 }}>Este pedido fue cancelado. Consultanos si tenés dudas.</div>
        ) : (
          <div className="dg-seguimiento-card">
            <div className="dg-seguimiento-head">
              <span>Pedido #{primero.orden}</span>
              <span className="dg-pago-meta">{totalUnidades(activos)} espejo(s)</span>
            </div>

            {activos.map((pedido, i) => {
              const pasoActual = pasoPublicoDe(pedido);
              const produccionCompletada = pasosProduccionCompletados(pedido);
              const funciones = funcionesPedido(pedido, true);
              const entrega = ENTREGA_ESTILO[pedido.metodo] || ENTREGA_ESTILO.default;
              const pasosPub = pasosPublicosDe(pedido);
              const esInterior = pedido.metodo === "Interior";
              return (
                <div className="dg-seguimiento-espejo" key={pedido.id}>
                  <div className="dg-seguimiento-espejo-titulo">
                    Espejo {i + 1} de {activos.length}
                    <span className="dg-fab-entrega" style={{ "--ec": entrega.color }}>{pedido.metodo}</span>
                  </div>
                  <div className="dg-verif-specs" style={{ marginTop: 8 }}>
                    <div className="dg-fab-medida">
                      <strong>{pedido.ancho} × {pedido.alto}</strong><small>cm</small>
                      {Number(pedido.cant) > 1 && <span className="dg-fab-cant">× {pedido.cant}</span>}
                    </div>
                    <div className="dg-fab-linea">{pedido.forma} · {pedido.tipo} · <span className="dg-fab-tono">{pedido.tono || "—"}</span></div>
                    {funciones.length > 0 && (
                      <div className="dg-fab-funciones">
                        {funciones.map((f, j) => (<span className="dg-fab-func" key={j}>{f.label}</span>))}
                      </div>
                    )}
                    {pedido.grabado && <div className="dg-fab-obs"><span>Observaciones</span> {pedido.grabado}</div>}
                  </div>

                  <div className="dg-seguimiento-pasos" style={{ marginTop: 10 }}>
                    {pasosPub.map((paso, j) => (
                      <div key={paso.id} className={`dg-seguimiento-paso ${j < pasoActual ? "dg-seg-hecho" : j === pasoActual ? "dg-seg-actual" : ""}`}>
                        <span className="dg-seguimiento-punto">{j < pasoActual ? <Check size={13} /> : j + 1}</span>
                        <span>{paso.label}</span>
                      </div>
                    ))}
                  </div>
                  {pasoActual === 1 && produccionCompletada < PRODUCCION_PASOS.length && (
                    <p className="dg-hint" style={{ marginTop: 8 }}>Etapa actual en fábrica: <strong>{PRODUCCION_PASOS[produccionCompletada]?.label}</strong></p>
                  )}
                  {pasoActual === 3 && !esInterior && (
                    <p className="dg-hint" style={{ marginTop: 8, color: "var(--dg-success)" }}><strong>Espejo listo para coordinar entrega.</strong></p>
                  )}
                  {pasoActual === 3 && esInterior && (
                    <p className="dg-hint" style={{ marginTop: 8, color: "var(--dg-success)" }}><strong>Espejo listo. Lo estamos preparando para despachar por Vía Cargo.</strong></p>
                  )}
                  {pasoActual === 4 && esInterior && (
                    <p className="dg-hint" style={{ marginTop: 8, color: "var(--dg-success)" }}><strong>Despachado. Ya podés seguirlo con el número de guía más abajo.</strong></p>
                  )}
                </div>
              );
            })}

            <div className="dg-seguimiento-docs">
              {puedeDescargarFactura && (
                conFacturaUrl
                  ? <a className="dg-btn-ghost" href={conFacturaUrl.facturaUrl} target="_blank" rel="noopener noreferrer"><FileText size={14} /> Descargar factura</a>
                  : <span className="dg-pago-meta dg-seguimiento-doc-pendiente">La factura todavía no fue cargada. Consultanos por WhatsApp.</span>
              )}
              {conRemito?.remitoUrl && (
                <a className="dg-btn-ghost" href={conRemito.remitoUrl} target="_blank" rel="noopener noreferrer"><FileText size={14} /> Descargar remito de Vía Cargo</a>
              )}
              {conRemito && (
                <a className="dg-btn-ghost" href={linkViaCargo(conRemito.remitoNumeroGuia)} target="_blank" rel="noopener noreferrer"><Truck size={14} /> Seguir envío en Vía Cargo</a>
              )}
              <button className="dg-btn-ghost" onClick={() => abrirGarantia(activos)}><ShieldCheck size={14} /> Descargar garantía</button>
            </div>
          </div>
        )}

        <a className="dg-btn-primary dg-seguimiento-whatsapp" href={linkConsulta} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={15} /> Consultas y reclamos por WhatsApp
        </a>
        <p className="dg-seguimiento-footer">Esta página se actualiza sola. Ante cualquier duda, escribinos.</p>
      </div>
    </div>
  );
}

function linkSeguimiento(pedido) {
  if (pedido.grupoId) return `${window.location.origin}/seguimiento/grupo/${pedido.grupoId}`;
  return `${window.location.origin}/seguimiento/${pedido.id}`;
}

function linkViaCargo(numeroGuia) {
  return `https://viacargo.com.ar/seguimiento-de-envio/${(numeroGuia || "").trim()}/`;
}

export default function Root() {
  const path = window.location.pathname;
  const matchGrupo = path.match(/^\/seguimiento\/grupo\/([^/]+)\/?$/);
  if (matchGrupo) return <SeguimientoGrupoPublico grupoId={matchGrupo[1]} />;
  const match = path.match(/^\/seguimiento\/([^/]+)\/?$/);
  if (match) return <SeguimientoPublico pedidoId={match[1]} />;
  return <App />;
}
