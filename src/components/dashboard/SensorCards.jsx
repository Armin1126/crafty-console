import {
  Droplet,
  Beaker,
  Waves,
  CloudDrizzle,
  Thermometer,
  Wind,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { THRESHOLDS, getStatus } from "../../config/waterQualityThresholds.js";
import { Vents, StatusBadge, SectionHeading } from "../ui-industrial/Primitives.jsx";

const SENSORS = [
  { key: "pH", icon: Droplet },
  { key: "tds", icon: Beaker },
  { key: "conductivity", icon: Waves },
  { key: "turbidity", icon: CloudDrizzle },
  { key: "temperature", icon: Thermometer },
  { key: "flowRate", icon: Wind },
  { key: "pressure", icon: Gauge },
];

function Trend({ delta }) {
  if (Math.abs(delta) < 1e-6)
    return <Minus strokeWidth={1.5} size={14} className="text-ink-muted" />;
  const Icon = delta > 0 ? ArrowUpRight : ArrowDownRight;
  return <Icon strokeWidth={1.5} size={14} className="text-accent" />;
}

export function SensorCards({ data, history, secondsAgo }) {
  const prev = history.length > 1 ? history[history.length - 2] : null;

  return (
    <section>
      <SectionHeading
        title="Water Quality"
        subtitle="Seven-channel sensor array"
        icon={Droplet}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {SENSORS.map(({ key, icon: Icon }) => {
          const cfg = THRESHOLDS[key];
          const value = data[key];
          const status = getStatus(key, value);
          const delta = prev ? value - prev[key] : 0;
          return (
            <article
              key={key}
              className="screws panel-lift relative rounded-2xl bg-panel p-6 pt-9 shadow-card"
            >
              <Vents className="absolute right-8 top-6" />
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-chassis shadow-recessed">
                  <Icon strokeWidth={1.5} size={18} className="text-ink-muted" />
                </span>
                <p className="stamp min-w-0 flex-1 truncate text-[0.65rem] text-ink">{cfg.label}</p>
              </div>

              <div className="mt-4 flex items-baseline gap-2 rounded-lg bg-chassis px-4 py-3 shadow-recessed">
                <span className="font-mono text-3xl font-bold tabular-nums text-ink">
                  {value.toFixed(cfg.decimals)}
                </span>
                <span className="stamp text-[0.6rem]">{cfg.unit}</span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <StatusBadge status={status} />
                <span className="flex items-center gap-1">
                  <Trend delta={delta} />
                  <span className="stamp text-[0.55rem]">
                    {delta >= 0 ? "+" : ""}
                    {delta.toFixed(cfg.decimals === 0 ? 0 : 2)}
                  </span>
                </span>
              </div>
              <p className="stamp mt-3 text-[0.55rem]">Updated {secondsAgo}s ago</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
