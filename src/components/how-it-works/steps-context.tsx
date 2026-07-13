"use client";

/* Scroll state shared between the hero's mini-timeline (§2.1) and the steps
   timeline (§2.2): each step row reports itself when it crosses the viewport
   center, and the hero highlights that step's number in amber. -1 = no step
   has been in view yet, so the hero starts all-pine (amber budget). */

import { createContext, useContext, useMemo, useState } from "react";

const StepScrollContext = createContext<{
  active: number;
  setActive: (i: number) => void;
}>({ active: -1, setActive: () => {} });

export function StepScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(-1);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return (
    <StepScrollContext.Provider value={value}>
      {children}
    </StepScrollContext.Provider>
  );
}

export function useStepScroll() {
  return useContext(StepScrollContext);
}
