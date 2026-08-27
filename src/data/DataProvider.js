/**
 * DataProvider interface (documentation-only base class).
 *
 * Any provider — MockDataProvider today, RestApiDataProvider tomorrow —
 * must implement these five methods. Components never import a provider
 * directly; they use the useSensorData() hook.
 */
export class DataProvider {
  /** @returns {import("../types/sensor.js").SensorData|null} */
  getCurrentSensorData() {
    throw new Error("not implemented");
  }

  /**
   * @param {(data: import("../types/sensor.js").SensorData) => void} callback
   * @returns {() => void} unsubscribe
   */
  // eslint-disable-next-line no-unused-vars
  subscribeToSensorData(callback) {
    throw new Error("not implemented");
  }

  start() {
    throw new Error("not implemented");
  }

  stop() {
    throw new Error("not implemented");
  }

  /** @param {string} scenario */
  // eslint-disable-next-line no-unused-vars
  setScenario(scenario) {
    throw new Error("not implemented");
  }
}
