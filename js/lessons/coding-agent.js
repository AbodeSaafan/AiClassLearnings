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
    },
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
    },
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
  ]
});
