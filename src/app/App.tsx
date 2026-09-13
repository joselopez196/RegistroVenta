import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  CircleDollarSign,
  Database,
  FileCode2,
  FileText,
  ReceiptText,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";

type Tab = "registros" | "logcat" | "ranquery";
type Filter = "todos" | "boleta" | "factura";

const ventas = [
  { codigo: "V-1010", nombre: "SSD Kingston NV3 1TB", precio: 259.9, cantidad: 1, tipo: "factura", fecha: "12 Sep 2026", hora: "15:26" },
  { codigo: "V-1009", nombre: "Webcam Logitech C920", precio: 239.9, cantidad: 1, tipo: "boleta", fecha: "12 Sep 2026", hora: "11:18" },
  { codigo: "V-1008", nombre: "Impresora Epson EcoTank L3250", precio: 729, cantidad: 1, tipo: "factura", fecha: "11 Sep 2026", hora: "17:03" },
  { codigo: "V-1007", nombre: "Hub USB-C Ugreen 6 en 1", precio: 149.9, cantidad: 2, tipo: "boleta", fecha: "11 Sep 2026", hora: "13:47" },
  { codigo: "V-1006", nombre: "Silla ergonómica Nova", precio: 589, cantidad: 1, tipo: "factura", fecha: "10 Sep 2026", hora: "18:12" },
  { codigo: "V-1005", nombre: "Auriculares JBL Tune 520BT", precio: 129.9, cantidad: 3, tipo: "boleta", fecha: "10 Sep 2026", hora: "10:42" },
  { codigo: "V-1004", nombre: "Monitor LG UltraGear 24\"", precio: 849, cantidad: 1, tipo: "factura", fecha: "08 Sep 2026", hora: "16:18" },
  { codigo: "V-1003", nombre: "Mouse Logitech M650", precio: 79.9, cantidad: 2, tipo: "boleta", fecha: "05 Sep 2026", hora: "12:05" },
  { codigo: "V-1002", nombre: "Teclado Keychron K2", precio: 279, cantidad: 1, tipo: "boleta", fecha: "02 Sep 2026", hora: "09:31" },
  { codigo: "V-1001", nombre: "Laptop ASUS Vivobook 15", precio: 2499, cantidad: 1, tipo: "factura", fecha: "30 Ago 2026", hora: "14:22" },
] as const;

const bootLogs = [
  ["I", "VentasDB", "Inicializando módulo de ventas"],
  ["D", "SQLiteOpenHelper", "onCreate(): comprobando ventas.db"],
  ["I", "SQLite", "Base de datos abierta en modo READ_WRITE"],
  ["D", "RanQuery", "SELECT * FROM ventas ORDER BY fecha_venta DESC"],
  ["I", "Cursor", "10 filas cargadas correctamente"],
  ["I", "VentasDB", "Interfaz lista para el usuario"],
] as const;

const queryLines = [
  ["CREATE TABLE", " ventas ("],
  ["  codigo", " TEXT PRIMARY KEY,"],
  ["  nombre", " TEXT NOT NULL,"],
  ["  precio", " REAL NOT NULL CHECK(precio > 0),"],
  ["  cantidad", " INTEGER NOT NULL CHECK(cantidad > 0),"],
  ["  tipo", " TEXT NOT NULL CHECK(tipo IN ('boleta','factura')),"],
  ["  fecha_venta", " TEXT NOT NULL"],
  [" );", ""],
] as const;

const money = (value: number) => `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

function TabLoader({ label }: { label: string }) {
  const sqlWords = ["SELECT", "FROM", "ventas", "ORDER BY", "DESC", "SQLite", "CURSOR", "READ_WRITE"];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#0a1e1b]"
    >
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#173b36]/80 blur-3xl"
      />

      {/* Floating SQL particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sqlWords.map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.32, 0], y: -55 }}
            transition={{ delay: i * 0.072, duration: 1.05, ease: "easeOut" }}
            className="absolute font-[DM_Mono] text-[8px] text-[#4f8578]"
            style={{ left: `${7 + i * 11.5}%`, top: `${60 + (i % 4) * 5}%` }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Ring system */}
      <div className="relative flex items-center justify-center">
        {/* Outermost dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute h-56 w-56 rounded-full border border-dashed border-[#4f8578]/20"
        />

        {/* Gold orbiting dot — outer orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          className="absolute h-48 w-48"
        >
          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#eebc64] shadow-[0_0_14px_5px_rgba(238,188,100,0.55)]" />
        </motion.div>

        {/* Mid ring — counter-clockwise */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
          className="absolute h-36 w-36 rounded-full border-2 border-[#1e4a40] border-t-[#eebc64]/85"
        />

        {/* Green orbiting dot — inner orbit */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute h-24 w-24"
        >
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#91d4ae] shadow-[0_0_10px_4px_rgba(145,212,174,0.55)]" />
        </motion.div>

        {/* Fast inner spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          className="absolute h-[62px] w-[62px] rounded-full border-2 border-transparent border-t-[#4f8578] border-r-[#4f8578]/35"
        />

        {/* Central icon */}
        <motion.div
          initial={{ scale: 0.65, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.06, duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br from-[#234d42] to-[#173b36] shadow-[0_0_28px_rgba(238,188,100,0.38),0_10px_24px_rgba(0,0,0,0.5)]"
        >
          <Database size={24} className="text-[#eebc64]" />
        </motion.div>
      </div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.32 }}
        className="mt-10 text-center"
      >
        <p className="font-[DM_Mono] text-[9px] uppercase tracking-[0.26em] text-[#4f8578]">Sincronizando SQLite</p>
        <p className="mt-2 font-[Roboto_Slab] text-lg font-bold tracking-[-0.02em] text-[#fffdf8]">{label}</p>
      </motion.div>

      {/* Progress shimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-5 h-px w-44 overflow-hidden rounded-full bg-white/10"
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "130%" }}
          transition={{ duration: 0.62, ease: "easeInOut" }}
          className="h-full w-2/5 rounded-full bg-gradient-to-r from-transparent via-[#eebc64] to-transparent"
        />
      </motion.div>

      {/* Pulsing dots */}
      <div className="mt-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.75, 1.3, 0.75] }}
            transition={{ delay: i * 0.2, duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-[#eebc64]"
          />
        ))}
      </div>
    </motion.div>
  );
}

function BootScreen() {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setShown((n) => Math.min(n + 1, bootLogs.length)), 620);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-[#122b28] px-6 pt-24 text-[#eef4ed]">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="grid h-16 w-16 place-items-center rounded-[22px] bg-[#eebc64] text-[#173b36] shadow-[0_16px_35px_rgba(0,0,0,0.26)]">
        <Database size={31} strokeWidth={2.2} />
      </motion.div>
      <p className="mt-7 font-[Roboto_Slab] text-3xl tracking-[-0.035em]">VentasDB</p>
      <p className="mt-1 text-sm text-[#b7d4cc]">Gestión local de ventas · SQLite</p>
      <div className="mt-10 rounded-2xl border border-white/10 bg-black/15 p-4">
        <div className="mb-3 flex items-center justify-between font-[DM_Mono] text-[10px] uppercase tracking-[0.14em] text-[#b7d4cc]">
          <span className="flex items-center gap-2"><TerminalSquare size={13} /> Diagnóstico de inicio</span>
          <span>{Math.round((shown / bootLogs.length) * 100)}%</span>
        </div>
        <div className="space-y-2 font-[DM_Mono] text-[9px] leading-4">
          {bootLogs.slice(0, shown).map(([level, tag, message], index) => (
            <motion.p key={`${tag}-${index}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-[#dbe9df]">
              <span className={level === "I" ? "text-[#91d4ae]" : "text-[#eebc64]"}>{level}/</span><span className="text-[#b7d4cc]">{tag}: </span>{message}
            </motion.p>
          ))}
          {shown < bootLogs.length && <span className="animate-pulse text-[#eebc64]">▌</span>}
        </div>
      </div>
      <div className="mt-auto mb-12">
        <div className="h-1 overflow-hidden rounded-full bg-white/15"><motion.div animate={{ width: `${Math.max(8, (shown / bootLogs.length) * 100)}%` }} className="h-full bg-[#eebc64]" /></div>
        <p className="mt-3 text-center font-[DM_Mono] text-[10px] text-[#b7d4cc]">Conectando de forma segura…</p>
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<Tab>("registros");
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");

  useEffect(() => {
    const timer = window.setTimeout(() => setStarted(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleSales = useMemo(() => filter === "todos" ? ventas : ventas.filter((venta) => venta.tipo === filter), [filter]);
  const total = ventas.reduce((sum, venta) => sum + venta.precio * venta.cantidad, 0);

  const changeTab = (next: Tab) => {
    if (next === tab || pendingTab) return;
    setPendingTab(next);
    window.setTimeout(() => { setTab(next); setPendingTab(null); }, 780);
  };

  const tabCopy: Record<Tab, string> = { registros: "Registros de ventas", logcat: "LogCat de ejecución", ranquery: "RanQuery SQLite" };

  return (
    <main className="min-h-screen bg-[#f4f1eb] px-5 py-8 font-[Work_Sans] text-[#1f2928] selection:bg-[#d8e8d9] lg:grid lg:grid-cols-[1fr_410px_1fr] lg:items-center lg:gap-12 lg:px-12">
      <section className="mb-8 max-w-sm lg:mb-0 lg:justify-self-end">
        <p className="font-[DM_Mono] text-[10px] font-medium uppercase tracking-[0.22em] text-[#638279]">Proyecto Android · SQLite</p>
        <h1 className="mt-4 font-[Roboto_Slab] text-4xl leading-[1.06] tracking-[-0.035em] text-[#173b36]">Ventas claras.<br />Datos que se pueden defender.</h1>
        <p className="mt-5 text-sm leading-6 text-[#596460]">Una simulación pensada para explicar el ciclo completo: persistencia local, consulta SQL, registro de actividad y presentación de resultados.</p>
        <div className="mt-8 border-y border-[#d8d4cb] py-5">
          {[["01", "SQLiteOpenHelper", "Crea y actualiza ventas.db"], ["02", "Consulta ordenada", "Recupera ventas recientes"], ["03", "UI semántica", "Boleta y factura diferenciadas"]].map(([number, title, detail]) => <div key={number} className="flex gap-4 py-2"><span className="font-[DM_Mono] text-xs text-[#b83a36]">{number}</span><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-[#68706b]">{detail}</p></div></div>)}
        </div>
      </section>

      <React.Fragment>
        <div aria-label="Samsung Galaxy S26 Ultra" className="relative mx-auto flex h-[min(800px,calc(100dvh-4rem))] min-h-[560px] w-full max-w-[410px] flex-col overflow-hidden rounded-[28px] border-[8px] border-[#34383c] bg-[#fffdf8] shadow-[0_32px_72px_rgba(25,30,32,0.3),inset_0_0_0_1px_rgba(255,255,255,0.18)]">
        <div className="absolute inset-x-0 top-0 z-30 h-1 bg-[#191d20]" />
        <div className="absolute left-1/2 top-2.5 z-40 h-3 w-3 -translate-x-1/2 rounded-full border border-black/40 bg-[#050708] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
        <div className="flex h-11 items-center justify-between bg-[#173b36] px-6 pt-2 text-[10px] font-medium text-[#dce8df]"><span className="font-[DM_Mono] text-[8px] tracking-[0.12em]">SAMSUNG S26 ULTRA · 9:41</span><span className="font-[DM_Mono] text-[9px]">◒ 5G ▮▮▮</span></div>
        <header className="flex items-center justify-between border-b border-[#d8d4cb] bg-[#fffdf8] px-5 py-4">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#173b36] text-[#eebc64]"><Database size={19} /></div><div><p className="font-[Roboto_Slab] text-base font-bold tracking-[-0.02em]">VentasDB</p><p className="mt-0.5 font-[DM_Mono] text-[9px] uppercase tracking-[0.13em] text-[#68706b]">Base local conectada</p></div></div>
          <ShieldCheck size={20} className="text-[#4f8578]" />
        </header>
        <div className="relative min-h-0 flex-1 overflow-y-auto bg-[#f8f6f1] pb-5">
          <AnimatePresence>{!started && <BootScreen />}</AnimatePresence>
          {started && <>
          {tab === "registros" && <section className="p-5"><div className="rounded-2xl bg-[#173b36] p-4 text-[#fffdf8]"><p className="font-[DM_Mono] text-[9px] uppercase tracking-[0.16em] text-[#b7d4cc]">Ventas de septiembre</p><div className="mt-1 flex items-end justify-between"><p className="font-[Roboto_Slab] text-2xl font-bold tracking-[-0.03em]">{money(total)}</p><p className="mb-1 text-xs text-[#b7d4cc]">{ventas.length} operaciones</p></div><div className="mt-3 h-1 rounded-full bg-white/15"><div className="h-full w-[68%] rounded-full bg-[#eebc64]" /></div></div><div className="mt-5 flex gap-2">{(["todos", "boleta", "factura"] as Filter[]).map((item) => { const count = item === "todos" ? ventas.length : ventas.filter((venta) => venta.tipo === item).length; const label = item === "todos" ? "Todos" : item === "boleta" ? "Boletas" : "Facturas"; return <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold capitalize transition ${filter === item ? "border-[#173b36] bg-[#173b36] text-white" : "border-[#d8d4cb] bg-[#fffdf8] text-[#68706b]"}`}>{label} ({count})</button>; })}</div><div className="mt-5 space-y-3">{visibleSales.map((venta, index) => { const factura = venta.tipo === "factura"; return <motion.article key={venta.codigo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className={`overflow-hidden rounded-2xl border bg-[#fffdf8] ${factura ? "border-[#e6b4ae]" : "border-[#bed7c3]"}`}><div className={`h-1 ${factura ? "bg-[#b83a36]" : "bg-[#4f8578]"}`} /><div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-[DM_Mono] text-[9px] uppercase tracking-[0.12em] text-[#68706b]">{venta.codigo} · {venta.fecha}</p><h2 className="mt-1 text-sm font-semibold leading-5">{venta.nombre}</h2></div><span className={`shrink-0 rounded-full px-2 py-1 font-[DM_Mono] text-[8px] font-medium uppercase tracking-[0.08em] ${factura ? "bg-[#fae9e7] text-[#9e302d]" : "bg-[#e5f1e7] text-[#356e4e]"}`}>{factura ? "Factura" : "Boleta"}</span></div><div className="mt-4 flex items-end justify-between border-t border-[#ebe8e1] pt-3"><p className="text-xs text-[#68706b]">{venta.cantidad} {venta.cantidad === 1 ? "unidad" : "unidades"}<span className="mx-1.5 text-[#d8d4cb]">×</span>{money(venta.precio)}</p><p className={`font-[Roboto_Slab] text-base font-bold ${factura ? "text-[#a9322e]" : "text-[#2e6e4a]"}`}>{money(venta.precio * venta.cantidad)}</p></div></div></motion.article>})}</div></section>}
            {tab === "logcat" && <section className="p-5"><div className="flex items-center justify-between"><div><p className="font-[Roboto_Slab] text-xl font-bold tracking-[-0.03em]">LogCat</p><p className="mt-1 text-xs text-[#68706b]">Evidencia de ejecución en Android</p></div><span className="flex items-center gap-1 rounded-full bg-[#e5f1e7] px-2.5 py-1 font-[DM_Mono] text-[9px] text-[#356e4e]"><span className="h-1.5 w-1.5 rounded-full bg-[#4f8578]" /> LIVE</span></div><div className="mt-5 overflow-hidden rounded-2xl border border-[#233a36] bg-[#122b28] p-4 font-[DM_Mono] text-[10px] leading-5"><div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3 text-[#b7d4cc]"><span className="flex items-center gap-2"><TerminalSquare size={13} /> com.ventasdb.app</span><span>5 / 5</span></div>{bootLogs.map(([level, tag, message], index) => <p key={`${tag}-${index}`} className="py-1 text-[#e5efe9]"><span className="mr-1 text-[#789b91]">09:41:{String(12 + index * 2).padStart(2, "0")}</span><span className={level === "I" ? "text-[#91d4ae]" : "text-[#eebc64]"}>{level}</span> <span className="text-[#b7d4cc]">{tag}</span> {message}</p>)}<div className="mt-3 rounded-lg border border-[#4f8578]/50 bg-[#23473d] px-3 py-2 text-[#b9e7c8]">✓ Sin errores · cursor cerrado correctamente</div></div><div className="mt-5 rounded-2xl border border-[#d8d4cb] bg-[#fffdf8] p-4"><p className="flex items-center gap-2 text-sm font-semibold"><ServerCog size={16} className="text-[#4f8578]" /> ¿Qué demuestra esta vista?</p><p className="mt-2 text-xs leading-5 text-[#68706b]">La base se abre mediante <strong className="font-medium text-[#173b36]">SQLiteOpenHelper</strong>, se consulta con un cursor y se liberan los recursos al terminar. Es evidencia del flujo de conexión local.</p></div></section>}
            {tab === "ranquery" && <section className="p-5"><p className="font-[Roboto_Slab] text-xl font-bold tracking-[-0.03em]">RanQuery</p><p className="mt-1 text-xs text-[#68706b]">Estructura y consulta de la base de datos</p><div className="mt-5 overflow-hidden rounded-2xl border border-[#233a36] bg-[#122b28] p-4 font-[DM_Mono] text-[10px] leading-5"><p className="mb-2 text-[#789b91]">-- Definición de la tabla ventas</p>{queryLines.map(([green, white]) => <p key={green}><span className="text-[#91d4ae]">{green}</span><span className="text-[#e5efe9]">{white}</span></p>)}</div><div className="mt-4 rounded-2xl border border-[#d8d4cb] bg-[#fffdf8] p-4"><div className="flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-semibold"><FileCode2 size={16} className="text-[#b83a36]" /> Consulta ejecutada</p><span className="font-[DM_Mono] text-[9px] text-[#356e4e]">12 ms · 5 filas</span></div><p className="mt-3 rounded-lg bg-[#f1efe8] p-3 font-[DM_Mono] text-[10px] leading-5 text-[#285d50]"><span className="text-[#b83a36]">SELECT</span> * <span className="text-[#b83a36]">FROM</span> ventas <span className="text-[#b83a36]">ORDER BY</span> fecha_venta DESC;</p></div><div className="mt-4 rounded-2xl border border-[#d8d4cb] bg-[#fffdf8] p-4"><p className="mb-3 text-sm font-semibold">Campos validados</p>{[["codigo", "TEXT · clave primaria"], ["precio", "REAL · mayor que cero"], ["cantidad", "INTEGER · mayor que cero"], ["tipo", "boleta o factura"], ["fecha_venta", "TEXT · ISO recomendado"]].map(([field, value]) => <div key={field} className="flex items-center justify-between border-t border-[#ebe8e1] py-2 font-[DM_Mono] text-[9px]"><span className="text-[#173b36]">{field}</span><span className="text-[#68706b]">{value}</span></div>)}</div><div className="mt-4 rounded-2xl bg-[#e5f1e7] p-4"><p className="flex items-center gap-2 text-sm font-semibold text-[#245e3d]"><CheckCircle2 size={16} /> Diseño listo para sustentar</p><p className="mt-1 text-xs leading-5 text-[#416a50]">Las restricciones CHECK evitan cantidades, precios y tipos de comprobante inválidos desde la propia base de datos.</p></div></section>}
            <AnimatePresence>{pendingTab && <TabLoader label={tabCopy[pendingTab]} />}</AnimatePresence>
          </>}
        </div>
        <nav className="grid h-[84px] grid-cols-3 border-t border-[#d8d4cb] bg-[#fffdf8] px-3 pt-2">{([{ id: "registros", label: "Registros", Icon: ReceiptText }, { id: "logcat", label: "LogCat", Icon: TerminalSquare }, { id: "ranquery", label: "RanQuery", Icon: FileText }] as const).map(({ id, label, Icon }) => <button key={id} onClick={() => changeTab(id)} className={`flex flex-col items-center gap-1 rounded-xl pt-2 text-[10px] font-semibold transition ${tab === id ? "text-[#173b36]" : "text-[#8a918c]"}`}><span className={`grid h-7 w-12 place-items-center rounded-full ${tab === id ? "bg-[#d8e8d9]" : ""}`}><Icon size={18} /></span>{label}</button>)}</nav>
      </div>

      <section className="mt-8 max-w-sm lg:mt-0 lg:justify-self-start"><div className="border-l-2 border-[#eebc64] pl-5"><p className="font-[DM_Mono] text-[10px] uppercase tracking-[0.22em] text-[#638279]">Ficha de evaluación</p><h2 className="mt-3 font-[Roboto_Slab] text-2xl font-bold tracking-[-0.03em] text-[#173b36]">No solo enseña datos: explica el sistema.</h2></div><div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#d8d4cb] bg-[#d8d4cb]"><div className="bg-[#fffdf8] p-4"><CircleDollarSign size={17} className="text-[#b83a36]" /><p className="mt-5 font-[Roboto_Slab] text-xl font-bold">5</p><p className="text-xs text-[#68706b]">registros reales</p></div><div className="bg-[#fffdf8] p-4"><Database size={17} className="text-[#4f8578]" /><p className="mt-5 font-[Roboto_Slab] text-xl font-bold">100%</p><p className="text-xs text-[#68706b]">persistencia local</p></div></div><p className="mt-6 text-xs leading-5 text-[#68706b]">La aplicación mantiene una identidad limpia y profesional, pero cada decisión visual sirve para reforzar una idea técnica concreta.</p></section>
      </React.Fragment>
    </main>
  );
}
