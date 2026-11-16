/* ------------------------------------------------------------------
   Track record. Career figures are from the CV and approved for use
   anonymised: the former employer is never named.
------------------------------------------------------------------ */

export const FORMER_EMPLOYER = "a global automotive supplier";

export type Stat = { value: string; unit?: string; label: string };

export const stats: Stat[] = [
  { value: "€30M", unit: "+", label: "Measurable value delivered by industrial AI" },
  { value: "€10M", label: "Savings from multi-agent GenAI process automation" },
  { value: "~60", unit: "%", label: "Fewer false positives from AI quality control" },
  { value: "5→30", label: "Plants: AI in production at 5, rolling out to 30" },
  { value: "40", label: "Engineers, data scientists and architects led across France, China and India" },
  { value: "15", unit: "yrs", label: "Inside plant operations and finance: the business side of the factory floor" },
];

export type CaseStudy = {
  id: string;
  client: string; // anonymised, e.g. "Mid-size logistics company"
  industry: string;
  problem: string;
  outcome: string;
  /** One headline number, e.g. "-40% handling time". */
  metric?: string;
};

/**
 * Client case studies — placeholder. Empty for now; the "Case studies"
 * block renders only once this has entries. Add anonymised entries
 * here when they're ready.
 */
export const caseStudies: CaseStudy[] = [];
