/* ─── Navbar scroll effect ─────────────────────────────────────────── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── Chaos icon animation ─────────────────────────────────────────── */
const arena = document.querySelector('.chaos-arena');
const icons = Array.from(document.querySelectorAll('.chaos-icon'));

if (arena && icons.length) {
  const W = arena.offsetWidth;
  const H = arena.offsetHeight;
  const ICON_SIZE = 40;

  const state = icons.map((el) => {
    const x = Math.random() * (W - ICON_SIZE);
    const y = Math.random() * (H - ICON_SIZE);
    const vx = (Math.random() - .5) * 1.4;
    const vy = (Math.random() - .5) * 1.4;
    const rot = Math.random() * 360;
    const vr = (Math.random() - .5) * 1.2;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    return { el, x, y, vx, vy, rot, vr };
  });

  let mouseX = -999, mouseY = -999;

  arena.addEventListener('mousemove', (e) => {
    const rect = arena.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  arena.addEventListener('mouseleave', () => {
    mouseX = -999;
    mouseY = -999;
  });

  const REPEL_RADIUS = 80;
  const REPEL_FORCE = 2.5;

  function tick() {
    const cW = arena.offsetWidth;
    const cH = arena.offsetHeight;

    state.forEach((s) => {
      // mouse repulsion
      const dx = s.x + ICON_SIZE / 2 - mouseX;
      const dy = s.y + ICON_SIZE / 2 - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 1) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS * REPEL_FORCE;
        s.vx += (dx / dist) * force;
        s.vy += (dy / dist) * force;
      }

      // speed cap
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (speed > 3) { s.vx = s.vx / speed * 3; s.vy = s.vy / speed * 3; }

      // friction
      s.vx *= .985;
      s.vy *= .985;

      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vr;

      // bounce off walls
      if (s.x < 0)            { s.x = 0;            s.vx = Math.abs(s.vx); }
      if (s.x > cW - ICON_SIZE) { s.x = cW - ICON_SIZE; s.vx = -Math.abs(s.vx); }
      if (s.y < 0)            { s.y = 0;            s.vy = Math.abs(s.vy); }
      if (s.y > cH - ICON_SIZE) { s.y = cH - ICON_SIZE; s.vy = -Math.abs(s.vy); }

      s.el.style.transform = `rotate(${s.rot}deg)`;
      s.el.style.left = s.x + 'px';
      s.el.style.top  = s.y + 'px';
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ─── Live waveform bars stagger ───────────────────────────────────── */
document.querySelectorAll('.live-wave-bar').forEach((bar, i) => {
  bar.style.animationDelay = (i * 0.07) + 's';
  const h = 4 + Math.random() * 24;
  bar.style.height = h + 'px';
});

document.querySelectorAll('.audio-wave-viz span').forEach((bar, i) => {
  bar.style.animationDelay = (i * 0.06) + 's';
  const h = 8 + Math.random() * 36;
  bar.style.height = h + 'px';
});

/* ─── Report text lines staggered typing animation ─────────────────── */
document.querySelectorAll('.rtl').forEach((line, i) => {
  line.style.width = (40 + Math.random() * 55) + '%';
  line.style.setProperty('--delay', (i * .4) + 's');
});

/* ─── Scroll reveal ─────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

