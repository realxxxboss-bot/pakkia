"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { CloseIcon, HelpIcon, PlusIcon } from "@/components/dashboard/icons";

/* "How do I log a night?" guide for pitch holders (non-technical visitors).
   Trigger lives in the shared topbar via the shell's `help` slot; the modal
   mirrors EntrySheet's accessibility + visual language (centred dialog on
   desktop, bottom sheet on mobile). Motion via `motion/react`, reduced-motion
   aware. */

const STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Open your pitch",
    body: (
      <>
        Go to <span className="font-semibold text-ink">Dashboard</span> or{" "}
        <span className="font-semibold text-ink">Calendar</span>. Everything
        here is for your pitch, <span className="font-semibold text-ink">A-07</span>.
      </>
    ),
  },
  {
    title: "Tap “Log tonight’s guests”",
    body: (
      <>
        Use the green button, or tap any day on the calendar to add or fix an
        earlier night.
      </>
    ),
  },
  {
    title: "Set how many people stayed",
    body: (
      <>
        Use{" "}
        <span className="inline-flex h-5 w-5 -translate-y-px items-center justify-center rounded-[6px] bg-subtle align-middle text-secondary ring-1 ring-border">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
            <path d="M5 12h14" />
          </svg>
        </span>{" "}
        and{" "}
        <span className="inline-flex h-5 w-5 -translate-y-px items-center justify-center rounded-[6px] bg-subtle align-middle text-secondary ring-1 ring-border">
          <PlusIcon size={13} />
        </span>{" "}
        to count the persons who slept on the pitch that night.
      </>
    ),
  },
  {
    title: "Save the night",
    body: (
      <>
        Tap <span className="font-semibold text-ink">Save night</span>. You can
        come back and change a count whenever you need to.
      </>
    ),
  },
];

export function HelpModal() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const descId = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog once it mounts.
    const id = window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(id);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    // Return focus to the trigger for keyboard users.
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="How to log overnight counts"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`relative grid h-10 w-10 place-items-center rounded-[10px] ring-1 transition-colors duration-150 ${
          open
            ? "bg-subtle text-ink ring-border-strong"
            : "text-secondary ring-border hover:bg-subtle hover:text-ink"
        }`}
      >
        <HelpIcon size={19} />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[80]">
            <motion.div
              onClick={close}
              aria-hidden
              className="absolute inset-0 bg-dark/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 flex items-end justify-center sm:items-center sm:p-6">
              <motion.div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={headingId}
                aria-describedby={descId}
                className="relative w-full rounded-t-[20px] bg-surface p-6 shadow-lg outline-none sm:max-w-[440px] sm:rounded-[18px]"
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24, scale: 0.98 }
                }
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* mobile grip */}
                <div
                  className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-container sm:hidden"
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-eyebrow text-[10px] font-semibold tracking-[0.12em] text-primary uppercase">
                      Quick guide
                    </p>
                    <h2 id={headingId} className="mt-1 text-[20px]">
                      Logging overnight counts
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="-mr-1 -mt-1 grid h-9 w-9 flex-none place-items-center rounded-[10px] text-secondary transition-colors duration-150 hover:bg-subtle hover:text-ink"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>

                <p id={descId} className="mt-1.5 text-[14px] leading-snug text-secondary">
                  Each night, tell us how many people slept on your pitch. It
                  takes about ten seconds.
                </p>

                <ol className="mt-5 flex flex-col gap-3.5">
                  {STEPS.map((s, i) => (
                    <li key={s.title} className="flex gap-3.5">
                      <span
                        className="nums grid h-7 w-7 flex-none place-items-center rounded-full bg-primary/10 font-heading text-[13px] font-semibold text-primary"
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <p className="text-[14.5px] font-semibold text-ink">
                          {s.title}
                        </p>
                        <p className="mt-0.5 text-[13.5px] leading-snug text-secondary">
                          {s.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 flex gap-3 rounded-[12px] border border-amber/30 bg-amber/[0.08] px-4 py-3">
                  <span
                    className="mt-0.5 flex-none text-amber-ink"
                    aria-hidden
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 18h6M10 21h4M12 2a7 7 0 00-4 12c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2a7 7 0 00-4-12z" />
                    </svg>
                  </span>
                  <p className="text-[13px] leading-snug text-ink">
                    Tip — turn on the{" "}
                    <span className="font-semibold">nightly reminder</span> in
                    your Profile to get a gentle nudge at 21:00.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="mt-5 w-full rounded-[12px] bg-primary px-5 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.99]"
                >
                  Got it
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
