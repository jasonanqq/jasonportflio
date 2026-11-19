(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return;

  const reveals = new IntersectionObserver(entries => {
    const groups = new Map();
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      reveals.unobserve(target);
      if (motion.matches || !target.animate) continue;
      const group = target.closest('.row') || target.parentElement;
      const order = groups.get(group) || 0;
      groups.set(group, order + 1);
      target.animate([
        { opacity: 0, transform: 'translateY(30px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { id: 'portfolio-reveal', duration: 800, delay: Math.min(order, 4) * 100,
        easing: 'ease', fill: 'backwards' });
    }
  }, { rootMargin: '0px 0px -32px', threshold: 0 });

  document.querySelectorAll('.hero-copy, .hero .col-lg-5, .section-title, .skill-card, .section .row > [class^="col-"]').forEach(el => {
    // Reveal the outer column once when a card contains its own grid.
    if (!el.parentElement.closest('.section .row > [class^="col-"]')) reveals.observe(el);
  });
  motion.addEventListener('change', () => {
    if (motion.matches) document.getAnimations().filter(a => a.id === 'portfolio-reveal').forEach(a => a.cancel());
  });

  const canvas = document.querySelector('.hero-rain');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const glyphs = '01アイウエオカキクケコ';
  const pitch = 18;
  let drops = [];
  let visible = false;
  let timer;

  function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    drops = Array.from({ length: Math.ceil(canvas.width / pitch) },
      () => Math.floor(Math.random() * canvas.height / pitch));
  }
  function draw() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,.13)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = getComputedStyle(canvas).color;
    ctx.font = '14px monospace';
    drops.forEach((row, column) => {
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], column * pitch, row * pitch);
      drops[column] = row * pitch > canvas.height && Math.random() > .95 ? 0 : row + 1;
    });
  }
  function syncRain() {
    clearInterval(timer);
    if (visible && !motion.matches && !document.hidden) timer = setInterval(draw, 65);
  }
  resize();
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncRain();
  }).observe(canvas);
  document.addEventListener('visibilitychange', syncRain);
  motion.addEventListener('change', syncRain);
})();
