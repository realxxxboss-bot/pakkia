"use client";

/* Signup form (inner-pages spec §10.2) — editorial underline fields directly
   on paper, sharing the AuthLayout shell with Login. The password shows live
   requirement tokens (no strength bars); consent is one custom checkbox in
   the Login style. Submit runs client-side Zod validation only, then swaps to
   the email-verification notice locally.

   Everything server-side is stubbed until the Supabase auth phase — see the
   TODO(backend) markers at the submit handler, the Turnstile slot and the
   resend action. On a duplicate email the real flow must return the SAME
   notice (its copy is deliberately neutral) so signup never reveals whether
   an address already has an account (§10.3). */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import UnderlineField from "@/components/site/UnderlineField";
import { UnderlineLink } from "@/components/site/primitives";
import { EASE, RevealGroup, RevealItem } from "@/components/site/reveal";
import { Spinner } from "@/components/site/spinner";

/* live password requirements — mono tokens under the field, each turning
   from ink-muted to pine-700 as satisfied (§10.2; no strength meter bars) */
const PW_REQUIREMENTS = [
  { label: "8+ chars", test: (v: string) => v.length >= 8 },
  { label: "1 number", test: (v: string) => /\d/.test(v) },
  { label: "1 upper-case", test: (v: string) => /[A-Z]/.test(v) },
] as const;

const SCHEMA = z.object({
  name: z.string().trim().min(1, "Please tell us your name."),
  site: z.string().trim().min(1, "What's your campsite called?"),
  email: z
    .string()
    .trim()
    .min(1, "An email is required.")
    .pipe(z.email("That doesn't look like a valid email.")),
  password: z
    .string()
    .refine((v) => PW_REQUIREMENTS.every((r) => r.test(v)), {
      message: "Your password doesn't meet all the requirements yet.",
    }),
});

type Field = keyof z.infer<typeof SCHEMA>;
type ErrorKey = Field | "terms";
type Status = "idle" | "submitting" | "sent";

const RESEND_SECONDS = 60;

function validateField(field: Field, value: string) {
  const result = SCHEMA.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/* mono 12px text button styled like the auth chrome underline-links */
const monoButton =
  "font-spline text-[12px] font-medium text-ink-900 underline decoration-line decoration-[1px] underline-offset-[3px] transition-colors duration-200 hover:text-pine-700 hover:decoration-amber-500";

export default function SignupForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    site: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  const formRef = useRef<HTMLDivElement>(null);
  /* captured at submit so the notice keeps the form's height and the
     cross-fade doesn't collapse the centered column */
  const [minHeight, setMinHeight] = useState<number>();

  /* 60s resend countdown, running only while the notice is shown (§10.2) */
  const counting = status === "sent" && cooldown > 0;
  useEffect(() => {
    if (!counting) return;
    const id = window.setInterval(
      () => setCooldown((c) => Math.max(0, c - 1)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [counting]);

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const blur = (field: Field) => {
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;

    const parsed = SCHEMA.safeParse(values);
    const next: Partial<Record<ErrorKey, string>> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
    }
    if (!agreed)
      next.terms = "Please agree to the terms to create your account.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setMinHeight(formRef.current?.offsetHeight);
    setCooldown(RESEND_SECONDS);
    setStatus("submitting");

    // TODO(backend): replace this stub with the real Supabase signup — verify
    // the Turnstile token and rate-limit server-side, call auth.signUp, then
    // show this notice. On a duplicate email, still resolve to the notice
    // (never surface "already registered") to prevent account enumeration.
    window.setTimeout(() => setStatus("sent"), 900);
  };

  const resend = () => {
    // TODO(backend): trigger the Supabase confirmation-email resend here.
    setCooldown(RESEND_SECONDS);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        /* ---------- email-verification notice (§10.2 post-submit) ---------- */
        <motion.div
          key="notice"
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ minHeight }}
          className="flex flex-col justify-center"
        >
          <span
            className="font-spline text-[24px] font-medium leading-none text-pine-700"
            aria-hidden
          >
            ✓
          </span>
          <h1 className="mt-5 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
            Check your inbox.
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-[1.6] text-ink-muted">
            We sent a confirmation link to{" "}
            <span className="font-spline text-[0.875rem] font-medium break-all text-ink-900">
              {values.email.trim()}
            </span>
            .
          </p>
          {/* §10.3 — neutral, non-enumerating copy: the same notice appears
              whether or not the address already has an account */}
          <p className="mt-3 text-[0.875rem] leading-[1.6] text-ink-muted">
            If this email is new to Pakkia, that link finishes your account. If
            it already belongs to one, we&apos;ve sent a sign-in reminder
            instead — either way, nothing to worry about.
          </p>

          <p className="mt-5">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className={monoButton}
            >
              Use a different email
            </button>
          </p>

          <div className="mt-9 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-5">
            <span className="text-[0.875rem] text-ink-muted">
              Didn&apos;t get it?
            </span>
            {cooldown > 0 ? (
              <span className="font-spline text-[12px] font-medium text-ink-muted tabular-nums">
                Resend in 0:{String(cooldown).padStart(2, "0")}
              </span>
            ) : (
              <button type="button" onClick={resend} className={monoButton}>
                Resend the email
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* ---------- signup form (§10.2) ---------- */
        <motion.div
          key="form"
          ref={formRef}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <RevealGroup mode="mount">
            <RevealItem
              as="p"
              className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted"
            >
              Start free
            </RevealItem>
            <RevealItem
              as="h1"
              className="mt-4 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900"
            >
              Create your Pakkia account.
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-5 border-t border-line pt-4 font-spline text-[12px] font-medium text-ink-muted"
            >
              Free for a full month · no card required
            </RevealItem>

            <RevealItem className="mt-8">
              <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
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
                  label="Campsite name"
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

                <div>
                  <UnderlineField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={values.password}
                    error={errors.password}
                    onChange={(e) => update("password", e.target.value)}
                    onBlur={() => blur("password")}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-pressed={showPassword}
                        className="font-spline text-[12px] font-medium text-ink-muted transition-colors duration-200 hover:text-pine-700"
                      >
                        {showPassword ? "Hide" : "Show"}
                        <span className="sr-only"> password</span>
                      </button>
                    }
                  />
                  <p className="mt-2.5 font-spline text-[11px] leading-[1.6]">
                    {PW_REQUIREMENTS.map((req) => {
                      const met = req.test(values.password);
                      return (
                        <span
                          key={req.label}
                          className={`mr-3 inline-block whitespace-nowrap transition-colors duration-200 ${
                            met ? "text-pine-700" : "text-ink-muted"
                          }`}
                        >
                          <span aria-hidden>· </span>
                          {req.label}
                          <span className="sr-only">
                            {met ? " (met)" : " (not yet met)"}
                          </span>
                        </span>
                      );
                    })}
                  </p>
                </div>

                {/* legal consent — one custom checkbox in the Login style */}
                <div>
                  <label className="flex w-fit cursor-pointer items-start gap-3 select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (errors.terms)
                          setErrors((er) => ({ ...er, terms: undefined }));
                      }}
                      aria-invalid={errors.terms ? true : undefined}
                      aria-describedby={
                        errors.terms ? "su-terms-error" : undefined
                      }
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`mt-[3px] grid h-4 w-4 flex-none place-items-center rounded-[4px] border font-spline text-[11px] leading-none text-transparent transition-colors duration-200 peer-checked:border-pine-700 peer-checked:bg-pine-700 peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-500 ${
                        errors.terms ? "border-[#A65D45]" : "border-line"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-[0.875rem] leading-[1.6] text-ink-muted">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener"
                        className="text-ink-900 underline decoration-line decoration-[1px] underline-offset-[3px] transition-colors duration-200 hover:text-pine-700 hover:decoration-amber-500"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener"
                        className="text-ink-900 underline decoration-line decoration-[1px] underline-offset-[3px] transition-colors duration-200 hover:text-pine-700 hover:decoration-amber-500"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.terms && (
                    <p
                      id="su-terms-error"
                      role="alert"
                      className="mt-2 font-spline text-[12px] font-medium text-[#A65D45]"
                    >
                      {errors.terms}
                    </p>
                  )}
                </div>

                {/* TODO(backend): mount the Cloudflare Turnstile widget here
                    (site key via env) and pass its token with the signup
                    request — §10.3, invisible mode preferred, so the slot
                    stays empty and hidden until it is wired. */}
                <div id="turnstile-slot" className="self-start empty:hidden" />

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group mt-1 flex h-[46px] w-full items-stretch rounded-[6px] bg-pine-700 font-body text-[0.9375rem] font-medium leading-none text-cream transition-colors duration-200 hover:bg-pine-900 disabled:hover:bg-pine-700"
                >
                  <span className="flex flex-1 items-center justify-center px-[1.375rem]">
                    {status === "submitting" ? (
                      <span className="font-spline text-[0.875rem] font-medium">
                        Creating account…
                      </span>
                    ) : (
                      "Create account"
                    )}
                  </span>
                  <span
                    className="flex w-11 items-center justify-center border-l border-[rgba(245,242,234,0.25)]"
                    aria-hidden
                  >
                    {status === "submitting" ? (
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
              </form>
            </RevealItem>

            <RevealItem className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[0.9375rem] text-ink-muted">
              <span>Already using Pakkia?</span>
              <UnderlineLink href="/login" arrow>
                Log in
              </UnderlineLink>
            </RevealItem>
          </RevealGroup>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
