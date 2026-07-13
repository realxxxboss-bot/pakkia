"use client";

/* Login form (inner-pages spec §9.2) — editorial underline fields directly
   on paper. The submit is a local placeholder until the Supabase phase: it
   always resolves to a failed sign-in after a short delay (no account can
   log in yet), exercising the generic error strip — which never reveals
   which field was wrong. Swap `signIn` for the real call and route on
   success; nothing else should need to change.

   §9.3: the dev quick-login block is compiled out of production bundles — its
   render is gated on a `process.env.NODE_ENV` literal the minifier folds, so
   the panel and its handlers are dead-code-eliminated. The mock-session store
   in lib/devAuth.ts is additionally a no-op outside development. */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import UnderlineField from "@/components/site/UnderlineField";
import { UnderlineLink } from "@/components/site/primitives";
import { EASE, RevealGroup, RevealItem } from "@/components/site/reveal";
import { Spinner } from "@/components/site/spinner";
import { ROLES, useDevAuth } from "@/lib/devAuth";

const SCHEMA = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .pipe(z.email("That doesn't look like a valid email.")),
  password: z.string().min(1, "Enter your password."),
});

type Field = keyof z.infer<typeof SCHEMA>;
type Status = "idle" | "submitting";

function validateField(field: Field, value: string) {
  const result = SCHEMA.shape[field].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

// TODO(backend): replace with supabase.auth.signInWithPassword and route to
// the caller's portal on success. Until then no account can sign in — the
// stub ignores the credentials and fails after a realistic delay so the
// error strip stays honest. The typed signature keeps the call site ready.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function signIn(email: string, password: string): Promise<{ ok: boolean }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ok: false }), 900),
  );
}

export default function LoginForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [authFailed, setAuthFailed] = useState(false);

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const blur = (field: Field) => {
    setErrors((e) => ({ ...e, [field]: validateField(field, values[field]) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

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

    setAuthFailed(false);
    setStatus("submitting");
    const { ok } = await signIn(values.email, values.password);
    if (!ok) {
      setStatus("idle");
      setAuthFailed(true);
    }
    // success routing lands with the Supabase phase
  };

  return (
    <RevealGroup mode="mount">
      <RevealItem
        as="p"
        className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted"
      >
        Welcome back
      </RevealItem>
      <RevealItem
        as="h1"
        className="mt-4 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900"
      >
        Log in to Pakkia.
      </RevealItem>

      <RevealItem className="mt-9">
        <AnimatePresence initial={false}>
          {authFailed && (
            <motion.div
              key="auth-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              {/* generic on purpose — never reveal which field was wrong */}
              <p
                role="alert"
                className="mb-7 border-l-2 border-[#A65D45] py-0.5 pl-4 text-[0.875rem] leading-[1.55] text-[#A65D45]"
              >
                That email or password didn&apos;t match. Try again or reset
                your password.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
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
              autoComplete="current-password"
              placeholder="Your password"
              value={values.password}
              error={errors.password}
              onChange={(e) => update("password", e.target.value)}
              onBlur={() => blur("password")}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                  className="tap-target font-spline text-[12px] font-medium text-ink-muted transition-colors duration-200 hover:text-pine-700"
                >
                  {showPassword ? "Hide" : "Show"}
                  <span className="sr-only"> password</span>
                </button>
              }
            />
            <div className="mt-3 flex justify-end text-[12px]">
              {/* TODO(backend): the reset flow ships with the Supabase phase */}
              <UnderlineLink href="#" mono>
                Forgot password?
              </UnderlineLink>
            </div>
          </div>

          <label className="flex w-fit cursor-pointer items-center gap-2.5 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="grid h-4 w-4 place-items-center rounded-[4px] border border-line font-spline text-[11px] leading-none text-transparent transition-colors duration-200 peer-checked:border-pine-700 peer-checked:bg-pine-700 peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-500"
            >
              ✓
            </span>
            <span className="text-[0.875rem] leading-none text-ink-muted">
              Keep me signed in
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group mt-1 flex h-[46px] w-full items-stretch rounded-[6px] bg-pine-700 font-body text-[0.9375rem] font-medium leading-none text-cream transition-colors duration-200 hover:bg-pine-900 disabled:hover:bg-pine-700"
          >
            <span className="flex flex-1 items-center justify-center px-[1.375rem]">
              {status === "submitting" ? (
                <span className="font-spline text-[0.875rem] font-medium">
                  Signing in…
                </span>
              ) : (
                "Sign in"
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

      <RevealItem className="mt-10 border-t border-line pt-5 text-[0.9375rem] text-ink-muted">
        New to Pakkia?{" "}
        <UnderlineLink href="/signup" arrow className="ml-0.5">
          Start free
        </UnderlineLink>
      </RevealItem>

      {/* §9.3 — gated on a same-module `process.env.NODE_ENV` literal so the
          minifier folds the branch to false and dead-code-eliminates the whole
          DevQuickLogin subtree (panel + its signInAs/route calls) from every
          production bundle. An imported flag would defeat this. Verified after
          build. Still renders under `next dev`. */}
      {process.env.NODE_ENV !== "production" && (
        <RevealItem>
          <DevQuickLogin />
        </RevealItem>
      )}
    </RevealGroup>
  );
}

/* §9.3 dev-only quick login — one-click entry into each portal's mock
   session. The call site above is statically eliminated from production
   builds; this stays working locally in development. */
function DevQuickLogin() {
  const router = useRouter();
  const { signInAs } = useDevAuth();

  return (
    <section
      aria-labelledby="dev-login-heading"
      className="mt-12 border-t border-dashed border-line pt-6"
    >
      <h2
        id="dev-login-heading"
        className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
      >
        Dev only · Quick login
      </h2>
      <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-muted">
        Local shortcut into each portal — compiled out of production builds.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => {
              signInAs(r.key);
              router.push(r.path);
            }}
            className="tap-min rounded-[6px] border border-line px-3.5 py-2.5 text-left text-[0.8125rem] font-medium text-ink-900 transition-colors duration-200 hover:border-pine-700"
          >
            {r.label}
          </button>
        ))}
      </div>
    </section>
  );
}
