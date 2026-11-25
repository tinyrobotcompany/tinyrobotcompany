/* ------------------------------------------------------------------
   Weekly Brief newsletter sign-up. Pure functions, so they're easy to
   test; the form component only handles state and the network call.
------------------------------------------------------------------ */
import { newsletter } from "../data/site";

export type NewsletterValues = { name: string; email: string; consent: boolean };
export type NewsletterErrors = Partial<Record<"email" | "consent", string>>;

export const emptyNewsletter: NewsletterValues = { name: "", email: "", consent: false };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateNewsletter(v: NewsletterValues): NewsletterErrors {
  const errors: NewsletterErrors = {};
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (!v.consent) errors.consent = "Please confirm you'd like to receive the newsletter.";
  return errors;
}

/** MailerLite's public subscribe endpoint for an embedded form. */
export function newsletterEndpoint(accountId = newsletter.accountId, formId = newsletter.formId) {
  return `https://assets.mailerlite.com/jsonp/${accountId}/forms/${formId}/subscribe`;
}

/** Form-encoded body in the field names MailerLite's embedded forms use. */
export function newsletterBody(v: NewsletterValues) {
  const body = new URLSearchParams();
  body.set("fields[email]", v.email.trim());
  if (v.name.trim()) body.set("fields[name]", v.name.trim());
  body.set("ml-submit", "1");
  body.set("anticsrf", "true");
  return body;
}
