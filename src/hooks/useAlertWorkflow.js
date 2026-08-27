import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deriveAlerts } from "../lib/deriveAlerts.js";

const STORAGE_KEY = "wise.alert-workflow.v1";

/** Lifecycle states an operator can move an alert through. */
export const ALERT_STATES = ["active", "acknowledged", "resolved"];

function loadStates() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Alerts stay derived from live telemetry; this layer only tracks operator
 * acknowledgement / resolution per alert id, persisted locally.
 *
 * @param {import("../types/sensor.js").SensorData|null} data
 */
export function useAlertWorkflow(data) {
  const [states, setStates] = useState({});
  const hydrated = useRef(false);

  useEffect(() => {
    setStates(loadStates());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    } catch {
      /* storage unavailable — workflow stays in-memory */
    }
  }, [states]);

  const derived = useMemo(() => deriveAlerts(data), [data]);

  // Drop bookkeeping for conditions that have cleared on their own.
  useEffect(() => {
    if (!derived.length) return;
    const live = new Set(derived.map((a) => a.id));
    setStates((prev) => {
      const next = {};
      let changed = false;
      for (const [id, entry] of Object.entries(prev)) {
        if (live.has(id)) next[id] = entry;
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [derived]);

  const setState = useCallback((id, state) => {
    setStates((prev) => ({ ...prev, [id]: { state, at: Date.now() } }));
  }, []);

  const acknowledge = useCallback((id) => setState(id, "acknowledged"), [setState]);
  const resolve = useCallback((id) => setState(id, "resolved"), [setState]);
  const reopen = useCallback(
    (id) =>
      setStates((prev) => {
        const { [id]: _drop, ...rest } = prev;
        return rest;
      }),
    [],
  );

  const alerts = useMemo(
    () =>
      derived.map((a) => {
        const entry = states[a.id];
        return {
          ...a,
          state: a.severity === "normal" ? "active" : (entry?.state ?? "active"),
          stateChangedAt: entry?.at ?? null,
        };
      }),
    [derived, states],
  );

  const counts = useMemo(() => {
    const c = { active: 0, acknowledged: 0, resolved: 0 };
    for (const a of alerts) c[a.state] += 1;
    return c;
  }, [alerts]);

  return { alerts, counts, acknowledge, resolve, reopen };
}
