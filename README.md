# The AI Concepts Lab

An interactive, instructor-led website for teaching AI concepts to non-technical learners. Each topic is a short, visual, click-through "lesson" launched from a home hub.

Built as a zero-build static site: plain HTML, CSS, and JavaScript with inline SVG. No frameworks, no build step, no dependencies. It runs by double-clicking `index.html` and deploys to GitHub Pages as-is.

## Lessons

| Lesson | What it teaches |
| --- | --- |
| 🏭 **AI Workflows vs. Agents** | A factory tour: fixed assembly lines vs a robot that decides for itself. Includes an interactive robot whose parts map to agent components. |
| 📚 **RAG: Giving AI a Library** | How AI looks things up before answering, so it stays accurate and current. |
| 💬 **From Message to Answer** | What happens between hitting send and getting a reply: tokens, numbers, and predicting one word at a time. |
| 🪟 **The Context Window** | The AI's short-term memory: what it can "see" at once, and why long chats forget. |

## Run it

Either:

- **Double-click `index.html`** to open it in your browser, or
- Serve it locally (recommended for a clean URL):

  ```bash
  python3 -m http.server 8000
  ```

  Then open <http://localhost:8000>.

## Present it

- Start on the **home hub** and click a lesson card
- **Right arrow** or **Space** → next scene
- **Left arrow** → previous scene (from the first scene, goes back to the hub)
- **🏠 Lessons** button or **Escape** → return to the hub
- Press **F11** to full-screen the browser for the projector

## Deploy it

Push to GitHub and enable **GitHub Pages** (Settings → Pages → deploy from the repository root). No build step is required.

## Architecture

Lessons are decoupled from the shell. `js/app.js` owns the home hub, scene navigation, progress dots, and keyboard shortcuts. Each lesson is a single self-registering file under `js/lessons/`, with its own optional stylesheet under `css/lessons/`.

A lesson registers itself by calling `App.registerLesson`:

```javascript
App.registerLesson({
  id: "example",
  emoji: "✨",
  title: "My Lesson",
  description: "One-line summary shown on the home card.",
  scenes: [
    {
      id: "intro",
      title: "Intro",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<h2>Hello</h2>' +
            '<p class="subtitle">One idea per scene.</p>' +
          '</div>';
      }
    }
    // more scenes...
  ]
});
```

- Each scene's `render(stage)` sets `stage.innerHTML` to a root `<div class="scene">…</div>` and then wires up any event listeners. It is called fresh every time the scene is shown, so rebuild the DOM and re-attach listeners on each render (keep per-scene state in local variables).
- Navigation, progress dots, and keyboard shortcuts pick up the lesson automatically.

### How to add a new lesson

1. Create `js/lessons/<id>.js` and call `App.registerLesson({ ... })` at the top level.
2. (Optional) Create `css/lessons/<id>.css` for lesson-specific styles. Prefix your class names (e.g. `.<id>-…`) to avoid collisions.
3. Add both to `index.html`: a `<link>` for the CSS and a `<script>` for the JS (script order = order on the home hub; lesson scripts load after `js/app.js` and the shared helpers).

Reuse the shared building blocks: the `.scene`, `.subtitle`, `.label`, `.btn`/`.btn.secondary`, and `.takeaway` classes, the theme CSS variables in `css/base.css`, and `App.buildRobot()` / `App.highlightPart()` from `js/robot.js`.

## Project layout

```
index.html                 App shell: loads CSS + JS, holds the scene container and nav bar
css/
  base.css                 Theme variables, typography, buttons, shared components
  scenes.css               Scene container, transitions, progress dots, nav bar
  home.css                 Home hub: lesson-card grid, Lessons button
  factory.css              Workflows lesson: factory backdrop, conveyor, comparison cards
  robot.css                Reusable robot figure, part highlights, anatomy + loop layouts
  lessons/
    rag.css                RAG lesson styles
    pipeline.css           Message-to-answer lesson styles
    context.css            Context-window lesson styles
js/
  app.js                   Lesson registry, home hub, navigation, keyboard shortcuts
  data.js                  Copy + task data for the workflows lesson
  robot.js                 Reusable robot SVG component
  workflow.js              Assembly-line animation (workflows lesson)
  agentLoop.js             Step-through agent loop (workflows lesson)
  lessons/
    workflows-vs-agents.js AI workflows vs agents (7 scenes)
    rag.js                 RAG: giving AI a library
    pipeline.js            From message to answer
    context.js             The context window
```
