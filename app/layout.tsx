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
  metadataBase: new URL("https://tinyrobotcompany.io"),
  title: {
    default: "Tiny Robot Company",
    template: "%s · Tiny Robot Company",
  },
  description:
    "A studio of one making small things that think, move, and — occasionally — misbehave. Generative AI, electronics, and robotics from Simon Holmes.",
  applicationName: "Tiny Robot Company",
  authors: [{ name: "Simon Holmes" }],
  keywords: [
    "GenAI",
    "generative AI",
    "electronics",
    "robotics",
    "Simon Holmes",
    "Tiny Robot Company",
  ],
  openGraph: {
    type: "website",
    title: "Tiny Robot Company",
    description:
      "Small things that think, move, and — occasionally — misbehave. GenAI · Electronics · Robotics.",
    url: "https://tinyrobotcompany.io",
    siteName: "Tiny Robot Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiny Robot Company",
    description: "Small things that think, move, and — occasionally — misbehave.",
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
