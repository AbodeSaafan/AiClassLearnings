App.registerLesson({
  id: "workflows-vs-agents",
  emoji: "\ud83c\udfed",
  title: "AI Workflows vs. Agents",
  description: "A factory tour: fixed assembly lines versus a robot that decides for itself.",
  scenes: [

  // 1. HOOK / TITLE
  {
    id: "hook",
    title: "Hook",
    render: function (stage) {
      var c = App.data.scenesCopy.hook;
      stage.innerHTML =
        '<div class="scene factory-bg">' +
          '<div class="factory-sky"></div>' +
          '<div style="font-size:64px">\ud83c\udfed\ud83e\udd16</div>' +
          '<h1>' + c.heading + '</h1>' +
          '<p class="subtitle">' + c.sub + '</p>' +
          '<div style="margin-top:28px"><button class="btn" id="hook-cta">' + c.cta + ' \u2192</button></div>' +
        '</div>';
      stage.querySelector("#hook-cta").addEventListener("click", App.next);
    }
  },

  // 2. THE ASSEMBLY LINE (WORKFLOW)
  {
    id: "workflow",
    title: "Assembly Line",
    render: function (stage) {
      var c = App.data.scenesCopy.workflow;
      stage.innerHTML =
        '<div class="scene factory-bg">' +
          '<h2>' + c.heading + '</h2>' +
          '<p class="subtitle">' + c.sub + '</p>' +
          '<div id="wf-line" style="margin:26px 0"></div>' +
          '<button class="btn" id="wf-run">\u25b6 Run the line</button>' +
          '<p class="takeaway" id="wf-take" style="visibility:hidden;margin-top:18px">' + c.takeaway + '</p>' +
        '</div>';
      var api = App.workflow.build(stage.querySelector("#wf-line"), c.stations);
      api.reset();
      stage.querySelector("#wf-run").addEventListener("click", function () {
        api.reset();
        api.run(function () { stage.querySelector("#wf-take").style.visibility = "visible"; });
      });
    }
  },

  // 3. MEET THE ROBOT (AGENT)
  {
    id: "agentIntro",
    title: "Meet the Robot",
    render: function (stage) {
      var c = App.data.scenesCopy.agentIntro;
      stage.innerHTML =
        '<div class="scene factory-bg">' +
          '<h2>' + c.heading + '</h2>' +
          '<p class="subtitle">' + c.sub + '</p>' +
          '<div><span class="speech">' + c.speech + '</span></div>' +
          '<div id="intro-robot"></div>' +
        '</div>';
      stage.querySelector("#intro-robot").appendChild(App.buildRobot({ bob: true }));
    }
  },

  // 4. ROBOT ANATOMY (INTERACTIVE)
  {
    id: "anatomy",
    title: "Anatomy",
    render: function (stage) {
      var c = App.data.scenesCopy.anatomy;
      stage.innerHTML =
        '<div class="scene">' +
          '<h2>' + c.heading + '</h2>' +
          '<p class="subtitle">' + c.sub + '</p>' +
          '<div class="anatomy-grid">' +
            '<div id="anat-robot"></div>' +
            '<aside class="part-panel" id="part-panel">' +
              '<div class="part-hint">\ud83d\udc48 Tap a body part to learn what it is</div>' +
            '</aside>' +
          '</div>' +
          '<div class="part-chips" id="part-chips"></div>' +
        '</div>';

      var panel = stage.querySelector("#part-panel");
      var svg = App.buildRobot({ onPartClick: select });
      stage.querySelector("#anat-robot").appendChild(svg);

      function findPart(key) {
        return App.data.robotParts.filter(function (p) { return p.key === key; })[0];
      }
      function select(key) {
        var p = findPart(key);
        App.highlightPart(svg, key);
        panel.innerHTML =
          '<div class="part-emoji">' + p.emoji + '</div>' +
          '<div class="label">' + p.part + '</div>' +
          '<h3>' + p.concept + '</h3>' +
          '<p>' + p.blurb + '</p>' +
          '<p class="movie-note">\ud83c\udfac ' + p.movie + '</p>';
        Array.prototype.forEach.call(stage.querySelectorAll(".chip"), function (ch) {
          ch.classList.toggle("active", ch.getAttribute("data-key") === key);
        });
      }

      // Clickable chips mirror the parts (helps discoverability + touch).
      var chips = stage.querySelector("#part-chips");
      App.data.robotParts.forEach(function (p) {
        var b = document.createElement("button");
        b.className = "chip";
        b.setAttribute("data-key", p.key);
        b.innerHTML = p.emoji + " " + p.part;
        b.addEventListener("click", function () { select(p.key); });
        chips.appendChild(b);
      });
    }
  },

  // 5. THE LOOP IN ACTION
  {
    id: "loop",
    title: "The Loop",
    render: function (stage) {
      var c = App.data.scenesCopy.loop;
      stage.innerHTML =
        '<div class="scene">' +
          '<h2>' + c.heading + '</h2>' +
          '<p class="subtitle">' + c.sub + '</p>' +
          '<div class="goal-banner" id="loop-goal"></div>' +
          '<div class="loop-grid">' +
            '<div id="loop-robot"></div>' +
            '<div class="loop-log" id="loop-log"></div>' +
          '</div>' +
          '<div class="loop-controls">' +
            '<button class="btn" id="loop-step">Next step \u25b6</button>' +
            '<button class="btn secondary" id="loop-reset">\u21ba Reset</button>' +
          '</div>' +
        '</div>';
      var svg = App.buildRobot({});
      stage.querySelector("#loop-robot").appendChild(svg);
      var api = App.agentLoop.build({
        svg: svg,
        logEl: stage.querySelector("#loop-log"),
        goalEl: stage.querySelector("#loop-goal")
      });
      api.reset();
      var stepBtn = stage.querySelector("#loop-step");
      stepBtn.addEventListener("click", function () {
        var more = api.next();
        if (!more) stepBtn.textContent = "\u2705 Goal reached";
      });
      stage.querySelector("#loop-reset").addEventListener("click", function () {
        api.reset();
        stepBtn.textContent = "Next step \u25b6";
      });
    }
  },

  // 6. SIDE-BY-SIDE COMPARISON
  {
    id: "compare",
    title: "Side-by-Side",
    render: function (stage) {
      var c = App.data.scenesCopy.compare;
      var m = App.data.movieNight;
      stage.innerHTML =
        '<div class="scene">' +
          '<h2>' + c.heading + '</h2>' +
          '<p class="subtitle">' + c.sub + '</p>' +
          '<div class="vs-grid">' +
            '<div class="vs-card"><div class="vs-head">\ud83c\udfed Assembly Line (Workflow)</div>' +
              '<ul id="vs-line">' + m.assemblyOutput.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul>' +
              '<div class="vs-result" id="vs-line-res"></div></div>' +
            '<div class="vs-card"><div class="vs-head">\ud83e\udd16 Robot (Agent)</div>' +
              '<ul id="vs-agent"><li>Given the goal, decides its own steps</li></ul>' +
              '<div class="vs-result" id="vs-agent-res"></div></div>' +
          '</div>' +
          '<div><span class="twist" id="twist" style="visibility:hidden">' + m.twist + '</span></div>' +
          '<button class="btn" id="vs-twist">\ud83d\ude2e Throw a curveball</button>' +
        '</div>';
      stage.querySelector("#vs-twist").addEventListener("click", function () {
        stage.querySelector("#twist").style.visibility = "visible";
        var lineRes = stage.querySelector("#vs-line-res");
        var agentRes = stage.querySelector("#vs-agent-res");
        lineRes.textContent = m.assemblyResult;
        lineRes.className = "vs-result bad";
        agentRes.textContent = m.agentResult;
        agentRes.className = "vs-result good";
        stage.querySelector(".vs-grid").children[0].classList.add("jammed");
      });
    }
  },

  // 7. WHEN TO USE WHICH
  {
    id: "when",
    title: "When to Use Which",
    render: function (stage) {
      var c = App.data.scenesCopy.when;
      var w = App.data.whenToUse;
      function list(arr) { return "<ul>" + arr.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
      stage.innerHTML =
        '<div class="scene">' +
          '<h2>' + c.heading + '</h2>' +
          '<p class="subtitle">' + c.sub + '</p>' +
          '<div class="when-grid">' +
            '<div class="when-card line"><div class="vs-head">\ud83c\udfed Use a Workflow when\u2026</div>' + list(w.workflow) + '</div>' +
            '<div class="when-card bot"><div class="vs-head">\ud83e\udd16 Use an Agent when\u2026</div>' + list(w.agent) + '</div>' +
          '</div>' +
          '<p class="recap">Same brain (the LLM) \u2014 the difference is <strong>who decides the steps</strong>: the developer (workflow) or the AI itself (agent).</p>' +
        '</div>';
    }
  }

  ]
});
