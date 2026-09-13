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
    default: "The Little Systems Company",
    template: "%s · The Little Systems Company",
  },
  description:
    "Robotics, AI systems and practical GenAI for small and mid-sized manufacturers. Building, education and consultancy — from a workshop of one.",
  applicationName: "The Little Systems Company",
  authors: [{ name: "Simon Holmes" }],
  keywords: [
    "GenAI",
    "generative AI",
    "AI systems",
    "robotics",
    "manufacturing",
    "AI consultancy",
    "AI education",
    "Simon Holmes",
    "The Little Systems Company",
  ],
  openGraph: {
    type: "website",
    title: "The Little Systems Company",
    description:
      "Robotics, AI systems and practical GenAI for small and mid-sized manufacturers.",
    url: "https://tinyrobotcompany.io",
    siteName: "The Little Systems Company",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Little Systems Company",
    description:
      "Robotics, AI systems and practical GenAI for small and mid-sized manufacturers.",
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
