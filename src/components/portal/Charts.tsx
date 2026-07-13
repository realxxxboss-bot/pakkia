"use client";

/* ------------------------------------------------------------------
   Charts (PORTAL_SPEC A2 "Charts") — the site-wide chart language, all via
   Recharts, restyled to the instrument aesthetic: horizontal 1px --line
   grid only, mono axis labels with no axis lines, 1.5px --pine-700 line
   with the last point as a 7px --amber square, --pine-700 bars (current =
   --amber, hover = --pine-900), and a --pine-900 mono tooltip.
   Donuts are replaced by SegmentedBar (see HeatCell.tsx).
------------------------------------------------------------------ */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartDatum = { label: string; value: number };

const AXIS_TICK = {
  fontSize: 11,
  fontFamily: "var(--font-spline)",
  fill: "var(--color-ink-muted)",
} as const;

function InstrumentTooltip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-[6px] bg-pine-900 px-2.5 py-1.5 font-spline text-[12px] text-cream">
      <span className="text-cream-muted">{label} · </span>
      {prefix}
      {payload[0]?.value?.toLocaleString("en-US")}
      {suffix}
    </div>
  );
}

/* Amber square marker for the last data point. */
function AmberSquare({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx == null || cy == null) return <g />;
  return (
    <rect x={cx - 3.5} y={cy - 3.5} width={7} height={7} fill="var(--color-amber-500)" />
  );
}

export function LineChartMini({
  data,
  height = 200,
  prefix = "",
  suffix = "",
}: {
  data: ChartDatum[];
  height?: number;
  prefix?: string;
  suffix?: string;
}) {
  const last = data[data.length - 1];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke="var(--color-line)" strokeWidth={1} />
        <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} dy={6} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          width={44}
          tickFormatter={(v: number) => `${prefix}${v}`}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-line)" }}
          content={<InstrumentTooltip prefix={prefix} suffix={suffix} />}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-pine-700)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "var(--color-pine-700)" }}
          isAnimationActive
          animationDuration={400}
        />
        {last && (
          <ReferenceDot x={last.label} y={last.value} r={0} shape={<AmberSquare />} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarChartMini({
  data,
  height = 200,
  currentIndex,
  prefix = "",
  suffix = "",
}: {
  data: ChartDatum[];
  height?: number;
  /** Index of the "current"/"today" bar rendered in --amber. */
  currentIndex?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke="var(--color-line)" strokeWidth={1} />
        <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} dy={6} />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} />
        <Tooltip
          cursor={{ fill: "var(--color-paper-deep)" }}
          content={<InstrumentTooltip prefix={prefix} suffix={suffix} />}
        />
        <Bar
          dataKey="value"
          radius={[2, 2, 0, 0]}
          activeBar={{ fill: "var(--color-pine-900)" }}
          isAnimationActive
          animationDuration={400}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === currentIndex ? "var(--color-amber-500)" : "var(--color-pine-700)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
