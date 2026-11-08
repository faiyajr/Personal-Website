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
    "Hey! I'm Faiyaj. I like dabbling in building, programming, playing football, going to the gym, and the occasional late-night gaming session. Hope you enjoy your stay!",

  /**
   * Cycled through by the decode effect under the hero heading.
   * Each one has to read correctly after "I'm Faiyaj,".
   */
  headlinePhrases: [
    "a Computer Engineering student at Michigan.",
    "an engineer.",
    "a builder.",
    "a lifelong learner.",
    "a leader.",
  ],

  location: "Ann Arbor, MI",
  email: "faiyajr@umich.edu",

  // ── The C++ struct card on the home page ────────────────────────────────
  structName: "Faiyaj",
  structFields: [
    { type: "std::string", name: "school", value: "University of Michigan" },
    { type: "std::string", name: "major", value: "Computer Engineering" },
    { type: "std::string", name: "role", value: "prev: SWE Intern @ Bosch" },
    { type: "std::string", name: "location", value: "Ann Arbor, MI" },
    { type: "std::string", name: "email", value: "faiyajr@umich.edu" },
    {
      type: "std::vector<std::string>",
      name: "interests",
      value: ["embedded", "firmware", "processors", "low-level"],
    },
  ] satisfies StructField[],

  // ── "What I build with" on the home page, in display order ──────────────
  toolkit: [
    "C",
    "C++",
    "Assembly",
    "Verilog",
    "Python",
    "STM32",
    "FPGA",
    "CAN/DBC",
    "ADC",
    "UART",
    "SPI",
    "I2C",
    "PCB Design",
    "KiCad",
    "Raspberry Pi",
    "Linux",
    "GDB",
    "Make/CMake",
    "Simulink",
  ],

  // ── About page bio ──────────────────────────────────────────────────────
  bio: [
    "I'm a Computer Engineering student at the University of Michigan with a deep interest in embedded systems, firmware, and processor architecture. I enjoy digging into where hardware and software meet and building things from the bare metal up.",
    "I just wrapped up a Software Engineering internship at Bosch, where I worked on agentic AI and cloud platforms. Now I'm a Software Developer at Saf and co-founder of Hikmah Hackers, a coding and mentorship program for middle and high schoolers. On the side I'm working on an automation project of my own.",
    "When I'm not debugging firmware or poking at processors, you'll usually find me lifting heavy metal circles, playing football (no, it's not soccer), or running through lobbies in games 🤪.",
    "Whether it's embedded firmware, processor design, or low-level C/C++, I'm always up for connecting on hard engineering problems. Reach me at faiyajr@umich.edu.",
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
