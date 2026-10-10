(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('#motion-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const animations = [];
  let motionPaused = reducedMotion.matches;
  let artVisible = true;
  let frameId = 0;
  let phase = 0;
  let lastTime = 0;
  const setMenu = open => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
  };
  menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.querySelector('#year').textContent = new Date().getFullYear();

  const animate = window.anime?.animate;
  if (animate && !motionPaused) {
    animations.push(animate('.hero-line', { opacity: [0, 1], y: [30, 0], duration: 1200, delay: window.anime.stagger(130), ease: 'outQuint' }));
    animations.push(animate('.hero-enter', { opacity: [0, 1], y: [14, 0], duration: 950, delay: window.anime.stagger(95, { start: 250 }), ease: 'outQuint' }));
    animations.push(animate('.hero-art', { opacity: [0, 1], scale: [.94, 1], duration: 1600, delay: 150, ease: 'outQuint' }));
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (animate && !motionPaused) animations.push(animate(entry.target, { opacity: [.2, 1], y: [20, 0], duration: 850, ease: 'outQuint' }));
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }

  const focusItems = [...document.querySelectorAll('.focus-item')];
  const focusTitles = ['Human curiosity.', 'Human inquiry.', 'Human creativity.', 'Human expertise.'];
  focusItems.forEach((item, index) => item.addEventListener('toggle', () => {
    if (!item.open) return;
    focusItems.forEach(other => { if (other !== item) other.open = false; });
    const title = document.querySelector('.visual-bottomline p');
    title.replaceChildren(document.createTextNode(focusTitles[index]), document.createElement('br'));
    const emphasis = document.createElement('em'); emphasis.textContent = 'Expanded.'; title.append(emphasis);
    document.querySelector('.visual-topline span:last-child').textContent = `0${index + 1} — 04`;
    if (animate && !motionPaused) animations.push(animate('.focus-glyph', { rotate: [index * 15 - 15, index * 15], duration: 900, ease: 'outQuint' }));
  }));

  const canvas = document.querySelector('#intelligence-canvas');
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  const points = [];
  // Two intertwined ribbons: a visual expression of the human + AI partnership.
  for (let band = 0; band < 2; band++) {
    for (let i = 0; i < 148; i++) {
      const u = i / 148 * Math.PI * 2;
      for (let j = 0; j < 21; j++) {
        const v = (j / 20 - .5) * .94;
        const radius = 1.1 + .33 * Math.cos(3 * u + band * Math.PI) + .06 * Math.sin(5 * u);
        const twist = u * 1.5 + band * Math.PI;
        const edge = v * Math.cos(twist);
        points.push({ x: (radius + edge) * Math.cos(u), y: (radius + edge) * Math.sin(u), z: v * Math.sin(twist) + .34 * Math.sin(2 * u + band * Math.PI), band, edge: Math.abs(v) });
      }
    }
  }
  const draw = () => {
    if (!context || !width || !height) return;
    context.clearRect(0, 0, width, height);
    const angle = phase * .1 + .45;
    const ca = Math.cos(angle), sa = Math.sin(angle);
    const tilt = -.6, ct = Math.cos(tilt), st = Math.sin(tilt);
    const spin = .25, cs = Math.cos(spin), ss = Math.sin(spin);
    const size = Math.min(width, height) * .242;
    const projected = points.map(point => {
      const x = point.x * ca + point.z * sa;
      const z = -point.x * sa + point.z * ca;
      const y = point.y * ct - z * st;
      const depth = point.y * st + z * ct;
      const scale = 4.8 / (4.8 - depth);
      return { x: width / 2 + (x * cs - y * ss) * size * scale, y: height / 2 + (x * ss + y * cs) * size * scale, depth, band: point.band, edge: point.edge, scale };
    }).sort((a, b) => a.depth - b.depth);
    for (const point of projected) {
      const alpha = Math.max(.18, Math.min(.87, .53 + point.depth * .2));
      context.fillStyle = point.band ? `rgba(0,139,126,${alpha})` : `rgba(7,45,63,${alpha})`;
      context.beginPath();
      context.arc(point.x, point.y, Math.max(.55, width / 560 * .91 * point.scale), 0, Math.PI * 2);
      context.fill();
    }
  };
  const canRun = () => !motionPaused && artVisible && !document.hidden;
  const tick = time => {
    frameId = 0;
    if (!canRun()) { lastTime = 0; return; }
    if (lastTime) phase += Math.min(time - lastTime, 50) / 1000;
    lastTime = time;
    draw();
    frameId = requestAnimationFrame(tick);
  };
  const syncLoop = () => {
    if (canRun() && !frameId) frameId = requestAnimationFrame(tick);
    else if (!canRun() && frameId) { cancelAnimationFrame(frameId); frameId = 0; lastTime = 0; }
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * density); canvas.height = Math.round(height * density);
    context?.setTransform(density, 0, 0, density, 0, 0);
    draw();
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { artVisible = entries[0].isIntersecting; syncLoop(); }, { threshold: 0 }).observe(canvas);
  document.addEventListener('visibilitychange', syncLoop);
  const syncMotion = () => {
    document.body.classList.toggle('motion-paused', motionPaused);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    motionButton.querySelector('.motion-text').textContent = motionPaused ? 'Resume motion' : 'Pause motion';
    motionButton.querySelector('.motion-icon').textContent = motionPaused ? '▷' : 'Ⅱ';
    animations.forEach(animation => { if (motionPaused) animation.complete(); });
    syncLoop();
  };
  motionButton.addEventListener('click', () => { motionPaused = !motionPaused; syncMotion(); });
  reducedMotion.addEventListener('change', event => { motionPaused = event.matches; syncMotion(); });
  resize(); syncMotion();
})();
