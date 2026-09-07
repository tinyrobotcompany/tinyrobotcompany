/**
 * Small brand mark for the nav / lockups. Static, colour, no animation.
 * Matches public/brand/icon.svg exactly.
 */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-hidden="true"
    >
      <line x1="120" y1="34" x2="120" y2="62" stroke="var(--robot)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="120" cy="26" r="9" fill="var(--cream)" />
      <circle cx="120" cy="26" r="9" fill="none" stroke="var(--robot-lo)" strokeWidth="1.5" opacity="0.4" />

      <rect x="30" y="58" width="180" height="158" rx="46" fill="var(--robot)" />

      <path d="M 58 148 Q 80 112 102 148" stroke="var(--ink)" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M 138 148 Q 160 112 182 148" stroke="var(--ink)" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="48" cy="174" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.55" />
      <ellipse cx="192" cy="174" rx="10" ry="6" fill="var(--robot-lo)" opacity="0.55" />
      <path d="M 108 184 Q 120 194 132 184" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
