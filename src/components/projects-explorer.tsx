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
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

const ALL = "All";

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted">
      {children}
    </p>
  );
}

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

  // Anything not in progress (live or archived) counts as completed. Completed
  // work is grouped by niche, and each niche keeps public and private apart.
  const inProgress = visible.filter((p) => p.status === "in-progress");
  const completed = visible.filter((p) => p.status !== "in-progress");
  const categories = (Object.keys(PROJECT_CATEGORIES) as ProjectCategory[])
    .map((key) => {
      const inCategory = completed.filter((p) => p.category === key);
      return {
        key,
        ...PROJECT_CATEGORIES[key],
        count: inCategory.length,
        publicProjects: inCategory.filter((p) => p.visibility === "public"),
        privateProjects: inCategory.filter((p) => p.visibility === "private"),
      };
    })
    .filter((c) => c.count > 0);
  const anyPrivate = completed.some((p) => p.visibility === "private");

  const renderGrid = (list: Project[], priorityFirst = false) => (
    <BentoGrid>
      <AnimatePresence mode="popLayout" initial={false}>
        {list.map((project, i) => (
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
            <ProjectCard project={project} size="md" priority={priorityFirst && i < 3} />
          </motion.div>
        ))}
      </AnimatePresence>
    </BentoGrid>
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

      <div className="space-y-24 md:space-y-32">
        {inProgress.length > 0 && (
          <section>
            <SectionHeading eyebrow="In progress" title="Currently building." />
            {renderGrid(inProgress, true)}
          </section>
        )}

        {categories.length > 0 && (
          <section>
            <SectionHeading eyebrow="Completed" title="Shipped and done." />
            {anyPrivate && (
              <p className="-mt-4 mb-12 max-w-2xl text-sm text-muted">
                <Lock className="mr-1.5 inline size-3.5 -translate-y-px text-accent" strokeWidth={1.75} />
                Code and demos for private projects aren&apos;t public. Message me and I&apos;ll set
                you up with a demo or repo access.{" "}
                <Link
                  href="/contact"
                  className="whitespace-nowrap text-foreground underline decoration-accent decoration-[1.5px] underline-offset-4"
                >
                  Get in touch
                </Link>
              </p>
            )}

            <div className="space-y-16 md:space-y-20">
              {categories.map((category, categoryIndex) => {
                const both =
                  category.publicProjects.length > 0 && category.privateProjects.length > 0;
                return (
                  <div key={category.key}>
                    <div className="mb-6 flex flex-col gap-1 border-b border-border pb-4 md:flex-row md:items-baseline md:justify-between md:gap-6">
                      <h3 className="font-display text-2xl text-foreground">
                        {category.label}
                        <span className="ml-3 font-mono text-xs text-muted">
                          {category.count}
                        </span>
                      </h3>
                      <p className="text-sm text-muted md:text-right">{category.blurb}</p>
                    </div>

                    <div className="space-y-8">
                      {category.publicProjects.length > 0 && (
                        <div>
                          {both && <SubLabel>Public</SubLabel>}
                          {renderGrid(
                            category.publicProjects,
                            inProgress.length === 0 && categoryIndex === 0,
                          )}
                        </div>
                      )}
                      {category.privateProjects.length > 0 && (
                        <div>
                          <SubLabel>
                            <Lock className="size-3" strokeWidth={2} />
                            Private
                          </SubLabel>
                          {renderGrid(category.privateProjects)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
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
