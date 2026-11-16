/* ------------------------------------------------------------------
   Site-wide facts. Anything that appears in more than one place (rate,
   location, availability, links, legal identity) lives here so the
   ticker, status card, Studio panel and footer can never disagree.
------------------------------------------------------------------ */

export const EMAIL = "hello@tinyrobotcompany.io";

/** Consulting day rate in euros, excl. VAT. Package prices derive from it. */
export const DAY_RATE_EUR = 1500;

export const site = {
  name: "Tiny Robot Company",
  owner: "Simon Holmes, PhD",
  location: "Paris",
  travel: "Available to travel anywhere",
  availability: "Booking 2027",
  languages: ["English", "French"],
  /** Voxa translates everything, so enquiries are welcome in any language. */
  anyLanguage: "Write in any language",
} as const;

export type Social = { label: string; handle: string; href: string };

export const socials: Social[] = [
  { label: "LinkedIn", handle: "/in/simon-holmes-phd", href: "https://www.linkedin.com/in/simon-holmes-phd/" },
  { label: "GitHub", handle: "/tinyrobotcompany", href: "https://github.com/tinyrobotcompany" },
  { label: "YouTube", handle: "@tinyrobotcompany", href: "https://www.youtube.com/@tinyrobotcompany" },
  { label: "Instagram", handle: "@tinyrobotcompany", href: "https://www.instagram.com/tinyrobotcompany/" },
  { label: "TikTok", handle: "@tinyrobotcompany", href: "https://www.tiktok.com/@tinyrobotcompany" },
];

/**
 * Legal identity for the legal notice (mentions légales / Impressum).
 * The company is not registered yet: every `null` renders as a visible
 * "to be completed" placeholder. Fill these in once registration is done.
 */
export const legal = {
  publisher: "Simon Holmes",
  legalForm: null as string | null, // e.g. "SASU" or "Entrepreneur individuel (EI)"
  registration: null as string | null, // e.g. "RCS Paris 123 456 789" / SIREN
  vatNumber: null as string | null, // e.g. "FR12 123456789"
  shareCapital: null as string | null, // only for companies (e.g. SASU)
  address: null as string | null, // registered office
  publicationDirector: "Simon Holmes",
  email: EMAIL,
  host: {
    name: "Microsoft Ireland Operations Limited (Azure Static Web Apps)",
    address: "One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, D18 P521, Ireland",
  },
  lastUpdated: "2026-11-16",
};

export const euro = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const mailto = (subject: string, body?: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

/** Asked in every enquiry email, so the reply can come the way the sender prefers. */
export const CONTACT_FIELDS =
  "Name:\nCompany:\nPhone (optional):\nPreferred way to reach me (email / phone call / SMS / WhatsApp / Teams / Zoom / other):\n";

export const INTRO_CALL = mailto(
  "Intro call",
  `Hi Simon,\n\nI'd like to book a free 30-minute intro call.\n\n${CONTACT_FIELDS}\nWhat we're working on:\nA few times that suit me (with time zone):\n`,
);
