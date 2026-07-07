App.agentLoop = {
  // Renders a step-through loop panel. Returns api: {next, reset, done}
  build: function (opts) {
    var steps = App.data.movieNight.loopSteps;
    var svg = opts.svg;          // robot to highlight
    var logEl = opts.logEl;      // where think/act/observe lines append
    var goalEl = opts.goalEl;    // goal banner
    var idx = -1;

    goalEl.textContent = "\ud83c\udfaf Goal: " + App.data.movieNight.goal;

    function renderStep(s) {
      App.highlightPart(svg, s.part);
      var html = '<div class="loop-step">';
      if (s.think)   html += '<div class="ls think">\ud83e\udde0 ' + s.think + '</div>';
      if (s.act)     html += '<div class="ls act">\u270b ' + s.act + '</div>';
      if (s.observe) html += '<div class="ls obs">\ud83d\udc40 ' + s.observe + '</div>';
      html += '</div>';
      logEl.insertAdjacentHTML("beforeend", html);
      logEl.scrollTop = logEl.scrollHeight;
    }

    return {
      reset: function () { idx = -1; logEl.innerHTML = ""; App.highlightPart(svg, null); },
      next: function () {
        if (idx >= steps.length - 1) return false;
        idx++; renderStep(steps[idx]);
        return idx < steps.length - 1;
      },
      done: function () { return idx >= steps.length - 1; }
    };
  }
};
