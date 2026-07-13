/* The 16px-radius app window frame from the homepage mockup (spec §8):
   slim mono title bar — no traffic-light dots — over a 1px --line body.
   Shared by the homepage interface section and the How-it-works step
   vignettes. Pass ariaLabel to render as a described illustration
   (role="img" with the inner UI hidden from assistive tech). */

export function WindowFrame({
  titleLeft,
  titleRight,
  ariaLabel,
  shadow = true,
  className = "",
  children,
}: {
  titleLeft: React.ReactNode;
  titleRight: React.ReactNode;
  ariaLabel?: string;
  shadow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      className={`overflow-hidden rounded-[16px] border border-line bg-paper ${
        shadow ? "shadow-soft" : ""
      } ${className}`}
    >
      <div aria-hidden={ariaLabel ? true : undefined}>
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 font-spline text-[12px] font-medium">
          <span className="truncate text-ink-900">{titleLeft}</span>
          <span className="shrink-0 text-ink-muted tabular-nums">
            {titleRight}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
