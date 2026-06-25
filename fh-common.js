// Shared ambient background network for 4Helix pages.
// Exported as an ES module; pages call FH.startNetwork(canvas) from componentDidMount.
export function startNetwork(canvas) {
  if (!canvas) return { stop() {} };
  const ctx = canvas.getContext('2d');
  const root = canvas.parentNode;
  let w = 0, h = 0, dpr = 1, nodes = [], raf = 0, last = performance.now();
  const rand = (a, b) => a + Math.random() * (b - a);
  const MARGIN = 40, LINK = 150, COL = '94,168,232';

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.max(22, Math.min(58, Math.round((w * h) / 46000)));
    if (nodes.length !== target) {
      nodes = [];
      for (let i = 0; i < target; i++) nodes.push({ x: rand(0, w), y: rand(0, h), vx: rand(-1, 1), vy: rand(-1, 1), ph: rand(0, Math.PI * 2), sp: rand(0.35, 0.95) });
    }
  }
  build();

  const clearEls = () => root.querySelectorAll('h1,h2,h3,p,nav,footer,button,a,[data-bg-clear]');

  const maskAt = (x, y, rects) => {
    let m = 1;
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const d = Math.sqrt(dx * dx + dy * dy);
      const k = d >= MARGIN ? 1 : d / MARGIN;
      if (k < m) m = k;
      if (m <= 0) return 0;
    }
    return m;
  };

  function draw(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, w, h);
    const els = clearEls();
    const rects = [];
    for (let i = 0; i < els.length; i++) {
      const b = els[i].getBoundingClientRect();
      if (b.width && b.height && b.bottom > -60 && b.top < h + 60) rects.push(b);
    }
    const t = now / 1000;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx * dt * 11; n.y += n.vy * dt * 11;
      if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      n.m = maskAt(n.x, n.y, rects);
      n.pulse = 0.5 + 0.5 * Math.sin(t * n.sp + n.ph);
    }
    for (let i = 0; i < nodes.length; i++) {
      const A = nodes[i];
      if (A.m <= 0) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const B = nodes[j];
        if (B.m <= 0) continue;
        const dx = A.x - B.x, dy = A.y - B.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          const al = (1 - d / LINK) * 0.13 * A.m * B.m;
          if (al < 0.002) continue;
          ctx.strokeStyle = 'rgba(' + COL + ',' + al.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        }
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.m <= 0) continue;
      const al = (0.11 + 0.32 * n.pulse) * n.m;
      const r = 1.1 + 1.5 * n.pulse;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4.2);
      g.addColorStop(0, 'rgba(' + COL + ',' + al.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + COL + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.x, n.y, r * 4.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(186,222,255,' + (al * 0.95).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', build);
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); window.removeEventListener('resize', build); } };
}
