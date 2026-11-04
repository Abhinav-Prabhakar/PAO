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
| Frame edge marks | 8px | 400 | `0.18em` | uppercase, amber 55% |
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
  with `white-space: pre` and `aria-hidden`.
- Person and Action art: **13 wide × 7 tall** (`ART_W` / `ART_H`).
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
share the role of their position). Correct → sage underline + soft sage
background pulse. Wrong → rust underline + `shake`. Segments never jump in
size; reserve the character width.

### Drill selector
Three framed tiles in a row. Each shows a compact ASCII motif that *is* the
explanation (e.g. `(o_o) → ##`, `## → (o_o)`, `▤ ▤ ▤`). The label is a
tooltip, not a visible caption. Active tile: amber edge + amber/8 wash +
`aria-pressed`. Inactive: cream/10 edge, 60% art opacity, hover raises art to
100% and the edge to amber/35.

### HUD
A single quiet rail above the stage: elapsed time as tabular digits, a streak
of five recent `●`/`○` marks, and a best-score bar (`▰▰▰▱▱`). No boxes, no
labels larger than 10px. Values that change every frame (timer) sit at
cream/50; the current streak is the only amber element.

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
- `pulse-correct` — one sage halo bloom on a correct segment.

Rules:

- Stagger lists by 55ms per item (cards), 120–180ms per role inside a frame.
  Cap the visible stagger at 12 items; do not animate the whole 200-frame reel.
- Art develops on scroll into view (IntersectionObserver, threshold 0.2) and
  re-develops on hover at 420ms.
- Durations never exceed ~900ms for a response to input.
- The projector auto-advance is 3600ms; trainer reveal timing is 900ms per
  feedback state and 1500ms per reel frame (slow enough to encode).
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
  projection; `Enter` confirms; `1–4` choose options; `j`/`k` move between
  frames (trainer and reel). Focus is always visible as a 1px amber ring.
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

Phases: `ready → show → input → feedback → (next) → summary`.

- **Ready**: a large ASCII motif centred on the gate, a blinking `▌`, and a
  single amber action (tooltip `arm · ↵`). No instructions paragraph.
- **Show**: digits and/or art appear with `advance`; a thin progress bar
  drains under the gate for timed reveals. Never show the answer while the
  user is meant to recall it.
- **Input**: the stage keeps the prompt (words + art for decode, digits for
  encode, empty reels for sequence); segments receive focus automatically.
  Auto-submit when all slots are filled. `Backspace` edits; `Enter` submits
  early if complete.
- **Feedback**: correct segments turn sage, wrong turn rust and shake; the
  full correct answer appears at the stage bottom in role colors. Hold 900ms,
  then advance automatically. `Enter` skips the hold.
- **Summary**: after a session (10 decode/encode reps, 5 reel reps), the stage
  shows the score as a block bar, best streak, and personal best. Two actions:
  replay (`↻`) and change drill (`◂`). Nothing else.

Scoring: correctness is objective (exact digits / exact triple). Per-digit
comparison drives feedback even when the rep is scored as a single unit.
Sessions persist to `localStorage` under `pao-trainer-v1`; never migrate
silently — version the key if the shape changes.

---

## 12. Accessibility

- All ASCII art is `aria-hidden`; an adjacent text word or `aria-label` carries
  the meaning. Never make the drawing the only content.
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
- Persist keys: `pao-digits`, `pao-trainer-v1`, `pao-codex-v1`. Read lazily and
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
