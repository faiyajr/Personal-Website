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

/**
 * Experience in the order it appears on the PDF resume, which leads with the
 * most relevant roles rather than strict dates. Site-only roles go last.
 */
export function getExperience(): Experience[] {
  return experience;
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
      "Engineered a multi-threaded GUI tool used by 100+ developers to build Python executables, saving $15K in licenses.",
    ],
    tech: ["Python", "CAN/DBC", "MF4", "Flask", "PySide6", "AWS", "Docker", "Kubernetes", "Bash", "Git"],
  },
  {
    company: "MRacing FSAE",
    role: "Software Engineer",
    start: "Aug 2025",
    end: "Present",
    location: "Ann Arbor, MI",
    points: [
      "Built a C++ Raspberry Pi dashboard decoding 1000+ CAN messages/sec into driver analytics & fault states over 3 pages.",
      "Collaborated with engineers to integrate vehicle telemetry, CAN diagnostics, and fault checking into the racing dashboard.",
      "Wrote C firmware for an infrared lap trigger, edge-detecting photosensor voltage drops on beam breaks to timestamp laps.",
    ],
    tech: ["C", "C++", "Embedded Systems", "CAN", "Raspberry Pi", "Linux", "GitLab"],
  },
  {
    company: "Hikmah Hackers",
    role: "Co-Founder & Lead Instructor",
    start: "Sep 2026",
    end: "Present",
    location: "Warren, MI",
    points: [
      "Co-founded a coding and mentorship program for underserved middle and high school students at a STEM school, teaching programming fundamentals through problem sets & hands-on mini-projects, and giving students tailored career guidance.",
      "Designing a curriculum spanning CS topics, game/web dev, and AI scripting, featuring hackathons offering cash prizes.",
    ],
    tech: ["Teaching", "Curriculum Design", "Mentorship", "Python", "Game Dev", "Web Dev"],
  },
  {
    company: "University of Michigan Electric Vehicle Center",
    role: "Undergraduate Research Software Developer",
    start: "Sep 2025",
    end: "May 2026",
    location: "Ann Arbor, MI",
    points: [
      "Developed open-source Python UI software for an EV charging module, contributing to $10K in net savings for an OEM.",
      "Designed a Simulink finite-state machine for system-safety logic and charging protocols, translating models into Python.",
    ],
    tech: ["Simulink", "Python", "State Machines", "Raspberry Pi", "PySide6"],
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
    ],
    tech: ["TypeScript", "React", "Node/Express", "PostgreSQL", "Supabase", "Tailwind CSS", "Git"],
  },
  {
    // Not on the PDF resume — site only.
    company: "Stealth",
    role: "Founder",
    start: "Sep 2026",
    end: "Present",
    points: ["Building in the AI automation space. Can't say much more yet. More soon."],
    tech: ["██████", "████", "████████"],
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
    end: "May 2029",
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
    items: ["C", "C++", "Python", "Assembly", "Verilog", "MATLAB", "JavaScript", "TypeScript", "SQL", "Julia", "Bash"],
  },
  {
    label: "Hardware & Embedded",
    items: [
      "STM32",
      "FPGA",
      "CAN/DBC",
      "Raspberry Pi",
      "GPIO",
      "ADC",
      "UART",
      "SPI",
      "I2C",
      "PCB Design",
      "Altium",
      "KiCad",
      "SolidWorks",
      "Siemens NX",
      "Simulink",
    ],
  },
  {
    label: "Tools & Frameworks",
    items: [
      "Linux",
      "GDB",
      "Valgrind",
      "Make",
      "CMake",
      "GitLab",
      "Docker",
      "Kubernetes",
      "AWS",
      "React",
      "Node/Express",
      "Tailwind",
      "PySide6",
      "Flask",
      "PostgreSQL",
      "Supabase",
      "Claude Code",
      "Codex",
      "Cursor",
    ],
  },
  {
    label: "Practices",
    items: ["Agile/Scrum", "Git/GitHub", "CI/CD", "Code review", "Unit testing", "LLM agents"],
  },
];
