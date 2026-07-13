import Link from "next/link";
import { TentMark } from "@/components/site/primitives";
import { signOutAction } from "@/lib/auth-actions";

/* ------------------------------------------------------------------
   Shared full-screen notice for the gated states that are NOT a portal —
   /pending (awaiting approval) and /suspended. Nordic editorial: paper
   ground, a centred column, the tent logotype, an amber eyebrow, then the
   message and a real sign-out (server action, works without client JS).
------------------------------------------------------------------ */

export default function NoticeScreen({
  eyebrow,
  title,
  children,
  footnote,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  footnote?: React.ReactNode;
}) {
  return (
    <div className="home-nordic flex min-h-dvh flex-col bg-paper font-body text-ink-900">
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-10">
        <Link
          href="/"
          aria-label="Pakkia home"
          className="tap-target flex w-fit items-center gap-2 font-familjen text-[1.25rem] font-bold leading-none tracking-[-0.02em] text-pine-900"
        >
          <TentMark className="text-pine-700" />
          Pakkia
        </Link>
      </header>

      <main className="flex flex-1 items-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-[440px]">
          <p className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-amber-500">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-familjen text-[clamp(1.9rem,3.5vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
            {title}
          </h1>
          <div className="mt-5 space-y-3 text-[0.9375rem] leading-[1.6] text-ink-muted">
            {children}
          </div>

          <div className="mt-9 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-line pt-5">
            <span className="font-spline text-[12px] font-medium text-ink-muted">
              {footnote}
            </span>
            {/* Real sign-out — server action clears the session, then /login. */}
            <form action={signOutAction}>
              <button
                type="submit"
                className="tap-target font-spline text-[12px] font-medium text-ink-900 underline decoration-line decoration-[1px] underline-offset-[3px] transition-colors duration-200 hover:text-pine-700 hover:decoration-amber-500"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
