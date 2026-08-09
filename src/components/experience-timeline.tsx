import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@/lib/resume";
import { cn } from "@/lib/utils";

/**
 * Work history as a vertical timeline with a marker rail.
 *
 * `compact` drops the bullets and keeps one line per role — used on the home
 * page, where the full detail belongs on /experience instead.
 */
export function ExperienceTimeline({
  experience,
  compact = false,
  className,
}: {
  experience: Experience[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <Stagger as="ul" className={cn("relative", className)}>
      {/* The rail. Stops short at the bottom so it does not dangle past the
          final marker. */}
      <span
        aria-hidden
        className="absolute bottom-8 left-[7px] top-3 w-px bg-gradient-to-b from-accent/60 via-border to-transparent md:left-[calc(11rem+7px)]"
      />

      {experience.map((job, i) => {
        const current = job.end.toLowerCase() === "present";

        return (
          <StaggerItem
            as="li"
            key={`${job.company}-${job.start}`}
            className={cn("relative pl-8 md:pl-[calc(11rem+2rem)]", i > 0 && "mt-10 md:mt-12")}
          >
            {/* Date rail — above the marker on mobile, beside it on desktop. */}
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-subtle md:absolute md:left-0 md:top-0.5 md:mb-0 md:w-44 md:pr-8 md:text-right">
              {job.start} — {job.end}
            </p>

            {/* Marker */}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1.5 grid size-[15px] place-items-center rounded-full border-2 md:left-[11rem]",
                current
                  ? "border-accent bg-background"
                  : "border-border-strong bg-background",
              )}
            >
              {current && (
                <span className="size-[5px] animate-pulse rounded-full bg-accent" />
              )}
            </span>

            <div
              className={cn(
                "rounded-card border border-border bg-surface/50 p-5 backdrop-blur-sm transition-colors md:p-6",
                "hover:border-border-strong",
              )}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-2xl leading-tight text-foreground">
                  {job.role}
                </h3>
                {current && <Badge variant="accent">Current</Badge>}
              </div>

              <p className="mt-1.5 text-[0.9375rem] text-muted">
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-foreground underline decoration-accent decoration-[1.5px] underline-offset-4"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span className="text-foreground">{job.company}</span>
                )}
                {job.location && (
                  <>
                    <span aria-hidden className="mx-2 text-subtle">
                      ·
                    </span>
                    <span className="text-subtle">{job.location}</span>
                  </>
                )}
              </p>

              {!compact && job.points.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {job.tech && job.tech.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {job.tech.slice(0, compact ? 5 : job.tech.length).map((t) => (
                    <li key={t}>
                      <Badge>{t}</Badge>
                    </li>
                  ))}
                  {compact && job.tech.length > 5 && (
                    <li>
                      <Badge variant="outline">+{job.tech.length - 5}</Badge>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
