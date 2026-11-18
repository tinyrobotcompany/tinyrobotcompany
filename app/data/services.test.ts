import { describe, expect, it } from "vitest";
import { DAY_RATE_EUR } from "./site";
import { priceLabel, serviceAnchor, serviceCta, serviceEnquiry, serviceTitle, services } from "./services";

/** Normalise the narrow no-break spaces Intl may emit. */
const plain = (s: string) => s.replace(/\s/g, " ");

describe("services data", () => {
  it("has unique ids", () => {
    expect(new Set(services.map((s) => s.id)).size).toBe(services.length);
  });

  it("covers consulting, building, leadership, teaching and hardware", () => {
    expect(new Set(services.map((s) => s.kind))).toEqual(new Set(["Consult", "Build", "Lead", "Teach", "Make"]));
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

  it("says when a price is quoted per project", () => {
    expect(priceLabel({ kind: "quote" })).toBe("Priced per project");
  });

  it("matches the advertised packages", () => {
    const byId = Object.fromEntries(services.map((s) => [s.id, plain(priceLabel(s.price))]));
    expect(byId["strategy"]).toBe("From €7,500");
    expect(byId["architecture-review"]).toBe("From €6,000");
    expect(byId["prototype-sprint"]).toBe("From €24,000");
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
