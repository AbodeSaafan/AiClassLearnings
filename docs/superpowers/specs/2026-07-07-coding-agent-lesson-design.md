# Lesson Design: "Meet Your Coding Assistant"

## Problem

Students want to understand "Claude Code and Agent Coding." The AI Concepts Lab
teaches AI *concepts* to non-technical learners through short, visual,
click-through lessons. We need a new lesson that demystifies what a coding agent
actually **is** — an AI that can read, write, and run code on its own — without
requiring any coding knowledge from the learner.

## Audience & angle

- **Audience:** same non-technical learners as the rest of the site.
- **Level:** conceptual, no coding required. No real editor, no syntax, no typing.
- **Core takeaway:** a coding agent is an AI that can **read**, **write**, and
  **run** your code by itself — unlike a plain chatbot, which can only talk about it.

## Approach

A single relatable story: *"The login button is broken — watch the assistant fix
it."* The learner clicks through as one plain-English request travels from ask →
read → write → run → report. The three "superpowers" (read/write/run) are shown
as concrete steps inside one narrative rather than an abstract list.

## Scene flow (7 scenes, one idea each)

1. **Hook / Title** — "Meet Your Coding Assistant." Friendly assistant character
   + a broken 🔴 login button. CTA: "Give it a task →".
2. **The Ask** — A plain-English request types itself into a chat bubble ("The
   login button doesn't work — can you fix it?"). Point: *you talk to it like a
   person; no code required from you.*
3. **👀 Read** — Click "Look through the project" → a short file list appears and
   the assistant highlights the guilty file (`login.js`) with a magnifying glass.
   Point: *it can actually look inside your project.*
4. **✍️ Write** — Click "Make the fix" → a small before/after: the clearly-wrong
   line strikes through (red) and the corrected line fades in (green). Point: *it
   can change the files itself.*
5. **▶️ Run** — Click "Run the test" → a progress tick animates, result flips
   🔴 → 🟢. Point: *it can run things and see whether they worked.*
6. **Report Back** — The assistant summarizes in plain English what it did, line
   by line; the broken button in the corner flips to working 🟢. Point: *it tells
   you what happened, like a coworker.*
7. **Takeaway** — Recap: a coding agent = an AI that can **read**, **write**, and
   **run** your code on its own. One contrast line: "a chatbot can only talk
   about it."

## Interactions

One active moment per scene, all click-to-advance canned animation:

- **The Ask** — request text auto-types into a chat bubble.
- **Read** — button reveals a file list; assistant highlights the culprit file.
- **Write** — button triggers before/after line swap (strike-through red → fade-in green).
- **Run** — button animates a progress tick; result flips 🔴 → 🟢.
- **Report Back** — summary appears line by line; corner button flips to working.

## Technical design

Matches the existing decoupled lesson architecture:

- New file `js/lessons/coding-agent.js` calling
  `App.registerLesson({ id: "coding-agent", emoji: "🤖", title: "Meet Your Coding Assistant", … })`.
- New stylesheet `css/lessons/coding-agent.css`; all classes prefixed `.ca-…` to
  avoid collisions.
- Register both in `index.html`: a `<link>` for the CSS and a `<script>` after
  `js/app.js` and shared helpers. Script order = home-hub order → append at the end.
- Reuse shared building blocks: `.scene`, `.subtitle`, `.btn`/`.btn.secondary`,
  `.takeaway`, and theme CSS variables in `css/base.css`.
- Each scene's `render(stage)` sets `stage.innerHTML` to a root
  `<div class="scene">…</div>` and re-attaches listeners on every render
  (per-scene state in local variables), per the existing convention.
- Update the README lessons table with the new lesson.

## Scope guardrails (YAGNI)

- No real code editor, syntax highlighting engine, or user typing input.
- Everything is click-to-advance canned animation.
- Emoji over custom SVG where it reads clearly.
- Pure HTML/CSS/JS + inline SVG/emoji. No new dependencies, no build step.

## Success criteria

- Lesson appears on the home hub and runs via keyboard/click navigation like the others.
- A non-technical viewer can articulate, after watching, that a coding agent can
  read, write, and run code on its own.
- No console errors; no style collisions with other lessons; opens by
  double-clicking `index.html`.
