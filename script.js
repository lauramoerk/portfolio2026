(() => {
  const track = document.getElementById("track");
  if (!track) return;

  const originals = Array.from(track.children);

  /* ---- duplicate enough to fill the screen ---- */
  function fillTrack() {
    const viewportWidth = window.innerWidth;
    let totalWidth = 0;

    originals.forEach(el => {
      totalWidth += el.getBoundingClientRect().width;
    });

    // duplicate until 3× viewport width
    let needed = Math.ceil((viewportWidth * 3) / totalWidth);

    for (let i = 0; i < needed; i++) {
      originals.forEach(el => {
        const clone = el.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    }
  }

  fillTrack();

  /* ---- compute seamless animation ---- */
  function compute() {
    const firstSetWidth = originals.reduce(
      (sum, el) => sum + el.getBoundingClientRect().width,
      0
    );

    track.style.setProperty("--loop-distance", `${firstSetWidth}px`);

    const speed = Number(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--speed")
        .trim()
    ) || 70;

    const duration = firstSetWidth / speed;
    track.style.setProperty("--duration", `${duration}s`);
  }

  /* wait for images */
  const imgs = track.querySelectorAll("img");
  let pending = imgs.length;

  const done = () => {
    pending--;
    if (pending <= 0) compute();
  };

  if (pending === 0) compute();

  imgs.forEach(img => {
    if (img.complete) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });

  /* recalc on resize */
  window.addEventListener("resize", () => {
    clearTimeout(window.__resizeTimer);
    window.__resizeTimer = setTimeout(() => {
      location.reload();
    }, 200);
  });
})();