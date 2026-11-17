import { describe, expect, it } from "vitest";
import { works } from "../data/works";
import { introCallLink } from "../data/site";
import {
  emptySignup,
  hasBeta,
  hasDevice,
  productsFromQuery,
  signupMailto,
  signupPayload,
  signupProducts,
  validateSignup,
  type SignupValues,
} from "./signup";

const products = signupProducts(works);
const valid: SignupValues = { ...emptySignup, products: ["voxa", "tempo"], email: "ada@example.com", consent: true };

describe("sign-up products", () => {
  it("offers every app as a beta and every device as a waitlist", () => {
    expect(products.length).toBe(works.length);
    for (const w of works) {
      expect(products.find((p) => p.slug === w.slug)?.list).toBe(w.beta ? "beta" : "waitlist");
    }
  });

  it("pre-selects products from ?for=, ignoring unknown slugs", () => {
    expect(productsFromQuery("?for=tempo", products)).toEqual(["tempo"]);
    expect(productsFromQuery("?for=voxa,tempo,nope", products).sort()).toEqual(["tempo", "voxa"]);
    expect(productsFromQuery("", products)).toEqual([]);
  });

  it("knows which lists were picked", () => {
    expect(hasBeta(valid, products)).toBe(true);
    expect(hasDevice(valid, products)).toBe(true);
    expect(hasDevice({ ...valid, products: ["voxa"] }, products)).toBe(false);
  });
});

describe("validation", () => {
  it("accepts a complete sign-up", () => {
    expect(validateSignup(valid)).toEqual({});
  });

  it("requires a product, a valid email and consent", () => {
    const errors = validateSignup(emptySignup);
    expect(Object.keys(errors).sort()).toEqual(["consent", "email", "products"]);
    expect(validateSignup({ ...valid, email: "not-an-email" }).email).toBeDefined();
  });

  it("only checks the Apple ID when one is given", () => {
    expect(validateSignup({ ...valid, appleId: "" }).appleId).toBeUndefined();
    expect(validateSignup({ ...valid, appleId: "nope" }).appleId).toBeDefined();
  });
});

describe("submission", () => {
  it("sends betas and waitlists separately, with the access key", () => {
    const body = signupPayload({ ...valid, interest: "kit" }, products, "KEY");
    expect(body.access_key).toBe("KEY");
    expect(body.betas).toBe("Voxa");
    expect(body.waitlists).toBe("Tempo");
    expect(body.interest).toBe("Build one from a kit");
    expect(body.subject).toContain("Voxa");
  });

  it("uses the sign-up email as the Apple ID when none is given for a beta", () => {
    expect(signupPayload(valid, products, "KEY").apple_id).toBe("ada@example.com");
    expect(signupPayload({ ...valid, products: ["tempo"] }, products, "KEY").apple_id).toBe("");
  });

  it("falls back to a pre-filled email with the same details", () => {
    const url = new URL(signupMailto({ ...valid, name: "Ada" }, products));
    expect(url.protocol).toBe("mailto:");
    const body = url.searchParams.get("body") ?? "";
    expect(body).toContain("Hi Simon,\n\nPlease add me to: Voxa, Tempo");
    expect(body).toContain("Apple ID for TestFlight: ada@example.com");
  });
});

describe("intro call link", () => {
  it("uses the booking page when one is configured", () => {
    expect(introCallLink("https://cal.com/x/intro")).toMatchObject({ href: "https://cal.com/x/intro", external: true });
  });

  it("falls back to an email asking for phone and contact preference", () => {
    const link = introCallLink(null);
    expect(link.external).toBe(false);
    expect(decodeURIComponent(link.href)).toContain("Preferred way to reach me");
  });
});
