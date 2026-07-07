App.registerLesson({
  id: "pipeline",
  emoji: "💬",
  title: "From Message to Answer",
  description: "What actually happens between hitting send and getting the reply.",
  scenes: [
    {
      id: "intro",
      title: "You Hit Send",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene pipe-intro">' +
            '<div class="pipe-hero-emoji">💬✨🤖</div>' +
            '<p class="label">The chatbot journey</p>' +
            '<h1>You hit send. Then what?</h1>' +
            '<p class="subtitle">A response does not pop out all at once. It travels through a fast little pipeline.</p>' +
            '<div class="pipe-message-flow" aria-label="A message moving through the chatbot pipeline">' +
              '<div class="pipe-bubble pipe-bubble-user">Explain the moon in one sentence.</div>' +
              '<div class="pipe-flow-arrow">→</div>' +
              '<div class="pipe-machine">tokens → numbers → prediction loop</div>' +
              '<div class="pipe-flow-arrow">→</div>' +
              '<div class="pipe-bubble pipe-bubble-bot">The moon is Earth\'s natural satellite.</div>' +
            '</div>' +
            '<p class="takeaway">Key idea: the model is not looking up an answer. It is predicting the next piece of text again and again.</p>' +
            '<div class="pipe-controls"><button class="btn" id="pipe-start">Start the trip →</button></div>' +
          '</div>';
        stage.querySelector("#pipe-start").addEventListener("click", function () { App.next(); });
      }
    },
    {
      id: "tokenize",
      title: "Chop Into Tokens",
      render: function (stage) {
        var tokens = ["Explain", " why", " sunflower", "s", " follow", " the", " sun", "."];
        stage.innerHTML =
          '<div class="scene pipe-tokenize">' +
            '<p class="label">Step 1</p>' +
            '<h2>First, the message is chopped into tokens</h2>' +
            '<p class="subtitle">A token is roughly a word, punctuation mark, or word-piece.</p>' +
            '<div class="pipe-demo-card">' +
              '<div class="pipe-sentence" id="pipe-original-sentence">Explain why sunflowers follow the sun.</div>' +
              '<div class="pipe-token-lane" id="pipe-token-lane" aria-live="polite"></div>' +
            '</div>' +
            '<div class="pipe-controls">' +
              '<button class="btn" id="pipe-token-button">✂️ Chop into tokens</button>' +
              '<button class="btn secondary" id="pipe-token-reset">Reset</button>' +
            '</div>' +
            '<p class="takeaway" id="pipe-token-note">Notice that “sunflowers” can become “sunflower” + “s”. Models often read word-pieces, not perfect schoolbook words.</p>' +
          '</div>';

        var lane = stage.querySelector("#pipe-token-lane");
        var button = stage.querySelector("#pipe-token-button");
        var reset = stage.querySelector("#pipe-token-reset");
        var note = stage.querySelector("#pipe-token-note");

        function drawTokens(revealed) {
          lane.innerHTML = tokens.map(function (token, i) {
            var className = "pipe-token" + (revealed ? " pipe-token-revealed" : "");
            var delay = revealed ? ' style="animation-delay:' + (i * 0.07) + 's"' : "";
            return '<span class="' + className + '"' + delay + '>' + token + '</span>';
          }).join("");
          note.style.visibility = revealed ? "visible" : "hidden";
          button.textContent = revealed ? "✅ Tokens revealed" : "✂️ Chop into tokens";
          button.disabled = revealed;
        }

        drawTokens(false);
        button.addEventListener("click", function () { drawTokens(true); });
        reset.addEventListener("click", function () { drawTokens(false); });
      }
    },
    {
      id: "numbers",
      title: "Text Becomes Numbers",
      render: function (stage) {
        var rows = [
          { token: "Explain", nums: "[0.12, -0.40, 0.88, …]", hint: "action word" },
          { token: "sunflower", nums: "[0.77, 0.31, -0.09, …]", hint: "plant idea" },
          { token: "sun", nums: "[0.81, 0.28, 0.45, …]", hint: "nearby meaning" }
        ];
        stage.innerHTML =
          '<div class="scene pipe-numbers">' +
            '<p class="label">Step 2</p>' +
            '<h2>Then tokens become numbers</h2>' +
            '<p class="subtitle">The model does not read letters the way we do. It uses number patterns that place related ideas near each other.</p>' +
            '<div class="pipe-number-grid">' +
              rows.map(function (row) {
                return '<div class="pipe-number-card">' +
                  '<div class="pipe-token pipe-number-token">' + row.token + '</div>' +
                  '<div class="pipe-number-arrow">↓</div>' +
                  '<div class="pipe-vector">' + row.nums + '</div>' +
                  '<div class="pipe-hint">' + row.hint + '</div>' +
                '</div>';
              }).join("") +
            '</div>' +
            '<p class="takeaway">Think of numbers like map coordinates for meaning: not the answer yet, just a form the model can work with.</p>' +
          '</div>';
      }
    },
    {
      id: "predict",
      title: "Predict the Next Token",
      render: function (stage) {
        var steps = [
          {
            before: "The cat sat on the",
            pick: "mat",
            candidates: [
              { token: "mat", pct: 61 },
              { token: "sofa", pct: 22 },
              { token: "roof", pct: 9 },
              { token: "idea", pct: 5 }
            ]
          },
          {
            pick: "because",
            candidates: [
              { token: "because", pct: 38 },
              { token: ".", pct: 31 },
              { token: "while", pct: 17 },
              { token: "under", pct: 8 }
            ]
          },
          {
            pick: "it",
            candidates: [
              { token: "it", pct: 55 },
              { token: "the", pct: 19 },
              { token: "cats", pct: 11 },
              { token: "sunlight", pct: 6 }
            ]
          },
          {
            pick: "was",
            candidates: [
              { token: "was", pct: 64 },
              { token: "felt", pct: 15 },
              { token: "looked", pct: 10 },
              { token: "had", pct: 7 }
            ]
          },
          {
            pick: "warm",
            candidates: [
              { token: "warm", pct: 58 },
              { token: "quiet", pct: 20 },
              { token: "hungry", pct: 12 },
              { token: "blue", pct: 4 }
            ]
          },
          {
            pick: ".",
            candidates: [
              { token: ".", pct: 73 },
              { token: "and", pct: 12 },
              { token: "inside", pct: 8 },
              { token: "today", pct: 3 }
            ]
          }
        ];
        var stepIndex = 0;
        var sentence = steps[0].before;

        stage.innerHTML =
          '<div class="scene pipe-predict">' +
            '<p class="label">Step 3</p>' +
            '<h2>The model predicts one next token</h2>' +
            '<p class="subtitle">At each moment, it compares many possible next pieces and gives each one a probability.</p>' +
            '<div class="pipe-predict-grid">' +
              '<div class="pipe-sentence-panel">' +
                '<div class="label">Current text</div>' +
                '<div class="pipe-live-sentence" id="pipe-live-sentence"></div>' +
                '<div class="pipe-picked" id="pipe-picked">No token picked yet.</div>' +
              '</div>' +
              '<div class="pipe-candidates" id="pipe-candidates"></div>' +
            '</div>' +
            '<div class="pipe-controls">' +
              '<button class="btn" id="pipe-generate-next">Generate next token ▶</button>' +
              '<button class="btn secondary" id="pipe-predict-reset">Reset</button>' +
            '</div>' +
            '<p class="takeaway">This repeating next-token loop is why answers can stream out piece by piece.</p>' +
          '</div>';

        var sentenceEl = stage.querySelector("#pipe-live-sentence");
        var candidatesEl = stage.querySelector("#pipe-candidates");
        var pickedEl = stage.querySelector("#pipe-picked");
        var generateBtn = stage.querySelector("#pipe-generate-next");
        var resetBtn = stage.querySelector("#pipe-predict-reset");

        function addToken(text, token) {
          if (token === "." || token === "," || token === "!" || token === "?") return text + token;
          return text + " " + token;
        }

        function renderCandidates() {
          if (stepIndex >= steps.length) {
            candidatesEl.innerHTML =
              '<div class="pipe-finished">✅ Sentence finished</div>' +
              '<p class="subtitle">The answer is just the history of all the choices made so far.</p>';
            generateBtn.textContent = "✅ Loop complete";
            generateBtn.disabled = true;
            return;
          }
          var current = steps[stepIndex];
          candidatesEl.innerHTML =
            '<div class="label">Possible next tokens</div>' +
            current.candidates.map(function (candidate, i) {
              var chosen = candidate.token === current.pick ? " pipe-candidate-best" : "";
              return '<div class="pipe-candidate' + chosen + '">' +
                '<div class="pipe-candidate-top">' +
                  '<span class="pipe-candidate-token">“' + candidate.token + '”</span>' +
                  '<strong>' + candidate.pct + '%</strong>' +
                '</div>' +
                '<div class="pipe-prob-track"><div class="pipe-prob-fill" style="width:' + candidate.pct + '%"></div></div>' +
                (i === 0 ? '<div class="pipe-small-note">highest in this demo</div>' : '') +
              '</div>';
            }).join("");
          generateBtn.textContent = "Generate next token ▶";
          generateBtn.disabled = false;
        }

        function renderAll() {
          sentenceEl.textContent = sentence;
          renderCandidates();
        }

        generateBtn.addEventListener("click", function () {
          if (stepIndex >= steps.length) return;
          var picked = steps[stepIndex].pick;
          sentence = addToken(sentence, picked);
          pickedEl.textContent = "Picked “" + picked + "”, then asked: what comes next?";
          stepIndex += 1;
          renderAll();
        });

        resetBtn.addEventListener("click", function () {
          stepIndex = 0;
          sentence = steps[0].before;
          pickedEl.textContent = "No token picked yet.";
          renderAll();
        });

        renderAll();
      }
    },
    {
      id: "stream",
      title: "Stream It Back",
      render: function (stage) {
        var pieces = ["The", " moon", " is", " Earth", "'s", " natural", " satellite", ",", " glowing", " because", " it", " reflects", " sunlight", "."];
        var timer = null;
        var index = 0;

        stage.innerHTML =
          '<div class="scene pipe-stream">' +
            '<p class="label">Steps 4 and 5</p>' +
            '<h2>Repeat fast, stitch it together, show the text</h2>' +
            '<p class="subtitle">Each chosen token is added to the answer, then the model predicts again.</p>' +
            '<div class="pipe-phone">' +
              '<div class="pipe-phone-top">Chatbot reply</div>' +
              '<div class="pipe-type-box" id="pipe-type-box" aria-live="polite"></div>' +
              '<div class="pipe-cursor" id="pipe-cursor">▌</div>' +
            '</div>' +
            '<div class="pipe-stream-tokens" id="pipe-stream-tokens"></div>' +
            '<div class="pipe-controls">' +
              '<button class="btn" id="pipe-stream-start">Stream the answer</button>' +
              '<button class="btn secondary" id="pipe-stream-reset">Reset</button>' +
            '</div>' +
            '<p class="takeaway">That “typing” feeling is the prediction loop sending pieces as soon as they are ready.</p>' +
          '</div>';

        var box = stage.querySelector("#pipe-type-box");
        var tokenLane = stage.querySelector("#pipe-stream-tokens");
        var start = stage.querySelector("#pipe-stream-start");
        var reset = stage.querySelector("#pipe-stream-reset");

        function drawTokenLane(activeCount) {
          tokenLane.innerHTML = pieces.map(function (piece, i) {
            var className = "pipe-stream-chip" + (i < activeCount ? " pipe-stream-chip-lit" : "");
            return '<span class="' + className + '">' + piece + '</span>';
          }).join("");
        }

        function resetStream() {
          if (timer) clearInterval(timer);
          timer = null;
          index = 0;
          box.textContent = "";
          start.textContent = "Stream the answer";
          start.disabled = false;
          drawTokenLane(0);
        }

        start.addEventListener("click", function () {
          resetStream();
          start.disabled = true;
          start.textContent = "Streaming…";
          timer = setInterval(function () {
            if (!document.body.contains(box)) {
              clearInterval(timer);
              timer = null;
              return;
            }
            box.textContent += pieces[index];
            index += 1;
            drawTokenLane(index);
            if (index >= pieces.length) {
              clearInterval(timer);
              timer = null;
              start.textContent = "✅ Stream complete";
            }
          }, 220);
        });

        reset.addEventListener("click", resetStream);
        resetStream();
      }
    },
    {
      id: "recap",
      title: "The Big Idea",
      render: function (stage) {
        var cards = [
          { emoji: "✂️", title: "1. Tokenize", text: "Break your message into small text pieces." },
          { emoji: "🔢", title: "2. Numberize", text: "Turn those pieces into number patterns." },
          { emoji: "🎲", title: "3. Predict", text: "Score likely next tokens with probabilities." },
          { emoji: "🔁", title: "4. Repeat", text: "Add one token, then predict the next one." },
          { emoji: "📣", title: "5. Show", text: "Stitch the pieces into readable text for you." }
        ];
        stage.innerHTML =
          '<div class="scene pipe-recap">' +
            '<div class="pipe-hero-emoji">💬➡️🧠➡️✨</div>' +
            '<h2>The whole trick: next-token prediction, very fast</h2>' +
            '<p class="subtitle">A chatbot answer is built one small piece at a time.</p>' +
            '<div class="pipe-recap-grid">' +
              cards.map(function (card) {
                return '<div class="pipe-recap-card">' +
                  '<div class="pipe-recap-emoji">' + card.emoji + '</div>' +
                  '<h3>' + card.title + '</h3>' +
                  '<p>' + card.text + '</p>' +
                '</div>';
              }).join("") +
            '</div>' +
            '<p class="takeaway">Not a lookup. Not magic. A powerful pattern-matcher choosing the next piece of text over and over.</p>' +
            '<div class="pipe-controls"><button class="btn secondary" id="pipe-replay">Replay lesson</button></div>' +
          '</div>';
        stage.querySelector("#pipe-replay").addEventListener("click", function () { App.openLesson("pipeline"); });
      }
    }
  ]
});
