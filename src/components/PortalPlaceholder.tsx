"use client";

/* Stand-in for a role's portal until the real dashboards are built.
   Confirms the dev mock session works (shows who you're signed in as),
   and lets you hop between roles or sign out. Not a real dashboard. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { Arrow } from "@/components/ui";
import { ROLES, ROLE_BY_KEY, useDevAuth, type Role } from "@/lib/devAuth";

export function PortalPlaceholder({ role }: { role: Role }) {
  const meta = ROLE_BY_KEY[role];
  const router = useRouter();
  const { role: session, ready, signInAs, signOut } = useDevAuth();

  const switchTo = (next: Role) => {
    signInAs(next);
    router.push(ROLE_BY_KEY[next].path);
  };

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  const others = ROLES.filter((r) => r.key !== role);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg">
      {/* top bar */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            aria-label="Pakkia home"
            className="flex items-center gap-2.5 font-heading text-[18px] font-semibold tracking-[-0.02em] text-ink"
          >
            <BrandMark size={26} />
            Pakkia
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="hidden rounded-[6px] bg-amber/15 px-2 py-1 font-eyebrow text-[10px] font-bold tracking-[0.12em] text-amber-ink uppercase sm:inline">
              Dev preview
            </span>
            <span className="rounded-full bg-primary-tint px-3 py-1.5 font-eyebrow text-[11px] font-semibold tracking-[0.04em] text-primary-dark">
              {ready ? (session ? ROLE_BY_KEY[session].label : "No session") : "…"}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-[9px] px-3 py-2 text-[14px] font-semibold text-secondary transition-colors duration-150 hover:text-ink focus-visible:outline-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* body */}
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <div className="rise rise-1 max-w-[640px]">
          <p className="font-eyebrow text-[12px] font-semibold tracking-[0.16em] text-primary uppercase">
            {meta.label} portal
          </p>
          <h1 className="mt-3 text-[clamp(30px,4.5vw,46px)] leading-[1.05]">
            Welcome to the {meta.label.toLowerCase()} portal.
          </h1>
          <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.6] text-secondary">
            {meta.blurb} This dashboard is still being built — for now it
            confirms the role router lands you in the right place.
          </p>

          <div className="mt-7 inline-flex items-center gap-2.5 rounded-[10px] border border-border bg-surface px-4 py-3 text-[14px] text-secondary shadow-xs">
            <span className="grid h-7 w-7 flex-none place-items-center rounded-[8px] bg-primary-tint text-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
              </svg>
            </span>
            Dashboard coming soon
          </div>
        </div>

        {/* dev role switcher */}
        <section
          aria-labelledby="switch-heading"
          className="rise rise-2 mt-14 border-t border-border pt-8"
        >
          <h2
            id="switch-heading"
            className="font-eyebrow text-[11px] font-semibold tracking-[0.1em] text-muted uppercase"
          >
            Switch portal · dev
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {others.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => switchTo(r.key)}
                className="group flex flex-col items-start gap-1 rounded-[12px] border border-border bg-surface p-4 text-left transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] hover:border-border-strong hover:bg-subtle active:scale-[0.98] focus-visible:outline-2"
              >
                <span className="flex w-full items-center justify-between gap-2 text-[15px] font-semibold text-ink">
                  {r.label}
                  <Arrow className="text-muted" />
                </span>
                <span className="text-[12.5px] leading-[1.45] text-muted">
                  {r.blurb}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
