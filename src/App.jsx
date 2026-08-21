import { useState, useEffect, useRef } from "react";
import { storage } from "./lib/storage";
import {
  Megaphone, ShoppingCart, Calculator, Factory, Truck, Headphones,
  Lock, Plus, Trash2, X, ShieldCheck, User, LogOut, Loader2, Wallet,
  Pencil, RotateCcw, Sparkles, Building2, TrendingUp, TrendingDown,
  FileText, Printer, Copy, Settings2, AlertTriangle, Save, ClipboardList, Check,
  Instagram, MessageCircle, UserPlus, Users, Filter, ExternalLink, BarChart3,
  Wrench, Package, CheckCircle2, XCircle, CircleDollarSign, ArrowLeft, Download, PackagePlus, ChevronRight, CalendarDays
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";
import sectorScenes from "./assets/sector-scenes.png";

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
  marketing:      { accent: "#E8739E", position: "0% 0%" },
  ventas:         { accent: "#5BB8E0", position: "50% 0%" },
  administracion: { accent: "#7C8FE8", position: "100% 0%" },
  fabrica:        { accent: "#9098A8", position: "0% 100%" },
  postventa:      { accent: "#B583DE", position: "50% 100%" },
  logistica:      { accent: "#4FA0D8", position: "100% 100%" },
};

function RoomScene({ sector }) {
  const visual = SECTOR_VISUAL[sector.id] || { accent: "#4FC3C0", position: "50% 50%" };
  const Icon = ICONS[sector.icon];
  return (
    <div className="dg-room-scene" style={{ "--accent": visual.accent }}>
      <div className="dg-scene-image" style={{ backgroundImage: `url(${sectorScenes})`, backgroundPosition: visual.position }} />
      <div className="dg-scene-shade" />
      {Icon && <Icon className="dg-scene-watermark" />}
    </div>
  );
}
const CHART_PALETTE = ["#4FC3C0", "#E5B54F", "#E06A6A", "#8B96A8", "#7DD3FC", "#C4B5FD"];

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
  green:  { glow: "#5BC98B", label: "Al día" },
  yellow: { glow: "#E5B54F", label: "Atención" },
  red:    { glow: "#E06A6A", label: "Crítico" },
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
  respondio: { label: "Respondió", color: "#4FC3C0" },
  no_respondio: { label: "No respondió", color: "#E06A6A" },
  venta_cerrada: { label: "Venta cerrada", color: "#5BC98B" },
  perdido: { label: "Sin cerrar / Perdido", color: "#E5B54F" },
};
const DEFAULT_VENDEDORES = ["Cande", "Dou", "Facu", "Fran", "Sergio"];

const QUICK_BUTTONS = [
  { estado: "mensaje_enviado", label: "Le escribí a alguien", icon: "MessageCircle", color: "#8B96A8" },
  { estado: "respondio", label: "Me respondió", icon: "Check", color: "#4FC3C0" },
  { estado: "venta_cerrada", label: "¡Compró!", icon: "ShoppingCart", color: "#5BC98B" },
];

const FORMA_OPTIONS = ["Rectangular", "Pastilla", "Circular", "P. Curvas", "Ovalado", "Orgánico", "Capilla Arriba", "Capilla Abajo", "Capilla Izquierda", "Soft Orgánico", "Otro"];
const TIPO_PEDIDO_OPTIONS = ["Simple", "Importado", "Esm.", "Sin led", "Biselado"];
const TOUCH_OPTIONS = ["Touch", "No"];
const DESEMP_OPTIONS = ["Desempañante", "No"];
const DESEMP_TIPO_OPTIONS = ["220", "Touch"];
const HORATEMP_OPTIONS = ["Hora y Temperatura", "No"];
const BLUETOOTH_PEDIDO_OPTIONS = ["No", "Bluetooth 1 parlante", "Bluetooth 2 parlantes"];
const TONO_OPTIONS = ["3 tonos", "Cálida", "Fría", "Neutra", "Sin led"];
const TIPOFACTURA_OPTIONS = ["Efectivo / No", "Cons. Final / B", "EcomApp", "Factura A", "No aplica", "Cambio de espejo"];
const ESTADO_PEDIDO_OPTIONS = ["Sin pasar a fábrica", "Verificado", "Mandar a grabar", "En grabado", "Pedir biselado", "Para armar", "Espejo listo", "Entregado", "Cancelado"];
const METODO_OPTIONS = ["A confirmar", "Retira", "Envío", "Envío flex", "Interior", "Colocación", "Otro"];
const PULIDO_OPTIONS = ["No", "Sí"];
const TALLER_PROCESOS = [
  { id: "simples", label: "Simples", description: "Corte, pulido y armado estándar", color: "#4FC3C0" },
  { id: "esmerilados", label: "Esmerilados", description: "Grabado o esmerilado antes del armado", color: "#E5B54F" },
  { id: "biselados", label: "Biselados", description: "Proceso de biselado y terminación especial", color: "#B583DE" },
];
const PRODUCCION_PASOS = [
  { id: "cortado", label: "Cortado", accion: "Marcar cortado", fechaCampo: "produccionCortadoFecha", responsableCampo: "produccionCortadoPor" },
  { id: "armado", label: "Armado", accion: "Marcar armado", fechaCampo: "produccionArmadoFecha", responsableCampo: "produccionArmadoPor" },
  { id: "embalado", label: "Embalado", accion: "Marcar embalado", fechaCampo: "produccionEmbaladoFecha", responsableCampo: "produccionEmbaladoPor" },
];
const ENTREGA_ESTILO = {
  "Interior": { clase: "interior", color: "#B583DE", icono: "🚚" },
  "Envío flex": { clase: "flex", color: "#E5B54F", icono: "⚡" },
  "Envío": { clase: "envio", color: "#4FC3C0", icono: "🚚" },
  "Colocación": { clase: "coloca", color: "#7C8FE8", icono: "🔧" },
  "Retira": { clase: "retira", color: "#8B96A8", icono: "🏢" },
  default: { clase: "otro", color: "#8B96A8", icono: "📦" },
};

const ENVIO_METODOS = ["Envío", "Envío flex", "Interior", "Colocación"];

function esPedidoConEnvio(pedido) {
  return ENVIO_METODOS.includes(pedido?.metodo);
}

function pedidoFueVerificado(pedido) {
  return Boolean(pedido) && pedido.estado !== "Sin pasar a fábrica" && pedido.estado !== "Cancelado";
}

function pedidoEstaListo(pedido) {
  return pedido?.estado === "Espejo listo" || pedido?.estado === "Entregado";
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
const RECLAMO_COLORS = ["#E06A6A", "#E5B54F", "#4FC3C0", "#8B96A8", "#7DD3FC", "#C4B5FD", "#5BC98B"];

const ESTADO_PEDIDO_COLOR = {
  "Sin pasar a fábrica": "#8B96A8", "Verificado": "#E5B54F", "Pasado a fábrica": "#4FC3C0", "Mandar a grabar": "#E5B54F",
  "En grabado": "#E5B54F", "Pedir biselado": "#E5B54F", "Para armar": "#E5B54F", "Espejo listo": "#4FC3C0", "Entregado": "#5BC98B",
  "Cancelado": "#E06A6A",
};
const COMISION_COLOR = { "No": "#8B96A8", "Liquidar": "#E5B54F", "Sí": "#5BC98B", "No aplica": "#5B6576" };

const METODO_ICON = { "Retira": "Building2", "Envío": "Truck", "Envío flex": "Truck", "Interior": "Truck", "Colocación": "Wrench", "Otro": "Package" };

const ESTADO_STAGE = {
  "Sin pasar a fábrica": { stage: "Sin verificar", color: "#8B96A8" },
  "Verificado": { stage: "Verificado", color: "#E5B54F" },
  "Pasado a fábrica": { stage: "Verificado", color: "#E5B54F" },
  "Mandar a grabar": { stage: "Para cortar / grabar", color: "#E5B54F" },
  "En grabado": { stage: "Para cortar / grabar", color: "#E5B54F" },
  "Pedir biselado": { stage: "Para cortar / grabar", color: "#E5B54F" },
  "Para armar": { stage: "Para cortar / grabar", color: "#E5B54F" },
  "Espejo listo": { stage: "Espejo listo", color: "#4FC3C0" },
  "Entregado": { stage: "Entregado", color: "#5BC98B" },
  "Cancelado": { stage: "Cancelado", color: "#E06A6A" },
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
  { categoria: "Vidrio", nombre: "Plancha de espejo", unidad: "m²", minimo: 12 },
  { categoria: "Perfilería", nombre: "Aluminio (perfil)", unidad: "m", minimo: 40 },
  { categoria: "Iluminación", nombre: "Tira LED 3 tonos", unidad: "u", minimo: 20 },
  { categoria: "Electrónica", nombre: "Transformador", unidad: "u", minimo: 20 },
  { categoria: "Electrónica", nombre: "Sensor touch", unidad: "u", minimo: 15 },
  { categoria: "Electrónica", nombre: "Panel desempañante 30x30", unidad: "u", minimo: 5 },
  { categoria: "Electrónica", nombre: "Panel desempañante 30x40", unidad: "u", minimo: 5 },
  { categoria: "Electrónica", nombre: "Panel desempañante 40x60", unidad: "u", minimo: 5 },
  { categoria: "Electrónica", nombre: "Módulo hora y temperatura", unidad: "u", minimo: 10 },
  { categoria: "Electrónica", nombre: "Módulo Bluetooth", unidad: "u", minimo: 10 },
  { categoria: "Electrónica", nombre: "Parlante", unidad: "u", minimo: 10 },
  { categoria: "Químicos", nombre: "Sellador / silicona", unidad: "ml", minimo: 500 },
  { categoria: "Químicos", nombre: "Alcohol isopropílico", unidad: "l", minimo: 3 },
  { categoria: "Embalaje", nombre: "Film burbuja", unidad: "m²", minimo: 50 },
  { categoria: "Embalaje", nombre: "Film stretch", unidad: "m", minimo: 200 },
  { categoria: "Embalaje", nombre: "Cinta de embalar", unidad: "u", minimo: 10 },
  { categoria: "Embalaje", nombre: "Cartón para puntas", unidad: "u", minimo: 40 },
  { categoria: "Embalaje", nombre: "Madera para cajón (interior)", unidad: "m²", minimo: 10 },
  { categoria: "Embalaje", nombre: "Telgopor (interior)", unidad: "m²", minimo: 10 },
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
  const [stockMateriales, setStockMateriales] = useState(null);
  const [empleadosSueldo, setEmpleadosSueldo] = useState(null);
  const [liquidaciones, setLiquidaciones] = useState(null);
  const [adminKeyExists, setAdminKeyExists] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [saveState, setSaveState] = useState({ estado: "idle" });
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(() => loadSavedSession());
  const [loginOpen, setLoginOpen] = useState(false);
  const [ajustesOpen, setAjustesOpen] = useState(false);
  const [activeSectorId, setActiveSectorId] = useState(null);

  function startSession(s) {
    setSession(s);
    saveSession(s);
    setLoginOpen(false);
  }
  function endSession() {
    setSession(null);
    saveSession(null);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeSectorId]);

  useEffect(() => {
    if (saveState.estado !== "ok") return;
    const t = setTimeout(() => setSaveState({ estado: "idle" }), 1800);
    return () => clearTimeout(t);
  }, [saveState]);

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
      const stm = await storage.get("stock-materiales", true);
      setStockMateriales(stm ? JSON.parse(stm.value) : []);
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
      if (ad) { setAdmins(JSON.parse(ad.value)); setAdminKeyExists(true); }
      else {
        const viejo = await storage.get("admin-key", true);
        if (viejo) {
          const migrado = [{ id: uid(), nombre: "Facundo", clave: viejo.value }];
          setAdmins(migrado); setAdminKeyExists(true);
          try { await storage.set("admins", JSON.stringify(migrado), true); } catch (e) {}
        } else { setAdmins([]); setAdminKeyExists(false); }
      }
    } catch (e) { setAdminKeyExists(false); }
    setLoading(false);
  }

  // Guardado con aviso: si falla, la persona se entera en vez de perder el dato en silencio.
  async function guardar(clave, valor, aplicarEnPantalla, revertir) {
    aplicarEnPantalla();
    setSaveState({ estado: "guardando" });
    try {
      await storage.set(clave, JSON.stringify(valor), true);
      setSaveState({ estado: "ok", ts: Date.now() });
    } catch (e) {
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
  async function persistPedidos(next) { guardar("pedidos", next, () => setPedidos(next)); }
  async function persistRecursos(next) { guardar("recursos-venta", next, () => setRecursos(next)); }
  async function persistFacturas(next) { guardar("facturas-manuales", next, () => setFacturas(next)); }
  async function persistReclamos(next) { guardar("reclamos", next, () => setReclamos(next)); }
  async function persistStockEspejos(next) { guardar("stock-espejos", next, () => setStockEspejos(next)); }
  async function persistStockMateriales(next) { guardar("stock-materiales", next, () => setStockMateriales(next)); }
  async function persistAdmins(next) { guardar("admins", next, () => setAdmins(next)); }
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

  function createIncomeFromPedido(entry) { persistIncomes([entry, ...incomes]); }
  function createPurchaseEntry(entry) { persistPurchases([entry, ...purchases]); }

  function updateSector(id, patch) { persistSectors(sectors.map((s) => (s.id === id ? { ...s, ...patch } : s))); }

  const counts = sectors ? sectors.reduce((acc, s) => { const { key } = getStatus(s.tasks); acc[key] = (acc[key] || 0) + 1; return acc; }, {}) : {};
  const isAdmin = session?.role === "admin";
  const isVentas = session?.role === "sector" && session.sectorId === "ventas";
  const canQuote = isAdmin || isVentas;
  const canSeePedidos = !!session;
  const canEditPedidoFull = isAdmin || isVentas;

  if (loading || !sectors || !purchases || !incomes || !quoteConfig || !quotes || !leads || !vendedores || !pedidos || !recursos || !facturas || !reclamos || !stockEspejos || !stockMateriales || !empleadosSueldo || !liquidaciones) {
    return (<div style={wrap}><Style /><div className="dg-app dg-loading"><Loader2 className="dg-spin" size={28} /><span>Cargando DECOGLASS...</span></div></div>);
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
        onClick={() => setActiveSectorId(sector.id)}
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
      <div className="dg-app">
        <header className="dg-header">
          <div className="dg-brand">
            <div className="dg-brand-mark">DG</div>
            <div><div className="dg-brand-title">DECOGLASS</div><div className="dg-brand-sub">Gestión de sectores · Espejos LED</div></div>
          </div>
          <div className="dg-header-context" aria-label="Estado de la plataforma">
            <span className="dg-live-label"><span className="dg-live-dot" /> Operación interna</span>
            <span className="dg-header-date">{dateLabel}</span>
          </div>
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
          <button className={`dg-nav-btn ${!activeSectorId ? "dg-nav-on" : ""}`} onClick={() => setActiveSectorId(null)} aria-current={!activeSectorId ? "page" : undefined}><Building2 size={14} /> Edificio</button>
          {activeSector && (
            <span className="dg-nav-btn dg-nav-on dg-nav-crumb"><ChevronRight size={13} /> {activeSector.name}</span>
          )}
        </nav>

        {!activeSector && (
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

        {activeSector && (
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
            sectors={sectors}
            recursos={recursos} onChangeRecursos={persistRecursos}
            facturas={facturas} onChangeFacturas={persistFacturas}
            reclamos={reclamos} onChangeReclamos={persistReclamos}
            stockEspejos={stockEspejos} onChangeStockEspejos={persistStockEspejos}
            stockMateriales={stockMateriales} onChangeStockMateriales={persistStockMateriales}
            empleadosSueldo={empleadosSueldo} onChangeEmpleadosSueldo={persistEmpleadosSueldo}
            liquidaciones={liquidaciones} onChangeLiquidaciones={persistLiquidaciones}
          />
        )}
      </div>

      {ajustesOpen && isAdmin && (
        <AjustesModal
          onClose={() => setAjustesOpen(false)}
          admins={admins} onChangeAdmins={persistAdmins} session={session}
          sectors={sectors} onSectorUpdate={updateSector}
          vendedores={vendedores} onChangeVendedores={persistVendedores}
          auditoria={auditoria}
          datos={{ pedidos, incomes, purchases, leads, reclamos, facturas, stockEspejos, stockMateriales, liquidaciones, empleados: empleadosSueldo, sectors, recursos, quotes, admins, auditoria }}
        />
      )}

      <SaveIndicator state={saveState} onDismiss={() => setSaveState({ estado: "idle" })} />

      {loginOpen && (
        <LoginModal
          sectors={sectors} adminKeyExists={adminKeyExists}
          onClose={() => setLoginOpen(false)}
          onAdminKeyCreated={() => setAdminKeyExists(true)}
          onSectorUpdate={updateSector}
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

function OperariosSector({ sector, onSectorUpdate, verClaves }) {
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const operarios = sector.operarios || [];

  function agregar() {
    setError("");
    if (!nombre.trim()) return setError("Poné el nombre del operario.");
    if (clave.length < 4) return setError("La clave debe tener al menos 4 caracteres.");
    if (clave === sector.clave) return setError("Esa clave ya la usa el encargado.");
    if (operarios.some((o) => o.clave === clave)) return setError("Esa clave ya la usa otro operario.");
    onSectorUpdate(sector.id, { operarios: [...operarios, { id: uid(), nombre: nombre.trim(), clave }] });
    setNombre(""); setClave("");
  }
  function quitar(id) { onSectorUpdate(sector.id, { operarios: operarios.filter((o) => o.id !== id) }); }

  return (
    <div className="dg-operarios-box">
      {operarios.length > 0 && (
        <div className="dg-task-list" style={{ marginBottom: 8 }}>
          {operarios.map((o) => (
            <div className="dg-task" key={o.id}>
              <User size={13} style={{ color: "#8B96A8" }} />
              <div className="dg-pago-info">
                <span>{o.nombre}</span>
                <span className="dg-pago-meta">Operario · {verClaves ? `Clave: ${o.clave}` : "Clave: ••••••••"}</span>
              </div>
              <button className="dg-icon-btn dg-task-del" onClick={() => quitar(o.id)}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}
      <EnterFlow onSubmit={agregar} autoFocus={false}>
        <div className="dg-operario-form">
          <input placeholder="Nombre del operario" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input type="password" placeholder="Su clave" value={clave} onChange={(e) => setClave(e.target.value)} />
          <button className="dg-btn-ghost dg-mini-btn" onClick={agregar}><UserPlus size={13} /> Agregar</button>
        </div>
      </EnterFlow>
      {error && <div className="dg-error" style={{ marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function AjustesModal({ onClose, admins, onChangeAdmins, session, sectors, onSectorUpdate, vendedores, onChangeVendedores, datos, auditoria }) {
  const [tab, setTab] = useState("accesos");
  const [verClaves, setVerClaves] = useState(false);

  const tabs = [
    { id: "accesos", label: "Administradores", icon: ShieldCheck },
    { id: "usuarios", label: "Usuarios y claves", icon: Users },
    { id: "respaldo", label: "Respaldo y datos", icon: Save },
    { id: "actividad", label: "Actividad", icon: ClipboardList },
  ];

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal dg-modal-ajustes" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head">
          <div className="dg-sector-page-title">
            <div className="dg-modal-icon" style={{ "--glow": "#4FC3C0" }}><Settings2 size={19} /></div>
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

        {tab === "accesos" && <AdminsPanel admins={admins} onChange={onChangeAdmins} session={session} />}

        {tab === "usuarios" && (
          <div className="dg-page">
            <p className="dg-hint" style={{ marginBottom: 14 }}>
              Cada sector tiene un <strong>encargado</strong> y puede tener varios <strong>operarios</strong>. Los operarios hacen el trabajo del día (marcar tareas, pedidos, stock) pero no pueden borrar registros ni cambiar la configuración del sector.
            </p>
            <button className="dg-btn-ghost" style={{ marginBottom: 14 }} onClick={() => setVerClaves((v) => !v)}>
              {verClaves ? <XCircle size={14} /> : <ShieldCheck size={14} />} {verClaves ? "Ocultar" : "Mostrar"} las claves
            </button>

            <div className="dg-section-card">
              <div className="dg-section-header"><ShieldCheck size={14} /> Administradores</div>
              <div className="dg-task-list" style={{ marginBottom: 0 }}>
                {admins.map((a) => (
                  <div className="dg-task" key={a.id}>
                    <div className="dg-pago-info">
                      <span>{a.nombre}{a.nombre === session?.nombre ? " (vos)" : ""}</span>
                      <span className="dg-pago-meta">{verClaves ? `Clave: ${a.clave}` : "Clave: ••••••••"}</span>
                    </div>
                    <span className="dg-badge" style={{ "--bc": "#4FC3C0" }}>Acceso total</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dg-section-card">
              <div className="dg-section-header"><Building2 size={14} /> Encargados de sector</div>
              <div className="dg-task-list" style={{ marginBottom: 0 }}>
                {sectors.map((sec) => (
                  <div className="dg-sector-usuarios" key={sec.id}>
                    <div className="dg-task">
                      <div className="dg-pago-info">
                        <span>{sec.name} <span className="dg-badge" style={{ "--bc": "#4FC3C0" }}>Encargado</span></span>
                        <span className="dg-pago-meta">
                          {sec.encargado || "Sin encargado"} · {sec.clave ? (verClaves ? `Clave: ${sec.clave}` : "Clave: ••••••••") : "Sin clave configurada"}
                        </span>
                      </div>
                      {sec.clave && (
                        <button className="dg-btn-ghost dg-mini-btn" onClick={() => onSectorUpdate(sec.id, { clave: null })}>
                          <RotateCcw size={13} /> Restablecer
                        </button>
                      )}
                    </div>
                    <OperariosSector sector={sec} onSectorUpdate={onSectorUpdate} verClaves={verClaves} />
                  </div>
                ))}
              </div>
            </div>

            <div className="dg-section-card">
              <div className="dg-section-header"><Users size={14} /> Vendedores del CRM</div>
              <div className="dg-vendedores-chips">
                {vendedores.map((v) => (
                  <span key={v} className="dg-vendedor-chip">{v}<button onClick={() => onChangeVendedores(vendedores.filter((x) => x !== v))}><X size={11} /></button></span>
                ))}
              </div>
            </div>
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
      {aviso && <div className="dg-comision-banner" style={{ background: "rgba(91,201,139,0.1)", borderColor: "rgba(91,201,139,0.35)", color: "#5BC98B" }}><Check size={15} /> {aviso}</div>}

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

function AdminsPanel({ admins, onChange, session }) {
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  function agregar() {
    setError("");
    if (!nombre.trim()) return setError("Poné el nombre.");
    if (admins.some((a) => a.nombre.toLowerCase() === nombre.trim().toLowerCase())) return setError("Ya existe un admin con ese nombre.");
    if (clave.length < 4) return setError("La clave debe tener al menos 4 caracteres.");
    if (clave !== clave2) return setError("Las claves no coinciden.");
    if (admins.some((a) => a.clave === clave)) return setError("Esa clave ya la usa otro admin, elegí otra.");
    onChange([...admins, { id: uid(), nombre: nombre.trim(), clave }]);
    setNombre(""); setClave(""); setClave2("");
    setAviso("Administrador agregado."); setTimeout(() => setAviso(""), 4000);
  }
  function quitar(id) {
    if (admins.length <= 1) { setError("Tiene que quedar al menos un administrador."); return; }
    const a = admins.find((x) => x.id === id);
    if (a && a.nombre === session?.nombre) { setError("No podés eliminar tu propio usuario."); return; }
    onChange(admins.filter((x) => x.id !== id));
  }

  return (
    <div className="dg-page">
      <p className="dg-hint" style={{ marginBottom: 14 }}>
        Los administradores son los únicos que ven <strong>Finanzas, Comisiones y Sueldos</strong>. Los encargados de sector solo ven lo operativo de su área.
      </p>

      <div className="dg-section-card">
        <div className="dg-section-header"><ShieldCheck size={14} /> Administradores</div>
        <div className="dg-task-list" style={{ marginBottom: 0 }}>
          {admins.map((a) => (
            <div className="dg-task" key={a.id}>
              <ShieldCheck size={14} style={{ color: "#4FC3C0" }} />
              <div className="dg-pago-info">
                <span>{a.nombre}{a.nombre === session?.nombre ? " (vos)" : ""}</span>
                <span className="dg-pago-meta">Acceso total al sistema</span>
              </div>
              <button className="dg-icon-btn dg-task-del" onClick={() => quitar(a.id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="dg-section-card">
        <div className="dg-section-header"><UserPlus size={14} /> Agregar administrador</div>
        <EnterFlow onSubmit={agregar} autoFocus={false}>
          <div className="dg-field-grid">
            <Field label="Nombre"><input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Sergio" /></Field>
            <Field label="Clave"><input type="password" value={clave} onChange={(e) => setClave(e.target.value)} /></Field>
            <Field label="Repetir clave"><input type="password" value={clave2} onChange={(e) => setClave2(e.target.value)} /></Field>
          </div>
        </EnterFlow>
        {error && <div className="dg-error" style={{ marginTop: 8 }}>{error}</div>}
        {aviso && <div style={{ marginTop: 8, fontSize: 12, color: "#5BC98B" }}>{aviso}</div>}
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
    grupo.items.forEach((p) => { montos[p.id] = comisionMonto(p, empleados); });
    onChangePedidos(pedidos.map((p) => (ids.includes(p.id)
      ? { ...p, comisionPagada: true, comisionLiquidadaMonto: montos[p.id], comisionFechaPago: new Date().toISOString().slice(0, 10) }
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

      {aviso && <div className="dg-comision-banner" style={{ background: "rgba(91,201,139,0.1)", borderColor: "rgba(91,201,139,0.35)", color: "#5BC98B" }}><Check size={15} /> {aviso}</div>}

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
        <div className="dg-total-card" style={{ "--c": verPagadas ? "#5BC98B" : "#E5B54F" }}>
          <span>{verPagadas ? "Total pagado en comisiones" : "Total a pagar en comisiones"}</span>
          <strong>{money(totalGeneral)}</strong>
        </div>
        <div className="dg-total-card" style={{ "--c": "#4FC3C0" }}><span>Pedidos involucrados</span><strong>{lista.length}</strong></div>
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
              <span className="dg-badge" style={{ "--bc": g.pct > 0 ? "#4FC3C0" : "#E06A6A" }}>{g.pct}%</span>
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
                  <span className="dg-pago-monto" style={{ color: "#E5B54F" }}>
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
function celdaVacia() { return { horas: "", ventas: "", he: "", adelanto: "", plus: false }; }
function filaVacia(empleadoId, periodo) {
  const semanas = {};
  SEMANAS.forEach((n) => { semanas[n] = celdaVacia(); });
  return { id: uid(), empleadoId, periodo, semanas, nota: "" };
}
const nnum = (v) => Number(v) || 0;

function totalesFila(emp, fila) {
  const sem = fila?.semanas || {};
  const horas = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.horas), 0);
  const ventas = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.ventas), 0);
  const he = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.he), 0);
  const adelantos = SEMANAS.reduce((a, n) => a + nnum(sem[n]?.adelanto), 0);
  const pluses = SEMANAS.filter((n) => sem[n]?.plus).length;
  const pagoHoras = horas * nnum(emp?.valorHora);
  const pagoComision = ventas * (nnum(emp?.comisionPct) / 100);
  const pagoHE = he * nnum(emp?.valorHoraExtra);
  const pagoPlus = pluses * nnum(emp?.plusSemanal);
  const total = emp?.sector === "Taller"
    ? nnum(emp?.sueldoBase) + nnum(emp?.complementoFijo) + pagoHE + pagoPlus - adelantos
    : pagoHoras + pagoComision;
  return { horas, ventas, he, adelantos, pluses, pagoHoras, pagoComision, pagoHE, pagoPlus, total };
}

function SueldosPanel({ empleados, onChangeEmpleados, liquidaciones, onChangeLiquidaciones }) {
  const [periodo, setPeriodo] = useState(periodoActual());
  const [verEmpleados, setVerEmpleados] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  const oficina = empleados.filter((e) => e.sector === "Oficina/Ventas");
  const taller = empleados.filter((e) => e.sector === "Taller");

  function filaDe(empId) {
    return liquidaciones.find((l) => l.empleadoId === empId && l.periodo === periodo && l.semanas) || null;
  }
  function setCelda(empId, semana, campo, valor) {
    const existe = filaDe(empId);
    if (existe) {
      onChangeLiquidaciones(liquidaciones.map((l) => (l.id === existe.id
        ? { ...l, semanas: { ...l.semanas, [semana]: { ...celdaVacia(), ...l.semanas[semana], [campo]: valor } } }
        : l)));
    } else {
      const nueva = filaVacia(empId, periodo);
      nueva.semanas[semana] = { ...celdaVacia(), [campo]: valor };
      onChangeLiquidaciones([nueva, ...liquidaciones]);
    }
  }
  function setNota(empId, nota) {
    const existe = filaDe(empId);
    if (existe) onChangeLiquidaciones(liquidaciones.map((l) => (l.id === existe.id ? { ...l, nota } : l)));
    else onChangeLiquidaciones([{ ...filaVacia(empId, periodo), nota }, ...liquidaciones]);
  }
  function saveEmpleado(emp) {
    const exists = empleados.some((e) => e.id === emp.id);
    onChangeEmpleados(exists ? empleados.map((e) => (e.id === emp.id ? emp : e)) : [...empleados, emp]);
    setEditingEmp(null);
  }
  function removeEmpleado(id) { onChangeEmpleados(empleados.filter((e) => e.id !== id)); }

  const totOficina = oficina.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).total, 0);
  const totTaller = taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).total, 0);

  return (
    <div className="dg-page">
      <div className="dg-sueldo-topbar">
        <div className="dg-periodo-sel">
          <span>Mes:</span>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            {periodosCercanos().map((p) => (<option key={p} value={p}>{periodoLabel(p)}</option>))}
          </select>
        </div>
        <button className="dg-btn-ghost" onClick={() => setVerEmpleados((v) => !v)}>
          <Settings2 size={14} /> {verEmpleados ? "Ocultar" : "Editar"} empleados y valores
        </button>
        <button className="dg-btn-ghost" onClick={() => window.print()}><Printer size={14} /> Imprimir</button>
      </div>

      <div className="dg-totales">
        <div className="dg-total-card" style={{ "--c": "#4FC3C0" }}><span>Total Oficina / Ventas</span><strong>{money(totOficina)}</strong></div>
        <div className="dg-total-card" style={{ "--c": "#E5B54F" }}><span>Total Taller</span><strong>{money(totTaller)}</strong></div>
        <div className="dg-total-card" style={{ "--c": "#5BC98B" }}><span>Total del mes</span><strong>{money(totOficina + totTaller)}</strong></div>
      </div>

      {verEmpleados && (
        <div className="dg-section-card">
          <div className="dg-section-header"><UserPlus size={14} /> {editingEmp ? "Editar empleado" : "Nuevo empleado"}</div>
          <EmpleadoForm key={editingEmp?.id || "nuevo"} empleado={editingEmp || emptyEmpleadoSueldo()} onSave={saveEmpleado} onCancel={editingEmp ? () => setEditingEmp(null) : null} />
          <div className="dg-task-list" style={{ marginTop: 14, marginBottom: 0 }}>
            {empleados.map((e) => (
              <div className="dg-task" key={e.id}>
                <div className="dg-pago-info">
                  <span>{e.nombre} <span className="dg-badge" style={{ "--bc": e.sector === "Taller" ? "#E5B54F" : "#4FC3C0" }}>{e.sector}</span></span>
                  <span className="dg-pago-meta">
                    {e.sector === "Oficina/Ventas"
                      ? `${money(e.valorHora)}/hora · ${e.comisionPct}% comisión`
                      : `${money(e.sueldoBase)} + ${money(e.complementoFijo)} · HE ${money(e.valorHoraExtra)} · plus ${money(e.plusSemanal)}`}
                  </span>
                </div>
                <button className="dg-icon-btn" onClick={() => setEditingEmp(e)}><Pencil size={14} /></button>
                <button className="dg-icon-btn dg-task-del" onClick={() => removeEmpleado(e.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- OFICINA / VENTAS ---- */}
      <div className="dg-sueldo-block">
        <div className="dg-sueldo-title">Oficina / Ventas — liquidación semanal por hora</div>
        {oficina.length === 0 ? <div className="dg-empty">No hay empleados de Oficina/Ventas cargados.</div> : (
          <div className="dg-tabla-scroll">
            <table className="dg-tabla">
              <thead>
                <tr>
                  <th className="dg-sticky-col">Empleado</th>
                  <th>Valor hora</th><th>Com. %</th>
                  {SEMANAS.map((n) => (<th key={n} className="dg-th-semana">S{n}<small>hs / ventas</small></th>))}
                  <th>Total hs</th><th>$ Horas</th><th>$ Comisión</th><th className="dg-th-total">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {oficina.map((e) => {
                  const fila = filaDe(e.id); const t = totalesFila(e, fila);
                  return (
                    <tr key={e.id}>
                      <td className="dg-sticky-col dg-td-nombre">{e.nombre}</td>
                      <td className="dg-td-ref">{money(e.valorHora)}</td>
                      <td className="dg-td-ref">{e.comisionPct}%</td>
                      {SEMANAS.map((n) => (
                        <td key={n} className="dg-td-semana">
                          <input type="number" className="dg-celda" placeholder="hs" value={fila?.semanas?.[n]?.horas ?? ""} onChange={(ev) => setCelda(e.id, n, "horas", ev.target.value)} />
                          <input type="number" className="dg-celda dg-celda-sec" placeholder="$ vta" value={fila?.semanas?.[n]?.ventas ?? ""} onChange={(ev) => setCelda(e.id, n, "ventas", ev.target.value)} />
                        </td>
                      ))}
                      <td className="dg-td-calc">{t.horas}</td>
                      <td className="dg-td-calc">{money(t.pagoHoras)}</td>
                      <td className="dg-td-calc">{money(t.pagoComision)}</td>
                      <td className="dg-td-total">{money(t.total)}</td>
                    </tr>
                  );
                })}
                <tr className="dg-tr-total">
                  <td className="dg-sticky-col">TOTAL</td><td /><td />
                  {SEMANAS.map((n) => (
                    <td key={n} className="dg-td-calc">{oficina.reduce((a, e) => a + nnum(filaDe(e.id)?.semanas?.[n]?.horas), 0)} hs</td>
                  ))}
                  <td className="dg-td-calc">{oficina.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).horas, 0)}</td>
                  <td className="dg-td-calc">{money(oficina.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).pagoHoras, 0))}</td>
                  <td className="dg-td-calc">{money(oficina.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).pagoComision, 0))}</td>
                  <td className="dg-td-total">{money(totOficina)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {oficina.map((e) => (
          <div className="dg-anotador" key={e.id}>
            <label>Anotador {e.nombre}</label>
            <input value={filaDe(e.id)?.nota ?? ""} onChange={(ev) => setNota(e.id, ev.target.value)} placeholder="Ej: le debo 2,5 hs de la semana 3..." />
          </div>
        ))}
      </div>

      {/* ---- TALLER ---- */}
      <div className="dg-sueldo-block">
        <div className="dg-sueldo-title">Taller — sueldo mensual + horas extra y plus semanal</div>
        {taller.length === 0 ? <div className="dg-empty">No hay empleados de Taller cargados.</div> : (
          <div className="dg-tabla-scroll">
            <table className="dg-tabla">
              <thead>
                <tr>
                  <th className="dg-sticky-col">Empleado</th>
                  <th>Sueldo</th><th>Complem.</th>
                  {SEMANAS.map((n) => (<th key={n} className="dg-th-semana">S{n}<small>HE / adel. / plus</small></th>))}
                  <th>Tot HE</th><th>$ HE</th><th>$ Plus</th><th>Adelantos</th><th className="dg-th-total">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {taller.map((e) => {
                  const fila = filaDe(e.id); const t = totalesFila(e, fila);
                  return (
                    <tr key={e.id}>
                      <td className="dg-sticky-col dg-td-nombre">{e.nombre}</td>
                      <td className="dg-td-ref">{money(e.sueldoBase)}</td>
                      <td className="dg-td-ref">{money(e.complementoFijo)}</td>
                      {SEMANAS.map((n) => (
                        <td key={n} className="dg-td-semana">
                          <input type="number" className="dg-celda" placeholder="HE" value={fila?.semanas?.[n]?.he ?? ""} onChange={(ev) => setCelda(e.id, n, "he", ev.target.value)} />
                          <input type="number" className="dg-celda dg-celda-sec" placeholder="adel." value={fila?.semanas?.[n]?.adelanto ?? ""} onChange={(ev) => setCelda(e.id, n, "adelanto", ev.target.value)} />
                          <button className={`dg-celda-plus ${fila?.semanas?.[n]?.plus ? "dg-celda-plus-on" : ""}`}
                            title="Plus semanal" onClick={() => setCelda(e.id, n, "plus", !fila?.semanas?.[n]?.plus)}>plus</button>
                        </td>
                      ))}
                      <td className="dg-td-calc">{t.he}</td>
                      <td className="dg-td-calc">{money(t.pagoHE)}</td>
                      <td className="dg-td-calc">{money(t.pagoPlus)}</td>
                      <td className="dg-td-calc dg-td-neg">−{money(t.adelantos)}</td>
                      <td className="dg-td-total">{money(t.total)}</td>
                    </tr>
                  );
                })}
                <tr className="dg-tr-total">
                  <td className="dg-sticky-col">TOTAL</td><td /><td />
                  {SEMANAS.map((n) => (
                    <td key={n} className="dg-td-calc">{taller.reduce((a, e) => a + nnum(filaDe(e.id)?.semanas?.[n]?.he), 0)} hs</td>
                  ))}
                  <td className="dg-td-calc">{taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).he, 0)}</td>
                  <td className="dg-td-calc">{money(taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).pagoHE, 0))}</td>
                  <td className="dg-td-calc">{money(taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).pagoPlus, 0))}</td>
                  <td className="dg-td-calc dg-td-neg">−{money(taller.reduce((a, e) => a + totalesFila(e, filaDe(e.id)).adelantos, 0))}</td>
                  <td className="dg-td-total">{money(totTaller)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {taller.map((e) => (
          <div className="dg-anotador" key={e.id}>
            <label>Anotador {e.nombre}</label>
            <input value={filaDe(e.id)?.nota ?? ""} onChange={(ev) => setNota(e.id, ev.target.value)} placeholder="Ej: el plus de la semana 4 ya lo cobró..." />
          </div>
        ))}
      </div>
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
    </EnterFlow>
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
        <div className="dg-total-card" style={{ "--c": "#E06A6A" }}><span>Pendiente</span><strong>{money(totalPendiente)}</strong></div>
        <div className="dg-total-card" style={{ "--c": "#5BC98B" }}><span>{isIncome ? "Cobrado" : "Pagado"}</span><strong>{money(totalConfirmado)}</strong></div>
      </div>

      {isIncome && (
        <div className="dg-totales dg-cuenta-totales">
          {cuentaTotals.map((c) => (
            <div className="dg-total-card" style={{ "--c": "#4FC3C0" }} key={c.key}><span>{c.label}</span><strong>{money(c.total)}</strong></div>
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
              <Tooltip contentStyle={{ background: "#1A1F2B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
              <Bar dataKey="total" fill="#E5B54F" radius={[3, 3, 0, 0]} />
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
              <Tooltip contentStyle={{ background: "#1A1F2B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
              <Bar dataKey="total" fill={isIncome ? "#5BC98B" : "#E06A6A"} radius={[4, 4, 0, 0]} />
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
              <Tooltip contentStyle={{ background: "#1A1F2B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={(v) => money(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <EnterFlow className="dg-form dg-pago-form" onSubmit={addEntry} autoFocus={false}>
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
    touch: "No", desemp: "No", desempTipo: "220", horaTemp: "No", bluetooth: "No", tono: "3 tonos",
    tipoFactura: prefill?.tipoFactura || "Cons. Final / B", monto: "", anticipo: "", comision: "No aplica", facturado: false, montoRegistrado: 0,
    estado: "Sin pasar a fábrica", demorado: false, listo: "", metodo: prefill?.metodo || "A confirmar", detalleEntrega: prefill?.detalleEntrega || "", costoEnvio: "", piso: prefill?.piso || "", horarioEntrega: "", envioPagado: false, envioConfirmado: false, clienteAvisado: false, clienteAvisadoFecha: "", pedidoVerificadoFecha: "", produccionEtapa: "", produccionCortadoFecha: "", produccionCortadoPor: "", produccionArmadoFecha: "", produccionArmadoPor: "", produccionEmbaladoFecha: "", produccionEmbaladoPor: "", produccionListaFecha: "", envioConfirmadoFecha: "", entregadoFecha: "",
    comisionPagada: false, comisionExcluida: false, comisionLiquidadaMonto: 0,
  };
}

function textoComparable(value) {
  return String(value ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function pedidoProcesoTaller(pedido) {
  const descripcion = textoComparable(`${pedido?.tipo || ""} ${pedido?.grabado || ""}`);
  if (descripcion.includes("bisel") || pedido?.estado === "Pedir biselado") return "biselados";
  if (descripcion.includes("esmeril") || /(?:^|\s)esm\.?($|\s)/.test(descripcion)) return "esmerilados";
  return "simples";
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
    { on: pedido?.touch === "Touch", label: "TOUCH" },
    { on: pedidoTieneDesempanante(pedido), label: pedidoTipoDesempanante(pedido) === "Touch" ? "DESEMPAÑANTE T" : "DESEMPAÑANTE 220" },
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
  { id: "verificados", label: "Verificados → listos para fábrica" },
  { id: "facturar", label: "Pendiente de facturar" },
  { id: "envios", label: "Envíos de la semana" },
];

function pedidoSaldo(p) { return (Number(p.monto) || 0) - (Number(p.anticipo) || 0); }

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
      titulo={listo ? "Producción terminada" : produccionCompletada > 0 ? `Producción · ${produccionCompletada} de 3` : "Esperando producción"}
      detalle={listo ? "Fábrica completó corte, armado y embalado." : verificado ? `Próximo control del taller: ${proximoPasoProduccion?.label || "producción"}.` : "Se habilita después de verificar el pedido."}
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
// Busca el % del vendedor en la ficha de empleados (tolera "Dou" vs "Douglas").
function porcentajeVendedor(nombre, empleados) {
  if (!nombre) return 0;
  const n = String(nombre).trim().toLowerCase();
  const emp = (empleados || []).find((e) => {
    const en = String(e.nombre || "").trim().toLowerCase();
    return en === n || en.startsWith(n) || n.startsWith(en);
  });
  return emp ? Number(emp.comisionPct) || 0 : 0;
}
function comisionMonto(p, empleados) {
  return comisionBase(p) * (porcentajeVendedor(p.vendedor, empleados) / 100);
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

function PedidosPage({ pedidos, onChange, vendedores, canEditFull, puedeBorrar = true, sessionSectorId, incomes, onCreateIncome, onRegistrar }) {
  const [quickView, setQuickView] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroVendedor, setFiltroVendedor] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [openPedido, setOpenPedido] = useState(null);
  const [creating, setCreating] = useState(false);
  const [nextDraft, setNextDraft] = useState(null);
  const [agrupado, setAgrupado] = useState("mes");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const canEditEstadoOnly = !canEditFull && ["fabrica", "logistica", "postventa"].includes(sessionSectorId);

  let visibles = pedidos.slice();
  if (quickView === "historial") visibles = visibles.filter((p) => p.estado === "Entregado" || p.estado === "Cancelado");
  else if (quickView === "verificados") visibles = visibles.filter((p) => p.estado === "Verificado" || p.estado === "Pasado a fábrica");
  else if (quickView === "facturar") visibles = visibles.filter((p) => !p.facturado);
  else if (quickView === "envios") visibles = visibles.filter((p) => ENVIO_METODOS.includes(p.metodo) && p.estado !== "Entregado");
  else visibles = visibles
    .filter((p) => p.estado !== "Entregado" && p.estado !== "Cancelado")
    .filter((p) => filtroEstado === "todos" || p.estado === filtroEstado || (filtroEstado === "Verificado" && p.estado === "Pasado a fábrica"));

  visibles = visibles
    .filter((p) => !fechaDesde || (p.fecha && p.fecha >= fechaDesde))
    .filter((p) => !fechaHasta || (p.fecha && p.fecha <= fechaHasta))
    .filter((p) => filtroVendedor === "todos" || p.vendedor === filtroVendedor)
    .filter((p) => !busqueda.trim() || String(p.cliente || "").toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));

  const totalVisible = visibles.reduce((a, p) => a + (Number(p.monto) || 0), 0);
  const restaurablesVisibles = visibles.filter((p) => p.estado === "Entregado" || p.estado === "Cancelado");

  function nextOrden() { return pedidos.reduce((m, p) => Math.max(m, p.orden || 0), 0) + 1; }

  function savePedido(pedido, opts) {
    pedido = normalizarPedidoFunciones(pedido);
    const exists = pedidos.some((p) => p.id === pedido.id);
    const previous = pedidos.find((p) => p.id === pedido.id);
    let withOrden = pedido.orden ? pedido : { ...pedido, orden: nextOrden() };
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
    onChange(exists ? pedidos.map((p) => (p.id === pedido.id ? toSave : p)) : [...pedidos, toSave]);
    if (onRegistrar) onRegistrar(exists ? "Editó un pedido" : "Cargó un pedido", `#${toSave.orden} — ${toSave.cliente} — ${money(toSave.monto)}`);

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
    onChange(pedidos.map((x) => (x.id === p.id ? { ...x, estado: "Verificado", pedidoVerificadoFecha: new Date().toISOString() } : x)));
    if (onRegistrar) onRegistrar("Verificó un pedido", `#${p.orden} — ${p.cliente} — habilitado para fábrica`);
  }
  function reabrir(p) {
    onChange(pedidos.map((x) => (x.id === p.id ? { ...x, estado: "Espejo listo", entregadoFecha: "" } : x)));
    if (onRegistrar) onRegistrar("Reabrió un pedido", `#${p.orden} — ${p.cliente}`);
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
    if (!window.confirm(`Se van a restaurar ${restaurablesVisibles.length} pedido(s) de esta vista.\n\nLos entregados volverán a “Espejo listo” y los cancelados a “Sin pasar a fábrica”. ¿Continuar?`)) return;
    const ids = new Set(restaurablesVisibles.map((p) => p.id));
    onChange(pedidos.map((p) => {
      if (!ids.has(p.id)) return p;
      if (p.estado === "Entregado") return { ...p, estado: "Espejo listo", entregadoFecha: "" };
      return { ...p, estado: "Sin pasar a fábrica", clienteAvisado: false, clienteAvisadoFecha: "" };
    }));
    if (onRegistrar) onRegistrar("Restauró pedidos en masa", `${restaurablesVisibles.length} pedido(s) según filtros`);
  }
  function borrarVisibles() {
    if (visibles.length === 0) return;
    if (!window.confirm(`Vas a borrar definitivamente ${visibles.length} pedido(s) que coinciden con los filtros actuales.\n\nEsta acción no se puede deshacer. ¿Confirmás?`)) return;
    const ids = new Set(visibles.map((p) => p.id));
    onChange(pedidos.filter((p) => !ids.has(p.id)));
    if (onRegistrar) onRegistrar("Borró pedidos en masa", `${visibles.length} pedido(s) según filtros`);
  }

  const activeViewLabel = QUICK_VIEWS.find((v) => v.id === quickView)?.label || "Todos";
  const grupoCounts = pedidos.reduce((acc, p) => { const g = p.grupoId || p.id; acc[g] = (acc[g] || 0) + 1; return acc; }, {});

  return (
    <div className="dg-page">
      <div className="dg-quickviews">
        {QUICK_VIEWS.map((v) => (
          <button key={v.id} className={`dg-quickview-btn ${quickView === v.id ? "dg-quickview-on" : ""}`} onClick={() => setQuickView(v.id)}>{v.label}</button>
        ))}
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
            <span>Se aplican a los {visibles.length} resultados visibles con los filtros actuales.</span>
          </div>
          <div className="dg-bulk-actions">
            <button className="dg-btn-ghost" disabled={restaurablesVisibles.length === 0} onClick={restaurarVisibles}><RotateCcw size={14} /> Restaurar archivados ({restaurablesVisibles.length})</button>
            <button className="dg-btn-danger" disabled={visibles.length === 0} onClick={borrarVisibles}><Trash2 size={14} /> Borrar resultados ({visibles.length})</button>
          </div>
        </div>
      )}

      {(() => {
        const renderCard = (p) => {
          const saldo = pedidoSaldo(p);
          const stage = ESTADO_STAGE[p.estado] || { stage: p.estado, color: "#8B96A8" };
          const MetodoIcon = METODO_ICONS[p.metodo] || Package;
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
                <span className="dg-badge" style={{ "--bc": p.facturado ? "#5BC98B" : "#E06A6A" }}>
                  {p.facturado ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {p.facturado ? "Facturado" : "Sin facturar"}
                </span>
                <span className="dg-badge" style={{ "--bc": saldo > 0 ? "#E06A6A" : "#5BC98B" }}>
                  <CircleDollarSign size={12} /> {saldo > 0 ? `${money(saldo)} pendiente` : "Saldado"}
                </span>
                <span className="dg-badge" style={{ "--bc": "#8B96A8" }}><MetodoIcon size={12} /> {p.metodo}</span>
                {comisionElegible(p) && !p.comisionPagada && <span className="dg-badge" style={{ "--bc": "#E5B54F" }}><CircleDollarSign size={12} /> Comisión a liquidar</span>}
                {grupoCounts[p.grupoId || p.id] > 1 && <span className="dg-badge" style={{ "--bc": "#4FC3C0" }}><PackagePlus size={12} /> {grupoCounts[p.grupoId || p.id]} espejos del cliente</span>}
              </div>
              <FlujoPedido
                pedido={p}
                canEdit={canEditFull}
                onVerificar={marcarVerificado}
                onClienteConfirmado={marcarClienteAvisado}
                onEnvioConfirmado={marcarEnvioConfirmado}
                onEntregar={marcarEntregado}
              />
              {p.estado === "Entregado" && canEditFull && (
                <button className="dg-btn-ghost dg-mini-btn" onClick={(e) => { e.stopPropagation(); reabrir(p); }}>
                  <RotateCcw size={13} /> Reabrir pedido
                </button>
              )}
              {pedidoEstaListo(p) && !p.celular && !p.clienteAvisado && (
                <p className="dg-hint" style={{ marginTop: 8 }}>Sin celular cargado: avisale por otro medio y después confirmá el aviso.</p>
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
          onDelete={openPedido && puedeBorrar ? () => removePedido(openPedido.id) : null}
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
        <div className="dg-print-total">Total: {money(totalVisible)}</div>
      </div>
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

function PedidoModal({ pedido, vendedores, canEditFull, canEditEstadoOnly, onClose, onSave, onDelete }) {
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
            <Field label="Hora / Temp"><select disabled={!canEditFull} value={draft.horaTemp} onChange={(e) => set("horaTemp", e.target.value)}>{HORATEMP_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Bluetooth"><select disabled={!canEditFull} value={draft.bluetooth} onChange={(e) => set("bluetooth", e.target.value)}>{BLUETOOTH_PEDIDO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Tono de luz"><select disabled={!canEditFull} value={draft.tono} onChange={(e) => set("tono", e.target.value)}>{TONO_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
          </div>
        </div>

        <div className="dg-section-card">
          <div className="dg-section-header"><User size={14} /> Cliente y pago</div>
          <div className="dg-field-grid">
            <Field label="Cliente" error={err("cliente")}><input disabled={!canEditFull} value={draft.cliente} onChange={(e) => set("cliente", e.target.value)} /></Field>
            <Field label="Vendedor" error={err("vendedor")}><select disabled={!canEditFull} value={draft.vendedor} onChange={(e) => set("vendedor", e.target.value)}><option value="">—</option>{vendedores.map((v) => (<option key={v}>{v}</option>))}</select></Field>
            <Field label="Celular" error={err("celular")}><input disabled={!canEditFull} value={draft.celular} onChange={(e) => set("celular", e.target.value)} /></Field>
            <Field label="DNI/CUIT"><input disabled={!canEditFull} value={draft.dniCuit} onChange={(e) => set("dniCuit", e.target.value)} /></Field>
            <Field label="Tipo factura" error={err("tipoFactura")}><select disabled={!canEditFull} value={draft.tipoFactura} onChange={(e) => set("tipoFactura", e.target.value)}>{TIPOFACTURA_OPTIONS.map((o) => (<option key={o}>{o}</option>))}</select></Field>
            <Field label="Facturado">
              <button type="button" disabled={!canEditFull} className={`dg-checkbox-field ${draft.facturado ? "dg-checkbox-field-on" : ""}`} onClick={() => set("facturado", !draft.facturado)}>
                {draft.facturado ? <Check size={14} /> : null} {draft.facturado ? "Facturado" : "Sin facturar"}
              </button>
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
            <Field label="Estado"><select disabled={readOnly} value={draft.estado} onChange={(e) => set("estado", e.target.value)}>{estadoOptions.map((o) => (<option key={o}>{o}</option>))}</select></Field>
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
    </div>
  );
}

function EnviosPostventaPanel({ pedidos, onChange, canEdit }) {
  const [busqueda, setBusqueda] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const envios = pedidos
    .filter((p) => esPedidoConEnvio(p))
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
          <div className="dg-section-card" key={p.id}>
            <div className="dg-section-header"><Truck size={14} /> #{p.orden} · {p.cliente} {p.envioConfirmado && <span className="dg-badge" style={{ "--bc": "#5BC98B", marginLeft: 8 }}><CheckCircle2 size={12} /> Confirmado</span>}</div>
            <div className="dg-pago-meta" style={{ marginBottom: 10 }}>{p.ancho}×{p.alto} cm · {p.forma} · Método: {p.metodo}</div>
            <EnterFlow autoFocus={false}>
            <div className="dg-field-grid">
              <Field label="Teléfono de contacto"><input disabled={!canEdit} value={p.celular} onChange={(e) => update(p.id, { celular: e.target.value })} /></Field>
              <Field label="Dirección"><input disabled={!canEdit} value={p.detalleEntrega} onChange={(e) => update(p.id, { detalleEntrega: e.target.value })} /></Field>
              <Field label="Piso / Depto"><input disabled={!canEdit} value={p.piso} onChange={(e) => update(p.id, { piso: e.target.value })} /></Field>
            </div>
            <div className="dg-field-grid" style={{ marginTop: 12 }}>
              <Field label="Horario de entrega"><input disabled={!canEdit} value={p.horarioEntrega} onChange={(e) => update(p.id, { horarioEntrega: e.target.value })} placeholder="Ej: Mañana 9 a 13 hs" /></Field>
              <Field label="Fecha estimada"><input type="date" disabled={!canEdit} value={p.listo} onChange={(e) => update(p.id, { listo: e.target.value })} /></Field>
            </div>
            </EnterFlow>
            <div className="dg-quote-actions" style={{ marginTop: 10 }}>
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
            <Tooltip contentStyle={{ background: "#1A1F2B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
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
            <input placeholder="Cliente (opcional)" value={cliente} onChange={(e) => setCliente(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addReclamo()} />
            <input placeholder="Notas (opcional)" value={notas} onChange={(e) => setNotas(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addReclamo()} />
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
            {r.estado && <span className="dg-badge" style={{ "--bc": r.estado.toLowerCase().includes("final") ? "#5BC98B" : "#E5B54F" }}>{r.estado}</span>}
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
    .filter((p) => esPedidoConEnvio(p) && p.clienteAvisado && p.envioConfirmado && p.estado === "Espejo listo")
    .sort((a, b) => (a.listo || "9999").localeCompare(b.listo || "9999"));

  function toggle(id, field) { onChange(pedidos.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))); }
  function marcarEntregado(pedido) {
    if (!pedido.clienteAvisado || !pedido.envioConfirmado || pedido.estado !== "Espejo listo") {
      window.alert("PostVenta debe confirmar al cliente y el envío antes de habilitar la entrega.");
      return;
    }
    onChange(pedidos.map((p) => (p.id === pedido.id ? { ...p, estado: "Entregado", entregadoFecha: new Date().toISOString() } : p)));
  }

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
              </div>
            )}
            <FlujoPedido pedido={p} canEdit={canEdit} onEntregar={marcarEntregado} />
          </div>
        ))}
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
        <div className="dg-comision-banner" style={{ background: "rgba(224,106,106,0.08)", borderColor: "rgba(224,106,106,0.3)", color: "#E06A6A" }}>
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
            <Field label="Unidad"><input value={unidad} onChange={(e) => setUnidad(e.target.value)} placeholder="u / m / m² / l" /></Field>
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
                    <span className="dg-pago-meta">mínimo: {s.minimo} {s.unidad}</span>
                  </div>
                  {bajo && <span className="dg-badge" style={{ "--bc": "#E06A6A" }}>Reponer</span>}
                  <input type="number" className="dg-stock-cantidad" style={bajo ? { color: "#E06A6A", borderColor: "rgba(224,106,106,0.4)" } : undefined}
                    disabled={!canEdit} value={s.cantidad} onChange={(e) => update(s.id, { cantidad: Number(e.target.value) || 0 })} />
                  <span className="dg-stock-unidad">{s.unidad}</span>
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
  const [agrupado, setAgrupado] = useState("mes");
  const [proceso, setProceso] = useState("simples");

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
  const procesoCounts = TALLER_PROCESOS.reduce((acc, item) => {
    acc[item.id] = baseVisibles.filter((p) => pedidoProcesoTaller(p) === item.id).length;
    return acc;
  }, {});
  let visibles = baseVisibles
    .filter((p) => pedidoProcesoTaller(p) === proceso)
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));

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
  function reabrirProduccion(id) {
    const pedidoActual = pedidos.find((p) => p.id === id);
    onChange(pedidos.map((p) => (p.id === id ? {
      ...p,
      estado: "Verificado",
      produccionEtapa: "armado",
      produccionEmbaladoFecha: "",
      produccionEmbaladoPor: "",
      produccionListaFecha: "",
      clienteAvisado: false,
      clienteAvisadoFecha: "",
      envioConfirmado: false,
      envioConfirmadoFecha: "",
      entregadoFecha: "",
    } : p)));
    if (onRegistrar && pedidoActual) onRegistrar("Reabrió producción", `#${pedidoActual.orden} — ${pedidoActual.cliente} — vuelve a embalado`);
  }
  function toggleDemorado(id) { onChange(pedidos.map((p) => (p.id === id ? { ...p, demorado: !p.demorado } : p))); }
  function cancelar(id) { if (window.confirm("¿Cancelar este pedido?")) setEstado(id, "Cancelado"); }
  function borrar(id) { if (window.confirm("¿Borrar este pedido definitivamente? No se puede deshacer.")) onChange(pedidos.filter((p) => p.id !== id)); }

  const grupos = agrupado === "semana" ? groupByWeek(visibles, "fecha") : groupByMonth(visibles, "fecha");
  const fechaHoraProduccion = (value) => {
    if (!value) return "Sin registro";
    const fecha = new Date(value);
    if (Number.isNaN(fecha.getTime())) return "Sin registro";
    return fecha.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const renderCard = (p) => {
    const stage = ESTADO_STAGE[p.estado] || { stage: p.estado, color: "#8B96A8" };
    const entrega = ENTREGA_ESTILO[p.metodo] || ENTREGA_ESTILO.default;
    const procesoInfo = TALLER_PROCESOS.find((item) => item.id === pedidoProcesoTaller(p));
    const funciones = funcionesPedido(p, true);
    const observaciones = detalleFabrica(p);
    const produccionCompletada = pasosProduccionCompletados(p);
    const proximoPaso = PRODUCCION_PASOS[produccionCompletada];
    return (
      <div className={`dg-pedido-card dg-fabrica-card dg-fab-${entrega.clase}`} key={p.id}>
        <div className="dg-fab-head">
          <span className="dg-fab-orden">#{p.orden}</span>
          <span className="dg-fab-cliente">{p.cliente || "Sin nombre"}</span>
          <span className="dg-fab-entrega" style={{ "--ec": entrega.color }}>{entrega.icono} {p.metodo}</span>
        </div>

        <div className="dg-fab-medida">
          <strong>{p.ancho} × {p.alto}</strong><small>cm</small>
          {Number(p.cant) > 1 && <span className="dg-fab-cant">× {p.cant} unidades</span>}
        </div>

        <div className="dg-fab-specs">
          <div><span>Forma</span><strong>{p.forma}</strong></div>
          <div><span>Tipo</span><strong>{p.tipo}</strong></div>
          <div><span>Tono de luz</span><strong className="dg-fab-tono">{p.tono || "—"}</strong></div>
        </div>

        <div className="dg-production-checklist" aria-label="Avance de producción">
          {PRODUCCION_PASOS.map((paso, index) => {
            const completado = index < produccionCompletada;
            const actual = index === produccionCompletada;
            return (
              <span key={paso.id} className={`${completado ? "dg-production-done" : ""}${actual ? " dg-production-current" : ""}`}>
                <i>{completado ? <Check size={11} /> : index + 1}</i>
                <strong>{paso.label}</strong>
              </span>
            );
          })}
        </div>

        {pedidoEstaListo(p) && (
          <div className="dg-production-audit">
            <span className="dg-production-audit-title"><ClipboardList size={12} /> Registro de fabricación</span>
            <div>
              {PRODUCCION_PASOS.map((paso) => {
                const fecha = p[paso.fechaCampo] || (paso.id === "embalado" ? p.produccionListaFecha : "");
                return (
                  <span key={paso.id}>
                    <strong>{paso.label}</strong>
                    <time>{fechaHoraProduccion(fecha)}</time>
                    <small>{p[paso.responsableCampo] || "Responsable sin registrar"}</small>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="dg-fab-funciones">
          {funciones.length === 0
            ? <span className="dg-fab-nofunc">Sin funciones extra</span>
            : funciones.map((f, i) => (<span className="dg-fab-func" key={i} style={{ background: "rgba(91,201,139,0.14)", border: "1px solid rgba(91,201,139,0.45)", color: "#5BC98B" }}>{f.label}</span>))}
        </div>

        {observaciones && (
          <div className="dg-fab-grabado"><strong>Observaciones:</strong> {observaciones}</div>
        )}

        <div className="dg-pedido-badges">
          <span className="dg-badge" style={{ "--bc": procesoInfo?.color || "#8B96A8" }}>{procesoInfo?.label || "Simple"}</span>
          <span className="dg-badge" style={{ "--bc": stage.color }}>{stage.stage}</span>
          {p.demorado && <span className="dg-badge" style={{ "--bc": "#E06A6A" }}><AlertTriangle size={12} /> Demorado</span>}
          {p.listo && <span className="dg-badge dg-badge-entrega"><Truck size={12} /> Entrega: {p.listo}</span>}
          {p.clienteAvisado && <span className="dg-badge" style={{ "--bc": "#5BC98B" }}><MessageCircle size={12} /> Cliente avisado</span>}
        </div>
        {canEdit && (
          <div className="dg-fabrica-actions">
            {produccionCompletada >= PRODUCCION_PASOS.length
              ? <button className="dg-fabrica-btn dg-fabrica-btn-listo dg-fabrica-btn-next" disabled><CheckCircle2 size={15} /> Producción terminada</button>
              : <button className="dg-fabrica-btn dg-fabrica-btn-listo dg-fabrica-btn-next" onClick={() => avanzarProduccion(p.id)}><Check size={15} /> {proximoPaso?.accion}</button>}
            {produccionCompletada >= PRODUCCION_PASOS.length && <button className="dg-fabrica-btn dg-fabrica-btn-undo" onClick={() => reabrirProduccion(p.id)}><RotateCcw size={15} /> Reabrir producción</button>}
            <button className={`dg-fabrica-btn dg-fabrica-btn-demora ${p.demorado ? "dg-fabrica-btn-demora-on" : ""}`} onClick={() => toggleDemorado(p.id)}><AlertTriangle size={15} /> {p.demorado ? "Sin demora" : "Demorado"}</button>
            <button className="dg-fabrica-btn dg-fabrica-btn-cancel" onClick={() => cancelar(p.id)}><XCircle size={15} /> Cancelar</button>
            {puedeBorrar && <button className="dg-fabrica-btn dg-fabrica-btn-cancel" onClick={() => borrar(p.id)}><Trash2 size={15} /> Borrar</button>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dg-page">
      <div className="dg-process-tabs" role="tablist" aria-label="Proceso de fabricación">
        {TALLER_PROCESOS.map((item) => (
          <button key={item.id} role="tab" aria-selected={proceso === item.id} className={proceso === item.id ? "dg-process-tab-on" : ""} style={{ "--pc": item.color }} onClick={() => setProceso(item.id)}>
            <span>{item.label}<small>{procesoCounts[item.id] || 0}</small></span>
            <em>{item.description}</em>
          </button>
        ))}
      </div>
      <div className="dg-crm-filters">
        <Filter size={14} />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="activos">En producción ({activos.length})</option>
          <option value="historial">Historial de terminados ({historial.length})</option>
          <option value="demorados">Solo demorados ({demorados.length})</option>
          <option value="todos">Todos ({enFabrica.length})</option>
        </select>
        <input className="dg-pedido-search" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <div className="dg-periodo-toggle">
          <button className={agrupado === "mes" ? "dg-periodo-on" : ""} onClick={() => setAgrupado("mes")}>Mes</button>
          <button className={agrupado === "semana" ? "dg-periodo-on" : ""} onClick={() => setAgrupado("semana")}>Semana</button>
        </div>
      </div>

      <div className="dg-fab-leyenda">
        <span style={{ "--ec": "#B583DE" }}>Interior</span>
        <span style={{ "--ec": "#E5B54F" }}>Envío flex</span>
        <span style={{ "--ec": "#4FC3C0" }}>Envío</span>
        <span style={{ "--ec": "#7C8FE8" }}>Colocación</span>
        <span style={{ "--ec": "#8B96A8" }}>Retira</span>
      </div>

      {visibles.length === 0 && <div className="dg-empty">{filtroEstado === "historial" ? "Todavía no hay pedidos terminados en este proceso." : "No hay pedidos pendientes en esta vista."}</div>}
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="vendedor" stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#8B96A8" fontSize={11} tickLine={false} axisLine={false} width={30} />
            <Tooltip contentStyle={{ background: "#1A1F2B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="Mensajes" fill="#8B96A8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Respondieron" fill="#4FC3C0" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Ventas" fill="#5BC98B" radius={[3, 3, 0, 0]} />
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
      if (!nombre.trim()) return setError("Ingresá tu nombre.");
      if (clave.length < 4) return setError("La clave debe tener al menos 4 caracteres.");
      if (clave !== clave2) return setError("Las claves no coinciden.");
      try {
        const lista = [{ id: uid(), nombre: nombre.trim(), clave }];
        await storage.set("admins", JSON.stringify(lista), true);
        onAdminKeyCreated();
        onSuccess({ role: "admin", nombre: nombre.trim() });
      } catch (e) { setError("No se pudo guardar la clave. Probá de nuevo."); }
      return;
    }
    try {
      let lista = [];
      const res = await storage.get("admins", true);
      if (res) lista = JSON.parse(res.value);
      else {
        // compatibilidad con la clave única anterior
        const viejo = await storage.get("admin-key", true);
        if (viejo) lista = [{ id: uid(), nombre: "Facundo", clave: viejo.value }];
      }
      const match = lista.find((a) => a.clave === clave);
      if (match) onSuccess({ role: "admin", nombre: match.nombre });
      else setError("Clave incorrecta.");
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
      onSuccess({ role: "sector", sectorId: sector.id, tipo: "encargado", nombre: nombre.trim() });
      return;
    }
    if (sector.clave === clave) {
      onSuccess({ role: "sector", sectorId: sector.id, tipo: "encargado", nombre: sector.encargado || "Encargado" });
      return;
    }
    const op = (sector.operarios || []).find((o) => o.clave === clave);
    if (op) {
      onSuccess({ role: "sector", sectorId: sector.id, tipo: "operario", nombre: op.nombre });
      return;
    }
    setError("Clave incorrecta.");
  }

  return (
    <div className="dg-overlay" onClick={onClose}>
      <div className="dg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dg-modal-head"><div className="dg-modal-title">Iniciar sesión</div><button className="dg-icon-btn" onClick={onClose}><X size={18} /></button></div>
        {mode === "choose" && (
          <div className="dg-choice-grid">
            <button className="dg-choice-btn" onClick={() => setMode("admin")}><ShieldCheck size={20} /><div>Soy administrador</div><span>Acceso total: finanzas, sueldos y ajustes</span></button>
            <button className="dg-choice-btn" onClick={() => setMode("sector")}><User size={20} /><div>Trabajo en un sector</div><span>Encargados y operarios</span></button>
          </div>
        )}
        {mode === "admin" && (
          <EnterFlow className="dg-form" onSubmit={handleAdmin}>
            {!adminKeyExists && <p className="dg-hint">Primera vez: creá tu usuario de administrador.</p>}
            {!adminKeyExists && (<><label>Tu nombre</label><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></>)}
            <label>Clave{!adminKeyExists ? " nueva" : ""}</label><input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
            {!adminKeyExists && (<><label>Repetir clave</label><input type="password" value={clave2} onChange={(e) => setClave2(e.target.value)} /></>)}
            {error && <div className="dg-error">{error}</div>}
            <div className="dg-form-actions"><button className="dg-btn-ghost" onClick={() => setMode("choose")}>Volver</button><button className="dg-btn-primary" onClick={handleAdmin}>{adminKeyExists ? "Entrar" : "Crear clave y entrar"}</button></div>
          </EnterFlow>
        )}
        {mode === "sector" && (
          <EnterFlow className="dg-form" onSubmit={handleSector}>
            <label>Sector</label>
            <select value={sectorId} onChange={(e) => { setSectorId(e.target.value); setError(""); }}>{sectors.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}</select>
            {sectorNeedsSetup ? (
              <>
                <p className="dg-hint">Este sector no tiene encargado configurado. Poné tu nombre y clave.</p>
                <label>Tu nombre</label><input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <label>Clave nueva</label><input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
                <label>Repetir clave</label><input type="password" value={clave2} onChange={(e) => setClave2(e.target.value)} />
              </>
            ) : (<>
              <label>Tu clave</label>
              <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />
              <p className="dg-hint">Encargado: {sector?.encargado || "—"}{(sector?.operarios || []).length > 0 ? ` · Operarios: ${sector.operarios.map((o) => o.nombre).join(", ")}` : ""}</p>
            </>)}
            {error && <div className="dg-error">{error}</div>}
            <div className="dg-form-actions"><button className="dg-btn-ghost" onClick={() => setMode("choose")}>Volver</button><button className="dg-btn-primary" onClick={handleSector}>{sectorNeedsSetup ? "Guardar y entrar" : "Entrar"}</button></div>
          </EnterFlow>
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
  stockMateriales, onChangeStockMateriales,
  empleadosSueldo, onChangeEmpleadosSueldo, liquidaciones, onChangeLiquidaciones, onCreatePurchase,
  admins, onChangeAdmins, auditoria, onRegistrar,
}) {
  const tabs = SECTOR_SUBPAGES[sector.id] || [{ id: "tareas", label: "Tareas" }];
  const [subpage, setSubpage] = useState(tabs[0].id);
  const Icon = ICONS[sector.icon];
  const { key, pct } = getStatus(sector.tasks);
  const glow = STATUS[key].glow;
  const activeTab = tabs.find((tab) => tab.id === subpage) || tabs[0];

  const isVentasSession = session?.role === "sector" && session.sectorId === "ventas";
  const esEncargado = session?.role === "sector" && session.tipo !== "operario";
  const puedeBorrar = isAdmin || esEncargado; // los operarios no borran registros
  const canQuote = isAdmin || isVentasSession;
  const canSeePedidos = !!session;
  const sessionSectorId = session?.role === "sector" ? session.sectorId : null;
  const canEditPedidoFull = isAdmin || isVentasSession;
  const canEditFabrica = isAdmin || sessionSectorId === "fabrica";
  const canEditPostventa = isAdmin || sessionSectorId === "postventa";
  const canEditLogistica = isAdmin || sessionSectorId === "logistica";

  return (
    <div className="dg-sector-page">
      <section className="dg-sector-hero" style={{ "--glow": glow }}>
        <RoomScene sector={sector} />
        <button className="dg-sector-hero-back" onClick={onBack} title="Volver al edificio"><ArrowLeft size={17} /> Edificio</button>
        <div className="dg-sector-hero-content">
          <span className="dg-sector-hero-eyebrow">Sector {String(index + 1).padStart(2, "0")}</span>
          <div className="dg-sector-hero-title">
            <div className="dg-sector-hero-icon">{Icon && <Icon size={22} />}</div>
            <div><h1>{sector.name}</h1><p>{SECTOR_DESCRIPTIONS[sector.id]}</p></div>
          </div>
          <div className="dg-sector-hero-meta">
            <span><User size={13} /> {sector.encargado || "Responsable por asignar"}</span>
            <span style={{ "--glow": glow }}><i /> {STATUS[key].label}</span>
          </div>
        </div>
        <div className="dg-sector-hero-progress">
          <span>Progreso de hoy</span>
          <strong>{pct === null ? "—" : `${pct}%`}</strong>
          <div><i style={{ width: `${pct || 0}%` }} /></div>
        </div>
      </section>

      <div className="dg-sector-workbar">
        <div><span>Espacio de trabajo</span><strong>{activeTab.label}</strong></div>
        {tabs.length > 1 && (
          <div className="dg-sector-tabs" role="tablist" aria-label={`Herramientas de ${sector.name}`}>
            {tabs.map((t) => {
              const TabIcon = SUBPAGE_ICONS[t.id] || FileText;
              return <button key={t.id} role="tab" aria-selected={subpage === t.id} className={`dg-sector-tab ${subpage === t.id ? "dg-sector-tab-on" : ""}`} onClick={() => setSubpage(t.id)}><TabIcon size={14} />{t.label}</button>;
            })}
          </div>
        )}
      </div>

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
          <PedidosPage pedidos={pedidos} onChange={onChangePedidos} vendedores={vendedores} canEditFull={sector.id === "administracion" ? isAdmin : canEditPedidoFull} puedeBorrar={puedeBorrar} sessionSectorId={sessionSectorId} incomes={incomes} onCreateIncome={onCreateIncome} onRegistrar={onRegistrar} />
        ) : <LockedPage label="Pedidos" onLogin={onRequestLogin} />
      )}

      {subpage === "pedidos" && sector.id === "fabrica" && (
        canSeePedidos ? <FabricaPedidosPage pedidos={pedidos} onChange={onChangePedidos} canEdit={canEditFabrica} puedeBorrar={puedeBorrar} session={session} onRegistrar={onRegistrar} />
          : <LockedPage label="Pedidos de fábrica" onLogin={onRequestLogin} />
      )}

      {subpage === "materiales" && sector.id === "fabrica" && (
        canSeePedidos ? <StockMaterialesPanel stock={stockMateriales} onChange={onChangeStockMateriales} canEdit={canEditFabrica} puedeBorrar={puedeBorrar} />
          : <LockedPage label="Stock de materiales" onLogin={onRequestLogin} />
      )}

      {subpage === "stock" && sector.id === "fabrica" && (
        canSeePedidos ? <StockEspejosPanel stock={stockEspejos} onChange={onChangeStockEspejos} canEdit={canEditFabrica} />
          : <LockedPage label="Stock de espejos" onLogin={onRequestLogin} />
      )}

      {subpage === "finanzas" && (
        isAdmin ? <FinanzasPanel incomes={incomes} purchases={purchases} sectors={sectors} onChangeIncomes={onChangeIncomes} onChangePurchases={onChangePurchases} />
          : <LockedPage label="Finanzas" onLogin={onRequestLogin} />
      )}

      {subpage === "comisiones" && (
        isAdmin ? <ComisionesPanel pedidos={pedidos} onChangePedidos={onChangePedidos} empleados={empleadosSueldo} onCreatePurchase={onCreatePurchase} />
          : <LockedPage label="Comisiones" onLogin={onRequestLogin} />
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

const wrap = { minHeight: "100%", background: "#0E1219" };

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
      * { -webkit-tap-highlight-color: transparent; }
      .dg-app ::selection { background: rgba(79,195,192,0.3); }
      .dg-app ::-webkit-scrollbar { width:9px; height:9px; }
      .dg-app ::-webkit-scrollbar-track { background: transparent; }
      .dg-app ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.13); border-radius:100px; }
      .dg-app ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
      .dg-app { --bg:#0E1219; --panel: rgba(22,28,40,0.78); --panel-border: rgba(255,255,255,0.08); --text:#E7ECF2; --text-dim:#8B96A8; --cyan:#4FC3C0;
        font-family:'Inter', sans-serif; color: var(--text);
        background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(79,195,192,0.08), transparent), var(--bg);
        min-height:100vh; padding:28px 16px 60px; box-sizing:border-box; }
      .dg-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; min-height:60vh; color: var(--text-dim); }
      .dg-spin { animation: dg-spin 1s linear infinite; color:#4FC3C0; }
      @keyframes dg-spin { to { transform: rotate(360deg); } }

      .dg-header { display:flex; align-items:center; justify-content:space-between; max-width:960px; margin:0 auto 18px; gap:12px; flex-wrap:wrap; }
      .dg-brand { display:flex; align-items:center; gap:12px; }
      .dg-brand-mark { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:15px; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; background: linear-gradient(145deg, rgba(79,195,192,0.18), rgba(79,195,192,0.04)); border:1px solid rgba(79,195,192,0.35); color:#4FC3C0; box-shadow: 0 0 18px rgba(79,195,192,0.25); }
      .dg-brand-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:18px; letter-spacing:0.5px; }
      .dg-brand-sub { font-size:12px; color: var(--text-dim); }
      .dg-session { display:flex; align-items:center; gap:8px; }
      .dg-session-badge { display:flex; align-items:center; gap:6px; font-size:12px; padding:7px 12px; border-radius:100px; background: var(--panel); border:1px solid var(--panel-border); }
      .dg-login-btn, .dg-btn-primary { display:flex; align-items:center; gap:6px; font-family:'Inter',sans-serif; font-weight:600; font-size:13px; background: linear-gradient(145deg, #4FC3C0, #37A3A0); color:#03181A; border:none; border-radius:10px; padding:9px 14px; cursor:pointer; box-shadow: 0 2px 14px -2px rgba(79,195,192,0.45); transition: filter .15s ease, transform .1s ease, box-shadow .15s ease; }
      .dg-login-btn:active, .dg-btn-primary:active { transform: scale(0.97); }
      .dg-login-btn:hover, .dg-btn-primary:hover { filter: brightness(1.08); }
      .dg-icon-btn { background:transparent; border:none; color:var(--text-dim); cursor:pointer; padding:6px; border-radius:8px; display:flex; transition: background .15s ease, color .15s ease; }
      .dg-icon-btn:hover { background: rgba(255,255,255,0.06); color:var(--text); }
      .dg-btn-ghost { background:transparent; border:1px solid var(--panel-border); color:var(--text-dim); border-radius:10px; padding:9px 14px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px; transition: color .15s ease, border-color .15s ease, background .15s ease; }
      .dg-btn-ghost:active { transform: scale(0.98); }
      .dg-btn-ghost:hover { color:var(--text); border-color: rgba(255,255,255,0.2); }
      .dg-inline-btn { padding:4px 10px; font-size:12px; margin-left:8px; }
      .dg-mini-btn { padding:5px 10px; font-size:12px; }

      .dg-nav { display:flex; gap:6px; max-width:960px; margin:0 auto 26px; background: var(--panel); border:1px solid var(--panel-border); border-radius:12px; padding:4px; }
      .dg-nav-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:transparent; border:none; color:var(--text-dim); font-family:'Inter',sans-serif; font-size:13px; font-weight:600; padding:9px; border-radius:9px; cursor:pointer; }
      .dg-nav-on { background: rgba(79,195,192,0.14); color:#4FC3C0; }
      .dg-nav-breadcrumb { justify-content:flex-start; }
      .dg-nav-breadcrumb .dg-nav-btn { flex:none; }
      .dg-nav-crumb { cursor:default; }

      .dg-back-btn { display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:9px; padding:7px 12px; font-size:12.5px; font-weight:600; cursor:pointer; margin-bottom:14px; }
      .dg-back-btn:hover { color:#E7ECF2; border-color:rgba(255,255,255,0.2); }
      .dg-sector-page { max-width:760px; margin:0 auto; min-width:0; }
      .dg-sector-page-head { display:flex; align-items:center; gap:12px; margin-bottom:2px; flex-wrap:wrap; }
      .dg-sector-page-title { display:flex; align-items:center; gap:12px; flex:1; }
      .dg-sector-page-head-v2 { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
      .dg-back-circle { display:flex; align-items:center; justify-content:center; width:38px; height:38px; min-width:38px;
        border-radius:50%; background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); color:#C3CBD8; cursor:pointer;
        transition: all .15s ease; }
      .dg-back-circle:hover { background: rgba(79,195,192,0.15); border-color: rgba(79,195,192,0.4); color:#4FC3C0; transform: translateX(-2px); }
      .dg-sector-page-title-v2 { display:flex; align-items:center; gap:10px; flex:1; min-width:0; }
      .dg-sector-page-name { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:17px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-sector-tabs { display:flex; gap:6px; flex-wrap:wrap; margin:14px 0 18px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px; }
      .dg-sector-tab { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:100px; padding:8px 15px; font-size:12.5px; font-weight:600; cursor:pointer; transition: all .15s ease; }
      .dg-sector-tab:hover { color:#E7ECF2; }
      .dg-sector-tab-on { background: rgba(79,195,192,0.15); border-color:#4FC3C0; color:#4FC3C0; }

      .dg-room-enter { position:absolute; top:10px; right:10px; width:26px; height:26px; border-radius:50%; background: rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color:#E7ECF2; opacity:0; transform: translateX(-4px); transition: opacity 0.15s ease, transform 0.15s ease; }
      .dg-room-tile:hover .dg-room-enter { opacity:1; transform:translateX(0); }

      .dg-fabrica-card { cursor:default; min-width:0; }
      .dg-fabrica-actions { display:grid; grid-template-columns:repeat(auto-fit, minmax(96px, 1fr)); gap:6px; margin-top:8px; }
      .dg-fabrica-btn { min-width:0; display:flex; align-items:center; justify-content:center; gap:5px; padding:9px 6px; border-radius:9px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid rgba(255,255,255,0.1); background:#1A1F2B; color:#8B96A8; white-space:nowrap; }
      .dg-fabrica-btn-listo:hover { border-color:#5BC98B; color:#5BC98B; }
      .dg-fabrica-btn-demora:hover { border-color:#E5B54F; color:#E5B54F; }
      .dg-fabrica-btn-undo { border-color: rgba(229,181,79,0.5); color:#E5B54F; }
      .dg-fabrica-btn-demora-on { background: rgba(224,106,106,0.14); border-color:#E06A6A; color:#E06A6A; }
      .dg-fabrica-btn-cancel:hover { border-color:#E06A6A; color:#E06A6A; }
      .dg-recurso-link { display:flex; align-items:center; gap:8px; color:#4FC3C0; text-decoration:none; font-size:13px; flex:1; }
      .dg-recurso-link:hover { text-decoration:underline; }
      .dg-badge-entrega { --bc:#E5B54F; }

      .dg-month-accordion { display:flex; flex-direction:column; gap:10px; }
      .dg-month-group { border:1px solid rgba(255,255,255,0.07); border-radius:12px; overflow:hidden; }
      .dg-month-header { width:100%; display:flex; align-items:center; gap:8px; padding:12px 14px; background: rgba(255,255,255,0.025); border:none; color:#E7ECF2; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13.5px; cursor:pointer; text-transform:capitalize; }
      .dg-month-chevron { transition: transform 0.15s ease; color:#8B96A8; }
      .dg-month-chevron-open { transform: rotate(90deg); }
      .dg-month-count { margin-left:auto; font-family:'JetBrains Mono', monospace; font-size:11px; color:#8B96A8; background:#1A1F2B; padding:2px 8px; border-radius:100px; }
      .dg-month-items { display:flex; flex-direction:column; gap:8px; padding:10px; }

      .dg-overview-head { max-width:960px; margin:0 auto 18px; padding:22px 24px; box-sizing:border-box; display:flex; align-items:flex-end; justify-content:space-between; gap:24px; background:linear-gradient(135deg, rgba(79,195,192,0.09), rgba(22,28,40,0.56) 48%, rgba(255,255,255,0.02)); border:1px solid rgba(255,255,255,0.08); border-radius:18px; box-shadow:0 18px 50px -34px rgba(0,0,0,0.85); }
      .dg-overview-copy { min-width:0; }
      .dg-eyebrow { display:block; margin-bottom:6px; color:#4FC3C0; font-size:10.5px; font-weight:700; letter-spacing:1.25px; text-transform:uppercase; }
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
      .dg-iva-card { background:#1A1F2B; border:1px solid rgba(229,181,79,0.3); border-radius:12px; padding:14px; margin-bottom:16px; }
      .dg-iva-head { display:flex; flex-direction:column; gap:2px; margin-bottom:8px; }
      .dg-iva-head > div { display:flex; align-items:baseline; gap:10px; }
      .dg-iva-amount { font-family:'JetBrains Mono', monospace; font-size:20px; color:#E5B54F; }
      .dg-iva-note { font-size:11px; color:#8B96A8; }
      .dg-total-card { --c:#888; flex:1; min-width:120px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:13px 14px; display:flex; flex-direction:column; gap:5px; position:relative; overflow:hidden; }
      .dg-total-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background: var(--c); opacity:0.8; }
      .dg-total-card span { font-size:11px; color:#8B96A8; }
      .dg-total-card strong { font-family:'JetBrains Mono', monospace; font-size:16px; color: var(--c); }

      .dg-charts { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
      .dg-chart-card { flex:1; min-width:220px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; }
      .dg-chart-title { font-size:12px; color:#8B96A8; margin-bottom:6px; font-family:'JetBrains Mono', monospace; }

      .dg-overlay { position:fixed; inset:0; background: rgba(5,7,11,0.72); backdrop-filter: blur(4px); display:flex; align-items:center; justify-content:center; padding:16px; z-index:50; }
      .dg-modal { font-family:'Inter', sans-serif; color:#E7ECF2; width:100%; max-width:400px; background:#141924; border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:20px; max-height:88vh; overflow-y:auto; box-shadow: 0 24px 60px -12px rgba(0,0,0,0.8); animation: dg-modal-in .18s ease-out; }
      @keyframes dg-modal-in { from { opacity:0; transform: translateY(8px) scale(0.99); } to { opacity:1; transform:none; } }
      .dg-modal-lg { max-width:540px; }
      .dg-modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
      .dg-modal-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:17px; }
      .dg-modal-icon { --glow:#4FC3C0; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--glow) 15%, transparent); color: var(--glow); border:1px solid color-mix(in srgb, var(--glow) 40%, transparent); }
      .dg-modal-sub { font-size:12px; color:#8B96A8; margin-top:2px; }
      .dg-encargado-box { display:flex; align-items:center; gap:8px; font-size:13px; color:#8B96A8; background:#1A1F2B; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:9px 12px; margin-bottom:14px; }
      .dg-sector-meta-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
      .dg-encargado-box-compact { flex:1; margin-bottom:0; padding:7px 10px; }
      .dg-status-pill { --glow:#4FC3C0; font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color: var(--glow); background: color-mix(in srgb, var(--glow) 14%, transparent); border:1px solid color-mix(in srgb, var(--glow) 40%, transparent); border-radius:100px; padding:7px 12px; white-space:nowrap; }
      .dg-room-strip { --glow:#4FC3C0; position:relative; height:74px; border-radius:10px; overflow:hidden; margin-bottom:14px; background:#181D28; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--glow) 30%, transparent); }
      .dg-task-table-wrap { background: rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:4px; margin-bottom:14px; }
      .dg-task-table-head { display:flex; justify-content:space-between; align-items:center; padding:10px 12px 8px; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:#E7ECF2; }
      .dg-task-table-head span:last-child { font-family:'JetBrains Mono', monospace; color:#4FC3C0; font-size:12px; }
      .dg-task-table { display:flex; flex-direction:column; max-height:340px; overflow-y:auto; }
      .dg-task-table-row { display:flex; align-items:center; gap:10px; padding:12px 12px; font-size:14px; border-top:1px solid rgba(255,255,255,0.05); }
      .dg-task-table-row:nth-child(even) { background: rgba(255,255,255,0.018); }
      .dg-task-table-row-done { opacity:0.6; }
      .dg-encargado-box span { color:#E7ECF2; }
      .dg-encargado-edit { margin-left:auto; }
      .dg-inline-input { flex:1; background:#131824; border:1px solid rgba(79,195,192,0.4); border-radius:6px; padding:5px 8px; color:#E7ECF2; font-size:13px; outline:none; }
      .dg-choice-grid { display:flex; flex-direction:column; gap:10px; }
      .dg-choice-btn { display:flex; flex-direction:column; align-items:flex-start; gap:4px; text-align:left; background:#1A1F2B; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px; color:#E7ECF2; cursor:pointer; }
      .dg-choice-btn:hover { border-color:#4FC3C0; }
      .dg-choice-btn div { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:14px; margin-top:4px; }
      .dg-choice-btn span { font-size:12px; color:#8B96A8; }
      .dg-form { display:flex; flex-direction:column; gap:8px; }
      .dg-form label { font-size:12px; color:#8B96A8; margin-top:6px; display:block; }
      .dg-app, .dg-app *, .dg-modal, .dg-modal * { box-sizing: border-box; }
      .dg-app { overflow-x: hidden; }
      .dg-app, .dg-modal { color-scheme: dark; }
      select { color-scheme: dark; }
      select option { background:#1A1F2B; color:#E7ECF2; }
      .dg-form input, .dg-form select { width:100%; background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 12px; color:#E7ECF2; font-family:'Inter',sans-serif; font-size:14px; outline:none; box-sizing:border-box; }
      .dg-form input:focus, .dg-form select:focus { border-color:#4FC3C0; }
      .dg-form-row { display:flex; gap:10px; }
      .dg-hint { font-size:12px; color:#8B96A8; background:rgba(79,195,192,0.06); border:1px solid rgba(79,195,192,0.2); border-radius:8px; padding:8px 10px; }
      .dg-error { font-size:12px; color:#E06A6A; }
      .dg-form-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:10px; }
      .dg-status-bar { display:flex; flex-direction:column; gap:6px; margin-bottom:18px; }
      .dg-status-track { height:6px; border-radius:100px; background:rgba(255,255,255,0.08); overflow:hidden; }
      .dg-status-fill { height:100%; border-radius:100px; transition: width 0.3s ease; }
      .dg-status-bar span { font-size:12px; font-family:'JetBrains Mono', monospace; }
      .dg-task-list { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; max-height:280px; overflow-y:auto; }
      .dg-empty { font-size:13px; color:#8B96A8; padding:14px; text-align:center; border:1px dashed rgba(255,255,255,0.1); border-radius:10px; }
      .dg-task { display:flex; align-items:center; gap:10px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:11px 13px; font-size:13px; transition: border-color .15s ease; }
      .dg-task:hover { border-color: rgba(255,255,255,0.13); }
      .dg-task-done { text-decoration: line-through; color:#8B96A8; }
      .dg-task-del { margin-left:auto; }
      .dg-checkbox { width:18px; height:18px; min-width:18px; border-radius:6px; border:1.5px solid rgba(255,255,255,0.25); background:transparent; cursor:pointer; }
      .dg-checkbox-on { background:#4FC3C0; border-color:#4FC3C0; }
      .dg-checkbox:disabled { cursor:not-allowed; opacity:0.5; }
      .dg-add-task { display:flex; gap:8px; }
      .dg-add-task input { flex:1; background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 12px; color:#E7ECF2; font-family:'Inter',sans-serif; font-size:13px; outline:none; }
      .dg-add-task input:focus { border-color:#4FC3C0; }
      .dg-suggest-btn { margin-top:10px; width:100%; justify-content:center; }
      .dg-locked-note { display:flex; align-items:center; flex-wrap:wrap; gap:6px; font-size:12px; color:#8B96A8; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:10px 12px; }
      .dg-pago-form { margin-bottom:14px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08); }
      .dg-filtros { display:flex; gap:6px; margin-bottom:10px; }
      .dg-filtro-btn { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:100px; padding:5px 12px; font-size:12px; cursor:pointer; }
      .dg-filtro-on { background: rgba(79,195,192,0.15); border-color:#4FC3C0; color:#4FC3C0; }
      .dg-pago-row { align-items:center; }
      .dg-pago-info { display:flex; flex-direction:column; flex:1; gap:2px; }
      .dg-pago-meta { font-size:11px; color:#8B96A8; }
      .dg-pago-monto { font-family:'JetBrains Mono', monospace; font-size:13px; margin-right:6px; }
      .dg-pago-list { max-height:320px; }

      .dg-section-card { background: rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:15px 16px 17px; margin-bottom:14px; transition: border-color .15s ease; }
      .dg-section-card:hover { border-color: rgba(255,255,255,0.12); }
      .dg-section-header { display:flex; align-items:center; gap:7px; margin-bottom:12px; color:#4FC3C0; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; text-transform:uppercase; letter-spacing:0.4px; }
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
      .dg-field input:focus, .dg-field select:focus { border-color:#4FC3C0; box-shadow: 0 0 0 3px rgba(79,195,192,0.12); }
      .dg-field input:disabled, .dg-field select:disabled { opacity:0.5; cursor:not-allowed; }
      .dg-comision-info { display:flex; align-items:center; gap:6px; font-size:12px; color:#8B96A8; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:9px; padding:10px; }
      .dg-sector-usuarios { border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:8px; margin-bottom:10px; background: rgba(255,255,255,0.015); }
      .dg-operarios-box { padding:0 4px 4px; }
      .dg-operario-form { display:flex; gap:6px; flex-wrap:wrap; }
      .dg-operario-form input { flex:1 1 130px; min-width:0; background:#131824; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:8px 10px; color:#E7ECF2; font-size:12px; outline:none; }
      .dg-operario-form input:focus { border-color:#4FC3C0; }
      .dg-modal-ajustes { max-width:820px; }
      .dg-modal-ajustes .dg-page { max-width:none; }
      .dg-vendedores-chips { display:flex; gap:6px; flex-wrap:wrap; }
      .dg-export-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:8px; }
      .dg-export-grid .dg-btn-ghost { justify-content:flex-start; font-size:12px; }
      .dg-export-grid .dg-btn-ghost:disabled { opacity:0.4; cursor:not-allowed; }
      .dg-save-toast { position:fixed; bottom:18px; right:18px; z-index:200; display:flex; align-items:center; gap:10px;
        background:#1A1F2B; border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:11px 14px; font-size:12.5px;
        color:#E7ECF2; box-shadow: 0 14px 34px -10px rgba(0,0,0,0.8); animation: dg-toast-in .2s ease-out; max-width:min(92vw, 380px); }
      @keyframes dg-toast-in { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }
      .dg-save-ok { border-color: rgba(91,201,139,0.4); color:#5BC98B; }
      .dg-save-going { color:#8B96A8; }
      .dg-save-error { border-color: rgba(224,106,106,0.5); align-items:flex-start; }
      .dg-save-error > div { display:flex; flex-direction:column; gap:2px; flex:1; }
      .dg-save-error strong { color:#E06A6A; font-size:13px; }
      .dg-save-error span { color:#8B96A8; font-size:11.5px; }
      @media (max-width:680px) { .dg-save-toast { left:12px; right:12px; bottom:12px; max-width:none; } }

      .dg-fab-leyenda { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
      .dg-fab-leyenda span { --ec:#8B96A8; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px;
        padding:4px 10px; border-radius:100px; border-left:3px solid var(--ec); background: rgba(255,255,255,0.03); color:#8B96A8; }

      /* ---- FICHA TECNICA DE FABRICA ---- */
      .dg-fabrica-card { border-left-width:4px !important; }
      .dg-fab-interior { border-left-color:#B583DE !important; background: linear-gradient(90deg, rgba(181,131,222,0.09), rgba(255,255,255,0.025) 40%) !important; }
      .dg-fab-flex { border-left-color:#E5B54F !important; background: linear-gradient(90deg, rgba(229,181,79,0.1), rgba(255,255,255,0.025) 40%) !important; }
      .dg-fab-envio { border-left-color:#4FC3C0 !important; }
      .dg-fab-coloca { border-left-color:#7C8FE8 !important; }
      .dg-fab-retira { border-left-color: rgba(255,255,255,0.12) !important; }

      .dg-fab-head { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
      .dg-fab-orden { font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; color:#4FC3C0; }
      .dg-fab-cliente { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:15px; flex:1; min-width:0; }
      .dg-fab-entrega { --ec:#8B96A8; display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700;
        text-transform:uppercase; letter-spacing:0.3px; padding:5px 11px; border-radius:100px;
        background: color-mix(in srgb, var(--ec) 18%, transparent); color: var(--ec);
        border:1px solid color-mix(in srgb, var(--ec) 50%, transparent); white-space:nowrap; }

      .dg-fab-medida { display:flex; align-items:baseline; gap:8px; margin:4px 0 2px; }
      .dg-fab-medida strong { font-family:'JetBrains Mono', monospace; font-size:27px; font-weight:700; color:#E7ECF2; letter-spacing:-0.5px; }
      .dg-fab-medida small { font-size:12px; color:#8B96A8; }
      .dg-fab-cant { margin-left:6px; font-size:12px; font-weight:700; color:#E5B54F; background: rgba(229,181,79,0.14);
        border:1px solid rgba(229,181,79,0.4); border-radius:6px; padding:3px 8px; }

      .dg-fab-specs { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
      .dg-fab-specs > div { background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:9px; padding:8px 10px; }
      .dg-fab-specs span { display:block; font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:#7A8699; margin-bottom:3px; }
      .dg-fab-specs strong { font-size:13px; font-weight:600; color:#E7ECF2; }
      .dg-fab-tono { color:#E5B54F !important; }

      .dg-fab-grabado { font-size:12.5px; color:#E7ECF2; background: rgba(79,195,192,0.08);
        border:1px solid rgba(79,195,192,0.28); border-radius:9px; padding:9px 11px; }
      .dg-fab-grabado strong { color:#4FC3C0; font-size:11px; text-transform:uppercase; letter-spacing:0.3px; }

      .dg-fab-funciones { display:flex; gap:6px; flex-wrap:wrap; }
      .dg-fab-func { font-size:10.5px; font-weight:700; letter-spacing:0.4px; padding:5px 10px; border-radius:7px;
        background: rgba(91,201,139,0.14); border:1px solid rgba(91,201,139,0.45); color:#5BC98B; }
      .dg-fab-nofunc { font-size:11.5px; color:#5B6576; font-style:italic; }

      .dg-production-checklist { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; padding:6px; border:1px solid rgba(226,232,240,.08); border-radius:10px; background:rgba(7,11,17,.34); }
      .dg-production-checklist > span { min-width:0; display:flex; align-items:center; gap:5px; padding:5px 6px; border-radius:7px; color:#6E7B8E; }
      .dg-production-checklist i { width:19px; height:19px; min-width:19px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(148,163,184,.2); border-radius:6px; color:#77869A; font-family:'JetBrains Mono',monospace; font-size:8px; font-style:normal; }
      .dg-production-checklist strong { min-width:0; overflow:hidden; color:inherit; font-size:9.5px; font-weight:650; text-overflow:ellipsis; white-space:nowrap; }
      .dg-production-checklist .dg-production-done { background:rgba(91,201,139,.07); color:#72D9A0; }
      .dg-production-checklist .dg-production-done i { border-color:rgba(91,201,139,.35); background:rgba(91,201,139,.1); }
      .dg-production-checklist .dg-production-current { background:rgba(79,195,192,.08); color:#64D7D2; }
      .dg-production-checklist .dg-production-current i { border-color:rgba(79,195,192,.42); }
      .dg-production-audit { padding:8px; border:1px solid rgba(91,201,139,.16); border-radius:10px; background:rgba(91,201,139,.035); }
      .dg-production-audit-title { display:flex; align-items:center; gap:5px; margin-bottom:6px; color:#72D9A0; font-size:9px; font-weight:700; letter-spacing:.35px; text-transform:uppercase; }
      .dg-production-audit > div { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; }
      .dg-production-audit > div > span { min-width:0; display:flex; flex-direction:column; gap:1px; padding:5px 6px; border-radius:7px; background:rgba(7,11,17,.35); }
      .dg-production-audit strong { color:#B9C6D4; font-size:8.5px; }
      .dg-production-audit time { color:#8C9AAD; font-family:'JetBrains Mono',monospace; font-size:8px; white-space:nowrap; }
      .dg-production-audit small { overflow:hidden; color:#667589; font-size:8px; text-overflow:ellipsis; white-space:nowrap; }
      .dg-fabrica-actions { grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; margin-top:5px; }
      .dg-fabrica-btn { min-width:0; min-height:35px; padding:7px 6px; font-size:10.5px; line-height:1.15; white-space:normal; overflow-wrap:anywhere; }
      .dg-fabrica-btn-next { grid-column:1 / -1; border-color:rgba(91,201,139,.38); background:rgba(91,201,139,.1); color:#72D9A0; font-size:11.5px; }
      .dg-fabrica-btn-next:disabled { opacity:1; cursor:default; }

      @media (max-width:680px) {
        .dg-fab-medida strong { font-size:24px; }
        .dg-fabrica-card { gap:6px; padding:10px !important; }
        .dg-fab-head { display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:7px; }
        .dg-fab-cliente { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .dg-fab-entrega { padding:4px 8px; font-size:10px; }
        .dg-fab-specs { grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; }
        .dg-fab-specs > div { min-width:0; padding:7px; }
        .dg-fab-specs span { margin-bottom:2px; font-size:8px; }
        .dg-fab-specs strong { display:block; overflow-wrap:anywhere; font-size:10.5px; line-height:1.2; }
        .dg-production-audit { padding:6px; }
        .dg-production-audit > div { grid-template-columns:1fr; gap:3px; }
        .dg-production-audit > div > span { display:grid; grid-template-columns:52px max-content minmax(0,1fr); align-items:center; gap:6px; padding:4px 6px; }
        .dg-production-audit time, .dg-production-audit small { font-size:7.5px; }
        .dg-production-audit small { text-align:right; }
        .dg-fabrica-btn { min-width:0; padding:7px 5px; font-size:10px; }
      }
      @media (max-width:420px) {
        .dg-fab-medida strong { font-size:22px; }
        .dg-production-checklist strong { font-size:8.5px; }
      }

      /* ---- PLANILLA DE SUELDOS ---- */
      .dg-sueldo-topbar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:14px; }
      .dg-periodo-sel { display:flex; align-items:center; gap:8px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:7px 12px; font-size:13px; color:#8B96A8; }
      .dg-periodo-sel select { background:transparent; border:none; color:#4FC3C0; font-weight:700; font-size:13px; outline:none; }
      .dg-sueldo-block { margin-bottom:26px; }
      .dg-sueldo-title { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; color:#E7ECF2; margin-bottom:10px; padding-left:10px; border-left:3px solid #4FC3C0; }
      .dg-tabla-scroll { overflow-x:auto; border:1px solid rgba(255,255,255,0.08); border-radius:12px; background:#161B26; }
      .dg-tabla { border-collapse:separate; border-spacing:0; width:100%; font-size:12px; }
      .dg-tabla th { background:#1D2330; color:#8B96A8; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;
        padding:9px 8px; text-align:center; white-space:nowrap; border-bottom:1px solid rgba(255,255,255,0.1); }
      .dg-tabla th small { display:block; font-size:8.5px; font-weight:500; text-transform:none; letter-spacing:0; color:#5B6576; margin-top:2px; }
      .dg-th-semana { min-width:82px; }
      .dg-th-total { background:#212836 !important; color:#4FC3C0 !important; }
      .dg-tabla td { padding:6px 8px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.05); vertical-align:middle; }
      .dg-tabla tbody tr:hover td { background: rgba(255,255,255,0.02); }
      .dg-sticky-col { position:sticky; left:0; z-index:2; background:#161B26; text-align:left !important; min-width:96px; box-shadow: 2px 0 6px -3px rgba(0,0,0,0.7); }
      .dg-tabla thead .dg-sticky-col { background:#1D2330; z-index:3; }
      .dg-td-nombre { font-weight:600; color:#E7ECF2; font-size:12.5px; }
      .dg-td-ref { color:#8B96A8; font-family:'JetBrains Mono', monospace; font-size:11px; white-space:nowrap; }
      .dg-td-calc { font-family:'JetBrains Mono', monospace; font-size:11.5px; color:#C3CBD8; white-space:nowrap; }
      .dg-td-neg { color:#E06A6A; }
      .dg-td-total { font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; color:#5BC98B; background: rgba(91,201,139,0.06); white-space:nowrap; }
      .dg-td-semana { padding:5px 6px !important; }
      .dg-celda { width:58px; background:#131824; border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:5px 4px;
        color:#E7ECF2; font-family:'JetBrains Mono', monospace; font-size:11.5px; text-align:center; outline:none; display:block; margin:0 auto 3px; }
      .dg-celda:focus { border-color:#4FC3C0; box-shadow: 0 0 0 2px rgba(79,195,192,0.15); }
      .dg-celda-sec { color:#8B96A8; font-size:10.5px; }
      .dg-celda-plus { width:58px; display:block; margin:0 auto; background:#131824; border:1px solid rgba(255,255,255,0.1); border-radius:6px;
        padding:3px; font-size:9px; font-weight:700; text-transform:uppercase; color:#5B6576; cursor:pointer; }
      .dg-celda-plus-on { background: rgba(91,201,139,0.18); border-color:#5BC98B; color:#5BC98B; }
      .dg-tr-total td { background:#1D2330 !important; font-weight:700; border-top:2px solid rgba(79,195,192,0.3); border-bottom:none; }
      .dg-tr-total .dg-sticky-col { background:#1D2330 !important; color:#4FC3C0; font-size:11px; letter-spacing:0.5px; }
      .dg-anotador { display:flex; align-items:center; gap:10px; margin-top:8px; }
      .dg-anotador label { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; color:#7A8699; min-width:130px; }
      .dg-anotador input { flex:1; background: rgba(229,181,79,0.05); border:1px solid rgba(229,181,79,0.2); border-radius:8px;
        padding:7px 10px; color:#E7ECF2; font-size:12px; outline:none; }
      .dg-anotador input:focus { border-color:#E5B54F; }

      .dg-comision-head { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
      .dg-comision-toggle { display:flex; align-items:center; gap:8px; background:transparent; border:none; color:#E7ECF2; cursor:pointer; padding:0; flex:1; min-width:0; text-align:left; font-family:'Inter',sans-serif; flex-wrap:wrap; }
      .dg-comision-nombre { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:15px; }
      .dg-comision-total { display:flex; align-items:center; gap:10px; }
      .dg-comision-total strong { font-family:'JetBrains Mono', monospace; font-size:17px; color:#E5B54F; }
      .dg-chev-open { transform: rotate(90deg); }
      .dg-validacion-banner { display:flex; gap:10px; align-items:flex-start; background: rgba(224,106,106,0.1); border:1px solid rgba(224,106,106,0.35); border-radius:12px; padding:12px 14px; margin-bottom:14px; color:#E06A6A; font-size:12.5px; }
      .dg-validacion-banner strong { display:block; margin-bottom:4px; font-size:13px; }
      .dg-validacion-banner ul { margin:0; padding-left:16px; }
      .dg-validacion-banner li { margin-bottom:2px; }
      .dg-field-error input, .dg-field-error select { border-color: rgba(224,106,106,0.6) !important; background: rgba(224,106,106,0.06) !important; }
      .dg-field-error label { color:#E06A6A !important; }
      .dg-field-error-msg { font-size:10.5px; color:#E06A6A; }
      .dg-btn-warn { background: linear-gradient(145deg, #E5B54F, #E0A828) !important; color:#2A1F05 !important; box-shadow: 0 2px 14px -2px rgba(229,181,79,0.5) !important; }
      .dg-field-computed input { background: rgba(79,195,192,0.08); border-color: rgba(79,195,192,0.35); color:#4FC3C0; font-family:'JetBrains Mono', monospace; font-weight:600; opacity:1; }

      .dg-quote-grid { display:flex; gap:16px; align-items:flex-start; }
      .dg-quote-form, .dg-quote-result { flex:1; min-width:280px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:16px; }
      .dg-quote-section-title { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:#4FC3C0; margin:14px 0 6px; }
      .dg-quote-section-title:first-child { margin-top:0; }
      .dg-alert { display:flex; align-items:center; gap:8px; font-size:12px; color:#E5B54F; background:rgba(229,181,79,0.1); border:1px solid rgba(229,181,79,0.3); border-radius:8px; padding:8px 10px; margin-bottom:10px; }
      .dg-price-card { display:flex; flex-direction:column; gap:2px; background: rgba(79,195,192,0.08); border:1px solid rgba(79,195,192,0.3); border-radius:12px; padding:14px; margin-bottom:14px; }
      .dg-price-label { font-size:11px; color:#8B96A8; }
      .dg-price-main { font-family:'JetBrains Mono', monospace; font-size:26px; color:#4FC3C0; }
      .dg-price-sub { font-size:12px; color:#8B96A8; }
      .dg-quote-meta { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
      .dg-quote-meta div { background:#141924; border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:8px 10px; display:flex; flex-direction:column; gap:2px; }
      .dg-quote-meta span { font-size:10px; color:#8B96A8; }
      .dg-quote-meta strong { font-family:'JetBrains Mono', monospace; font-size:13px; }
      .dg-mensaje-box { margin-top:4px; }
      .dg-mensaje-text { white-space:pre-wrap; font-family:'Inter',sans-serif; font-size:12.5px; background:#141924; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px; margin:6px 0 10px; line-height:1.5; }
      .dg-quote-actions { display:flex; gap:8px; flex-wrap:wrap; }
      .dg-quotes-history { margin-top:18px; }
      .dg-config-editor { margin-top:12px; background:#131824; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px; }
      .dg-config-group-title { font-size:12px; font-weight:600; color:#8B96A8; margin:12px 0 6px; }
      .dg-config-group-title:first-of-type { margin-top:4px; }
      .dg-config-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
      .dg-config-field label { font-size:10.5px; font-weight:600; text-transform:uppercase; letter-spacing:0.3px; color:#7A8699; display:block; margin-bottom:5px; }
      .dg-config-field input { width:100%; background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)); border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:8px 10px; color:#E7ECF2; font-size:12.5px; box-sizing:border-box; outline:none; transition: border-color .15s ease, box-shadow .15s ease; }
      .dg-config-field input:focus { border-color:#4FC3C0; box-shadow: 0 0 0 3px rgba(79,195,192,0.12); }

      .dg-quick-actions { background: var(--panel); border:1px solid var(--panel-border); border-radius:14px; padding:14px; margin-bottom:16px; }
      .dg-quick-title { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:13px; color:#8B96A8; margin-bottom:10px; }
      .dg-quick-buttons { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
      .dg-quick-btn { --c:#4FC3C0; display:flex; flex-direction:column; align-items:center; gap:8px; background: color-mix(in srgb, var(--c) 10%, #1A1F2B); border:1.5px solid color-mix(in srgb, var(--c) 45%, transparent); color: var(--c); border-radius:14px; padding:18px 10px; cursor:pointer; font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; text-align:center; transition: transform 0.1s ease, box-shadow 0.15s ease; }
      .dg-quick-btn:hover { transform: translateY(-2px); box-shadow: 0 0 20px -4px var(--c); }
      .dg-quick-btn:active { transform: scale(0.97); }
      .dg-quick-inline { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
      .dg-quick-inline input { flex:1; min-width:140px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:9px 12px; color:#E7ECF2; font-size:13px; outline:none; }
      .dg-quick-inline input:focus { border-color:#4FC3C0; }
      .dg-quick-toast { margin-top:10px; font-size:12px; color:#5BC98B; font-family:'JetBrains Mono', monospace; }

      .dg-crm-top { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px; }
      .dg-crm-soyyo { display:flex; align-items:center; gap:8px; font-size:13px; color:#8B96A8; background:#1A1F2B; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:8px 12px; }
      .dg-crm-soyyo select { background:transparent; border:none; color:#4FC3C0; font-weight:600; font-size:13px; outline:none; }
      .dg-crm-vendedores-admin { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
      .dg-crm-vendedores-admin input { background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:6px 10px; color:#E7ECF2; font-size:12px; width:140px; }
      .dg-vendedor-chip { display:flex; align-items:center; gap:4px; font-size:11px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:4px 8px; color:#8B96A8; }
      .dg-vendedor-chip button { background:none; border:none; color:#8B96A8; cursor:pointer; display:flex; padding:0; }

      .dg-vendor-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px,1fr)); gap:10px; margin-bottom:16px; }
      .dg-vendor-card { background:#1A1F2B; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; }
      .dg-vendor-name { font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:14px; margin-bottom:8px; color:#4FC3C0; }
      .dg-vendor-metrics { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px; }
      .dg-vendor-metrics div { display:flex; flex-direction:column; gap:1px; }
      .dg-vendor-metrics span { font-size:10px; color:#8B96A8; }
      .dg-vendor-metrics strong { font-family:'JetBrains Mono', monospace; font-size:13px; }
      .dg-vendor-importe { font-size:12px; color:#5BC98B; font-family:'JetBrains Mono', monospace; border-top:1px solid rgba(255,255,255,0.06); padding-top:6px; }

      .dg-crm-filters { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; color:#8B96A8; }
      .dg-periodo-toggle { display:flex; background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:3px; }
      .dg-periodo-toggle button { background:transparent; border:none; color:#8B96A8; font-size:12px; font-weight:600; padding:6px 12px; border-radius:7px; cursor:pointer; }
      .dg-periodo-on { background: rgba(79,195,192,0.15) !important; color:#4FC3C0 !important; }
      .dg-crm-filters select { background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:7px 10px; color:#E7ECF2; font-size:12px; }

      .dg-pedido-search { background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015)); border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:8px 12px; color:#E7ECF2; font-size:12.5px; min-width:160px; outline:none; }
      .dg-pedido-search:focus { border-color:#4FC3C0; }
      .dg-pedido-list { max-height:none; }
      .dg-pedido-orden { font-family:'JetBrains Mono', monospace; font-size:11px; color:#8B96A8; }
      .dg-pedido-card { display:flex; flex-direction:column; gap:8px; width:100%; max-width:100%; text-align:left; background: rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:12px 14px; color:#E7ECF2; cursor:pointer; font-family:'Inter',sans-serif; min-width:0; box-sizing:border-box; }
      .dg-btn-entregado { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; background: rgba(91,201,139,0.12);
        border:1px solid rgba(91,201,139,0.45); color:#5BC98B; border-radius:10px; padding:10px; font-size:12.5px; font-weight:600;
        cursor:pointer; font-family:'Inter',sans-serif; transition: all .15s ease; }
      .dg-btn-entregado:hover { background: rgba(91,201,139,0.2); }
      .dg-confirmar-entrega-btn { justify-content:center; text-decoration:none; background: linear-gradient(145deg, #5BC98B, #2FB86A); }
      .dg-pedido-card:hover { border-color:rgba(79,195,192,0.35); background: rgba(255,255,255,0.04); transform: translateY(-1px); }
      .dg-pedido-card { transition: border-color .15s ease, background .15s ease, transform .15s ease; }
      .dg-pedido-card-top { display:flex; align-items:center; gap:10px; min-width:0; }
      .dg-pedido-card-top .dg-lead-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .dg-pedido-badges { display:flex; gap:6px; flex-wrap:wrap; min-width:0; }
      .dg-badge { --bc:#8B96A8; display:inline-flex; align-items:center; gap:4px; font-size:10.5px; font-weight:600; padding:4px 9px; border-radius:100px; background: color-mix(in srgb, var(--bc) 14%, transparent); color: var(--bc); border:1px solid color-mix(in srgb, var(--bc) 35%, transparent); white-space:nowrap; max-width:100%; overflow:hidden; text-overflow:ellipsis; }
      .dg-pago-meta { overflow-wrap:break-word; word-break:break-word; }
      .dg-lead-list { max-height:none; }
      .dg-lead-row { display:flex; align-items:center; justify-content:space-between; gap:10px; background:#1A1F2B; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:10px 12px; flex-wrap:wrap; }
      .dg-lead-main { display:flex; align-items:center; gap:10px; min-width:0; }
      .dg-lead-dot { width:8px; height:8px; min-width:8px; border-radius:50%; }
      .dg-lead-info { display:flex; flex-direction:column; gap:2px; min-width:0; }
      .dg-lead-name { font-size:13px; font-weight:600; }
      .dg-lead-actions { display:flex; align-items:center; gap:6px; }
      .dg-lead-estode-select { }
      .dg-lead-estado-select { background:#131824; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:5px 8px; font-size:11px; }
      .dg-stock-unidad { font-size:11px; color:#8B96A8; min-width:26px; }
      .dg-stock-cantidad { width:64px; text-align:center; background:#131824; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:6px 4px; color:#4FC3C0; font-family:'JetBrains Mono', monospace; font-weight:700; font-size:13px; }

      .dg-quickviews { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
      .dg-quickview-btn { background:#1A1F2B; border:1px solid rgba(255,255,255,0.1); color:#8B96A8; border-radius:100px; padding:7px 13px; font-size:12px; cursor:pointer; white-space:nowrap; transition: all .15s ease; }
      .dg-quickview-btn:hover { color:#E7ECF2; }
      .dg-quickview-on { background: rgba(79,195,192,0.15); border-color:#4FC3C0; color:#4FC3C0; font-weight:600; }
      .dg-comision-banner { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; background: rgba(229,181,79,0.08); border:1px solid rgba(229,181,79,0.3); border-radius:10px; padding:10px 14px; margin-bottom:12px; font-size:13px; color:#E5B54F; }
      .dg-pedido-flag { font-size:11px; }
      .dg-checkbox-field { width:100%; display:flex; align-items:center; justify-content:center; gap:6px; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:9px; padding:9px 10px; color:#8B96A8; font-size:12.5px; cursor:pointer; font-family:'Inter',sans-serif; }
      .dg-checkbox-field-on { background: rgba(91,201,139,0.12); border-color:#5BC98B; color:#5BC98B; font-weight:600; }
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

      .dg-plant-outer { max-width:960px; margin:0 auto; padding:0 0 64px; position:relative; }
      .dg-plant-outer::after { display:none; }
      .dg-plant-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); grid-template-rows:repeat(2,1fr); gap:14px; background:transparent; padding:0; }
      .dg-room-tile { position:relative; aspect-ratio:4/3; min-height:0; border-radius:18px; padding:0; cursor:pointer; box-sizing:border-box; background:#181D28; overflow:hidden; border:1px solid rgba(255,255,255,0.1); box-shadow:0 18px 36px -26px rgba(0,0,0,0.95); transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
      .dg-room-tile:hover { transform:translateY(-4px); border-color:color-mix(in srgb, var(--glow) 62%, rgba(255,255,255,0.12)); box-shadow:0 22px 45px -24px rgba(0,0,0,0.95), 0 0 0 1px color-mix(in srgb, var(--glow) 25%, transparent); z-index:2; }
      .dg-room-tile:nth-child(1), .dg-room-tile:nth-child(3), .dg-room-tile:nth-child(4), .dg-room-tile:nth-child(6) { border-radius:18px; }
      .dg-room-tile-oficina { background: #181D28; }
      .dg-room-tile-fabrica { background: #1A1F27; }
      .dg-room-tile-despacho { background: #1A1F27; }

      .dg-room-scene { position:absolute; inset:0; background:#111722; }
      .dg-scene-image { position:absolute; inset:0; background-repeat:no-repeat; background-size:300% 200%; filter:saturate(.86) contrast(1.04); transform:scale(1.015); transition:transform .45s ease, filter .3s ease; }
      .dg-room-tile:hover .dg-scene-image { transform:scale(1.055); filter:saturate(1) contrast(1.05); }
      .dg-scene-shade { position:absolute; inset:0; background:linear-gradient(180deg, rgba(4,7,12,0.04) 0%, rgba(4,7,12,0.2) 43%, rgba(4,7,12,0.92) 100%), linear-gradient(130deg, color-mix(in srgb, var(--accent) 10%, transparent), transparent 45%); }
      .dg-scene-watermark { display:none; }

      .dg-room-plate { position:absolute; left:12px; right:12px; bottom:12px; display:flex; align-items:center; gap:8px; background:rgba(8,11,17,0.78); border:1px solid color-mix(in srgb, var(--glow) 54%, rgba(255,255,255,0.1)); border-radius:12px; padding:10px 11px; box-shadow:0 12px 30px -18px rgba(0,0,0,0.95); backdrop-filter:blur(14px); }
      .dg-room-plate-num { font-family:'JetBrains Mono', monospace; font-size:10px; color:#8B96A8; }
      .dg-room-plate-icon { --glow:#4FC3C0; width:26px; height:26px; min-width:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--glow) 18%, transparent); color: var(--glow); }
      .dg-room-plate-text { display:flex; flex-direction:column; min-width:0; flex:1; }
      .dg-room-plate-name { font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:12.5px; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-room-plate-sub { font-size:10.5px; color:#8B96A8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dg-room-plate-pct { font-family:'JetBrains Mono', monospace; font-size:13px; font-weight:700; }

      @media (max-width:680px) {
        .dg-app { padding:16px 12px 48px; }
        .dg-overview-head { align-items:flex-start; flex-direction:column; gap:16px; padding:18px; }
        .dg-overview-copy h1 { font-size:21px; }
        .dg-summary { justify-content:flex-start; }
        .dg-plant-grid { grid-template-columns:repeat(2,1fr); grid-template-rows:repeat(3,1fr); transform:none; gap:8px; box-shadow:none; padding:0; background:transparent; }
        .dg-plant-outer { perspective:none; padding:0 0 24px; }
        .dg-plant-outer::after { display:none; }
        .dg-room-tile { min-height:150px; border-radius:14px !important; border-width:1px; border-color: rgba(255,255,255,0.1); transform:none; box-shadow: 0 6px 16px -8px rgba(0,0,0,0.6); }
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
        .dg-celda, .dg-celda-plus { width:52px; }
        .dg-anotador { flex-direction:column; align-items:stretch; gap:4px; }
        .dg-anotador label { min-width:0; }
        .dg-sueldo-topbar > * { flex:1 1 auto; }
        .dg-room-tile:nth-child(1), .dg-room-tile:nth-child(2), .dg-room-tile:nth-child(3), .dg-room-tile:nth-child(4), .dg-room-tile:nth-child(5), .dg-room-tile:nth-child(6) { border-radius:14px; }
        .dg-form-row { flex-direction:column; }
        .dg-charts { flex-direction:column; }
        .dg-quote-grid { flex-direction:column; }
        .dg-quote-meta { grid-template-columns:1fr; }
        .dg-config-grid { grid-template-columns:1fr; }
      }
      @media (max-width:420px) {
        .dg-field-grid { grid-template-columns:1fr; }
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
        --bg:#090D13; --panel:#121924; --panel-2:#171F2B; --panel-3:#1C2532;
        --panel-border:rgba(226,232,240,.105); --text:#F1F5F9; --text-dim:#94A3B8; --cyan:#50D6D0;
        min-height:100vh; padding:0 24px 80px; line-height:1.45; color:var(--text);
        background:
          radial-gradient(circle at 50% -12%, rgba(80,214,208,.105), transparent 34%),
          linear-gradient(180deg, #0B1017 0%, var(--bg) 48%, #080B10 100%);
        -webkit-font-smoothing:antialiased;
      }
      .dg-app button, .dg-app input, .dg-app select, .dg-app textarea { font-family:'Inter',sans-serif; }
      .dg-header {
        position:sticky; top:0; z-index:40; max-width:1180px; min-height:76px; margin:0 auto;
        flex-wrap:nowrap; padding:12px 0; border-bottom:1px solid rgba(226,232,240,.08);
        background:rgba(9,13,19,.82); backdrop-filter:blur(18px);
      }
      .dg-brand { min-width:230px; }
      .dg-brand-mark { width:42px; height:42px; border-radius:12px; box-shadow:none; background:rgba(80,214,208,.1); border-color:rgba(80,214,208,.34); }
      .dg-brand-title { color:#F8FAFC; font-size:17px; letter-spacing:.9px; }
      .dg-brand-sub { margin-top:1px; font-size:11px; color:#7F8EA3; }
      .dg-header-context { display:flex; flex-direction:column; align-items:center; gap:2px; color:var(--text-dim); }
      .dg-live-label { display:flex; align-items:center; gap:7px; color:#C9D4E1; font-size:11px; font-weight:600; }
      .dg-live-dot { width:7px; height:7px; border-radius:50%; background:#5BC98B; box-shadow:0 0 0 4px rgba(91,201,139,.11); }
      .dg-header-date { font-size:10.5px; color:#728096; }
      .dg-login-btn, .dg-btn-primary { min-height:40px; border-radius:10px; padding:9px 15px; background:#50D6D0; color:#06201F; box-shadow:none; }
      .dg-login-btn:hover, .dg-btn-primary:hover { filter:none; background:#66E1DC; box-shadow:0 8px 24px -15px rgba(80,214,208,.65); }
      .dg-btn-ghost { min-height:40px; border-radius:10px; border-color:rgba(226,232,240,.12); color:#B2BFCE; background:rgba(255,255,255,.015); }
      .dg-btn-ghost:hover { background:rgba(255,255,255,.045); border-color:rgba(226,232,240,.22); }
      .dg-icon-btn { min-width:34px; min-height:34px; align-items:center; justify-content:center; }

      .dg-nav { max-width:1180px; min-height:30px; margin:16px auto 24px; padding:0; gap:4px; border:0; border-radius:0; background:transparent; }
      .dg-nav-btn { flex:none; min-height:30px; padding:5px 9px; border-radius:8px; justify-content:flex-start; color:#7F8EA3; font-size:11.5px; }
      .dg-nav-btn.dg-nav-on { color:#B8C7D6; background:rgba(255,255,255,.045); }
      .dg-nav-crumb { padding-left:3px; color:#E2E8F0 !important; background:transparent !important; }

      .dg-overview-head { max-width:1180px; margin:0 auto 22px; padding:0 2px; align-items:flex-end; background:transparent; border:0; border-radius:0; box-shadow:none; }
      .dg-eyebrow { margin-bottom:8px; color:#50D6D0; font-size:10px; letter-spacing:1.6px; }
      .dg-overview-copy h1 { font-size:clamp(25px,3vw,34px); line-height:1.12; letter-spacing:-.75px; }
      .dg-overview-copy p { max-width:590px; margin-top:9px; color:#8997AA; font-size:13px; }
      .dg-summary { max-width:480px; gap:6px; }
      .dg-chip { padding:6px 10px; background:rgba(18,25,36,.76); border-color:rgba(226,232,240,.09); color:#9EACBC; font-family:'Inter',sans-serif; font-size:10.5px; }
      .dg-chip-dot { width:6px; height:6px; box-shadow:0 0 7px color-mix(in srgb, var(--c) 70%, transparent); }

      .dg-plant-outer { max-width:1180px; margin:0 auto; padding:0 0 28px; }
      .dg-building-shell { overflow:hidden; border:1px solid rgba(226,232,240,.11); border-radius:24px; background:rgba(14,20,29,.88); box-shadow:0 34px 80px -55px rgba(0,0,0,.95); }
      .dg-building-head { min-height:70px; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:15px 20px; border-bottom:1px solid rgba(226,232,240,.08); background:linear-gradient(90deg, rgba(80,214,208,.055), transparent 48%); }
      .dg-building-head > div { display:flex; flex-direction:column; gap:1px; }
      .dg-building-kicker { color:#718096; font-size:9.5px; font-weight:700; letter-spacing:1.35px; text-transform:uppercase; }
      .dg-building-head strong { font-family:'Space Grotesk',sans-serif; font-size:16px; letter-spacing:-.15px; }
      .dg-building-count { display:flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid rgba(226,232,240,.09); border-radius:9px; color:#91A0B3; font-size:10.5px; background:rgba(255,255,255,.018); }
      .dg-building-floor { display:grid; grid-template-columns:94px minmax(0,1fr); gap:16px; padding:16px 18px; }
      .dg-building-ground { border-top:1px solid rgba(226,232,240,.08); }
      .dg-floor-label { display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding-left:4px; }
      .dg-floor-label strong { font-family:'JetBrains Mono',monospace; color:#526176; font-size:22px; line-height:1; }
      .dg-floor-label span { margin-top:7px; color:#8E9CAF; font-size:10px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; }
      .dg-building-floor .dg-plant-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); grid-template-rows:none; gap:12px; }
      .dg-building-foot { min-height:38px; display:flex; align-items:center; justify-content:center; gap:9px; border-top:1px solid rgba(226,232,240,.08); color:#718096; font-size:10.5px; background:rgba(255,255,255,.012); }
      .dg-building-foot .dg-live-dot { width:5px; height:5px; box-shadow:none; }
      .dg-room-tile { aspect-ratio:16/9; border-radius:14px !important; border-color:rgba(226,232,240,.105); background:#111824; box-shadow:none; text-align:left; }
      .dg-room-tile:hover { transform:translateY(-2px); border-color:color-mix(in srgb, var(--glow) 58%, rgba(255,255,255,.12)); box-shadow:0 16px 34px -24px rgba(0,0,0,.9); }
      .dg-scene-image { filter:saturate(.72) contrast(1.08) brightness(.86); }
      .dg-room-tile:hover .dg-scene-image { transform:scale(1.045); filter:saturate(.9) contrast(1.07) brightness(.9); }
      .dg-scene-shade { background:linear-gradient(180deg,rgba(4,7,12,.03),rgba(4,7,12,.18) 40%,rgba(4,7,12,.94) 100%),linear-gradient(125deg,color-mix(in srgb,var(--accent) 9%,transparent),transparent 48%); }
      .dg-room-plate { left:10px; right:10px; bottom:9px; gap:8px; padding:9px 10px; border:0; border-top:1px solid color-mix(in srgb,var(--glow) 45%,rgba(255,255,255,.08)); border-radius:10px; background:rgba(7,10,15,.75); box-shadow:none; }
      .dg-room-plate-num { color:#68778B; font-size:9px; }
      .dg-room-plate-icon { width:25px; height:25px; min-width:25px; border-radius:7px; }
      .dg-room-plate-name { color:#F1F5F9; font-size:12px; }
      .dg-room-plate-sub { color:#8391A4; font-size:9.5px; }
      .dg-room-plate-pct { font-size:11.5px; }
      .dg-room-enter { top:9px; right:9px; width:28px; height:28px; background:rgba(8,12,18,.72); border:1px solid rgba(255,255,255,.12); }

      .dg-sector-page, .dg-page { max-width:1120px; }
      .dg-sector-hero { position:relative; min-height:230px; display:flex; align-items:flex-end; gap:24px; overflow:hidden; margin-bottom:14px; padding:22px; border:1px solid rgba(226,232,240,.11); border-radius:20px; background:#111824; }
      .dg-sector-hero .dg-room-scene { position:absolute; inset:0; }
      .dg-sector-hero .dg-scene-image { filter:saturate(.58) contrast(1.04) brightness(.62); background-size:300% 200%; }
      .dg-sector-hero .dg-scene-shade { background:linear-gradient(90deg,rgba(6,9,14,.96) 0%,rgba(6,9,14,.77) 47%,rgba(6,9,14,.33) 100%),linear-gradient(0deg,rgba(6,9,14,.8),transparent 65%); }
      .dg-sector-hero-back { position:absolute; z-index:2; top:16px; left:16px; min-height:34px; display:flex; align-items:center; gap:7px; padding:7px 10px; border:1px solid rgba(255,255,255,.15); border-radius:9px; background:rgba(8,12,18,.6); color:#CDD6E1; font-size:11px; font-weight:600; cursor:pointer; backdrop-filter:blur(10px); }
      .dg-sector-hero-back:hover { color:#fff; border-color:rgba(80,214,208,.45); }
      .dg-sector-hero-content { position:relative; z-index:2; flex:1; min-width:0; }
      .dg-sector-hero-eyebrow { display:block; margin-bottom:7px; color:#8FA0B3; font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:1.3px; text-transform:uppercase; }
      .dg-sector-hero-title { display:flex; align-items:center; gap:12px; }
      .dg-sector-hero-icon { width:42px; height:42px; min-width:42px; display:flex; align-items:center; justify-content:center; border:1px solid color-mix(in srgb,var(--glow) 46%,rgba(255,255,255,.1)); border-radius:12px; background:color-mix(in srgb,var(--glow) 13%,rgba(9,13,19,.8)); color:var(--glow); }
      .dg-sector-hero-title h1 { margin:0; font-family:'Space Grotesk',sans-serif; font-size:clamp(26px,4vw,38px); line-height:1; letter-spacing:-.75px; }
      .dg-sector-hero-title p { margin:6px 0 0; color:#A2AFBF; font-size:12px; }
      .dg-sector-hero-meta { display:flex; gap:8px; flex-wrap:wrap; margin-top:15px; }
      .dg-sector-hero-meta span { min-height:27px; display:flex; align-items:center; gap:6px; padding:5px 9px; border:1px solid rgba(255,255,255,.11); border-radius:8px; background:rgba(7,10,15,.5); color:#A9B5C3; font-size:10.5px; backdrop-filter:blur(8px); }
      .dg-sector-hero-meta i { width:6px; height:6px; border-radius:50%; background:var(--glow); }
      .dg-sector-hero-progress { position:relative; z-index:2; width:160px; align-self:flex-end; padding:13px; border:1px solid rgba(255,255,255,.12); border-radius:12px; background:rgba(7,10,15,.64); backdrop-filter:blur(12px); }
      .dg-sector-hero-progress > span { color:#8997A9; font-size:9.5px; text-transform:uppercase; letter-spacing:.75px; }
      .dg-sector-hero-progress > strong { display:block; margin:3px 0 10px; color:var(--glow); font-family:'JetBrains Mono',monospace; font-size:22px; }
      .dg-sector-hero-progress > div { height:4px; overflow:hidden; border-radius:10px; background:rgba(255,255,255,.09); }
      .dg-sector-hero-progress > div i { display:block; height:100%; border-radius:inherit; background:var(--glow); }
      .dg-sector-workbar { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:16px; padding:10px 12px; border:1px solid rgba(226,232,240,.09); border-radius:13px; background:rgba(18,25,36,.78); }
      .dg-sector-workbar > div:first-child { min-width:126px; display:flex; flex-direction:column; padding-left:2px; }
      .dg-sector-workbar > div:first-child span { color:#718096; font-size:9px; letter-spacing:.8px; text-transform:uppercase; }
      .dg-sector-workbar > div:first-child strong { margin-top:1px; color:#E2E8F0; font-size:12px; }
      .dg-sector-workbar .dg-sector-tabs { flex:1; justify-content:flex-end; flex-wrap:wrap; gap:5px; margin:0; padding:0; border:0; }
      .dg-sector-tab { min-height:34px; display:flex; align-items:center; gap:6px; padding:7px 10px; border:1px solid transparent; border-radius:8px; color:#8C9AAD; font-size:10.5px; background:transparent; }
      .dg-sector-tab:hover { color:#D7E0EA; background:rgba(255,255,255,.035); }
      .dg-sector-tab-on { color:#62DAD5; border-color:rgba(80,214,208,.22); background:rgba(80,214,208,.095); }

      .dg-section-card, .dg-quick-actions, .dg-task-table-wrap, .dg-chart-card, .dg-total-card, .dg-month-group {
        border-color:rgba(226,232,240,.095); border-radius:13px; background:rgba(18,25,36,.82); box-shadow:none;
      }
      .dg-section-card { padding:17px 18px 19px; }
      .dg-section-card:hover { border-color:rgba(226,232,240,.15); }
      .dg-task-table-wrap { padding:5px; }
      .dg-total-card { padding:14px 15px; }
      .dg-modal-overlay { background:rgba(2,5,9,.76); backdrop-filter:blur(8px); }
      .dg-modal { max-width:440px; border-color:rgba(226,232,240,.13); border-radius:18px; background:#111822; box-shadow:0 30px 80px -20px rgba(0,0,0,.9); }
      .dg-modal-lg { max-width:920px; }
      .dg-field input, .dg-field select, .dg-form input, .dg-form select, .dg-inline-input, .dg-pedido-search, textarea {
        border-color:rgba(226,232,240,.12); border-radius:9px; background:#0E151F; color:#E9EEF5;
      }
      .dg-field input:focus, .dg-field select:focus, .dg-form input:focus, .dg-form select:focus, .dg-inline-input:focus, .dg-pedido-search:focus, textarea:focus {
        outline:none; border-color:rgba(80,214,208,.7); box-shadow:0 0 0 3px rgba(80,214,208,.1);
      }
      .dg-locked-page { min-height:250px; flex-direction:row; justify-content:center; text-align:left; padding:42px; border-style:dashed; background:rgba(18,25,36,.52); }
      .dg-locked-page > div:nth-child(2) { max-width:420px; }
      .dg-locked-page strong { display:block; margin-bottom:4px; color:#E6EDF5; font-family:'Space Grotesk',sans-serif; font-size:18px; }
      .dg-locked-page p { max-width:none; margin:0; color:#8C9AAD; }
      .dg-locked-icon { width:48px; height:48px; min-width:48px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(80,214,208,.22); border-radius:13px; background:rgba(80,214,208,.08); color:#50D6D0; }

      .dg-date-filter-bar { display:flex; align-items:center; gap:9px; flex-wrap:wrap; margin:-5px 0 12px; padding:10px 12px; border:1px solid rgba(226,232,240,.09); border-radius:11px; background:rgba(18,25,36,.55); }
      .dg-date-filter-bar > span { display:flex; align-items:center; gap:6px; margin-right:3px; color:#9EACBC; font-size:10.5px; font-weight:600; }
      .dg-date-filter-bar label { display:flex; align-items:center; gap:6px; color:#748297; font-size:9.5px; text-transform:uppercase; letter-spacing:.45px; }
      .dg-date-filter-bar input { min-height:34px; padding:6px 8px; border:1px solid rgba(226,232,240,.11); border-radius:8px; background:#0E151F; color:#DCE5EE; color-scheme:dark; font-size:11px; }
      .dg-bulk-bar { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:14px; padding:13px 14px; border:1px solid rgba(229,181,79,.2); border-radius:12px; background:linear-gradient(90deg,rgba(229,181,79,.055),rgba(18,25,36,.72)); }
      .dg-bulk-bar > div:first-child { display:flex; flex-direction:column; gap:2px; min-width:220px; }
      .dg-bulk-bar strong { color:#E8EDF3; font-size:12px; }
      .dg-bulk-bar span { color:#8492A5; font-size:10.5px; }
      .dg-bulk-actions { display:flex; align-items:center; justify-content:flex-end; gap:7px; flex-wrap:wrap; }
      .dg-btn-danger { min-height:40px; display:flex; align-items:center; gap:6px; padding:9px 14px; border:1px solid rgba(224,106,106,.35); border-radius:10px; background:rgba(224,106,106,.09); color:#F19A9A; font-size:12px; font-weight:600; cursor:pointer; }
      .dg-btn-danger:hover { border-color:rgba(224,106,106,.58); background:rgba(224,106,106,.15); }
      .dg-btn-primary:disabled, .dg-btn-ghost:disabled, .dg-btn-danger:disabled { opacity:.42; cursor:not-allowed; box-shadow:none; }

      .dg-client-notice { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:10px; padding:10px; border:1px solid rgba(229,181,79,.2); border-radius:11px; background:rgba(229,181,79,.045); }
      .dg-client-notice > div { display:flex; flex:1; min-width:190px; flex-direction:column; }
      .dg-client-notice > div span { color:#9B8965; font-size:8.5px; font-weight:700; letter-spacing:.65px; text-transform:uppercase; }
      .dg-client-notice > div strong { margin-top:2px; color:#DCE4EC; font-size:11.5px; }
      .dg-client-notice .dg-btn-primary, .dg-client-notice .dg-btn-ghost { min-height:34px; padding:7px 10px; font-size:10.5px; }
      .dg-client-notice-done { border-color:rgba(91,201,139,.24); background:rgba(91,201,139,.055); }
      .dg-client-notice-badge { min-height:30px; display:inline-flex; align-items:center; gap:6px; padding:6px 9px; border:1px solid rgba(91,201,139,.3); border-radius:8px; background:rgba(91,201,139,.09); color:#72D9A0 !important; font-size:10.5px !important; font-weight:600; }
      .dg-btn-entregado { margin-top:8px; }
      .dg-flow-pending { display:flex; align-items:center; gap:6px; padding:8px 10px; border:1px dashed rgba(229,181,79,.3); border-radius:8px; color:#C4A96D; font-size:10.5px; }

      .dg-order-flow { width:100%; margin-top:3px; overflow:hidden; border:1px solid rgba(226,232,240,.08); border-radius:10px; background:rgba(8,13,20,.32); }
      .dg-order-flow-nav { min-height:34px; display:grid; grid-template-columns:minmax(100px,1fr) auto minmax(100px,1fr); gap:8px; align-items:center; padding:4px 6px 4px 9px; border-bottom:1px solid rgba(226,232,240,.07); background:rgba(148,163,184,.025); }
      .dg-order-flow-label { min-width:0; display:flex; align-items:baseline; gap:6px; }
      .dg-order-flow-label span { color:#68778B; font-size:8px; font-weight:750; letter-spacing:.6px; text-transform:uppercase; }
      .dg-order-flow-label strong { color:#AEBACA; font-family:'JetBrains Mono',monospace; font-size:9px; white-space:nowrap; }
      .dg-order-flow-dots { display:flex; align-items:center; justify-content:center; gap:5px; }
      .dg-flow-dot { width:21px; height:21px; display:flex; align-items:center; justify-content:center; padding:0; border:1px solid rgba(148,163,184,.18); border-radius:6px; background:rgba(148,163,184,.045); color:#68778A; font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:750; cursor:pointer; transition:border-color .15s ease,background .15s ease,color .15s ease,transform .15s ease; }
      .dg-flow-dot:hover { border-color:rgba(79,195,192,.36); color:#AFC0D0; }
      .dg-flow-dot-done { border-color:rgba(91,201,139,.23); background:rgba(91,201,139,.075); color:#72D9A0; }
      .dg-flow-dot-active { border-color:rgba(79,195,192,.42); background:rgba(79,195,192,.1); color:#64D7D2; }
      .dg-flow-dot-selected { border-color:#4FC3C0; box-shadow:0 0 0 2px rgba(79,195,192,.12); transform:translateY(-1px); }
      .dg-order-flow-arrows { display:flex; justify-content:flex-end; gap:4px; }
      .dg-order-flow-arrows button { width:25px; height:25px; display:flex; align-items:center; justify-content:center; padding:0; border:1px solid rgba(148,163,184,.16); border-radius:7px; background:rgba(148,163,184,.045); color:#91A0B2; cursor:pointer; }
      .dg-order-flow-arrows button:hover:not(:disabled) { border-color:rgba(79,195,192,.36); color:#64D7D2; }
      .dg-order-flow-arrows button:disabled { opacity:.25; cursor:not-allowed; }
      .dg-order-flow-slide { animation:dg-order-step-in .16s ease; }
      .dg-order-step { min-width:0; min-height:0; display:flex; flex-direction:column; padding:8px 9px; border:0; border-radius:0; background:rgba(12,18,27,.52); }
      .dg-order-step-done { border-color:rgba(91,201,139,.22); background:linear-gradient(155deg,rgba(91,201,139,.07),rgba(12,18,27,.58) 60%); }
      .dg-order-step-active { border-color:rgba(79,195,192,.35); background:linear-gradient(155deg,rgba(79,195,192,.09),rgba(12,18,27,.64) 60%); box-shadow:inset 0 2px 0 rgba(79,195,192,.5); }
      .dg-order-step-pending { opacity:.68; }
      .dg-order-step-head { display:grid; grid-template-columns:22px minmax(0,1fr) auto; gap:6px; align-items:center; }
      .dg-order-step-number { width:22px; height:22px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(148,163,184,.23); border-radius:6px; color:#93A1B3; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:700; }
      .dg-order-step-done .dg-order-step-number { border-color:rgba(91,201,139,.4); background:rgba(91,201,139,.12); color:#72D9A0; }
      .dg-order-step-active .dg-order-step-number { border-color:rgba(79,195,192,.46); background:rgba(79,195,192,.11); color:#64D7D2; }
      .dg-order-step-head > div { min-width:0; display:flex; flex-direction:column; gap:1px; }
      .dg-order-step-head small { display:none; }
      .dg-order-step-head strong { color:#DCE4ED; font-family:'Space Grotesk',sans-serif; font-size:10.5px; line-height:1.2; }
      .dg-order-step-state { width:max-content; max-width:100%; padding:2px 6px; border-radius:100px; background:rgba(148,163,184,.08); color:#7E8B9D; font-size:7px; font-weight:700; letter-spacing:.3px; text-transform:uppercase; }
      .dg-order-step-done .dg-order-step-state { background:rgba(91,201,139,.1); color:#72D9A0; }
      .dg-order-step-active .dg-order-step-state { background:rgba(79,195,192,.1); color:#64D7D2; }
      .dg-order-step > p { display:-webkit-box; margin:5px 0 0; overflow:hidden; color:#7F8C9E; font-size:8.5px; line-height:1.35; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
      .dg-order-step-actions { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); align-items:stretch; gap:5px; margin-top:0; padding-top:6px; }
      .dg-step-action, .dg-step-whatsapp { min-width:0; min-height:29px; display:flex; align-items:center; justify-content:center; gap:5px; padding:5px 8px; border:1px solid rgba(148,163,184,.2); border-radius:7px; background:rgba(148,163,184,.07); color:#B8C4D2; font-family:'Inter',sans-serif; font-size:8.5px; font-weight:650; line-height:1.15; text-align:center; text-decoration:none; cursor:pointer; }
      .dg-step-action:hover, .dg-step-whatsapp:hover { border-color:rgba(79,195,192,.45); color:#65D7D2; }
      .dg-step-action:disabled { opacity:.36; cursor:not-allowed; }
      .dg-step-action-primary { border-color:rgba(79,195,192,.34); background:rgba(79,195,192,.1); color:#65D7D2; }
      .dg-step-action-finish { border-color:rgba(91,201,139,.4); background:rgba(91,201,139,.12); color:#72D9A0; }
      .dg-step-whatsapp { border-color:rgba(91,201,139,.3); color:#72D9A0; }
      .dg-step-check { min-width:0; min-height:27px; display:flex; align-items:center; justify-content:center; gap:4px; color:#72D9A0; font-size:8.5px; font-weight:650; text-align:center; }
      .dg-order-flow-cancelled { display:flex; align-items:center; gap:6px; margin-top:7px; padding:9px 10px; border:1px solid rgba(224,106,106,.24); border-radius:9px; background:rgba(224,106,106,.07); color:#E98989; font-size:10px; }
      @keyframes dg-order-step-in { from { opacity:.35; transform:translateX(5px); } to { opacity:1; transform:translateX(0); } }

      .dg-process-tabs { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-bottom:12px; }
      .dg-process-tabs button { --pc:#4FC3C0; min-height:70px; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; padding:11px 13px; border:1px solid rgba(226,232,240,.09); border-radius:12px; background:rgba(18,25,36,.72); color:#95A3B5; text-align:left; cursor:pointer; transition:border-color .15s ease,background .15s ease; }
      .dg-process-tabs button:hover { border-color:color-mix(in srgb,var(--pc) 38%,rgba(255,255,255,.1)); }
      .dg-process-tabs button > span { width:100%; display:flex; align-items:center; justify-content:space-between; color:#D8E0E9; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:600; }
      .dg-process-tabs button small { min-width:25px; padding:2px 6px; border-radius:100px; background:rgba(255,255,255,.055); color:#94A3B8; font-family:'JetBrains Mono',monospace; font-size:9px; text-align:center; }
      .dg-process-tabs button em { margin-top:4px; color:#748297; font-size:9.5px; font-style:normal; line-height:1.35; }
      .dg-process-tabs .dg-process-tab-on { border-color:color-mix(in srgb,var(--pc) 52%,rgba(255,255,255,.1)); background:color-mix(in srgb,var(--pc) 8%,rgba(18,25,36,.82)); box-shadow:inset 3px 0 0 var(--pc); }
      .dg-process-tabs .dg-process-tab-on > span { color:var(--pc); }

      @media (max-width:900px) {
        .dg-header-context { align-items:flex-start; margin-left:auto; }
        .dg-header-date { display:none; }
        .dg-overview-head { align-items:flex-start; flex-direction:column; }
        .dg-summary { justify-content:flex-start; }
        .dg-building-floor { grid-template-columns:1fr; gap:10px; }
        .dg-floor-label { flex-direction:row; align-items:center; gap:8px; padding:0 2px; }
        .dg-floor-label strong { font-size:14px; }
        .dg-floor-label span { margin:0; }
        .dg-sector-workbar { align-items:flex-start; flex-direction:column; }
        .dg-sector-workbar .dg-sector-tabs { width:100%; justify-content:flex-start; }
      }
      @media (max-width:680px) {
        .dg-app { padding:0 12px 48px; }
        .dg-header { min-height:66px; padding:9px 0; }
        .dg-brand { min-width:0; }
        .dg-brand-mark { width:37px; height:37px; }
        .dg-brand-title { font-size:15px; }
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
        .dg-sector-hero { min-height:265px; padding:18px; }
        .dg-sector-hero .dg-scene-shade { background:linear-gradient(0deg,rgba(6,9,14,.96) 0%,rgba(6,9,14,.68) 65%,rgba(6,9,14,.35) 100%); }
        .dg-sector-hero-content { padding-top:44px; }
        .dg-sector-hero-title h1 { font-size:27px; }
        .dg-sector-hero-progress { display:none; }
        .dg-sector-workbar { padding:10px; }
        .dg-sector-workbar .dg-sector-tabs { flex-wrap:nowrap; overflow-x:auto; padding-bottom:2px; }
        .dg-sector-tab { flex:0 0 auto; min-height:38px; }
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
        .dg-client-notice { align-items:stretch; }
        .dg-client-notice > div, .dg-client-notice .dg-btn-primary, .dg-client-notice .dg-btn-ghost, .dg-client-notice-badge { width:100%; justify-content:center; }
        .dg-month-items { gap:6px; padding:7px; }
        .dg-month-header { padding:9px 11px; }
        .dg-pedido-card:not(.dg-fabrica-card) { gap:5px; padding:9px 10px; }
        .dg-pedido-card:not(.dg-fabrica-card) > .dg-pedido-badges { flex-wrap:nowrap; overflow-x:auto; padding-bottom:1px; scrollbar-width:none; }
        .dg-pedido-card:not(.dg-fabrica-card) > .dg-pedido-badges::-webkit-scrollbar { display:none; }
        .dg-pedido-card:not(.dg-fabrica-card) .dg-pago-meta { font-size:10px; line-height:1.25; }
        .dg-fabrica-btn { min-width:0; padding:7px 5px; font-size:10px; line-height:1.15; }
        .dg-fabrica-btn-next { grid-column:1 / -1; font-size:11px; }
        .dg-order-step { min-height:0; }
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
      }
      @media (prefers-reduced-motion: reduce) {
        .dg-spin { animation:none; }
        .dg-room-tile, .dg-scene-image, .dg-flow-dot { transition:none; }
        .dg-order-flow-slide { animation:none; }
      }
    `}</style>
  );
}
