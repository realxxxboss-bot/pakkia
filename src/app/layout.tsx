import type { Metadata } from "next";
import {
  Schibsted_Grotesk,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Familjen_Grotesk,
  Spline_Sans_Mono,
} from "next/font/google";
import "./globals.css";

// Display — Schibsted Grotesk: a Nordic grotesque with quiet character.
const display = Schibsted_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// Body / UI — Hanken Grotesk: clean, highly legible, professional.
const sans = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Data / metrics — IBM Plex Mono: tabular precision for compliance figures.
const mono = IBM_Plex_Mono({
  variable: "--font-mono-ibm",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Nordic editorial (homepage) — display headings. Hanken Grotesk above
// doubles as the editorial body font, so it is not loaded twice.
const familjen = Familjen_Grotesk({
  variable: "--font-familjen-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Nordic editorial (homepage) — data, labels, eyebrows.
const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pakkia · Overnight-stay reporting for Finnish campsites",
  description:
    "Pakkia turns nightly guest counts into the exact figures Statistics Finland asks for. Accurate, traceable, and ready in minutes. Built for campsites, hosted in the EU.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${familjen.variable} ${splineMono.variable} antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
