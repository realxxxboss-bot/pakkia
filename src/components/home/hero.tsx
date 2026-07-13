"use client";

/* Section 01 — Hero (Nordic editorial spec §5). Asymmetric 7/5 grid,
   hand-drawn amber strike on "spreadsheet", pine-duotone lake photo with a
   flat instrument-readout data strip attached to its bottom edge. */

import Image from "next/image";
import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PHOTOS } from "@/lib/photos";
import {
  HomeContainer,
  SectionEyebrow,
  SplitButton,
  UnderlineLink,
} from "./primitives";
import { EASE, RevealGroup, RevealItem } from "./reveal";

const TRUST = [
  "EU-hosted data",
  "GDPR-compliant",
  "Statistics Finland format",
  "CSV & PDF",
];

/* A single slightly wavy stroke, drawn 0→1 after the H1 has revealed. */
function StruckWord({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="pointer-events-none absolute left-[-2%] top-[54%] h-[0.3em] w-[104%] -translate-y-1/2"
        viewBox="0 0 240 12"
        preserveAspectRatio="none"
        aria-hidden
      >
        <motion.path
          d="M3 7 C 32 4, 58 10, 88 7 C 118 4, 144 10, 174 6 C 202 3, 224 8, 237 6"
          fill="none"
          stroke="var(--color-amber-500)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
        />
      </svg>
    </span>
  );
}

function Sparkline() {
  return (
    <svg
      width="32"
      height="14"
      viewBox="0 0 32 14"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M1 11L7 8l5 2 6-5 5 2 7-5"
        stroke="var(--color-pine-700)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-paper pb-24 pt-14 md:pt-20">
      <HomeContainer>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <RevealGroup className="lg:col-span-7">
            <RevealItem>
              <SectionEyebrow number="01" label="Overnight-stay reporting · Suomi" />
            </RevealItem>
            <RevealItem as="h1" className="mt-7 max-w-[15ch] font-familjen text-[clamp(2.6rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-pine-900">
              Report every night. Without the <StruckWord>spreadsheet</StruckWord>.
            </RevealItem>
            <RevealItem as="p" className="mt-6 max-w-[36rem] text-[1.0625rem] leading-[1.65] text-ink-muted">
              Pakkia turns nightly guest counts into the exact figures
              Statistics Finland asks for — accurate, traceable, and ready in
              minutes. Built for campsites, hosted in the EU.
            </RevealItem>
            <RevealItem className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <SplitButton href="/signup">Start free</SplitButton>
              <UnderlineLink href="/how-it-works">See how it works</UnderlineLink>
            </RevealItem>
            <RevealItem className="mt-10 border-t border-line pt-5">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-spline text-[13px] font-medium text-ink-muted">
                {TRUST.map((t, i) => (
                  <span key={t} className="inline-flex items-center gap-x-2">
                    {i > 0 && (
                      <span className="mr-2" aria-hidden>
                        ·
                      </span>
                    )}
                    <Check size={12} strokeWidth={2.5} className="text-pine-700" aria-hidden />
                    {t}
                  </span>
                ))}
              </p>
            </RevealItem>
          </RevealGroup>

          <motion.div
            className="relative mb-6 lg:col-span-5"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, clipPath: "inset(12% 0 0 0)" }
            }
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] border border-line">
              <Image
                src={PHOTOS.campLake}
                alt="Tents pitched beside a calm lake at a Finnish campsite at dusk"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                preload
                className="object-cover"
              />
              {/* pine duotone treatment */}
              <div
                className="absolute inset-0 bg-pine-900 opacity-[0.12] mix-blend-multiply"
                aria-hidden
              />
            </div>
            {/* flat instrument readout, attached to the photo's bottom edge */}
            <div className="absolute -bottom-6 left-4 right-4 flex items-center justify-between gap-4 rounded-[6px] border border-line bg-paper px-4 py-3">
              <span className="font-spline text-[12px] font-medium text-ink-muted">
                Nights logged · June
              </span>
              <Sparkline />
              <span className="font-spline text-[20px] font-medium text-amber-500 tabular-nums">
                1,284
              </span>
            </div>
          </motion.div>
        </div>
      </HomeContainer>
    </section>
  );
}
