import { THRESHOLDS, getStatus } from "../config/waterQualityThresholds.js";

/**
 * Alerts are derived purely from live sensor values against the central
 * threshold config — never randomly generated.
 * @param {import("../types/sensor.js").SensorData|null} data
 */
export function deriveAlerts(data) {
  if (!data) return [];
  const alerts = [];

  for (const key of Object.keys(THRESHOLDS)) {
    const value = data[key];
    if (typeof value !== "number") continue;
    const status = getStatus(key, value);
    if (status === "normal") continue;
    const cfg = THRESHOLDS[key];
    alerts.push({
      id: `${key}-${status}`,
      severity: status,
      label: `${cfg.label} ${status === "critical" ? "critical" : "out of nominal band"}`,
      detail: `${value.toFixed(cfg.decimals)} ${cfg.unit} · nominal ${cfg.normal[0]}–${cfg.normal[1]} ${cfg.unit}`,
      timestamp: data.timestamp,
    });
  }

  if (data.verificationStatus === "FAIL") {
    alerts.push({
      id: "verification-fail",
      severity: "critical",
      label: "Verification failed — dispensing blocked",
      detail: `Cycle #${data.cycleNumber} did not meet potable criteria`,
      timestamp: data.timestamp,
    });
  }

  if (!data.solarCharging) {
    alerts.push({
      id: "solar-idle",
      severity: "warning",
      label: "Solar input below charging threshold",
      detail: `${data.solarPower.toFixed(1)} W · running on battery`,
      timestamp: data.timestamp,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "all-clear",
      severity: "normal",
      label: "All parameters within nominal range",
      detail: `Cycle #${data.cycleNumber} · ${data.sensorsOnline}/${data.sensorsTotal} sensors online`,
      timestamp: data.timestamp,
    });
  }

  return alerts;
}
