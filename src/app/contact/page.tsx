import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-4">Contact</p>
          </Reveal>
          <TextReveal
            text="Say hello."
            as="h1"
            className="font-display text-display-lg text-foreground"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 text-lead text-muted">
              Open to internships, contract work, and interesting problems. The form goes
              straight to my inbox — or use whichever of these you prefer.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-foreground"
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
    </div>
  );
}
