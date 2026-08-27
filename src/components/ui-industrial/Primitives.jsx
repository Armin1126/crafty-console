/**
 * Shared Industrial Skeuomorphism primitives.
 * Light source: top-left 45deg. Highlights top/left, shadows bottom/right.
 */

export function Panel({ className = "", screws = false, children, ...rest }) {
  return (
    <div
      className={`relative rounded-2xl bg-panel p-6 shadow-card panel-lift sm:p-8 ${screws ? "screws" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Vents({ className = "" }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-5 rounded-full bg-recessed shadow-recessed" />
      ))}
    </div>
  );
}

export function Led({ tone = "ok", className = "" }) {
  const colors = {
    ok: ["#22c55e", "rgba(34,197,94,0.7)"],
    warn: ["#f59e0b", "rgba(245,158,11,0.7)"],
    critical: ["#ff4757", "rgba(255,71,87,0.6)"],
    idle: ["#a3b1c6", "rgba(163,177,198,0.5)"],
  };
  const [fill, glow] = colors[tone] || colors.idle;
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full ${className}`}
      style={{ backgroundColor: fill, boxShadow: `0 0 10px 2px ${glow}` }}
    />
  );
}

export function Stamp({ children, className = "" }) {
  return (
    <span className={`stamp text-[0.7rem] text-ink-muted ${className}`}>{children}</span>
  );
}

export function IconHousing({ icon: Icon, tone = "float", className = "" }) {
  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-panel ${
        tone === "recessed" ? "shadow-recessed" : "shadow-card"
      } ${className}`}
    >
      <Icon strokeWidth={1.5} className="h-4.5 w-4.5 text-ink-muted" size={18} />
    </span>
  );
}

export function Readout({ value, unit, className = "" }) {
  return (
    <div
      className={`flex items-baseline gap-1.5 rounded-lg bg-chassis px-4 py-3 shadow-recessed ${className}`}
    >
      <span className="font-mono text-3xl font-bold tabular-nums text-ink">
        {value}
      </span>
      <span className="stamp text-[0.65rem] text-ink-muted">{unit}</span>
    </div>
  );
}

export function KeyButton({ active = false, accent = false, className = "", children, ...rest }) {
  return (
    <button
      type="button"
      className={`press min-h-12 rounded-lg px-4 stamp text-[0.7rem] ${
        active ? "shadow-pressed" : "shadow-card"
      } ${accent ? "bg-accent text-accent-foreground" : "bg-panel text-ink-muted"} ${className}`}
      style={
        accent
          ? {
              boxShadow: active
                ? "inset 6px 6px 12px rgba(150,30,40,0.6), inset -6px -6px 12px rgba(255,140,150,0.5)"
                : "8px 8px 16px rgba(255,71,87,0.35), -8px -8px 16px #ffffff",
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </button>
  );
}

export function SectionHeading({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6 flex min-w-0 items-center gap-3">
      {Icon ? <IconHousing icon={Icon} /> : null}
      <div className="min-w-0">
        <h2 className="stamp truncate text-sm text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const tone = status === "normal" ? "ok" : status === "warning" ? "warn" : "critical";
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-chassis px-2 py-1 shadow-recessed">
      <Led tone={tone} />
      <span className="stamp text-[0.6rem] text-ink-muted">{status}</span>
    </span>
  );
}
