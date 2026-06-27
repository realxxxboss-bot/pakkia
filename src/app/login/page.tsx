"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Field, TextInput, PasswordInput } from "@/components/auth/fields";
import { Arrow, btn } from "@/components/ui";
import { ROLES, useDevAuth, type Role } from "@/lib/devAuth";

type FieldName = "email" | "password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Partial<Record<FieldName, string>> = {};
    if (!email.trim()) next.email = "Enter your email.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "That doesn't look like a valid email.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to Pakkia"
      subtitle="Pick up where you left off and log the nights that matter."
      altPrompt="New to Pakkia?"
      altLabel="Start free"
      altHref="/signup"
    >
      {done ? (
        <div
          className="rounded-[16px] border border-border bg-surface p-7 shadow-sm"
          role="status"
        >
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-[12px] bg-primary-tint text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className="text-[21px]">Signed in (almost).</h2>
          <p className="mt-2.5 text-[15px] leading-[1.55] text-secondary">
            This is a demo, so no session was created. On the live product
            you&apos;d land on your dashboard now. You can preview the Pitch
            Holder portal below.
          </p>
          <Link
            href="/pitch-holder/dashboard"
            className={`${btn.base} ${btn.primary} mt-6 w-full justify-center`}
          >
            Open the demo portal <Arrow />
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
          <Field id="li-email" label="Email" error={errors.email}>
            <TextInput
              id="li-email"
              type="email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              autoComplete="email"
              placeholder="you@yoursite.fi"
              error={errors.email}
            />
          </Field>

          <Field
            id="li-password"
            label="Password"
            error={errors.password}
            hint={
              <Link
                href="#"
                className="text-[12.5px] font-medium text-primary transition-colors hover:text-primary-dark"
              >
                Forgot password?
              </Link>
            }
          >
            <PasswordInput
              id="li-password"
              value={password}
              onChange={(v) => {
                setPassword(v);
                if (errors.password)
                  setErrors((e) => ({ ...e, password: undefined }));
              }}
              autoComplete="current-password"
              placeholder="Your password"
              error={errors.password}
            />
          </Field>

          <label
            htmlFor="li-remember"
            className="flex cursor-pointer items-center gap-3 text-[14px] text-secondary"
          >
            <input
              id="li-remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-[18px] w-[18px] flex-none rounded-[5px] border-border-strong accent-[var(--color-primary)] focus-visible:outline-2"
            />
            Keep me signed in
          </label>

          <button
            type="submit"
            className={`${btn.base} ${btn.primary} mt-1 w-full justify-center`}
          >
            Sign in <Arrow />
          </button>
        </form>
      )}

      <DevQuickLogin />
    </AuthLayout>
  );
}

/* ------------------------------------------------------------------
   Temporary dev shortcut: jump straight into any role's portal without a
   backend. Sets the mock session, then routes to that role's base path.
   Remove this whole block once real auth ships.
------------------------------------------------------------------ */
function DevQuickLogin() {
  const router = useRouter();
  const { signInAs } = useDevAuth();

  const enter = (role: Role, path: string) => {
    signInAs(role);
    router.push(path);
  };

  return (
    <section
      aria-labelledby="dev-login-heading"
      className="mt-10 rounded-[14px] border border-dashed border-border-strong bg-subtle/60 p-5"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="rounded-[5px] bg-amber/15 px-1.5 py-0.5 font-eyebrow text-[10px] font-bold tracking-[0.12em] text-amber-ink uppercase">
          Dev only
        </span>
        <h2
          id="dev-login-heading"
          className="font-eyebrow text-[11px] font-semibold tracking-[0.1em] text-secondary uppercase"
        >
          Quick login
        </h2>
      </div>
      <p className="mb-4 text-[13px] leading-[1.5] text-muted">
        Temporary shortcut into each portal — no backend, no real session.
        Removed before launch.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => enter(r.key, r.path)}
            className="group flex flex-col items-start gap-0.5 rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-left transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] hover:border-border-strong hover:bg-subtle active:scale-[0.98] focus-visible:outline-2"
          >
            <span className="flex w-full items-center justify-between gap-2 text-[14px] font-semibold text-ink">
              {r.label}
              <Arrow className="text-muted" />
            </span>
            <span className="text-[12px] leading-[1.4] text-muted">
              {r.blurb}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
