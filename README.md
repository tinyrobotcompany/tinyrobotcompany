# Tiny Robot Company · tinyrobotcompany.io

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.tinyrobotcompany.io&label=www.tinyrobotcompany.io&up_message=online&down_message=offline)](https://www.tinyrobotcompany.io)
[![CI](https://github.com/tinyrobotcompany/tinyrobotcompany/actions/workflows/ci.yml/badge.svg)](https://github.com/tinyrobotcompany/tinyrobotcompany/actions/workflows/ci.yml)
[![Deploy site](https://github.com/tinyrobotcompany/tinyrobotcompany/actions/workflows/deploy-site.yml/badge.svg?branch=main)](https://github.com/tinyrobotcompany/tinyrobotcompany/actions/workflows/deploy-site.yml)
[![Deploy infrastructure](https://github.com/tinyrobotcompany/tinyrobotcompany/actions/workflows/deploy-infrastructure.yml/badge.svg?branch=main)](https://github.com/tinyrobotcompany/tinyrobotcompany/actions/workflows/deploy-infrastructure.yml)
[![Last commit](https://img.shields.io/github/last-commit/tinyrobotcompany/tinyrobotcompany/main)](https://github.com/tinyrobotcompany/tinyrobotcompany/commits/main)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Azure Static Web Apps](https://img.shields.io/badge/hosted_on-Azure_Static_Web_Apps-0078D4?logo=microsoftazure&logoColor=white)](https://learn.microsoft.com/azure/static-web-apps/)
[![Bicep](https://img.shields.io/badge/IaC-Bicep-0078D4?logo=microsoftazure&logoColor=white)](infrastructure/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/)

The website of **Tiny Robot Company**, the independent AI studio of Simon Holmes, PhD: AI consulting,
architecture, hands-on build and training for companies, plus a bench of small machines and apps.

Live at **[www.tinyrobotcompany.io](https://www.tinyrobotcompany.io)**.

## What's on the site

| Route | What it is |
| --- | --- |
| `/` | Home: services and prices, track record, the bench (projects), about, contact |
| `/works/<slug>/` | One page per project: Pico Pie, Voxa, Déjà Groove, Tempo, Waveform One |
| `/log/` | Build notes (the Log), with an RSS feed at `/log/feed.xml` |
| `/log/<slug>/` | One page per post |
| `/join/` | One sign-up form for the app betas and the device waitlists (`?for=<slug>` preselects a product) |
| `/legal/` | Legal notice (placeholders until the company is registered) |
| `/privacy/` | Privacy policy |

## Getting started

Requires **Node.js 22**.

```bash
npm ci          # install exact dependency versions
npm run dev     # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates Next.js route types, then runs `tsc --noEmit` |
| `npm test` | Unit and content tests (Vitest) |
| `npm run test:watch` | Tests in watch mode |
| `node scripts/check-export.mjs out` | Checks every page the home page links to was exported |

> **Next.js 16** has breaking changes from earlier versions. Read the guides in
> `node_modules/next/dist/docs/` before changing framework code (see [`AGENTS.md`](AGENTS.md)).

## Editing content

Site facts live in data files, so each one is changed in a single place:

| File | Contents |
| --- | --- |
| [`app/data/site.ts`](app/data/site.ts) | Email, day rate, location, availability, socials, legal identity, capacity, and the switches for online services |
| [`app/data/services.ts`](app/data/services.ts) | The services, what each includes, and prices (derived from the day rate) |
| [`app/data/track-record.ts`](app/data/track-record.ts) | Career figures and client case studies (the section appears once a case study is added) |
| [`app/data/works.ts`](app/data/works.ts) | The bench projects, their pages and repos |
| [`app/data/sectors.ts`](app/data/sectors.ts) | Illustrative sector examples (not client cases) |
| [`app/data/log.ts`](app/data/log.ts) | Log posts: add new ones at the top; facts only from the project repos |

### Online services (off until configured)

Both fall back to a pre-filled email, so the site works before they're set up.

| Setting in `app/data/site.ts` | Turns on |
| --- | --- |
| `booking.url` and `booking.provider` | "Book a free intro call" opens a booking page (e.g. Cal.com) instead of an email |
| `signupForm.accessKey` | The `/join/` form sends through [Web3Forms](https://web3forms.com) instead of opening an email |

The privacy policy names these services automatically once they're set.

## Tests

Vitest covers:

- **Data:** services, works and prices.
- **Logic:** the sign-up form and the GitHub release lookup.
- **Rendering:** the legal, privacy and join pages, header and footer.
- **Content guards** ([`app/content.test.ts`](app/content.test.ts)): the former employer is never named, no personal contact details are published, no dead `#` links, external links open safely, and absolute URLs use `www`.

## CI/CD

| Workflow | Runs on | Steps |
| --- | --- | --- |
| [CI](.github/workflows/ci.yml) | Pull requests and pushes to non-`main` branches | Lint → type check → tests → build → export check |
| [Deploy site](.github/workflows/deploy-site.yml) | Push to `main`, weekly (Mondays 06:00 UTC, to refresh release versions), manual | Tests → build → export check → deploy to Azure → smoke test of every live page |
| [Deploy infrastructure](.github/workflows/deploy-infrastructure.yml) | Push to `main` touching `infrastructure/**`, manual (what-if or deploy) | Bicep deployment |

The site is a **static export** (`output: "export"`), built in GitHub Actions and uploaded to Azure Static Web Apps
(Free tier) with `skip_app_build`. Routing, the 404 page and security headers are set in
[`public/staticwebapp.config.json`](public/staticwebapp.config.json). Azure access uses **OIDC**, so there are no
long-lived secrets in GitHub.

`main` is protected: changes go through a pull request, and the **Lint, test and build** check must pass.

## Infrastructure and domain

- Azure resources (resource group and Static Web App, West Europe) are defined in Bicep. See [`infrastructure/README.md`](infrastructure/README.md).
- `www.tinyrobotcompany.io` is the canonical address (CNAME to the Static Web App).
- The bare domain `tinyrobotcompany.io` is forwarded to `www` by the registrar (Spaceship). That forwarding drops the path, which is why every absolute link uses `www`.
- Email to `hello@tinyrobotcompany.io` is handled by Spaceship email forwarding.

## Project structure

```
app/
  components/      Shared UI (header/footer, sign-up form, visuals, theme toggle)
  data/            Site facts, services, track record, works
  lib/             GitHub release lookup, sign-up logic
  join/ legal/ log/ privacy/ works/[slug]/   Pages
infrastructure/    Bicep for Azure
public/            Images, brand assets, Static Web Apps config
scripts/           Export check and post-deploy smoke test
```

## Licence

No licence file: © Tiny Robot Company, all rights reserved.
