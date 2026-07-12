/* NYXOM — living night sky.
   Canvas starfield: stars drift and twinkle, constellation lines
   weave toward the pointer, an occasional meteor crosses the sky.
   Respects prefers-reduced-motion (static chart, no animation). */
(function () {
  var canvas = document.getElementById('sky');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctx = canvas.getContext('2d');
  var stars = [], meteors = [];
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var pointer = { x: -9999, y: -9999 };
  var running = true, raf = 0, lastMeteor = 0;

  var GOLD = '239,195,119', BLUE = '140,180,255', CYAN = '91,217,255';

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
  }

  function seed() {
    stars = [];
    var count = Math.min(190, Math.round((W * H) / 7800));
    for (var i = 0; i < count; i++) {
      var tint = Math.random();
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() < 0.85 ? 0.6 + Math.random() * 0.9 : 1.5 + Math.random() * 1.1,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.045,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 1.1,
        c: tint < 0.06 ? GOLD : (tint < 0.28 ? CYAN : BLUE)
      });
    }
  }

  function drawStar(s, t) {
    var tw = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(s.ph + t * 0.001 * s.sp);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + s.c + ',' + (0.35 + 0.55 * tw).toFixed(3) + ')';
    ctx.fill();
    if (s.r > 1.4) { // bright stars get a cross flare
      ctx.strokeStyle = 'rgba(' + s.c + ',' + (0.22 * tw).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x - s.r * 3.4, s.y); ctx.lineTo(s.x + s.r * 3.4, s.y);
      ctx.moveTo(s.x, s.y - s.r * 3.4); ctx.lineTo(s.x, s.y + s.r * 3.4);
      ctx.stroke();
    }
  }

  function linkNearPointer() {
    var R = 130, R2 = R * R, near = [];
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var dx = s.x - pointer.x, dy = s.y - pointer.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < R2) near.push({ s: s, d: Math.sqrt(d2) });
    }
    near.sort(function (a, b) { return a.d - b.d; });
    near = near.slice(0, 7);
    for (var j = 0; j < near.length; j++) {
      var a = near[j], b = near[(j + 1) % near.length];
      if (!b) break;
      var alpha = 0.5 * (1 - a.d / R);
      ctx.strokeStyle = 'rgba(' + CYAN + ',' + alpha.toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.s.x, a.s.y);
      ctx.lineTo(b.s.x, b.s.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(a.s.x, a.s.y, a.s.r + 0.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + CYAN + ',' + (alpha + 0.2).toFixed(3) + ')';
      ctx.fill();
    }
  }

  function spawnMeteor(t) {
    lastMeteor = t;
    var fromTop = Math.random() < 0.7;
    meteors.push({
      x: Math.random() * W * 0.9 + W * 0.05,
      y: fromTop ? -20 : Math.random() * H * 0.3,
      vx: (Math.random() < 0.5 ? -1 : 1) * (2.6 + Math.random() * 2),
      vy: 2.2 + Math.random() * 1.6,
      life: 1
    });
  }

  function drawMeteors() {
    for (var i = meteors.length - 1; i >= 0; i--) {
      var m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 0.012;
      if (m.life <= 0 || m.y > H + 30) { meteors.splice(i, 1); continue; }
      var grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 16, m.y - m.vy * 16);
      grad.addColorStop(0, 'rgba(238,243,255,' + (0.85 * m.life).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(238,243,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 16, m.y - m.vy * 16);
      ctx.stroke();
    }
  }

  function frame(t) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (!reduced) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < -4) s.x = W + 4; if (s.x > W + 4) s.x = -4;
        if (s.y < -4) s.y = H + 4; if (s.y > H + 4) s.y = -4;
      }
      drawStar(s, t);
    }
    if (!reduced) {
      linkNearPointer();
      if (t - lastMeteor > 6500 + Math.random() * 8000) spawnMeteor(t);
      drawMeteors();
      raf = requestAnimationFrame(frame);
    }
  }

  // pause when hero is out of view
  if ('IntersectionObserver' in window && !reduced) {
    new IntersectionObserver(function (entries) {
      var vis = entries[0].isIntersecting;
      if (vis && !running) { running = true; raf = requestAnimationFrame(frame); }
      else if (!vis && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.02 }).observe(canvas.parentElement);
  }

  canvas.parentElement.addEventListener('pointermove', function (e) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('pointerleave', function () {
    pointer.x = pointer.y = -9999;
  });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt); rt = setTimeout(resize, 150);
  });

  resize();
  raf = requestAnimationFrame(frame);
  if (reduced) frame(0); // draw one static chart
})();
