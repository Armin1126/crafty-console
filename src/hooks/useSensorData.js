import { useCallback, useEffect, useRef, useState } from "react";
import { getDataProvider } from "../data/index.js";

const HISTORY_LIMIT = 60;

/**
 * The only data entry point for dashboard components.
 * @returns {{data: import("../types/sensor.js").SensorData|null, history: Array, lastUpdated: number|null, secondsAgo: number, scenario: string, setScenario: (s: string) => void}}
 */
export function useSensorData() {
  const provider = getDataProvider();
  const [data, setData] = useState(() => provider.getCurrentSensorData());
  const [history, setHistory] = useState([]);
  const [scenario, setScenarioState] = useState("NOMINAL");
  const [secondsAgo, setSecondsAgo] = useState(0);
  const lastRef = useRef(Date.now());

  useEffect(() => {
    provider.start();
    const unsubscribe = provider.subscribeToSensorData((next) => {
      lastRef.current = next.timestamp;
      setData(next);
      setHistory((prev) => [...prev, next].slice(-HISTORY_LIMIT));
    });
    return () => {
      unsubscribe();
    };
  }, [provider]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsAgo(Math.max(0, Math.round((Date.now() - lastRef.current) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const setScenario = useCallback(
    (next) => {
      provider.setScenario(next);
      setScenarioState(next);
    },
    [provider],
  );

  return { data, history, lastUpdated: lastRef.current, secondsAgo, scenario, setScenario };
}
