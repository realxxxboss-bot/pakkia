import type { Metadata } from "next";
import { Instrument_Sans, Inter, Montserrat } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pakkia — Overnight-stay reporting for Finnish campsites",
  description:
    "Pakkia turns nightly guest counts into the exact figures Statistics Finland asks for — accurate, traceable, and ready in minutes. Built for campsites, hosted in the EU.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${inter.variable} ${montserrat.variable} antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
