import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Download, Trophy } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { PhotoGrid } from "@/components/photo-grid";
import { SectionHeading } from "@/components/section-heading";
import { SpotifyPanel } from "@/components/spotify-panel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { films, filmsIntro, interests } from "@/lib/about";
import { getPhotos } from "@/lib/photos";
import { awards, education, experience, skills } from "@/lib/resume";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: site.bio[0],
};

export default function AboutPage() {
  const photos = getPhotos();

  return (
    <div className="container-page py-16 md:py-24">
      {/* ── Intro ── */}
      <header className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow mb-4">About</p>
          </Reveal>
          <TextReveal
            text={site.name}
            as="h1"
            className="font-display text-display-lg text-foreground"
          />
          <Reveal delay={0.2}>
            <div className="mt-8 space-y-5 text-lead text-muted">
              {site.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={site.resumePath}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(buttonVariants())}
              >
                <Download className="size-4" />
                Resume (PDF)
              </a>
              <a
                href={`mailto:${site.email}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Email me
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal from="right" delay={0.15} className="lg:col-span-5">
          <dl className="space-y-6 rounded-card border border-border bg-surface/40 p-6">
            {skills.map((group) => (
              <div key={group.label}>
                <dt className="eyebrow mb-3">{group.label}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      {/* ── Photos ── */}
      {(photos.length > 0 || process.env.NODE_ENV === "development") && (
        <section className="mt-24 md:mt-32" aria-labelledby="photos">
          <SectionHeading eyebrow="In the wild" title="Some photos." />
          <PhotoGrid photos={photos} />
        </section>
      )}

      {/* ── Experience ── */}
      {experience.length > 0 && (
        <section className="mt-24 md:mt-32" aria-labelledby="experience">
          <SectionHeading eyebrow="Experience" title="Where I've worked." />
          <Stagger as="ul" className="space-y-px overflow-hidden rounded-card border border-border">
            {experience.map((job) => (
              <StaggerItem
                as="li"
                key={`${job.company}-${job.start}`}
                className="grid gap-4 bg-surface/40 p-6 md:grid-cols-12 md:gap-8 md:p-8"
              >
                <div className="md:col-span-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                    {job.start} — {job.end}
                  </p>
                  <p className="mt-2 font-display text-2xl text-foreground">
                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline decoration-accent decoration-[1.5px] underline-offset-4"
                      >
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </p>
                  {job.location && <p className="mt-1 text-xs text-subtle">{job.location}</p>}
                </div>

                <div className="md:col-span-8">
                  <p className="text-[0.9375rem] font-medium text-foreground">{job.role}</p>
                  <ul className="mt-3 space-y-2">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  {job.tech && job.tech.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {job.tech.map((t) => (
                        <li key={t}>
                          <Badge>{t}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* ── Education + awards ── */}
      <section className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow="Education" title="Where I study." className="mb-8" />
          {education.map((entry) => (
            <Reveal key={entry.school}>
              <div className="rounded-card border border-border bg-surface/40 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {entry.start} — {entry.end}
                </p>
                <p className="mt-2 font-display text-2xl text-foreground">{entry.school}</p>
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
            <Stagger as="ul" className="space-y-4">
              {awards.map((award) => (
                <StaggerItem as="li" key={award.title}>
                  <div className="rounded-card border border-border bg-surface/40 p-6">
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
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </section>

      {/* ── Beyond code ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="beyond">
        <SectionHeading
          eyebrow="Beyond code"
          title="The rest of it."
          description="Everything a resume has no room for."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:content-start">
            {interests.map((interest) => (
              <StaggerItem key={interest.label}>
                <div className="h-full rounded-card border border-border bg-surface/40 p-6 transition-colors hover:border-border-strong">
                  <span aria-hidden className="text-3xl">
                    {interest.emoji}
                  </span>
                  <p className="mt-4 font-display text-xl text-foreground">{interest.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{interest.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal from="right" delay={0.1} className="lg:col-span-5">
            <SpotifyPanel />
          </Reveal>
        </div>

        {films.length > 0 && (
          <div className="mt-6">
            <Reveal>
              <div className="rounded-card border border-border bg-surface/40 p-6 md:p-8">
                <p className="eyebrow mb-2">On screen</p>
                <p className="mb-6 max-w-xl text-sm text-muted">{filmsIntro}</p>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {films.map((film) => (
                    <li key={film.title} className="flex gap-4">
                      {film.poster ? (
                        <Image
                          src={film.poster}
                          alt={`${film.title} poster`}
                          width={56}
                          height={84}
                          className="h-21 w-14 shrink-0 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="mt-2 h-px w-6 shrink-0 bg-border-strong"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-[0.9375rem] font-medium text-foreground">
                          {film.title}
                          {film.year && (
                            <span className="ml-2 font-mono text-xs text-subtle">
                              {film.year}
                            </span>
                          )}
                        </p>
                        {film.note && (
                          <p className="mt-1 text-sm leading-relaxed text-muted">{film.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        )}
      </section>

      {/* ── Contact ── */}
      <section className="mt-24 md:mt-32" aria-labelledby="contact">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title="Say hello."
              description="Open to internships, contract work, and interesting problems. Goes straight to my inbox."
              className="mb-8"
            />
            <Reveal delay={0.2}>
              <ul className="divide-y divide-border border-y border-border">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        social.href.startsWith("http") ? "noreferrer noopener" : undefined
                      }
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="flex items-center gap-3">
                        <social.icon className="size-4 text-subtle" strokeWidth={1.75} />
                        <span className="text-[0.9375rem] text-foreground">{social.label}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-muted">
                        <span className="hidden truncate sm:inline">{social.handle}</span>
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal from="right" delay={0.15} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
