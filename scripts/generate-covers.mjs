// Generates the illustrated project covers in public/images/projects/<slug>/cover-illustrated.png.
// Each cover is drawn as SVG, then rasterised to PNG with sharp.
//   node scripts/generate-covers.mjs            # every cover
//   node scripts/generate-covers.mjs <slug>     # just one
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const sharp = require("sharp");

const W = 1600;
const H = 1000;

const C = {
  bg: "#0c1a1d",
  bg2: "#10262a",
  grid: "#16343a",
  teal: "#1f9a9c",
  tealDim: "#14585a",
  mint: "#d1e8e2",
  peach: "#ffcb9a",
  copper: "#b9835a",
  muted: "#5f7b77",
  red: "#e0707a",
};

const MONO = "Consolas, 'Cascadia Mono', 'DejaVu Sans Mono', monospace";
const SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Shared frame: dark ground, faint dot grid, soft glow, small label. */
function frame(inner, label, glow = C.teal) {
  let dots = "";
  for (let x = 40; x < W; x += 40)
    for (let y = 40; y < H; y += 40)
      dots += `<circle cx="${x}" cy="${y}" r="1.2" fill="${C.grid}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="70%" cy="30%" r="75%">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.bg2}"/><stop offset="1" stop-color="${C.bg}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#ground)"/>
  ${dots}
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${inner}
  <text x="64" y="${H - 56}" font-family="${MONO}" font-size="26" fill="${C.muted}" letter-spacing="3">${label}</text>
</svg>`;
}

// ── 1. Treasure Hunt: water/land grid with the search path to the treasure ──
function treasureHunt() {
  const r = rng(7);
  const N = 16, cell = 50, ox = 400, oy = 90;
  const land = [];
  for (let i = 0; i < N; i++) {
    land.push([]);
    for (let j = 0; j < N; j++) {
      const blob =
        Math.hypot(i - 11, j - 10.5) < 3.6 + r() * 1.2 ||
        Math.hypot(i - 4, j - 12) < 2.3 + r() ||
        Math.hypot(i - 12, j - 3) < 1.8 + r();
      land[i].push(blob);
    }
  }
  let s = "";
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const x = ox + j * cell, y = oy + i * cell;
      s += `<rect x="${x + 3}" y="${y + 3}" width="${cell - 6}" height="${cell - 6}" rx="6" fill="${land[i][j] ? C.copper : C.tealDim}" opacity="${land[i][j] ? 0.85 : 0.35 + r() * 0.2}"/>`;
    }
  // Path: start top-left, sail right & down, then search the island.
  const path = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [7, 6], [7, 7], [8, 7], [8, 8], [9, 8], [9, 9], [10, 9], [11, 9], [11, 10], [11, 11], [12, 11]];
  const pts = path.map(([i, j]) => `${ox + j * cell + cell / 2},${oy + i * cell + cell / 2}`).join(" ");
  s += `<polyline points="${pts}" fill="none" stroke="${C.peach}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 16"/>`;
  const [si, sj] = path[0];
  s += `<circle cx="${ox + sj * cell + cell / 2}" cy="${oy + si * cell + cell / 2}" r="14" fill="${C.mint}"/>`;
  const [ti, tj] = path[path.length - 1];
  const tx = ox + tj * cell + cell / 2, ty = oy + ti * cell + cell / 2;
  s += `<circle cx="${tx}" cy="${ty}" r="34" fill="none" stroke="${C.peach}" stroke-width="4"/>`;
  s += `<text x="${tx}" y="${ty + 16}" text-anchor="middle" font-family="${MONO}" font-size="46" font-weight="700" fill="${C.peach}">$</text>`;
  return frame(s, "SAIL · SEARCH · BACKTRACK", C.teal);
}

// ── 2. Seam carving: energy field with the minimal seam highlighted ──
function seamCarving() {
  const r = rng(21);
  const cols = 40, rows = 25, cw = 30, ch = 30, ox = 200, oy = 125;
  let s = "";
  const energy = (i, j) => {
    const a = Math.sin(j * 0.35 + i * 0.12) * 0.5 + 0.5;
    const b = Math.exp(-((j - 11) ** 2 + (i - 9) ** 2) / 30);
    const c = Math.exp(-((j - 30) ** 2 + (i - 15) ** 2) / 45);
    return Math.min(1, a * 0.35 + b * 0.9 + c * 0.9 + r() * 0.12);
  };
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      const e = energy(i, j);
      s += `<rect x="${ox + j * cw}" y="${oy + i * ch}" width="${cw - 2}" height="${ch - 2}" rx="3" fill="${e > 0.55 ? C.peach : C.teal}" opacity="${0.12 + e * 0.75}"/>`;
    }
  // A seam that snakes down the low-energy valley between the two hot spots.
  let j = 20, seam = [];
  for (let i = 0; i < rows; i++) {
    j += Math.round(Math.sin(i * 0.55) * 1.1);
    seam.push([i, j]);
  }
  const pts = seam.map(([i, jj]) => `${ox + jj * cw + cw / 2},${oy + i * ch + ch / 2}`).join(" ");
  s += `<polyline points="${pts}" fill="none" stroke="${C.mint}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round" opacity="0.25"/>`;
  s += `<polyline points="${pts}" fill="none" stroke="${C.mint}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
  // Scissors-ish marker: arrows showing the image closing the gap.
  s += `<path d="M ${ox - 80} 500 l 40 0 m -14 -14 l 14 14 l -14 14" stroke="${C.muted}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M ${ox + cols * cw + 80} 500 l -40 0 m 14 -14 l -14 14 l 14 14" stroke="${C.muted}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return frame(s, "ENERGY → COST → MINIMAL SEAM", C.peach);
}

// ── 3. Euchre: a fanned hand with both bowers ──
function euchre() {
  const cards = [
    { rank: "9", suit: "♠", red: false },
    { rank: "A", suit: "♥", red: true },
    { rank: "K", suit: "♥", red: true },
    { rank: "J", suit: "♦", red: true, bower: "LEFT" },
    { rank: "J", suit: "♥", red: true, bower: "RIGHT" },
  ];
  let s = "";
  const cx = 800, cy = 1120, cwid = 260, chei = 380;
  cards.forEach((c, k) => {
    const angle = -28 + k * 14;
    const col = c.red ? C.red : C.bg;
    s += `<g transform="rotate(${angle} ${cx} ${cy})">
      <rect x="${cx - cwid / 2}" y="${cy - 860}" width="${cwid}" height="${chei}" rx="22" fill="${C.mint}" stroke="${c.bower ? C.peach : "#9fb8b2"}" stroke-width="${c.bower ? 8 : 3}"/>
      <text x="${cx - cwid / 2 + 26}" y="${cy - 860 + 70}" font-family="${SANS}" font-size="62" font-weight="700" fill="${col}">${c.rank}</text>
      <text x="${cx - cwid / 2 + 28}" y="${cy - 860 + 128}" font-family="${SANS}" font-size="50" fill="${col}">${c.suit}</text>
      <text x="${cx}" y="${cy - 860 + 250}" text-anchor="middle" font-family="${SANS}" font-size="140" fill="${col}">${c.suit}</text>
      ${c.bower ? `<text transform="rotate(90 ${cx - cwid / 2 + 44} ${cy - 860 + 160})" x="${cx - cwid / 2 + 44}" y="${cy - 860 + 160}" font-family="${MONO}" font-size="22" font-weight="700" fill="${C.copper}" letter-spacing="3">${c.bower} BOWER</text>` : ""}
    </g>`;
  });
  s += `<g transform="translate(1260 150)">
    <rect width="250" height="96" rx="48" fill="none" stroke="${C.peach}" stroke-width="3"/>
    <text x="125" y="62" text-anchor="middle" font-family="${MONO}" font-size="32" fill="${C.peach}">TRUMP ♥</text>
  </g>`;
  return frame(s, "EUCHRE · SIMPLE + HUMAN PLAYERS", C.copper);
}

// ── 4. EV charging: the three-state safety FSM ──
function evCharging() {
  const node = (x, y, label, sub, color) => `
    <circle cx="${x}" cy="${y}" r="120" fill="${C.bg}" stroke="${color}" stroke-width="6"/>
    <circle cx="${x}" cy="${y}" r="104" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>
    <text x="${x}" y="${y - 4}" text-anchor="middle" font-family="${SANS}" font-size="34" font-weight="700" fill="${C.mint}">${label}</text>
    <text x="${x}" y="${y + 38}" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${color}">${sub}</text>`;
  const arrow = (d, color, label, lx, ly) => `
    <path d="${d}" fill="none" stroke="${color}" stroke-width="5" marker-end="url(#ah-${color.slice(1)})"/>
    <text x="${lx}" y="${ly}" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${C.muted}">${label}</text>`;
  const marker = (color) => `<marker id="ah-${color.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker>`;
  let s = `<defs>${marker(C.teal)}${marker(C.peach)}${marker(C.red)}${marker(C.mint)}</defs>`;
  const N = [400, 470], S = [1000, 250], E = [1000, 720];
  s += arrow(`M ${N[0] + 110} ${N[1] - 60} Q 700 250 ${S[0] - 124} ${S[1] + 10}`, C.peach, "fault", 650, 290);
  s += arrow(`M ${S[0] - 116} ${S[1] + 70} Q 700 420 ${N[0] + 122} ${N[1] - 6}`, C.mint, "all clear", 640, 470);
  s += arrow(`M ${N[0] + 110} ${N[1] + 60} Q 700 720 ${E[0] - 124} ${E[1]}`, C.red, "emergency", 640, 700);
  s += arrow(`M ${S[0]} ${S[1] + 124} L ${E[0]} ${E[1] - 128}`, C.red, "", 0, 0);
  s += `<text x="${S[0] + 26}" y="${(S[1] + E[1]) / 2 + 8}" font-family="${MONO}" font-size="22" fill="${C.muted}">escalate</text>`;
  s += node(...N, "NORMAL", "power = 1.0", C.teal);
  s += node(...S, "STANDARD", "shutdown", C.peach);
  s += node(...E, "EMERGENCY", "shutdown + flag", C.red);
  // Lightning bolt
  s += `<path d="M 1330 330 l -70 150 h 56 l -40 140 l 110 -180 h -60 l 44 -110 z" fill="${C.peach}" opacity="0.9"/>`;
  return frame(s, "SAFETY FSM · SIMULINK → PYTHON → GUI", C.teal);
}

// ── 5. Fake review detector: reviews with weighted keywords and verdicts ──
function fakeReviews() {
  const reviews = [
    { words: [["the", 0], ["room", 0], ["was", 0], ["clean", 1], ["and", 0], ["quiet", 1]], score: "+2.4", verdict: "TRUTHFUL", color: C.teal },
    { words: [["absolutely", -1], ["amazing", -1], ["best", -1], ["hotel", 0], ["ever", -1]], score: "−3.1", verdict: "DECEPTIVE", color: C.red },
    { words: [["staff", 0], ["were", 0], ["friendly", 1], ["but", 0], ["slow", 0]], score: "+0.4", verdict: "UNSURE", color: C.muted },
  ];
  let s = "";
  reviews.forEach((rv, k) => {
    const y = 150 + k * 250;
    s += `<rect x="160" y="${y}" width="1280" height="190" rx="24" fill="${C.bg}" stroke="${C.grid}" stroke-width="3"/>`;
    s += `<text x="210" y="${y + 60}" font-family="${SANS}" font-size="30" fill="${C.peach}">★ ★ ★ ★ ★</text>`;
    let x = 210;
    rv.words.forEach(([w, wt]) => {
      const width = w.length * 22 + 28;
      if (wt !== 0)
        s += `<rect x="${x - 8}" y="${y + 92}" width="${width}" height="52" rx="10" fill="${wt > 0 ? C.teal : C.red}" opacity="0.28"/>`;
      s += `<text x="${x + 6}" y="${y + 130}" font-family="${MONO}" font-size="34" fill="${wt !== 0 ? C.mint : C.muted}">${w}</text>`;
      x += width + 14;
    });
    s += `<text x="1140" y="${y + 80}" text-anchor="end" font-family="${MONO}" font-size="40" font-weight="700" fill="${rv.color === C.muted ? C.mint : rv.color}">${rv.score}</text>`;
    s += `<rect x="1170" y="${y + 40}" width="230" height="56" rx="28" fill="none" stroke="${rv.color}" stroke-width="3"/>`;
    s += `<text x="1285" y="${y + 78}" text-anchor="middle" font-family="${MONO}" font-size="24" fill="${rv.color === C.muted ? C.mint : rv.color}" letter-spacing="2">${rv.verdict}</text>`;
  });
  return frame(s, "WEIGHTED KEYWORDS → SCORE → VERDICT", C.red);
}

// ── 6. LC-2K assembler: assembly source → machine code ──
function lc2k() {
  const lines = [
    ["", "lw", "0 1 five", "0x00810007"],
    ["", "lw", "1 2 3", "0x008A0003"],
    ["start", "add", "1 2 1", "0x000A0001"],
    ["", "beq", "0 1 2", "0x01010002"],
    ["", "beq", "0 0 start", "0x0100FFFD"],
    ["", "noop", "", "0x01C00000"],
    ["done", "halt", "", "0x01800000"],
    ["five", ".fill", "5", "0x00000005"],
    ["neg1", ".fill", "-1", "0xFFFFFFFF"],
  ];
  let s = `<rect x="110" y="110" width="620" height="720" rx="24" fill="${C.bg}" stroke="${C.grid}" stroke-width="3"/>
    <rect x="870" y="110" width="620" height="720" rx="24" fill="${C.bg}" stroke="${C.grid}" stroke-width="3"/>
    <text x="150" y="170" font-family="${MONO}" font-size="24" fill="${C.muted}" letter-spacing="3">PROGRAM.AS</text>
    <text x="910" y="170" font-family="${MONO}" font-size="24" fill="${C.muted}" letter-spacing="3">PROGRAM.MC</text>`;
  lines.forEach(([label, op, args, hex], k) => {
    const y = 250 + k * 64;
    s += `<text x="150" y="${y}" font-family="${MONO}" font-size="32" fill="${C.copper}">${label}</text>`;
    s += `<text x="300" y="${y}" font-family="${MONO}" font-size="32" fill="${C.peach}">${op}</text>`;
    s += `<text x="420" y="${y}" font-family="${MONO}" font-size="32" fill="${C.mint}">${args}</text>`;
    s += `<text x="910" y="${y}" font-family="${MONO}" font-size="32" fill="${C.teal}">${hex}</text>`;
  });
  s += `<path d="M 750 470 h 90 m -26 -24 l 26 24 l -26 24" stroke="${C.peach}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return frame(s, "TWO-PASS ASSEMBLER · LABELS → 32-BIT WORDS", C.teal);
}

// ── 7. LIDAR: point-cloud rings before and after a transform ──
function lidar() {
  const r = rng(99);
  let s = "";
  const rings = (cx, cy, rot, scaleY, color, opacity) => {
    let out = "";
    for (let ring = 1; ring <= 7; ring++) {
      const rad = ring * 52;
      const n = 40 + ring * 16;
      for (let k = 0; k < n; k++) {
        const t = (k / n) * Math.PI * 2;
        let x = Math.cos(t) * rad * (1 + (r() - 0.5) * 0.04);
        let y = Math.sin(t) * rad * scaleY * (1 + (r() - 0.5) * 0.04);
        const xr = x * Math.cos(rot) - y * Math.sin(rot);
        const yr = x * Math.sin(rot) + y * Math.cos(rot);
        out += `<circle cx="${(cx + xr).toFixed(1)}" cy="${(cy + yr).toFixed(1)}" r="${2.4 + ring * 0.15}" fill="${color}" opacity="${opacity}"/>`;
      }
    }
    return out;
  };
  s += rings(520, 520, 0.5, 0.45, C.copper, 0.45);
  s += rings(1080, 480, 0, 0.62, C.teal, 0.9);
  // axes on the corrected cloud
  s += `<path d="M 1080 480 h 160" stroke="${C.red}" stroke-width="6"/><path d="M 1080 480 v -160" stroke="${C.mint}" stroke-width="6"/>`;
  // transform arrow + matrix
  s += `<path d="M 700 170 Q 800 90 900 170" fill="none" stroke="${C.peach}" stroke-width="5"/><path d="M 886 146 l 16 26 l -30 4" fill="none" stroke="${C.peach}" stroke-width="5" stroke-linejoin="round"/>`;
  s += `<text x="800" y="80" text-anchor="middle" font-family="${MONO}" font-size="30" fill="${C.peach}">T · [x y z 1]ᵀ</text>`;
  return frame(s, "HOMOGENEOUS TRANSFORMS · LIDAR FRAME → WORLD", C.teal);
}

// ── 8. Planet routes: planets on a grid, nearest-neighbour path ──
function planetRoutes() {
  // [x, y, radius, colour, name, label above?] — labels go on whichever side
  // the route lines leave clear.
  const planets = [
    [260, 760, 26, C.copper, "START", false],
    [420, 560, 34, C.teal, "Vulcan", true],
    [640, 690, 22, C.peach, "Kepler", false],
    [760, 420, 44, C.teal, "Tatooine", true],
    [1000, 560, 28, C.copper, "Arrakis", false],
    [1100, 300, 36, C.peach, "Hoth", true],
    [1340, 450, 24, C.teal, "Endor", false],
    [1360, 200, 26, C.mint, "END", true],
  ];
  let s = "";
  const r = rng(3);
  for (let k = 0; k < 90; k++)
    s += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * (H - 120)).toFixed(0)}" r="${(r() * 2 + 0.6).toFixed(1)}" fill="${C.mint}" opacity="${(0.2 + r() * 0.5).toFixed(2)}"/>`;
  const pts = planets.map(([x, y]) => `${x},${y}`).join(" ");
  s += `<polyline points="${pts}" fill="none" stroke="${C.peach}" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/>`;
  planets.forEach(([x, y, rad, col, name, above], k) => {
    const endpoint = k === 0 || k === planets.length - 1;
    if (endpoint) {
      s += `<rect x="${x - rad}" y="${y - rad}" width="${rad * 2}" height="${rad * 2}" rx="6" fill="none" stroke="${col}" stroke-width="5"/>`;
    } else {
      s += `<circle cx="${x}" cy="${y}" r="${rad + 10}" fill="${col}" opacity="0.15"/>`;
      s += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${col}"/>`;
    }
    s += `<text x="${x}" y="${above ? y - rad - 24 : y + rad + 42}" text-anchor="middle" font-family="${MONO}" font-size="24" fill="${C.muted}">${name}</text>`;
  });
  return frame(s, "NEAREST-NEIGHBOUR ROUTE", C.peach);
}

// ── 9. Naive Bayes: words feeding label scores ──
function postClassifier() {
  const words = ["recursion", "segfault", "pointer", "exam", "office hours", "heap", "vector", "deadline"];
  const labels = [["debugging", 0.82, C.teal], ["exam", 0.41, C.peach], ["logistics", 0.23, C.copper]];
  let s = "";
  words.forEach((w, k) => {
    // Staggered single column so no two pills collide and every link starts
    // from a pill's right edge without crossing another pill.
    const x = 130 + (k % 2) * 90, y = 130 + k * 86;
    const width = w.length * 20 + 40;
    s += `<rect x="${x}" y="${y}" width="${width}" height="64" rx="32" fill="${C.bg}" stroke="${C.grid}" stroke-width="3"/>`;
    s += `<text x="${x + width / 2}" y="${y + 42}" text-anchor="middle" font-family="${MONO}" font-size="28" fill="${C.mint}">${w}</text>`;
    labels.forEach((_, li) => {
      s += `<path d="M ${x + width} ${y + 32} C 800 ${y + 32}, 800 ${270 + li * 200}, 960 ${270 + li * 200}" fill="none" stroke="${labels[li][2]}" stroke-width="2" opacity="${li === 0 ? 0.35 : 0.14}"/>`;
    });
  });
  labels.forEach(([name, p, col], li) => {
    const y = 230 + li * 200;
    s += `<text x="980" y="${y}" font-family="${MONO}" font-size="30" fill="${C.mint}">${name}</text>`;
    s += `<rect x="980" y="${y + 22}" width="460" height="34" rx="17" fill="${C.bg}"/>`;
    s += `<rect x="980" y="${y + 22}" width="${460 * p}" height="34" rx="17" fill="${col}"/>`;
    s += `<text x="1440" y="${y}" text-anchor="end" font-family="${MONO}" font-size="26" fill="${C.muted}">log P = ${(Math.log(p) * 10).toFixed(1)}</text>`;
  });
  return frame(s, "BAG OF WORDS → NAIVE BAYES → LABEL", C.teal);
}

// ── 10. Stocks & PQ: candlesticks over a heap ──
function stocksPq() {
  const r = rng(42);
  let s = "";
  // Rising trend with real swings, kept left of the heap (x < 940).
  let price = 760;
  for (let k = 0; k < 20; k++) {
    const x = 110 + k * 40;
    const open = price;
    price += (r() - 0.62) * 120;
    price = Math.max(220, Math.min(820, price));
    const close = price;
    const hi = Math.min(open, close) - r() * 40, lo = Math.max(open, close) + r() * 40;
    const up = close < open;
    const col = up ? C.teal : C.red;
    s += `<line x1="${x + 13}" y1="${hi}" x2="${x + 13}" y2="${lo}" stroke="${col}" stroke-width="3"/>`;
    s += `<rect x="${x}" y="${Math.min(open, close)}" width="26" height="${Math.max(6, Math.abs(close - open))}" rx="4" fill="${col}"/>`;
  }
  // Binary heap on the right
  const vals = [98, 73, 91, 56, 64, 87, 34];
  const pos = [[1260, 250], [1120, 430], [1400, 430], [1050, 610], [1190, 610], [1330, 610], [1470, 610]];
  [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].forEach(([a, b]) => {
    s += `<line x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}" stroke="${C.muted}" stroke-width="4"/>`;
  });
  vals.forEach((v, k) => {
    const [x, y] = pos[k];
    s += `<circle cx="${x}" cy="${y}" r="52" fill="${C.bg}" stroke="${k === 0 ? C.peach : C.teal}" stroke-width="${k === 0 ? 7 : 4}"/>`;
    s += `<text x="${x}" y="${y + 12}" text-anchor="middle" font-family="${MONO}" font-size="34" fill="${k === 0 ? C.peach : C.mint}">$${v}</text>`;
  });
  s += `<text x="1260" y="160" text-anchor="middle" font-family="${MONO}" font-size="24" fill="${C.muted}" letter-spacing="2">BEST BID</text>`;
  return frame(s, "ORDER MATCHING · PRIORITY QUEUES", C.peach);
}

// ── 11. Limit order book: price ladder with FIFO queues at each level ──
function limitOrderBook() {
  let s = "";
  const r = rng(11);
  // Asks occupy rows 0–4, bids rows 5–9 shifted down by 40; the spread line
  // sits in that 40px gap so it never crosses a price.
  const mid = 150 + 5 * 58 + 20 - 4, rowH = 58, cx = 800;
  const levels = [
    ...[5, 4, 3, 2, 1].map((i) => ({ side: "ask", price: (100 + i * 0.05).toFixed(2), i })),
    ...[1, 2, 3, 4, 5].map((i) => ({ side: "bid", price: (100 - i * 0.05 + 0.05).toFixed(2), i })),
  ];
  levels.forEach((lv, k) => {
    const y = 150 + k * rowH + (lv.side === "bid" ? 40 : 0);
    const col = lv.side === "ask" ? C.red : C.teal;
    s += `<text x="${cx}" y="${y + 38}" text-anchor="middle" font-family="${MONO}" font-size="30" fill="${lv.i === 1 ? C.peach : C.mint}">${lv.price}</text>`;
    // Queue of individual orders: oldest nearest the price (price-time priority).
    const n = 2 + Math.floor(r() * 5);
    let x = lv.side === "bid" ? cx - 110 : cx + 110;
    for (let q = 0; q < n; q++) {
      const w = 40 + Math.floor(r() * 70);
      const bx = lv.side === "bid" ? x - w : x;
      s += `<rect x="${bx}" y="${y + 8}" width="${w}" height="${rowH - 16}" rx="6" fill="${col}" opacity="${(0.9 - q * 0.13).toFixed(2)}"/>`;
      x = lv.side === "bid" ? x - w - 8 : x + w + 8;
    }
  });
  // Spread marker
  s += `<line x1="${cx - 520}" y1="${mid + 4}" x2="${cx + 520}" y2="${mid + 4}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 10"/>`;
  s += `<text x="${cx + 540}" y="${mid + 12}" font-family="${MONO}" font-size="22" fill="${C.muted}" letter-spacing="2">SPREAD</text>`;
  s += `<text x="${cx - 520}" y="120" font-family="${MONO}" font-size="24" fill="${C.teal}" letter-spacing="3">BIDS</text>`;
  s += `<text x="${cx + 520}" y="120" text-anchor="end" font-family="${MONO}" font-size="24" fill="${C.red}" letter-spacing="3">ASKS</text>`;
  return frame(s, "PRICE–TIME PRIORITY · SUB-MILLISECOND MATCHING", C.teal);
}

// ── 12. Darul Uloom grading: a gradebook with attendance ──
function grading() {
  let s = "";
  const r = rng(5);
  const cols = ["HW 1", "HW 2", "QUIZ", "HIFDH", "EXAM", "AVG"];
  const ox = 200, oy = 150, cw = 170, rh = 78;
  s += `<rect x="${ox - 30}" y="${oy - 40}" width="${240 + cols.length * cw + 40}" height="${rh * 8 + 40}" rx="24" fill="${C.bg}" stroke="${C.grid}" stroke-width="3"/>`;
  cols.forEach((c, j) => {
    s += `<text x="${ox + 240 + j * cw + cw / 2 - 20}" y="${oy + 20}" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${j === cols.length - 1 ? C.peach : C.muted}" letter-spacing="2">${c}</text>`;
  });
  for (let i = 0; i < 7; i++) {
    const y = oy + 50 + i * rh;
    s += `<circle cx="${ox + 20}" cy="${y + 28}" r="22" fill="${[C.teal, C.copper, C.peach, C.mint][i % 4]}" opacity="0.8"/>`;
    s += `<rect x="${ox + 60}" y="${y + 18}" width="${90 + r() * 60}" height="18" rx="9" fill="${C.muted}" opacity="0.5"/>`;
    // attendance dots
    for (let d = 0; d < 5; d++)
      s += `<circle cx="${ox + 72 + d * 20}" cy="${y + 54}" r="5" fill="${r() > 0.12 ? C.teal : C.red}"/>`;
    let sum = 0;
    cols.forEach((c, j) => {
      const x = ox + 240 + j * cw + cw / 2 - 20;
      if (j < cols.length - 1) {
        const g = Math.round(72 + r() * 28);
        sum += g;
        s += `<text x="${x}" y="${y + 40}" text-anchor="middle" font-family="${MONO}" font-size="30" fill="${C.mint}">${g}</text>`;
      } else {
        const avg = Math.round(sum / (cols.length - 1));
        s += `<rect x="${x - 56}" y="${y + 8}" width="112" height="48" rx="24" fill="${avg >= 90 ? C.teal : C.tealDim}" opacity="0.9"/>`;
        s += `<text x="${x}" y="${y + 42}" text-anchor="middle" font-family="${MONO}" font-size="28" font-weight="700" fill="${C.mint}">${avg}</text>`;
      }
    });
  }
  return frame(s, "GRADES · ATTENDANCE · HIFDH PROGRESS", C.teal);
}

// ── 13. Hall-effect keyboard: 75% layout, analog travel on one key ──
function keyboard() {
  let s = "";
  const u = 66, gap = 8, ox = 150, oy = 190;
  // rows as unit widths (a simplified 75% ISO layout)
  const rows = [
    [1, 0.25, 1, 1, 1, 1, 0.25, 1, 1, 1, 1, 0.25, 1, 1, 1, 1, 0.25, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 1],
    [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.25, 1],
    [1.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75, 1, 1],
    [1.25, 1.25, 1.25, 6.25, 1, 1, 1, 1, 1, 1],
  ];
  const glow = [C.teal, C.mint, C.peach, C.copper];
  const r = rng(13);
  s += `<rect x="${ox - 34}" y="${oy - 34}" width="${16 * (u + gap) + 60}" height="${6 * (u + gap) + 60}" rx="30" fill="#0a1416" stroke="${C.grid}" stroke-width="4"/>`;
  // Scale each row so it spans the full board width: the unit counts above
  // are approximate, and unscaled they leave the right edge ragged.
  const rowWidth = 16 * (u + gap) - gap;
  rows.forEach((row, i) => {
    let x = ox;
    const keys = row.filter((w) => w !== 0.25);
    const spacers = row.length - keys.length;
    const units = keys.reduce((a, b) => a + b, 0);
    const unit = (rowWidth - (keys.length - 1) * gap - spacers * u * 0.25) / units;
    row.forEach((w) => {
      if (w === 0.25) { x += u * 0.25; return; }
      const kw = w * unit;
      const lit = r() < 0.18;
      const c = glow[Math.floor(r() * glow.length)];
      s += `<rect x="${x}" y="${oy + i * (u + gap)}" width="${kw}" height="${u}" rx="10" fill="${C.bg2}" stroke="${lit ? c : "#244247"}" stroke-width="${lit ? 3 : 2}"/>`;
      if (lit) s += `<rect x="${x + 6}" y="${oy + i * (u + gap) + 6}" width="${kw - 12}" height="${u - 12}" rx="7" fill="${c}" opacity="0.18"/>`;
      x += kw + gap;
    });
  });
  // rotary encoder + OLED in the top-right
  const ex = ox + 16 * (u + gap) - 10, ey = oy - 110;
  s += `<rect x="${ex - 300}" y="${ey - 30}" width="190" height="64" rx="8" fill="#050b0c" stroke="${C.teal}" stroke-width="3"/>`;
  s += `<text x="${ex - 205}" y="${ey + 12}" text-anchor="middle" font-family="${MONO}" font-size="24" fill="${C.teal}">1.2 mm</text>`;
  s += `<circle cx="${ex - 40}" cy="${ey}" r="42" fill="${C.bg2}" stroke="${C.copper}" stroke-width="5"/>`;
  s += `<line x1="${ex - 40}" y1="${ey}" x2="${ex - 40}" y2="${ey - 30}" stroke="${C.copper}" stroke-width="5" stroke-linecap="round"/>`;
  // analog travel gauge for one key
  const gx = ox + 30, gy = oy + 6 * (u + gap) + 90;
  s += `<text x="${gx}" y="${gy}" font-family="${MONO}" font-size="22" fill="${C.muted}" letter-spacing="2">ACTUATION</text>`;
  s += `<rect x="${gx + 180}" y="${gy - 18}" width="560" height="18" rx="9" fill="${C.bg2}"/>`;
  s += `<rect x="${gx + 180}" y="${gy - 18}" width="${560 * 0.3}" height="18" rx="9" fill="${C.peach}"/>`;
  s += `<line x1="${gx + 180 + 560 * 0.3}" y1="${gy - 30}" x2="${gx + 180 + 560 * 0.3}" y2="${gy + 12}" stroke="${C.mint}" stroke-width="3"/>`;
  s += `<text x="${gx + 760}" y="${gy}" font-family="${MONO}" font-size="22" fill="${C.peach}">ADJUSTABLE</text>`;
  return frame(s, "75% ISO · HALL-EFFECT · STM32", C.peach);
}

// ── 14. Low-Level Modulator: carrier × modulator = output ──
function modulator() {
  let s = "";
  const wave = (y, amp, f, color, width, mod) => {
    let d = "";
    for (let x = 0; x <= 1100; x += 4) {
      const t = x / 1100;
      const a = mod ? amp * (0.55 + 0.45 * Math.sin(t * Math.PI * 2 * 2)) : amp;
      const v = y + Math.sin(t * Math.PI * 2 * f) * a;
      d += `${x === 0 ? "M" : "L"} ${250 + x} ${v.toFixed(1)} `;
    }
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"/>`;
  };
  const rows = [["CARRIER", 220, 40, 14, C.teal, 4, false], ["MODULATOR", 420, 50, 2, C.copper, 4, false], ["OUTPUT", 680, 120, 14, C.peach, 5, true]];
  rows.forEach(([name, y, amp, f, col, w, mod]) => {
    s += `<text x="80" y="${y + 8}" font-family="${MONO}" font-size="22" fill="${C.muted}" letter-spacing="2">${name}</text>`;
    s += `<line x1="250" y1="${y}" x2="1350" y2="${y}" stroke="${C.grid}" stroke-width="2"/>`;
    if (mod) {
      // envelope
      let top = "", bot = "";
      for (let x = 0; x <= 1100; x += 8) {
        const t = x / 1100, a = amp * (0.55 + 0.45 * Math.sin(t * Math.PI * 2 * 2));
        top += `${x === 0 ? "M" : "L"} ${250 + x} ${(y - a).toFixed(1)} `;
        bot += `${x === 0 ? "M" : "L"} ${250 + x} ${(y + a).toFixed(1)} `;
      }
      s += `<path d="${top}" fill="none" stroke="${C.copper}" stroke-width="2" stroke-dasharray="6 8"/><path d="${bot}" fill="none" stroke="${C.copper}" stroke-width="2" stroke-dasharray="6 8"/>`;
    }
    s += wave(y, amp, f, col, w, mod);
  });
  s += `<text x="1420" y="330" text-anchor="middle" font-family="${MONO}" font-size="56" fill="${C.mint}">×</text>`;
  s += `<text x="1420" y="560" text-anchor="middle" font-family="${MONO}" font-size="56" fill="${C.mint}">=</text>`;
  return frame(s, "18-INSTRUCTION CPU · 3 WAVETABLES · 5 MODULATIONS", C.peach);
}

// ── 15. Overround: Monte Carlo season paths fanning out into a histogram ──
function overround() {
  let s = "";
  const r = rng(36);
  const ox = 140, oy = 800, stepX = 120, scaleY = 26;
  const finals = [];
  for (let k = 0; k < 140; k++) {
    let pts = 0, d = `M ${ox} ${oy}`;
    // A per-path offset plus a little per-step jitter: points only come in
    // 3/1/0, so without it every path snaps onto the same lattice.
    const lane = (r() - 0.5) * 14;
    for (let md = 1; md <= 8; md++) {
      const u = r();
      pts += u < 0.52 ? 3 : u < 0.75 ? 1 : 0;
      const jitter = lane * (md / 8) + (r() - 0.5) * 6;
      d += ` L ${ox + md * stepX} ${(oy - pts * scaleY + jitter).toFixed(1)}`;
    }
    finals.push(pts);
    const hot = pts >= 16;
    s += `<path d="${d}" fill="none" stroke="${hot ? C.peach : C.teal}" stroke-width="2" stroke-linejoin="round" opacity="${hot ? 0.4 : 0.16}"/>`;
  }
  // histogram of final points
  const hx = ox + 8 * stepX + 60;
  const counts = {};
  finals.forEach((p) => (counts[p] = (counts[p] || 0) + 1));
  Object.entries(counts).forEach(([p, c]) => {
    const y = oy - Number(p) * scaleY;
    s += `<rect x="${hx}" y="${y - 10}" width="${c * 17}" height="20" rx="5" fill="${Number(p) >= 16 ? C.peach : C.teal}" opacity="0.85"/>`;
  });
  // top-8 cut line
  const cut = oy - 16 * scaleY;
  s += `<line x1="${ox}" y1="${cut}" x2="${hx + 360}" y2="${cut}" stroke="${C.mint}" stroke-width="2" stroke-dasharray="8 10"/>`;
  s += `<text x="${hx + 360}" y="${cut - 16}" text-anchor="end" font-family="${MONO}" font-size="22" fill="${C.mint}" letter-spacing="2">TOP 8</text>`;
  for (let md = 1; md <= 8; md++)
    s += `<text x="${ox + md * stepX}" y="${oy + 44}" text-anchor="middle" font-family="${MONO}" font-size="20" fill="${C.muted}">MD${md}</text>`;
  return frame(s, "5,000+ SIMULATIONS / SEC · 36-TEAM LEAGUE PHASE", C.teal);
}

// ── 16. Racecar telemetry: driver dashboard with a CAN stream ──
function racecar() {
  let s = "";
  const r = rng(17);
  // big arc gauge
  const gx = 520, gy = 520, R = 280;
  const arc = (a0, a1, rad) => {
    const p = (a) => [gx + Math.cos(a) * rad, gy + Math.sin(a) * rad];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${rad} ${rad} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const a0 = Math.PI * 0.8, a1 = Math.PI * 2.2, val = a0 + (a1 - a0) * 0.68;
  s += `<path d="${arc(a0, a1, R)}" fill="none" stroke="${C.bg2}" stroke-width="34" stroke-linecap="round"/>`;
  s += `<path d="${arc(a0, val, R)}" fill="none" stroke="${C.teal}" stroke-width="34" stroke-linecap="round"/>`;
  s += `<path d="${arc(a0 + (a1 - a0) * 0.85, a1, R)}" fill="none" stroke="${C.red}" stroke-width="10" opacity="0.7"/>`;
  s += `<text x="${gx}" y="${gy + 20}" text-anchor="middle" font-family="${SANS}" font-size="150" font-weight="700" fill="${C.mint}">87</text>`;
  s += `<text x="${gx}" y="${gy + 80}" text-anchor="middle" font-family="${MONO}" font-size="26" fill="${C.muted}" letter-spacing="3">KM/H</text>`;
  // side readouts
  const tiles = [["SOC", "76%", C.teal, 0.76], ["PACK TEMP", "41°C", C.peach, 0.55], ["MOTOR TEMP", "63°C", C.copper, 0.7]];
  tiles.forEach(([k, v, col, p], i) => {
    const y = 190 + i * 150;
    s += `<text x="960" y="${y}" font-family="${MONO}" font-size="22" fill="${C.muted}" letter-spacing="2">${k}</text>`;
    s += `<text x="1460" y="${y}" text-anchor="end" font-family="${MONO}" font-size="34" fill="${C.mint}">${v}</text>`;
    s += `<rect x="960" y="${y + 24}" width="500" height="16" rx="8" fill="${C.bg2}"/><rect x="960" y="${y + 24}" width="${500 * p}" height="16" rx="8" fill="${col}"/>`;
  });
  s += `<rect x="960" y="630" width="500" height="64" rx="12" fill="none" stroke="${C.teal}" stroke-width="3"/>`;
  s += `<circle cx="1000" cy="662" r="10" fill="${C.teal}"/><text x="1030" y="672" font-family="${MONO}" font-size="26" fill="${C.teal}">NO ACTIVE FAULTS</text>`;
  // CAN stream
  let can = "";
  for (let k = 0; k < 4; k++) {
    const id = (0x100 + Math.floor(r() * 0x500)).toString(16).toUpperCase();
    const bytes = Array.from({ length: 8 }, () => Math.floor(r() * 256).toString(16).toUpperCase().padStart(2, "0")).join(" ");
    can += `<text x="960" y="${760 + k * 34}" font-family="${MONO}" font-size="22" fill="${C.tealDim}" opacity="${1 - k * 0.2}">0x${id}  ${bytes}</text>`;
  }
  s += can;
  return frame(s, "1000+ CAN MSG/S · C++ ON RASPBERRY PI", C.teal);
}

// ── 17. Saf: one platform, five products ──
function saf() {
  let s = "";
  const cx = 800, cy = 480;
  const items = [
    ["SCHOOL", C.teal, "school"],
    ["PILGRIMAGE", C.peach, "cube"],
    ["ADMISSIONS", C.copper, "doc"],
    ["PRAYER TIMES", C.mint, "moon"],
    ["TIME CLOCK", C.teal, "clock"],
  ];
  const icon = (kind, x, y, col) => {
    switch (kind) {
      case "school": return `<path d="M ${x - 30} ${y + 22} v -26 l 30 -22 l 30 22 v 26 z" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round"/><rect x="${x - 8}" y="${y + 2}" width="16" height="20" fill="${col}"/>`;
      // Isometric cube with a band around it, so it reads as a cube.
      case "cube": return `<path d="M ${x} ${y - 36} l 32 16 l -32 16 l -32 -16 z" fill="${col}" opacity="0.55"/><path d="M ${x - 32} ${y - 20} l 32 16 v 40 l -32 -16 z" fill="${col}" opacity="0.9"/><path d="M ${x + 32} ${y - 20} l -32 16 v 40 l 32 -16 z" fill="${col}" opacity="0.7"/><path d="M ${x - 32} ${y - 8} l 32 16 l 32 -16" fill="none" stroke="${C.bg}" stroke-width="5"/>`;
      case "doc": return `<path d="M ${x - 22} ${y - 30} h 30 l 14 14 v 46 h -44 z" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round"/><path d="M ${x - 12} ${y + 4} l 8 8 l 16 -18" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
      case "moon": return `<path d="M ${x + 12} ${y - 30} a 30 30 0 1 0 14 48 a 24 24 0 1 1 -14 -48 z" fill="${col}"/>`;
      default: return `<circle cx="${x}" cy="${y}" r="28" fill="none" stroke="${col}" stroke-width="5"/><path d="M ${x} ${y - 16} v 16 l 12 8" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
    }
  };
  items.forEach(([name, col, kind], k) => {
    const a = -Math.PI / 2 + (k / items.length) * Math.PI * 2;
    const x = cx + Math.cos(a) * 330, y = cy + Math.sin(a) * 300;
    s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${col}" stroke-width="3" opacity="0.35" stroke-dasharray="4 10"/>`;
    s += `<circle cx="${x}" cy="${y}" r="78" fill="${C.bg}" stroke="${col}" stroke-width="4"/>`;
    s += icon(kind, x, y - 6, col);
    s += `<text x="${x}" y="${y + 116}" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${C.muted}" letter-spacing="2">${name}</text>`;
  });
  s += `<circle cx="${cx}" cy="${cy}" r="120" fill="${C.teal}" opacity="0.14"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="92" fill="${C.bg}" stroke="${C.peach}" stroke-width="6"/>`;
  s += `<text x="${cx}" y="${cy + 26}" text-anchor="middle" font-family="${SANS}" font-size="74" font-weight="700" fill="${C.peach}">Saf</text>`;
  return frame(s, "FIVE PRODUCTS · ONE PLATFORM · A PORTAL PER COMMUNITY", C.peach);
}

// ── 18. Radiation heatmap: noisy readings → smoothed threat zones ──
function radiationHeatmap() {
  let s = "";
  const r = rng(8);
  const cell = 26, cols = 20, rows = 24, lx = 150, rx = 860, oy = 110;
  const field = (i, j) => Math.exp(-((i - 9) ** 2 + (j - 12) ** 2) / 50) * 0.85 + Math.exp(-((i - 16) ** 2 + (j - 5) ** 2) / 20) * 0.5;
  const hue = (v) => (v > 0.7 ? C.red : v > 0.5 ? C.peach : v > 0.3 ? C.copper : v > 0.15 ? C.teal : C.tealDim);
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      const clean = field(i, j);
      const noisy = Math.max(0, Math.min(1, clean + (r() - 0.5) * 0.6));
      s += `<rect x="${lx + j * cell}" y="${oy + i * cell}" width="${cell - 3}" height="${cell - 3}" rx="3" fill="${C.mint}" opacity="${(0.08 + noisy * 0.6).toFixed(2)}"/>`;
      s += `<rect x="${rx + j * cell}" y="${oy + i * cell}" width="${cell - 1}" height="${cell - 1}" fill="${hue(clean)}" opacity="${(0.35 + clean * 0.6).toFixed(2)}"/>`;
    }
  s += `<path d="M ${lx + cols * cell + 30} ${oy + rows * cell / 2} h 110 m -30 -26 l 30 26 l -30 26" stroke="${C.peach}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<text x="${lx + cols * cell + 85}" y="${oy + rows * cell / 2 - 44}" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${C.muted}">×3</text>`;
  s += `<text x="${lx}" y="${oy - 24}" font-family="${MONO}" font-size="22" fill="${C.muted}" letter-spacing="2">RAW READINGS</text>`;
  s += `<text x="${rx}" y="${oy - 24}" font-family="${MONO}" font-size="22" fill="${C.muted}" letter-spacing="2">THREAT ZONES</text>`;
  return frame(s, "MEAN FILTER → HSV HEATMAP → THRESHOLD", C.red);
}

// ── 19. Wind farm: wind-speed bands, a turbine, and five constraint checks ──
function windFarm() {
  let s = "";
  // flowing wind bands
  for (let k = 0; k < 9; k++) {
    const y = 170 + k * 70;
    let d = "";
    for (let x = 0; x <= 900; x += 10) d += `${x === 0 ? "M" : "L"} ${100 + x} ${(y + Math.sin(x / 110 + k * 0.7) * 22).toFixed(1)} `;
    s += `<path d="${d}" fill="none" stroke="${k % 3 === 1 ? C.peach : C.teal}" stroke-width="${k % 3 === 1 ? 4 : 3}" opacity="${k % 3 === 1 ? 0.7 : 0.35}" stroke-linecap="round"/>`;
  }
  // turbine
  const tx = 560, ty = 330;
  s += `<path d="M ${tx - 10} ${ty} L ${tx - 18} 820 L ${tx + 18} 820 L ${tx + 10} ${ty} z" fill="${C.mint}"/>`;
  [0, 120, 240].forEach((deg) => {
    s += `<g transform="rotate(${deg + 15} ${tx} ${ty})"><path d="M ${tx} ${ty} C ${tx + 18} ${ty - 60}, ${tx + 12} ${ty - 170}, ${tx} ${ty - 220} C ${tx - 8} ${ty - 160}, ${tx - 10} ${ty - 60}, ${tx} ${ty} z" fill="${C.mint}"/></g>`;
  });
  s += `<circle cx="${tx}" cy="${ty}" r="16" fill="${C.bg}" stroke="${C.mint}" stroke-width="6"/>`;
  // waves at the base
  let wave = "";
  for (let x = 0; x <= 900; x += 10) wave += `${x === 0 ? "M" : "L"} ${100 + x} ${(830 + Math.sin(x / 40) * 10).toFixed(1)} `;
  s += `<path d="${wave}" fill="none" stroke="${C.teal}" stroke-width="5"/>`;
  // constraint checklist
  const checks = ["Wind speed in range", "Avg wave height", "Wave height risk", "Rogue wave vs deck", "Buoy consistency"];
  s += `<rect x="1060" y="200" width="420" height="${checks.length * 96 + 50}" rx="24" fill="${C.bg}" stroke="${C.grid}" stroke-width="3"/>`;
  checks.forEach((c, i) => {
    const y = 270 + i * 96;
    s += `<circle cx="1112" cy="${y}" r="22" fill="${C.teal}" opacity="0.25"/><path d="M ${1101} ${y} l 8 8 l 14 -16" fill="none" stroke="${C.teal}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<text x="1154" y="${y + 9}" font-family="${SANS}" font-size="26" fill="${C.mint}">${c}</text>`;
  });
  return frame(s, "FIVE SITE CONSTRAINTS · GLOBAL + BUOY DATA", C.teal);
}

const covers = {
  "limit-order-book": limitOrderBook,
  "darul-uloom-grading": grading,
  "hall-effect-keyboard": keyboard,
  "low-level-modulator": modulator,
  overround,
  "racecar-telemetry-dash": racecar,
  saf,
  "radiation-heatmap": radiationHeatmap,
  "wind-farm-analysis": windFarm,
  "treasure-hunt": treasureHunt,
  "seam-carving": seamCarving,
  euchre,
  "ev-charging-control": evCharging,
  "fake-review-detector": fakeReviews,
  "lc2k-assembler": lc2k,
  "lidar-transforms": lidar,
  "planet-routes": planetRoutes,
  "post-classifier": postClassifier,
  "stocks-and-pq": stocksPq,
};

const only = process.argv[2];
for (const [slug, draw] of Object.entries(covers)) {
  if (only && only !== slug) continue;
  const dir = path.join("public/images/projects", slug);
  fs.mkdirSync(dir, { recursive: true });
  const svg = draw();
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(dir, "cover-illustrated.png"));
  console.log("wrote", slug);
}
