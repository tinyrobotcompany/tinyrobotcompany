/* ------------------------------------------------------------------
   One sign-up form for everything consumers can join: the device
   waitlists and the app betas. Pure functions, so they're easy to test;
   the form component only handles state and the network call.
------------------------------------------------------------------ */
import { mailto } from "../data/site";
import { fullName, type Work } from "../data/works";

export type SignupProduct = {
  slug: string;
  name: string;
  list: "beta" | "waitlist";
  /** What joining means, in a few words. */
  note: string;
};

export const INTERESTS = {
  buy: "Buy one when it's ready",
  kit: "Build one from a kit",
  news: "Just keep me posted",
} as const;
export type Interest = keyof typeof INTERESTS;

export type SignupValues = {
  products: string[];
  name: string;
  email: string;
  /** Apple ID email for TestFlight, only if different from `email`. */
  appleId: string;
  interest: Interest | "";
  message: string;
  consent: boolean;
};

export const emptySignup: SignupValues = {
  products: [],
  name: "",
  email: "",
  appleId: "",
  interest: "",
  message: "",
  consent: false,
};

export function signupProducts(works: Work[]): SignupProduct[] {
  return works.map((w) => ({
    slug: w.slug,
    name: fullName(w),
    list: w.beta ? "beta" : "waitlist",
    note: w.beta ? "iPhone beta on TestFlight" : `${w.stage}: join the waitlist`,
  }));
}

/** Pre-selects products from a query string like "?for=pico-pie" or "?for=voxa,tempo". */
export function productsFromQuery(search: string, products: SignupProduct[]): string[] {
  const wanted = (new URLSearchParams(search).get("for") ?? "").split(",").map((s) => s.trim());
  return products.filter((p) => wanted.includes(p.slug)).map((p) => p.slug);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupErrors = Partial<Record<"products" | "email" | "appleId" | "consent", string>>;

export function validateSignup(v: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  if (v.products.length === 0) errors.products = "Pick at least one product.";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Enter a valid email address.";
  if (v.appleId.trim() && !EMAIL_RE.test(v.appleId.trim())) errors.appleId = "Enter a valid Apple ID email, or leave it empty.";
  if (!v.consent) errors.consent = "Please confirm you're happy to be emailed about these.";
  return errors;
}

const picked = (v: SignupValues, products: SignupProduct[]) => products.filter((p) => v.products.includes(p.slug));

export const hasBeta = (v: SignupValues, products: SignupProduct[]) => picked(v, products).some((p) => p.list === "beta");
export const hasDevice = (v: SignupValues, products: SignupProduct[]) =>
  picked(v, products).some((p) => p.list === "waitlist");

function summary(v: SignupValues, products: SignupProduct[]) {
  const chosen = picked(v, products);
  return {
    subject: `Sign-up: ${chosen.map((p) => p.name).join(", ")}`,
    betas: chosen.filter((p) => p.list === "beta").map((p) => p.name).join(", ") || "-",
    waitlists: chosen.filter((p) => p.list === "waitlist").map((p) => p.name).join(", ") || "-",
  };
}

/** JSON body for the form backend (Web3Forms field names). */
export function signupPayload(v: SignupValues, products: SignupProduct[], accessKey: string) {
  const s = summary(v, products);
  return {
    access_key: accessKey,
    subject: s.subject,
    from_name: v.name.trim() || v.email.trim(),
    name: v.name.trim(),
    email: v.email.trim(),
    betas: s.betas,
    waitlists: s.waitlists,
    apple_id: v.appleId.trim() || (hasBeta(v, products) ? v.email.trim() : ""),
    interest: v.interest ? INTERESTS[v.interest] : "",
    message: v.message.trim(),
    consent: "Agreed to be emailed about these products",
  };
}

/** Fallback while no form backend is configured: the same details as a pre-filled email. */
export function signupMailto(v: SignupValues, products: SignupProduct[]) {
  const s = summary(v, products);
  const lines = [
    "Hi Simon,",
    "",
    `Please add me to: ${[s.betas, s.waitlists].filter((x) => x !== "-").join(", ")}`,
    "",
    `Name: ${v.name.trim()}`,
    `Email: ${v.email.trim()}`,
    hasBeta(v, products) ? `Apple ID for TestFlight: ${v.appleId.trim() || v.email.trim()}` : null,
    v.interest ? `Interested in: ${INTERESTS[v.interest]}` : null,
    v.message.trim() ? `\n${v.message.trim()}` : null,
  ].filter((l) => l !== null);
  return mailto(s.subject, lines.join("\n") + "\n");
}
