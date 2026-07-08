// Core: lesson registry + navigation controller for the AI Concepts Lab.
window.App = window.App || {};

App.lessons = [];

// Each lesson: { id, emoji, title, description, scenes: [ { id, title, render(stage) } ] }
App.registerLesson = function (lesson) {
  App.lessons.push(lesson);
};

(function () {
  var mode = "home";     // "home" | "lesson"
  var lessonIdx = 0;
  var sceneIdx = 0;
  var stage, dotsEl, homeBtn, backBtn, nextBtn;

  function activeLesson() { return App.lessons[lessonIdx]; }

  function renderHome() {
    var cards = App.lessons.map(function (l) {
      return '<button class="lesson-card" data-id="' + l.id + '">' +
               '<div class="lc-emoji">' + (l.emoji || "\ud83d\udcda") + '</div>' +
               '<h3>' + l.title + '</h3>' +
               '<p>' + (l.description || "") + '</p>' +
             '</button>';
    }).join("");
    stage.innerHTML =
      '<div class="scene home">' +
        '<div class="home-mascot">\ud83e\uddea\ud83e\udd16</div>' +
        '<h1>The AI Concepts Lab</h1>' +
        '<p class="subtitle">Pick a lesson to explore.</p>' +
        '<div class="lesson-grid">' + cards + '</div>' +
        '<p class="home-credit">Made by <a href="https://abodesaafan.com" target="_blank" rel="noopener">Abode Saafan</a></p>' +
      '</div>';
    Array.prototype.forEach.call(stage.querySelectorAll(".lesson-card"), function (card) {
      card.addEventListener("click", function () { App.openLesson(card.getAttribute("data-id")); });
    });
  }

  function renderProgress() {
    dotsEl.innerHTML = "";
    if (mode !== "lesson") return;
    activeLesson().scenes.forEach(function (_, i) {
      var d = document.createElement("span");
      d.className = "dot" + (i === sceneIdx ? " active" : "");
      dotsEl.appendChild(d);
    });
  }

  function show() {
    if (mode === "home") {
      renderHome();
      homeBtn.disabled = true;
      backBtn.disabled = true;
      nextBtn.disabled = true;
    } else {
      var lesson = activeLesson();
      sceneIdx = Math.max(0, Math.min(lesson.scenes.length - 1, sceneIdx));
      lesson.scenes[sceneIdx].render(stage);
      homeBtn.disabled = false;
      backBtn.disabled = false; // at scene 0, Back returns home
      nextBtn.disabled = sceneIdx === lesson.scenes.length - 1;
    }
    renderProgress();
  }

  App.openLesson = function (id) {
    for (var i = 0; i < App.lessons.length; i++) {
      if (App.lessons[i].id === id) { lessonIdx = i; break; }
    }
    mode = "lesson";
    sceneIdx = 0;
    show();
  };

  App.goHome = function () { mode = "home"; show(); };

  App.next = function () {
    if (mode !== "lesson") return;
    if (sceneIdx < activeLesson().scenes.length - 1) { sceneIdx++; show(); }
  };

  App.prev = function () {
    if (mode !== "lesson") return;
    if (sceneIdx === 0) { App.goHome(); return; }
    sceneIdx--; show();
  };

  App.init = function () {
    stage = document.getElementById("stage");
    dotsEl = document.getElementById("progress");
    homeBtn = document.getElementById("btn-home");
    backBtn = document.getElementById("btn-back");
    nextBtn = document.getElementById("btn-next");
    homeBtn.addEventListener("click", App.goHome);
    backBtn.addEventListener("click", App.prev);
    nextBtn.addEventListener("click", App.next);
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); App.next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); App.prev(); }
      if (e.key === "Escape") { e.preventDefault(); App.goHome(); }
    });
    show();
  };

  document.addEventListener("DOMContentLoaded", App.init);
})();
