/* ------------------------------------------------------------------
   Services — what a company can hire Tiny Robot Company for. Advice and
   training derive from DAY_RATE_EUR; building derives from the build
   levels (build-levels.ts), priced by complexity.
------------------------------------------------------------------ */
import { booking, CONTACT_FIELDS, DAY_RATE_EUR, euro, introCallLink, mailto, type IntroCall } from "./site";
import { BUILD_FROM_EUR, buildLevels, getLevel, levelRate } from "./build-levels";

/** Half-day workshop: 60% of a day, since the preparation is the same. */
const HALF_DAY_EUR = 900;

/** Prototype sprints are AI work: priced from the bottom of medium to the top of complex. */
const SPRINT_RATE = { min: getLevel("medium").min, max: getLevel("complex").max };
const sprint = (weeks: number, days: number) => ({
  label: `${weeks} weeks · ${days} days`,
  eur: days * SPRINT_RATE.min,
  eurMax: days * SPRINT_RATE.max,
});

export type Price =
  | { kind: "package"; days: number }
  | { kind: "fixed"; eur: number; from?: boolean }
  | { kind: "day" }
  | { kind: "monthly"; daysPerMonth: number }
  | { kind: "build" }
  | { kind: "quote" };

/** One option on a card, e.g. "Half day · €900". Give a price in euros (a range with eurMax), or a short text. */
export type Tier = { label: string; eur?: number; eurMax?: number; text?: string };

export type Service = {
  id: string;
  /** Short category shown on the card label. */
  kind: "Consult" | "Build" | "Lead" | "Teach" | "Make";
  title: { lead: string; serif?: string };
  /** Short label for the hero chips, which jump to this card. */
  chip: string;
  /** Who it's for; reads after "For", so start lowercase unless it's a proper noun or acronym. */
  audience: string;
  summary: string;
  includes: string[];
  format: string;
  price: Price;
  /** Priced options shown on the card, cheapest first. */
  tiers?: Tier[];
};

export const services: Service[] = [
  {
    id: "strategy",
    chip: "AI strategy",
    kind: "Consult",
    title: { lead: "AI strategy &", serif: "opportunity map" },
    audience: "leadership teams in any industry",
    summary:
      "Find where AI actually pays in your business, and where it doesn't, before anyone writes code. Start with a short diagnostic, or go straight to the full map.",
    includes: [
      "Interviews and process walk-throughs with your teams",
      "Ranked use cases, each with a business case and risks",
      "GDPR and EU AI Act exposure, build vs. buy",
      "A 90-day roadmap you can act on",
      "Starter: one half-day workshop, three quick wins, a 5-page plan",
    ],
    format: "2 or 5 days",
    price: { kind: "fixed", eur: 2 * DAY_RATE_EUR, from: true },
    tiers: [
      { label: "Starter diagnostic · 2 days", eur: 2 * DAY_RATE_EUR },
      { label: "Full map · 5 days", eur: 5 * DAY_RATE_EUR },
    ],
  },
  {
    id: "architecture-review",
    chip: "Architecture review",
    kind: "Consult",
    title: { lead: "AI architecture", serif: "review" },
    audience: "CTOs of software companies and scale-ups, and investors doing due diligence",
    summary:
      "An independent review of an LLM, agent or ML system: is it secure, affordable, and ready for production?",
    includes: [
      "Architecture, data handling and security",
      "Cost, latency and model choices",
      "Evaluation, CI/CD and LLMOps practice",
      "Written report with prioritised fixes",
    ],
    format: "Fixed scope, 4 days",
    price: { kind: "package", days: 4 },
  },
  {
    id: "prototype-sprint",
    chip: "Prototype sprint",
    kind: "Build",
    title: { lead: "Prototype", serif: "sprint" },
    audience: "teams with a well-defined idea to prove",
    summary:
      "From brief to a working AI prototype in your environment in two to four weeks, with code you own. Priced by how complex the AI is.",
    includes: [
      "Scoping workshop and success criteria",
      "Working prototype on your data and cloud",
      "Demo to stakeholders, handover and docs",
      "A clear go / no-go and production plan",
    ],
    format: "2 or 4 weeks",
    price: { kind: "fixed", eur: sprint(2, 8).eur, from: true },
    tiers: [sprint(2, 8), sprint(4, 16)],
  },
  {
    id: "design-build",
    chip: "Design & build",
    kind: "Build",
    title: { lead: "Design &", serif: "build" },
    audience: "companies that need it built, not just advised",
    summary:
      "Hands-on design and coding, from a simple internal tool to agentic AI that plans, calls tools and acts across your workflows. Priced by complexity, so simple work never costs AI rates.",
    includes: [
      "Web and mobile apps (iOS and Android), internal tools and integrations",
      "Multi-agent orchestration, tool calling and MCP integrations",
      "Python, .NET, Next.js and SwiftUI",
      "Cloud-agnostic: AWS, Azure or Google Cloud, with infrastructure as code",
      "Evals, tests, CI/CD and monitoring from day one",
    ],
    format: "Fixed-price phases",
    price: { kind: "build" },
    tiers: buildLevels.map((l) => ({ label: l.id === "complex" ? `${l.name} (AI)` : l.name, text: levelRate(l) })),
  },
  {
    id: "fractional-lead",
    chip: "Fractional head of AI",
    kind: "Lead",
    title: { lead: "Fractional", serif: "head of AI" },
    audience: "organisations starting or scaling an AI function",
    summary:
      "Senior AI leadership without a full-time hire: strategy, standards, hiring and governance, a few days a month.",
    includes: [
      "AI strategy and investment cases for the board",
      "Engineering standards and platform choices",
      "Hiring, team set-up and vendor selection",
      "Governance and responsible-AI practice",
    ],
    format: "2 or 4 days a month",
    price: { kind: "monthly", daysPerMonth: 2 },
    tiers: [
      { label: "2 days a month", eur: 3000 },
      { label: "4 days a month · 3-month minimum", eur: 5500 },
    ],
  },
  {
    id: "education",
    chip: "Training",
    kind: "Teach",
    title: { lead: "AI education &", serif: "training" },
    audience: "executives, engineering teams, schools and universities",
    summary:
      "Clear, practical teaching, from a board-level briefing to hands-on workshops for the engineers doing the work.",
    includes: [
      "Executive briefings: what AI can and can't do for you",
      "Workshops: building with LLMs and agents, safely",
      "AI-assisted engineering with coding agents",
      "Talks and guest lectures, in English or French",
    ],
    format: "Half-day to multi-day",
    price: { kind: "fixed", eur: HALF_DAY_EUR, from: true },
    tiers: [
      { label: "Half day", eur: HALF_DAY_EUR },
      { label: "Full day", eur: DAY_RATE_EUR },
    ],
  },
  {
    id: "hardware",
    chip: "Hardware",
    kind: "Make",
    title: { lead: "Hardware &", serif: "edge AI prototypes" },
    audience: "product teams, museums, events and retail",
    summary:
      "Small devices that think: embedded electronics with voice, vision or sensors, from one-off installations to small batches.",
    includes: [
      "ESP32-class firmware and companion apps",
      "Voice, vision and sensor prototypes",
      "Interactive installations and exhibits",
      "3D-printed enclosures and small-batch builds",
    ],
    format: "Priced per prototype",
    price: { kind: "quote" },
  },
];

export function priceLabel(price: Price): string {
  switch (price.kind) {
    case "package":
      return `From ${euro(price.days * DAY_RATE_EUR)}`;
    case "fixed":
      return `${price.from ? "From " : ""}${euro(price.eur)}`;
    case "day":
      return `${euro(DAY_RATE_EUR)} / day`;
    case "monthly":
      return `From ${euro(price.daysPerMonth * DAY_RATE_EUR)} / month`;
    case "build":
      return `From ${euro(BUILD_FROM_EUR)} / day`;
    case "quote":
      return "Fixed price";
  }
}

/** The fixed-price ways to start, shown first on the rate card. Each points at a tier above. */
const STARTERS = [
  { label: "Workshop", detail: "Half day", service: "education", tier: "Half day" },
  { label: "Diagnostic", detail: "2 days", service: "strategy", tier: "Starter diagnostic · 2 days" },
  { label: "Prototype", detail: "2 weeks", service: "prototype-sprint", tier: "2 weeks · 8 days" },
] as const;

export type Starter = { label: string; detail: string; eur: number; from: boolean; anchor: string };

export const starters: Starter[] = STARTERS.map((x) => {
  const service = services.find((s) => s.id === x.service);
  const tier = service?.tiers?.find((t) => t.label === x.tier);
  if (!service || tier?.eur === undefined) throw new Error(`Rate card starter not found: ${x.service} / ${x.tier}`);
  return { label: x.label, detail: x.detail, eur: tier.eur, from: tier.eurMax !== undefined, anchor: `service-${service.id}` };
});

/** A tier's price as shown on the card. */
export const tierValue = (t: Tier) =>
  t.eur === undefined
    ? (t.text ?? "")
    : t.eurMax === undefined
      ? euro(t.eur)
      : `${euro(t.eur)}–${euro(t.eurMax).replace("€", "")}`;

export const serviceTitle = (s: Service) => (s.title.serif ? `${s.title.lead} ${s.title.serif}` : s.title.lead);

export const serviceEnquiry = (s: Service) =>
  mailto(
    `Enquiry: ${serviceTitle(s)}`,
    `Hi Simon,\n\nI'm interested in "${serviceTitle(s)}".\n\n${CONTACT_FIELDS}\nWhat we're trying to do:\nTimeline:\n`,
  );

/** Anchor id of a service card, used by the hero chips. */
export const serviceAnchor = (s: Service) => `service-${s.id}`;

/** Notes pre-filled in the booking form, so the visitor is reminded what they picked. */
export const serviceBookingNotes = (s: Service) =>
  `Interested in: ${serviceTitle(s)} (${s.format}, ${priceLabel(s.price).toLowerCase()})\n\nWhat we're trying to do:\n\nTimeline:\n`;

/** A service card's call to action: book a call about it, or email if booking is off. */
export function serviceCta(s: Service, url: string | null = booking.url): IntroCall {
  return url
    ? introCallLink(url, serviceBookingNotes(s))
    : { href: serviceEnquiry(s), external: false, label: "Enquire" };
}
