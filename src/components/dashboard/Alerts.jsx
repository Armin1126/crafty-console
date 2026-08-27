import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck, RotateCcw } from "lucide-react";
import { KeyButton, Led, Stamp } from "../ui-industrial/Primitives.jsx";

const TONE = { normal: "ok", warning: "warn", critical: "critical" };
const STATE_TONE = { active: undefined, acknowledged: "warn", resolved: "idle" };
const FILTERS = ["active", "acknowledged", "resolved"];

/**
 * Notification bell for the top bar. Badge shows the number of active alerts
 * (newly derived alerts are active by default, so the count rises as they fire).
 * Clicking opens an industrial popover with the full alert workflow.
 */
export function AlertsBell({ workflow }) {
  const { alerts, counts, acknowledge, resolve, reopen } = workflow;
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("active");
  const rootRef = useRef(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const visible = alerts.filter((a) => a.state === filter);
  const hasCritical = alerts.some((a) => a.state === "active" && a.severity === "critical");

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Alerts, ${counts.active} active`}
        aria-expanded={open}
        className={`press relative grid h-11 w-11 place-items-center rounded-xl bg-panel text-ink-muted ${
          open ? "shadow-pressed" : "shadow-card"
        }`}
      >
        <Bell size={18} strokeWidth={2} />
        {counts.active > 0 && (
          <span
            className={`stamp absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full px-1 text-[0.6rem] ${
              hasCritical ? "bg-accent" : "bg-warn"
            } text-accent-foreground shadow-card`}
          >
            {counts.active}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-2xl bg-panel p-5 shadow-floating">
          <div className="mb-4 flex items-center justify-between gap-2">
            <Stamp className="text-[0.7rem] text-ink">Recent Alerts</Stamp>
            <Led tone={hasCritical ? "critical" : counts.active > 0 ? "warn" : "ok"} />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <KeyButton
                key={f}
                accent={f === filter}
                active={f === filter}
                onClick={() => setFilter(f)}
                className="min-h-9 px-3 text-[0.6rem]"
              >
                {f} · {counts[f]}
              </KeyButton>
            ))}
          </div>

          <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
            {visible.length === 0 && (
              <li className="rounded-lg bg-chassis px-4 py-6 text-center shadow-recessed">
                <Stamp className="text-[0.6rem]">No {filter} alerts</Stamp>
              </li>
            )}

            {visible.map((a) => {
              const actionable = a.severity !== "normal";
              return (
                <li
                  key={a.id}
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg bg-chassis px-4 py-3 shadow-recessed ${
                    a.state === "resolved" ? "opacity-60" : ""
                  }`}
                >
                  <Led tone={STATE_TONE[a.state] ?? TONE[a.severity]} />
                  <div className="min-w-0">
                    <p className="stamp truncate text-[0.62rem] text-ink">{a.label}</p>
                    <p className="mt-0.5 truncate font-mono text-[0.68rem] text-ink-muted">
                      {a.detail}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.6rem] text-ink-muted">
                      {new Date(a.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                      {a.stateChangedAt &&
                        ` · ${a.state} ${new Date(a.stateChangedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                    </p>
                    {actionable && (
                      <div className="mt-2">
                        {a.state === "active" && (
                          <KeyButton
                            onClick={() => acknowledge(a.id)}
                            aria-label={`Acknowledge ${a.label}`}
                            className="min-h-9 px-3 text-[0.6rem]"
                          >
                            <Check size={13} strokeWidth={2} className="inline" /> Ack
                          </KeyButton>
                        )}
                        {a.state === "acknowledged" && (
                          <KeyButton
                            onClick={() => resolve(a.id)}
                            aria-label={`Resolve ${a.label}`}
                            className="min-h-9 px-3 text-[0.6rem]"
                          >
                            <CheckCheck size={13} strokeWidth={2} className="inline" /> Resolve
                          </KeyButton>
                        )}
                        {a.state === "resolved" && (
                          <KeyButton
                            onClick={() => reopen(a.id)}
                            aria-label={`Reopen ${a.label}`}
                            className="min-h-9 px-3 text-[0.6rem]"
                          >
                            <RotateCcw size={13} strokeWidth={2} className="inline" /> Reopen
                          </KeyButton>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
