import "server-only";

import { loadProjects } from "./mdx-source";
import type { Project } from "./schema";

export type { Project, Image, Metric, CardSize } from "./schema";

/**
 * The content API. Every page imports from here and nowhere else.
 *
 * ── Swapping in a hosted headless CMS ──────────────────────────────────────
 * The site does not know or care where projects come from. To move to Sanity,
 * Contentful, Payload, etc.:
 *
 *   1. Write `src/lib/content/<cms>-source.ts` exporting
 *      `loadProjects(): Promise<Project[]>` that maps CMS records onto the
 *      `Project` type in `./schema.ts`.
 *   2. Change the one import below.
 *   3. Make the functions here `async` and `await` the loader.
 *
 * No page or component changes. Until then, local MDX is the source of truth —
 * it version-controls with the code, needs no account, and costs nothing.
 */

let cache: Project[] | null = null;

function all(): Project[] {
  // Cached per server process; content is read once at build time.
  cache ??= loadProjects();
  return cache;
}

function byYearDesc(a: Project, b: Project) {
  const ay = Array.isArray(a.year) ? a.year[1] : a.year;
  const by = Array.isArray(b.year) ? b.year[1] : b.year;
  return by - ay;
}

export function getAllProjects(): Project[] {
  return [...all()].sort(byYearDesc);
}

export function getFeaturedProjects(): Project[] {
  return all()
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order || byYearDesc(a, b));
}

export function getProject(slug: string): Project | undefined {
  return all().find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return all().map((p) => p.slug);
}

/** Every distinct tech tag across all projects, most-used first. */
export function getAllTech(): string[] {
  const counts = new Map<string, number>();
  for (const p of all()) {
    for (const t of p.tech) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tech]) => tech);
}

/** Previous/next for the case-study footer, wrapping at the ends. */
export function getAdjacentProjects(slug: string) {
  const list = getAllProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
  };
}
