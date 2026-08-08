/**
 * The personal half of the About page — the parts a resume has no room for.
 *
 * Photos are NOT listed here. Drop image files into `public/images/me/` and
 * they appear automatically; see `src/lib/photos.ts`.
 */

export type Interest = {
  /** Short label, e.g. "Football". */
  label: string;
  /** One line. Specific beats generic — "left back, Sunday league" not "sports". */
  detail: string;
  /** Any emoji. Rendered large above the label. */
  emoji: string;
};

export type Film = {
  title: string;
  year?: number;
  /** One line on why it's here. This is the interesting part, not the title. */
  note?: string;
  /** Optional: drop a poster in `public/images/films/` and reference it. */
  poster?: string;
};

// ── Replace the placeholders below ────────────────────────────────────────

export const interests: Interest[] = [
  {
    emoji: "⚽",
    label: "Football",
    detail: "No, it's not soccer. Replace this with your position and who you support.",
  },
  {
    emoji: "🏋️",
    label: "The gym",
    detail: "Lifting heavy metal circles. Swap in your split or a current PR.",
  },
  {
    emoji: "🎮",
    label: "Gaming",
    detail: "Late-night lobbies. Name the games you actually play.",
  },
  {
    emoji: "⌨️",
    label: "Keyboards",
    detail: "Building them, mostly. See the Hall-effect board in my work.",
  },
];

export const films: Film[] = [
  { title: "Replace me", year: 2010, note: "One line on why this one stuck with you." },
  { title: "And me", year: 2014, note: "Films, shows, anime — whatever you actually watch." },
  { title: "Add as many as you like", note: "Six to nine reads best in the grid." },
];

/** Optional heading above the films grid — say what the list actually is. */
export const filmsIntro =
  "Rewatched more than is reasonable. Replace this line with your own framing.";
