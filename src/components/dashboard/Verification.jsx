import { BadgeCheck, Droplets } from "lucide-react";
import { Led, SectionHeading, Stamp } from "../ui-industrial/Primitives.jsx";

function Slot({ label, value, unit }) {
  return (
    <div className="rounded-lg bg-chassis px-4 py-3 shadow-recessed">
      <Stamp className="block text-[0.55rem]">{label}</Stamp>
      <p className="mt-1 font-mono text-xl font-bold tabular-nums text-ink">
        {value} <span className="stamp text-[0.55rem]">{unit}</span>
      </p>
    </div>
  );
}

export function Verification({ data }) {
  const pass = data.verificationStatus === "PASS";
  const pct = (a, b) => (a === 0 ? 0 : Math.round(((a - b) / a) * 100));

  const rows = [
    { key: "pH", label: "pH", d: 2 },
    { key: "tds", label: "TDS (ppm)", d: 0 },
    { key: "turbidity", label: "Turbidity (NTU)", d: 2 },
    { key: "conductivity", label: "Conductivity (µS/cm)", d: 0 },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <SectionHeading title="Water Verification" subtitle="Post-treatment gate" icon={BadgeCheck} />
        <div className="rounded-2xl bg-panel p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-3">
            <Led tone={pass ? "ok" : "critical"} />
            <p className="stamp text-base text-ink">
              Verification {pass ? "Passed" : "Failed"}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Slot label="Cycle" value={`#${data.cycleNumber}`} unit="" />
            <Slot
              label="Dispensing"
              value={data.dispensingEnabled ? "ENABLED" : "BLOCKED"}
              unit=""
            />
            <Slot label="Incoming Turbidity" value={data.incoming.turbidity.toFixed(2)} unit="NTU" />
            <Slot label="Treated Turbidity" value={data.turbidity.toFixed(2)} unit="NTU" />
          </div>
        </div>
      </div>

      <div>
        <SectionHeading
          title="Before / After"
          subtitle="Incoming vs treated water"
          icon={Droplets}
        />
        <div className="rounded-2xl bg-panel p-6 shadow-card sm:p-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-x-3 gap-y-3">
            <Stamp className="text-[0.55rem]">Metric</Stamp>
            <Stamp className="text-[0.55rem]">In</Stamp>
            <Stamp className="text-[0.55rem]">Out</Stamp>
            <Stamp className="text-[0.55rem]">Δ%</Stamp>
            {rows.map((r) => {
              const inc = data.incoming[r.key];
              const out = data[r.key];
              const improvement = r.key === "pH" ? null : pct(inc, out);
              return (
                <div key={r.key} className="contents">
                  <span className="min-w-0 truncate text-xs text-ink-muted">{r.label}</span>
                  <span className="font-mono text-xs tabular-nums text-ink-muted">
                    {inc.toFixed(r.d)}
                  </span>
                  <span className="font-mono text-xs font-bold tabular-nums text-ink">
                    {out.toFixed(r.d)}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-accent">
                    {improvement === null ? "—" : `${improvement}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
