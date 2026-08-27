import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JavaScript component (project is authored in JS)
import { Dashboard } from "../components/dashboard/Dashboard.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Water Monitor — UNIT-001 Live Dashboard" },
      {
        name: "description",
        content:
          "Live monitoring console for a portable water purification unit: pH, TDS, turbidity, flow, treatment pipeline and solar energy telemetry.",
      },
      { property: "og:title", content: "Smart Water Monitor — UNIT-001 Live Dashboard" },
      {
        property: "og:description",
        content:
          "Industrial control-panel dashboard tracking water quality, treatment cycles and energy for a portable purification unit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
