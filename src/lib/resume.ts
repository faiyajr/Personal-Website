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
      "Deployed an operations platform to AWS and scripted multi-tenant KPIs and analytics scaling to 5000+ vehicles.",
      "Designed a tool to convert CAN .asc logs to MF4 with DBC channel mapping, saving 20+ engineer-hours monthly.",
      "Shipped a 3-agent pipeline, cleaning and tagging internal docs for a master agent, cutting new-hire escalations 40%.",
      "Configured a robust REST API data pipeline, boosting data extraction speeds for project management analytics by 5x.",
      "Engineered a multi-threaded GUI tool used by 100+ developers to build Python executables, saving $15K in licenses.",
      "Scoped multiple user stories in 2-week sprints with code reviews, demoing 4 tools org-wide to non-technical customers.",
    ],
    tech: [
      "Agentic AI",
      "Python",
      "AWS",
      "REST APIs",
      "CI/CD",
      "Docker",
      "Kubernetes",
      "Bash",
      "Git",
    ],
  },
  {
    company: "Saf · Darul Uloom Michigan",
    role: "Software Developer",
    start: "Nov 2025",
    end: "Present",
    location: "Warren, MI",
    points: [
      "Launched a school-management beta on Postgres, an Express REST API, and React with role-based access control.",
      "Implemented assignment making, grading, attendance, and an admin panel, replacing paper grades for 20+ educators.",
      "Ran the school's live pilot for 3 months in 2-week sprints, shipping 5 iterations from educator review with feedback.",
      "Currently contributing to the production platform and implementing AI feature work ahead of scholar-backed launch.",
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
      "Built a C++ Raspberry Pi dashboard decoding 1000+ CAN messages/sec into signals and fault states across 3 pages.",
      "Wrote firmware for an IR lap trigger, edge-detecting photosensor voltage drops on beam break to timestamp laps.",
      "Partnered with the testing subteam to debug and validate software on-vehicle, ensuring ~100% data consistency.",
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
    // NOT in resume.tex — add the real dates and bullets, then mirror them
    // back into the LaTeX so the PDF and the site agree.
    company: "University of Michigan ITS",
    role: "Tech Consultant",
    start: "Aug 2025",
    end: "Present",
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
      "Relevant coursework: Data Structures and Algorithms, Computer Organization, Object Oriented Programming, Discrete Math, Computing Systems, Computational Linear Algebra, Vector Calculus",
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
      "Claude",
      "Cursor",
      "Codex",
      "React",
      "Node",
      "FastAPI",
      "PostgreSQL",
      "Supabase",
      "AWS",
      "Docker",
      "Linux",
      "PyTorch",
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
