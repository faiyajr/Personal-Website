import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="container-page py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="eyebrow mb-4">Get in touch</p>
            <p className="font-display text-display-sm text-foreground">
              Have something you want built?
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] text-muted underline decoration-accent decoration-[1.5px] underline-offset-4 transition-colors hover:text-foreground"
            >
              Start a conversation
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4 md:flex md:gap-8">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <social.icon className="size-4" strokeWidth={1.75} />
                  {social.label}
                  <ArrowUpRight className="size-3 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 font-mono text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
