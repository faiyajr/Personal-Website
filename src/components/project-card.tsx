import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";

import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { CardSize, Project } from "@/lib/content";
import { cn, formatYear } from "@/lib/utils";

const aspectBySize: Record<CardSize, string> = {
  sm: "aspect-[4/3]",
  md: "aspect-[16/10]",
  lg: "aspect-[16/9]",
  wide: "aspect-[21/9]",
  tall: "aspect-[3/4]",
};

export function ProjectCard({
  project,
  size,
  priority = false,
  className,
}: {
  project: Project;
  /** Overrides the size in frontmatter — used by the flat /projects list. */
  size?: CardSize;
  priority?: boolean;
  className?: string;
}) {
  const cardSize = size ?? project.size;
  const href = `/projects/${project.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface/40 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-border-strong hover:shadow-lift",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden bg-surface", aspectBySize[cardSize])}>
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderCover title={project.title} />
        )}

        {project.status !== "live" && (
          <Badge variant="outline" className="absolute right-3 top-3 bg-background/80 backdrop-blur">
            {project.status === "in-progress" ? "In progress" : "Archived"}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-2 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-wider text-subtle">
          <span>{formatYear(project.year)}</span>
          {project.role && (
            <>
              <span aria-hidden>·</span>
              <span className="truncate">{project.role}</span>
            </>
          )}
        </div>

        <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground md:text-[1.75rem]">
          {project.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        {project.tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
            {project.tech.length > 5 && (
              <li>
                <Badge variant="outline">+{project.tech.length - 5}</Badge>
              </li>
            )}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between gap-4 pt-1">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            Case study
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>

          {/* Sits above the card-wide link below so these stay separately
              clickable rather than being swallowed by the overlay. */}
          <div className="relative z-20 flex items-center gap-1">
            {project.repo && (
              <IconLink href={project.repo} label={`${project.title} source code`}>
                <GithubIcon className="size-4" />
              </IconLink>
            )}
            {project.demo && (
              <IconLink href={project.demo} label={`${project.title} live site`}>
                <Globe className="size-4" strokeWidth={1.75} />
              </IconLink>
            )}
          </div>
        </div>
      </div>

      {/* Whole-card link. `absolute inset-0` keeps the accessible name from the
          heading while making the entire surface a hit target. */}
      <Link href={href} className="absolute inset-0 z-10" aria-label={`${project.title} — case study`}>
        <span className="sr-only">{project.title}</span>
      </Link>
    </article>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="grid size-8 place-items-center rounded-full text-subtle transition-colors hover:bg-surface hover:text-foreground"
    >
      {children}
    </a>
  );
}

/** Shown when a project has no screenshot yet, so the grid never breaks. */
function PlaceholderCover({ title }: { title: string }) {
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,var(--color-accent-soft),transparent_70%)]">
      <span className="font-display text-6xl text-subtle/50">{initials}</span>
    </div>
  );
}
