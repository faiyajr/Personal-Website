import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Globe } from "lucide-react";

import { GithubIcon } from "@/components/icons";
import { MdxContent } from "@/components/mdx-content";
import { Reveal } from "@/components/motion/reveal";
import { BlurReveal } from "@/components/motion/blur-reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getAdjacentProjects,
  getProject,
  getProjectSlugs,
} from "@/lib/content";
import { cn, formatYear, prettyUrl } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: project.cover ? [{ url: project.cover.src }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <article className="container-page py-12 md:py-16">
      <Link
        href="/projects"
        className="group mb-10 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-subtle transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        All work
      </Link>

      {/* ── Header ── */}
      <header className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-widest text-subtle">
            <span>{formatYear(project.year)}</span>
            {project.role && (
              <>
                <span aria-hidden>·</span>
                <span>{project.role}</span>
              </>
            )}
            {project.status !== "live" && (
              <Badge variant="outline">
                {project.status === "in-progress" ? "In progress" : "Archived"}
              </Badge>
            )}
          </div>

          <BlurReveal
            text={project.title}
            as="h1"
            className="font-display text-display-lg text-foreground"
          />

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lead text-muted">
              {project.description ?? project.summary}
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(buttonVariants({ variant: "accent" }))}
                >
                  <Globe className="size-4" />
                  Visit live site
                  <ArrowUpRight className="size-4" />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  <GithubIcon className="size-4" />
                  Source
                </a>
              )}
              {project.links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    className={cn(buttonVariants({ variant: "ghost" }))}
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" />
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* ── Facts sidebar ── */}
        <Reveal from="right" delay={0.15} className="lg:col-span-5">
          <dl className="divide-y divide-border rounded-card border border-border bg-surface/40 px-6">
            {project.tech.length > 0 && (
              <div className="py-5">
                <dt className="eyebrow mb-3">Stack</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </dd>
              </div>
            )}

            {project.metrics.length > 0 && (
              <div className="py-5">
                <dt className="eyebrow mb-3">Impact</dt>
                <dd className="grid grid-cols-2 gap-4">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display text-3xl text-foreground">{m.value}</p>
                      <p className="mt-0.5 text-xs text-subtle">{m.label}</p>
                    </div>
                  ))}
                </dd>
              </div>
            )}

            {project.highlights.length > 0 && (
              <div className="py-5">
                <dt className="eyebrow mb-3">Highlights</dt>
                <dd>
                  <ul className="space-y-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm text-muted">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            {project.demo && (
              <div className="py-5">
                <dt className="eyebrow mb-2">Live at</dt>
                <dd>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="break-all font-mono text-sm text-foreground underline decoration-accent decoration-[1.5px] underline-offset-4"
                  >
                    {prettyUrl(project.demo)}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </header>

      {/* ── Cover ── */}
      {project.cover && (
        <Reveal delay={0.1} className="mt-14 md:mt-20">
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-border bg-surface">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover object-top"
              />
            </div>
            {project.cover.caption && (
              <figcaption className="mt-3 text-center text-xs text-subtle">
                {project.cover.caption}
              </figcaption>
            )}
          </figure>
        </Reveal>
      )}

      {/* ── Case study body ── */}
      {project.body && (
        <div className="mt-16 md:mt-24">
          <div className="mx-auto max-w-[46rem]">
            <MdxContent source={project.body} />
          </div>
        </div>
      )}

      {/* ── Gallery ── */}
      {project.gallery.length > 0 && (
        <section className="mt-20 md:mt-28" aria-label="Screenshots">
          <p className="eyebrow mb-6">Gallery</p>
          <div className="grid gap-5 md:grid-cols-2">
            {project.gallery.map((image, i) => (
              <Reveal
                key={image.src}
                delay={i * 0.06}
                className={i % 3 === 0 ? "md:col-span-2" : undefined}
              >
                <figure>
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-card border border-border bg-surface",
                      i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]",
                    )}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="mt-2.5 text-xs text-subtle">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Prev / next ── */}
      {(prev || next) && (
        <nav
          aria-label="More projects"
          className="mt-24 grid gap-4 border-t border-border pt-10 sm:grid-cols-2"
        >
          {prev && <AdjacentLink project={prev} direction="prev" />}
          {next && <AdjacentLink project={next} direction="next" />}
        </nav>
      )}
    </article>
  );
}

function AdjacentLink({
  project,
  direction,
}: {
  project: { slug: string; title: string; summary: string };
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group rounded-card border border-border p-6 transition-colors hover:border-border-strong hover:bg-surface/50",
        direction === "next" && "sm:text-right",
      )}
    >
      <p className="eyebrow mb-2">{direction === "prev" ? "Previous" : "Next"}</p>
      <p className="font-display text-xl text-foreground transition-colors group-hover:text-accent">
        {project.title}
      </p>
      <p className="mt-1 line-clamp-1 text-sm text-muted">{project.summary}</p>
    </Link>
  );
}
