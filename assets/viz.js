/* =========================================================
   viz.js — motor de animações 2D/3D (canvas puro, sem libs)
   V.mount(elemento, definição) cria palco + controles + leituras.
   V.lib.* são animações reutilizáveis (sólidos, superfícies...).
   ========================================================= */
(() => {
'use strict';
const TAU = Math.PI * 2;
const V = window.V = { TAU, lib: {} };
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t = clamp(t, 0, 1), t < .5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
V.clamp = clamp; V.lerp = lerp; V.ease = ease;
V.fmt = (v, d = 2) => Number.isFinite(v) ? v.toFixed(d).replace('.', ',').replace(/^-(?=0,0*$)/, '').replace('-', '−') : '–';
V.pi = v => { // ângulo como múltiplo de π, com frações bonitas quando possível
  const q = v / Math.PI;
  for (const d of [1, 2, 3, 4, 6, 8, 12]) {
    const n = Math.round(q * d);
    if (Math.abs(q * d - n) < 0.015) {
      if (n === 0) return '0';
      const num = n === 1 ? 'π' : n + 'π';
      return d === 1 ? num : num + '/' + d;
    }
  }
  return V.fmt(q, 2) + 'π';
};
V.deg = v => Math.round(v * 180 / Math.PI) + '°';

const hexRGB = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
V.C = {}; V.A = {};
const KEYS = ['bg', 'panel', 'panel2', 'line', 'ink', 'bone', 'mute', 'blood', 'rust', 'amp', 'volt'];
V.readColors = () => { const s = getComputedStyle(document.documentElement); for (const k of KEYS) { const v = s.getPropertyValue('--' + k).trim() || '#888888'; V.C[k] = v; V.A[k] = hexRGB(v); } };
V.readColors();
const res = c => Array.isArray(c) ? c : (c && c[0] === '#') ? hexRGB(c) : (V.A[c || 'ink'] || [200, 200, 200]);
V.res = res;
V.rgba = (c, a = 1, f = 1) => { c = res(c); return `rgba(${clamp(c[0] * f, 0, 255) | 0},${clamp(c[1] * f, 0, 255) | 0},${clamp(c[2] * f, 0, 255) | 0},${a})`; };
const RAMP = [[44, 10, 16], [128, 16, 26], [235, 40, 42], [255, 150, 0], [255, 238, 196]];
V.heat = t => { t = clamp(t, 0, 1) * (RAMP.length - 1); const i = Math.min(RAMP.length - 2, t | 0), f = t - i, a = RAMP[i], b = RAMP[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; };

const FONT = '600 12.5px "JetBrains Mono", ui-monospace, monospace';
function halo(c, s, x, y, col, align = 'left', font = FONT) {
  c.font = font; c.textAlign = align; c.textBaseline = 'middle';
  c.lineWidth = 4; c.strokeStyle = 'rgba(9,9,10,.9)'; c.lineJoin = 'round'; c.strokeText(s, x, y);
  c.fillStyle = col; c.fillText(s, x, y);
}
V.halo = halo;

/* ---------------- 3D ---------------- */
function newell(p) {
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; x += (a[1] - b[1]) * (a[2] + b[2]); y += (a[2] - b[2]) * (a[0] + b[0]); z += (a[0] - b[0]) * (a[1] + b[1]); }
  const L = Math.hypot(x, y, z); return L < 1e-12 ? null : [x / L, y / L, z / L];
}
class G3 {
  constructor(c, W, H, v) {
    this.c = c; this.W = W; this.H = H;
    this.cy = Math.cos(v.yaw); this.sy = Math.sin(v.yaw); this.cp = Math.cos(v.pitch); this.sp = Math.sin(v.pitch);
    this.s = Math.min(W, H) / v.size * v.zoom * 1.25; this.D = v.size * 2.6; this.ctr = v.center || [0, 0, 0];
    this.ox = W / 2; this.oy = H / 2 + (v.dy || 0) * H; this.prims = []; this.labels = [];
  }
  view(x, y, z) { x -= this.ctr[0]; y -= this.ctr[1]; z -= this.ctr[2]; const x1 = x * this.cy - y * this.sy, y1 = x * this.sy + y * this.cy; return [x1, y1 * this.sp + z * this.cp, y1 * this.cp - z * this.sp]; }
  P(p) { const v = this.view(p[0], p[1], p[2]), f = this.D / (this.D + v[2]); return [this.ox + v[0] * this.s * f, this.oy - v[1] * this.s * f, v[2]]; }
  depthOfNormal(n) { const y1 = n[0] * this.sy + n[1] * this.cy; return y1 * this.cp - n[2] * this.sp; }
  bright(n) {
    const x1 = n[0] * this.cy - n[1] * this.sy, y1 = n[0] * this.sy + n[1] * this.cy, u = y1 * this.sp + n[2] * this.cp, d = y1 * this.cp - n[2] * this.sp;
    return .36 + .64 * Math.abs(-.38 * x1 + .55 * u - .74 * d);
  }
  poly(pts, o = {}) {
    const P = pts.map(p => this.P(p)); let d = 0; for (const q of P) d += q[2]; d /= P.length;
    let br = 1; if (o.shade !== false) { const n = newell(pts); if (n) br = this.bright(n); }
    this.prims.push({ k: 0, d: d + (o.bias || 0), P, c: res(o.color), a: o.alpha ?? 1, br: br * (o.light ?? 1), mesh: o.mesh, st: o.stroke ? res(o.stroke) : null, lw: o.lw || 1.2 });
  }
  seg(a, b, o = {}) { const A = this.P(a), B = this.P(b); this.prims.push({ k: 1, d: (A[2] + B[2]) / 2 + (o.bias || 0), P: [A, B], c: res(o.color), a: o.alpha ?? 1, lw: o.lw || 1.5, dash: o.dash }); }
  line(pts, o = {}) { for (let i = 0; i < pts.length - 1; i++) this.seg(pts[i], pts[i + 1], o); }
  dot(p, o = {}) { const A = this.P(p); this.prims.push({ k: 2, d: A[2] + (o.bias ?? -0.05), P: [A], c: res(o.color), a: o.alpha ?? 1, r: o.r || 5 }); }
  label(p, txt, o = {}) { const A = this.P(p); this.labels.push({ A, txt, c: V.rgba(o.color || 'bone'), al: o.align || 'left', dx: o.dx ?? 8, dy: o.dy ?? -8, font: o.font }); }
  surf(f, U, W, o = {}) {
    const [u0, u1, nu] = U, [v0, v1, nv] = W, G = [];
    for (let i = 0; i <= nu; i++) { const row = []; for (let j = 0; j <= nv; j++) row.push(f(lerp(u0, u1, i / nu), lerp(v0, v1, j / nv))); G.push(row); }
    if (o.wire) {
      const every = o.every || 1;
      for (let i = 0; i <= nu; i += every) this.line(G[i], o);
      for (let j = 0; j <= nv; j += every) this.line(G.map(r => r[j]), o);
      return;
    }
    const po = Object.assign({ mesh: true }, o);
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const q = [G[i][j], G[i + 1][j], G[i + 1][j + 1], G[i][j + 1]];
      if (o.colorFn) { const m = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, (q[0][2] + q[2][2]) / 2]; po.color = o.colorFn(m); }
      this.poly(q, po);
    }
  }
  box(x0, x1, y0, y1, z0, z1, o = {}, skip) {
    const F = [
      [[1, 0, 0], [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]], [[-1, 0, 0], [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]],
      [[0, 1, 0], [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]]], [[0, -1, 0], [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]],
      [[0, 0, 1], [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]], [[0, 0, -1], [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]]]];
    F.forEach(([n, q], i) => { if (skip && skip[i]) return; if (o.cull !== false && this.depthOfNormal(n) > 0) return; this.poly(q, o); });
  }
  axes(L = 3, o = {}) {
    const col = o.color || 'mute', n = o.neg ?? L * .35;
    const ax = [[[1, 0, 0], 'x'], [[0, 1, 0], 'y'], [[0, 0, 1], 'z']];
    for (const [e, t] of ax) {
      const Lx = Array.isArray(L) ? L[t === 'x' ? 0 : t === 'y' ? 1 : 2] : L;
      this.seg([-e[0] * n, -e[1] * n, -e[2] * n], [0, 0, 0], { color: col, alpha: .35, lw: 1, dash: [3, 4], bias: 40 });
      this.seg([0, 0, 0], [e[0] * Lx, e[1] * Lx, e[2] * Lx], { color: col, alpha: .9, lw: 1.4, bias: 40 });
      this.label([e[0] * Lx, e[1] * Lx, e[2] * Lx], t, { color: 'bone', dx: 6, dy: -6 });
    }
  }
  floorPolar(R = 3, o = {}) {
    const z = o.z || 0, step = o.step || 1, col = o.color || 'line';
    for (let r = step; r <= R + 1e-9; r += step) { const pts = []; for (let i = 0; i <= 64; i++) { const t = i / 64 * TAU; pts.push([r * Math.cos(t), r * Math.sin(t), z]); } this.line(pts, { color: col, lw: 1, alpha: .9, bias: 60 }); }
    for (let k = 0; k < 12; k++) { const t = k / 12 * TAU; this.seg([0, 0, z], [R * Math.cos(t), R * Math.sin(t), z], { color: col, lw: 1, alpha: .7, bias: 60 }); }
  }
  floorGrid(x0, x1, y0, y1, o = {}) {
    const z = o.z || 0, st = o.step || 1, col = o.color || 'line';
    for (let x = Math.ceil(x0 / st) * st; x <= x1 + 1e-9; x += st) this.seg([x, y0, z], [x, y1, z], { color: col, lw: 1, bias: 60 });
    for (let y = Math.ceil(y0 / st) * st; y <= y1 + 1e-9; y += st) this.seg([x0, y, z], [x1, y, z], { color: col, lw: 1, bias: 60 });
  }
  arc(c, r, a0, a1, plane = 'xy', o = {}) { // arco em torno de c
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / .08)), pts = [];
    for (let i = 0; i <= n; i++) { const t = lerp(a0, a1, i / n); pts.push(plane === 'xy' ? [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), c[2]] : plane.fn(t)); }
    this.line(pts, o);
  }
  flush() {
    const c = this.c; this.prims.sort((a, b) => b.d - a.d);
    for (const p of this.prims) {
      if (p.k === 0) {
        const P = p.P; c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.closePath();
        c.fillStyle = V.rgba(p.c, p.a, p.br); c.fill();
        if (p.mesh) { c.strokeStyle = V.rgba(p.c, Math.min(1, p.a + .25), p.br * .5); c.lineWidth = .7; c.stroke(); }
        else if (p.a > .97) { c.strokeStyle = c.fillStyle; c.lineWidth = .6; c.stroke(); }
        if (p.st) { c.strokeStyle = V.rgba(p.st, 1); c.lineWidth = p.lw; c.stroke(); }
      } else if (p.k === 1) {
        c.beginPath(); c.moveTo(p.P[0][0], p.P[0][1]); c.lineTo(p.P[1][0], p.P[1][1]);
        c.strokeStyle = V.rgba(p.c, p.a); c.lineWidth = p.lw; c.lineCap = 'round'; c.setLineDash(p.dash || []); c.stroke(); c.setLineDash([]);
      } else {
        c.beginPath(); c.arc(p.P[0][0], p.P[0][1], p.r, 0, TAU); c.fillStyle = V.rgba(p.c, p.a); c.fill();
        c.lineWidth = 2; c.strokeStyle = 'rgba(9,9,10,.9)'; c.stroke();
      }
    }
    for (const l of this.labels) halo(c, l.txt, l.A[0] + l.dx, l.A[1] + l.dy, l.c, l.al, l.font);
  }
}
V.G3 = G3;

/* ---------------- 2D ---------------- */
class G2 {
  constructor(c, W, H) { this.c = c; this.W = W; this.H = H; this.frame(-1, 1, -1, 1); }
  frame(x0, x1, y0, y1, o = {}) {
    const R = o.rect || [0, 0, this.W, this.H], pad = o.pad ?? 26;
    const w = R[2] - 2 * pad, h = R[3] - 2 * pad; let sx = w / (x1 - x0), sy = h / (y1 - y0);
    if (o.equal !== false) { const s = Math.min(sx, sy); sx = sy = s; }
    this.sx = sx; this.sy = sy;
    this.ox = R[0] + R[2] / 2 - (x0 + x1) / 2 * sx; this.oy = R[1] + R[3] / 2 + (y0 + y1) / 2 * sy;
    this.b = [x0, x1, y0, y1]; return this;
  }
  X(x) { return this.ox + x * this.sx; } Y(y) { return this.oy - y * this.sy; }
  ix(px) { return (px - this.ox) / this.sx; } iy(py) { return (this.oy - py) / this.sy; }
  path(pts) { const c = this.c; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(this.X(p[0]), this.Y(p[1])) : c.moveTo(this.X(p[0]), this.Y(p[1]))); }
  line(pts, col = 'ink', lw = 2, dash, a = 1) { this.path(pts); const c = this.c; c.strokeStyle = V.rgba(col, a); c.lineWidth = lw; c.lineJoin = c.lineCap = 'round'; c.setLineDash(dash || []); c.stroke(); c.setLineDash([]); }
  fill(pts, col = 'blood', a = .3) { this.path(pts); this.c.closePath(); this.c.fillStyle = V.rgba(col, a); this.c.fill(); }
  seg(x0, y0, x1, y1, col, lw, dash, a) { this.line([[x0, y0], [x1, y1]], col, lw, dash, a); }
  dot(x, y, r = 5, col = 'blood') { const c = this.c; c.beginPath(); c.arc(this.X(x), this.Y(y), r, 0, TAU); c.fillStyle = V.rgba(col); c.fill(); c.lineWidth = 2; c.strokeStyle = 'rgba(9,9,10,.9)'; c.stroke(); }
  circle(x, y, r, col = 'line', lw = 1, dash, a = 1) { const c = this.c; c.beginPath(); c.arc(this.X(x), this.Y(y), r * this.sx, 0, TAU); c.strokeStyle = V.rgba(col, a); c.lineWidth = lw; c.setLineDash(dash || []); c.stroke(); c.setLineDash([]); }
  text(s, x, y, col = 'bone', align = 'left', dx = 0, dy = 0, font) { halo(this.c, s, this.X(x) + dx, this.Y(y) + dy, V.rgba(col), align, font); }
  grid(step = 1, col = 'line') { const [x0, x1, y0, y1] = this.b; for (let x = Math.ceil(x0 / step) * step; x <= x1 + 1e-9; x += step) this.seg(x, y0, x, y1, col, 1); for (let y = Math.ceil(y0 / step) * step; y <= y1 + 1e-9; y += step) this.seg(x0, y, x1, y, col, 1); }
  axes(lx = 'x', ly = 'y', col = 'mute') { const [x0, x1, y0, y1] = this.b; this.seg(x0, 0, x1, 0, col, 1.4); this.seg(0, y0, 0, y1, col, 1.4); this.text(lx, x1, 0, 'bone', 'right', -4, -12); this.text(ly, 0, y1, 'bone', 'left', 8, 8); }
}
V.G2 = G2;

/* ---------------- montagem ---------------- */
const mounts = []; let T = 0, last = 0, running = false;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = new IntersectionObserver(es => { for (const e of es) { const m = e.target.__m; if (m) m.vis = e.isIntersecting; } }, { rootMargin: '150px' });

function buildCtl(m) {
  const box = m.el.querySelector('.viz-ctl'), p = m.st.p;
  for (const c of m.def.controls || []) {
    if (c.type === 'seg') {
      const d = document.createElement('div'); d.className = 'seg';
      d.innerHTML = c.label ? `<span class="vc-l">${c.label}</span>` : '';
      const bs = c.options.map(([v, lab]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'vbtn'; b.innerHTML = lab; b.onclick = () => { m.stopAnim(); m.set(c.k, v); }; d.appendChild(b); return [v, b]; });
      m.ui[c.k] = v => bs.forEach(([w, b]) => b.setAttribute('aria-pressed', String(w === v)));
      m.ui[c.k](p[c.k]); box.appendChild(d);
    } else if (c.type === 'toggle') {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'vbtn'; b.textContent = c.label;
      b.onclick = () => m.set(c.k, p[c.k] ? 0 : 1);
      m.ui[c.k] = v => b.setAttribute('aria-pressed', String(!!v)); m.ui[c.k](p[c.k]); box.appendChild(b);
    } else if (c.type === 'play') {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'vbtn amp'; const lab = c.label || 'Animar';
      b.textContent = '▶ ' + lab; c._btn = b; c._lab = lab;
      b.onclick = () => m.anim && m.anim.c === c ? m.stopAnim() : m.startAnim(c);
      box.appendChild(b);
    } else if (c.type === 'button') {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'vbtn'; b.textContent = c.label; b.onclick = () => c.on(m.st, m); box.appendChild(b);
    } else {
      const l = document.createElement('label'); l.className = 'vc';
      const show = c.show || (v => V.fmt(v, c.step < 1 ? (c.step < .1 ? 2 : 1) : 0));
      l.innerHTML = `<span class="vc-l">${c.label}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step || 0.01}"><output></output>`;
      const inp = l.querySelector('input'), out = l.querySelector('output');
      inp.value = p[c.k];
      inp.oninput = () => { if (m.anim && m.anim.k === c.k) m.stopAnim(); m.set(c.k, +inp.value); };
      m.ui[c.k] = v => { if (+inp.value !== v) inp.value = v; out.textContent = show(v); };
      m.ui[c.k](p[c.k]); box.appendChild(l);
    }
  }
}

V.mount = (el, def) => {
  if (typeof el === 'string') el = document.querySelector(el);
  if (!el) return null;
  const m = { el, def, st: { p: {}, ch: {}, T: 0 }, vis: false, ui: {}, anim: null, lastInt: -99 };
  m.view = Object.assign({ yaw: -.78, pitch: .42, zoom: 1, size: 6, center: [0, 0, 0] }, def.view || {}); m.view0 = { ...m.view };
  el.classList.add('viz'); if (def.type === '2d') el.classList.add('v2d');
  el.innerHTML = `<div class="viz-stage" style="--h:${def.h || 380}px"><canvas role="img" aria-label="${def.alt || 'Animação interativa'}"></canvas>${def.title ? `<span class="viz-title">${def.title}</span>` : ''}${def.type === '2d' ? (def.hint ? `<span class="viz-hint">${def.hint}</span>` : '') : `<span class="viz-hint">${def.hint || '↔ arraste para girar'}</span>`}</div><div class="viz-ctl"></div><div class="viz-read"></div>`;
  m.canvas = el.querySelector('canvas'); m.ctx = m.canvas.getContext('2d'); m.canvas.__m = m;
  m.set = (k, v) => { if (m.st.p[k] === v) return; m.st.p[k] = v; m.st.ch[k] = T; const u = m.ui[k]; if (u) u(v); def.change && def.change(m.st, k, v, m); };
  m.startAnim = c => {
    m.stopAnim(); const sl = (def.controls || []).find(x => x.k === c.k && !x.type);
    const min = c.min ?? sl?.min ?? 0, max = c.max ?? sl?.max ?? 1; const cur = (m.st.p[c.k] - min) / (max - min || 1);
    m.anim = { c, k: c.k, min, max, dur: c.dur || 4, mode: c.mode || 'once', t: (c.mode === 'once' && cur > .995) ? 0 : clamp(cur, 0, 1) * (c.dur || 4) };
    if (c._btn) { c._btn.setAttribute('aria-pressed', 'true'); c._btn.textContent = '❚❚ Pausar'; }
  };
  m.stopAnim = () => { if (!m.anim) return; const c = m.anim.c; if (c._btn) { c._btn.setAttribute('aria-pressed', 'false'); c._btn.textContent = '▶ ' + c._lab; } m.anim = null; };
  m.play = k => { const c = (def.controls || []).find(x => x.type === 'play' && x.k === k) || { k, dur: 4 }; m.startAnim(c); };
  def.init && def.init(m.st, m);
  for (const c of def.controls || []) if (c.k && c.value !== undefined && m.st.p[c.k] === undefined) m.st.p[c.k] = c.value;
  buildCtl(m);
  if (def.autoplay) m.play(def.autoplay);
  const cv = m.canvas;
  cv.addEventListener('pointerdown', e => {
    m.lastInt = T; const r = cv.getBoundingClientRect();
    if (def.type === '2d') { if (def.pointer) { m.drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); def.pointer(m.st, e.clientX - r.left, e.clientY - r.top, 'down', m); } return; }
    m.drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (!m.drag) return; m.lastInt = T; const r = cv.getBoundingClientRect();
    if (def.type === '2d') { def.pointer && def.pointer(m.st, e.clientX - r.left, e.clientY - r.top, 'move', m); return; }
    const dx = e.clientX - m.drag.x, dy = e.clientY - m.drag.y; m.drag = { x: e.clientX, y: e.clientY };
    m.view.yaw -= dx * .011; m.view.pitch = clamp(m.view.pitch + dy * .009, -.25, 1.52);
  });
  const end = () => { m.drag = null; m.lastInt = T; };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  cv.addEventListener('dblclick', () => { Object.assign(m.view, m.view0); });
  mounts.push(m); io.observe(cv);
  if (!running) { running = true; requestAnimationFrame(frame); }
  return m;
};

function updRead(m) {
  const rows = m.def.read(m.st, m) || [], box = m.el.querySelector('.viz-read');
  if (!m.readEls || m.readEls.length !== rows.length) {
    box.innerHTML = rows.map(r => `<div class="${r[2] ? 'key' : ''}"><span>${r[0]}</span><strong></strong></div>`).join('');
    m.readEls = [...box.querySelectorAll('div')].map(d => [d.querySelector('span'), d.querySelector('strong')]);
  }
  rows.forEach((r, i) => { const [s, v] = m.readEls[i]; if (s.textContent !== r[0]) s.textContent = r[0]; const t = String(r[1]); if (v.textContent !== t) v.textContent = t; });
}

function frame(now) {
  const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; T += dt;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  for (const m of mounts) {
    if (!m.vis) continue;
    const cv = m.canvas, w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) continue;
    if (m.anim) {
      const a = m.anim; a.t += dt; let u = a.t / a.dur;
      if (a.mode === 'loop') u %= 1; else if (a.mode === 'ping') u = .5 - .5 * Math.cos(Math.PI * u); else if (u >= 1) { u = 1; }
      let v = lerp(a.min, a.max, u); const sl = (m.def.controls || []).find(x => x.k === a.k && !x.type);
      if (sl && sl.step >= 1) v = Math.round(v);
      m.set(a.k, v); if (a.mode === 'once' && a.t >= a.dur) m.stopAnim();
    }
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const c = m.ctx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h); c.globalAlpha = 1;
    m.st.T = T;
    try {
      if (m.def.type === '2d') m.def.draw(new G2(c, w, h), m.st, T, dt, m);
      else {
        if (!m.drag && !reduce && m.def.auto !== false && T - m.lastInt > 4) m.view.yaw += dt * (m.def.spin ?? .16);
        const g = new G3(c, w, h, m.view); m.def.draw(g, m.st, T, dt, m); g.flush();
      }
      if (m.def.read) updRead(m);
    } catch (err) { console.error(err); m.vis = false; }
  }
  requestAnimationFrame(frame);
}

/* progresso animado de um passo: 0 antes, 0→1 quando entra, 1 depois */
V.stepE = (st, idx) => { const s = st.p.step ?? 99; if (s > idx) return 1; if (s < idx) return 0; return ease((st.T - (st.ch.step ?? -99)) / .9); };

/* =========================================================
   BIBLIOTECA DE ANIMAÇÕES REUTILIZÁVEIS
   ========================================================= */
const L = V.lib;
const cyl = (r, t, z) => [r * Math.cos(t), r * Math.sin(t), z];
V.cyl = cyl;

/* ---- ponto em coordenadas cilíndricas ---- */
L.ponto = (o = {}) => ({
  h: o.h || 380, alt: 'Ponto em coordenadas cilíndricas',
  view: { yaw: -.55, pitch: .42, size: o.size || 9, center: o.center || [0, 0, 0] },
  controls: o.ctl ? [
    { k: 'r', label: 'r', min: 0, max: 4, step: .05, value: o.r ?? 2.5 },
    { k: 'th', label: 'θ', min: 0, max: TAU, step: .01, value: o.th ?? 1, show: v => V.deg(v) },
    { k: 'z', label: 'z', min: -2.5, max: 3.5, step: .05, value: o.z ?? 2 }] : [],
  init(st) { Object.assign(st.p, { r: o.r ?? 2.5, th: o.th ?? 1, z: o.z ?? 2, step: o.ctl ? 99 : 99 }); },
  draw(g, st) {
    const { r, th, z } = st.p, x = r * Math.cos(th), y = r * Math.sin(th);
    const R = Math.max(3, Math.ceil(r + .5));
    g.floorPolar(R); g.axes(R + .8);
    const e1 = V.stepE(st, o.s1 ?? 1), e2 = V.stepE(st, o.s2 ?? 2), e3 = V.stepE(st, o.s3 ?? 3);
    if (o.farol) { // feixe do farol
      const n = 14; for (let i = 0; i < n; i++) { const a0 = th - .18 + .36 * i / n, a1 = th - .18 + .36 * (i + 1) / n; g.poly([[0, 0, 0], cyl(R, a0, 0), cyl(R, a1, 0)], { color: 'amp', alpha: .08, shade: false, bias: 30 }); }
      g.seg([0, 0, 0], [0, 0, R * .9], { color: 'bone', lw: 5, alpha: .9 });
      g.dot([0, 0, R * .9], { color: 'amp', r: 7 });
    }
    if (o.ghost != null) { g.seg([0, 0, 0], cyl(r, o.ghost, 0), { color: 'mute', lw: 2, dash: [6, 5] }); g.label(cyl(r, o.ghost, 0), o.ghostLabel || 'calculadora', { color: 'mute' }); }
    if (e1 > 0) {
      g.seg([0, 0, 0], cyl(r * e1, th, 0), { color: 'blood', lw: 3.5, bias: -1 });
      g.arc([0, 0, 0], Math.min(.9, r * .45 + .3), 0, th * e1, 'xy', { color: 'amp', lw: 2.5, bias: -1 });
      if (e1 > .9) { g.label(cyl(r * .78, th, 0), 'r = ' + V.fmt(r, r % 1 ? 2 : 0), { color: 'blood', dy: 16, dx: 4 }); g.label(cyl(Math.min(.9, r * .45 + .3) + .2, th / 2, 0), 'θ = ' + V.pi(th), { color: 'amp' }); }
    }
    if (e2 > 0) {
      g.seg(cyl(r, th, 0), [lerp(x, x, 0), lerp(y, 0, e2), 0], { color: 'volt', lw: 1.6, dash: [5, 4] });
      g.seg(cyl(r, th, 0), [lerp(x, 0, e2), y, 0], { color: 'volt', lw: 1.6, dash: [5, 4] });
      if (e2 > .9) { g.dot([x, 0, 0], { color: 'volt', r: 4 }); g.dot([0, y, 0], { color: 'volt', r: 4 }); g.label([x, 0, 0], 'x = ' + V.fmt(x), { color: 'volt', dy: 14 }); g.label([0, y, 0], 'y = ' + V.fmt(y), { color: 'volt', dy: 14 }); }
    }
    if (e3 > 0) { g.seg(cyl(r, th, 0), [x, y, z * e3], { color: 'amp', lw: 2.5, dash: [2, 4] }); if (e3 > .9) g.label([x, y, z / 2], 'z = ' + V.fmt(z, z % 1 ? 2 : 0), { color: 'amp' }); }
    g.dot([x, y, 0], { color: 'mute', r: 3.5 });
    g.dot([x, y, z], { color: 'blood', r: 7, bias: -2 });
    g.label([x, y, z], o.nome || 'P', { color: 'ink', dy: -14 });
  },
  read: o.ctl ? st => { const { r, th, z } = st.p; return [['x = r cos θ', V.fmt(r * Math.cos(th)), 1], ['y = r sen θ', V.fmt(r * Math.sin(th)), 1], ['z', V.fmt(z)], ['θ', V.pi(th)]]; } : null
});

/* ---- galeria de superfícies ---- */
const SURF = {
  cil: { nome: 'r = c', d(g, c) { g.surf((u, v) => cyl(c, u, v), [0, TAU, 40], [-1.6, 1.6, 6], { color: 'blood', alpha: .78 }); } },
  semi: { nome: 'θ = c', d(g, c) { g.surf((u, v) => cyl(u, c, v), [0, 3, 6], [-1.6, 1.6, 6], { color: 'amp', alpha: .72 }); g.arc([0, 0, 0], .9, 0, c, 'xy', { color: 'amp', lw: 2.5 }); } },
  plano: { nome: 'z = c', d(g, c) { g.surf((u, v) => cyl(v, u, c), [0, TAU, 36], [0, 3, 5], { color: 'volt', alpha: .55 }); } },
  cone: { nome: 'z = r', d(g, c) { g.surf((u, v) => cyl(v, u, v), [0, TAU, 40], [0, 2.4, 8], { color: 'blood', alpha: .78 }); } },
  parab: { nome: 'z = r²', d(g, c) { g.surf((u, v) => cyl(v, u, v * v), [0, TAU, 40], [0, 1.6, 10], { color: 'amp', alpha: .78 }); } },
  esfera: { nome: 'r² + z² = R²', d(g, c) { g.surf((u, v) => [c * Math.sin(v) * Math.cos(u), c * Math.sin(v) * Math.sin(u), c * Math.cos(v)], [0, TAU, 36], [0, Math.PI, 18], { color: 'blood', alpha: .7 }); } },
  cos: { nome: 'r = 2a cos θ', d(g, c) { const a = c / 2; g.surf((u, v) => [a + a * Math.cos(u), a * Math.sin(u), v], [0, TAU, 40], [-1.4, 1.4, 6], { color: 'volt', alpha: .7 }); g.dot([a, 0, 0], { color: 'amp', r: 4 }); } },
  sin: { nome: 'r = 2a sen θ', d(g, c) { const a = c / 2; g.surf((u, v) => [a * Math.cos(u), a + a * Math.sin(u), v], [0, TAU, 40], [-1.4, 1.4, 6], { color: 'volt', alpha: .7 }); g.dot([0, a, 0], { color: 'amp', r: 4 }); } },
  sela: { nome: 'z = r² cos 2θ', d(g, c) { g.surf((u, v) => cyl(v, u, .7 * v * v * Math.cos(2 * u)), [0, TAU, 48], [0, 1.8, 10], { colorFn: p => V.heat(.5 + p[2] / 4.6), alpha: .9 }); } }
};
V.SURF = SURF;
L.galeria = (o = {}) => {
  const itens = o.itens || Object.keys(SURF);
  return {
    h: o.h || 400, alt: 'Galeria de superfícies em coordenadas cilíndricas', view: { yaw: -.7, pitch: .38, size: 7.5 },
    controls: [{ k: 'sel', type: 'seg', options: itens.map((k, i) => [i, o.rotulos ? o.rotulos[i] : SURF[k].nome]) }, ...(o.semC ? [] : [{ k: 'c', label: 'c', min: .5, max: 2.5, step: .05 }])],
    init(st) { st.p.sel = o.sel || 0; st.p.c = o.c ?? 1.5; },
    change(st, k, v) { if (k === 'sel' && o.onPick) o.onPick(itens[v], v); },
    draw(g, st) { g.axes(3); g.floorPolar(3, { color: 'line' }); const k = itens[st.p.sel] || itens[0]; const c = o.cs ? o.cs[st.p.sel] : st.p.c; SURF[k].d(g, c); },
    read: o.semRead ? null : st => [['superfície', o.rotulos ? o.rotulos[st.p.sel] : SURF[itens[st.p.sel]].nome, 1]]
  };
};

/* ---- superfície de revolução: perfil (r,z) girando por Φ ---- */
L.revolucao = (o = {}) => ({
  h: o.h || 380, alt: 'Perfil girando em torno do eixo z', view: { yaw: -.8, pitch: .35, size: o.size || 7, center: [0, 0, o.cz || .8] },
  controls: [{ k: 'phi', label: 'giro Φ', min: 0, max: TAU, step: .01, value: TAU, show: V.deg }, { type: 'play', k: 'phi', label: 'Girar', dur: 3.5 }],
  autoplay: 'phi',
  draw(g, st) {
    const [t0, t1] = o.t || [0, 1], n = 28, Phi = st.p.phi;
    g.axes(o.ax || 3); g.floorPolar(o.R || 3);
    const prof = (f, col, lw) => { const pts = []; for (let i = 0; i <= n; i++) { const [r, z] = o.perfil(lerp(t0, t1, i / n)); pts.push(cyl(r, f, z)); } g.line(pts, { color: col, lw, bias: -1 }); };
    if (Phi > .02) g.surf((u, v) => { const [r, z] = o.perfil(lerp(t0, t1, v)); return cyl(r, u, z); }, [0, Phi, Math.max(2, Math.ceil(Phi / TAU * 40))], [0, 1, 16], { color: o.cor || 'volt', alpha: .6 });
    prof(0, 'blood', 4); if (Phi > .02 && Phi < TAU - .01) prof(Phi, 'amp', 3);
    const [rl, zl] = o.perfil(lerp(t0, t1, .7)); g.label(cyl(rl, 0, zl), o.rotulo || 'perfil', { color: 'blood' });
  },
  read: st => [['Φ', V.deg(st.p.phi)], ['equação', o.eq || '', 1]]
});

/* ---- integração numérica em cilíndricas ---- */
function integCil(G, a, b, f) {
  const nt = 40, nr = 36, nz = f ? 16 : 1, dth = (b - a) / nt; let S = 0;
  const r1 = G.r1 || (() => 0);
  for (let i = 0; i < nt; i++) {
    const th = a + (i + .5) * dth, R1 = r1(th), R2 = G.r2(th), dr = (R2 - R1) / nr;
    for (let j = 0; j < nr; j++) {
      const r = R1 + (j + .5) * dr, z1 = G.z1(r, th), z2 = G.z2(r, th); if (z2 <= z1) continue;
      if (!f) { S += (z2 - z1) * r * dr * dth; continue; }
      const dz = (z2 - z1) / nz; for (let k = 0; k < nz; k++) S += f(r, th, z1 + (k + .5) * dz) * r * dz * dr * dth;
    }
  }
  return S;
}
V.integCil = integCil;

/* ---- sólido descrito em cilíndricas: θ∈[a,b], r∈[r1(θ),r2(θ)], z∈[z1,z2] ---- */
L.solidoCil = (o = {}) => {
  const geo = p => typeof o.geo === 'function' ? o.geo(p) : o.geo;
  const ctl = [
    { type: 'play', k: 'build', label: 'Varrer θ', dur: o.dur || 3.5 },
    { k: 'build', label: 'θ varrido', min: 0, max: 1, step: .01, value: 1, show: v => Math.round(v * 100) + '%' },
    { k: 'pilar', type: 'toggle', label: 'Pilar dz', value: 0 },
    { k: 'sombra', type: 'toggle', label: 'Sombra no chão', value: 0 },
    ...(o.controls || [])];
  return {
    h: o.h || 400, alt: o.alt || 'Sólido em coordenadas cilíndricas', view: Object.assign({ yaw: -.75, pitch: .4, size: o.size || 7, center: [0, 0, o.cz ?? 1] }, o.view || {}),
    controls: o.semCtl ? (o.controls || []) : ctl, autoplay: o.autoplay === false ? null : 'build',
    init(st) { st.p.build = o.autoplay === false ? 1 : 0; st.p.pilar = o.pilar || 0; st.p.sombra = o.sombra || 0; st.cache = {}; if (o.init) o.init(st); },
    draw(g, st, T) {
      const p = st.p, G = geo(p), A = G.th[0], span = G.th[1] - G.th[0], a = A, b = A + span * p.build;
      const r1 = G.r1 || (() => 0), full = Math.abs(span - TAU) < 1e-6 && p.build > .999;
      g.axes(o.ax || 3, { neg: .6 }); if (o.chao !== false) g.floorPolar(o.R || 3);
      const alpha = p.fatia ? .35 : (o.alpha ?? .86);
      const cf = o.cor ? (q => V.heat(o.cor(q, p))) : null;
      const nth = Math.max(2, Math.ceil(36 * (b - a) / TAU) + 1), nr = o.nr || 9, nz = o.nz || 6;
      const R = (th, v) => { const R1 = r1(th), R2 = G.r2(th); return R1 + (R2 - R1) * v; };
      if (b - a > 1e-3) {
        const sopt = (col, extra) => Object.assign({ color: col, alpha, colorFn: cf }, extra || {});
        g.surf((u, v) => { const th = lerp(a, b, u), r = R(th, v); return cyl(r, th, G.z2(r, th)); }, [0, 1, nth], [0, 1, nr], sopt(o.corTopo || 'blood'));
        g.surf((u, v) => { const th = lerp(a, b, u), r = R(th, v); return cyl(r, th, G.z1(r, th)); }, [0, 1, nth], [0, 1, nr], sopt(o.corBase || 'rust'));
        g.surf((u, v) => { const th = lerp(a, b, u), r = G.r2(th), z1 = G.z1(r, th), z2 = G.z2(r, th); return cyl(r, th, lerp(z1, z2, v)); }, [0, 1, nth], [0, 1, nz], sopt(o.corParede || 'blood', { light: .85 }));
        if (G.r1) g.surf((u, v) => { const th = lerp(a, b, u), r = r1(th), z1 = G.z1(r, th), z2 = G.z2(r, th); return cyl(r, th, lerp(z1, z2, v)); }, [0, 1, nth], [0, 1, nz], sopt('volt'));
        if (!full) for (const th of [a, b]) g.surf((u, v) => { const r = R(th, u), z1 = G.z1(r, th), z2 = G.z2(r, th); return cyl(r, th, lerp(z1, z2, v)); }, [0, 1, nr], [0, 1, nz], sopt('amp', { alpha: Math.min(1, alpha + .05) }));
      }
      if (p.sombra) {
        const zf = o.zChao ?? 0, ss = G.th[0], se = G.th[1];
        g.surf((u, v) => { const th = lerp(ss, se, u); return cyl(R(th, v), th, zf); }, [0, 1, 36], [0, 1, 4], { color: 'amp', alpha: .4, shade: false, mesh: false, bias: 20 });
        const pts = []; for (let i = 0; i <= 60; i++) { const th = lerp(ss, se, i / 60); pts.push(cyl(G.r2(th), th, zf)); } g.line(pts, { color: 'amp', lw: 2.5, bias: 19 });
        g.label(cyl(G.r2(ss + (se - ss) * .3), ss + (se - ss) * .3, zf), o.rotSombra || 'sombra D', { color: 'amp', dy: 16 });
      }
      if (p.pilar) {
        const th0 = o.pilarTh != null ? o.pilarTh : a + (b - a) * .55, r0 = o.pilarR != null ? o.pilarR : R(th0, .55);
        const z1 = G.z1(r0, th0), z2 = G.z2(r0, th0), w = .09;
        g.box(...[r0 * Math.cos(th0) - w, r0 * Math.cos(th0) + w, r0 * Math.sin(th0) - w, r0 * Math.sin(th0) + w, z1, z2], { color: 'amp', alpha: 1, bias: -1000, cull: true });
        g.dot(cyl(r0, th0, z1), { color: 'volt', r: 5, bias: -1001 }); g.dot(cyl(r0, th0, z2), { color: 'volt', r: 5, bias: -1001 });
        g.label(cyl(r0, th0, z2), o.zTopo || 'teto z₂', { color: 'volt', dy: -14 }); g.label(cyl(r0, th0, z1), o.zBase || 'piso z₁', { color: 'volt', dy: 14 });
      }
      if (o.marca) { const m = typeof o.marca === 'function' ? o.marca(p) : o.marca; g.seg([0, 0, 0], [0, 0, m.z * 1.9], { color: 'mute', dash: [4, 4], bias: -900 }); g.dot([0, 0, m.z], { color: 'volt', r: 8, bias: -1000 }); g.label([0, 0, m.z], m.txt, { color: 'volt', dx: 12 }); }
      if (o.extra) o.extra(g, st, G, a, b);
    },
    read: st => {
      const p = st.p, G = geo(p), key = JSON.stringify([p.build, ...(o.chaves || []).map(k => p[k])]);
      if (st.cache.k !== key) { st.cache.k = key; st.cache.v = integCil(G, G.th[0], G.th[0] + (G.th[1] - G.th[0]) * p.build, o.f ? (r, t, z) => o.f(r, t, z, p) : null); }
      const rows = [[o.rotulo || 'Volume (numérico)', V.fmt(st.cache.v, 3), 1]];
      if (o.exato) rows.push(['Exato', typeof o.exato === 'function' ? o.exato(p) : o.exato]);
      rows.push(['θ varrido', V.pi((G.th[1] - G.th[0]) * p.build)]);
      return rows;
    }
  };
};

/* ---- sólido descrito em cartesianas: x∈[a,b], y∈[y1(x),y2(x)], z∈[z1,z2] ---- */
function integXY(G, xb, f) {
  const nx = 40, ny = 36, nz = f ? 14 : 1, dx = (xb - G.x[0]) / nx; let S = 0;
  for (let i = 0; i < nx; i++) {
    const x = G.x[0] + (i + .5) * dx, Y1 = G.y1(x), Y2 = G.y2(x), dy = (Y2 - Y1) / ny;
    for (let j = 0; j < ny; j++) {
      const y = Y1 + (j + .5) * dy, z1 = G.z1(x, y), z2 = G.z2(x, y); if (z2 <= z1) continue;
      if (!f) { S += (z2 - z1) * dx * dy; continue; }
      const dz = (z2 - z1) / nz; for (let k = 0; k < nz; k++) S += f(x, y, z1 + (k + .5) * dz) * dx * dy * dz;
    }
  }
  return S;
}
L.solidoXY = (o = {}) => {
  const geo = p => typeof o.geo === 'function' ? o.geo(p) : o.geo;
  const ctl = [
    { type: 'play', k: 'build', label: 'Fatiar', dur: o.dur || 3.5 },
    { k: 'build', label: 'x varrido', min: 0, max: 1, step: .01, value: 1, show: v => Math.round(v * 100) + '%' },
    { k: 'pilar', type: 'toggle', label: 'Pilar dz', value: 0 },
    { k: 'sombra', type: 'toggle', label: 'Sombra D', value: 0 }];
  if (o.fatias) ctl.push({ k: 'fatia', type: 'seg', label: 'Fatia', options: o.fatias }, { k: 'pos', label: 'posição', min: 0, max: 1, step: .01, value: .5, show: v => Math.round(v * 100) + '%' });
  return {
    h: o.h || 400, alt: o.alt || 'Sólido em coordenadas cartesianas', view: Object.assign({ yaw: -.65, pitch: .42, size: o.size || 6, center: o.centro || [1, 1, .8] }, o.view || {}),
    controls: [...(o.semCtl ? [] : ctl), ...(o.controls || [])], autoplay: o.autoplay === false ? null : 'build',
    init(st) { st.p.build = o.autoplay === false ? 1 : 0; st.p.pilar = o.pilar || 0; st.p.sombra = o.sombra || 0; st.p.fatia = o.fatia || 0; st.p.pos = .5; st.cache = {}; },
    draw(g, st) {
      const p = st.p, G = geo(p), a = G.x[0], b = lerp(G.x[0], G.x[1], p.build);
      g.axes(o.ax || [G.x[1] + .8, (o.ymax || 2) + .8, (o.zmax || 2) + .8], { neg: .3 });
      if (o.chao !== false) g.floorGrid(-.2, Math.ceil(G.x[1]) + .2, -.2, Math.ceil(o.ymax || 2) + .2, { step: o.passo || .5 });
      const alpha = p.fatia ? .3 : (o.alpha ?? .86), cf = o.cor ? (q => V.heat(o.cor(q, p))) : null;
      const nx = o.nx || 14, ny = o.ny || 10, nz = 5, Yv = (x, v) => lerp(G.y1(x), G.y2(x), v);
      const so = (col, ex) => Object.assign({ color: col, alpha, colorFn: cf }, ex || {});
      if (b - a > 1e-3) {
        g.surf((u, v) => { const x = lerp(a, b, u), y = Yv(x, v); return [x, y, G.z2(x, y)]; }, [0, 1, nx], [0, 1, ny], so('blood'));
        g.surf((u, v) => { const x = lerp(a, b, u), y = Yv(x, v); return [x, y, G.z1(x, y)]; }, [0, 1, nx], [0, 1, ny], so('rust'));
        for (const yf of [G.y1, G.y2]) g.surf((u, v) => { const x = lerp(a, b, u), y = yf(x); return [x, y, lerp(G.z1(x, y), G.z2(x, y), v)]; }, [0, 1, nx], [0, 1, nz], so('blood', { light: .8 }));
        for (const x of [a, b]) g.surf((u, v) => { const y = Yv(x, u); return [x, y, lerp(G.z1(x, y), G.z2(x, y), v)]; }, [0, 1, ny], [0, 1, nz], so(x === b && p.build < .999 ? 'amp' : 'blood', { light: .9 }));
      }
      if (p.sombra) {
        g.surf((u, v) => { const x = lerp(G.x[0], G.x[1], u); return [x, Yv(x, v), 0]; }, [0, 1, 24], [0, 1, 6], { color: 'amp', alpha: .42, shade: false, mesh: false, bias: 20 });
        const edge = []; for (let i = 0; i <= 40; i++) { const x = lerp(G.x[0], G.x[1], i / 40); edge.push([x, G.y2(x), 0]); } for (let i = 40; i >= 0; i--) { const x = lerp(G.x[0], G.x[1], i / 40); edge.push([x, G.y1(x), 0]); } edge.push(edge[0]);
        g.line(edge, { color: 'amp', lw: 2.4, bias: 19 }); g.label([lerp(G.x[0], G.x[1], .35), Yv(lerp(G.x[0], G.x[1], .35), .5), 0], o.rotSombra || 'D (planta baixa)', { color: 'amp', dy: 16 });
      }
      if (p.pilar) {
        const x0 = lerp(G.x[0], G.x[1], o.pilarU ?? .45), y0 = Yv(x0, o.pilarV ?? .45), z1 = G.z1(x0, y0), z2 = G.z2(x0, y0), w = .05 * (o.size || 6) / 6;
        g.box(x0 - w, x0 + w, y0 - w, y0 + w, z1, z2, { color: 'amp', bias: -1000 });
        g.dot([x0, y0, z1], { color: 'volt', r: 5, bias: -1001 }); g.dot([x0, y0, z2], { color: 'volt', r: 5, bias: -1001 });
        g.label([x0, y0, z2], o.zTopo || 'teto', { color: 'volt', dy: -14 }); g.label([x0, y0, z1], o.zBase || 'chão', { color: 'volt', dy: 14 });
      }
      if (p.fatia && o.fatias) {
        const modo = o.fatias.find(f => f[0] === p.fatia)[0];
        let poly = [], txt = '';
        if (modo === 'x') { const x0 = lerp(G.x[0], G.x[1], clamp(p.pos, .02, .98)); for (let i = 0; i <= 24; i++) { const y = Yv(x0, i / 24); poly.push([x0, y, G.z1(x0, y)]); } for (let i = 24; i >= 0; i--) { const y = Yv(x0, i / 24); poly.push([x0, y, G.z2(x0, y)]); } txt = 'x = ' + V.fmt(x0); }
        else if (o.fatiaPoly) { const r = o.fatiaPoly(modo, p.pos, G); poly = r.poly; txt = r.txt; }
        if (poly.length > 2) { g.poly(poly, { color: 'amp', alpha: .92, shade: false, stroke: 'ink', lw: 1.5, bias: -800 }); g.label(poly[0], txt, { color: 'amp', dy: 16 }); }
      }
      if (o.extra) o.extra(g, st, G);
    },
    read: st => {
      const p = st.p, G = geo(p), key = JSON.stringify([p.build, ...(o.chaves || []).map(k => p[k])]);
      if (st.cache.k !== key) { st.cache.k = key; st.cache.v = integXY(G, lerp(G.x[0], G.x[1], p.build), o.f ? (x, y, z) => o.f(x, y, z, p) : null); }
      const rows = [[o.rotulo || 'Volume (numérico)', V.fmt(st.cache.v, 3), 1]];
      if (o.exato) rows.push(['Exato', typeof o.exato === 'function' ? o.exato(p) : o.exato]);
      if (o.lerMais) rows.push(...o.lerMais(p));
      return rows;
    }
  };
};

/* ---- soma de Riemann numa caixa ---- */
L.riemann = (o = {}) => ({
  h: o.h || 400, alt: 'Caixa dividida em cubinhos', view: { yaw: -.7, pitch: .45, size: o.size || 6.5, center: [(o.x[0] + o.x[1]) / 2, (o.y[0] + o.y[1]) / 2, (o.z[0] + o.z[1]) / 2] },
  controls: [{ k: 'n', label: 'cortes por eixo', min: 1, max: o.max || 8, step: 1, value: o.n || 3 }, { type: 'play', k: 'n', label: 'Refinar', dur: 5 }],
  draw(g, st) {
    const n = Math.round(st.p.n), [x0, x1] = o.x, [y0, y1] = o.y, [z0, z1] = o.z, dx = (x1 - x0) / n, dy = (y1 - y0) / n, dz = (z1 - z0) / n;
    g.axes([x1 + .7, y1 + .7, z1 + .7], { neg: .3 });
    const fm = o.fmax || 1, gap = n > 1 ? .12 : .02;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
      const cx = x0 + (i + .5) * dx, cy = y0 + (j + .5) * dy, cz = z0 + (k + .5) * dz, v = o.f(cx, cy, cz);
      g.box(cx - dx * (1 - gap) / 2, cx + dx * (1 - gap) / 2, cy - dy * (1 - gap) / 2, cy + dy * (1 - gap) / 2, cz - dz * (1 - gap) / 2, cz + dz * (1 - gap) / 2, { color: V.heat(.15 + .85 * v / fm), alpha: .92, mesh: true });
    }
  },
  read: st => {
    const n = Math.round(st.p.n), [x0, x1] = o.x, [y0, y1] = o.y, [z0, z1] = o.z, dx = (x1 - x0) / n, dy = (y1 - y0) / n, dz = (z1 - z0) / n; let S = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) S += o.f(x0 + (i + .5) * dx, y0 + (j + .5) * dy, z0 + (k + .5) * dz) * dx * dy * dz;
    return [['Soma dos cubinhos', V.fmt(S, 4), 1], ['Exato', o.exatoTxt || V.fmt(o.exato, 4)], ['Cubinhos', (n ** 3).toLocaleString('pt-BR')], ['Erro', V.fmt(Math.abs(S - o.exato) / Math.abs(o.exato) * 100, 2) + '%']];
  }
});

/* ---- voxels: aproximar um sólido por cubinhos ---- */
L.voxels = (o = {}) => ({
  h: o.h || 400, alt: 'Sólido aproximado por cubinhos', view: { yaw: -.7, pitch: .45, size: o.size || 6, center: o.centro || [0, 0, .6] },
  controls: [{ k: 'n', label: 'resolução', min: 3, max: o.max || 16, step: 1, value: o.n || 6 }, { type: 'play', k: 'n', label: 'Refinar', dur: 5 }, ...(o.dens ? [{ k: 'dens', type: 'toggle', label: o.densLabel || 'Densidade', value: 0 }] : [])],
  init(st) { st.cache = {}; },
  draw(g, st) {
    const n = Math.round(st.p.n), [[x0, x1], [y0, y1], [z0, z1]] = o.b, dx = (x1 - x0) / n, dy = (y1 - y0) / n, nz = Math.max(1, Math.round(n * (z1 - z0) / (x1 - x0))), dz = (z1 - z0) / nz;
    if (st.cache.n !== n) { const A = new Uint8Array(n * n * nz); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < nz; k++) A[(i * n + j) * nz + k] = o.inside(x0 + (i + .5) * dx, y0 + (j + .5) * dy, z0 + (k + .5) * dz) ? 1 : 0; st.cache = { n, A, nz }; }
    const A = st.cache.A, at = (i, j, k) => i < 0 || j < 0 || k < 0 || i >= n || j >= n || k >= nz ? 0 : A[(i * n + j) * nz + k];
    if (o.contorno) o.contorno(g);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < nz; k++) {
      if (!at(i, j, k)) continue;
      const cx = x0 + (i + .5) * dx, cy = y0 + (j + .5) * dy, cz = z0 + (k + .5) * dz;
      const col = st.p.dens ? V.heat(.2 + .8 * o.dens(cx, cy, cz)) : V.A.amp;
      g.box(cx - dx / 2, cx + dx / 2, cy - dy / 2, cy + dy / 2, cz - dz / 2, cz + dz / 2, { color: col, mesh: true }, [at(i + 1, j, k), at(i - 1, j, k), at(i, j + 1, k), at(i, j - 1, k), at(i, j, k + 1), at(i, j, k - 1)]);
    }
  },
  read: st => {
    const c = st.cache; if (!c.A) return [];
    const [[x0, x1], [y0, y1], [z0, z1]] = o.b, n = c.n, dx = (x1 - x0) / n, dy = (y1 - y0) / n, dz = (z1 - z0) / c.nz; let cnt = 0, M = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < c.nz; k++) if (c.A[(i * n + j) * c.nz + k]) { cnt++; if (o.dens) M += o.densReal(x0 + (i + .5) * dx, y0 + (j + .5) * dy, z0 + (k + .5) * dz); }
    const dV = dx * dy * dz;
    const rows = [['Cubinhos', cnt.toLocaleString('pt-BR')], [st.p.dens ? 'Massa ≈ Σ δ·dV' : 'Volume ≈ nº × dV', V.fmt(st.p.dens ? M * dV : cnt * dV, 3), 1], ['Exato', st.p.dens ? o.massaTxt : o.exatoTxt]];
    return rows;
  }
});

/* ---- elemento de volume cilíndrico ---- */
L.elemento = (o = {}) => ({
  h: o.h || 400, alt: 'Elemento de volume em coordenadas cilíndricas', view: { yaw: -.95, pitch: .62, size: 6, center: [0.6, 1, .3] },
  controls: [{ k: 'r', label: 'r', min: .3, max: 3, step: .01, value: o.r ?? 2 }, { k: 'dr', label: 'dr', min: .1, max: .8, step: .01, value: .5 }, { k: 'dth', label: 'dθ', min: .1, max: .9, step: .01, value: .45, show: V.deg }, { k: 'cmp', type: 'toggle', label: 'Comparar com perto do eixo', value: 1 }, { type: 'play', k: 'r', label: 'Afastar do eixo', dur: 4, mode: 'ping', min: .3, max: 3 }],
  draw(g, st) {
    const { r, dr, dth } = st.p, t0 = .5, dz = .6;
    g.floorPolar(3.5, { step: .5 }); g.axes(4);
    const cell = (r, col, al) => {
      const r2 = r + dr, t1 = t0 + dth, o2 = { color: col, alpha: al, mesh: false, stroke: 'ink', lw: 1 };
      g.surf((u, v) => cyl(r, lerp(t0, t1, u), v * dz), [0, 1, 8], [0, 1, 1], { color: col, alpha: al });
      g.surf((u, v) => cyl(r2, lerp(t0, t1, u), v * dz), [0, 1, 8], [0, 1, 1], { color: col, alpha: al });
      g.surf((u, v) => cyl(lerp(r, r2, v), lerp(t0, t1, u), dz), [0, 1, 8], [0, 1, 1], { color: col, alpha: al, light: 1.15 });
      g.surf((u, v) => cyl(lerp(r, r2, v), lerp(t0, t1, u), 0), [0, 1, 8], [0, 1, 1], { color: col, alpha: al });
      for (const t of [t0, t1]) g.poly([cyl(r, t, 0), cyl(r2, t, 0), cyl(r2, t, dz), cyl(r, t, dz)], o2);
    };
    if (st.p.cmp && r > .45 + dr) cell(.3, 'volt', .9);
    cell(r, 'amp', .95);
    g.seg([0, 0, 0], cyl(r, t0, 0), { color: 'blood', lw: 3, bias: -5 }); g.label(cyl(r / 2, t0, 0), 'r', { color: 'blood', dy: 14 });
    g.arc([0, 0, dz], r + dr, t0, t0 + dth, 'xy', { color: 'ink', lw: 3, bias: -6 }); g.label(cyl(r + dr, t0 + dth / 2, dz), 'arco = r·dθ', { color: 'ink', dx: 10 });
    g.label(cyl(r + dr / 2, t0, 0), 'dr', { color: 'amp', dy: 16 }); g.label(cyl(r + dr, t0, dz / 2), 'dz', { color: 'amp', dx: 10 });
  },
  read: st => { const { r, dr, dth } = st.p, dz = .6, ex = dth / 2 * ((r + dr) ** 2 - r * r) * dz, ap = (r + dr / 2) * dr * dth * dz, perto = dth / 2 * ((.3 + dr) ** 2 - .09) * dz; return [['Volume do pedaço', V.fmt(ex, 3), 1], ['r·dr·dθ·dz', V.fmt(ap, 3)], ['vezes maior que o do eixo', V.fmt(ex / perto, 1) + '×']]; }
});

/* ---- traçado polar r(θ) no chão + paredes ---- */
L.polarTraco = (o = {}) => ({
  h: o.h || 400, alt: 'Curva polar sendo traçada', view: { yaw: -.5, pitch: .78, size: o.size || 7.5, center: o.centro || [0, 0, .5] },
  controls: [{ k: 'tr', label: 'θ percorrido', min: 0, max: 1, step: .005, value: 1, show: v => V.deg(lerp(o.th[0], o.th[1], v)) }, { type: 'play', k: 'tr', label: 'Traçar', dur: 4 }, { k: 'par', type: 'toggle', label: 'Levantar paredes', value: 0 }],
  autoplay: 'tr',
  init(st) { st.p.tr = 0; st.p.par = o.par || 0; st.wall = 0; },
  draw(g, st, T, dt) {
    const [a, b] = o.th, tc = lerp(a, b, st.p.tr), n = 120, pt = t => { const r = o.rf(t); return [r * Math.cos(t), r * Math.sin(t)]; };
    g.floorGrid(-3, 4.5, -3, 3, { step: 1 }); g.axes(4.5, { neg: 3 });
    st.wall = lerp(st.wall, st.p.par ? 1 : 0, Math.min(1, dt * 4));
    if (st.wall > .01) g.surf((u, v) => { const [x, y] = pt(lerp(a, b, u)); return [x, y, v * (o.h3 || 2) * st.wall]; }, [0, 1, 48], [0, 1, 4], { color: 'volt', alpha: .55 });
    const pts = []; for (let i = 0; i <= n; i++) { const t = lerp(a, tc, i / n), [x, y] = pt(t); pts.push([x, y, 0]); }
    g.line(pts, { color: 'blood', lw: 3.5, bias: -2 });
    const [x, y] = pt(tc); g.seg([0, 0, 0], [x, y, 0], { color: 'amp', lw: 2, bias: -3 }); g.dot([x, y, 0], { color: 'amp', r: 6, bias: -4 });
    if (o.centro2) { g.dot([...o.centro2, 0], { color: 'ink', r: 4, bias: -4 }); g.label([...o.centro2, 0], o.rotCentro || 'centro', { color: 'ink', dy: 14 }); }
  },
  read: st => { const t = lerp(o.th[0], o.th[1], st.p.tr), r = o.rf(t); return [['θ', V.deg(t)], ['r(θ)', V.fmt(r)], ['curva', o.eq || '', 1]]; }
});

/* ---- esfera esticada em elipsoide (Jacobiano) ---- */
L.elipsoide = (o = {}) => ({
  h: o.h || 400, alt: 'Esfera unitária esticada em elipsoide', view: { yaw: -.8, pitch: .35, size: 7.5 },
  controls: [{ k: 'a', label: 'a', min: .5, max: 2.6, step: .05, value: o.a ?? 2.2 }, { k: 'b', label: 'b', min: .5, max: 2.6, step: .05, value: o.b ?? 1.4 }, { k: 'c', label: 'c', min: .5, max: 2.6, step: .05, value: o.c ?? 1 }, { k: 't', label: 'esticar', min: 0, max: 1, step: .01, value: 1, show: v => Math.round(v * 100) + '%' }, { type: 'play', k: 't', label: 'Encher a bexiga', dur: 3, mode: 'once' }],
  autoplay: 't', init(st) { st.p.t = 0; },
  draw(g, st) {
    const { a, b, c, t } = st.p, A = lerp(1, a, t), B = lerp(1, b, t), C = lerp(1, c, t);
    g.axes(3.2);
    g.surf((u, v) => [Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)], [0, TAU, 24], [0, Math.PI, 12], { wire: true, color: 'mute', alpha: .6, lw: 1, every: 2 });
    g.surf((u, v) => [A * Math.sin(v) * Math.cos(u), B * Math.sin(v) * Math.sin(u), C * Math.cos(v)], [0, TAU, 36], [0, Math.PI, 18], { colorFn: p => V.heat(.35 + .4 * (p[2] / (C || 1) + 1) / 2), alpha: .78 });
    const s = .22; g.box(.2 * A, (.2 + s) * A, .2 * B, (.2 + s) * B, -.1 * C, (-.1 + s) * C, { color: 'volt', bias: -900, cull: true });
    g.label([(.2 + s) * A, (.2 + s) * B, (-.1 + s) * C], 'cubinho × abc', { color: 'volt', dx: 10 });
  },
  read: st => { const { a, b, c, t } = st.p, A = lerp(1, a, t), B = lerp(1, b, t), C = lerp(1, c, t); return [['Jacobiano = a·b·c', V.fmt(A * B * C), 1], ['Volume = 4/3·π·abc', V.fmt(4 / 3 * Math.PI * A * B * C, 3)], ['Esfera unitária', V.fmt(4 / 3 * Math.PI, 3)]]; }
});

/* ---- bola cortada, camadas de cebola (esféricas) ---- */
L.cebola = (o = {}) => {
  const f = o.f || (s => Math.exp(s ** 3)), F = o.F || (s => 4 * Math.PI / 3 * (Math.exp(s ** 3) - 1)), fmax = f(1), fmin = f(0);
  return {
    h: o.h || 400, alt: 'Bola cortada em camadas', auto: false, view: { yaw: -2.36, pitch: .35, size: 3.3 },
    controls: [{ k: 'rho', label: 'ρ', min: .02, max: 1, step: .01, value: .6 }, { type: 'play', k: 'rho', label: 'Encher camadas', dur: 4 }],
    draw(g, st) {
      const rho = st.p.rho, col = s => V.heat(.15 + .85 * (f(s) - fmin) / (fmax - fmin));
      g.axes(1.5);
      g.surf((u, v) => [rho * Math.sin(v) * Math.cos(u), rho * Math.sin(v) * Math.sin(u), rho * Math.cos(v)], [Math.PI / 2, TAU, 30], [0, Math.PI, 16], { color: col(rho), alpha: .95 });
      for (const t of [0, Math.PI / 2]) g.surf((u, v) => { const s = u * rho; return cyl(s * Math.sin(v), t, s * Math.cos(v)); }, [0, 1, 10], [0, Math.PI, 16], { colorFn: p => col(Math.hypot(...p)), alpha: 1, mesh: false });
      g.surf((u, v) => [Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)], [0, TAU, 24], [0, Math.PI, 12], { wire: true, color: 'mute', alpha: .35, lw: 1, every: 2 });
    },
    read: st => [['ρ', V.fmt(st.p.rho)], [o.fLabel || 'e^(ρ³)', V.fmt(f(st.p.rho), 3)], ['Acumulado até ρ', V.fmt(F(st.p.rho), 3), 1], ['Total (ρ = 1)', V.fmt(F(1), 3)]]
  };
};
})();
