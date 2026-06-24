"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Field, TextInput, PasswordInput } from "@/components/auth/fields";
import { Arrow, btn } from "@/components/ui";

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
    </AuthLayout>
  );
}
