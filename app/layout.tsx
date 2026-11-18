import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // www is canonical: the bare domain is a registrar redirect that drops the
  // path, so shared links and previews must always use www.
  metadataBase: new URL("https://www.tinyrobotcompany.io"),
  alternates: { canonical: "./" },
  title: {
    default: "Tiny Robot Company · Small studio. Serious AI, built to work.",
    template: "%s · Tiny Robot Company",
  },
  description:
    "The independent AI studio of Dr Simon Holmes: AI strategy, architecture, hands-on build and training, from strategy to production code, on any cloud.",
  applicationName: "Tiny Robot Company",
  authors: [{ name: "Simon Holmes" }],
  keywords: [
    "AI consulting",
    "agentic AI",
    "AI architecture",
    "fractional head of AI",
    "AI training",
    "generative AI",
    "Simon Holmes",
    "Tiny Robot Company",
  ],
  openGraph: {
    type: "website",
    title: "Tiny Robot Company",
    description:
      "Small studio. Serious AI, built to work. AI strategy, architecture, build and training from Dr Simon Holmes.",
    url: "https://www.tinyrobotcompany.io",
    siteName: "Tiny Robot Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiny Robot Company",
    description: "Small studio. Serious AI, built to work.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
