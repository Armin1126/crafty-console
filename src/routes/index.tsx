import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JavaScript component (project is authored in JS)
import { Dashboard } from "../components/dashboard/Dashboard.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "W.I.S.E — Water Intelligence & Surveillance Engine" },
      {
        name: "description",
        content:
          "W.I.S.E (Water Intelligence & Surveillance Engine) — Live telemetry and surveillance console for UNIT-001 portable water purification unit: pH, TDS, turbidity, flow, treatment pipeline and solar energy.",
      },
      { property: "og:title", content: "W.I.S.E — Water Intelligence & Surveillance Engine" },
      {
        property: "og:description",
        content:
          "W.I.S.E (Water Intelligence & Surveillance Engine) — Industrial control and surveillance console tracking water quality, treatment cycles and energy for portable purification units.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
