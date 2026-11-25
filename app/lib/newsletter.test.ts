import { describe, expect, it } from "vitest";
import { emptyNewsletter, newsletterBody, newsletterEndpoint, validateNewsletter } from "./newsletter";

describe("newsletter sign-up", () => {
  it("requires a valid email and consent", () => {
    expect(validateNewsletter(emptyNewsletter)).toEqual({
      email: expect.any(String),
      consent: expect.any(String),
    });
    expect(validateNewsletter({ name: "", email: "a@b.co", consent: true })).toEqual({});
    expect(validateNewsletter({ name: "", email: "not-an-email", consent: true }).email).toBeDefined();
  });

  it("posts to the MailerLite embedded-form endpoint", () => {
    expect(newsletterEndpoint("1", "2")).toBe("https://assets.mailerlite.com/jsonp/1/forms/2/subscribe");
  });

  it("sends trimmed fields and leaves out an empty name", () => {
    const body = newsletterBody({ name: "  ", email: " a@b.co ", consent: true });
    expect(body.get("fields[email]")).toBe("a@b.co");
    expect(body.has("fields[name]")).toBe(false);
    expect(body.get("ml-submit")).toBe("1");
    expect(newsletterBody({ name: " Ada ", email: "a@b.co", consent: true }).get("fields[name]")).toBe("Ada");
  });
});
