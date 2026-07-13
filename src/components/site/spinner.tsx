/* The split-arrow submit spinner — lives in the arrow zone while a form is
   in flight (Contact, Login). Inherits the button's text color. */

export function Spinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      className="animate-spin motion-reduce:animate-none"
      aria-hidden
    >
      <circle
        cx="7.5"
        cy="7.5"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      <path
        d="M13.5 7.5A6 6 0 0 0 7.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
