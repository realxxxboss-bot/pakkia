"use client";

/* Change password (PORTAL_SPEC B4.4 §5) — a drawer, like every other form in
   the app. Never a centered modal; those are reserved for destructive
   confirms. */

import { useState } from "react";
import {
  Drawer,
  Field,
  SplitButton,
  UnderlineInput,
  UnderlineLink,
  useAudit,
  useToast,
} from "@/components/portal";
import { holder } from "../data";

export function PasswordDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const { log } = useAudit();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError(null);
    onClose();
  };

  const submit = () => {
    if (!current) return setError("Enter your current password.");
    if (next.length < 8) return setError("Use at least 8 characters.");
    if (next !== confirm) return setError("The two new passwords don't match.");
    log({
      actor: holder.name,
      actorInitials: holder.initials,
      event: "Changed password",
      tone: "settings",
    });
    toast({ message: "Password updated.", variant: "success" });
    close();
  };

  return (
    <Drawer
      open={open}
      onClose={close}
      title="Change password"
      description="You'll stay signed in on this device."
      footer={
        <>
          <UnderlineLink onClick={close} className="text-[0.875rem]">
            Cancel
          </UnderlineLink>
          <SplitButton size="compact" label="Update password" onClick={submit} />
        </>
      }
    >
      <div className="flex flex-col gap-7">
        <Field label="Current password" htmlFor="pw-current">
          <UnderlineInput
            id="pw-current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </Field>
        <Field label="New password" htmlFor="pw-new" hint="At least 8 characters.">
          <UnderlineInput
            id="pw-new"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </Field>
        <Field label="Repeat new password" htmlFor="pw-confirm">
          <UnderlineInput
            id="pw-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        {error && (
          <p role="alert" className="text-[0.875rem] text-terracotta">
            {error}
          </p>
        )}
      </div>
    </Drawer>
  );
}
