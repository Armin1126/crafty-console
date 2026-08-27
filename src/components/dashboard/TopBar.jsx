import { Radio } from "lucide-react";
import { Led, Stamp, IconHousing } from "../ui-industrial/Primitives.jsx";

export function TopBar({ deviceId, secondsAgo }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl bg-panel p-5 shadow-card sm:flex sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-center gap-3">
        <IconHousing icon={Radio} />
        <div className="min-w-0">
          <h1 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            Monitoring Dashboard
          </h1>
          <Stamp className="block">{deviceId} · Portable Treatment Unit</Stamp>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="inline-flex items-center gap-2 rounded bg-chassis px-3 py-1.5 shadow-recessed">
          <Led tone="critical" />
          <Stamp className="text-[0.6rem]">Live</Stamp>
        </span>
        <Stamp className="text-[0.6rem]">Last updated: {secondsAgo}s ago</Stamp>
      </div>
    </header>
  );
}
