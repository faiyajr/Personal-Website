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
    end: "Present",
    location: "Farmington Hills, MI",
    points: [
      "Architecting a modular platform hosting all organization file-conversion tools, first shipping CAN .asc to MF4 with DBC channel mapping for MDA — dropping the licensed CANalyzer dependency and saving 20+ engineer-hours monthly.",
      "Prototyping org-wide agentic AI by wiring LLM agents to internal CLIs and Git, cutting development time by 30%.",
      "Deployed a fleet monitoring platform to AWS and scripted multi-tenant vehicle analytics scaling to 5000+ vehicles.",
      "Engineered a multi-threaded GUI used by 100+ developers to build Python executables, saving $15K in costs.",
    ],
    tech: ["Python", "AWS", "Agentic AI", "REST API", "Docker", "Kubernetes", "CI/CD", "Bash"],
  },
  {
    company: "Saf",
    role: "Co-Founder & Software Engineer",
    start: "Nov 2025",
    end: "Present",
    location: "Warren, MI",
    points: [
      "Co-founded Saf under Darul Uloom Michigan, a platform unifying 5 products for the Muslim community: Arshad (school management), Tajul Haramain (pilgrimage packages), school admissions, prayer times, and staff time clock.",
      "Moved password and role verification server-side into a Supabase edge function, enforcing Postgres RLS across 4 portals.",
      "Shipped 300+ PRs and 43 deploys with typed CI and forward-only SQL migrations for 30+ educators and admins.",
      "Integrating AI and an investor demo hub with 200+ users ahead of a venture raise and scholar-backed public launch.",
    ],
    tech: ["TypeScript", "React", "Supabase", "PostgreSQL", "Tailwind CSS", "Git"],
  },
  {
    company: "MRacing FSAE",
    role: "Software Engineer",
    start: "Aug 2025",
    end: "Present",
    location: "Ann Arbor, MI",
    points: [
      "Built a C++ Raspberry Pi dashboard decoding 1000+ CAN messages/sec into signals and fault states across 3 pages.",
      "Refactored the legacy Python GUI codebase into C++, cutting latency ~100× and improving signal timing ~50%.",
      "Collaborated with test engineers to debug and validate software, ensuring ~100% data consistency across signals.",
    ],
    tech: ["C/C++", "Embedded Systems", "Linux", "CAN", "Raspberry Pi", "GitLab"],
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
    tech: ["Python", "Raspberry Pi", "Simulink", "Figma"],
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
      "C/C++",
      "Python",
      "TypeScript",
      "JavaScript",
      "Assembly",
      "Java",
      "SQL",
      "Verilog",
      "OCaml",
      "MATLAB",
    ],
  },
  {
    label: "Tools & Frameworks",
    items: [
      "React",
      "Node",
      "PostgreSQL",
      "Supabase",
      "Linux",
      "Git",
      "Docker",
      "AWS",
      "PyTorch",
      "FastAPI",
    ],
  },
  {
    label: "Hardware & Embedded",
    items: ["STM32", "Raspberry Pi", "Altium", "CAD", "FPGA", "CAN Bus"],
  },
];
