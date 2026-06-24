/* Shared 3×3 grid logo mark. Diagonal cells in amber, rest white-on-primary.
   Used by the marketing navbar, the auth brand panel, and the dashboard shell. */

export function BrandMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`grid flex-none grid-cols-3 grid-rows-3 gap-[2px] rounded-[7px] bg-primary p-[5px] ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`rounded-[1.5px] ${
            i === 0 || i === 4 || i === 8 ? "bg-amber" : "bg-white/55"
          }`}
        />
      ))}
    </span>
  );
}
