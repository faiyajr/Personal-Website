/**
 * Structured resume data, rendered on /about.
 *
 * A typed mirror of `resume/resume.tex`. The PDF in `public/resume/` is the
 * canonical download; this is the crawlable web version, which is what
 * keyword filters and search engines actually read. Keep the two in sync.
 */

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  url?: string;
  points: string[];
  tech?: string[];
};

export type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
  location?: string;
  details?: string[];
};

export type Award = {
  title: string;
  issuer?: string;
  date: string;
  location?: string;
  description?: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/**
 * Turn "May 2026" / "2025" / "Present" into a sortable number.
 * "Present" sorts above every real date so ongoing roles win a tie.
 */
function toSortKey(value: string): number {
  const text = value.trim().toLowerCase();
  if (text === "present" || text === "current") return Number.MAX_SAFE_INTEGER;

  const year = Number(/\d{4}/.exec(text)?.[0] ?? 0);
  const month = MONTHS.findIndex((m) => text.startsWith(m));
  return year * 12 + (month === -1 ? 0 : month);
}

/**
 * Experience in true reverse-chronological order: most recent start first,
 * ties broken by whichever role is still running.
 *
 * Sorted here rather than by hand so adding a role to the array below never
 * requires putting it in the right slot.
 */
export function getExperience(): Experience[] {
  return [...experience].sort(
    (a, b) => toSortKey(b.start) - toSortKey(a.start) || toSortKey(b.end) - toSortKey(a.end),
  );
}

export const experience: Experience[] = [
  {
    company: "Bosch",
    role: "Software Engineering Intern",
    start: "May 2026",
    end: "Aug 2026",
    location: "Farmington Hills, MI",
    points: [
      "Deployed a Flask operations platform to AWS and scripted multi-tenant KPIs and analytics scaling to 5000+ devices.",
      "Designed a Python tool to convert CAN .asc logs to MF4 with DBC channel mapping, saving 20+ engineer-hours monthly.",
      "Shipped a 3-agent pipeline, cleaning and tagging internal documents for a master agent, cutting new-hire escalations 40%.",
      "Engineered a multi-threaded GUI tool used by 100+ developers to build Python executables, saving $15K in licenses.",
    ],
    tech: [
      "Agentic AI",
      "Python",
      "Flask",
      "PySide6",
      "AWS",
      "REST APIs",
      "CI/CD",
      "Docker",
      "Kubernetes",
      "Bash",
      "Git",
    ],
  },
  // The stealth role, Hikmah Hackers and Roblox tie on dates; the sort is
  // stable, so this array order decides which shows first.
  {
    company: "Stealth",
    role: "Building something new",
    start: "Sep 2026",
    end: "Present",
    points: ["Working on something I can't talk about yet. More soon."],
    tech: ["██████", "████", "████████"],
  },
  {
    company: "Hikmah Hackers",
    role: "Co-Founder & Lead Instructor",
    start: "Sep 2026",
    end: "Present",
    location: "Warren, MI",
    points: [
      "Co-founded a coding and mentorship program for underserved middle and high school students at an Islamic STEM school, teaching programming fundamentals through problem sets & hands-on mini-projects, and giving students career guidance.",
      "Designing a curriculum spanning CS topics, game/web dev, and AI scripting, featuring hackathons offering cash prizes.",
    ],
    tech: ["Teaching", "Curriculum Design", "Mentorship", "Python", "Game Dev", "Web Dev"],
  },
  {
    company: "Roblox",
    role: "Independent Game Developer",
    start: "Sep 2026",
    end: "Present",
    points: [
      "Independently designing, scripting, and publishing Roblox games in Luau, from gameplay systems to live updates.",
    ],
    tech: ["Lua", "Luau", "Roblox Studio", "Game Design"],
  },
  {
    company: "Saf · Darul Uloom Michigan",
    role: "Software Developer",
    start: "Nov 2025",
    end: "Present",
    location: "Warren, MI",
    points: [
      "Launched a school-management beta on Postgres, an Express REST API, and React featuring role-based access control.",
      "Implemented assignments, grading, and attendance, replacing paper grades for 20+ educators in a 3-month live pilot.",
      "Driving AI integration on a 3-engineer team, scoping LLM report card narratives & role-scoped natural language querying.",
    ],
    tech: ["Claude", "TypeScript", "React", "Supabase", "PostgreSQL", "Tailwind CSS", "Git"],
  },
  {
    company: "MRacing FSAE",
    role: "Software Engineer",
    start: "Aug 2025",
    end: "Present",
    location: "Ann Arbor, MI",
    points: [
      "Built a C++ Raspberry Pi dashboard decoding 1000+ CAN messages/sec into driver analytics & fault states over 3 pages.",
      "Wrote firmware for an infrared lap trigger, edge-detecting photosensor voltage drops on beam breaks to timestamp laps.",
    ],
    tech: ["Cursor", "C/C++", "Embedded Systems", "Linux", "CAN", "Raspberry Pi", "GitLab"],
  },
  {
    company: "University of Michigan Electric Vehicle Center",
    role: "Undergraduate Research Software Developer",
    start: "Sep 2025",
    end: "May 2026",
    location: "Ann Arbor, MI",
    points: [
      "Developed open-source Python software for an EV charging module, contributing to $10K in net savings for an OEM.",
      "Designed a Simulink FSM for system-safety logic and charging protocols, porting it to Python for pipeline integration.",
    ],
    tech: ["Claude", "Python", "Raspberry Pi", "Simulink", "Figma"],
  },
  {
    // Not on the PDF resume — site only.
    company: "University of Michigan ITS",
    role: "Tech Consultant",
    start: "Aug 2025",
    end: "Sep 2026",
    location: "Ann Arbor, MI",
    points: [
      "Administered new computers, devices, and ID access credentials for campus customers and students.",
      "Diagnosed hardware, software, and network issues while escalating complex cases to senior consultants.",
      "Utilized GSX and TeamDynamix to manage support tickets, track loaner/repaired devices, issues, and resolutions.",
    ],
    tech: ["TeamDynamix", "GSX", "Troubleshooting", "Consulting"],
  },
];

export const education: Education[] = [
  {
    school: "University of Michigan",
    degree: "B.S.E. in Computer Engineering",
    start: "2025",
    end: "May 2028",
    location: "Ann Arbor, MI",
    details: [
      "GPA: 3.6/4.0 · Dean's List",
      "Coursework: Data Structures & Algorithms, Computer Architecture, Object Oriented Programming, Discrete Math, Computing Systems, Linear Algebra, Multivariable & Vector Calculus",
    ],
  },
];

export const awards: Award[] = [
  {
    title: "Jane Street FOCUS Participant",
    date: "May 2026",
    location: "New York, NY",
    description:
      "Competitive quantitative trading and software engineering program, selected from 1000+ applicants.",
  },
];

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      "Python",
      "C/C++",
      "JavaScript",
      "TypeScript",
      "SQL",
      "Lua",
      "Julia",
      "Bash",
      "Assembly",
      "Verilog",
      "MATLAB",
      "Java",
      "OCaml",
    ],
  },
  {
    label: "Tools & Frameworks",
    items: [
      "Claude Code",
      "Cursor",
      "Codex",
      "React",
      "Node/Express",
      "FastAPI",
      "Flask",
      "PySide6",
      "Tailwind",
      "PyTorch",
      "GoogleTest",
      "PostgreSQL",
      "Supabase",
      "AWS",
      "Docker",
      "Kubernetes",
      "Linux",
      "GitLab",
      "Simulink",
      "Roblox Studio",
    ],
  },
  {
    label: "Hardware & Embedded",
    items: ["STM32", "Raspberry Pi", "Altium", "CAD", "FPGA", "CAN Bus"],
  },
  {
    label: "Practices",
    items: [
      "Agile/Scrum",
      "Git/GitHub",
      "CI/CD",
      "Code review",
      "Unit testing",
      "REST API design",
      "RAG & LLM agents",
    ],
  },
];
