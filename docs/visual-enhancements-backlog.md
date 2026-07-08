# Visual & Interactivity Enhancement Backlog

Future ideas to make The AI Concepts Lab richer, more polished, and more interactive. Nothing here is committed to yet — it's a menu to pull from.

**Source:** Two independent AI reviewers audited the code on 2026-07-07 — one on Claude Opus 4.8, one on GPT-5.3-Codex. Items both flagged independently are marked **[Consensus]** and are the strongest signals. Attribution: `[O]` = Opus, `[C]` = Codex, `[O+C]` = both.

**Ground rules every idea must respect:**
- Stay zero-build / no-dependency (vanilla CSS keyframes, inline SVG, DOM, `localStorage`, built-in Web Audio). No CDN or `<canvas>` unless explicitly noted; DOM approach is fine at classroom scale.
- Keep it projector-readable and clear for non-technical learners — no clutter that hurts comprehension.
- Respect `prefers-reduced-motion`. CSS-only motion is already covered by the global rule; JS-driven motion (confetti, sound, robot idle, beams) needs an explicit `matchMedia('(prefers-reduced-motion: reduce)')` guard so it no-ops.
- Instructor-led pacing: interactions are deliberately triggered, never requiring fast/precise input.

---

## Recommended first cluster (highest impact-to-effort)

Both reviewers pointed at this group. Good first slice if we pick up the work.

- [ ] **`App.celebrate()` success burst** — reusable confetti/emoji burst on success states (workflows goal-reached, pipeline complete, RAG grounded answer, correct quiz). Today these are just text/label swaps. **[Consensus]**
- [ ] **Interactive next-token picking** — in the pipeline `predict` scene, let the class click a candidate (not only auto-pick the top one) so a different choice yields a different sentence ("this is why answers vary"). Keep a "🎲 Auto (most likely)" button. **[Consensus]**
- [ ] **Draw the agent loop** — a visible think → act → observe → remember ring/state-machine that lights the current phase each step, alongside the existing log. The lesson is literally "The Loop" but the loop is only implied. **[Consensus]**
- [ ] **Home hub + progress-dot polish** — staggered card entrance, live mini-previews/accent colors on the hub; clickable, labeled progress dots with a "Scene 3/7" counter. **[Consensus]**
- [ ] **Projector Mode toggle** — a button for bigger text, thicker borders, higher contrast, reduced decorative gradients for bright rooms. Cheap and well-matched to the instructor-led/projector use. `[C]`

---

## Global / shared

- [ ] **Success celebration helper** — see cluster above. Approach: one function appends ~20 absolutely-positioned emoji/dot spans with a CSS fall+fade keyframe, auto-removed via `setTimeout`; `matchMedia` guarded. If it ever needs hundreds of particles, a single `<canvas>` is the one place canvas might be worth it. Impact High / Effort Med. **[O+C]**
- [ ] **Gentle Web Audio cues** — soft tick on step advance, rising chime on success. Zero assets (oscillator + envelope). Default **off** with a persisted 🔊 toggle; never autoplay; treat reduced-motion as a "calm" proxy. Impact Med / Effort Med. **[O+C]**
- [ ] **Staged reveal system** — reusable `.reveal-step` + a `nextReveal()` helper so scenes reveal in cinematic beats before advancing; instant under reduced-motion. Impact High / Effort Low. `[C]`
- [ ] **Directional / varied scene transitions** — slide left on Next, right on Back (set `stage.dataset.dir` in `App.next/prev`, add `.scene[data-dir=back]` variant); optional distinct entrance for hook/recap scenes. Impact Med / Effort Low. `[O]`
- [ ] **Projector Mode** — see cluster above. Toggle a body class that scales type, thickens borders, boosts contrast. Impact High / Effort Low. `[C]`
- [ ] **Reusable micro-feedback** — small sparkle pulse / checkmark stamp on milestone actions (lighter-weight cousin of full celebration). Impact Med / Effort Low. `[C]`

## Home hub & navigation

- [ ] **Richer progress bar** — show "Scene N / total", the current `scene.title` as a caption (titles already exist but are unused in the UI), and make dots clickable to jump (`App.goToScene(i)`). Great for instructors revisiting a scene. Impact Med-High / Effort Low. **[O+C]**
- [ ] **Home hub polish** — staggered card entrance (`animation-delay` via `--i`), per-lesson accent color / large emoji, soft animated background (a couple of drifting blurred radial-gradient blobs), and a "✓ visited" badge persisted in `localStorage` (set in `openLesson`). Impact High / Effort Med. **[O+C]**
- [ ] **Live mini-previews on cards** — on hover/focus, animate the emoji + a one-line "what you'll do" (e.g., "Step through a robot loop"); static fallback under reduced-motion. Impact Med / Effort Low. `[C]`

## Lesson: AI Workflows vs. Agents

- [ ] **Draw the loop as a state machine** — see cluster above. Inline SVG ring with 4 arc segments/arrowheads; `agentLoop.renderStep` toggles `.active` on the segment matching the current phase; keep the log. Impact High / Effort Med. **[O+C]**
- [ ] **Make the robot come alive** — periodic eye-blink (`scaleY` keyframe on the eyes group, staggered ~every 4s) and a gentle antenna-tip pulse, even without `bob`. Reads as "thinking," holds attention. Impact Med / Effort Low. `[O]`
- [ ] **Robot anatomy "Auto tour" mode** — a button that cycles the parts with callout lines + concise captions before free clicking; manual chips still available. Impact Med / Effort Low. `[C]`
- [ ] **Richer conveyor motion** — scroll the belt stripes while running (`background-position` keyframe toggled by a `.running` class), station "stamp" effects, and the item morphs through stations (🎬 → 🍿 → 🕗 → ✅). Impact Med-High / Effort Low-Med. **[O+C]**
- [ ] **Dramatize the curveball** — the "😮 curveball" visibly flies in; the line sparks/jams at the last station (reuse the existing-but-unused `App.workflow.jam()` to shake the item); the robot shows a re-loop/re-route arrow choosing a new path. Red beacon + flash on the jam. Impact Med / Effort Med. **[O+C]**

## Lesson: RAG — Giving AI a Library

- [ ] **Documents physically fly into the prompt** — during retrieval, animate the relevant docs moving from the library into the prompt box (FLIP-style: measure rect, clone, animate transform), preceded by a quick "search beam" sweep over the library (an absolutely-positioned gradient bar animating top→bottom). Today docs only nudge `translateX(14px)`. Impact Med / Effort Med. **[O+C]**
- [ ] **Citation spotlight** — clicking a citation pill highlights the matching source card with an animated SVG connector line. Reinforces "grounded answer." Impact Med / Effort Low. `[C]`
- [ ] **Retrieval as a prediction challenge** — before the reveal, ask the class to pick the relevant docs (tap cards), then show "the model picked these" comparison + a score. Converts a passive reveal into an active prediction moment. Impact High / Effort Med. `[C]`

## Lesson: From Message to Answer (pipeline)

- [ ] **Interactive token picking / "temperature"** — see cluster above. Make each `.pipe-candidate` a button; on click append that token and advance; keep a "🎲 Auto (most likely)" default. Optionally a Low/High creativity toggle that changes the probability spread and the chosen path. Impact High / Effort Med. **[O+C]**
- [ ] **Animate the tokenizer cut** — a ✂️ travels along the sentence dropping each token, synced to the existing reveal stagger; color-match each chip to its span in the original sentence so learners see word-*pieces*. Impact Med / Effort Low-Med. `[O]`
- [ ] **Make the "Numbers" scene interactive** — it's currently the only pipeline scene with no interaction (three static cards). Add a small 2D "meaning map": a few pre-placed SVG token dots; tap a token to highlight nearby related tokens ("sun" near "sunflower"). Positions hand-authored, no real embeddings. Impact Med / Effort Med. `[O]`
- [ ] **Streaming pacing + latency viz** — show a token queue and a tiny latency meter; add Step/Pause controls so the instructor can pace the "typing" effect and make it technically meaningful. Impact Med / Effort Low. `[C]`

## Lesson: The Context Window

- [ ] **Physical sliding-window fall-off** — animate the oldest cards sliding out (up/left) past the window boundary into a "forgotten" panel when capacity is exceeded; emphasize the window edge. Makes the forgetting mechanic instantly intuitive. Impact High / Effort Med. **[O+C]**
- [ ] **"Summarize to fit" rescue move** — a button that compresses several old notes into one short summary card, reclaiming token space. Shows the practical fix, not just the problem. Impact High / Effort Med. **[O+C]**
- [ ] **Meter danger zone** — shift the capacity meter color green → amber → red as it fills and pulse near 90–100% (swap a class by `total/capacity` threshold in `draw()`). The current `ctx-meter-fill` is a static gradient. Impact Med / Effort Low. `[O]`
- [ ] **Instructor-added custom note** — a text input with a rough token estimate (`Math.ceil(len/4)`) pushed into the window, so a class-suggested note ("remember my dog's name") makes the forgetting feel personal and live. Impact Med / Effort Low-Med. `[O]`

## Accessibility & input

- [ ] **Keyboard + focus polish** — make robot parts (`.rpart`), RAG docs (`.rag-doc`), and RAG use-cards real focusable buttons with Enter/Space handlers and a shared `:focus-visible` ring token in `base.css`; add `aria-live` announcements on step changes. Currently these are click-only (not keyboard/AT reachable). Impact Med / Effort Low. `[O]`

---

## How to use this backlog

Each item is a checkbox so we can tick them off as they land. When picking work, prefer the **Recommended first cluster**, keep changes inside the relevant lesson's files where possible (`js/lessons/<id>.js` + `css/lessons/<id>.css`) or the shared shell (`js/app.js`, `css/base.css`, `js/robot.js`) for global items, and re-run the headless jsdom smoke check (open every lesson, walk every scene, click every button, expect 0 errors) before committing.
