"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { Magnetic } from "@/components/motion/magnetic";
import { BlurCycle } from "@/components/motion/blur-cycle";
import { useMotionScale } from "@/components/motion/use-motion-scale";
import { StructCard } from "@/components/struct-card";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Hero() {
  const scale = useMotionScale();

  // `initial` stays constant so SSR and hydration agree; only the timing
  // responds to reduced motion. See `useMotionScale`.
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.8 * scale,
      delay: delay * scale,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section className="relative overflow-hidden">
      {/* Ambient accent wash behind the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl [background:radial-gradient(ellipse_at_center,var(--color-accent-soft),transparent_65%)]"
      />

      <div className="container-page relative pb-16 pt-14 md:pb-24 md:pt-20">
        {/* `grid-cols-1` is not cosmetic. Without it there is no
            grid-template-columns below lg, so the single implicit column is
            `auto` — content-sized — and inflates to the max-content of its
            widest descendant, dragging the whole column past the screen.
            Tailwind compiles grid-cols-N to repeat(N, minmax(0, 1fr)), and
            that 0 floor is what keeps the track tied to the container instead
            of to its contents. It is also why lg:grid-cols-12 never broke. */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Left: name, typing line, intro ── */}
          {/* min-w-0: a grid item refuses to shrink below its min-content size
              by default, which lets a long headline push the column wider than
              the page instead of wrapping inside it. */}
          <div className="min-w-0 lg:col-span-7">
            <motion.p {...fadeUp(0)} className="eyebrow mb-7 flex items-center gap-2">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              Computer Engineering @ Michigan · {site.location}
            </motion.p>

            <motion.h1
              {...fadeUp(0.08)}
              // `break-words` is a backstop: at the smallest widths the longest
              // headline phrase has no slack, and a word breaking mid-way is a
              // better failure than one running off the side of the screen.
              className="font-display text-display-lg text-foreground [overflow-wrap:break-word]"
            >
              I&apos;m <span className="text-accent">{site.firstName}</span>,
              <br />
              <BlurCycle phrases={site.headlinePhrases} className="text-foreground" />
            </motion.h1>

            <motion.p {...fadeUp(0.22)} className="mt-8 max-w-xl text-lead text-muted">
              {site.intro}
            </motion.p>

            <motion.div {...fadeUp(0.32)} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link href="/projects" className={cn(buttonVariants({ size: "lg" }))}>
                  View work
                  <ArrowUpRight className="size-[1.125rem]" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={site.resumePath}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  Resume
                </a>
              </Magnetic>
            </motion.div>

            <motion.ul
              {...fadeUp(0.42)}
              className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle transition-colors hover:text-foreground"
                  >
                    <social.icon className="size-3.5" strokeWidth={1.75} />
                    {social.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Right: the C++ struct ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{
              duration: 0.9 * scale,
              delay: 0.25 * scale,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-5"
          >
            <StructCard />
          </motion.div>
        </div>
      </div>

      <motion.div
        {...fadeUp(0.6)}
        aria-hidden
        className="container-page hidden items-center gap-2 pb-10 font-mono text-[0.6875rem] uppercase tracking-widest text-subtle md:flex"
      >
        <ArrowDown className="size-3.5 animate-bounce" />
        Scroll
      </motion.div>
    </section>
  );
}
