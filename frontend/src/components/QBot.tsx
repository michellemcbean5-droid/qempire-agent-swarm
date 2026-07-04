interface QBotProps {
  size?: number;
  crown?: boolean;
  className?: string;
  /** subtle idle float + blink */
  alive?: boolean;
}

/**
 * Q-Bot — the crowned bioluminescent AI companion of the Q-Empire.
 * Rendered as a self-contained SVG so it stays crisp at any size.
 */
export default function QBot({ size = 64, crown = true, className = "", alive = true }: QBotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Q-Bot"
    >
      <defs>
        <radialGradient id="qb-orb" cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#b6f6ff" />
          <stop offset="52%" stopColor="#22c9ff" />
          <stop offset="100%" stopColor="#0b5bd6" />
        </radialGradient>
        <linearGradient id="qb-crown" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe89a" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <filter id="qb-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* halo */}
      <circle cx="32" cy="38" r="23" fill="#22e0ff" opacity="0.12" />

      {/* body */}
      <circle cx="32" cy="38" r="20" fill="url(#qb-orb)" filter="url(#qb-glow)" />
      <circle cx="32" cy="38" r="20" fill="none" stroke="#bff2ff" strokeOpacity="0.5" strokeWidth="1.1" />

      {/* faint circuit traces */}
      <g stroke="#e6fbff" strokeOpacity="0.35" strokeWidth="0.8" fill="none">
        <path d="M14 40 h6 l3 3" />
        <path d="M50 34 h-6 l-3 -3" />
        <path d="M32 55 v-5" />
      </g>

      {/* eyes */}
      <circle cx="26" cy="36" r="3.4" fill="#04122a" />
      <circle cx="38" cy="36" r="3.4" fill="#04122a" />
      <circle cx="27.1" cy="34.9" r="1" fill="#fff" className={alive ? "animate-blink" : ""} />
      <circle cx="39.1" cy="34.9" r="1" fill="#fff" className={alive ? "animate-blink" : ""} />

      {/* smile */}
      <path d="M26 44 q6 5 12 0" fill="none" stroke="#04122a" strokeWidth="2" strokeLinecap="round" />

      {/* crown */}
      {crown && (
        <path
          d="M18 20 l5 8 4.5-6 4.5 6 4.5-6 4.5 6 5-8 -2 12 h-24 z"
          fill="url(#qb-crown)"
          stroke="#a9821f"
          strokeWidth="0.6"
        />
      )}
    </svg>
  );
}
