/* ------------------------------------------------------------------
   The Log: build notes from the bench. Every fact in these posts comes
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
};

export const posts: Post[] = [
  {
    slug: "no-ai-keys-on-devices",
    title: "Why none of my devices hold an AI key",
    date: "2026-11-17",
    summary:
      "Three projects, one rule: the permanent AI key never leaves the server. Here's the pattern each one uses, and why it matters for any company putting AI into an app or a device.",
    tags: ["Security", "Architecture"],
    works: ["voxa", "deja-groove", "pico-pie"],
    body: [
      {
        type: "p",
        text: "Anything you ship to a user's phone or desk can be opened up. An app can be decompiled; a robot can be unscrewed. If a permanent API key is inside, it's only a matter of time before someone finds it and runs up your bill, or worse. So across the bench I follow one rule: the long-lived AI key stays on infrastructure I control.",
      },
      { type: "h", text: "Voxa: short-lived credentials for realtime voice" },
      {
        type: "p",
        text: "Voxa's tutor talks to you in real time over WebRTC, which means the iPhone connects to the voice model directly. The app still never sees the permanent key. It asks Voxa's authenticated .NET backend on Azure for a short-lived client credential, uses it for that session, and the real secret stays in Azure Key Vault behind a managed identity.",
      },
      { type: "h", text: "Déjà Groove: a deliberately small proxy" },
      {
        type: "p",
        text: "Déjà Groove keeps your record collection on your phone. The cloud side exists mainly to protect provider keys: an Azure Function receives the cover image, calls the recognition model and the Discogs metadata service, and returns a normalised answer. The app holds no provider secrets.",
      },
      { type: "h", text: "Pico Pie: designed in from the start" },
      {
        type: "p",
        text: "For Pico Pie the rule is written into the engineering baseline: permanent AI keys must never be embedded in production devices. A lost or opened-up Pico should leak nothing.",
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
        text: "Record shopping is fast, noisy and often short of network. So the product direction is deliberately local-first: the iPhone owns your crate, wishlist, history and collections, and the duplicate check runs on the device. Azure is reduced to a small recognition proxy that keeps provider keys off the phone.",
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

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const postsForWork = (workSlug: string) => posts.filter((p) => p.works.includes(workSlug));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
