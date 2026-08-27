import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LineChart as ChartIcon } from "lucide-react";
import { SectionHeading } from "../ui-industrial/Primitives.jsx";

const axisStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  fill: "#a8b2d1",
  letterSpacing: "0.05em",
};

function Screen({ title, children }) {
  return (
    <div className="rounded-2xl bg-panel p-5 shadow-card sm:p-6">
      <p className="stamp mb-4 text-[0.65rem] text-ink">{title}</p>
      <div className="scanlines overflow-hidden rounded-xl bg-tech p-3 shadow-recessed">
        <div className="h-64 w-full">{children}</div>
      </div>
    </div>
  );
}

function timeLabel(ts) {
  const d = new Date(ts);
  return `${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function Frame({ data, series, yUnits }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
        <CartesianGrid stroke="rgba(168,178,209,0.15)" />
        <XAxis dataKey="t" tick={axisStyle} stroke="#4a5568" minTickGap={28} />
        <YAxis tick={axisStyle} stroke="#4a5568" width={48} label={undefined} />
        <Tooltip
          contentStyle={{
            background: "#2c3e50",
            border: "1px solid #4a5568",
            borderRadius: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#ffffff",
          }}
          labelStyle={{ color: "#a8b2d1" }}
        />
        <Legend wrapperStyle={{ ...axisStyle, paddingTop: 6 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={`${s.name}${yUnits ? "" : ""}`}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Charts({ history }) {
  const rows = history.map((h) => ({
    t: timeLabel(h.timestamp),
    pH: h.pH,
    tds: h.tds,
    turbidity: h.turbidity,
    flowRate: h.flowRate,
    pressure: h.pressure,
    temperature: h.temperature,
    solarPower: h.solarPower,
    batteryPercentage: h.batteryPercentage,
  }));

  return (
    <section>
      <SectionHeading title="Live Charts" subtitle="Rolling 60-reading window" icon={ChartIcon} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Screen title="Water Quality Trend (pH / TDS / Turbidity)">
          <Frame
            data={rows}
            series={[
              { key: "pH", name: "pH", color: "#ff4757" },
              { key: "tds", name: "TDS ppm", color: "#22c55e" },
              { key: "turbidity", name: "Turbidity NTU", color: "#a8b2d1" },
            ]}
          />
        </Screen>
        <Screen title="System Parameters (Flow / Pressure / Temp)">
          <Frame
            data={rows}
            series={[
              { key: "flowRate", name: "Flow L/min", color: "#ff4757" },
              { key: "pressure", name: "Pressure bar", color: "#f59e0b" },
              { key: "temperature", name: "Temp °C", color: "#a8b2d1" },
            ]}
          />
        </Screen>
        <Screen title="Energy (Solar Input / Battery)">
          <Frame
            data={rows}
            series={[
              { key: "solarPower", name: "Solar W", color: "#f59e0b" },
              { key: "batteryPercentage", name: "Battery %", color: "#22c55e" },
            ]}
          />
        </Screen>
      </div>
    </section>
  );
}
