"use client";

/* Pricing §3.1–3.2 — the hero's Monthly/Yearly toggle drives the rate
   table's prices, so the two sections share this thin client wrapper. */

import { useState } from "react";
import PricingHero, { type Billing } from "./hero";
import Plans from "./plans";

export default function PricingSections() {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <>
      <PricingHero billing={billing} onBillingChange={setBilling} />
      <Plans billing={billing} />
    </>
  );
}
