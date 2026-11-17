/* ------------------------------------------------------------------
   Sector examples: how the services apply in a few industries.
   These are ILLUSTRATIVE SCENARIOS, not client case studies: no client
   names, no results claimed. Real cases go in track-record.ts.
------------------------------------------------------------------ */

export type SectorExample = {
  id: string;
  sector: string;
  title: string;
  situation: string;
  build: string;
  /** Service ids (see services.ts) that would be the natural first step. */
  startWith: string[];
};

export const sectorExamples: SectorExample[] = [
  {
    id: "manufacturing",
    sector: "Manufacturing",
    title: "A quality and maintenance copilot",
    situation:
      "Defect data, maintenance logs and operator notes live in separate systems, so finding a root cause or the reason OEE dropped takes days.",
    build:
      "Agents that pull MES, quality and maintenance history together, draft the root-cause analysis and suggest the next check. The engineer reviews and approves.",
    startWith: ["strategy", "prototype-sprint"],
  },
  {
    id: "professional-services",
    sector: "Professional services",
    title: "Drafting and review agents",
    situation:
      "Senior people spend hours on first drafts, clause checks and research that follow the same patterns every time.",
    build:
      "A multi-agent workflow on your own documents: one agent drafts, another checks against your playbook and risk rules, a person signs off. Runs in your own cloud, with data in the EU.",
    startWith: ["strategy", "design-build"],
  },
  {
    id: "retail",
    sector: "Retail & e-commerce",
    title: "Catalogue and customer agents",
    situation:
      "Product data is inconsistent across channels, and support answers the same questions again and again, in several languages.",
    build:
      "Agents that clean, enrich and translate product listings, and answer order and product questions in any language, handing over to a person when needed.",
    startWith: ["prototype-sprint"],
  },
];
