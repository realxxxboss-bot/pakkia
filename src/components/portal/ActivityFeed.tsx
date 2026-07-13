"use client";

/* ------------------------------------------------------------------
   ActivityFeed / audit ticker (PORTAL_SPEC A2) — reused across dashboards.
   Ruled rows: [24px square avatar][text — actor weight 500, values in mono]
   [timestamp mono right]. New (realtime) rows enter with a single
   --paper-deep flash fading over 1.2s (the .rt-flash keyframe) — no slide.
------------------------------------------------------------------ */

import Link from "next/link";
import type { ReactNode } from "react";
import type { AuditEvent } from "./audit-store";
import { StatusMark } from "./StatusMark";

const TONE_SQUARE: Record<string, string> = {
  record: "bg-pine-700",
  settings: "border border-ink-muted bg-transparent",
  danger: "bg-terracotta",
  support: "bg-amber-500",
  info: "bg-pine-700",
};

export function ActivityFeed({
  events,
  limit,
  title,
  live = false,
  footer,
}: {
  events: AuditEvent[];
  limit?: number;
  title?: string;
  live?: boolean;
  footer?: ReactNode;
}) {
  const rows = limit ? events.slice(0, limit) : events;

  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-paper">
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line bg-paper-deep px-5 py-3">
          <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
            {title}
          </span>
          {live && <StatusMark variant="live" label="LIVE" />}
        </div>
      )}
      <ul>
        {rows.map((e) => (
          <li
            key={e.id}
            className={`flex items-start gap-3 border-b border-line px-5 py-3.5 last:border-0 ${
              e.fresh ? "rt-flash" : ""
            }`}
          >
            <span
              className="mt-0.5 grid size-6 flex-none place-items-center rounded-[6px] bg-pine-100 font-spline text-[10px] text-pine-900"
              aria-hidden
            >
              {e.actorInitials}
            </span>
            <p className="min-w-0 flex-1 text-[0.875rem] leading-snug text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                {e.tone && (
                  <span className={`size-[7px] flex-none ${TONE_SQUARE[e.tone]}`} aria-hidden />
                )}
                <span className="font-medium text-ink-900">{e.actor}</span>
              </span>{" "}
              {e.event.toLowerCase()}
              {e.target &&
                (e.targetHref ? (
                  <>
                    {" "}
                    <Link
                      href={e.targetHref}
                      className="font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-2 hover:decoration-amber-500"
                    >
                      {e.target}
                    </Link>
                  </>
                ) : (
                  <> <span className="font-medium text-ink-900">{e.target}</span></>
                ))}
              {e.detail && <span className="font-spline text-ink-muted"> · {e.detail}</span>}
            </p>
            <span className="flex-none font-spline text-[11px] text-ink-muted">{e.time}</span>
          </li>
        ))}
      </ul>
      {footer && <div className="border-t border-line px-5 py-3">{footer}</div>}
    </div>
  );
}
