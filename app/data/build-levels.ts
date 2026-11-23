/* ------------------------------------------------------------------
   Build rates by complexity. Advice and training are priced at the
   advisory day rate (DAY_RATE_EUR); building is priced by how hard the
   work is, and AI is what moves work up a level. Each phase of a
   project is priced at its own level, so the simple parts of a project
   never cost AI rates. Quotes are fixed prices: estimated days × rate.
------------------------------------------------------------------ */
import { euro } from "./site";

export type BuildLevel = {
  id: "simple" | "medium" | "complex";
  name: string;
  /** Day rate in euros, excl. VAT. min = max for a single rate. */
  min: number;
  max: number;
  summary: string;
  examples: string[];
};

export const buildLevels: BuildLevel[] = [
  {
    id: "simple",
    name: "Simple",
    min: 600,
    max: 600,
    summary: "Proven tools, a clear brief, no AI.",
    examples: [
      "Websites, landing pages and forms",
      "Internal tools and dashboards on data you already have",
      "One integration (payments, CRM, email) or an automation script",
      "A simple iOS or Android app: information, catalogue or forms, on a standard backend",
    ],
  },
  {
    id: "medium",
    name: "Medium",
    min: 800,
    max: 900,
    summary: "Real business logic, or AI as a helper whose output a person checks.",
    examples: [
      "Apps with accounts, roles, payments and several integrations",
      "Offline use, data sync and reporting",
      "Mobile apps with in-app purchases, push notifications, camera or maps",
      "AI features through a hosted model: summarise, classify, extract from documents",
      "Speech-to-text or translation from an off-the-shelf service",
    ],
  },
  {
    id: "complex",
    name: "Complex",
    min: 1000,
    max: 1200,
    summary: "AI at the core of the product or acting on its own, or sensitive data in production.",
    examples: [
      "Assistants that answer from your own documents, with access rights (RAG)",
      "Agents and multi-agent systems that call tools and take actions",
      "Real-time voice, computer vision or custom machine-learning models",
      "Mobile apps with live voice or image recognition, like Voxa and Déjà Groove",
      "Evals, guardrails and monitoring for production AI; regulated data; edge and hardware AI",
    ],
  },
];

/** What moves a rate from the bottom to the top of its range. */
export const BUILD_RANGE_NOTE =
  "Within a range, the rate depends on risk: sensitive data, older systems to connect to, or a tight deadline move it up.";

/** How a quote is put together. */
export const BUILD_PRICING_RULE =
  "Each phase of a project is priced at its own level, so the simple parts never cost AI rates. You get a fixed price per phase: estimated days × the level's rate.";

/** How iOS and Android apps are priced on top of their level. */
export const MOBILE_EXTRA_PLATFORM = "60–80%";
export const MOBILE_STORE_DAYS = "1–2 days";
export const BUILD_MOBILE_NOTE =
  `iOS and Android apps are priced at the level of their features. iOS is built natively in SwiftUI; a second platform adds about ${MOBILE_EXTRA_PLATFORM} of the first one's days. Publishing on the App Store or Google Play takes ${MOBILE_STORE_DAYS} per store, at the simple rate.`;

export const BUILD_FROM_EUR = Math.min(...buildLevels.map((l) => l.min));
export const BUILD_TO_EUR = Math.max(...buildLevels.map((l) => l.max));

/** "€600 / day" or "€800–900 / day". */
export const levelRate = (l: Pick<BuildLevel, "min" | "max">) =>
  l.min === l.max ? `${euro(l.min)} / day` : `${euro(l.min)}–${euro(l.max).replace("€", "")} / day`;

export const getLevel = (id: BuildLevel["id"]) => buildLevels.find((l) => l.id === id)!;
