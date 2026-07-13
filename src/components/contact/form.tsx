"use client";

/* Contact §4.1 right column — the form is the page's single card. Editorial
   underline fields, Zod validation inline on blur, a split-arrow submit that
   swaps to "Sending…" with a spinner in the arrow zone, then a calm 300ms
   cross-fade to confirmation. No confetti.

   The actual send is stubbed until the Supabase/backend phase — see the
   TODO(backend) markers at the submit handler and the Turnstile slot. */

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import UnderlineField from "@/components/site/UnderlineField";
import { EASE } from "@/components/site/reveal";

const SCHEMA = z.object({
  name: z.string().trim().min(1, "Please tell us your name."),
  site: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .min(1, "An email is required.")
    .pipe(z.email("That doesn't look like a valid email.")),
  message: z.string().trim().min(1, "A quick word about your process helps."),
});

type Field = keyof z.infer<typeof SCHEMA>;
type Status = "idle" | "sending" | "sent";

function validateField(field: Field, value: string) {
  const result = SCHEMA.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/* "We'll reply by …" — the next weekday after submission, e.g. Friday 17:00
   → Monday. Sat/Sun never qualify; holidays are the backend's problem. */
function nextBusinessDay(from = new Date()) {
  const d = new Date(from);
  do {
    d.setDate(d.getDate() + 1);
  } while (d.getDay() === 0 || d.getDay() === 6);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

function Spinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      className="animate-spin motion-reduce:animate-none"
      aria-hidden
    >
      <circle
        cx="7.5"
        cy="7.5"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      <path
        d="M13.5 7.5A6 6 0 0 0 7.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    site: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [replyBy, setReplyBy] = useState("");
  const bodyRef = useRef<HTMLFormElement>(null);
  /* captured at submit so the confirmation keeps the card's height and the
     cross-fade doesn't collapse the layout */
  const [bodyMinHeight, setBodyMinHeight] = useState<number>();

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const blur = (field: Field) => {
    /* untouched-empty optional fields stay quiet; required ones report */
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;

    const parsed = SCHEMA.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setBodyMinHeight(bodyRef.current?.offsetHeight);
    setReplyBy(nextBusinessDay());
    setStatus("sending");

    // TODO(backend): replace this stub with the real server action — verify
    // the Turnstile token server-side, persist/notify via Supabase, and only
    // then resolve to the "sent" state (surface failures inline).
    window.setTimeout(() => setStatus("sent"), 900);
  };

  return (
    <div
      className="rounded-[12px] border border-line bg-paper-deep p-6 sm:p-8"
      style={
        { "--field-autofill-bg": "var(--color-paper-deep)" } as React.CSSProperties
      }
    >
      <h2 className="font-familjen text-[1.25rem] font-semibold tracking-[-0.02em] text-pine-900">
        Request your free month
      </h2>
      <p className="mt-1.5 font-spline text-[12px] font-medium text-ink-muted">
        No card · no obligation
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="confirmation"
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ minHeight: bodyMinHeight }}
            className="mt-8 flex flex-col justify-center"
          >
            <span
              className="font-spline text-[24px] font-medium leading-none text-pine-700"
              aria-hidden
            >
              ✓
            </span>
            <h3 className="mt-4 font-familjen text-[1.25rem] font-semibold tracking-[-0.02em] text-pine-900">
              Request received.
            </h3>
            <p className="mt-2 max-w-[34rem] text-[0.9375rem] leading-[1.65] text-ink-muted">
              We&apos;ll reply by{" "}
              <span className="font-spline text-[0.875rem] font-medium text-ink-900 tabular-nums">
                {replyBy}
              </span>{" "}
              — usually sooner.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={bodyRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-8 flex flex-col gap-6"
          >
            <UnderlineField
              label="Your name"
              name="name"
              autoComplete="name"
              placeholder="Olli Virtanen"
              value={values.name}
              error={errors.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={() => blur("name")}
            />
            <UnderlineField
              label="Campsite"
              name="site"
              autoComplete="organization"
              placeholder="Rairanta"
              value={values.site}
              error={errors.site}
              onChange={(e) => update("site", e.target.value)}
              onBlur={() => blur("site")}
            />
            <UnderlineField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@yoursite.fi"
              value={values.email}
              error={errors.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => blur("email")}
            />
            <UnderlineField
              label="How do you track nights today?"
              type="textarea"
              rows={4}
              name="message"
              placeholder="A few words about your current spreadsheet or process…"
              value={values.message}
              error={errors.message}
              onChange={(e) => update("message", e.target.value)}
              onBlur={() => blur("message")}
            />

            {/* TODO(backend): mount the Cloudflare Turnstile widget in this
                slot (site key via env) and pass its token with the request.
                Invisible mode keeps the slot empty; explicit mode renders
                bottom-left here, above the button, per the spec. */}
            <div id="turnstile-slot" className="self-start empty:hidden" />

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-1 flex h-[46px] w-full items-stretch rounded-[6px] bg-pine-700 font-body text-[0.9375rem] font-medium leading-none text-cream transition-colors duration-200 hover:bg-pine-900 disabled:hover:bg-pine-700"
            >
              <span className="flex flex-1 items-center justify-center px-[1.375rem]">
                {status === "sending" ? (
                  <span className="font-spline text-[0.875rem] font-medium">
                    Sending…
                  </span>
                ) : (
                  "Send request"
                )}
              </span>
              <span
                className="flex w-11 items-center justify-center border-l border-[rgba(245,242,234,0.25)]"
                aria-hidden
              >
                {status === "sending" ? (
                  <Spinner />
                ) : (
                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-[3px]"
                  />
                )}
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
