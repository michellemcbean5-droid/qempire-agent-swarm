interface QBotProps {
  size?: number;
  className?: string;
  /** kept for API compatibility with earlier callers (no-ops now) */
  crown?: boolean;
  alive?: boolean;
}

/**
 * Q-Bot — the crowned bioluminescent AI companion of the Q-Empire.
 * Uses the real brand artwork, masked into a circle so it drops in anywhere.
 */
export default function QBot({ size = 64, className = "" }: QBotProps) {
  return (
    <img
      src="/brand/qbot.webp"
      alt="Q-Bot"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full object-cover ring-1 ring-cyan/30 ${className}`}
    />
  );
}
