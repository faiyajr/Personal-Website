import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BentoGrid } from "@/components/bento-grid";
import { BentoItem } from "@/components/bento-item";
import { EmptyState } from "@/components/empty-state";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";
import { ProjectShowcase } from "@/components/project-showcase";
import { SectionHeading } from "@/components/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { getAllProjects, getAllTech, getFeaturedProjects } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const all = getAllProjects();
  const featured = getFeaturedProjects();
  // Anything not in the showcase falls through to the bento grid, so every
  // project appears exactly once on this page.
  const rest = all.filter((p) => !featured.some((f) => f.slug === p.slug));
  const tech = getAllTech().slice(0, 16);

  return (
    <>
      <Hero />

      <section className="container-page py-16 md:py-24" aria-labelledby="work-heading">
        <SectionHeading
          eyebrow="Selected work"
          title="Things I've built."
          description="An abridged collection of things I've built, broken, and occasionally shipped. Pick one to explore."
          action={{ label: "All projects", href: "/projects" }}
        />

        {featured.length === 0 ? <EmptyState /> : <ProjectShowcase projects={featured} />}
      </section>

      {rest.length > 0 && (
        <section className="container-page py-16 md:py-24" aria-labelledby="more-heading">
          <SectionHeading eyebrow="More work" title="Also worth a look." />
          <BentoGrid>
            {rest.map((project, i) => (
              <BentoItem key={project.slug} size={project.size} index={i}>
                <ProjectCard project={project} />
              </BentoItem>
            ))}
          </BentoGrid>
        </section>
      )}

      {tech.length > 0 && (
        <section className="container-page py-16 md:py-24" aria-labelledby="stack-heading">
          <SectionHeading eyebrow="Toolkit" title="What I build with." />
          <Reveal>
            <ul className="flex flex-wrap gap-2.5">
              {tech.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-surface/40 px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      <section className="container-page py-16 md:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-border bg-surface/40 px-6 py-16 text-center md:px-16 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -bottom-32 h-64 opacity-50 blur-3xl [background:radial-gradient(ellipse_at_center,var(--color-accent-soft),transparent_70%)]"
            />
            <p className="eyebrow relative mb-5">{site.headline}</p>
            <h2 className="relative mx-auto max-w-3xl font-display text-display-md text-foreground">
              Let&apos;s build something.
            </h2>
            <p className="relative mx-auto mt-5 max-w-lg text-lead text-muted">
              Reach me at{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-foreground underline decoration-accent decoration-[1.5px] underline-offset-4"
              >
                {site.email}
              </a>
              , or send a note through the form.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className={cn(buttonVariants({ size: "lg" }))}>
                Contact me
                <ArrowUpRight className="size-[1.125rem]" />
              </Link>
              <a
                href={site.resumePath}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Download resume
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
