import { Sun, BatteryCharging, Zap } from "lucide-react";
import { SectionHeading, Stamp, Led } from "../ui-industrial/Primitives.jsx";

function Meter({ icon: Icon, label, value, unit, tone, sub }) {
  return (
    <article className="screws panel-lift relative rounded-2xl bg-panel p-6 pt-9 shadow-card">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-chassis shadow-recessed">
          <Icon strokeWidth={1.5} size={18} className="text-ink-muted" />
        </span>
        <p className="stamp min-w-0 flex-1 truncate text-[0.65rem] text-ink">{label}</p>
        <Led tone={tone} />
      </div>
      <div className="mt-4 flex items-baseline gap-2 rounded-lg bg-chassis px-4 py-3 shadow-recessed">
        <span className="font-mono text-3xl font-bold tabular-nums text-ink">{value}</span>
        <span className="stamp text-[0.6rem]">{unit}</span>
      </div>
      <Stamp className="mt-3 block text-[0.55rem]">{sub}</Stamp>
    </article>
  );
}

export function Energy({ data }) {
  return (
    <section>
      <SectionHeading title="Energy & Hardware" subtitle="Solar + battery subsystem" icon={Zap} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <Meter
          icon={Sun}
          label="Solar Input"
          value={data.solarPower.toFixed(1)}
          unit="W"
          tone={data.solarCharging ? "ok" : "idle"}
          sub={data.solarCharging ? "Charging" : "Insufficient irradiance"}
        />
        <Meter
          icon={BatteryCharging}
          label="Battery"
          value={data.batteryPercentage.toFixed(0)}
          unit="%"
          tone={data.batteryPercentage > 30 ? "ok" : data.batteryPercentage > 15 ? "warn" : "critical"}
          sub={data.solarCharging ? "Trickle charging" : "Discharging"}
        />
        <Meter
          icon={Zap}
          label="Energy / Litre"
          value={data.energyPerLitre.toFixed(4)}
          unit="kWh/L"
          tone="ok"
          sub={`Flow ${data.flowRate.toFixed(2)} L/min`}
        />
      </div>
    </section>
  );
}
