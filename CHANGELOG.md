# Changelog

What changed on [tinyrobotcompany.io](https://tinyrobotcompany.io), newest first.
Each version is also a [GitHub release](https://github.com/tinyrobotcompany/tinyrobotcompany/releases).

## v1.5.1 · 2026-11-27

- **Weekly Brief playbook:** the blog post is published on Monday at 07:25, just before the newsletter, instead of as soon as the issue is approved

## v1.5.0 · 2026-11-25

Weekly Brief production tools. Nothing changes on the site.

- **Playbook:** `tools/weekly-brief/README.md` sets the audience, the news / education / fun mix, accuracy rules, the weekly schedule, the deliverables and the approval step
- **Video renderer:** `render_video.py` turns a storyboard into a vertical Pico Pie video (1080×1920), drawn from the brand mascot
- **Setup:** `setup.sh` installs the Python packages and the brand fonts; an example storyboard is included

## v1.4.1 · 2026-11-25

- **Blog tests:** the check on old `/log/` redirects now covers only the 3 posts published before the rename, so adding a new post no longer fails the build

## v1.4.0 · 2026-11-25

The Weekly Brief newsletter.

- **Newsletter page:** `/newsletter/` with a sign-up form (first name optional, email, consent), sent to MailerLite with double opt-in
- **Blog:** a Weekly Brief sign-up box under the blog index and every post, and a "by email" link next to the RSS feed
- **Footer:** new "Newsletter" link
- **Privacy policy:** a new section on the newsletter and MailerLite; last updated 25 November 2026

## v1.3.0 · 2026-11-25

The Log is now the Blog.

- **Blog:** the build notes move from `/log/` to `/blog/`, and the menu, footer and project pages say "Blog"
- **RSS feed:** now at `/blog/feed.xml`
- **Redirects:** old `/log/` links and the old feed address redirect permanently (301) to their new addresses, so shared links and existing subscribers keep working

## v1.2.0 · 2026-11-24

AI adoption as a service.

- **AI adoption & training:** the training card becomes a full adoption offer: tool choice and rollout, an AI use policy (GDPR, EU AI Act), training for each team, champions and usage measured after 90 days
- **Adoption programme:** 6 days over 3 months for €9,000, next to the half-day workshop (€900) and full day (€1,500)
- **EU AI Act:** the card explains the AI-literacy duty in force since February 2025
- **Hero:** the intro now says "get their teams using it", and the chip reads "AI adoption"
- **Fractional head of AI:** now also leads AI adoption across the company

## v1.1.0 · 2026-11-23

Pricing by the work.

- **Build rates by complexity:** simple €600 / day, medium €800–900, complex AI €1,000–1,200; advice and training stay at €1,500 / day
- **How building is priced:** a new section defining each level with examples, the quoting rule, and how iOS and Android apps are priced
- **Rate card:** leads with "from €600 / day", the advice rate and fixed-price ways to start; links to the track record
- **Services:** 2-day diagnostic (€3,000), 2- and 4-week prototype sprints priced by complexity, training from €900 a half day, a 3-month minimum on the 4-day fractional tier

## v1.0.0 · 2026-11-18

The full launch: booking, sign-ups and the reworked offer.

- **Booking:** "Book a call" opens Cal.com, with the chosen service filled into the notes; email fallback when booking is off (#5, #8, #9)
- **Sign-ups:** waitlist and beta form for the apps and devices, sent through Web3Forms (#5, #8)
- **Services:** hero chips link straight to each service card (#9)
- **Headline:** "Small studio. Serious AI, built to work." with a new intro (#9)
- **Contact:** social icons in the contact panel (#9)
- **Projects:** status lines (works today, next, availability), "Where your data goes" notes for the apps, Pico Pie hidden for now (#8)
- **Images:** Tempo screens with personal details hidden; a Waveform One mock drawn from its CAD model and firmware (#9)
- **Log:** build notes from the projects (#7)
- **Sectors:** example use cases by sector; space for testimonials (#7)
- **Wording:** cloud-agnostic (AWS, Azure or Google Cloud), new projects from January 2027, one wording for languages (#8)
- **Mascot:** the labels around the logo animation are gone (#9)
- **Docs:** README rewritten as a project guide (#6)

## v0.2.0 · 2026-11-16

The offer and the real projects.

- **Services and prices:** a clear offer with day rates and fixed-price formats (#4)
- **Track record and legal:** track record section, legal notice and privacy policy (#4)
- **Tests:** content, data and link tests in CI, with a smoke test after each deploy (#4)
- **Projects:** placeholder projects replaced with the real ones (#3)

## v0.1.0 · 2026-09-08

The first site.

- **Hosting:** Azure Static Web Apps with CI/CD and brand assets
- **Mascot:** bounce, wobble, spin and expression cycling (#1)
- **Fixes:** text updates, contact email link and section formatting (#2)
