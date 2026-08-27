import { MockDataProvider } from "./MockDataProvider.js";

/**
 * The single place where a provider implementation is chosen.
 * Swap this line for `new RestApiDataProvider(import.meta.env.VITE_API_URL)`
 * once the backend is live — no dashboard component changes required.
 */
let provider = null;

export function getDataProvider() {
  if (!provider) provider = new MockDataProvider("UNIT-001");
  return provider;
}

export const IS_MOCK_DATA = true;
