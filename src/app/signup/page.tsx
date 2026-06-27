"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Field, TextInput, PasswordInput } from "@/components/auth/fields";
import { Arrow, btn } from "@/components/ui";

type FieldName =
  | "name"
  | "email"
  | "org"
  | "password"
  | "confirm"
  | "terms";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initial = {
  name: "",
  email: "",
  org: "",
  password: "",
  confirm: "",
};

export default function SignupPage() {
  const [values, setValues] = useState(initial);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [done, setDone] = useState(false);

  const update = (field: keyof typeof initial, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!values.name.trim()) next.name = "Please enter your full name.";
    if (!values.email.trim()) next.email = "A work email is required.";
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = "That doesn't look like a valid email.";
    if (!values.org.trim())
      next.org = "Tell us which campsite you're setting up.";
    if (!values.password) next.password = "Choose a password.";
    else if (values.password.length < 8)
      next.password = "Use at least 8 characters.";
    if (!values.confirm) next.confirm = "Confirm your password.";
    else if (values.confirm !== values.password)
      next.confirm = "Passwords don't match.";
    if (!terms) next.terms = "Please accept the terms to continue.";
    return next;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  return (
    <AuthLayout
      eyebrow="Create your workspace"
      title="Start your campsite on Pakkia"
      subtitle="Set up your organisation, invite your team, and run a full month free. No card required."
      altPrompt="Already have an account?"
      altLabel="Log in"
      altHref="/login"
    >
      {done ? (
        <ConfirmationPanel name={values.name} email={values.email} />
      ) : (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
          <Field id="su-name" label="Full name" error={errors.name}>
            <TextInput
              id="su-name"
              value={values.name}
              onChange={(v) => update("name", v)}
              autoComplete="name"
              placeholder="Aino Korhonen"
              error={errors.name}
            />
          </Field>

          <Field id="su-email" label="Work email" error={errors.email}>
            <TextInput
              id="su-email"
              type="email"
              value={values.email}
              onChange={(v) => update("email", v)}
              autoComplete="email"
              placeholder="you@yoursite.fi"
              error={errors.email}
            />
          </Field>

          <Field
            id="su-org"
            label="Campsite / organisation"
            error={errors.org}
          >
            <TextInput
              id="su-org"
              value={values.org}
              onChange={(v) => update("org", v)}
              autoComplete="organization"
              placeholder="Rairanta Camping"
              error={errors.org}
            />
          </Field>

          <Field id="su-password" label="Password" error={errors.password}>
            <PasswordInput
              id="su-password"
              value={values.password}
              onChange={(v) => update("password", v)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={errors.password}
            />
          </Field>

          <Field
            id="su-confirm"
            label="Confirm password"
            error={errors.confirm}
          >
            <PasswordInput
              id="su-confirm"
              value={values.confirm}
              onChange={(v) => update("confirm", v)}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              error={errors.confirm}
            />
          </Field>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="su-terms"
              className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug text-secondary"
            >
              <input
                id="su-terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  if (errors.terms)
                    setErrors((er) => ({ ...er, terms: undefined }));
                }}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? "su-terms-err" : undefined}
                className="mt-0.5 h-[18px] w-[18px] flex-none rounded-[5px] border-border-strong text-primary accent-[var(--color-primary)] focus-visible:outline-2"
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="font-medium text-primary underline-offset-2 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="font-medium text-primary underline-offset-2 hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.terms && (
              <p id="su-terms-err" className="text-[13px] font-medium text-error" role="alert">
                {errors.terms}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`${btn.base} ${btn.primary} mt-1 w-full justify-center`}
          >
            Create account <Arrow />
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

function ConfirmationPanel({ name, email }: { name: string; email: string }) {
  const firstName = name.trim().split(" ")[0] || "there";
  return (
    <div className="rounded-[16px] border border-border bg-surface p-7 shadow-sm">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-[12px] bg-primary-tint text-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 className="text-[21px]">You&apos;re all set, {firstName}.</h2>
      <p className="mt-2.5 text-[15px] leading-[1.55] text-secondary">
        This is a demo, so no account was created. On the live product
        we&apos;d send a confirmation link to{" "}
        <span className="font-semibold text-ink">{email}</span> to verify your
        workspace.
      </p>
      <Link
        href="/login"
        className={`${btn.base} ${btn.ghost} mt-6 w-full justify-center`}
      >
        Continue to log in
      </Link>
    </div>
  );
}
