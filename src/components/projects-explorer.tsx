"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Lock } from "lucide-react";

import { BentoGrid } from "@/components/bento-grid";
import { useMotionScale } from "@/components/motion/use-motion-scale";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const ALL = "All";

type Section = {
  eyebrow: string;
  title: string;
  groups: { label?: string; note?: string; projects: Project[] }[];
};

export function ProjectsExplorer({
  projects,
  tech,
}: {
  projects: Project[];
  tech: string[];
}) {
  const [filter, setFilter] = useState<string>(ALL);
  const scale = useMotionScale();

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.tech.includes(filter))),
    [projects, filter],
  );

  // Anything not in progress (live or archived) counts as completed, and
  // completed work is split by whether the code/demo is public.
  const completed = visible.filter((p) => p.status !== "in-progress");
  const sections: Section[] = [
    {
      eyebrow: "In progress",
      title: "Currently building.",
      groups: [{ projects: visible.filter((p) => p.status === "in-progress") }],
    },
    {
      eyebrow: "Completed",
      title: "Shipped and done.",
      groups: [
        {
          label: "Public",
          projects: completed.filter((p) => p.visibility === "public"),
        },
        {
          label: "Private",
          note: "The code and demos for these aren't public. Message me and I'll set you up with a demo or repo access.",
          projects: completed.filter((p) => p.visibility === "private"),
        },
      ],
    },
  ];

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

      <div className="space-y-24 md:space-y-32">
        {sections.map((section, sectionIndex) => {
          const groups = section.groups.filter((g) => g.projects.length > 0);
          if (groups.length === 0) return null;
          // A lone "Public" label with nothing beside it reads as noise, so
          // sub-headings only appear once a section has more than one group —
          // except a group with a note (Private), which always needs it.
          const labelled = groups.length > 1;

          return (
            <section key={section.eyebrow}>
              <SectionHeading eyebrow={section.eyebrow} title={section.title} />
              <div className="space-y-14 md:space-y-16">
                {groups.map((group) => (
                  <div key={group.label ?? section.eyebrow}>
                    {(labelled || group.note) && group.label && (
                      <div className="mb-6 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-baseline md:justify-between md:gap-6">
                        <h3 className="inline-flex items-center gap-2 font-display text-2xl text-foreground">
                          {group.label === "Private" && (
                            <Lock className="size-4 text-accent" strokeWidth={1.75} />
                          )}
                          {group.label}
                        </h3>
                        {group.note && (
                          <p className="max-w-lg text-sm text-muted md:text-right">
                            {group.note}{" "}
                            <Link
                              href="/contact"
                              className="whitespace-nowrap text-foreground underline decoration-accent decoration-[1.5px] underline-offset-4"
                            >
                              Get in touch
                            </Link>
                          </p>
                        )}
                      </div>
                    )}
                    <BentoGrid>
                      <AnimatePresence mode="popLayout" initial={false}>
                        {group.projects.map((project, i) => (
                          <motion.div
                            key={project.slug}
                            layout
                            // Every card the same size: two across on tablets,
                            // three on desktop. `size` in frontmatter is ignored.
                            className="md:col-span-3 lg:col-span-2"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.35 * scale, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <ProjectCard
                              project={project}
                              size="md"
                              priority={sectionIndex === 0 && i < 3}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </BentoGrid>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {visible.length === 0 && (
        <EmptyState
          title={`Nothing tagged “${filter}” yet`}
          hint="Pick another filter, or clear it to see everything."
        />
      )}
    </>
  );
}
