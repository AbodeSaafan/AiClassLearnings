# "Meet Your Coding Assistant" Lesson Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new interactive, non-technical lesson that shows what a coding agent *is* by walking through one story — an AI reading, writing, and running code to fix a broken login button.

**Architecture:** Follows the existing decoupled lesson pattern. One self-registering file `js/lessons/coding-agent.js` calling `App.registerLesson(...)`, one stylesheet `css/lessons/coding-agent.css` (all classes prefixed `.ca-`), both linked in `index.html`. Seven scenes, each rebuilding its DOM and re-attaching listeners on every `render(stage)`. Pure HTML/CSS/JS + emoji, no build step, no dependencies.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, inline emoji/SVG. No test runner — verification is manual in-browser (serve with `python3 -m http.server 8000`, open the lesson, click through, confirm no console errors).

**Verification convention (all tasks):** Run `python3 -m http.server 8000` from repo root (if not already running), open <http://localhost:8000>, open the browser devtools Console, click the 🤖 lesson card, and navigate with the **Next →** button / Right arrow. "No console errors" means the Console shows no red errors.

---

### Task 1: Scaffold the lesson (Hook scene) and wire it into the site

**Files:**
- Create: `js/lessons/coding-agent.js`
- Create: `css/lessons/coding-agent.css`
- Modify: `index.html:15` (add CSS link) and `index.html:40` (add script tag)

- [ ] **Step 1: Create the stylesheet with shared-token base styles**

Create `css/lessons/coding-agent.css`:

```css
/* Lesson-specific styles for the coding-agent lesson. Prefix: ca-. */
.ca-hero-emoji {
  font-size: clamp(56px, 8vw, 104px);
  line-height: 1;
  margin-bottom: 14px;
}

.ca-panel,
.ca-chat-bubble,
.ca-file-list,
.ca-file,
.ca-diff,
.ca-run-box,
.ca-report,
.ca-recap-board {
  background: var(--panel);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* Broken/working login button used across scenes */
.ca-login-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-weight: 800; font-size: 18px; color: #fff;
  border: none; border-radius: 12px; padding: 12px 22px;
  background: #c94f4f; box-shadow: 0 5px 0 #9c3a3a;
}
.ca-login-btn.ca-working { background: var(--hands); box-shadow: 0 5px 0 #3fae7a; color: #123; }

.ca-corner-status {
  position: absolute; top: 14px; right: 18px;
  display: flex; align-items: center; gap: 8px;
  font-weight: 800; color: var(--muted);
}
```

- [ ] **Step 2: Create the lesson file with the Hook scene only**

Create `js/lessons/coding-agent.js`:

```javascript
App.registerLesson({
  id: "coding-agent",
  emoji: "🤖",
  title: "Meet Your Coding Assistant",
  description: "Watch an AI read, write, and run code on its own to fix a broken button.",
  scenes: [
    {
      id: "hook",
      title: "Meet Your Assistant",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<div class="ca-hero-emoji">🤖💻</div>' +
            '<p class="label">A new kind of helper</p>' +
            '<h1>Meet your coding assistant.</h1>' +
            '<p class="subtitle">It is not just a chatbot that talks about code. It can open a project, change it, and run it — by itself.</p>' +
            '<div style="margin:22px 0"><button class="ca-login-btn" disabled>🔴 Log in (broken)</button></div>' +
            '<button class="btn" id="ca-hook-cta">Give it a task →</button>' +
          '</div>';
        stage.querySelector("#ca-hook-cta").addEventListener("click", App.next);
      }
    }
  ]
});
```

- [ ] **Step 3: Link the stylesheet in index.html**

In `index.html`, after the line `<link rel="stylesheet" href="css/lessons/context.css" />` (line 15), add:

```html
  <link rel="stylesheet" href="css/lessons/coding-agent.css" />
```

- [ ] **Step 4: Register the script in index.html**

In `index.html`, after the line `<script src="js/lessons/context.js"></script>` (line 40), add:

```html
  <script src="js/lessons/coding-agent.js"></script>
```

- [ ] **Step 5: Verify in browser**

Run `python3 -m http.server 8000` from the repo root. Open <http://localhost:8000>.
Expected: a new **🤖 Meet Your Coding Assistant** card appears on the home hub (last card). Clicking it shows the Hook scene with the robot emoji, a red "Log in (broken)" button, and a "Give it a task →" button. Clicking the CTA advances to the next scene (currently empty since only one scene exists). Console shows no errors.

- [ ] **Step 6: Commit**

```bash
git add js/lessons/coding-agent.js css/lessons/coding-agent.css index.html
git commit -m "feat(lesson): scaffold coding-agent lesson with hook scene"
```

---

### Task 2: The Ask scene (request auto-types into a chat bubble)

**Files:**
- Modify: `js/lessons/coding-agent.js` (add scene after `hook`)
- Modify: `css/lessons/coding-agent.css` (add chat bubble styles)

- [ ] **Step 1: Add chat-bubble styles**

Append to `css/lessons/coding-agent.css`:

```css
.ca-chat-bubble {
  max-width: 640px; margin: 24px auto 0; padding: 18px 22px;
  border: 3px solid var(--accent); text-align: left;
  font-size: clamp(18px, 2vw, 24px); font-weight: 700; min-height: 32px;
}
.ca-chat-who { display: block; font-size: 13px; color: var(--muted); font-weight: 800; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .06em; }
.ca-caret { border-right: 3px solid var(--ink); animation: ca-blink 1s step-end infinite; }
@keyframes ca-blink { 50% { border-color: transparent; } }
@media (prefers-reduced-motion: reduce) { .ca-caret { animation: none; } }
```

- [ ] **Step 2: Add the Ask scene**

In `js/lessons/coding-agent.js`, add this scene object to the `scenes` array immediately after the `hook` scene (insert a comma after the hook scene's closing `}`):

```javascript
    {
      id: "ask",
      title: "You Ask in Plain English",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Step 1 — the request</p>' +
            '<h2>You just describe the problem.</h2>' +
            '<p class="subtitle">No code needed from you. Talk to it like a helpful coworker.</p>' +
            '<div class="ca-chat-bubble"><span class="ca-chat-who">🙋 You</span>' +
              '<span id="ca-ask-text"></span><span class="ca-caret" id="ca-ask-caret"></span>' +
            '</div>' +
            '<div style="margin-top:22px"><button class="btn" id="ca-ask-btn">Send the request</button></div>' +
          '</div>';

        var full = "The login button doesn't work — can you fix it?";
        var textEl = stage.querySelector("#ca-ask-text");
        var caret = stage.querySelector("#ca-ask-caret");
        var button = stage.querySelector("#ca-ask-btn");
        var timer = null;

        function type() {
          var i = 0;
          timer = setInterval(function () {
            i += 1;
            textEl.textContent = full.slice(0, i);
            if (i >= full.length) {
              clearInterval(timer);
              caret.classList.remove("ca-caret");
            }
          }, 45);
        }

        button.addEventListener("click", function () {
          if (timer) clearInterval(timer);
          textEl.textContent = "";
          caret.classList.add("ca-caret");
          button.textContent = "Sent ✓";
          button.disabled = true;
          type();
        });
      }
    }
```

- [ ] **Step 3: Verify in browser**

Reload <http://localhost:8000>, open the lesson, click "Give it a task →" to reach the Ask scene. Click "Send the request".
Expected: the sentence "The login button doesn't work — can you fix it?" types itself out character by character into the chat bubble; the blinking caret stops when done; the button reads "Sent ✓" and is disabled. Console shows no errors.

- [ ] **Step 4: Commit**

```bash
git add js/lessons/coding-agent.js css/lessons/coding-agent.css
git commit -m "feat(lesson): add 'the ask' scene to coding-agent lesson"
```

---

### Task 3: The Read scene (agent scans files and highlights the culprit)

**Files:**
- Modify: `js/lessons/coding-agent.js` (add scene after `ask`)
- Modify: `css/lessons/coding-agent.css` (add file-list styles)

- [ ] **Step 1: Add file-list styles**

Append to `css/lessons/coding-agent.css`:

```css
.ca-file-list { max-width: 460px; margin: 24px auto 0; padding: 12px; text-align: left; }
.ca-file {
  display: flex; align-items: center; gap: 10px; padding: 12px 14px;
  border-radius: 12px; font-weight: 700; box-shadow: none; margin: 6px 0;
  border: 2px solid transparent; transition: background .2s ease, border-color .2s ease;
}
.ca-file.ca-scanning { background: var(--bg-2); }
.ca-file.ca-found { border-color: var(--accent); background: #fff7e6; }
.ca-file .ca-file-note { margin-left: auto; font-size: 13px; color: var(--muted); font-weight: 800; }
```

- [ ] **Step 2: Add the Read scene**

In `js/lessons/coding-agent.js`, add this scene object immediately after the `ask` scene (insert a comma after the ask scene's closing `}`):

```javascript
    {
      id: "read",
      title: "It Reads Your Project",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Superpower 1 — 👀 Read</p>' +
            '<h2>First, it looks inside your project.</h2>' +
            '<p class="subtitle">It can open your files and understand them — something a plain chatbot cannot do.</p>' +
            '<div class="ca-file-list" id="ca-file-list">' +
              '<div class="ca-file" data-name="index.html">📄 index.html</div>' +
              '<div class="ca-file" data-name="styles.css">🎨 styles.css</div>' +
              '<div class="ca-file" data-name="login.js">📜 login.js</div>' +
              '<div class="ca-file" data-name="about.js">📜 about.js</div>' +
            '</div>' +
            '<div style="margin-top:22px"><button class="btn" id="ca-read-btn">Look through the project 🔍</button></div>' +
            '<p class="takeaway" id="ca-read-take" style="visibility:hidden;margin-top:18px">Found it: the problem lives in <strong>login.js</strong>.</p>' +
          '</div>';

        var files = Array.prototype.slice.call(stage.querySelectorAll(".ca-file"));
        var button = stage.querySelector("#ca-read-btn");
        var take = stage.querySelector("#ca-read-take");

        button.addEventListener("click", function () {
          button.disabled = true;
          files.forEach(function (f) { f.classList.remove("ca-scanning", "ca-found"); });
          var i = 0;
          var timer = setInterval(function () {
            if (i > 0) files[i - 1].classList.remove("ca-scanning");
            if (i >= files.length) {
              clearInterval(timer);
              var found = files.filter(function (f) { return f.getAttribute("data-name") === "login.js"; })[0];
              found.classList.add("ca-found");
              found.innerHTML += '<span class="ca-file-note">🔍 problem here</span>';
              take.style.visibility = "visible";
              button.textContent = "Found the problem file";
              return;
            }
            files[i].classList.add("ca-scanning");
            i += 1;
          }, 450);
        });
      }
    }
```

- [ ] **Step 3: Verify in browser**

Reload, navigate to the Read scene, click "Look through the project 🔍".
Expected: each file row highlights briefly in sequence (top to bottom); at the end, `login.js` stays highlighted with a "🔍 problem here" note, the takeaway "Found it: the problem lives in login.js." becomes visible, and the button reads "Found the problem file". Console shows no errors.

- [ ] **Step 4: Commit**

```bash
git add js/lessons/coding-agent.js css/lessons/coding-agent.css
git commit -m "feat(lesson): add 'read' scene to coding-agent lesson"
```

---

### Task 4: The Write scene (before/after line swap)

**Files:**
- Modify: `js/lessons/coding-agent.js` (add scene after `read`)
- Modify: `css/lessons/coding-agent.css` (add diff styles)

- [ ] **Step 1: Add diff styles**

Append to `css/lessons/coding-agent.css`:

```css
.ca-diff {
  max-width: 640px; margin: 24px auto 0; padding: 18px; text-align: left;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: clamp(14px, 1.6vw, 18px);
}
.ca-diff-file { font-family: var(--font); font-weight: 800; color: var(--muted); margin-bottom: 10px; }
.ca-line { padding: 8px 12px; border-radius: 8px; margin: 6px 0; display: block; }
.ca-line-bad { background: #fdecec; color: #a33; text-decoration: line-through; }
.ca-line-good { background: #e9f9f1; color: #1a7a52; opacity: 0; transition: opacity .4s ease; }
.ca-line-good.ca-show { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .ca-line-good { transition: none; } }
```

- [ ] **Step 2: Add the Write scene**

In `js/lessons/coding-agent.js`, add this scene object immediately after the `read` scene (insert a comma after the read scene's closing `}`):

```javascript
    {
      id: "write",
      title: "It Changes the Code",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Superpower 2 — ✍️ Write</p>' +
            '<h2>Then it fixes the file itself.</h2>' +
            '<p class="subtitle">You do not have to understand the code. Notice one line was wrong — it swaps in the right one.</p>' +
            '<div class="ca-diff">' +
              '<div class="ca-diff-file">📜 login.js</div>' +
              '<span class="ca-line">function logIn() {</span>' +
              '<span class="ca-line ca-line-bad" id="ca-bad-line">&nbsp;&nbsp;check_password("");  // always empty!</span>' +
              '<span class="ca-line ca-line-good" id="ca-good-line">&nbsp;&nbsp;check_password(typedPassword);  // use what they typed</span>' +
              '<span class="ca-line">}</span>' +
            '</div>' +
            '<div style="margin-top:22px"><button class="btn" id="ca-write-btn">Make the fix ✍️</button></div>' +
            '<p class="takeaway" id="ca-write-take" style="visibility:hidden;margin-top:18px">One wrong line replaced with the correct one.</p>' +
          '</div>';

        var goodLine = stage.querySelector("#ca-good-line");
        var button = stage.querySelector("#ca-write-btn");
        var take = stage.querySelector("#ca-write-take");

        button.addEventListener("click", function () {
          goodLine.classList.add("ca-show");
          take.style.visibility = "visible";
          button.textContent = "Fix applied ✓";
          button.disabled = true;
        });
      }
    }
```

- [ ] **Step 3: Verify in browser**

Reload, navigate to the Write scene. The `login.js` snippet shows a red struck-through wrong line and a hidden green line. Click "Make the fix ✍️".
Expected: the green corrected line fades in, the takeaway appears, and the button reads "Fix applied ✓" and is disabled. Console shows no errors.

- [ ] **Step 4: Commit**

```bash
git add js/lessons/coding-agent.js css/lessons/coding-agent.css
git commit -m "feat(lesson): add 'write' scene to coding-agent lesson"
```

---

### Task 5: The Run scene (runs the test, red → green)

**Files:**
- Modify: `js/lessons/coding-agent.js` (add scene after `write`)
- Modify: `css/lessons/coding-agent.css` (add run-box styles)

- [ ] **Step 1: Add run-box styles**

Append to `css/lessons/coding-agent.css`:

```css
.ca-run-box {
  max-width: 560px; margin: 24px auto 0; padding: 20px; text-align: left;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: clamp(14px, 1.6vw, 18px);
}
.ca-run-line { margin: 8px 0; display: flex; align-items: center; gap: 10px; }
.ca-run-spinner { animation: ca-spin 0.8s linear infinite; display: inline-block; }
@keyframes ca-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .ca-run-spinner { animation: none; } }
.ca-run-result { font-weight: 800; font-family: var(--font); }
.ca-run-result.ca-pass { color: #1a7a52; }
.ca-run-result.ca-fail { color: #a33; }
```

- [ ] **Step 2: Add the Run scene**

In `js/lessons/coding-agent.js`, add this scene object immediately after the `write` scene (insert a comma after the write scene's closing `}`):

```javascript
    {
      id: "run",
      title: "It Runs the Code",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Superpower 3 — ▶️ Run</p>' +
            '<h2>Now it checks its own work.</h2>' +
            '<p class="subtitle">It runs a quick test and watches the result — so it knows whether the fix actually worked.</p>' +
            '<div class="ca-run-box">' +
              '<div class="ca-run-line">▶️ Running test: <strong>can a user log in?</strong></div>' +
              '<div class="ca-run-line" id="ca-run-status"><span class="ca-run-spinner">⏳</span> starting…</div>' +
            '</div>' +
            '<div style="margin-top:22px"><button class="btn" id="ca-run-btn">Run the test ▶️</button></div>' +
            '<p class="takeaway" id="ca-run-take" style="visibility:hidden;margin-top:18px">The test passed — the fix works.</p>' +
          '</div>';

        var status = stage.querySelector("#ca-run-status");
        var button = stage.querySelector("#ca-run-btn");
        var take = stage.querySelector("#ca-run-take");

        button.addEventListener("click", function () {
          button.disabled = true;
          button.textContent = "Running…";
          status.innerHTML = '<span class="ca-run-spinner">⏳</span> checking the login…';
          setTimeout(function () {
            status.innerHTML = '<span class="ca-run-result ca-fail">🔴 before the fix: FAILED</span>';
          }, 700);
          setTimeout(function () {
            status.innerHTML = '<span class="ca-run-result ca-pass">🟢 after the fix: PASSED</span>';
            take.style.visibility = "visible";
            button.textContent = "Test passed ✓";
          }, 1600);
        });
      }
    }
```

- [ ] **Step 3: Verify in browser**

Reload, navigate to the Run scene, click "Run the test ▶️".
Expected: a spinner shows "checking the login…", then briefly "🔴 before the fix: FAILED", then "🟢 after the fix: PASSED"; the takeaway appears and the button reads "Test passed ✓". Console shows no errors.

- [ ] **Step 4: Commit**

```bash
git add js/lessons/coding-agent.js css/lessons/coding-agent.css
git commit -m "feat(lesson): add 'run' scene to coding-agent lesson"
```

---

### Task 6: The Report Back scene (plain-English summary, button flips to working)

**Files:**
- Modify: `js/lessons/coding-agent.js` (add scene after `run`)
- Modify: `css/lessons/coding-agent.css` (add report styles)

- [ ] **Step 1: Add report styles**

Append to `css/lessons/coding-agent.css`:

```css
.ca-report { max-width: 620px; margin: 24px auto 0; padding: 20px 24px; text-align: left; }
.ca-report-who { font-weight: 800; color: var(--muted); margin-bottom: 10px; }
.ca-report-item {
  padding: 10px 0; border-top: 1px solid #efe7db; font-weight: 700;
  opacity: 0; transform: translateY(6px); transition: opacity .3s ease, transform .3s ease;
}
.ca-report-item.ca-show { opacity: 1; transform: none; }
.ca-report-item:first-of-type { border-top: none; }
@media (prefers-reduced-motion: reduce) { .ca-report-item { transition: none; } }
```

- [ ] **Step 2: Add the Report Back scene**

In `js/lessons/coding-agent.js`, add this scene object immediately after the `run` scene (insert a comma after the run scene's closing `}`):

```javascript
    {
      id: "report",
      title: "It Reports Back",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene" style="position:relative">' +
            '<div class="ca-corner-status"><button class="ca-login-btn" id="ca-corner-btn" disabled>🔴 Log in</button></div>' +
            '<p class="label">Step 6 — the hand-off</p>' +
            '<h2>Finally, it tells you what it did.</h2>' +
            '<p class="subtitle">In plain English, like a coworker — so you stay in control.</p>' +
            '<div class="ca-report">' +
              '<div class="ca-report-who">🤖 Assistant</div>' +
              '<div class="ca-report-item">👀 Read your project and found the bug in <strong>login.js</strong>.</div>' +
              '<div class="ca-report-item">✍️ Fixed the line that ignored the typed password.</div>' +
              '<div class="ca-report-item">▶️ Ran the login test — it passes now.</div>' +
              '<div class="ca-report-item">✅ The login button works again.</div>' +
            '</div>' +
            '<div style="margin-top:22px"><button class="btn" id="ca-report-btn">Show me the summary</button></div>' +
          '</div>';

        var items = Array.prototype.slice.call(stage.querySelectorAll(".ca-report-item"));
        var button = stage.querySelector("#ca-report-btn");
        var cornerBtn = stage.querySelector("#ca-corner-btn");

        button.addEventListener("click", function () {
          button.disabled = true;
          button.textContent = "Done ✓";
          var i = 0;
          var timer = setInterval(function () {
            if (i >= items.length) {
              clearInterval(timer);
              cornerBtn.classList.add("ca-working");
              cornerBtn.innerHTML = "🟢 Log in";
              return;
            }
            items[i].classList.add("ca-show");
            i += 1;
          }, 500);
        });
      }
    }
```

- [ ] **Step 3: Verify in browser**

Reload, navigate to the Report Back scene. A red "🔴 Log in" button sits in the top-right corner. Click "Show me the summary".
Expected: the four summary lines appear one at a time; after the last, the corner button turns green ("🟢 Log in") with the working style; the button reads "Done ✓". Console shows no errors.

- [ ] **Step 4: Commit**

```bash
git add js/lessons/coding-agent.js css/lessons/coding-agent.css
git commit -m "feat(lesson): add 'report back' scene to coding-agent lesson"
```

---

### Task 7: The Takeaway scene (recap: read/write/run vs chatbot)

**Files:**
- Modify: `js/lessons/coding-agent.js` (add scene after `report`)
- Modify: `css/lessons/coding-agent.css` (add recap styles)

- [ ] **Step 1: Add recap styles**

Append to `css/lessons/coding-agent.css`:

```css
.ca-recap-board {
  max-width: 720px; margin: 22px auto 0; padding: 22px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.ca-recap-cell { padding: 14px; }
.ca-recap-cell .ca-recap-emoji { font-size: 40px; }
.ca-recap-cell h3 { margin: 8px 0 4px; }
.ca-recap-cell p { font-size: 15px; color: var(--muted); }
.ca-contrast { margin-top: 18px; }
@media (max-width: 720px) { .ca-recap-board { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Add the Takeaway scene**

In `js/lessons/coding-agent.js`, add this scene object immediately after the `report` scene (insert a comma after the report scene's closing `}`):

```javascript
    {
      id: "takeaway",
      title: "What a Coding Agent Is",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">The big idea</p>' +
            '<h2>A coding agent can act on code — not just talk about it.</h2>' +
            '<div class="ca-recap-board">' +
              '<div class="ca-recap-cell"><div class="ca-recap-emoji">👀</div><h3>Read</h3><p>Opens and understands your files.</p></div>' +
              '<div class="ca-recap-cell"><div class="ca-recap-emoji">✍️</div><h3>Write</h3><p>Changes the code itself.</p></div>' +
              '<div class="ca-recap-cell"><div class="ca-recap-emoji">▶️</div><h3>Run</h3><p>Runs it and checks the result.</p></div>' +
            '</div>' +
            '<p class="takeaway ca-contrast">A plain chatbot can only <em>describe</em> a fix. A coding agent can <strong>read, write, and run</strong> the code to actually make it.</p>' +
          '</div>';
      }
    }
```

- [ ] **Step 3: Verify in browser**

Reload, navigate to the final Takeaway scene.
Expected: three cells (👀 Read / ✍️ Write / ▶️ Run) with captions, and the contrast takeaway line below. Progress dots show 7 scenes total; Next is disabled/absent on the last scene. Console shows no errors.

- [ ] **Step 4: Commit**

```bash
git add js/lessons/coding-agent.js css/lessons/coding-agent.css
git commit -m "feat(lesson): add takeaway scene to coding-agent lesson"
```

---

### Task 8: Update README and full walkthrough verification

**Files:**
- Modify: `README.md` (lessons table + project layout)

- [ ] **Step 1: Add the lesson to the README lessons table**

In `README.md`, in the Lessons table (around line 14), add a new row after the Context Window row:

```markdown
| 🤖 **Meet Your Coding Assistant** | What a coding agent actually is: an AI that reads, writes, and runs your code on its own to fix a broken login button. |
```

- [ ] **Step 2: Add the files to the README project layout**

In `README.md`, in the `css/lessons/` block of the project layout, add:

```
    coding-agent.css       Coding-agent lesson styles
```

and in the `js/lessons/` block, add:

```
    coding-agent.js        Meet Your Coding Assistant (7 scenes)
```

- [ ] **Step 3: Full walkthrough verification**

Run `python3 -m http.server 8000`, open <http://localhost:8000>. Open the 🤖 lesson and click all the way through all 7 scenes using **Next →**, then use **← Back** to walk backward, then press **Escape** to return to the hub.
Expected: all 7 scenes render, every interactive button works (re-clicking after navigating back re-runs cleanly since scenes rebuild on each render), progress dots track position, no console errors at any point. Confirm the other four lessons still open and run (no style/JS collisions).

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document the coding-agent lesson"
```

---

## Notes

- **No test runner:** This is a zero-build static site with no automated tests, so every task's verification is a manual browser check. Keep the local server running across tasks to speed up iteration.
- **Re-render safety:** Every scene rebuilds its DOM and re-attaches listeners on each `render(stage)` call (per the existing convention), so per-scene state lives in local variables inside `render`. Do not hoist state to module scope.
- **Class prefixing:** All new CSS classes use the `.ca-` prefix to avoid collisions with other lessons, matching the pattern used by `ctx-`, etc.
- **Emoji rendering:** The source files use real emoji characters (existing files sometimes use `\uXXXX` escapes in strings — either is fine; prefer literal emoji for readability, matching `context.js`).
