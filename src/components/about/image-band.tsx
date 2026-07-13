"use client";

/* About §1.2 — Image band. The mist/valley photo at 21/9 with the pine
   duotone treatment, revealed by a clip-path wipe from the bottom. The two
   trust facts sit on a flat pine caption plate in the bottom-left corner,
   like a photo caption in a printed report — no blur, no floating badge. */

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { PHOTOS } from "@/lib/photos";
import { HomeContainer } from "@/components/site/primitives";
import { EASE, VIEWPORT } from "@/components/site/reveal";

const FACTS = ["Hosted in EU · Frankfurt", "GDPR by design"];

export default function ImageBand() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-paper pb-24 md:pb-32">
      <HomeContainer>
        <motion.div
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, clipPath: "inset(100% 0 0 0)" }
          }
          whileInView={
            reduce
              ? { opacity: 1 }
              : { opacity: 1, clipPath: "inset(0% 0 0 0)" }
          }
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative aspect-[21/9] overflow-hidden rounded-[12px] border border-line"
        >
          <Image
            src={PHOTOS.valleyMist}
            alt="Mist drifting over a forested Finnish valley at dawn"
            fill
            sizes="(min-width: 1120px) 1072px, 100vw"
            preload
            className="object-cover"
          />
          {/* pine duotone treatment */}
          <div
            className="absolute inset-0 bg-pine-900 opacity-[0.12] mix-blend-multiply"
            aria-hidden
          />
          {/* caption plate — flat, no blur */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.35, ease: EASE, delay: 0.2 }}
            className="absolute bottom-4 left-4 rounded-[6px] bg-pine-900/90 px-4 py-3 sm:bottom-5 sm:left-5"
          >
            {FACTS.map((fact, i) => (
              <p
                key={fact}
                className={`font-spline text-[12px] font-medium leading-none text-cream ${
                  i > 0 ? "mt-2.5 border-t border-line-dark pt-2.5" : ""
                }`}
              >
                {fact}
              </p>
            ))}
          </motion.div>
        </motion.div>
      </HomeContainer>
    </section>
  );
}
