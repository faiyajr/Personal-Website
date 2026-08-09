import type { Metadata } from "next";

import { ProjectsExplorer } from "@/components/projects-explorer";
import { BlurReveal } from "@/components/motion/blur-reveal";
import { Reveal } from "@/components/motion/reveal";
import { getAllProjects, getAllTech } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects — what the problem was, how it was built, and what shipped.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const tech = getAllTech();

  return (
    <div className="container-page py-16 md:py-24">
      <header className="mb-12 md:mb-16">
        <Reveal>
          <p className="eyebrow mb-4">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </Reveal>
        <BlurReveal
          text="Work."
          as="h1"
          className="font-display text-display-lg text-foreground"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lead text-muted">
            Everything I&apos;ve built that&apos;s worth showing. Filter by stack, or open a
            case study for the full write-up.
          </p>
        </Reveal>
      </header>

      <ProjectsExplorer projects={projects} tech={tech} />
    </div>
  );
}
