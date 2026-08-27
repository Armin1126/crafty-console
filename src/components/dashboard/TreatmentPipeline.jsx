import { Radar, Brain, SlidersHorizontal, Filter, BadgeCheck, FlaskConical } from "lucide-react";
import { TREATMENT_STAGES } from "../../types/sensor.js";
import { SectionHeading, Stamp } from "../ui-industrial/Primitives.jsx";

const ICONS = {
  SENSE: Radar,
  ANALYZE: Brain,
  ADAPT: SlidersHorizontal,
  PURIFY: Filter,
  VERIFY: BadgeCheck,
};

export function TreatmentPipeline({ data }) {
  const activeIndex = TREATMENT_STAGES.indexOf(data.treatmentStage);

  return (
    <section>
      <SectionHeading
        title="Treatment Pipeline"
        subtitle="Adaptive treatment cycle"
        icon={FlaskConical}
      />
      <div className="rounded-2xl bg-panel p-6 shadow-card sm:p-8">
        <div className="relative grid grid-cols-1 gap-5 md:flex md:items-start md:gap-0">
          <span className="absolute left-[10%] right-[10%] top-6 hidden h-3 rounded-full bg-recessed shadow-recessed md:block" />
          {TREATMENT_STAGES.map((stage, i) => {
            const Icon = ICONS[stage];
            const active = i === activeIndex;
            const done = i < activeIndex;
            return (
              <div
                key={stage}
                className="relative flex items-center gap-4 md:flex-1 md:flex-col md:gap-3"
              >
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                    active
                      ? "bg-accent text-accent-foreground shadow-floating"
                      : done
                        ? "bg-panel shadow-card"
                        : "bg-chassis shadow-recessed"
                  }`}
                  style={active ? { boxShadow: "0 0 14px 3px rgba(255,71,87,0.5)" } : undefined}
                >
                  <Icon
                    strokeWidth={1.5}
                    size={20}
                    className={active ? "text-white" : "text-ink-muted"}
                  />
                </span>
                <div className="min-w-0 md:text-center">
                  <p className="stamp truncate text-[0.65rem] text-ink">{stage}</p>
                  <Stamp className="block text-[0.55rem]">
                    {active ? "Running" : done ? "Complete" : "Queued"}
                  </Stamp>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl bg-chassis p-5 shadow-recessed">
          <Stamp className="text-[0.6rem]">Active Treatment</Stamp>
          <p className="stamp mt-2 text-sm text-ink">{data.treatmentName}</p>
          <p className="mt-1 text-xs text-ink-muted">Reason: {data.treatmentReason}</p>
        </div>
      </div>
    </section>
  );
}
