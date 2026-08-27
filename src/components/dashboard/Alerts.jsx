import { Bell } from "lucide-react";
import { deriveAlerts } from "../../lib/deriveAlerts.js";
import { Led, SectionHeading, Stamp } from "../ui-industrial/Primitives.jsx";

const TONE = { normal: "ok", warning: "warn", critical: "critical" };

export function Alerts({ data }) {
  const alerts = deriveAlerts(data);
  return (
    <section>
      <SectionHeading title="Recent Alerts" subtitle="Threshold-derived events" icon={Bell} />
      <div className="rounded-2xl bg-panel p-6 shadow-card sm:p-8">
        <ul className="flex flex-col gap-3">
          {alerts.map((a) => (
            <li
              key={a.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg bg-chassis px-4 py-3 shadow-recessed"
            >
              <Led tone={TONE[a.severity]} />
              <div className="min-w-0">
                <p className="stamp truncate text-[0.62rem] text-ink">{a.label}</p>
                <p className="mt-0.5 truncate font-mono text-[0.68rem] text-ink-muted">
                  {a.detail}
                </p>
              </div>
              <Stamp className="text-[0.55rem]">
                {new Date(a.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Stamp>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
