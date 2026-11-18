/* ------------------------------------------------------------------
   Services — what a company can hire Tiny Robot Company for. Prices are
   derived from DAY_RATE_EUR so a rate change updates every package.
------------------------------------------------------------------ */
import { booking, CONTACT_FIELDS, DAY_RATE_EUR, euro, introCallLink, mailto, type IntroCall } from "./site";

export type Price =
  | { kind: "package"; days: number }
  | { kind: "day" }
  | { kind: "monthly"; daysPerMonth: number }
  | { kind: "quote" };

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
};

export const services: Service[] = [
  {
    id: "strategy",
    chip: "AI strategy",
    kind: "Consult",
    title: { lead: "AI strategy &", serif: "opportunity map" },
    audience: "leadership teams in any industry",
    summary:
      "Find where AI actually pays in your business, and where it doesn't, before anyone writes code.",
    includes: [
      "Interviews and process walk-throughs with your teams",
      "Ranked use cases, each with a business case and risks",
      "GDPR and EU AI Act exposure, build vs. buy",
      "A 90-day roadmap you can act on",
    ],
    format: "5 days over 2–3 weeks",
    price: { kind: "package", days: 5 },
  },
  {
    id: "architecture-review",
    chip: "Architecture review",
    kind: "Consult",
    title: { lead: "AI architecture", serif: "review" },
    audience: "CTOs, heads of AI, and investors doing due diligence",
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
      "From brief to a working AI prototype in your environment in four weeks, with code you own.",
    includes: [
      "Scoping workshop and success criteria",
      "Working prototype on your data and cloud",
      "Demo to stakeholders, handover and docs",
      "A clear go / no-go and production plan",
    ],
    format: "4 weeks",
    price: { kind: "package", days: 16 },
  },
  {
    id: "design-build",
    chip: "Design & build",
    kind: "Build",
    title: { lead: "Design &", serif: "build" },
    audience: "companies that need it built, not just advised",
    summary:
      "Hands-on design and coding of agentic AI: multi-agent systems that plan, call tools and act across your workflows, with the guardrails, evals and observability to run them in production.",
    includes: [
      "Multi-agent orchestration, tool calling and MCP integrations",
      "Python, .NET, Next.js and SwiftUI",
      "Cloud-agnostic: AWS, Azure or Google Cloud, with infrastructure as code",
      "Evals, tests, CI/CD and monitoring from day one",
    ],
    format: "Scoped per project",
    price: { kind: "day" },
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
    format: "From 2 days a month",
    price: { kind: "monthly", daysPerMonth: 2 },
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
    price: { kind: "day" },
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
    format: "Scoped per project",
    price: { kind: "quote" },
  },
];

export function priceLabel(price: Price): string {
  switch (price.kind) {
    case "package":
      return `From ${euro(price.days * DAY_RATE_EUR)}`;
    case "day":
      return `${euro(DAY_RATE_EUR)} / day`;
    case "monthly":
      return `From ${euro(price.daysPerMonth * DAY_RATE_EUR)} / month`;
    case "quote":
      return "Priced per project";
  }
}

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
