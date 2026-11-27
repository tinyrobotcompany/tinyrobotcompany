# The Weekly Brief: production playbook

The Weekly Brief is Tiny Robot Company's weekly round-up of AI and robotics news, published as a
newsletter, a blog post, short videos hosted by Pico Pie (the red robot mascot) and a formal LinkedIn
post. A scheduled Claude task prepares each issue every Friday; Simon reviews and approves it before
anything is published. This file is the brief that task follows.

## Audience and promise

- **Who:** the curious general public, and managers and owners of small and mid-sized companies.
- **Promise:** the week's AI and robotics developments that actually matter, explained in plain English,
  and what they mean for a business. No hype, no jargon.
- **Language:** English.
- **Brand:** purely informational, branded Tiny Robot Company. Don't sell services or products in the
  content (a closing line pointing to the newsletter or the website is fine).

## Every piece mixes three things

1. **Recent news:** anchored on real stories from the last 7 days.
2. **Education:** one idea explained so a non-specialist gets it (a term, how something works, why it
   matters).
3. **Fun:** a light Pico Pie moment, a surprising fact or a playful line. Friendly, never silly about
   serious topics.

## Accuracy rules (non-negotiable)

- Research with web search every week; never rely on memory for news.
- Prefer primary sources: company announcements, papers, regulators, then reputable press. Check each
  story's date is within the last 7 days.
- Every claim in the newsletter and blog has a source; list the sources at the end.
- Separate fact from speculation ("announced", "claims", "expected"). No predictions presented as fact,
  no unverified numbers.
- Neutral on politics; for regulation, describe what it says and who it affects.

## Weekly schedule (Paris time)

| When | What | Where |
|---|---|---|
| Fri ~14:00 | Scheduled task prepares the issue | Claude session, notification to Simon |
| Fri evening – Sun noon | Simon reviews, asks for changes, writes "approved" | Same session |
| Mon 07:30 | Newsletter | MailerLite, group "Weekly Brief" |
| Mon 07:30 | Blog post | tinyrobotcompany.io/blog (PR merged on approval) |
| Mon 18:30 | Video 1 + Instagram carousel | TikTok, Instagram Reels, YouTube Shorts (Simon schedules) |
| Wed 16:00 | Formal post | LinkedIn company page (Simon schedules) |
| Wed 18:30 | Video 2 | TikTok, Instagram, YouTube Shorts (Simon schedules) |
| Sun 18:30 | Video 3 | TikTok, Instagram, YouTube Shorts (Simon schedules) |

Issue numbers: #1 is Monday 7 December 2026; add one per week.

## Deliverables for each issue

### 1. Newsletter (MailerLite draft)
- 3 to 5 stories. For each: a clear headline, **what happened** (2–3 sentences), **why it matters**
  (1–2 sentences), **what it means for your business** (1–2 practical sentences).
- Open with a 2-sentence intro; close with "One thing to try this week" (a small, practical action),
  then the sources.
- Subject: `Weekly Brief #N: <the biggest story in a few words>`; preheader of about 80 characters.
- Voice: Simon's. Clear, warm, plain English; about 5 minutes to read.
- Create it as a **draft regular campaign** to group "Weekly Brief", from hello@tinyrobotcompany.io,
  sender name "Tiny Robot Company". Never schedule or send without Simon's "approved".

### 2. Blog post (pull request)
- Same content as the newsletter, adapted for the web: a new entry at the **top** of `allPosts` in
  `app/data/blog.ts`, tag `"Weekly Brief"`, `works: []`, date = the Monday it goes out, slug
  `weekly-brief-<N>-<short-topic>`. Blocks: `p`, `h`, `list` (sources as a final list).
- Branch `weekly-brief/<N>`, run `npm test`, open a PR. Merge only after "approved".

### 3. Three Pico Pie videos (vertical, 35–45 s each)
- **Video 1 (Monday):** the week's biggest story, explained.
- **Video 2 (Wednesday):** "What this means for your business": one practical angle for SME leaders.
- **Video 3 (Sunday):** the light one: a robotics story, a myth-buster or a "did you know", still tied
  to that week's news.
- Each: a hook in the first 3 seconds, one idea, a Pico Pie moment, an ending that asks people to follow
  or points to the newsletter link in the bio.
- Write a storyboard JSON (see `storyboards/example-3-ai-terms.json` and the header of
  `render_video.py`), render a contact sheet with `--stills` at the busiest moments and **look at it**
  (no overlapping text, nothing below y=1500), then render the video.
- For each video also give: the voiceover script (matching the on-screen text, for text-to-speech in
  CapCut or Instagram), a caption, and 4–6 hashtags.

### 4. Instagram carousel (images)
- 6 to 8 slides (1080x1350) on the Monday story: a cover slide with the hook, 4 to 6 explanation slides,
  and a closing slide ("Follow @tinyrobotcompany / Weekly Brief newsletter link in bio").
- Write a carousel JSON (see `carousels/example-3-ai-terms.json` and the header of `render_carousel.py`),
  render it, open `contact-sheet.png` and check nothing overlaps, then send Simon every slide PNG in
  order, with an Instagram caption and 4–6 hashtags. A slide is read in about 3 seconds, so keep text short.

### 5. LinkedIn post (formal)
- Posted by the company, not by Pico Pie. Formal, measured, business-focused, **no emojis**, no hype.
- 120–200 words: the 2–3 developments most relevant to business leaders, their implications, and a link
  to the full brief on the blog.

## Review and approval

- Present everything in one message: the newsletter (link to the MailerLite draft and the full text), the
  blog PR link, the three videos (sent as files) with scripts and captions, the carousel slides (sent as
  files) with their caption, and the LinkedIn text.
- Simon replies with changes in the same session; revise and re-send only what changed.
- On **"approved"**: schedule the MailerLite campaign for Monday 07:30 Europe/Paris and merge the blog PR.
  Social posts are scheduled by Simon in each platform.
- Without approval, nothing is published.

## Setup

```bash
bash tools/weekly-brief/setup.sh            # once per machine: Python packages + brand fonts
python3 tools/weekly-brief/render_video.py tools/weekly-brief/storyboards/example-3-ai-terms.json tools/weekly-brief/out/test.mp4
```

Fonts are fetched into `tools/weekly-brief/.fonts/` and videos go to `tools/weekly-brief/out/`; both are ignored by git. Keep all work inside the project folder. Pico Pie is drawn from
`public/brand/mascot.svg`, so a change to the mascot shows up in the videos too.
