import { describe, expect, it } from "vitest";
import { DAY_RATE_EUR } from "./site";
import { priceLabel, serviceAnchor, serviceCta, serviceEnquiry, serviceTitle, services, starters, tierValue } from "./services";

/** Normalise the narrow no-break spaces Intl may emit. */
const plain = (s: string) => s.replace(/\s/g, " ");

describe("services data", () => {
  it("has unique ids", () => {
    expect(new Set(services.map((s) => s.id)).size).toBe(services.length);
  });

  it("covers consulting, building, leadership, teaching and hardware", () => {
    expect(new Set(services.map((s) => s.kind))).toEqual(new Set(["Consult", "Build", "Lead", "Adopt", "Make"]));
  });

  it.each(services.map((s) => [s.id, s] as const))("%s is complete", (_id, s) => {
    expect(s.audience.length).toBeGreaterThan(5);
    expect(s.summary.length).toBeGreaterThan(20);
    expect(s.includes.length).toBeGreaterThanOrEqual(3);
    expect(s.format.length).toBeGreaterThan(0);
  });
});

describe("priceLabel", () => {
  it("derives package prices from the day rate", () => {
    expect(plain(priceLabel({ kind: "package", days: 4 }))).toBe(`From €${(4 * DAY_RATE_EUR).toLocaleString("en-IE")}`);
  });

  it("formats the day rate", () => {
    expect(plain(priceLabel({ kind: "day" }))).toBe("€1,500 / day");
  });

  it("formats monthly retainers", () => {
    expect(plain(priceLabel({ kind: "monthly", daysPerMonth: 2 }))).toBe("From €3,000 / month");
  });

  it("formats fixed prices, build rates and prototypes", () => {
    expect(plain(priceLabel({ kind: "fixed", eur: 3500 }))).toBe("€3,500");
    expect(plain(priceLabel({ kind: "fixed", eur: 3500, from: true }))).toBe("From €3,500");
    expect(plain(priceLabel({ kind: "build" }))).toBe("From €600 / day");
    expect(priceLabel({ kind: "quote" })).toBe("Fixed price");
  });

  it("matches the advertised prices", () => {
    const byId = Object.fromEntries(services.map((s) => [s.id, plain(priceLabel(s.price))]));
    expect(byId).toEqual({
      strategy: "From €3,000",
      "architecture-review": "From €6,000",
      "prototype-sprint": "From €6,400",
      "design-build": "From €600 / day",
      "fractional-lead": "From €3,000 / month",
      adoption: "From €900",
      hardware: "Fixed price",
    });
  });
});

describe("price tiers", () => {
  const tiered = services.filter((s) => s.tiers);

  it("list the options on each card", () => {
    const rows = Object.fromEntries(tiered.map((s) => [s.id, s.tiers!.map((t) => `${t.label}: ${plain(tierValue(t))}`)]));
    expect(rows).toEqual({
      strategy: ["Starter diagnostic · 2 days: €3,000", "Full map · 5 days: €7,500"],
      "prototype-sprint": ["2 weeks · 8 days: €6,400–9,600", "4 weeks · 16 days: €12,800–19,200"],
      "design-build": ["Simple: €600 / day", "Medium: €800–900 / day", "Complex (AI): €1,000–1,200 / day"],
      "fractional-lead": ["2 days a month: €3,000", "4 days a month · 3-month minimum: €5,500"],
      adoption: ["Half-day workshop: €900", "Full day: €1,500", "Adoption programme · 6 days: €9,000"],
    });
  });

  it("are cheapest first, and a 'from' price is the cheapest tier", () => {
    for (const s of tiered) {
      const eur = s.tiers!.flatMap((t) => (t.eur === undefined ? [] : [t.eur]));
      expect(eur, s.id).toEqual([...eur].sort((a, b) => a - b));
      if (eur.length) expect(plain(priceLabel(s.price)), s.id).toMatch(new RegExp(`^From ${plain(tierValue({ label: "", eur: eur[0] }))}( / month)?$`));
    }
  });

  it("each have a price or a text, and ranges go up", () => {
    for (const s of tiered)
      for (const t of s.tiers!) {
        expect((t.eur !== undefined) !== (t.text !== undefined), `${s.id} ${t.label}`).toBe(true);
        if (t.eurMax !== undefined) expect(t.eurMax).toBeGreaterThan(t.eur!);
      }
  });

  it("price advice and training at the advisory day rate", () => {
    const tier = (id: string, label: string) => services.find((s) => s.id === id)!.tiers!.find((t) => t.label === label)!.eur;
    expect(tier("adoption", "Full day")).toBe(DAY_RATE_EUR);
    expect(tier("adoption", "Adoption programme · 6 days")).toBe(6 * DAY_RATE_EUR);
    expect(tier("strategy", "Starter diagnostic · 2 days")).toBe(2 * DAY_RATE_EUR);
    expect(tier("strategy", "Full map · 5 days")).toBe(5 * DAY_RATE_EUR);
  });
});

describe("AI adoption", () => {
  it("is offered as its own service, linked from the hero", () => {
    const adoption = services.find((s) => s.id === "adoption")!;
    expect(adoption.chip).toBe("AI adoption");
    expect(serviceTitle(adoption)).toBe("AI adoption & training");
    expect(adoption.includes.join(" ")).toMatch(/rollout/);
    expect(adoption.includes.join(" ")).toMatch(/policy/);
    expect(adoption.summary).toMatch(/EU AI Act/);
  });

  it("is led by the fractional head of AI too", () => {
    expect(services.find((s) => s.id === "fractional-lead")!.includes).toContain("Leads AI adoption across the company");
  });
});

describe("rate card", () => {
  it("lists fixed-price ways to start", () => {
    expect(starters.map((x) => `${x.label}: ${x.detail} · ${x.from ? "from " : ""}${plain(tierValue({ label: "", eur: x.eur }))}`)).toEqual([
      "Workshop: Half day · €900",
      "Diagnostic: 2 days · €3,000",
      "Prototype: 2 weeks · from €6,400",
    ]);
  });

  it("links each starter to its service card", () => {
    const anchors = new Set(services.map(serviceAnchor));
    for (const x of starters) expect(anchors.has(x.anchor), x.anchor).toBe(true);
  });

  it("keeps the diagnostic small and puts a minimum on the discounted retainer", () => {
    const strategy = services.find((s) => s.id === "strategy")!;
    expect(strategy.includes).toContain("Starter: one half-day workshop, three quick wins, a 5-page plan");
    const fractional = services.find((s) => s.id === "fractional-lead")!;
    expect(fractional.tiers!.at(-1)!.label).toMatch(/3-month minimum/);
  });

  it("quotes the right track-record figures in the proof line", async () => {
    const { stats } = await import("./track-record");
    expect(stats[0].label).toMatch(/value delivered/i);
    expect(stats[1].label).toMatch(/^Savings/);
  });
});

describe("service enquiries", () => {
  it("prefill the subject with the service name", () => {
    for (const s of services) {
      const url = new URL(serviceEnquiry(s));
      expect(url.searchParams.get("subject")).toBe(`Enquiry: ${serviceTitle(s)}`);
    }
  });
});

describe("service calls to action", () => {
  it("have unique chip labels and anchors for the hero chips", () => {
    expect(new Set(services.map((s) => s.chip)).size).toBe(services.length);
    expect(new Set(services.map(serviceAnchor)).size).toBe(services.length);
    for (const s of services) expect(serviceAnchor(s)).toMatch(/^service-[a-z0-9-]+$/);
  });

  it("book a call with the service pre-filled in the notes when booking is on", () => {
    for (const s of services) {
      const cta = serviceCta(s, "https://cal.com/x/30min");
      expect(cta.external).toBe(true);
      const notes = new URL(cta.href).searchParams.get("notes") ?? "";
      expect(notes).toContain(`Interested in: ${serviceTitle(s)}`);
      expect(notes).toContain("What we're trying to do:");
    }
  });

  it("fall back to the enquiry email when booking is off", () => {
    for (const s of services) expect(serviceCta(s, null)).toEqual({ href: serviceEnquiry(s), external: false, label: "Enquire" });
  });
});

describe("enquiry emails", () => {
  it("ask for a phone number and the preferred way to be contacted", async () => {
    const { INTRO_CALL_MAILTO } = await import("./site");
    for (const link of [INTRO_CALL_MAILTO, ...services.map(serviceEnquiry)]) {
      const body = decodeURIComponent(link.split("body=")[1] ?? "");
      expect(body).toContain("Phone");
      expect(body).toMatch(/Preferred way to reach me \(email \/ phone call \/ SMS \/ WhatsApp \/ Teams/);
    }
  });
});

describe("sector examples", () => {
  it("start with services that exist, and claim no results", async () => {
    const { sectorExamples } = await import("./sectors");
    expect(sectorExamples.length).toBeGreaterThanOrEqual(3);
    const ids = new Set(services.map((s) => s.id));
    for (const x of sectorExamples) {
      for (const id of x.startWith) expect(ids.has(id), `${x.id} → ${id}`).toBe(true);
      // Illustrative only: no percentages, money or client claims.
      expect(`${x.situation} ${x.build}`).not.toMatch(/%|€|\$|client of|we helped|saved/i);
    }
  });
});
