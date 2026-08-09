"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Globe } from "lucide-react";

import { GithubIcon } from "@/components/icons";
import { useMotionScale } from "@/components/motion/use-motion-scale";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/lib/content";
import { cn, formatYear } from "@/lib/utils";

/**
 * Tab-style project picker: a row of pills swaps the panel below.
 *
 * Implemented as a real ARIA tablist — arrow keys move between projects and
 * the panel is associated with its tab, so this is navigable without a mouse.
 */

/** One dot colour per tab, cycled. Purely decorative. */
const DOTS = [
  "bg-[oklch(0.65_0.2_25)]",
  "bg-[oklch(0.7_0.15_230)]",
  "bg-[oklch(0.72_0.17_150)]",
  "bg-[oklch(0.78_0.15_85)]",
  "bg-[oklch(0.68_0.18_310)]",
  "bg-[oklch(0.7_0.16_195)]",
];

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const scale = useMotionScale();

  if (projects.length === 0) return null;

  const project = projects[active];

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();

    const next =
      event.key === "ArrowRight"
        ? (active + 1) % projects.length
        : (active - 1 + projects.length) % projects.length;

    setActive(next);
    // Move focus with the selection, as the tablist pattern requires.
    document.getElementById(`showcase-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Featured projects"
        onKeyDown={onKeyDown}
        className="mb-8 flex flex-wrap gap-2"
      >
        {projects.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.slug}
              id={`showcase-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="showcase-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-200",
                selected ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="showcase-pill"
                  className="absolute inset-0 -z-10 rounded-full border border-border-strong bg-surface"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {!selected && (
                <span className="absolute inset-0 -z-10 rounded-full border border-border" />
              )}
              <span className={cn("size-2 rounded-full", DOTS[i % DOTS.length])} />
              {item.title}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="showcase-panel"
        aria-labelledby={`showcase-tab-${active}`}
        className="overflow-hidden rounded-card border border-border bg-surface/40"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 * scale, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface lg:aspect-auto lg:min-h-[26rem]">
              {project.cover ? (
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <span className="font-display text-6xl text-subtle/50">
                    {project.title.slice(0, 2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-widest text-subtle">
                <span>{formatYear(project.year)}</span>
                {project.role && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{project.role}</span>
                  </>
                )}
                {project.status !== "live" && (
                  <Badge variant="accent">
                    {project.status === "in-progress" ? "In progress" : "Archived"}
                  </Badge>
                )}
              </div>

              <h3 className="font-display text-display-sm text-foreground">{project.title}</h3>

              <p className="text-[0.9375rem] leading-relaxed text-muted">{project.summary}</p>

              {project.tech.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <li key={tech}>
                      <Badge size="md">{tech}</Badge>
                    </li>
                  ))}
                </ul>
              )}

              {project.metrics.length > 0 && (
                <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
                  {project.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label}>
                      <dd className="font-display text-2xl text-foreground">{metric.value}</dd>
                      <dt className="mt-0.5 text-xs text-subtle">{metric.label}</dt>
                    </div>
                  ))}
                </dl>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={`/projects/${project.slug}`}
                  className={cn(buttonVariants({ variant: "accent" }))}
                >
                  View project
                  <ArrowUpRight className="size-4" />
                </Link>
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <GithubIcon className="size-4" />
                    Repo
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <Globe className="size-4" />
                    Live
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
