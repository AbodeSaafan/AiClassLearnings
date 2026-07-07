// Returns an <svg> robot. Each interactive part group has:
//   class="rpart" data-part="brain|eyes|hands|memory|goal|loop"
// opts.onPartClick(partKey) is called when a part is clicked (optional).
// opts.bob adds the idle bobbing animation.
App.buildRobot = function (opts) {
  opts = opts || {};
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 300 400");
  svg.setAttribute("class", "robot" + (opts.bob ? " bob" : ""));

  svg.innerHTML =
    // antenna (goal)
    '<g class="rpart" data-part="goal">' +
      '<line x1="150" y1="44" x2="150" y2="18" stroke="var(--loop)" stroke-width="5"/>' +
      '<circle cx="150" cy="12" r="10" fill="var(--goal)"/>' +
    '</g>' +
    // head
    '<rect x="92" y="44" width="116" height="92" rx="20" fill="#fff" stroke="var(--loop)" stroke-width="4"/>' +
    // brain
    '<g class="rpart" data-part="brain"><circle cx="150" cy="74" r="17" fill="var(--brain)"/></g>' +
    // eyes
    '<g class="rpart" data-part="eyes">' +
      '<circle cx="127" cy="104" r="11" fill="var(--eyes)"/>' +
      '<circle cx="173" cy="104" r="11" fill="var(--eyes)"/>' +
    '</g>' +
    // body
    '<rect x="86" y="150" width="128" height="122" rx="18" fill="#fff" stroke="var(--loop)" stroke-width="4"/>' +
    // memory (chest core / "backpack")
    '<g class="rpart" data-part="memory"><rect x="126" y="186" width="48" height="48" rx="10" fill="var(--memory)"/></g>' +
    // arms + hands (tools)
    '<rect x="50" y="154" width="30" height="98" rx="14" fill="#fff" stroke="var(--loop)" stroke-width="4"/>' +
    '<rect x="220" y="154" width="30" height="98" rx="14" fill="#fff" stroke="var(--loop)" stroke-width="4"/>' +
    '<g class="rpart" data-part="hands">' +
      '<circle cx="65" cy="262" r="19" fill="var(--hands)"/>' +
      '<circle cx="235" cy="262" r="19" fill="var(--hands)"/>' +
    '</g>' +
    // legs (loop)
    '<g class="rpart" data-part="loop">' +
      '<rect x="112" y="272" width="26" height="90" rx="12" fill="#fff" stroke="var(--loop)" stroke-width="4"/>' +
      '<rect x="162" y="272" width="26" height="90" rx="12" fill="#fff" stroke="var(--loop)" stroke-width="4"/>' +
      '<rect x="104" y="362" width="44" height="18" rx="7" fill="var(--loop)"/>' +
      '<rect x="152" y="362" width="44" height="18" rx="7" fill="var(--loop)"/>' +
    '</g>';

  if (opts.onPartClick) {
    svg.querySelectorAll(".rpart").forEach(function (g) {
      g.style.cursor = "pointer";
      g.addEventListener("click", function () { opts.onPartClick(g.getAttribute("data-part")); });
    });
  }
  return svg;
};

// Highlight one part (dim the others). Pass null to clear.
App.highlightPart = function (svg, partKey) {
  svg.querySelectorAll(".rpart").forEach(function (g) {
    var on = partKey && g.getAttribute("data-part") === partKey;
    g.classList.toggle("active", !!on);
    g.classList.toggle("dim", !!partKey && !on);
  });
};
