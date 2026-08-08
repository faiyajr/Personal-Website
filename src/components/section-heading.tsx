import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { TextRevealOnScroll } from "@/components/motion/text-reveal";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
        </Reveal>
        <TextRevealOnScroll
          text={title}
          as="h2"
          className="font-display text-display-md text-foreground"
        />
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-lead text-muted">{description}</p>
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.15}>
          <Link
            href={action.href}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            {action.label}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
