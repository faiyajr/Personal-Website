# Personal Website

Portfolio for Faiyaj Rahman. Next.js App Router, TypeScript end to end, Tailwind v4, Motion, shadcn-style primitives. Deploys to Vercel.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, RSC) | Static-generates every page; case studies are pure HTML at the edge |
| Language | TypeScript, `strict` | Content is schema-validated, so a bad project file fails the build instead of the page |
| Styling | Tailwind v4 | Tokens live in `globals.css` under `@theme`; no `tailwind.config.js` in v4 |
| Components | shadcn/ui conventions | `components.json` is configured — `npx shadcn@latest add dialog` drops straight into `src/components/ui/` |
| Motion | Motion (Framer Motion) | Scroll reveals, magnetic buttons, shared-layout nav pill |
| Content | MDX + Zod | See [Content](#content) |
| Email | Resend or Formspree | See [Contact form](#contact-form) |

Every animation checks `useReducedMotion()` and renders the final state immediately when the visitor has asked for reduced motion.

---

## Layout

```
content/projects/*.mdx      ← your projects live here. This is the CMS.
public/images/projects/     ← screenshots
public/resume/              ← compiled resume PDF
resume/                     ← LaTeX source

src/
  app/
    page.tsx                home — hero + bento grid
    projects/page.tsx       filterable index
    projects/[slug]/        case study (statically generated per project)
    about/ contact/
    api/contact/route.ts    form endpoint
    sitemap.ts robots.ts opengraph-image.tsx
    globals.css             ← all design tokens
  components/
    motion/                 reveal, text-reveal, magnetic, parallax, scroll-progress
    ui/                     button, badge, field  (shadcn-style)
  lib/
    site.ts                 ← name, bio, socials, nav. Edit this first.
    resume.ts               experience / education / skills for /about
    content/                schema.ts · mdx-source.ts · index.ts
```

---

## Content

### Add a project

1. Copy `content/projects/_TEMPLATE.mdx` to `content/projects/your-slug.mdx`. The filename becomes the URL.
2. Fill in the frontmatter. `title`, `summary`, and `year` are required; everything else is optional.
3. Put screenshots in `public/images/projects/your-slug/` and reference them as `/images/projects/your-slug/cover.png`.
4. Write the case study below the frontmatter in Markdown/MDX.

Frontmatter is validated by Zod at build time — a typo or missing `alt` text fails `npm run build` with the file name and the offending field, rather than shipping a broken card.

### Grid sizes

`size` in frontmatter controls the bento cell (six-column grid from `md` up):

| `size` | Span | Use for |
| --- | --- | --- |
| `wide` | full row | the one project you most want seen |
| `lg` | 4 / 6 | strong projects with a good screenshot |
| `md` | 3 / 6 | default |
| `sm` | 2 / 6 | smaller entries |
| `tall` | 2 / 6, double height | mobile app screenshots |

Mix sizes deliberately — a uniform grid is what makes a portfolio look like a template.

`featured: true` puts a project on the home page; `order` sorts that grid. If nothing is featured, the home page falls back to the four newest.

### Images

Screenshots go in `public/`, served through `next/image` (AVIF/WebP, lazy, correctly sized). Aim for ~2400px wide PNG or JPG; Next downscales per breakpoint.

Every image needs real `alt` text — describe what is on screen, not "screenshot of app". The schema rejects an empty one.

To move media to Cloudinary or S3 later, add the host to `remotePatterns` in `next.config.ts` and use absolute URLs in frontmatter. Nothing else changes.

### Swapping in a hosted CMS

The site reads content only through `src/lib/content/index.ts`. Local MDX is the current source because it version-controls with the code, needs no account, and cannot go down.

To move to Sanity/Contentful/Payload: write `src/lib/content/<cms>-source.ts` exporting `loadProjects(): Promise<Project[]>` mapped onto the `Project` type in `schema.ts`, change the one import in `index.ts`, and make its functions `async`. No page or component changes.

---

## Pages

| Route | Content | Edited in |
| --- | --- | --- |
| `/` | Hero, project showcase, bento grid, compact experience timeline, toolkit | `src/lib/site.ts` + content |
| `/projects` | Filterable index; `/projects/[slug]` per case study | `content/projects/*.mdx` |
| `/experience` | Full timeline, education, honors, skills | `src/lib/resume.ts` |
| `/about` | Bio, photos, interests, Spotify, watches, contact form | `src/lib/about.ts` |
| `/contact` | Links + form | `src/lib/site.ts` |

---

## The About page

Four things beyond the resume, each edited in a different place:

| Section | Edit here |
| --- | --- |
| Photos | Drop files in `public/images/me/` — no config. Rendered as an auto-advancing slideshow. Filenames become alt text, so name them `hocking-hills.png`, not `IMG_4821.jpg` |
| Interests | `interests` in `src/lib/about.ts` |
| Watches | `watches` in `src/lib/about.ts`. Posters live in `public/images/watches/`. An entry whose poster file is missing is skipped rather than rendering broken, so you can add the entry before the image |
| On repeat | `onRepeat` in `src/lib/about.ts` (fallback), or the live Spotify API — see below |

Each section hides itself when empty, so you can fill them in one at a time.

### Spotify

Shows what you're playing now plus your top five tracks this month, live from the Spotify API — no redeploy needed to stay current.

> **The Web API requires a Spotify Premium subscription.** Without one, Spotify blocks the app outright and every request 403s. In that case the panel falls back to the hand-written `onRepeat` list in `src/lib/about.ts`, which needs no account and never breaks.

If you do have Premium:

```bash
# 1. Create an app: https://developer.spotify.com/dashboard
# 2. Under "Which API/SDKs are you planning to use?" tick **Web API**
# 3. Add redirect URI:  http://127.0.0.1:8888/callback
# 4. Put the client ID + secret in .env.local
npm run spotify:auth        # opens Spotify, prints your refresh token
# 5. Paste SPOTIFY_REFRESH_TOKEN into .env.local and Vercel
```

Refresh tokens don't expire, so that's one-time. The route treats "no credentials", "blocked", and "empty response" identically: report unavailable, let the UI use the fallback. It never renders an empty panel.

---

## Hero headline

The line under your name cycles through `headlinePhrases` in `src/lib/site.ts` with a decode effect — each character resolves out of glyph noise, left to right.

It reserves its final height up front, so nothing below it shifts between phrases, and it announces only the settled phrase to screen readers rather than every scrambled frame.

---

## Home page pieces

- **Typing effect** — phrases cycle under your name. Edit `typingPhrases` in `src/lib/site.ts`. Each has to read correctly after "I'm Faiyaj,".
- **C++ struct card** — the facts block. Edit `structFields` in `src/lib/site.ts`; add a field and it renders. Tokens are coloured by hand rather than by a syntax highlighter, since shipping a Shiki grammar to colour twelve fixed lines isn't worth the bytes.
- **Project showcase** — the pill picker. Shows every project with `featured: true`, ordered by `order`. It's a real ARIA tablist, so arrow keys work.
- **Bento grid** — everything *not* featured, so each project appears exactly once on the page.

---

## Resume

- **PDF (the download button):** compile your LaTeX and put the output at `public/resume/faiyaj-rahman-resume.pdf`. Overleaf → Download PDF is fine. Keep the `.tex` source in `resume/` — build artifacts are gitignored.
- **Web version (`/about`):** `src/lib/resume.ts` holds typed experience, education, and skills. This is what search engines and recruiters' keyword filters actually read, so keep it in sync with the PDF.
- Change the filename in `site.resumePath` if you name it differently.

---

## Contact form

`/contact` has both direct links and a real form. The form posts to `/api/contact`, which validates with the same Zod schema the client uses, rate-limits to 5 requests/minute per IP, and drops honeypot submissions with a silent `200`.

Pick one provider and set it in `.env.local` (and in Vercel → Settings → Environment Variables):

**Resend** — `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`. Free tier covers 3k emails/month. Verify a sending domain, or use `onboarding@resend.dev` while testing.

**Formspree** — `FORMSPREE_ENDPOINT` only. No domain setup.

With neither set, the route returns `501` and a message saying so. It never silently swallows mail.

---

## Deploying

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new). Framework detection and build settings need no changes.
3. Set `NEXT_PUBLIC_SITE_URL` to the final domain — metadata, OG tags, `sitemap.xml`, and `robots.txt` all derive from it. Add the contact-form vars.
4. Add your custom domain under Settings → Domains.

Every push to `main` redeploys; pull requests get preview URLs.

---

## Design tokens

All colour, type, and spacing tokens are in `src/app/globals.css`. Light is the base palette, `.dark` overrides the same variable names, and `@theme inline` exposes them as Tailwind utilities. **Never hard-code a hex in a component** — add a token.

The palette is built from five colours:

| | Hex | Role |
| --- | --- | --- |
| Deep pine | `#2C3531` | Dark surface / light text |
| Teal | `#116466` | Light-mode accent |
| Tan | `#D9B08C` | Supporting warm tone (`--accent-2`) |
| Peach | `#FFCB9A` | Dark-mode accent |
| Mint | `#D1E8E2` | Dark-mode text / light-mode accent-soft |

The accent flips role between themes deliberately — teal carries emphasis on light ground, peach on dark, because neither reads as an accent against both.

### Animated background

`src/components/background/` renders behind every page:

- **Drifting blobs** — three blurred radial gradients on long, mutually prime durations so the loop never visibly repeats. Transform and opacity only, so they composite on the GPU.
- **Grid** — faint engineering-drawing rule, radially masked so it fades at the edges.
- **Particle field** — a canvas where particles drift, link to near neighbours, and are pushed away by the cursor with an inverse-square force plus a damped spring back to rest.

The particle field disables itself entirely under `prefers-reduced-motion`, pauses when the tab is hidden, scales its count with viewport area, and re-reads its colour when you toggle the theme.

Type scales fluidly via `clamp()` (`text-display-xl` down to `text-lead`), so headings resize continuously between 375px and 1440px with no breakpoint overrides.

Fonts: Instrument Serif (display), Inter (body), JetBrains Mono (labels), self-hosted through `next/font` — no external requests, no layout shift.

---

## Notes

- ESLint is pinned to v9. `eslint-config-next@16` bundles `eslint-plugin-react@7.37`, which calls `context.getFilename()` — removed in ESLint 10, so v10 crashes on startup. Revisit when the plugin updates.
- Brand icons (GitHub, LinkedIn) live in `src/components/icons.tsx`; lucide v1 dropped them.
- Delete `content/projects/example-project.mdx` once you have real work in place.
