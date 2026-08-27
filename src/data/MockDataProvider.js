import { DataProvider } from "./DataProvider.js";
import { TREATMENT_STAGES } from "../types/sensor.js";
import { getStatus } from "../config/waterQualityThresholds.js";

const TICK_MS = 2000;

const BASELINES = {
  pH: { base: 7.2, drift: 0.05, min: 6.4, max: 8.2 },
  tds: { base: 430, drift: 10, min: 300, max: 1100 },
  conductivity: { base: 680, drift: 15, min: 450, max: 1500 },
  turbidity: { base: 2.5, drift: 0.5, min: 0.2, max: 18 },
  temperature: { base: 28, drift: 0.2, min: 20, max: 40 },
  flowRate: { base: 4.2, drift: 0.15, min: 0.5, max: 7 },
  pressure: { base: 2.4, drift: 0.1, min: 0.8, max: 4 },
};

/** Absolute target values per scenario; unlisted keys fall back to baseline. */
const SCENARIO_TARGETS = {
  NOMINAL: {},
  TURBID_INTAKE: { turbidity: 9.5, pressure: 2.05, flowRate: 3.1 },
  HIGH_TDS: { tds: 620, conductivity: 980, pH: 6.35 },
  LOW_BATTERY: { flowRate: 3.4 },
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Ornstein–Uhlenbeck-ish walk: small continuous drift back toward a target. */
function step(current, target, spec) {
  const pull = (target - current) * 0.25;
  const noise = (Math.random() - 0.5) * spec.drift * 0.6;
  return clamp(current + pull + noise, spec.min, spec.max);
}

export class MockDataProvider extends DataProvider {
  constructor(deviceId = "UNIT-001") {
    super();
    this.deviceId = deviceId;
    this.scenario = "NOMINAL";
    this.subscribers = new Set();
    this.timer = null;
    this.tickCount = 0;
    this.cycle = 1248;
    this.stageIndex = 0;
    this.battery = 82;
    this.current = null;

    this.values = {};
    for (const [k, spec] of Object.entries(BASELINES)) this.values[k] = spec.base;

    this.current = this.#build();
  }

  #targets() {
    const overrides = SCENARIO_TARGETS[this.scenario] || {};
    const t = {};
    for (const [k, spec] of Object.entries(BASELINES)) {
      t[k] = overrides[k] === undefined ? spec.base : overrides[k];
    }
    return t;
  }

  #solar() {
    // Simple day-cycle curve driven by local clock, with a slow demo oscillation.
    const now = new Date();
    const hours = now.getHours() + now.getMinutes() / 60;
    const daylight = Math.max(0, Math.sin(((hours - 6) / 12) * Math.PI));
    const ripple = 1 + 0.04 * Math.sin(this.tickCount / 6);
    return Math.round(daylight * 145 * ripple * 10) / 10;
  }

  #build() {
    const v = this.values;
    const solarPower = this.scenario === "LOW_BATTERY" ? 0 : this.#solar();
    const charging = solarPower > 12;
    this.battery = clamp(
      this.battery + (charging ? 0.035 : -0.045),
      this.scenario === "LOW_BATTERY" ? 8 : 12,
      100,
    );

    const incoming = {
      pH: clamp(v.pH - 0.55, 5.5, 9.5),
      tds: v.tds * 1.62,
      turbidity: v.turbidity * 4.4 + 3.2,
      conductivity: v.conductivity * 1.5,
    };

    const treatment = this.#treatment(v, incoming);
    const stage = TREATMENT_STAGES[this.stageIndex];
    const verificationPass =
      getStatus("turbidity", v.turbidity) !== "critical" &&
      getStatus("pH", v.pH) === "normal" &&
      getStatus("tds", v.tds) !== "critical";

    const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;

    return {
      timestamp: Date.now(),
      deviceId: this.deviceId,
      pH: round(v.pH, 2),
      tds: round(v.tds, 0),
      conductivity: round(v.conductivity, 0),
      turbidity: round(v.turbidity, 2),
      temperature: round(v.temperature, 1),
      flowRate: round(v.flowRate, 2),
      pressure: round(v.pressure, 2),
      batteryPercentage: round(this.battery, 0),
      solarPower: round(solarPower, 1),
      treatmentStage: stage,
      verificationStatus: verificationPass ? "PASS" : "FAIL",
      // Derived context used by the dashboard sections
      scenario: this.scenario,
      sensorsOnline: 7,
      sensorsTotal: 7,
      cycleNumber: this.cycle,
      treatmentName: treatment.name,
      treatmentReason: treatment.reason,
      dispensingEnabled: verificationPass,
      solarCharging: charging,
      energyPerLitre: round(
        (18 + (this.scenario === "TURBID_INTAKE" ? 7 : 0)) / 1000 / Math.max(0.5, v.flowRate / 4.2),
        4,
      ),
      incoming: {
        pH: round(incoming.pH, 2),
        tds: round(incoming.tds, 0),
        turbidity: round(incoming.turbidity, 2),
        conductivity: round(incoming.conductivity, 0),
      },
    };
  }

  #treatment(v, incoming) {
    if (incoming.turbidity > 12 || v.turbidity > 5)
      return {
        name: "COAGULATION + MULTI-STAGE FILTRATION",
        reason: "Incoming turbidity above sediment threshold",
      };
    if (v.tds > 500)
      return { name: "REVERSE OSMOSIS BOOST", reason: "Dissolved solids exceed potable limit" };
    if (v.pH < 6.5 || v.pH > 8.5)
      return { name: "pH CORRECTION DOSING", reason: "pH outside potable band" };
    return { name: "UV-C DISINFECTION + CARBON POLISH", reason: "Baseline potable maintenance" };
  }

  #tick() {
    this.tickCount += 1;
    const targets = this.#targets();
    for (const [k, spec] of Object.entries(BASELINES)) {
      this.values[k] = step(this.values[k], targets[k], spec);
    }
    this.stageIndex = (this.stageIndex + 1) % TREATMENT_STAGES.length;
    if (this.stageIndex === 0) this.cycle += 1;
    this.current = this.#build();
    for (const cb of this.subscribers) cb(this.current);
  }

  getCurrentSensorData() {
    return this.current;
  }

  subscribeToSensorData(callback) {
    this.subscribers.add(callback);
    if (this.current) callback(this.current);
    return () => this.subscribers.delete(callback);
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.#tick(), TICK_MS);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  setScenario(scenario) {
    this.scenario = scenario;
    if (scenario === "LOW_BATTERY") this.battery = Math.min(this.battery, 14);
  }
}
