App.workflow = {
  // Builds an assembly line into `container`. Returns an API {run, reset, jam}.
  build: function (container, stations) {
    container.innerHTML =
      '<div class="belt">' +
        '<div class="stations">' +
          stations.map(function (s, i) {
            return '<div class="station" data-i="' + i + '"><span class="station-num">' +
                   (i + 1) + '</span>' + s + '</div>';
          }).join('') +
        '</div>' +
        '<div class="belt-track"><div class="item" id="wf-item">\ud83c\udfac</div></div>' +
      '</div>';

    var item = container.querySelector("#wf-item");
    var stationEls = container.querySelectorAll(".station");
    var n = stations.length;
    var timers = [];

    function positionAt(i) {
      // Spread the item across the belt to sit under station i.
      var pct = n <= 1 ? 0 : (i / (n - 1)) * 100;
      item.style.left = pct + "%";
    }

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    return {
      reset: function () {
        clearTimers();
        stationEls.forEach(function (e) { e.classList.remove("done", "jam"); });
        item.classList.remove("jammed");
        item.textContent = "\ud83c\udfac";
        positionAt(0);
      },
      run: function (done) {
        clearTimers();
        var i = 0;
        (function stepThrough() {
          if (i >= n) { if (done) done(); return; }
          positionAt(i);
          stationEls[i].classList.add("done");
          i++;
          timers.push(setTimeout(stepThrough, 900));
        })();
      },
      jam: function () {
        // Highlight the last station as jammed and shake the item.
        var last = stationEls[stationEls.length - 1];
        if (last) last.classList.add("jam");
        item.classList.add("jammed");
      }
    };
  }
};
