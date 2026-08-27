import { Cpu, ShieldCheck, Activity, RefreshCw, CheckCircle2 } from "lucide-react";
import { Led, Stamp } from "../ui-industrial/Primitives.jsx";

function Tile({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-xl bg-tech p-5 shadow-card">
      <div className="flex items-center gap-2">
        <Icon strokeWidth={1.5} size={16} className="shrink-0 text-tech-dim" />
        <span className="stamp truncate text-[0.6rem] text-tech-dim">{label}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {tone ? <Led tone={tone} /> : null}
        <p className="stamp truncate text-sm text-white">{value}</p>
      </div>
    </div>
  );
}

export function SystemStatus({ data }) {
  const pass = data.verificationStatus === "PASS";
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-panel shadow-card">
          <Cpu strokeWidth={1.5} size={18} className="text-ink-muted" />
        </span>
        <h2 className="stamp text-sm text-ink">System Status</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Tile icon={Activity} label="Operational State" value="System Operational" tone="ok" />
        <Tile
          icon={Cpu}
          label="Sensors Online"
          value={`${data.sensorsOnline}/${data.sensorsTotal}`}
          tone="ok"
        />
        <Tile
          icon={ShieldCheck}
          label="Treatment Readiness"
          value={data.dispensingEnabled ? "Ready" : "Hold"}
          tone={data.dispensingEnabled ? "ok" : "warn"}
        />
        <Tile icon={RefreshCw} label="Current Cycle" value={`Cycle #${data.cycleNumber}`} />
        <Tile
          icon={CheckCircle2}
          label="Last Verification"
          value={pass ? "Pass" : "Fail"}
          tone={pass ? "ok" : "critical"}
        />
      </div>
      <Stamp className="mt-3 block text-[0.6rem]">Stage: {data.treatmentStage}</Stamp>
    </section>
  );
}
