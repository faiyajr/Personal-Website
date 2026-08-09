import type { Metadata } from "next";
import { Download, GraduationCap, Trophy } from "lucide-react";

import { ExperienceTimeline } from "@/components/experience-timeline";
import { Reveal } from "@/components/motion/reveal";
import { BlurReveal } from "@/components/motion/blur-reveal";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { awards, education, getExperience, skills } from "@/lib/resume";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  description:
    "Software engineering roles, research, and education — Bosch, Saf, MRacing FSAE, the U-M Electric Vehicle Center, and U-M ITS.",
};

export default function ExperiencePage() {
  const experience = getExperience();

  return (
    <div className="container-page py-16 md:py-24">
      <header className="mb-16 md:mb-20">
        <Reveal>
          <p className="eyebrow mb-4">
            {experience.length} roles · {experience.filter((e) => e.end === "Present").length}{" "}
            current
          </p>
        </Reveal>
        <BlurReveal
          text="Experience."
          as="h1"
          className="font-display text-display-lg text-foreground"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lead text-muted">
            Where I&apos;ve worked, what I shipped, and roughly what it was worth. The PDF has
            the same content in one page.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href={site.resumePath}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(buttonVariants(), "mt-8")}
          >
            <Download className="size-4" />
            Resume (PDF)
          </a>
        </Reveal>
      </header>

      <ExperienceTimeline experience={experience} />

      {/* ── Education + honors ── */}
      <section className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-2 lg:gap-12">
        <div>
          <SectionHeading eyebrow="Education" title="Where I study." className="mb-8" />
          {education.map((entry) => (
            <Reveal key={entry.school}>
              <div className="rounded-card border border-border bg-surface/50 p-6 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2">
                  <GraduationCap className="size-4 text-accent" strokeWidth={1.75} />
                  <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                    {entry.start} — {entry.end}
                  </p>
                </div>
                <p className="font-display text-2xl text-foreground">{entry.school}</p>
                <p className="mt-1 text-[0.9375rem] font-medium text-foreground">
                  {entry.degree}
                </p>
                {entry.location && <p className="mt-1 text-xs text-subtle">{entry.location}</p>}
                {entry.details?.map((detail) => (
                  <p key={detail} className="mt-4 text-sm leading-relaxed text-muted">
                    {detail}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {awards.length > 0 && (
          <div>
            <SectionHeading eyebrow="Honors" title="Recognition." className="mb-8" />
            <ul className="space-y-4">
              {awards.map((award) => (
                <li key={award.title}>
                  <Reveal>
                    <div className="rounded-card border border-border bg-surface/50 p-6 backdrop-blur-sm">
                      <div className="mb-3 flex items-center gap-2">
                        <Trophy className="size-4 text-accent" strokeWidth={1.75} />
                        <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                          {award.date}
                          {award.location ? ` · ${award.location}` : ""}
                        </p>
                      </div>
                      <p className="font-display text-2xl text-foreground">{award.title}</p>
                      {award.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {award.description}
                        </p>
                      )}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ── Skills ── */}
      <section className="mt-24 md:mt-32">
        <SectionHeading eyebrow="Toolkit" title="What I work with." />
        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((group) => (
            <Reveal key={group.label}>
              <div className="h-full rounded-card border border-border bg-surface/50 p-6 backdrop-blur-sm">
                <p className="eyebrow mb-4">{group.label}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Badge size="md">{item}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
