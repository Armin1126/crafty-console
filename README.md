# W.I.S.E — WATER INTELLIGENCE & SURVEILLANCE ENGINE

Frontend live monitoring and surveillance console for a portable water purification and
quality-monitoring unit (UNIT-001), styled as an industrial control panel.

## Run

```bash
bun install   # or npm install
bun run dev   # http://localhost:8080
```

## Data architecture

Components never fetch or generate data. Everything flows through one abstraction:

```
Dashboard → useSensorData() → DataProvider interface → MockDataProvider (now)
                                                     → RestApiDataProvider (later)
```

| File | Role |
| --- | --- |
| `src/types/sensor.js` | `SensorData` JSDoc typedef, stage + scenario constants |
| `src/config/waterQualityThresholds.js` | Central normal/warning/critical thresholds + `getStatus()` |
| `src/data/DataProvider.js` | Interface: `getCurrentSensorData`, `subscribeToSensorData`, `start`, `stop`, `setScenario` |
| `src/data/MockDataProvider.js` | Simulated telemetry: baseline + small continuous drift each 2s tick |
| `src/data/index.js` | The **only** place a provider implementation is chosen |
| `src/hooks/useSensorData.js` | Public hook: current reading, rolling 60-reading history, seconds-since-update, scenario control |
| `src/lib/deriveAlerts.js` | Alerts derived strictly from thresholds |

### Swapping in the real backend

Create `src/data/RestApiDataProvider.js`:

```js
import { DataProvider } from "./DataProvider.js";

export class RestApiDataProvider extends DataProvider {
  constructor(baseUrl, deviceId = "UNIT-001") {
    super();
    this.baseUrl = baseUrl;
    this.deviceId = deviceId;
    this.subscribers = new Set();
    this.current = null;
    this.timer = null;
  }

  async #poll() {
    const res = await fetch(`${this.baseUrl}/devices/${this.deviceId}/readings/latest`);
    if (!res.ok) return;
    this.current = await res.json(); // must match the SensorData shape
    this.subscribers.forEach((cb) => cb(this.current));
  }

  getCurrentSensorData() { return this.current; }
  subscribeToSensorData(cb) { this.subscribers.add(cb); return () => this.subscribers.delete(cb); }
  start() { if (!this.timer) { this.#poll(); this.timer = setInterval(() => this.#poll(), 2000); } }
  stop() { clearInterval(this.timer); this.timer = null; }
  setScenario(scenario) {
    fetch(`${this.baseUrl}/devices/${this.deviceId}/scenario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario }),
    });
  }
}
```

Then change **one file** — `src/data/index.js`:

```js
import { RestApiDataProvider } from "./RestApiDataProvider.js";

export function getDataProvider() {
  if (!provider) provider = new RestApiDataProvider(import.meta.env.VITE_API_URL);
  return provider;
}

export const IS_MOCK_DATA = false; // hides the demo-mode banner
```

No dashboard component changes are required.

## Design system

Industrial skeuomorphism, light mode only, top-left 45° light source. Tokens and
neumorphic shadow utilities (`shadow-card`, `shadow-floating`, `shadow-pressed`,
`shadow-recessed`, `press`, `panel-lift`, `screws`, `scanlines`, `stamp`) live in
`src/styles.css`. Inter for UI text, JetBrains Mono for every numeric readout and
uppercase status label.
