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

export type Watch = {
  title: string;
  year?: number;
  kind: "film" | "series" | "anime";
  /** Poster filename inside `public/images/watches/`. */
  poster: string;
};

export const interests: Interest[] = [
  {
    emoji: "⚽",
    label: "Football",
    detail:
      "No, it's not soccer. My team is Barcelona. Força Barça! My favourite player is Messi and my favourite national team is Spain.",
  },
  {
    emoji: "🏋️",
    label: "The gym",
    detail:
      "Lifting heavy metal circles. Squat 335, bench 265, deadlift 435. Yes, I have to hit legs more (I won't).",
  },
  {
    emoji: "🎮",
    label: "Gaming",
    detail:
      "Late-night lobbies. Mainly Fortnite, Roblox, and occasionally Valorant. Fun fact: I killed Peterbot (the LeBron of Fortnite) in 2022. On God, no cap bro.",
  },
  {
    emoji: "☪️",
    label: "Islamic studies",
    detail:
      "Being a devout Muslim, I try to learn as much about my religion as I can — currently working toward becoming an Islamic scholar (Alim).",
  },
];

/**
 * Posters live in `public/images/watches/`. To add one: drop the image in,
 * then add an entry here.
 *
 * Entries whose poster file is missing are skipped rather than rendering a
 * broken image — see `src/lib/watches.ts`. So it is safe to add the entry
 * first and the file later.
 */
export const watches: Watch[] = [
  { title: "Interstellar", year: 2014, kind: "film", poster: "interstellar.jpg" },
  { title: "The Dark Knight", year: 2008, kind: "film", poster: "the-dark-knight.jpg" },
  { title: "Oppenheimer", year: 2023, kind: "film", poster: "oppenheimer.jpg" },
  { title: "Fight Club", year: 1999, kind: "film", poster: "fight-club.jpg" },
  { title: "The Batman", year: 2022, kind: "film", poster: "the-batman.jpg" },
  {
    title: "Spider-Man: Brand New Day",
    year: 2026,
    kind: "film",
    poster: "spider-man-brand-new-day.jpg",
  },
  { title: "Breaking Bad", year: 2008, kind: "series", poster: "breaking-bad.jpg" },
  { title: "Dexter", year: 2006, kind: "series", poster: "dexter.jpg" },
  { title: "Naruto", year: 2002, kind: "anime", poster: "naruto.jpg" },
  { title: "Death Note", year: 2006, kind: "anime", poster: "death-note.jpg" },
];

/** Line above the watches grid. */
export const watchesIntro = "I've watched these too much for my own good…";

export type ManualTrack = {
  title: string;
  artist: string;
  /** Optional Spotify link — "Share → Copy Song Link" on any track. */
  url?: string;
};

/**
 * Hand-written fallback for the "on repeat" panel.
 *
 * The live Spotify API needs a Premium account; without one the Web API
 * refuses the app entirely. This list renders instead whenever the API is
 * unavailable, so the section is never empty. If Spotify does start working,
 * the live data takes over and this is ignored.
 */
export const onRepeat: ManualTrack[] = [
  { title: "Replace me", artist: "With a real track" },
  { title: "And me", artist: "Five or so reads best" },
];
