(function() {
  const loader = document.getElementById('loader');
  const loaderReveal = document.getElementById('loaderReveal');
  const loaderLine = document.getElementById('loaderLine');
  const loaderPct = document.getElementById('loaderPct');
  const loaderStatus = document.getElementById('loaderStatus');

  if (!loader) return;

  const statuses = [
    "Initializing neural core...",
    "Calibrating servo controllers...",
    "Loading AI weights...",
    "Establishing telemetry...",
    "System online."
  ];

  let progress = 0;
  const startTime = performance.now();
  const minMs = 900;
  const maxMs = 2500;

  function updateLoader(now) {
    const elapsed = now - startTime;
    progress = Math.min(100, Math.floor((elapsed / minMs) * 100));

    if (loaderPct) loaderPct.innerText = progress + '%';
    if (loaderReveal) loaderReveal.style.clipPath = `inset(0 ${100 - progress}% 0 0)`;
    if (loaderLine) loaderLine.style.left = progress + '%';

    let statusIdx = Math.min(statuses.length - 1, Math.floor((progress / 100) * statuses.length));
    if (loaderStatus) loaderStatus.innerText = statuses[statusIdx];

    if (progress < 100 && elapsed < maxMs) {
      requestAnimationFrame(updateLoader);
    } else {
      if (loaderPct) loaderPct.innerText = '100%';
      if (loaderReveal) loaderReveal.style.clipPath = 'inset(0 0 0 0)';
      if (loaderLine) loaderLine.style.left = '100%';
      setTimeout(() => {
        loader.classList.add('done');
      }, 300);
    }
  }

  requestAnimationFrame(updateLoader);
})();
