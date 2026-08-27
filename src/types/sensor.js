/**
 * @typedef {Object} SensorData
 * @property {number} timestamp
 * @property {string} deviceId
 * @property {number} pH
 * @property {number} tds
 * @property {number} conductivity
 * @property {number} turbidity
 * @property {number} temperature
 * @property {number} flowRate
 * @property {number} pressure
 * @property {number} batteryPercentage
 * @property {number} solarPower
 * @property {string} treatmentStage
 * @property {string} verificationStatus
 */

/**
 * @typedef {Object} DataProvider
 * @property {() => SensorData} getCurrentSensorData
 * @property {(cb: (data: SensorData) => void) => () => void} subscribeToSensorData
 * @property {() => void} start
 * @property {() => void} stop
 * @property {(scenario: string) => void} setScenario
 */

export const TREATMENT_STAGES = ["SENSE", "ANALYZE", "ADAPT", "PURIFY", "VERIFY"];

export const SCENARIOS = ["NOMINAL", "TURBID_INTAKE", "HIGH_TDS", "LOW_BATTERY"];
