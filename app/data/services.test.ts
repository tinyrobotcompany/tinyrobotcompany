import { describe, expect, it } from "vitest";
import { DAY_RATE_EUR } from "./site";
import { priceLabel, serviceEnquiry, serviceTitle, services } from "./services";

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

describe("enquiry emails", () => {
  it("ask for a phone number and the preferred way to be contacted", async () => {
    const { INTRO_CALL } = await import("./site");
    const { enquiryMailto, works } = await import("./works");
    const hardware = works.filter((w) => !w.beta).map(enquiryMailto);
    for (const link of [INTRO_CALL, ...services.map(serviceEnquiry), ...hardware]) {
      const body = decodeURIComponent(link.split("body=")[1] ?? "");
      expect(body).toContain("Phone");
      expect(body).toMatch(/Preferred way to reach me \(email \/ phone call \/ SMS \/ WhatsApp \/ Teams/);
    }
  });
});
