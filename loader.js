/* Loading screen: shows real progress (fonts, images, page load) and hides itself when done. */
(function () {
  "use strict";
  var el = document.getElementById("loader");
  if (!el) return;
  var pctEl = document.getElementById("loaderPct");
  var stEl = document.getElementById("loaderStatus");
  var lit = document.getElementById("loaderReveal");
  var line = document.getElementById("loaderLine");

  var MIN_MS = 1400;   // never flash by faster than this
  var MAX_MS = 8000;   // never block the page longer than this
  var STAGES = [[25, "Booting sensors"], [50, "Calibrating the arm"], [75, "Loading the club"], [99, "Almost ready"]];

  var fontsDone = !(document.fonts && document.fonts.ready);
  var loadDone = document.readyState === "complete";
  if (!fontsDone) document.fonts.ready.then(function () { fontsDone = true; }, function () { fontsDone = true; });
  window.addEventListener("load", function () { loadDone = true; });

  function imgFrac() {
    var list = [].slice.call(document.images).filter(function (im) { return im.loading !== "lazy"; });
    if (!list.length) return 1;
    var ok = list.filter(function (im) { return im.complete; }).length;
    return ok / list.length;
  }
  function target() {
    return 10 + (fontsDone ? 30 : 0) + imgFrac() * 25 + (loadDone ? 35 : 0);
  }

  var start = null, shown = 0, finished = false, stage = "";
  function paint(p) {
    var r = Math.max(0, Math.min(100, p));
    pctEl.textContent = Math.round(r) + "%";
    lit.style.clipPath = "inset(0 " + (100 - r) + "% 0 0)";
    line.style.left = "calc(" + r + "% - 1px)";
    var name = "Online";
    for (var i = 0; i < STAGES.length; i++) if (r < STAGES[i][0] || (i === STAGES.length - 1 && r < 100)) { name = STAGES[i][1]; break; }
    if (r >= 100) name = "Online";
    if (name !== stage) { stage = name; stEl.textContent = name; }
  }
  function finish() {
    if (finished) return;
    finished = true;
    paint(100);
    setTimeout(function () { el.classList.add("done"); }, 350);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1200);
  }
  function frame(now) {
    if (finished) return;
    if (start === null) start = now;
    var spent = now - start;
    var goal = Math.min(spent > MAX_MS ? 100 : target(), Math.min(100, spent / MIN_MS * 100));
    shown += (goal - shown) * 0.12;
    if (goal - shown < 0.3) shown = goal;
    paint(shown);
    if (shown >= 100) finish(); else requestAnimationFrame(frame);
  }
  paint(0);
  requestAnimationFrame(frame);
})();
