(function () {
  var current = 0;
  var stage, dotsEl, backBtn, nextBtn;

  function renderProgress() {
    dotsEl.innerHTML = "";
    App.scenes.forEach(function (_, i) {
      var d = document.createElement("span");
      d.className = "dot" + (i === current ? " active" : "");
      dotsEl.appendChild(d);
    });
  }

  function show(i) {
    current = Math.max(0, Math.min(App.scenes.length - 1, i));
    App.scenes[current].render(stage);
    backBtn.disabled = current === 0;
    nextBtn.disabled = current === App.scenes.length - 1;
    renderProgress();
  }

  App.next = function () { show(current + 1); };
  App.prev = function () { show(current - 1); };
  App.goTo = function (i) { show(i); };

  App.init = function () {
    stage = document.getElementById("stage");
    dotsEl = document.getElementById("progress");
    backBtn = document.getElementById("btn-back");
    nextBtn = document.getElementById("btn-next");
    backBtn.addEventListener("click", App.prev);
    nextBtn.addEventListener("click", App.next);
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); App.next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); App.prev(); }
    });
    show(0);
  };

  document.addEventListener("DOMContentLoaded", App.init);
})();
