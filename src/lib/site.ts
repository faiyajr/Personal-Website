import { Mail, FileText } from "lucide-react";

import { GithubIcon, LinkedinIcon, type IconComponent } from "@/components/icons";

/**
 * Single source of truth for everything about *you*.
 * The header, footer, hero, about page, metadata, sitemap and OG image all
 * read from here.
 */

export type SocialLink = {
  label: string;
  href: string;
  icon: IconComponent;
  handle?: string;
};

/** One line of the C++ struct rendered on the home page. */
export type StructField = {
  type: string;
  name: string;
  /** A string value is quoted when rendered; an array becomes a brace list. */
  value: string | string[];
};

export const site = {
  // ── Identity ────────────────────────────────────────────────────────────
  name: "Faiyaj Rahman",
  firstName: "Faiyaj",
  title: "Computer Engineering Student & Software Engineer",
  headline: "Turning complex problems into usable solutions.",
  intro:
    "Hey! I'm Faiyaj. I like dabbling in building, programming, playing football, going to the gym, and the occasional late-night gaming session. Hope you enjoy your stay.",

  /**
   * Cycled through by the decode effect under the hero heading.
   * Each one has to read correctly after "I'm Faiyaj,".
   */
  headlinePhrases: [
    "a Computer Engineering student.",
    "a Software Engineering Intern at Bosch.",
    "the co-founder of Saf.",
    "building a sub-millisecond matching engine.",
    "designing an autonomous drone from scratch.",
    "usually at the gym or on a football pitch.",
  ],

  location: "Ann Arbor, MI",
  email: "faiyajr@umich.edu",

  // ── The C++ struct card on the home page ────────────────────────────────
  structName: "Faiyaj",
  structFields: [
    { type: "std::string", name: "school", value: "University of Michigan" },
    { type: "std::string", name: "major", value: "Computer Engineering" },
    { type: "std::string", name: "graduation", value: "May 2028" },
    { type: "std::string", name: "role", value: "SWE Intern @ Bosch" },
    { type: "std::string", name: "location", value: "Ann Arbor, MI" },
    { type: "std::string", name: "email", value: "faiyajr@umich.edu" },
    {
      type: "std::vector<std::string>",
      name: "interests",
      value: ["low-level", "high-performance", "embedded", "ML infra"],
    },
  ] satisfies StructField[],

  // ── About page bio ──────────────────────────────────────────────────────
  bio: [
    "I'm a Computer Engineering student at the University of Michigan with a deep interest in low-level software, high-performance systems, ML architectures, and embedded platforms. I enjoy digging into complex systems, squeezing out maximum performance, and building things from the bare metal up.",
    "Right now I'm a Software Engineering Intern at Bosch working on agentic AI and cloud platforms, and Co-Founder and Software Engineer at Saf. On the side my focus is split across three builds: a sub-millisecond, cache-efficient C++ limit order book and matching engine; Overround, a transformer backed by a multithreaded Monte Carlo engine that predicts UEFA Champions League matches; and Kestrel, a custom autonomous drone tying low-level control systems to real-time flight logic.",
    "When I'm not debugging software or optimizing architectures, you'll usually find me lifting heavy metal circles, playing football (no, it's not soccer), or running through lobbies in games 🤪.",
    "Whether it's low-latency C++, embedded firmware, or ML infrastructure, I'm always up for connecting on hard engineering problems. Reach me at faiyajr@umich.edu.",
  ],

  // ── URLs ────────────────────────────────────────────────────────────────
  /** No trailing slash. Overridden by NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  resumePath: "/resume/faiyaj-rahman-resume.pdf",

  // ── Social ──────────────────────────────────────────────────────────────
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/faiyajr",
      icon: GithubIcon,
      handle: "@faiyajr",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/faiyajrahman",
      icon: LinkedinIcon,
      handle: "in/faiyajrahman",
    },
    {
      label: "Email",
      href: "mailto:faiyajr@umich.edu",
      icon: Mail,
      handle: "faiyajr@umich.edu",
    },
    {
      label: "Resume",
      href: "/resume/faiyaj-rahman-resume.pdf",
      icon: FileText,
      handle: "PDF",
    },
  ] satisfies SocialLink[],

  // ── Navigation ──────────────────────────────────────────────────────────
  nav: [
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type Site = typeof site;
