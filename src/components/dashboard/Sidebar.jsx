import { useState } from "react";
import { Droplets, Gauge, FlaskConical, Zap, Settings, Menu, X } from "lucide-react";
import { Led, Stamp } from "../ui-industrial/Primitives.jsx";

const NAV = [
  { label: "Dashboard", icon: Gauge, active: true },
  { label: "Water Quality", icon: Droplets },
  { label: "Treatment", icon: FlaskConical },
  { label: "Energy", icon: Zap },
  { label: "Settings", icon: Settings },
];

function NavList({ onPick }) {
  return (
    <nav className="flex flex-col gap-2">
      {NAV.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={onPick}
          disabled={!item.active}
          className={`press flex min-h-12 w-full items-center gap-3 rounded-lg px-4 text-left ${
            item.active ? "bg-chassis shadow-pressed" : "bg-panel shadow-card opacity-70"
          }`}
        >
          <item.icon strokeWidth={1.5} size={18} className="shrink-0 text-ink-muted" />
          <span className="stamp min-w-0 flex-1 truncate text-[0.7rem] text-ink">{item.label}</span>
          {!item.active && <Stamp className="text-[0.55rem]">Soon</Stamp>}
        </button>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-panel shadow-floating">
        <Droplets strokeWidth={1.5} size={20} className="text-accent" />
      </span>
      <div className="min-w-0">
        <p className="stamp truncate text-sm font-extrabold tracking-wider text-ink">W.I.S.E</p>
        <p className="stamp truncate text-[0.52rem] leading-tight text-accent">WATER INTELLIGENCE & SURVEILLANCE ENGINE</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="rounded-xl bg-chassis p-4 shadow-recessed">
      <p className="stamp text-[0.7rem] text-ink">UNIT-001</p>
      <p className="mt-1 text-[0.65rem] text-ink-muted">W.I.S.E Treatment Unit</p>
      <div className="mt-3 flex items-center gap-2">
        <Led tone="ok" />
        <Stamp className="text-[0.6rem]">Live Surveillance</Stamp>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between bg-chassis p-6 lg:flex">
        <div className="flex flex-col gap-8">
          <Brand />
          <NavList />
        </div>
        <Footer />
      </aside>

      {/* Mobile top nav */}
      <div className="sticky top-0 z-30 bg-chassis px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-panel p-3 shadow-card">
          <Brand />
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="press grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-panel shadow-card"
          >
            {open ? (
              <X strokeWidth={1.5} size={18} className="text-ink" />
            ) : (
              <Menu strokeWidth={1.5} size={18} className="text-ink" />
            )}
          </button>
        </div>
        {open && (
          <div className="mt-3 flex flex-col gap-4 rounded-xl bg-panel p-4 shadow-card">
            <NavList onPick={() => setOpen(false)} />
            <Footer />
          </div>
        )}
      </div>
    </>
  );
}
