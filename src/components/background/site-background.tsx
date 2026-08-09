import { ParticleField } from "@/components/background/particle-field";

/**
 * The living background behind every page: three drifting colour blobs, a
 * faint grid, and a cursor-reactive particle field.
 *
 * Fixed and pointer-events-none, sitting above the body colour and below all
 * content — see the `relative z-10` wrapper in `app/layout.tsx`.
 */
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Drifting colour blobs. */}
      <div
        className="absolute -left-[15vw] -top-[20vh] size-[70vw] rounded-full blur-[110px]"
        style={{
          background: "radial-gradient(circle, var(--glow-1), transparent 68%)",
          opacity: "var(--glow-opacity)",
          animation: "drift-a 34s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[10vw] top-[25vh] size-[55vw] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--glow-2), transparent 68%)",
          opacity: "calc(var(--glow-opacity) * 0.85)",
          animation: "drift-b 43s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-25vh] left-[20vw] size-[60vw] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, var(--glow-3), transparent 70%)",
          opacity: "calc(var(--glow-opacity) * 0.7)",
          animation: "drift-c 51s ease-in-out infinite",
        }}
      />

      {/* Engineering-drawing grid, masked so it fades out toward the edges. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: "var(--grid-opacity)",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 40%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 40%, #000 30%, transparent 100%)",
        }}
      />

      <ParticleField />
    </div>
  );
}
