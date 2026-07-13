/* Contact §4.2 — slim reassurance strip. Same ruled, left-aligned strip
   grammar as the homepage stats strip, in mono. */

import { HomeContainer } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

const ITEMS = [
  "Replies within 1 business day",
  "Free import help on every plan",
  "hello@pakkia.fi — a person answers",
];

export default function ReassuranceStrip() {
  return (
    <section className="bg-paper pb-20 md:pb-24">
      <HomeContainer>
        <Reveal>
          <div className="grid border-y border-line sm:grid-cols-3">
            {ITEMS.map((item, i) => (
              <div
                key={item}
                className={`py-5 pr-4 sm:py-6 sm:px-8 ${
                  i === 0
                    ? "sm:pl-0"
                    : "border-t border-line sm:border-l sm:border-t-0"
                }`}
              >
                <span className="font-spline text-[13px] font-medium leading-[1.6] text-ink-900 tabular-nums">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </HomeContainer>
    </section>
  );
}
