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
