import { useMemo } from "react";

/**
 * Ambient deep-ocean layer: light shafts + slow bioluminescent bubbles.
 * Purely decorative, fixed behind all content, no pointer interaction.
 */
export default function OceanBackground() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const size = 4 + Math.round(Math.random() * 16);
        return {
          left: Math.random() * 100,
          size,
          duration: 14 + Math.random() * 20,
          delay: -Math.random() * 30,
          key: i,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* light shafts from the surface */}
      <div
        className="absolute -top-1/3 left-1/4 h-[140%] w-40 rotate-[18deg] opacity-[0.07]"
        style={{ background: "linear-gradient(180deg, #bff0ff, transparent)" }}
      />
      <div
        className="absolute -top-1/3 left-2/3 h-[140%] w-28 rotate-[24deg] opacity-[0.05]"
        style={{ background: "linear-gradient(180deg, #d6b3ff, transparent)" }}
      />
      {/* faint coral glow at the abyss floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 opacity-40"
        style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(255,45,149,0.10), transparent 70%)" }}
      />
      {bubbles.map((b) => (
        <span
          key={b.key}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
