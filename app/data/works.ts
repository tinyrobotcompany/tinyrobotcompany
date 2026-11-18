
/* ------------------------------------------------------------------
   Works — the single source of truth for project cards on the home
   page and the /works/[slug] detail pages. Add a project by adding an
   entry here; order in the array is the order on the page.
------------------------------------------------------------------ */

export type Pillar = "GenAI" | "Electronics" | "Robotics";
export type Stage = "Prototype" | "In development" | "TestFlight beta";

export type Work = {
  slug: string;
  /** Catalogue number shown on cards, e.g. "TRC / 04". */
  no: string;
  /** Title split so the second half renders in the italic serif. */
  name: { lead: string; serif?: string };
  year: number;
  pillars: Pillar[];
  stage: Stage;
  /** One plain sentence: what it is, for anyone. */
  tagline: string;
  /** Two-line card description for the home page bento. */
  summary: string;
  /** Detail-page body paragraphs. */
  intro: string[];
  highlights: { title: string; body: string }[];
  /** Three-node "how it fits together" strip. */
  flow: [FlowNode, FlowNode, FlowNode];
  stack: string[];
  repo: { owner: string; name: string };
  /** Shown if the GitHub release lookup fails at build time. */
  fallbackVersion: string;
  /** Apps in private beta get a "Join the beta" button; the rest get a waitlist. */
  beta?: boolean;
  /** Hidden from the site (no card, no page, no sign-up) until it's ready to show. */
  hidden?: boolean;
  /** Plain status line: what works today, what's next, how to get one. */
  status: { today: string; next: string; availability: string };
  /** Where the user's data goes, for apps that handle personal data. */
  dataNote?: string[];
  icon?: string;
  visual?:
    | {
        kind: "screen";
        src: string;
        alt: string;
        width: number;
        height: number;
        /** Shown under the image, e.g. to say it's a render rather than a photo. */
        caption?: string;
        /** Further screens of the same size, shown side by side with the first. */
        more?: { src: string; alt: string }[];
      }
    | { kind: "family"; characters: { src: string; name: string }[] };
};

type FlowNode = { label: string; sub: string };

/** Every project, including hidden ones. The site uses `works` below. */
export const allWorks: Work[] = [
  {
    slug: "pico-pie",
    no: "TRC / 04",
    name: { lead: "Pico", serif: "Pie" },
    year: 2026,
    pillars: ["Robotics", "GenAI"],
    stage: "Prototype",
    // Hidden until the robot is more mature as a product. Set to false to bring it back.
    hidden: true,
    status: {
      today: "Device identity, Wi-Fi, local discovery between Picos and an animated face",
      next: "Head movement, vision and realtime voice",
      availability: "Not on sale yet: join the waitlist to hear first",
    },
    tagline:
      "A small AI companion robot for your desk, being built to listen, talk and turn to look at you.",
    summary:
      "An expressive desk robot with swappable character heads. One platform, ten personalities: clip on a new shell and an NFC tag tells Pico who it is now.",
    intro: [
      "Pico Pie is a small, physically embodied AI companion. The aim isn't a smart speaker with eyes; it's a little character that feels present on your desk. It hears you, answers, turns its head toward you and reacts.",
      "Everything is built in-house: mechanical design, electronics, firmware, the AI layer and the characters themselves. The first firmware milestone runs on ESP32-S3 boards, covering device identity, Wi-Fi, local discovery so Picos can find each other, and an animated face. Movement, vision and realtime voice are the next milestones.",
    ],
    highlights: [
      {
        title: "Swappable characters",
        body: "Each head shell carries a signed NFC tag. Swap the shell and Pico becomes that character, with its own look and personality.",
      },
      {
        title: "Picos talk to each other",
        body: "Units discover each other on the local network and exchange group events directly, with no cloud server in between.",
      },
      {
        title: "Keys never live on the robot",
        body: "Permanent AI credentials are kept off the device by design, so a lost or opened-up Pico can't leak them.",
      },
      {
        title: "Printable and hackable",
        body: "Parametric CAD for every part, exported as print-ready plates with step-by-step assembly drawings.",
      },
    ],
    flow: [
      { label: "Mic + cam", sub: "Sense" },
      { label: "ESP32-S3", sub: "Decide" },
      { label: "Head + face", sub: "React" },
    ],
    stack: ["ESP32-S3", "ESP-IDF", "C++", "NFC"],
    repo: { owner: "tinyrobotcompany", name: "Pico_Pie" },
    fallbackVersion: "v0.1.1",
    visual: {
      kind: "family",
      characters: [
        { src: "/works/pico-pico.webp", name: "Pico" },
        { src: "/works/pico-kiro.webp", name: "Kiro" },
        { src: "/works/pico-kiri.webp", name: "Kiri" },
        { src: "/works/pico-aiko.webp", name: "Aiko" },
        { src: "/works/pico-zuno.webp", name: "Zuno" },
        { src: "/works/pico-omi.webp", name: "Omi" },
      ],
    },
  },
  {
    slug: "voxa",
    no: "TRC / 02",
    name: { lead: "Voxa" },
    year: 2026,
    pillars: ["GenAI"],
    stage: "TestFlight beta",
    tagline: "A voice-first language tutor for iPhone and iPad.",
    summary:
      "Practise a language by talking. A realtime voice tutor that adapts to your level, plus translation, correction and review.",
    intro: [
      "Voxa lets learners practise a new language out loud. It places you at a CEFR-style level, sets goals around the time you have each day, then gives you a realtime voice tutor to talk with, alongside guided practice, translation from text, voice or photos, corrections with explanations, and review of what you've learned.",
      "It runs on iPhone and iPad with a .NET backend in the cloud, and is currently in TestFlight beta.",
    ],
    highlights: [
      {
        title: "Real conversation",
        body: "The tutor runs over WebRTC on OpenAI's realtime models, so you can speak naturally and interrupt, like talking to a person.",
      },
      {
        title: "Secure by design",
        body: "The app never holds the permanent AI key. The backend issues short-lived credentials per session; secrets stay in a managed key vault.",
      },
      {
        title: "Learns with you",
        body: "Multiple language profiles, placement, progress and personalised reminders, resumed across devices.",
      },
      {
        title: "Shipped like production software",
        body: "Every change passes automated tests and a release gate before reaching TestFlight. Account export and deletion are built in.",
      },
    ],
    flow: [
      { label: "Voice", sub: "iPhone" },
      { label: "Backend", sub: ".NET 10" },
      { label: "Realtime", sub: "Tutor" },
    ],
    stack: ["SwiftUI", ".NET 10", "OpenAI Realtime", "Azure"],
    repo: { owner: "simonholmes001", name: "voxa" },
    fallbackVersion: "v0.20.13",
    beta: true,
    status: {
      today: "Placement, realtime voice tutor, translation, corrections and review, in TestFlight beta",
      next: "App Store release",
      availability: "Coming soon to the App Store (iPhone and iPad); Android in development",
    },
    dataNote: [
      "When you talk to the tutor, your voice goes straight from the app to OpenAI's realtime voice model for that conversation. The app connects with a short-lived credential and never holds a permanent key.",
      "Your account, language profiles and progress are kept by Voxa's own backend so you can pick up on another device. You can export or delete your account from the app.",
    ],
    icon: "/works/voxa-icon.webp",
  },
  {
    slug: "deja-groove",
    no: "TRC / 01",
    name: { lead: "Déjà", serif: "Groove" },
    year: 2026,
    pillars: ["GenAI"],
    stage: "TestFlight beta",
    tagline: "A record-shop companion for vinyl collectors.",
    summary:
      "Point your phone at a sleeve, or let it hear what's playing, and it tells you whether that record is already in your crate.",
    intro: [
      "Record shopping is fast and noisy, and the real question is rarely “what is this album?”. It's “do I already own this pressing?” Déjà Groove answers that in the aisle. Scan a cover or identify a song that's playing, and the app resolves it to album and release candidates, checks them against your crate, wishlist and history, and gives you a verdict.",
      "Your collection lives on your phone. The cloud side is a deliberately small recognition service that keeps provider keys off the device.",
    ],
    highlights: [
      {
        title: "Answers in the aisle",
        body: "Clear verdicts (safe to buy, duplicate, ambiguous or no match) with manual resolution when several pressings fit.",
      },
      {
        title: "Two ways in",
        body: "Scan the sleeve with the camera or a saved photo, or identify music playing nearby with ShazamKit.",
      },
      {
        title: "Rich release data",
        body: "Discogs metadata, artwork and Apple Music links are pulled in automatically for every match.",
      },
      {
        title: "Local-first",
        body: "Crate, wishlist, history and collections stay on the device. The backend only does recognition.",
      },
    ],
    flow: [
      { label: "Cover", sub: "Camera" },
      { label: "AI match", sub: "Proxy" },
      { label: "Your crate", sub: "On device" },
    ],
    stack: ["Swift 6", "ShazamKit", "OpenAI", "Discogs", "Azure Functions"],
    repo: { owner: "simonholmes001", name: "deja-groove" },
    fallbackVersion: "v0.12.1",
    beta: true,
    status: {
      today: "Sleeve scan, song recognition and the duplicate check against your crate, in TestFlight beta",
      next: "App Store release",
      availability: "Coming soon to the App Store (iPhone); Android in development",
    },
    dataNote: [
      "Your crate, wishlist, history and collections stay on your phone.",
      "When you scan a sleeve, the image goes to Déjà Groove's small recognition service, which asks an AI model and Discogs to identify the release and sends back the match. Listening for a song uses Apple's ShazamKit.",
    ],
    icon: "/works/deja-groove-icon.webp",
  },
  {
    slug: "tempo",
    no: "TRC / 05",
    name: { lead: "Tempo" },
    year: 2026,
    pillars: ["Electronics"],
    stage: "Prototype",
    tagline: "A 10-inch desk display for the time, the weather and your next train.",
    summary:
      "A touchscreen clock for the shelf: time, local weather and live public-transport departures at a glance, set up from your phone.",
    intro: [
      "Tempo is a standalone 10.1-inch touchscreen for a desk or shelf. It shows the time in one of ten clock styles, local weather, and live departures and service alerts for nearby public transport, with route diagrams and street maps a tap away. Transit covers the Paris region today; all major cities are planned.",
      "There's no computer behind it: the embedded firmware drives the display and serves a control panel to your phone over the local network. It lives in a 3D-printed enclosure.",
    ],
    highlights: [
      {
        title: "One chip, no PC",
        body: "A single ESP32-P4 runs the display, fetches the data and hosts the phone control panel.",
      },
      {
        title: "Set up from your phone",
        body: "Wi-Fi, brightness, colours and auto-rotating views, all from a local web page.",
      },
      {
        title: "Live transit",
        body: "Departures, disruptions and route maps, from the Île-de-France mobility data service today and more cities next.",
      },
      {
        title: "Tested like a product",
        body: "Unit, integration and regression suites with an enforced 80% coverage floor.",
      },
    ],
    flow: [
      { label: "Transit + wx", sub: "APIs" },
      { label: "ESP32-P4", sub: "Firmware" },
      { label: "10.1″ screen", sub: "Display" },
    ],
    stack: ["ESP32-P4", "ESP-IDF", "LVGL", "C"],
    repo: { owner: "tinyrobotcompany", name: "Tempo" },
    fallbackVersion: "v0.8.16",
    status: {
      today: "Ten clock styles, local weather and live Paris-region transit, on a working prototype",
      next: "Live transit for all major cities",
      availability: "Not on sale yet: join the waitlist to hear first",
    },
    visual: {
      kind: "screen",
      src: "/works/tempo-clock.webp",
      alt: "Tempo's clock screen in violet: a large 06:56, a local weather card and next bus departures.",
      width: 1280,
      height: 730,
      more: [
        {
          src: "/works/tempo-clock-teal.webp",
          alt: "Tempo's clock screen in teal: 08:00, weather with rain and wind, and the next three train departures.",
        },
      ],
      caption: "Screens from the working prototype. Two of the ten clock styles; stop names blurred.",
    },
  },
  {
    slug: "waveform-one",
    no: "TRC / 03",
    name: { lead: "Waveform", serif: "One" },
    year: 2026,
    pillars: ["Electronics"],
    stage: "Prototype",
    tagline: "A music-reactive LED display that turns sound into light.",
    summary:
      "A 64×32 LED panel that listens to the room and visualises the music in real time, controlled from a touchscreen or your phone.",
    intro: [
      "Waveform One listens through a small microphone and turns whatever's playing into moving light on a 64×32 LED panel. Pick a visual style (classic, mirrored or waterfall) from the touchscreen controller or from your phone.",
      "An ESP32-S3 handles audio capture and panel refresh. A separate ESP32-P4 touchscreen joins your Wi-Fi, hosts the phone remote and is gaining on-device music recognition. Signed over-the-air updates keep devices current.",
    ],
    highlights: [
      {
        title: "Real-time audio",
        body: "Captures sound, calibrates against room noise and renders straight to the panel on the ESP32-S3.",
      },
      {
        title: "Touch and phone control",
        body: "A 7-inch touchscreen controller and a local phone remote for switching styles.",
      },
      {
        title: "Signed OTA updates",
        body: "Releases are signed. Development units update automatically; production units ask first.",
      },
      {
        title: "Versioned releases",
        body: "Every merged change is tested and published as a GitHub release with notes.",
      },
    ],
    flow: [
      { label: "Mic", sub: "Input" },
      { label: "ESP32-S3", sub: "Audio" },
      { label: "HUB75", sub: "64×32 LEDs" },
    ],
    stack: ["ESP32-S3", "ESP32-P4", "C++", "Rust"],
    repo: { owner: "tinyrobotcompany", name: "Waveform_One" },
    fallbackVersion: "v0.6.1",
    visual: {
      kind: "screen",
      src: "/works/waveform-device.webp",
      alt: "Mock of Waveform One: a black cabinet with the touchscreen showing the album playing and the LED panel in its mirrored style, a record sleeve standing on top, and the panel's three visual styles alongside.",
      width: 2400,
      height: 1656,
      caption:
        "A mock drawn from Waveform One's own design files: the cabinet from its CAD model, the Now Playing screen from the touchscreen firmware, the LED styles from the display code. The record is invented; photos of the device are coming.",
    },
    status: {
      today: "Real-time music visuals on a 64×32 LED panel, with touchscreen and phone control",
      next: "On-device music recognition",
      availability: "Not on sale yet: join the waitlist to hear first",
    },
  },
];

/** The projects shown on the site, in page order. */
export const works: Work[] = allWorks.filter((w) => !w.hidden);

export const getWork = (slug: string) => works.find((w) => w.slug === slug);

export const repoUrl = (w: Work) => `https://github.com/${w.repo.owner}/${w.repo.name}`;

export function fullName(w: Work) {
  return w.name.serif ? `${w.name.lead} ${w.name.serif}` : w.name.lead;
}
