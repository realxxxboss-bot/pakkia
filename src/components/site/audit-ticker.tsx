"use client";

/* The audit-log ticker — three mono rows cycling with a slow fade every 3s
   (design spec §9). Shared between the homepage compliance section and the
   auth brand panel (inner-pages spec §9.1). Dark-surface colors: render on
   pine-900 only. Decorative → aria-hidden; reduced motion stops the cycle. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LOG_POOL = [
  "21:34 · Pitch A-12 · 4 persons · edited by staff",
  "21:12 · Pitch B-03 · 2 persons · logged by holder",
  "20:58 · Pitch C-07 · 5 persons · logged by staff",
  "20:41 · June report · CSV · exported by admin",
  "20:17 · Pitch A-02 · 3 persons · logged by holder",
  "19:55 · Pitch D-01 · 6 persons · edited by staff",
];

export default function AuditTicker() {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(
      () => setOffset((o) => (o + 1) % LOG_POOL.length),
      3000
    );
    return () => clearInterval(interval);
  }, [reduce]);

  const rows = [0, 1, 2].map((i) => LOG_POOL[(offset + i) % LOG_POOL.length]);

  return (
    <div aria-hidden>
      <div className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-cream-muted">
        Audit log
      </div>
      <div className="mt-3">
        {rows.map((entry) => (
          <motion.div
            key={entry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="border-b border-line-dark py-3 font-spline text-[12px] font-medium leading-snug text-cream-muted first:border-t tabular-nums"
          >
            {entry}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
