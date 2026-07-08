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
    }
  ]
});
