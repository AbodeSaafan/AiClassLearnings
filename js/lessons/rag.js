App.registerLesson({
  id: "rag",
  emoji: "📚",
  title: "RAG: Giving AI a Library",
  description: "How AI looks things up before answering, so it stays accurate and current.",
  scenes: [
    {
      id: "intro",
      title: "What is RAG?",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene rag-intro">' +
            '<p class="label">Retrieval-Augmented Generation</p>' +
            '<h1>RAG gives AI an open book 📚</h1>' +
            '<p class="subtitle">Instead of answering from memory alone, the AI first asks a librarian to fetch the right pages.</p>' +
            '<div class="rag-open-book" aria-label="Open book analogy">' +
              '<div class="rag-book-page">' +
                '<span class="rag-book-emoji">🔎</span>' +
                '<h3>Search</h3>' +
                '<p>Find the best pages.</p>' +
              '</div>' +
              '<div class="rag-book-spine"></div>' +
              '<div class="rag-book-page">' +
                '<span class="rag-book-emoji">✨</span>' +
                '<h3>Answer</h3>' +
                '<p>Use those pages to respond.</p>' +
              '</div>' +
            '</div>' +
            '<p class="takeaway">RAG means: look it up first, then answer.</p>' +
          '</div>';
      }
    },
    {
      id: "closed-book",
      title: "The closed-book problem",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene rag-closed-book-scene">' +
            '<p class="label">Closed-book AI</p>' +
            '<h2>Great language skills… but no company library</h2>' +
            '<div class="rag-question-card">' +
              '<p class="label">Student asks</p>' +
              '<h3>“What is OUR company refund policy?”</h3>' +
            '</div>' +
            '<div class="rag-closed-grid">' +
              '<div class="rag-closed-book" aria-hidden="true">' +
                '<div class="rag-lock">🔒</div>' +
                '<p>Company files are closed</p>' +
              '</div>' +
              '<div class="rag-ai-card" data-rag-answer>' +
                '<div class="rag-ai-face">🤖</div>' +
                '<p class="rag-ai-thinking">The AI tries to be helpful…</p>' +
                '<div class="rag-ai-answer">' +
                  '<p><strong>“Most companies offer refunds within 30 days.”</strong></p>' +
                  '<p class="subtitle">Confident, but it may be wrong for your company.</p>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<button class="btn" type="button" data-rag-reveal>Ask closed-book AI</button>' +
            '<p class="takeaway rag-warning" data-rag-warning>Hallucination risk: it fills gaps with a plausible guess.</p>' +
          '</div>';

        var revealButton = stage.querySelector('[data-rag-reveal]');
        var answerCard = stage.querySelector('[data-rag-answer]');
        var warning = stage.querySelector('[data-rag-warning]');
        warning.hidden = true;
        revealButton.addEventListener('click', function () {
          answerCard.classList.add('rag-show-answer');
          warning.hidden = false;
          revealButton.textContent = 'That was only a guess';
        });
      }
    },
    {
      id: "pipeline",
      title: "How RAG works",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene rag-pipeline-scene">' +
            '<p class="label">The RAG pipeline</p>' +
            '<h2>Question → search → retrieve → add pages → answer</h2>' +
            '<div class="rag-flow" aria-label="RAG steps">' +
              '<div class="rag-flow-step" data-rag-step="0">❓ Question</div>' +
              '<div class="rag-flow-step" data-rag-step="1">🔎 Search</div>' +
              '<div class="rag-flow-step" data-rag-step="2">📄 Retrieve</div>' +
              '<div class="rag-flow-step" data-rag-step="3">🧩 Add to prompt</div>' +
              '<div class="rag-flow-step" data-rag-step="4">✅ Grounded answer</div>' +
            '</div>' +
            '<div class="rag-pipeline-grid">' +
              '<div class="rag-library">' +
                '<p class="label">Knowledge library</p>' +
                '<div class="rag-doc" data-rag-doc data-rag-relevant="yes">' +
                  '<span>📘</span><strong>refund-policy.pdf</strong><small>45-day refunds with receipt</small>' +
                '</div>' +
                '<div class="rag-doc" data-rag-doc>' +
                  '<span>📙</span><strong>shipping-map.pdf</strong><small>Delivery zones</small>' +
                '</div>' +
                '<div class="rag-doc" data-rag-doc data-rag-relevant="yes">' +
                  '<span>📗</span><strong>receipt-rules.pdf</strong><small>Receipt required</small>' +
                '</div>' +
                '<div class="rag-doc" data-rag-doc>' +
                  '<span>📕</span><strong>lunch-menu.pdf</strong><small>Cafeteria tacos</small>' +
                '</div>' +
                '<div class="rag-doc" data-rag-doc data-rag-relevant="yes">' +
                  '<span>📒</span><strong>final-sale-list.pdf</strong><small>Items that cannot return</small>' +
                '</div>' +
              '</div>' +
              '<div class="rag-workspace">' +
                '<p class="rag-status" data-rag-status>Start with the student question.</p>' +
                '<div class="rag-prompt">' +
                  '<p class="label">Prompt sent to AI</p>' +
                  '<p><strong>Question:</strong> What is our refund policy?</p>' +
                  '<div class="rag-snippets" data-rag-snippets>' +
                    '<div class="rag-snippet">refund-policy.pdf: Customers have 45 days with receipt.</div>' +
                    '<div class="rag-snippet">receipt-rules.pdf: Receipt or order number is required.</div>' +
                    '<div class="rag-snippet">final-sale-list.pdf: Final-sale items are excluded.</div>' +
                  '</div>' +
                '</div>' +
                '<div class="rag-answer" data-rag-grounded-answer>' +
                  '<strong>Answer:</strong> You can get a refund within 45 days with a receipt or order number. Final-sale items are excluded. <span class="rag-citation">[from: refund-policy.pdf]</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="rag-actions">' +
              '<button class="btn" type="button" data-rag-pipeline-next>Step through RAG</button>' +
            '</div>' +
            '<p class="takeaway">The “A” in RAG is augment: adding found pages into the AI prompt.</p>' +
          '</div>';

        var step = 0;
        var button = stage.querySelector('[data-rag-pipeline-next]');
        var status = stage.querySelector('[data-rag-status]');
        var snippets = stage.querySelector('[data-rag-snippets]');
        var groundedAnswer = stage.querySelector('[data-rag-grounded-answer]');
        var docs = stage.querySelectorAll('[data-rag-doc]');
        var flowSteps = stage.querySelectorAll('[data-rag-step]');
        var messages = [
          'Start with the student question.',
          'Search the library for pages about refund policy.',
          'Retrieve the closest matching documents.',
          'Add those document snippets into the prompt.',
          'Now the AI answers using the open book.'
        ];

        function updatePipeline() {
          var i;
          status.textContent = messages[step];
          snippets.classList.toggle('rag-snippets-show', step >= 3);
          groundedAnswer.classList.toggle('rag-answer-show', step >= 4);

          for (i = 0; i < docs.length; i++) {
            var isRelevant = docs[i].getAttribute('data-rag-relevant') === 'yes';
            docs[i].classList.toggle('rag-selected', step >= 2 && isRelevant);
            docs[i].classList.toggle('rag-in-prompt', step >= 3 && isRelevant);
            docs[i].classList.toggle('rag-muted-doc', step >= 2 && !isRelevant);
          }

          for (i = 0; i < flowSteps.length; i++) {
            var flowIndex = parseInt(flowSteps[i].getAttribute('data-rag-step'), 10);
            flowSteps[i].classList.toggle('rag-flow-active', flowIndex === step);
            flowSteps[i].classList.toggle('rag-flow-done', flowIndex < step);
          }

          button.textContent = step === messages.length - 1 ? 'Replay pipeline' : 'Next RAG step';
        }

        updatePipeline();
        button.addEventListener('click', function () {
          step = step === messages.length - 1 ? 0 : step + 1;
          updatePipeline();
        });
      }
    },
    {
      id: "comparison",
      title: "Without vs. with RAG",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene rag-comparison-scene">' +
            '<p class="label">Same question, better grounding</p>' +
            '<h2>What changes when the AI gets sources?</h2>' +
            '<button class="btn" type="button" data-rag-compare-reveal>Reveal both answers</button>' +
            '<div class="rag-compare-grid" data-rag-compare-grid>' +
              '<div class="rag-panel rag-without">' +
                '<h3>Without RAG</h3>' +
                '<p class="rag-result">“Refunds are usually available within 30 days.”</p>' +
                '<p class="subtitle">Generic guess • no source • may be outdated</p>' +
              '</div>' +
              '<div class="rag-panel rag-with">' +
                '<h3>With RAG</h3>' +
                '<p class="rag-result">“Our policy gives customers 45 days with a receipt. Final-sale items are excluded.” <span class="rag-citation">[from: refund-policy.pdf]</span></p>' +
                '<p class="subtitle">Specific answer • uses current docs • cites the source</p>' +
              '</div>' +
            '</div>' +
            '<p class="takeaway">RAG does not make AI perfect, but it gives the answer something real to stand on.</p>' +
          '</div>';

        var revealButton = stage.querySelector('[data-rag-compare-reveal]');
        var grid = stage.querySelector('[data-rag-compare-grid]');
        revealButton.addEventListener('click', function () {
          grid.classList.add('rag-compare-revealed');
          revealButton.textContent = 'Sources make the difference';
        });
      }
    },
    {
      id: "good-fit",
      title: "When to use RAG",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene rag-good-fit-scene">' +
            '<p class="label">Best use cases</p>' +
            '<h2>Use RAG when facts live outside the AI</h2>' +
            '<p class="subtitle">Click to reveal the moments where an open book helps most.</p>' +
            '<div class="rag-use-grid">' +
              '<div class="rag-use-card" data-rag-use-card><span class="rag-use-icon">🏢</span><h3>Private</h3><p>Company policies, internal guides, team notes.</p></div>' +
              '<div class="rag-use-card" data-rag-use-card><span class="rag-use-icon">🕒</span><h3>Current</h3><p>News, prices, schedules, product updates.</p></div>' +
              '<div class="rag-use-card" data-rag-use-card><span class="rag-use-icon">🔁</span><h3>Changing</h3><p>Rules that update often and need the latest version.</p></div>' +
              '<div class="rag-use-card" data-rag-use-card><span class="rag-use-icon">🔖</span><h3>Needs proof</h3><p>Answers where people should see the source.</p></div>' +
            '</div>' +
            '<button class="btn" type="button" data-rag-use-next>Show a RAG moment</button>' +
            '<p class="takeaway">RAG is strongest when “just ask the model” is not enough.</p>' +
          '</div>';

        var count = 0;
        var button = stage.querySelector('[data-rag-use-next]');
        var cards = stage.querySelectorAll('[data-rag-use-card]');

        function updateCards() {
          for (var i = 0; i < cards.length; i++) {
            cards[i].classList.toggle('rag-use-visible', i < count);
          }
          button.textContent = count === cards.length ? 'Show again' : 'Show a RAG moment';
        }

        updateCards();
        button.addEventListener('click', function () {
          count = count === cards.length ? 0 : count + 1;
          updateCards();
        });
      }
    },
    {
      id: "recap",
      title: "The RAG recipe",
      render: function (stage) {
        stage.innerHTML =
          '<div class="scene rag-recap-scene">' +
            '<p class="label">Recap</p>' +
            '<h2>RAG is a librarian for AI</h2>' +
            '<div class="rag-recipe" aria-label="RAG recipe">' +
              '<div class="rag-recipe-step">❓<strong>Ask</strong></div>' +
              '<div class="rag-arrow">→</div>' +
              '<div class="rag-recipe-step">🔎<strong>Search</strong></div>' +
              '<div class="rag-arrow">→</div>' +
              '<div class="rag-recipe-step">📄<strong>Read</strong></div>' +
              '<div class="rag-arrow">→</div>' +
              '<div class="rag-recipe-step">✅<strong>Answer</strong></div>' +
            '</div>' +
            '<button class="btn" type="button" data-rag-check-next>Run the librarian checklist</button>' +
            '<div class="rag-checklist">' +
              '<p class="rag-check" data-rag-check>Find the most relevant sources.</p>' +
              '<p class="rag-check" data-rag-check>Add those sources to the prompt.</p>' +
              '<p class="rag-check" data-rag-check>Answer with citations when possible.</p>' +
            '</div>' +
            '<p class="takeaway">Closed-book AI guesses. Open-book AI can point to the page.</p>' +
          '</div>';

        var checklistCount = 0;
        var button = stage.querySelector('[data-rag-check-next]');
        var checks = stage.querySelectorAll('[data-rag-check]');

        function updateChecklist() {
          for (var i = 0; i < checks.length; i++) {
            checks[i].classList.toggle('rag-check-visible', i < checklistCount);
          }
          button.textContent = checklistCount === checks.length ? 'Reset checklist' : 'Run the librarian checklist';
        }

        updateChecklist();
        button.addEventListener('click', function () {
          checklistCount = checklistCount === checks.length ? 0 : checklistCount + 1;
          updateChecklist();
        });
      }
    }
  ]
});
