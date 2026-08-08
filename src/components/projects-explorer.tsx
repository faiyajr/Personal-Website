"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { BentoGrid } from "@/components/bento-grid";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const ALL = "All";

export function ProjectsExplorer({
  projects,
  tech,
}: {
  projects: Project[];
  tech: string[];
}) {
  const [filter, setFilter] = useState<string>(ALL);
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.tech.includes(filter))),
    [projects, filter],
  );

  if (projects.length === 0) return <EmptyState />;

  return (
    <>
      {tech.length > 1 && (
        <div
          role="group"
          aria-label="Filter projects by technology"
          className="mb-10 flex flex-wrap gap-2"
        >
          {[ALL, ...tech].map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={active}
                className={cn(
                  "relative rounded-full px-4 py-2 font-mono text-xs transition-colors duration-200",
                  active ? "text-accent-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 -z-10 rounded-full border border-border" />
                )}
                {item}
              </button>
            );
          })}
        </div>
      )}

      <BentoGrid>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout={!reduce}
              className={cn(
                project.size === "wide"
                  ? "md:col-span-6"
                  : project.size === "lg"
                    ? "md:col-span-4"
                    : project.size === "tall"
                      ? "md:col-span-2 md:row-span-2"
                      : project.size === "sm"
                        ? "md:col-span-2"
                        : "md:col-span-3",
              )}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </BentoGrid>

      {visible.length === 0 && (
        <EmptyState
          title={`Nothing tagged “${filter}” yet`}
          hint="Pick another filter, or clear it to see everything."
        />
      )}
    </>
  );
}
