# PAO Reel — Design System

> A number-memory projector. Digits become six-frame reels; each reel is a
> Person, an Action, and an Object, drawn as ASCII. The interface should feel
> like operating a well-kept film machine: warm, mechanical, precise, quiet.

This document is the source of truth for every screen and component added to
the app. If a new element does not fit a rule here, extend the document first —
do not invent a second visual language.

---

## 1. Principles

1. **Show, don't label.** Prefer an ASCII drawing, a glyph, a bar, or a mark
   over a sentence. Text is for content (words, digits) and for the smallest
   possible affordance. If a label can become a tooltip, a shape, or a state,
   make it so.
2. **Calm surface, dense detail.** The page is mostly dark, empty film. Detail
   lives inside frames, on hover, and in the moment it is needed. Never show a
   dashboard of numbers at once.
3. **Progressive disclosure.** Secondary facts (full word lists, exact timings,
   per-digit history, help) appear on hover, focus, or in the projector/stage
   view. Primary action and current challenge stay alone in the centre.
4. **ASCII is the illustration system.** No icon fonts, no stock SVG icons, no
   emoji. Unicode block, box-drawing, and punctuation characters are the
   material. Illustrations are monospaced `<pre>` blocks and must align on the
   character grid.
5. **Deterministic artifacts.** The same number must always produce the same
   drawing. Memory depends on the image being stable across sessions. Seed all
   procedural art from the number, never from render order or `Math.random()`
   (except transient noise used by the *develop* animation, which resolves to
   the deterministic frame).
6. **Everything is a frame.** Cards, modals, stages, inputs, and drill panels
   share the same anatomy: sprocket rail, gate, edge marks, grain. New
   components inherit the film language rather than inventing cards.
7. **Motion is mechanical, not bouncy.** Ease out, settle, click. Nothing
   overshoots, nothing floats. Animation communicates a state change; it is
   never decoration for its own sake.

---

## 2. Atmosphere

A dark projection booth. Warm tungsten light on aged film. Slight vignette,
scanlines, dust, the occasional scratch. The app should feel *physical*: paper
stock for the codex, celluloid for the reel, a metal console for the trainer.

Reference points: repertory cinema title cards, optical printer manuals, riso
and letterpress zines, terminal UIs with taste.

Avoid: cyberpunk neon, glassmorphism, SaaS gradients, rounded friendly cards,
purple, drop-shadow soup, emoji.

---

## 3. Color

Tokens are defined once in `src/index.css` under `@theme` (Tailwind) and as
CSS variables on `:root`. Never hard-code a hex in a component; use the Tailwind
token (`text-amber`, `bg-film-2`, …) or `var(--token)` inside CSS.

| Token | Value | Role |
| --- | --- | --- |
| `--color-ink` | `#0d0a07` | Page background, deepest recess, text on amber |
| `--color-film` | `#1b140e` | Base frame / card body |
| `--color-film-2` | `#241a12` | Raised frame top, active codex cell |
| `--color-cream` | `#eadfc4` | Primary text, neutral art |
| `--color-amber` | `#f0a93b` | **Person**, primary accent, focus, active control |
| `--color-sage` | `#7fb5a6` | **Action**, success, correct answer |
| `--color-rust` | `#e0674a` | **Object**, error, wrong answer, destructive |

Rules:

- The three role colors are semantic and permanent: `P` amber, `A` sage, `O`
  rust. Never use them interchangeably. Every pair of digits in a reel takes
  the color of its role.
- Amber is the only "brand" accent. One amber primary action per view.
- Sage/rust are feedback colors and role colors at the same time. When used as
  feedback, accompany the color with a shape or motion cue (cell state, glyph)
  so color is not the only signal.
- Text opacity ladder: `cream` 100% (content) → 80% (metadata) → 50% (hint) →
  20–35% (chrome, dividers, disabled). Do not introduce new greys.
- Backgrounds are layered, not flat: `ink` page → `film` card → `#0f0b08` gate
  (inner recess). Shadows are dark and soft, never colored except the amber
  hover halo.

---

## 4. Typography

One family: **JetBrains Mono** (300/400/600/800), loaded from Google Fonts.
Everything — UI, art, digits, prose — is monospace. This is deliberate.

| Use | Size | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- |
| Frame edge marks | 8px | 400 | `0.18em` | uppercase, amber 75% |
| Micro label / tooltip | 9–10px | 400 | `0.2–0.3em` | uppercase where used |
| Body / words | 12–15px | 400 | normal | cream |
| Card digit pair | 20–24px | 600 | `0.12em` | role color |
| Projector digits | 36–48px | 600 | `0.15em` | role color |
| Display digit (trainer) | 44–64px | 800 | `0.06em` | tabular |
| ASCII art | `--fs` | inherits | 0 | line-height `1.08` |

- Digits always use `tabular-nums`.
- Long digit strings use `tracking-[0.28em]` and `break-all`.
- Labels are lowercase in prose and small-caps/uppercase only for chrome
  (edge marks, micro labels). Never Title Case a sentence.
- Italic is not used. Emphasis is weight, color, or a `▸` marker.

---

## 5. Layout & spacing

- Page shell: `max-w-6xl`, horizontal padding `px-4` → `sm:px-8`, top `pt-8`,
  bottom `pb-16`.
- **Trainer focus mode**: the trainer tab removes the site header entirely and
  aligns its tab rail and console to a shared `max-w-4xl` column. The drill owns
  the viewport; brand chrome returns when you leave the tab.
- Vertical rhythm is generous: sections are separated by `mt-8` / `mt-16`.
  Empty space is part of the design; do not fill it.
- Card grid: `repeat(auto-fill, minmax(296px, 1fr))`, `gap-5`.
- Codex grid: 10 columns, `gap-1` → `sm:gap-1.5`, square cells.
- Modal (projector): full-screen scrim `bg-black/90` + `backdrop-blur-sm`,
  centred gate, controls pinned at the bottom.
- Touch targets: minimum 34px high (`.btn`), 38px wide.
- Breakpoints: mobile-first; the projector stacks the three roles vertically
  below `700px`. Trainer stage must remain usable at 360px wide.

Spacing scale follows Tailwind's 4px base. Prefer `gap` over margins inside
flex/grid groups. Use `border-t border-cream/10` to divide a panel's chrome
from its content, not boxes inside boxes.

---

## 6. The ASCII language

### 6.1 Role marks

| Role | Glyph | Name | Color |
| --- | --- | --- | --- |
| `P` | `(o_o)` | Person | amber |
| `A` | `>>>` | Action | sage |
| `O` | `[▓▒]` | Object | rust |

These are the canonical marks and come from `src/lib/roles.ts`. Reuse them in
legends, tooltips, and drill selectors. Do not substitute other glyphs.

### 6.2 Artwork

- Art is a `string[]` of equal-length rows, rendered in a `<pre class="ascii">`
  with `white-space: pre` and `aria-hidden` (timed drills may render the frame
  instantly with `instant` so a challenge is never shown as blank noise).
- Person and Action art: **13 wide × 7 tall** (`ART_W` / `ART_H`).
- Person: procedural portrait from the tens digit (hair, fringe, collar) and
  ones digit (eyes, nose, mouth).
- Action: procedural stick figure from one of ten poses, plus seeded motion FX
  and a ground character.
- Object: one of ten seeded silhouettes chosen by the tens digit (orb, bottle,
  bell, key, rocket, lantern, cup, hammer, hourglass, ring), shaded by the ones
  digit and dotted with a spark on high digits. All objects share the 13×7
  canvas but must be distinguishable at 7px.
- Character ramps for shading: ` . : ░ ▒ ▓ █` (light → heavy).
- Motion FX characters: `* + . = - ~ < > / # % @ $ ! ? o O 0 \ | ^ \``.
- Ground characters: `_ = ~ . - ^ # :`.
- Box drawing for chrome: `┌ ┐ └ ┘ ─ │ ▸ ◂ ▤ ▦ ▰ ▱ ▕ ▏ ● ○`.
- Never use more than three character "voices" in one drawing (e.g. outline,
  shade, FX). More reads as noise.
- A drawing must be legible at 10px. Test at card size before shipping.

### 6.3 Sprockets and gates

- `.sprockets` / `.sprockets-v` are 14px SVG-tile rails. Every frame-like
  surface starts and ends with one.
- `.gate` is the dark inner screen with an inset shadow. Art and digits sit on
  the gate, never directly on the frame body.
- `.edge` marks run along the top/bottom of a frame: sequence number,
  `▶` play state, side letter. They are ambient metadata, not controls.

---

## 7. Surfaces & components

### Frame (`.frame`)
The universal card: 5px radius, vertical `film-2 → film` gradient, 1px inset
cream hairline, `0 8px 24px` shadow. Hover lifts `-4px`, rotates `-0.15deg`,
adds an amber 1px inset and amber halo. Entrance uses `develop` (sepia →
sharp). A card always contains sprockets, a gate, and edge marks.

### Slate (`.slate`)
The digit input panel. Same frame language plus four `.corner` glyphs that
step outward on `:focus-within`. The textarea is transparent, no border, amber
block caret. Below it, a hairline and a status rail: digit count, next-frame
progress (`▰▰▱▱▱▱`), frame count, and icon buttons.

### Button (`.btn`)
34px high, transparent, 1px `cream/16` border, 3px radius. Hover inverts to
amber fill + ink text + amber glow. `aria-pressed="true"` gives amber text,
amber/60 border, amber/8 fill. Icon-only buttons carry both `aria-label` and
`data-tip`; the tooltip is the visible label.

### Tooltip (`[data-tip]`)
Amber chip, ink text, 10px, appears 8px above on hover/focus. Use for every
icon-only control, for role names, and for any number whose meaning is not
obvious. `data-tip-pos="bottom"` flips it. Never rely on a tooltip for the only
copy of essential content.

### Hover reveal (`.reveal`, `.veil`)
`.reveal` fades and lifts a hidden label on group hover/focus. `.veil` blurs
and dims content to 8% until hovered — used to hide the answer side of a card
(numbers ⇄ images). Both are progressive disclosure primitives; prefer them to
toggles when the hidden state is predictable.

### Codex cell (`.codex-cell`)
Square, 3px radius, 1px hairline. Unused: faint border, dim number, faint eye
glyph. Used: amber border/25, `film-2` fill, amber number, `•` marker. Hover:
scale 1.12, amber border, amber glow, z-index 2. Selected: amber border and
amber/10 fill.

### Digit segments (`.seg`)
Introduced with the trainer. A monospaced digit slot with a 1px `cream/12`
baseline, no box. Empty slots show a dim `·`; the active slot has an amber
underline that grows in. Filled slots use the role color (every two digits
share the role of their position). Correct → role color stays, sage underline
plus a short sage background bloom. Wrong → rust underline, rust line-through,
and `shake`. Segments never jump in size; reserve the character width.

### Drill selector
Three framed tiles in a row. Each shows a compact ASCII motif that *is* the
explanation: `(o_o)▸##` (decode), `##▸(o_o)` (encode), and a two-row
`▤▤▤ / ▤▤▤` reel. Role colors carry the meaning (person amber, digits cream,
reel amber/sage/rust). The name is a tooltip, not a visible caption. Active
tile: amber edge + amber/8 wash + `aria-pressed`. Inactive: cream/10 edge, 55%
opacity, hover raises opacity and the edge to amber/35.

### HUD
A single quiet rail above the stage: elapsed time as tabular digits, a streak
of five recent result marks (`●` hit, `╳` miss, `○` unused), and a
personal-best score bar (`▰▰▰▱▱`). No boxes, no labels larger than 10px.
Values that change every frame (timer) sit at cream/50; the current streak is
the only amber element. The timer runs only while the answer is being entered
(and freezes for the feedback hold).

### Encode options
Three rows, one per role, each with four 7px art tiles. The role glyph sits in
a fixed 32px gutter; the tiles form a four-column contact strip. Words are
visible at 55% under each drawing and rise to 100% on hover/focus; the number
key (1–4) sits in the corner. Selected: role-color edge + role/9 wash. On
feedback: the correct tile gets a sage edge, a selected wrong tile gets a rust
edge and shakes. All words stay in the DOM and the tile's `aria-label` is
`Person: …`, `Action: …`, or `Object: …`.

---

## 8. Motion

| Token | Value | Use |
| --- | --- | --- |
| Ease standard | `cubic-bezier(0.2, 0.8, 0.2, 1)` | entrances, lifts |
| Fast | 0.2s | hover, color, border |
| Base | 0.3–0.4s | reveals, veils, transforms |
| Slow | 0.5–0.9s | develops, scene advances |

Named animations (all in `index.css`):

- `develop` — card entrance: opacity + sepia(1) brightness(2.2) blur(3px) →
  sharp, translateY 14px → 0.
- `advance` — projector frame change: translateX 40px + blur + sepia → settle.
- `fadeUp` — generic section entrance: 12px rise, 0.6s.
- `blink` — terminal caret, 1s steps.
- `grain`, `flicker`, `scratch` — ambient film FX (fixed overlays).
- `projector-flicker` — subtle gate brightness instability.
- `shake` — wrong-answer 3px lateral, 0.35s, then rest.
- `segHit` — one sage wash blooms across a correct digit, 0.5s.
- `drain` — reel reveal timer, a 1px amber rule scaling from 1 to 0.

Rules:

- Stagger lists by 55ms per item (cards), 120–180ms per role inside a frame.
  Cap the visible stagger at 12 items; do not animate the whole 200-frame reel.
- Art develops on scroll into view (IntersectionObserver, threshold 0.2) and
  re-develops on hover at 420ms. Timed drill art (reel frames, encode options,
  prompts) renders instantly so the clock never starts on a blank tile.
- Durations never exceed ~900ms for a response to input.
- The projector auto-advance is 3600ms; trainer reveal timing is 1000ms per
  feedback hold and 2000ms per reel frame (slow enough to encode).
- Respect `prefers-reduced-motion`: remove ambient overlay animation, develop
  instantly, keep state changes immediate. Never rely on motion alone to
  communicate correctness.

---

## 9. Interaction

- **Cursor**: on fine pointers the native cursor is hidden and replaced by an
  ASCII crosshair (`|`, `-`, `+`, `x`) with a decaying glyph trail. Hover targets
  become `┌ ● ┐`; text fields become a text I-beam; press becomes `#` with a
  character burst. Never draw a second cursor in a component.
- **Hover** is a first-class reveal channel: words, hidden numbers, per-frame
  arrows, and answer-side art live behind it. Touch users must get the same
  information through focus/click, never hover only.
- **Keyboard**: `Esc` closes overlays; `←`/`→` move frames; `Space` toggles
  projection; `Enter` arms a drill, confirms, or skips feedback; `1–4` choose
  encode options for the first unfilled role. Focus is always visible as a 1px
  amber ring.
- **Sound** is not yet implemented; if added it must default muted, be a
  mechanical click/shutter, and never carry essential feedback.

---

## 10. Data display

- Counts and IDs are zero-padded tabular (`003`, `00–99`).
- Progress uses block bars: `▰` filled, `▱` empty, 5–10 cells. Never a
  percentage unless the exact value matters.
- Streaks use filled/empty dots: `● ● ● ○ ○` (most recent on the right).
- Padding in the final chunk is shown by dimming the padded digits (opacity
  0.28) — never by adding a suffix or note.
- A repeated pair in a reel is a memory risk; mark it with a count of `●`
  (up to 6) in the codex side panel.
- Timers: one decimal, `0.0s`, tabular, cream/50. Do not animate a spinner.

---

## 11. Trainer patterns

The trainer is a **console**, not a page: one stage, one challenge, one input.
Entering the trainer hides the site header so the console owns the viewport;
the tab rail and the console both align to `max-w-4xl`.

Phases: `ready → show → input → feedback → (next) → summary`.

- **Ready**: a looping countdown-leader ASCII motif (`3 → 2 → 1`) with a static
  amber `▶` and the tiny `arm · ↵` hint. The whole stage is the button. No
  instructions paragraph.
- **Show** (reel only): three frames advance every 2000ms with `advance`; a
  1px amber rule drains under the frame. Digits, role art, and words are all
  visible while encoding. Never show digits while the user is meant to recall
  them.
- **Input**: decode keeps words + art and hides digits; encode keeps digits and
  asks for one option per role (three rows of four tiles); reel shows three
  rows of empty digit segments. An invisible numeric field overlays the
  segments, so tapping anywhere on them opens the keyboard. Auto-submit when
  all slots are filled. `Enter` submits early when complete.
- **Feedback**: correct digits turn sage and bloom; wrong digits turn rust and
  shake. The full expected answer appears in role colors only when the rep was
  wrong (encode always reinforces with the correct word triple). Hold 1000ms,
  then advance automatically. `Enter` skips the hold.
- **Summary**: after a session (10 decode reps, 10 encode reps, 5 reel reps),
  the stage shows the score as a block bar, the session's best streak, and the
  personal best. The only action is replay (`↻`); the drill selector stays
  available in the console rail. Nothing else.

Scoring: correctness is objective (exact digits / exact three picks). Per-digit
comparison drives decode and reel feedback even when the rep is scored as a
single unit. Sessions persist to `localStorage` under `pao-trainer-v1` (attempts,
correct, best streak, best score, last five results per drill); never migrate
silently — version the key if the shape changes. Changing tabs ends the live
session but keeps the stats.

---

## 12. Accessibility

- All ASCII art is `aria-hidden`; an adjacent text word or `aria-label` carries
  the meaning. Never make the drawing the only content.
- When a control's whole surface is ASCII (drill tiles, the arm stage), keep the
  art in a presentational layer and let a transparent overlay `<button>` own the
  accessible name, keyboard target, and focus ring. The hit area stays the full
  tile; the glyphs never leak into the accessible name.
- Color is never the sole correctness signal: pair with `✓`/`✕`, underline
  weight, shake/pulse, and the revealed answer.
- Focus rings: 1px amber, visible on keyboard only. Every interactive element
  is reachable and has an accessible name.
- Minimum text size 10px for chrome, 12px for content. Contrast of cream on
  ink is high; amber on ink is acceptable for large text and marks only.
- Honor reduced motion and reduced transparency. Do not autoplay anything
  longer than 1s without a control.
- Tooltips also appear on focus (`:focus-visible`), and every hover-hidden
  answer has a click/focus equivalent.

---

## 13. Voice

Terse, lowercase, mechanical, warm. Think a projectionist's notes, not a
product tour.

- Prefer: `▸ 003`, `next frame`, `arm · ↵`, `00–99`, `developing…`.
- Avoid: "Welcome!", "Let's get started", "Oops!", exclamation marks,
  motivational copy.
- Errors are statements of fact: `✕ wrong — 31 95 63`. Never scold.
- Buttons are glyph-first. If a word is needed, it is a tooltip or a 10px
  micro label.

---

## 14. Implementation conventions

- Components live in `src/components`, pure logic in `src/lib`, styles in
  `src/index.css`. No CSS modules, no styled-components; Tailwind utilities
  first, named classes for repeated primitives (`.frame`, `.gate`, `.btn`,
  `.seg`, …).
- Tokens: add new colors/spacing to `@theme` and `:root`, never inline hex.
- Art generators: seed with the number, cache with a `Map` keyed by
  `role + n` (`cachedArt`). Cheap enough to render 200 frames.
- Persist keys: `pao-digits`, `pao-trainer-v1`, `pao-codex-v1`, `pao-sound-v1`. Read lazily and
  defensively; the app must render with empty storage.
- Components that render a list item use `memo` where re-renders are expensive
  (`Frame`). Keep callbacks stable with `useCallback`.
- New motion must be added to the reduced-motion block when it is ambient or
  longer than 400ms.
- TypeScript strict; no `any`. Run `npx tsc --noEmit` and `npm run build`
  before committing a feature.

---

## 15. Checklist for a new screen

- [ ] Does it use the frame → gate → sprockets anatomy?
- [ ] Is every icon-only control tooltipped and aria-labelled?
- [ ] Can any visible label become a tooltip, glyph, bar, or hover reveal?
- [ ] Are the three role colors used semantically?
- [ ] Is there exactly one primary amber action?
- [ ] Does the layout hold at 360px and at 1440px?
- [ ] Does it read with keyboard only, and with reduced motion?
- [ ] Is the art deterministic for a given number?
- [ ] Did you add any new animation to the reduced-motion block?
- [ ] Do the empty, loading, correct, wrong, and summary states all exist?

---

## 16. Reel navigation, artifacts & delivery

These surfaces extend the film metaphor rather than adding new chrome.

### 16.1 Filmstrip

- A scrubbable strip of **one cell per frame**, directly above the frame grid.
- Cells are 12px tall, active 20px, amber; hover preview is cream at 55%,
  inactive is cream at 14%; every tenth cell is slightly brighter as a ruler.
- A 20px track height keeps the strip quiet. No labels on cells.
- The strip has `role="slider"`, `aria-valuemin/max/now` and an
  `aria-valuetext` that names the frame and its digits.
- Hover and drag only move the preview mark. The grid scroll is committed once
  on release, so scrubbing never yanks the page out from under the pointer.
- Tracking follows the frame nearest **45% of the viewport**, not the top edge.
- Keyboard: `Home`, `End`, `←`, `→`. The meta line shows `NNN / NNN` and the
  active frame's six digits in role colors.

### 16.2 Permalinks

- The reel lives in `location.hash`: `#314159265358…`. Only digits are read.
- Write with `history.replaceState`, never push a history entry per keystroke.
- Listen for `hashchange` so a pasted link or back/forward restores the reel.
- Cap shared digits at `MAX` (1200 = 200 frames).
- `⧉` copies the canonical URL; success is `✓` plus a polite live region.
  Clipboard failure falls back to a hidden textarea.

### 16.3 Artifacts

- `⤓` downloads the reel as plain text: digits, PAO pairs, words, and the 13×7
  art for each frame. It must be readable in any editor and pasteable anywhere.
- `⎙` prints a **cream A4 contact sheet** from a hidden iframe:
  four columns, one cell per frame, frame number, six role-colored digits, and
  the P/A/O pair and word for each. Paper is `#f3ead6`, ink `#171008`,
  role colors slightly darkened for print.
- The sheet is generated from `contactSheetHtml`, not a screenshot. Add the
  sheet footer (`00–99 · personal number memory`) and frame count mark.
- Print CSS: `@page { size: A4 portrait; margin: 10mm }`, `break-inside: avoid`
  on cells, exact color adjustment. Screen preview gets the same 10mm paper
  margin so it looks like the printed page.

### 16.4 Projector sound & keys

- Sound is a synthesized two-click gate plus a low mechanical thump, built with
  Web Audio; no audio files.
- **Muted by default.** `♪` toggles it; `aria-pressed` and a struck-through
  mark communicate state. Persist in `pao-sound-v1`.
- Only synthesize on frame advance while the projector is open. Resume the
  audio context on the first user gesture, never on page load.
- Projector keys: `←`/`→` or `k`/`j` move, `Space` plays/pauses, `Esc` closes.
- Global reel keys: `j`/`k` move and focus the frame, `Enter` opens the
  projector, `Esc` blurs. Never intercept keys while a text input, textarea, or
  contenteditable is focused.

### 16.5 Captions

- Every frame reads as one sentence: `Person is action <link> a object.` The
  verb stays a present participle, so there is no conjugation table to keep.
- `ACTION_LINK` in `words.ts` is the single source of grammar. `direct` verbs
  take the object ("pushing a jukebox"); every other value is the preposition
  that makes the phrase true for all 100 objects ("dancing with a jukebox",
  "floating past a map"). Each action appears exactly once.
- The projector and the `.txt` export both build from `captionText`; never
  hand-format a sentence in a component.
- Articles are phonetic (`an hourglass`, `a unicycle`), and measure phrases are
  allowed (`a pair of scissors`).
- Pick a link that stays grammatical for the whole object vocabulary, not just
  the frame on screen.

### 16.6 PWA & delivery

- Build with `base: './'` and `vite-plugin-singlefile`, so `dist/index.html`
  works from a GitHub Pages subpath and offline.
- `public/` holds `manifest.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`,
  `og.png`, and icons.
- Manifest `id` is unique to the app path (`./?app=pao-reel`), not a generic
  origin root, so it cannot collide with another installed PWA.
- Service worker is registered **production only**, caches the shell and icons,
  and updates with `skipWaiting` + `clients.claim`. Never register it in dev.
- No in-app install prompt, no install banner, no analytics.
- Metadata: canonical URL, description, theme color, OG/Twitter card (1200×630),
  apple-touch-icon, SVG + PNG favicons, and a `WebApplication` JSON-LD block.
- Deploy from the `gh-pages` branch; do not require a CI check to publish.

### 16.7 Repository conventions

- Commit in logical slices: art, reel features, projector, metadata, docs.
- After the remote exists, commit and push frequently.
- The README is visual first: badges, screenshot tables, one code block per
  idea, minimal prose.
