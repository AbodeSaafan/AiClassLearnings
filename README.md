# AI Workflows vs. AI Agents — Interactive Lesson

An interactive, instructor-led web lesson that teaches the difference between **AI workflows** and **AI agents** using a "factory world" and a friendly robot whose body parts map to the pieces of an AI agent.

Built as a zero-build static site: plain HTML, CSS, and JavaScript with inline SVG. No frameworks, no build step, no dependencies.

## Run it

Either:

- **Double-click `index.html`** to open it in your browser, or
- Serve it locally (recommended for a clean URL):

  ```bash
  python3 -m http.server 8000
  ```

  Then open <http://localhost:8000>.

## Present it

- **Right arrow** or **Space** → next scene
- **Left arrow** → previous scene
- Or use the on-screen **Back / Next** buttons
- Press **F11** to full-screen the browser for the projector

The lesson runs as seven scenes:

1. **Hook** — title on a factory backdrop
2. **The Assembly Line** — a workflow: fixed, predefined steps, same path every time
3. **Meet the Robot** — an agent: given a goal, it decides its own steps
4. **Robot Anatomy** — click the robot's parts to learn what each maps to
5. **The Loop in Action** — step through the robot planning "movie night" (think → act → look → remember)
6. **Side-by-Side** — same job, workflow vs agent; throw a curveball and watch the line jam while the robot adapts
7. **When to Use Which** — a plain-language recap

### The robot's parts

| Part | Concept | What it does |
| --- | --- | --- |
| 🧠 Brain | LLM | Thinks, reasons, decides what to do next |
| 👀 Eyes | Perception / Input | Reads the situation, looks things up, sees results |
| ✋ Hands | Tools | Takes actions: search, run code, call an API |
| 🎒 Backpack | Memory | Remembers the goal, past steps, and learnings |
| 🎯 Antenna | Goal | The objective it's trying to achieve |
| 🦿 Legs | The Loop | Keeps going until the goal is met |

## Deploy it

Push to GitHub and enable **GitHub Pages** (Settings → Pages → deploy from the repository root). No build step is required.

## How to add a new lesson

Content and structure are separated, so adding a lesson (or scene) is small:

```javascript
// 1) Add copy in js/data.js
App.data.scenesCopy.rag = { heading: "What is RAG?", sub: "..." };

// 2) Add a scene object in js/scenes.js (order in the array = order in the tour)
{
  id: "rag",
  title: "RAG",
  render: function (stage) {
    var c = App.data.scenesCopy.rag;
    stage.innerHTML = '<div class="scene"><h2>' + c.heading + '</h2>' +
                      '<p class="subtitle">' + c.sub + '</p></div>';
  }
}
```

Navigation, progress dots, and keyboard shortcuts pick up the new scene automatically.

## Project layout

```
index.html            App shell: loads CSS + JS, holds the scene container and nav bar
css/
  base.css            Theme variables, typography, buttons, shared components
  scenes.css          Scene container, transitions, progress dots, nav bar
  factory.css         Factory backdrop, conveyor belt, comparison cards
  robot.css           Robot figure, part highlights, anatomy + loop layouts
js/
  data.js             All lesson copy and the movie-night task data
  robot.js            Reusable robot SVG component
  workflow.js         Assembly-line animation
  agentLoop.js        Step-through agent loop
  scenes.js           The seven scene definitions
  app.js              Navigation controller and keyboard shortcuts
```
