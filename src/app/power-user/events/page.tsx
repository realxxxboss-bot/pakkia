"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ConfirmModal,
  ContentHeader,
  Drawer,
  Field,
  MonthCalendar,
  Menu,
  MenuItem,
  MenuRule,
  RowMenuButton,
  SplitButton,
  SquareToggle,
  StatusMark,
  UnderlineInput,
  UnderlineSelect,
  useAudit,
  useToast,
  type CalendarDay,
} from "@/components/portal";
import {
  DOW,
  MONTH,
  eventScopes,
  events as seedEvents,
  staff,
  today,
  type EventScope,
  type PortalEvent,
} from "../data";

const MONTH_ABBR = "JUN";

/** "2026-06-20" + "2026-06-22" → { days: [20,21,22], range: "20–22 JUN" }. */
function rangeFrom(from: string, to: string) {
  const start = Number(from.split("-")[2] ?? 0);
  const end = Number((to || from).split("-")[2] ?? 0) || start;
  const [lo, hi] = start <= end ? [start, end] : [end, start];
  const days = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  return {
    days,
    range: lo === hi ? `${lo} ${MONTH_ABBR}` : `${lo}–${hi} ${MONTH_ABBR}`,
  };
}

export default function PowerUserEvents() {
  const toast = useToast();
  const { log } = useAudit();

  const [list, setList] = useState<PortalEvent[]>(seedEvents);
  const [hovered, setHovered] = useState<ReadonlySet<number>>(new Set());

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PortalEvent | null>(null);
  const [deleting, setDeleting] = useState<PortalEvent | null>(null);

  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("2026-06-20");
  const [to, setTo] = useState("2026-06-20");
  const [scope, setScope] = useState<EventScope>("Site-wide");
  const [visible, setVisible] = useState(true);

  // Sync the form whenever the drawer opens — new event or edit.
  useEffect(() => {
    if (!drawerOpen) return;
    if (editing) {
      const days = editing.days;
      setTitle(editing.name);
      setFrom(`2026-06-${String(days[0]).padStart(2, "0")}`);
      setTo(`2026-06-${String(days[days.length - 1]).padStart(2, "0")}`);
      setScope(editing.scope);
      setVisible(editing.visible);
    } else {
      setTitle("");
      setFrom("2026-06-20");
      setTo("2026-06-20");
      setScope("Site-wide");
      setVisible(true);
    }
  }, [drawerOpen, editing]);

  const sorted = useMemo(() => [...list].sort((a, b) => a.days[0] - b.days[0]), [list]);
  const eventDays = useMemo(() => new Set(list.flatMap((e) => e.days)), [list]);

  const calendarDays: CalendarDay[] = Array.from({ length: MONTH.days }, (_, i) => ({
    day: i + 1,
    value: null,
    event: eventDays.has(i + 1),
  }));

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  const save = () => {
    const { days, range } = rangeFrom(from, to);
    const name = title.trim() || "Untitled event";
    if (editing) {
      setList((prev) =>
        prev.map((e) =>
          e.id === editing.id ? { ...e, name, days, range, scope, visible } : e,
        ),
      );
      log({
        actor: staff.name,
        actorInitials: staff.initials,
        event: "Edited event",
        target: name,
        detail: `${range} · ${visible ? "Visible" : "Internal"}`,
        tone: "settings",
      });
      toast({ message: `${name} updated.`, variant: "success" });
    } else {
      const created: PortalEvent = {
        id: `e-${name.toLowerCase().replace(/\W+/g, "-")}-${days[0]}`,
        name,
        days,
        range,
        scope,
        visible,
      };
      setList((prev) => [...prev, created]);
      log({
        actor: staff.name,
        actorInitials: staff.initials,
        event: "Created event",
        target: name,
        detail: `${range} · ${scope}`,
        tone: "settings",
      });
      toast({ message: `${name} added to the calendar.`, variant: "success" });
    }
    closeDrawer();
  };

  const toggleVisible = (e: PortalEvent, next: boolean) => {
    setList((prev) => prev.map((x) => (x.id === e.id ? { ...x, visible: next } : x)));
    log({
      actor: staff.name,
      actorInitials: staff.initials,
      event: next ? "Made event visible" : "Made event internal",
      target: e.name,
      detail: next ? "Visible to holders" : "Staff only",
      tone: "settings",
    });
    toast({
      message: `${e.name} is now ${next ? "visible to holders" : "internal"}.`,
      variant: "info",
      onUndo: () =>
        setList((prev) => prev.map((x) => (x.id === e.id ? { ...x, visible: !next } : x))),
    });
  };

  const remove = (e: PortalEvent) => {
    setList((prev) => prev.filter((x) => x.id !== e.id));
    log({
      actor: staff.name,
      actorInitials: staff.initials,
      event: "Deleted event",
      target: e.name,
      detail: e.range,
      tone: "danger",
    });
    toast({ message: `${e.name} deleted.`, variant: "danger" });
  };

  return (
    <>
      <ContentHeader
        title="Events"
        description="Highlight special dates on the calendar — holders see the ones you mark visible when logging nights."
        action={
          <SplitButton
            label="Add event"
            size="compact"
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:items-start [&>*]:min-w-0">
        {/* Event list — hovering a row outlines its days in the calendar. */}
        <div className="overflow-hidden rounded-[12px] border border-line bg-paper">
          <div className="border-b border-line bg-paper-deep px-5 py-3">
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Upcoming &amp; recent
            </span>
          </div>
          <ul>
            {sorted.map((e) => (
              <li
                key={e.id}
                onMouseEnter={() => setHovered(new Set(e.days))}
                onMouseLeave={() => setHovered(new Set())}
                onFocus={() => setHovered(new Set(e.days))}
                onBlur={() => setHovered(new Set())}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-5 py-3.5 transition-colors duration-150 last:border-0 hover:bg-paper-deep"
              >
                <span className="w-[74px] flex-none font-spline text-[12px] tabular-nums text-ink-muted">
                  {e.range}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium text-ink-900">
                  {e.name}
                </span>
                <span className="flex-none font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                  {e.scope}
                </span>
                <StatusMark
                  variant={e.visible ? "active" : "pending"}
                  label={e.visible ? "Visible" : "Internal"}
                  className="w-[78px] flex-none"
                />
                <SquareToggle
                  checked={e.visible}
                  onChange={(v) => toggleVisible(e, v)}
                  label={`${e.name} visible to holders`}
                />
                <Menu
                  label={`Actions for ${e.name}`}
                  trigger={({ open, toggle }) => (
                    <RowMenuButton open={open} toggle={toggle} label={`Actions for ${e.name}`} />
                  )}
                >
                  <MenuItem
                    onClick={() => {
                      setEditing(e);
                      setDrawerOpen(true);
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuRule />
                  <MenuItem destructive onClick={() => setDeleting(e)}>
                    Delete
                  </MenuItem>
                </Menu>
              </li>
            ))}
          </ul>
        </div>

        {/* Read-only month calendar. */}
        <MonthCalendar
          monthLabel={MONTH.label}
          monthName={MONTH.name}
          days={calendarDays}
          startOffset={MONTH.startOffset}
          dow={DOW}
          today={today.day}
          highlight={hovered}
          numerals="date"
          footer={
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-spline text-[11px] text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span
                  className="relative size-3.5 rounded-[3px] border border-line"
                  aria-hidden
                >
                  <span className="absolute inset-x-0.5 bottom-[2px] h-[2px] rounded-full bg-amber-500" />
                </span>
                EVENT DAY
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="size-3.5 rounded-[3px] outline outline-1 outline-amber-500 outline-offset-[-1px]"
                  aria-hidden
                />
                TODAY
              </span>
              <span>Hover an event to find its days.</span>
            </div>
          }
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editing ? "Edit event" : "Add event"}
        description="Events sit on the calendar for the dates you choose."
        footer={
          <>
            <button
              type="button"
              onClick={closeDrawer}
              className="tap-target text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:text-pine-700 hover:decoration-amber-500"
            >
              Cancel
            </button>
            <SplitButton label="Save event" size="compact" onClick={save} />
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Field label="Title">
            <UnderlineInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Midsummer · Juhannus"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4 [&>*]:min-w-0">
            <Field label="From">
              <UnderlineInput
                mono
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </Field>
            <Field label="To">
              <UnderlineInput
                mono
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Scope">
            <UnderlineSelect
              value={scope}
              onChange={(e) => setScope(e.target.value as EventScope)}
            >
              {eventScopes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </UnderlineSelect>
          </Field>

          <div className="flex items-start justify-between gap-4 border-t border-line pt-4">
            <span className="min-w-0">
              <span className="block text-[0.9375rem] text-ink-900">
                Visible to pitch holders
              </span>
              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-muted">
                Holders see visible events on their logging calendar.
              </span>
            </span>
            <SquareToggle
              checked={visible}
              onChange={setVisible}
              label="Visible to pitch holders"
            />
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete ${deleting?.name ?? "event"}?`}
        consequence="The event disappears from the calendar for staff and holders. Nights logged on those days are unaffected."
        confirmLabel="Delete event"
        onConfirm={() => deleting && remove(deleting)}
      />
    </>
  );
}
