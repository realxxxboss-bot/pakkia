"use server";

/* ------------------------------------------------------------------
   Real auth server actions (Supabase). Called from the Login / Signup client
   forms and the portal / notice sign-out controls. All validation is
   re-run here server-side — the client Zod pass is UX only.

   redirect() throws a control-flow signal, so it is always called OUTSIDE any
   try/catch (catching it would swallow the navigation).
------------------------------------------------------------------ */

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "./supabase/server";
import { getSessionProfile, postAuthPath } from "./auth";

/* ---------- LOGIN ---------- */

const LoginInput = z.object({
  email: z.string().trim().min(1).pipe(z.email()),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

export type LoginResult = { ok: false };

export async function signInAction(
  input: z.input<typeof LoginInput>,
): Promise<LoginResult> {
  const parsed = LoginInput.safeParse(input);
  if (!parsed.success) return { ok: false };

  const { email, password, remember = true } = parsed.data;
  const supabase = await createClient({ remember });

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false };

  const { profile } = await getSessionProfile();
  // A signed-in user with no profile row is an inconsistent state; treat as
  // a failed login rather than stranding them in a portal they can't load.
  if (!profile) {
    await supabase.auth.signOut();
    return { ok: false };
  }

  redirect(postAuthPath(profile));
}

/* ---------- SIGNUP ---------- */

const SignupInput = z.object({
  name: z.string().trim().min(1),
  site: z.string().trim().min(1),
  email: z.string().trim().min(1).pipe(z.email()),
  password: z
    .string()
    .min(8)
    .refine((v) => /\d/.test(v) && /[A-Z]/.test(v)),
});

// `notice` → show the neutral, non-enumerating "check your inbox" screen
// (also used for a duplicate email, so signup never confirms an account
// exists). `redirect` is thrown, not returned.
export type SignupResult =
  | { status: "notice" }
  | { status: "error"; message: string };

const GENERIC_ERROR =
  "We couldn't create your account just now. Please try again in a moment.";

function looksLikeDuplicate(message: string, code?: string): boolean {
  const m = message.toLowerCase();
  return (
    code === "user_already_exists" ||
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("already exists")
  );
}

export async function signUpAction(
  input: z.input<typeof SignupInput>,
): Promise<SignupResult> {
  const parsed = SignupInput.safeParse(input);
  if (!parsed.success) return { status: "error", message: GENERIC_ERROR };

  const { name, site, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // The DB trigger handle_new_user() reads these from raw_user_meta_data.
    options: { data: { full_name: name, campsite_name: site } },
  });

  if (error) {
    // Never reveal that an address already has an account (§10.3).
    if (looksLikeDuplicate(error.message, error.code)) return { status: "notice" };
    return { status: "error", message: GENERIC_ERROR };
  }

  // Email confirmation ON, or a duplicate returned without an error (Supabase
  // hands back a user with empty identities) → neutral notice, no session.
  const noSession = !data.session;
  const dupNoError = (data.user?.identities?.length ?? 0) === 0;
  if (noSession || dupNoError) return { status: "notice" };

  // Confirmation is OFF and a real session came back → route by role/status.
  const { profile } = await getSessionProfile();
  if (!profile) return { status: "notice" };

  redirect(postAuthPath(profile));
}

/* ---------- SIGN OUT ---------- */

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
