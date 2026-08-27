/**
 * Central threshold configuration. All sensor status badges and alerts derive
 * from this file — never scatter comparison logic across components.
 */
export const THRESHOLDS = {
  pH: {
    label: "pH",
    unit: "pH",
    decimals: 2,
    normal: [6.5, 8.5],
    warning: [6.0, 9.0],
  },
  tds: {
    label: "TDS",
    unit: "ppm",
    decimals: 0,
    normal: [0, 500],
    warning: [0, 900],
  },
  conductivity: {
    label: "Conductivity",
    unit: "µS/cm",
    decimals: 0,
    normal: [0, 800],
    warning: [0, 1200],
  },
  turbidity: {
    label: "Turbidity",
    unit: "NTU",
    decimals: 2,
    normal: [0, 5],
    warning: [0, 10],
  },
  temperature: {
    label: "Temperature",
    unit: "°C",
    decimals: 1,
    normal: [10, 35],
    warning: [5, 40],
  },
  flowRate: {
    label: "Flow Rate",
    unit: "L/min",
    decimals: 2,
    normal: [2, 6],
    warning: [1, 7],
  },
  pressure: {
    label: "Pressure",
    unit: "bar",
    decimals: 2,
    normal: [1.5, 3.2],
    warning: [1.0, 3.8],
  },
  batteryPercentage: {
    label: "Battery",
    unit: "%",
    decimals: 0,
    normal: [30, 100],
    warning: [15, 100],
  },
};

/**
 * @param {keyof typeof THRESHOLDS} key
 * @param {number} value
 * @returns {"normal"|"warning"|"critical"}
 */
export function getStatus(key, value) {
  const cfg = THRESHOLDS[key];
  if (!cfg || typeof value !== "number") return "normal";
  const [nMin, nMax] = cfg.normal;
  if (value >= nMin && value <= nMax) return "normal";
  const [wMin, wMax] = cfg.warning;
  if (value >= wMin && value <= wMax) return "warning";
  return "critical";
}

export const STATUS_COLOR = {
  normal: "#22c55e",
  warning: "#f59e0b",
  critical: "#ff4757",
};
