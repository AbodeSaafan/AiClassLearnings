App.registerLesson({
  id: "context",
  emoji: "🪟",
  title: "The Context Window",
  description: "The AI's short-term memory: what it can 'see' at once, and why it forgets.",
  scenes: [
    {
      id: "intro",
      title: "Does AI Remember?",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene ctx-intro">' +
            '<div class="ctx-hero-emoji">🪟🧠</div>' +
            '<p class="label">Big surprise</p>' +
            '<h1>Does AI remember you?</h1>' +
            '<p class="subtitle">It can feel like a chatbot remembers everything. But each reply starts with a quick re-read of one limited workspace.</p>' +
            '<button class="btn" id="ctx-surprise-btn">Reveal the trick</button>' +
            '<div class="ctx-reveal-card" id="ctx-surprise-card" hidden>' +
              '<h3>It does not look back at every conversation forever.</h3>' +
              '<p>It answers from what fits in its <strong>context window</strong> right now: instructions, your latest prompt, and the recent chat.</p>' +
            '</div>' +
          '</div>';

        var button = stage.querySelector("#ctx-surprise-btn");
        var card = stage.querySelector("#ctx-surprise-card");
        button.addEventListener("click", function () {
          card.hidden = false;
          button.textContent = "That workspace is the context window";
        });
      }
    },
    {
      id: "whiteboard",
      title: "The Whiteboard",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Fixed-size workspace</p>' +
            '<h2>Picture a classroom whiteboard.</h2>' +
            '<p class="subtitle">The AI can only use the notes currently on the board.</p>' +
            '<div class="ctx-board-wrap">' +
              '<div class="ctx-board">' +
                '<div class="ctx-board-row ctx-system"><span>📌 System instructions</span><strong>22 tokens</strong></div>' +
                '<div class="ctx-board-row ctx-prompt"><span>🙋 Your newest prompt</span><strong>18 tokens</strong></div>' +
                '<div class="ctx-board-row ctx-chat"><span>💬 Recent conversation</span><strong>31 tokens</strong></div>' +
                '<div class="ctx-meter" aria-label="Context window capacity">' +
                  '<div class="ctx-meter-fill" style="width:71%"></div>' +
                  '<span>71 / 100 token spaces used</span>' +
                '</div>' +
              '</div>' +
              '<div class="ctx-side-note">' +
                '<div class="ctx-side-emoji">🧩</div>' +
                '<h3>Tokens = word-pieces</h3>' +
                '<p>We will use pretend token counts today. The idea is what matters: every note takes up space.</p>' +
                '<button class="btn secondary" id="ctx-token-btn">Show word-pieces</button>' +
              '</div>' +
            '</div>' +
            '<div class="ctx-token-demo" id="ctx-token-demo" hidden>' +
              '<span>“remembering” might become</span>' +
              '<b>re</b><b>member</b><b>ing</b>' +
            '</div>' +
          '</div>';

        var tokenButton = stage.querySelector("#ctx-token-btn");
        var tokenDemo = stage.querySelector("#ctx-token-demo");
        tokenButton.addEventListener("click", function () {
          tokenDemo.hidden = false;
          tokenButton.textContent = "Tiny pieces still take space";
        });
      }
    },
    {
      id: "filling",
      title: "Filling Up",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Instructor demo</p>' +
            '<h2>Keep adding messages. Watch what falls off.</h2>' +
            '<p class="subtitle">The board has room for 100 pretend tokens. Oldest notes leave first.</p>' +
            '<div class="ctx-demo-grid">' +
              '<section class="ctx-live-window">' +
                '<div class="ctx-window-head">' +
                  '<span>🪟 In the context window</span>' +
                  '<strong id="ctx-token-count">24 / 100</strong>' +
                '</div>' +
                '<div class="ctx-meter ctx-demo-meter"><div class="ctx-meter-fill" id="ctx-demo-fill" style="width:24%"></div><span id="ctx-meter-label">System notes are already on the board</span></div>' +
                '<div class="ctx-sticky-list" id="ctx-sticky-list"></div>' +
              '</section>' +
              '<aside class="ctx-forgotten-panel">' +
                '<div class="ctx-window-head"><span>🧽 Erased / forgotten</span><strong id="ctx-forgotten-count">0</strong></div>' +
                '<div class="ctx-forgotten-list" id="ctx-forgotten-list"><p class="subtitle">Nothing yet.</p></div>' +
              '</aside>' +
            '</div>' +
            '<div class="ctx-controls">' +
              '<button class="btn" id="ctx-add-message">Add the next message</button>' +
              '<button class="btn secondary" id="ctx-reset-demo">Reset demo</button>' +
            '</div>' +
            '<p class="takeaway ctx-demo-status" id="ctx-demo-status">Start with the system instructions: 24 token spaces are already used.</p>' +
          '</div>';

        var capacity = 100;
        var systemTokens = 24;
        var nextIndex = 0;
        var visible = [];
        var forgotten = [];
        var lastDropped = [];
        var messages = [
          { text: "Use a friendly, beginner tone.", tokens: 12 },
          { text: "My project is a garden club website.", tokens: 16 },
          { text: "The home page should welcome first-time gardeners.", tokens: 18 },
          { text: "Here is a long plant list with dates, prices, and notes.", tokens: 30 },
          { text: "Now write an email inviting neighbors to join.", tokens: 15 },
          { text: "Also include last year's schedule and volunteer roles.", tokens: 27 },
          { text: "Can you revise it without mentioning beginners?", tokens: 14 }
        ];

        var countEl = stage.querySelector("#ctx-token-count");
        var fillEl = stage.querySelector("#ctx-demo-fill");
        var labelEl = stage.querySelector("#ctx-meter-label");
        var stickyList = stage.querySelector("#ctx-sticky-list");
        var forgottenList = stage.querySelector("#ctx-forgotten-list");
        var forgottenCount = stage.querySelector("#ctx-forgotten-count");
        var addButton = stage.querySelector("#ctx-add-message");
        var resetButton = stage.querySelector("#ctx-reset-demo");
        var statusEl = stage.querySelector("#ctx-demo-status");

        function totalVisibleTokens() {
          var total = systemTokens;
          visible.forEach(function (message) { total += message.tokens; });
          return total;
        }

        function messageCard(message, index, dropped) {
          return '<div class="ctx-message-card' + (dropped ? ' ctx-dropped' : '') + '">' +
            '<span class="ctx-message-number">' + (index + 1) + '</span>' +
            '<p>' + message.text + '</p>' +
            '<strong>' + message.tokens + ' tokens</strong>' +
          '</div>';
        }

        function draw() {
          var total = totalVisibleTokens();
          lastDropped = [];
          while (total > capacity && visible.length > 0) {
            var removed = visible.shift();
            forgotten.unshift(removed);
            lastDropped.push(removed);
            total -= removed.tokens;
          }

          countEl.textContent = total + " / " + capacity;
          fillEl.style.width = Math.min(100, total) + "%";
          labelEl.textContent = total < capacity ? "Still room on the board" : "The board is full";

          var stickyHtml = '<div class="ctx-system-sticky"><span>📌 System instructions</span><strong>' + systemTokens + ' tokens</strong></div>';
          if (visible.length === 0) {
            stickyHtml += '<p class="subtitle">Click the button to add conversation notes.</p>';
          } else {
            stickyHtml += visible.map(function (message, index) {
              return messageCard(message, index, false);
            }).join("");
          }
          stickyList.innerHTML = stickyHtml;

          forgottenCount.textContent = String(forgotten.length);
          if (forgotten.length === 0) {
            forgottenList.innerHTML = '<p class="subtitle">Nothing yet.</p>';
          } else {
            forgottenList.innerHTML = forgotten.map(function (message, index) {
              var isNew = lastDropped.indexOf(message) !== -1;
              return messageCard(message, index, isNew);
            }).join("");
          }

          addButton.disabled = nextIndex >= messages.length;
          if (nextIndex >= messages.length) addButton.textContent = "All example messages added";
          if (lastDropped.length > 0) {
            statusEl.innerHTML = "Oldest note erased: <strong>“" + lastDropped.map(function (m) { return m.text; }).join("” and “") + "”</strong>";
          } else if (visible.length === 0) {
            statusEl.textContent = "Start with the system instructions: 24 token spaces are already used.";
          } else {
            statusEl.textContent = "The AI can still use every note currently shown in the window.";
          }
        }

        addButton.addEventListener("click", function () {
          if (nextIndex >= messages.length) return;
          visible.push(messages[nextIndex]);
          nextIndex += 1;
          draw();
        });

        resetButton.addEventListener("click", function () {
          nextIndex = 0;
          visible = [];
          forgotten = [];
          lastDropped = [];
          addButton.textContent = "Add the next message";
          draw();
        });

        draw();
      }
    },
    {
      id: "consequences",
      title: "What This Explains",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Real-world consequences</p>' +
            '<h2>When the old note is gone, the AI cannot use it.</h2>' +
            '<p class="subtitle">Click through three moments students often notice in long chats.</p>' +
            '<div class="ctx-consequence-card" id="ctx-consequence-card">' +
              '<div class="ctx-card-emoji">🤔</div>' +
              '<h3>What might happen?</h3>' +
              '<p>Reveal an example.</p>' +
            '</div>' +
            '<button class="btn" id="ctx-next-example">Reveal example</button>' +
          '</div>';

        var examples = [
          {
            emoji: "🧭",
            title: "An early instruction disappears",
            before: "Start of chat: “Explain this for beginners.”",
            after: "Much later: it may slip into expert language because that note fell out."
          },
          {
            emoji: "📄",
            title: "A huge pasted document crowds the board",
            before: "You paste pages and pages at once.",
            after: "The newest pages may push older details out of view."
          },
          {
            emoji: "🔁",
            title: "It contradicts something from long ago",
            before: "Earlier: “Never mention price.”",
            after: "Later: it might mention price if that rule is no longer visible."
          }
        ];
        var index = -1;
        var card = stage.querySelector("#ctx-consequence-card");
        var button = stage.querySelector("#ctx-next-example");

        button.addEventListener("click", function () {
          index = (index + 1) % examples.length;
          var item = examples[index];
          card.innerHTML =
            '<div class="ctx-card-emoji">' + item.emoji + '</div>' +
            '<h3>' + item.title + '</h3>' +
            '<div class="ctx-before-after">' +
              '<div><span class="label">Earlier</span><p>' + item.before + '</p></div>' +
              '<div><span class="label">Later</span><p>' + item.after + '</p></div>' +
            '</div>';
          button.textContent = index === examples.length - 1 ? "Start examples again" : "Next example";
        });
      }
    },
    {
      id: "strategies",
      title: "How To Help",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Coping strategies</p>' +
            '<h2>Keep the important notes fresh.</h2>' +
            '<p class="subtitle">Bigger context windows help, but no board is infinite.</p>' +
            '<div class="ctx-strategy-grid" id="ctx-strategy-grid"></div>' +
            '<button class="btn" id="ctx-reveal-strategy">Reveal a helpful move</button>' +
            '<p class="takeaway ctx-strategy-note">A short recap can be more useful than a very long messy chat.</p>' +
          '</div>';

        var strategies = [
          { emoji: "🧾", title: "Summarize", text: "Paste a short recap of goals, decisions, names, and rules near the end." },
          { emoji: "📌", title: "Repeat must-remember details", text: "If it matters for the next answer, put it in the newest prompt." },
          { emoji: "🌱", title: "Start fresh when needed", text: "A new chat plus a clean summary can beat dragging a crowded chat forward." },
          { emoji: "🪟", title: "Use bigger windows wisely", text: "More space helps with long documents, but it is still a limited space." }
        ];
        var revealed = 0;
        var grid = stage.querySelector("#ctx-strategy-grid");
        var button = stage.querySelector("#ctx-reveal-strategy");

        function drawStrategies() {
          grid.innerHTML = strategies.map(function (item, index) {
            if (index >= revealed) {
              return '<div class="ctx-strategy-card ctx-locked"><div class="ctx-card-emoji">❔</div><h3>Hidden move</h3><p>Click to reveal.</p></div>';
            }
            return '<div class="ctx-strategy-card"><div class="ctx-card-emoji">' + item.emoji + '</div><h3>' + item.title + '</h3><p>' + item.text + '</p></div>';
          }).join("");
          button.disabled = revealed >= strategies.length;
          button.textContent = revealed >= strategies.length ? "All moves revealed" : "Reveal a helpful move";
        }

        button.addEventListener("click", function () {
          if (revealed < strategies.length) {
            revealed += 1;
            drawStrategies();
          }
        });

        drawStrategies();
      }
    },
    {
      id: "recap",
      title: "One-Breath Recap",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene">' +
            '<p class="label">Check for understanding</p>' +
            '<h2>The context window is the AI\'s short-term memory.</h2>' +
            '<div class="ctx-recap-board">' +
              '<div>👀 It sees what fits now.</div>' +
              '<div>🧽 Oldest notes can fall out.</div>' +
              '<div>🧾 Summaries save space.</div>' +
            '</div>' +
            '<p class="takeaway">If the AI seems to forget, bring the important detail back into the window.</p>' +
            '<div class="ctx-quiz">' +
              '<h3>Class check: what helps most in a very long chat?</h3>' +
              '<button class="ctx-answer" data-correct="no">Keep arguing in the same crowded chat</button>' +
              '<button class="ctx-answer" data-correct="yes">Paste a short summary of the key details</button>' +
              '<button class="ctx-answer" data-correct="no">Assume it remembers from last week</button>' +
              '<p class="ctx-feedback" id="ctx-feedback">Choose an answer.</p>' +
            '</div>' +
          '</div>';

        var feedback = stage.querySelector("#ctx-feedback");
        Array.prototype.forEach.call(stage.querySelectorAll(".ctx-answer"), function (answer) {
          answer.addEventListener("click", function () {
            var correct = answer.getAttribute("data-correct") === "yes";
            Array.prototype.forEach.call(stage.querySelectorAll(".ctx-answer"), function (other) {
              other.classList.remove("ctx-correct", "ctx-wrong");
            });
            answer.classList.add(correct ? "ctx-correct" : "ctx-wrong");
            feedback.textContent = correct ? "Yes — a compact summary puts the right notes back on the board." : "Not quite. The fix is to make the important details visible again.";
          });
        });
      }
    }
  ]
});
