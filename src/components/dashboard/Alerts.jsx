import { useState } from "react";
import { Bell, Check, CheckCheck, RotateCcw } from "lucide-react";
import { useAlertWorkflow } from "../../hooks/useAlertWorkflow.js";
import { KeyButton, Led, SectionHeading, Stamp } from "../ui-industrial/Primitives.jsx";

const TONE = { normal: "ok", warning: "warn", critical: "critical" };
const STATE_TONE = { active: undefined, acknowledged: "warn", resolved: "idle" };
const FILTERS = ["active", "acknowledged", "resolved"];

export function Alerts({ data }) {
  const { alerts, counts, acknowledge, resolve, reopen } = useAlertWorkflow(data);
  const [filter, setFilter] = useState("active");

  const visible = alerts.filter((a) => a.state === filter);

  return (
    <section>
      <SectionHeading title="Recent Alerts" subtitle="Threshold-derived events" icon={Bell} />
      <div className="rounded-2xl bg-panel p-6 shadow-card sm:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <KeyButton
              key={f}
              accent={f === filter}
              active={f === filter}
              onClick={() => setFilter(f)}
            >
              {f} · {counts[f]}
            </KeyButton>
          ))}
        </div>

        <ul className="flex flex-col gap-3">
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
                className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg bg-chassis px-4 py-3 shadow-recessed ${
                  a.state === "resolved" ? "opacity-60" : ""
                }`}
              >
                <Led tone={STATE_TONE[a.state] ?? TONE[a.severity]} />
                <div className="min-w-0">
                  <p className="stamp truncate text-[0.62rem] text-ink">{a.label}</p>
                  <p className="mt-0.5 truncate font-mono text-[0.68rem] text-ink-muted">
                    {a.detail}
                  </p>
                  {a.stateChangedAt && (
                    <p className="mt-0.5 font-mono text-[0.6rem] text-ink-muted">
                      {a.state} at{" "}
                      {new Date(a.stateChangedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Stamp className="hidden text-[0.55rem] sm:inline">
                    {new Date(a.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </Stamp>
                  {actionable && a.state === "active" && (
                    <KeyButton
                      onClick={() => acknowledge(a.id)}
                      aria-label={`Acknowledge ${a.label}`}
                    >
                      <Check size={13} strokeWidth={2} className="inline" /> Ack
                    </KeyButton>
                  )}
                  {actionable && a.state === "acknowledged" && (
                    <KeyButton onClick={() => resolve(a.id)} aria-label={`Resolve ${a.label}`}>
                      <CheckCheck size={13} strokeWidth={2} className="inline" /> Resolve
                    </KeyButton>
                  )}
                  {actionable && a.state === "resolved" && (
                    <KeyButton onClick={() => reopen(a.id)} aria-label={`Reopen ${a.label}`}>
                      <RotateCcw size={13} strokeWidth={2} className="inline" /> Reopen
                    </KeyButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
