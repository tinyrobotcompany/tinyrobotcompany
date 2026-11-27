/* ------------------------------------------------------------------
   The blog: build notes from the bench. Every fact in these posts comes
   from the project repositories (READMEs, release history) or the
   project pages. Keep it that way: no invented numbers or clients.

   To add a post: put a new entry at the TOP of `posts`. Body blocks are
   paragraphs ("p"), sub-headings ("h") and bullet lists ("list").
------------------------------------------------------------------ */

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD) the post was published. */
  date: string;
  summary: string;
  tags: string[];
  /** Slugs of related bench projects (see works.ts). */
  works: string[];
  body: Block[];
  /** Hidden from the blog and the RSS feed (e.g. its project is hidden). */
  hidden?: boolean;
};

/** Every post, including hidden ones. The site uses `posts` below. */
export const allPosts: Post[] = [
  {
    slug: "weekly-brief-rehearsal-robots-at-the-post-office",
    title: "Weekly Brief (rehearsal): 45 robots join the post office",
    date: "2026-11-30",
    summary:
      "Humanoid robots take on a real job at China Post, Google and Cloudflare build front doors for AI agents, and a robot hosts a car launch. The week in AI and robotics, in plain English.",
    tags: ["Weekly Brief"],
    works: [],
    body: [
      {
        type: "p",
        text: "Hello, and welcome to the Weekly Brief. This week, humanoid robots started a real job at a busy post office, and two of the companies that run the internet's plumbing began building proper front doors for AI agents. That second story matters more for your business than it sounds.",
      },
      { type: "h", text: "45 humanoid robots start feeding parcels to the sorter at China Post" },
      {
        type: "p",
        text: "What happened: on 26 November, Chinese robot maker ROBOTERA announced that 45 of its humanoid robots are at work in China Post's Hangzhou Postal District Center. They pick up parcels, turn them the right way round, set aside odd-shaped ones and place them on the platforms that feed the sorting machines. Testing began in April. ROBOTERA says speed rose from 500 to 600 parcels an hour at first to about 1,200 an hour in specific test periods, with accuracy above 90%.",
      },
      {
        type: "p",
        text: "Why it matters: most humanoid robots so far have been demos. This is dozens of them doing one repetitive job in a real, busy building. It is still officially a test, though, and the figures are the company's own. The release doesn't say whether 1,200 an hour is per robot or for the whole group.",
      },
      {
        type: "p",
        text: "What it means for your business: humanoids won't be in your warehouse next year. But notice the pattern: robots win first on one dull, clearly defined task. If you have a job like that, it's worth asking whether simpler automation, such as a conveyor or a small robot arm, could take it on today.",
      },
      { type: "h", text: "Google sets the rules for AI agents in Gmail, Drive and Docs" },
      {
        type: "p",
        text: "What happened: on 24 November, Google launched two usage tiers for apps and AI agents that connect to Google Workspace: a free Standard Tier, capped at 5,000 requests a day per project and per product through its official MCP servers, and a paid Scaled Tier. From 1 February 2027, AI agents that reach Workspace data must go through Google's official MCP servers or its Workspace command-line tool. Billing for the paid tier begins on 1 April 2027.",
      },
      {
        type: "p",
        text: "Why it matters: Google says fewer than 1% of active Workspace developers will need more than the free tier. But it is drawing a clear line: AI agents get their own official entrance, with their own rules and limits.",
      },
      {
        type: "p",
        text: "What it means for your business: if you use, or plan to use, an AI assistant that reads your company's email, calendar or files, ask your supplier or IT person one question before February: does it use Google's official MCP servers?",
      },
      { type: "h", text: "One idea, explained: what is MCP?" },
      {
        type: "p",
        text: "MCP, the Model Context Protocol, is an open, standard way for an AI assistant to plug into other software. Think of it as a universal plug socket. Instead of every AI needing a custom cable for your email, another for your files and another for your customer database, each tool offers one standard socket, and any AI that speaks MCP can plug in, within the permissions you give it.",
      },
      { type: "h", text: "Cloudflare gives websites a search box built for AI agents" },
      {
        type: "p",
        text: "What happened: on 25 November, the web infrastructure company Cloudflare launched Search for Agents. With one switch in its dashboard, a website gets a search address (/.well-known/search) that AI agents can query, and it answers with passages from the site's own pages. Cloudflare says it is open to all plans, including the free plan with limits, while its documentation still calls it a beta. Billing starts on 1 December: beyond the included amount, meaning-based searches cost $0.75 per 1,000.",
      },
      {
        type: "p",
        text: "Why it matters: more people now ask an AI assistant instead of searching themselves. Tools like this help those assistants find accurate answers on your own site rather than guessing.",
      },
      {
        type: "p",
        text: "What it means for your business: if your website already runs on Cloudflare, this is cheap to try. First check that your key pages (prices, opening hours, product details) are clear and current: an agent can only repeat what your site says.",
      },
      { type: "h", text: "A humanoid robot hosts a car maker's press conference" },
      {
        type: "p",
        text: "What happened: in a release dated 27 November, XPENG says its humanoid robot IRON \"took centre stage to host\" its press conference at the Guangzhou Auto Show, while several more IRON robots worked the stand as receptionists, sales assistants and guides. XPENG plans to put IRON in its showrooms in China from the first quarter of 2027, and abroad in the second half of 2027.",
      },
      {
        type: "p",
        text: "Why it matters: receptions and showrooms are a gentler first job for humanoids than factory floors. The work is mostly talking and pointing, not lifting.",
      },
      {
        type: "p",
        text: "What it means for your business: front-of-house robots are marketing for now. The conversational AI behind them, though, already exists as plain software, for example a voice assistant on your phone line or website. No robot body needed.",
      },
      {
        type: "p",
        text: "Pico Pie's corner: when XPENG first showed IRON in November 2025, it moved so smoothly that engineers cut it open on stage to prove nobody was hiding inside. Pico Pie would like it known that it has never been asked to do this, and would like to keep it that way.",
      },
      { type: "h", text: "One thing to try this week" },
      {
        type: "p",
        text: "Ask an AI assistant (ChatGPT, Claude, Gemini or Copilot) a question a customer might ask about your business, such as your opening hours or what you charge for your main service. If the answer is wrong or vague, the fix usually starts on your own website.",
      },
      { type: "h", text: "Sources" },
      {
        type: "list",
        items: [
          "ROBOTERA, \"ROBOTERA Puts 45 Humanoid Robots into Large-Scale Fleet Operations at China Post\", PR Newswire, 26 November 2026: https://www.prnewswire.com/news-releases/robotera-puts-45-humanoid-robots-into-large-scale-fleet-operations-at-china-post-302951216.html",
          "The Techlantis, \"China Post is testing 45 Robotera humanoid robots at a Hangzhou parcel hub\", 27 November 2026: https://thetechlantis.com/news/china-post-robotera-45-humanoids-parcel-hub",
          "Google for Developers, \"Usage tiers and quotas for Google Workspace APIs and MCP servers\", updated 26 November 2026: https://developers.google.com/workspace/guides/quota-usage-tiers",
          "PPC Land, \"Cloudflare lets websites switch on a search box built for AI agents\", 26 November 2026, reporting Cloudflare's blog post of 25 November: https://ppc.land/cloudflare-lets-websites-switch-on-a-search-box-built-for-ai-agents/",
          "Cloudflare Blog, \"Search for Agents\": https://blog.cloudflare.com/search-for-agents/",
          "XPENG, \"XPENG Accelerates Global Physical AI Expansion at the 2026 Guangzhou International Automobile Exhibition\", GlobeNewswire, 27 November 2026, via StockTitan: https://www.stocktitan.net/news/XPEV/xpeng-accelerates-global-physical-ai-expansion-at-the-2026-guangzhou-knap6bcqmx1h.html",
          "Live Science, on IRON being cut open at XPENG's AI Day, November 2025: https://www.livescience.com/technology/robotics/watch-chinese-companys-new-humanoid-robot-moves-so-smoothly-they-had-to-cut-it-open-to-prove-a-person-wasnt-hiding-inside",
        ],
      },
    ],
  },
  {
    slug: "no-ai-keys-on-devices",
    title: "Why my apps never hold an AI key",
    date: "2026-11-17",
    summary:
      "Two apps, one rule: the permanent AI key never leaves the server. Here's the pattern each one uses, and why it matters for any company putting AI into an app or a device.",
    tags: ["Security", "Architecture"],
    works: ["voxa", "deja-groove"],
    body: [
      {
        type: "p",
        text: "Anything you ship to a user's phone or desk can be opened up. An app can be decompiled; a robot can be unscrewed. If a permanent API key is inside, it's only a matter of time before someone finds it and runs up your bill, or worse. So across the bench I follow one rule: the long-lived AI key stays on infrastructure I control, and never ships inside an app or a device.",
      },
      { type: "h", text: "Voxa: short-lived credentials for realtime voice" },
      {
        type: "p",
        text: "Voxa's tutor talks to you in real time over WebRTC, which means the iPhone connects to the voice model directly. The app still never sees the permanent key. It asks Voxa's authenticated .NET backend for a short-lived client credential, uses it for that session, and the real secret stays in a managed key vault that only the backend can read.",
      },
      { type: "h", text: "Déjà Groove: a deliberately small proxy" },
      {
        type: "p",
        text: "Déjà Groove keeps your record collection on your phone. The cloud side exists mainly to protect provider keys: a small serverless function receives the cover image, calls the recognition model and the Discogs metadata service, and returns a normalised answer. The app holds no provider secrets.",
      },
      { type: "h", text: "Why this matters beyond side projects" },
      {
        type: "list",
        items: [
          "It's the first question I ask in an architecture review of any LLM app: where does the key live, and who can reach it?",
          "Short-lived credentials limit the damage of a leak to minutes, not months.",
          "A thin server layer is also where you add rate limits, logging and cost controls later.",
        ],
      },
    ],
  },
  {
    slug: "pico-pie-first-firmware-milestone",
    title: "Pico Pie: the first firmware milestone",
    date: "2026-11-17",
    summary:
      "Before Pico can talk or move, it has to know who it is and find its friends. Notes on the network foundation that shipped as v0.1.0 and v0.1.1.",
    tags: ["Robotics", "Firmware"],
    works: ["pico-pie"],
    // Hidden with Pico Pie until the robot is ready to show again.
    hidden: true,
    body: [
      {
        type: "p",
        text: "Pico Pie is a small desk companion with swappable character heads. The exciting parts (voice, movement, vision) are still ahead. The first milestone, P0.1, is the unglamorous foundation everything else stands on, running on ESP32-S3 boards with ESP-IDF.",
      },
      { type: "h", text: "What P0.1 covers" },
      {
        type: "list",
        items: [
          "A stable device identity, so every Pico knows who it is.",
          "Wi-Fi connection with automatic reconnect, and an explicit online/offline state.",
          "Local discovery: Picos advertise themselves with mDNS and exchange UDP heartbeats, so they find each other without a cloud server.",
          "A peer registry and a semantic group-event exchange, the basis for Picos reacting to each other.",
          "A bounded queue of behaviour commands and local safety logic that decides what Pico may do.",
        ],
      },
      {
        type: "p",
        text: "On the Korvo-2 board there's also a first face: a pair of blinking eyes on the LCD. It's small, but it's the moment a circuit board starts to feel like a character.",
      },
      { type: "h", text: "Tested before it's flashed" },
      {
        type: "p",
        text: "The behaviour logic, the peer registry and the protocol parsing all have host-side unit tests, run on every commit by a pre-commit hook and again in CI, which also builds the firmware variants. Firmware changes carry a short release note, and merging them publishes a versioned GitHub release: v0.1.0 at the end of September, v0.1.1 in early October.",
      },
      { type: "h", text: "What's next" },
      {
        type: "p",
        text: "Servos for the head, a time-of-flight sensor, the camera, microphone and speaker, then realtime voice. Character identity via signed NFC tags in each head shell, and signed over-the-air updates, are already specified.",
      },
    ],
  },
  {
    slug: "deja-groove-local-first",
    title: "Déjà Groove went local-first",
    date: "2026-11-17",
    summary:
      "Record shops are noisy and the signal is bad. Why the app now keeps your whole collection on the phone and uses the cloud only for recognition.",
    tags: ["Product", "Architecture"],
    works: ["deja-groove"],
    body: [
      {
        type: "p",
        text: "Déjà Groove answers one question in the aisle of a record shop: do I already own this? Scan the sleeve, or let the app hear what's playing, and it resolves the album to release candidates and checks them against your crate, wishlist and discovery history.",
      },
      { type: "h", text: "The decision" },
      {
        type: "p",
        text: "Record shopping is fast, noisy and often short of network. So the product direction is deliberately local-first: the iPhone owns your crate, wishlist, history and collections, and the duplicate check runs on the device. The cloud is reduced to a small recognition proxy that keeps provider keys off the phone.",
      },
      { type: "h", text: "Clear verdicts" },
      {
        type: "p",
        text: "Every scan ends in one of four states: safe to buy, duplicate, ambiguous or no match. When several pressings fit, you choose. Discogs release data, artwork and Apple Music links are pulled in where available, and the app is built to cope when a field is missing, because release metadata varies a lot.",
      },
      { type: "h", text: "The lesson" },
      {
        type: "p",
        text: "Keep the cloud footprint as small as the product allows, and add sync or collaboration only when users need it. Less infrastructure means lower cost, fewer things to secure and an app that works where the user actually is.",
      },
    ],
  },
  {
    slug: "shipping-side-projects-like-production",
    title: "Shipping side projects like production software",
    date: "2026-11-17",
    summary:
      "Tests on every commit, release notes on every change, gates before anything reaches a user. The habits I bring to every project, at any size.",
    tags: ["Engineering", "CI/CD"],
    works: ["voxa", "tempo", "waveform-one"],
    body: [
      {
        type: "p",
        text: "None of the projects on the bench has a team behind it, and that's exactly why they're built with production habits. Automation is what lets one person move fast without breaking things.",
      },
      { type: "h", text: "What that looks like" },
      {
        type: "list",
        items: [
          "Voxa: every change passes CI for the backend, the iOS app and the infrastructure code, then a release gate, before a build goes to TestFlight.",
          "Tempo: unit, integration and regression suites, with an enforced 80% test-coverage floor for the firmware.",
          "Waveform One: every merged change is tested and published as a versioned GitHub release; over-the-air updates are signed, and production units ask before installing.",
          "This website: every pull request is linted, type-checked, tested and built; after each deploy, a check confirms every live page loads.",
        ],
      },
      { type: "h", text: "Why it matters for clients" },
      {
        type: "p",
        text: "Most AI prototypes die between the demo and production. The difference is rarely the model; it's tests, release discipline and knowing what's running where. I set that up from day one, so the prototype you approve is already on the path to production.",
      },
    ],
  },
];

/** The posts shown on the site, newest first. */
export const posts: Post[] = allPosts.filter((p) => !p.hidden);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const postsForWork = (workSlug: string) => posts.filter((p) => p.works.includes(workSlug));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
