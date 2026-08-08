import { z } from "zod";

/**
 * The shape every project must satisfy, regardless of where it is stored.
 *
 * This is the contract between the content source (currently local MDX) and
 * the UI. If you later move to a hosted headless CMS, you write a new source
 * that returns objects matching this schema and nothing in `src/app` or
 * `src/components` has to change. See `src/lib/content/index.ts`.
 */

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1, "alt text is required — it is read by screen readers"),
  caption: z.string().optional(),
});

export const linkSchema = z.object({
  label: z.string(),
  /** An absolute URL, or an internal path like `/contact`. */
  href: z
    .string()
    .refine(
      (value) => value.startsWith("/") || URL.canParse(value),
      "must be an absolute URL or a path starting with /",
    ),
});

export const metricSchema = z.object({
  /** e.g. "Active users" */
  label: z.string(),
  /**
   * e.g. "1.2k" — keep it short, it renders large.
   * Numbers are accepted too: YAML reads an unquoted `value: 5` as a number,
   * and failing the build over a missing pair of quotes helps nobody.
   */
  value: z.union([z.string(), z.number().transform(String)]),
});

/** Controls how much room the card takes in the bento grid on the home page. */
export const cardSizeSchema = z.enum(["sm", "md", "lg", "wide", "tall"]);

export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  /** One line. Shown on the card and in search results. */
  summary: z.string().min(1),
  /** Longer intro paragraph at the top of the case study. Optional. */
  description: z.string().optional(),

  year: z.union([z.number().int(), z.tuple([z.number().int(), z.number().int()])]),
  /** e.g. "Solo build", "Backend lead (team of 4)" */
  role: z.string().optional(),
  status: z.enum(["live", "archived", "in-progress"]).default("live"),

  /** Featured projects appear on the home page bento grid. */
  featured: z.boolean().default(false),
  /** Lower sorts first within the featured grid. */
  order: z.number().int().default(100),
  size: cardSizeSchema.default("md"),

  tech: z.array(z.string()).default([]),
  /** Source code. Omit for private/closed-source work. */
  repo: z.string().url().optional(),
  /** Deployed product. Omit if there is nothing to click. */
  demo: z.string().url().optional(),
  /** Any extra links: case study, blog post, App Store, paper. */
  links: z.array(linkSchema).default([]),

  cover: imageSchema.optional(),
  gallery: z.array(imageSchema).default([]),
  metrics: z.array(metricSchema).default([]),
  /** Bullet points shown beside the hero on the case study page. */
  highlights: z.array(z.string()).default([]),

  /** Set true to keep a file in the repo but hide it from the site. */
  draft: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export type Project = ProjectFrontmatter & {
  slug: string;
  /** Raw MDX body — the case study. May be an empty string. */
  body: string;
};

export type Image = z.infer<typeof imageSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type CardSize = z.infer<typeof cardSizeSchema>;
