import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { projectFrontmatterSchema, type Project } from "./schema";

/**
 * Local MDX content source.
 *
 * Reads `content/projects/*.mdx` at build time. Files beginning with `_` are
 * ignored, so `_TEMPLATE.mdx` can live alongside real entries.
 */

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function readProjectFile(filename: string): Project {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    // Fail the build loudly rather than shipping a half-rendered card.
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in content/projects/${filename}:\n${issues}`);
  }

  return { ...parsed.data, slug, body: content.trim() };
}

export function loadProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .map(readProjectFile)
    .filter((p) => !p.draft);
}
