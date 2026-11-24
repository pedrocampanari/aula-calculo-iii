/* teoria.js — animações da página de teoria (index.html) */
(() => {
'use strict';
const { TAU, lerp, clamp, fmt, lib, cyl } = V;
const $ = s => document.querySelector(s);

/* ---------- herói: casquinha + lata girando em wireframe ---------- */
(() => {
  const cv = $('#hero-cv'); if (!cv) return;
  const c = cv.getContext('2d'); let yaw = 0, last = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loop = now => {
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; if (!reduce) yaw += dt * .22;
    const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
    const wide = w > 820;
    const g = new V.G3(c, w, h, { yaw, pitch: .32, zoom: wide ? 1.15 : .9, size: 6, center: [wide ? -1.9 : 0, 0, .9] });
    g.surf((u, v) => cyl(v, u, v), [0, TAU, 36], [0, Math.SQRT1_2 * 1.9, 6], { wire: true, color: 'blood', alpha: .55, lw: 1.1 });
    g.surf((u, v) => cyl(1.9 * Math.sin(v), u, 1.9 * Math.cos(v)), [0, TAU, 36], [0, Math.PI / 4, 5], { wire: true, color: 'amp', alpha: .6, lw: 1.1 });
    g.surf((u, v) => cyl(2.6, u, v), [0, TAU, 48], [-1.2, 2.6, 8], { wire: true, color: 'rust', alpha: .45, lw: 1 });
    const t = now / 1000; g.dot(cyl(2.6, t * .9, .7 + Math.sin(t * .7) * 1.4), { color: 'volt', r: 5 });
    g.flush(); requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();

/* ---------- 01 farol ---------- */
V.mount('#v-farol', lib.ponto({ ctl: true, farol: true, r: 2.5, th: 1.05, z: 1.6, nome: 'drone', size: 7.5, center: [0, 0, .6] }));

/* ---------- 02 armadilha do quadrante ---------- */
V.mount('#v-relogio', {
  type: '2d', h: 400, alt: 'Ponto arrastável mostrando o ângulo correto e o ângulo da calculadora', hint: 'arraste o ponto',
  controls: [{ k: 'pre', type: 'seg', label: 'Pontos', options: [[0, '(1, 1)'], [1, '(−2, 2√3)'], [2, '(−1, −1)'], [3, '(1, −√3)'], [4, '(0, −5)']] }],
  init(st) { st.p.x = -2; st.p.y = 2 * Math.sqrt(3); st.p.pre = 1; },
  change(st, k, v) { if (k === 'pre' && v >= 0) { const P = [[1, 1], [-2, 2 * Math.sqrt(3)], [-1, -1], [1, -Math.sqrt(3)], [0, -5]][v]; st.p.x = P[0]; st.p.y = P[1]; } },
  pointer(st, px, py, type, m) { const g = st.g; if (!g) return; let x = g.ix(px), y = g.iy(py); x = clamp(Math.round(x * 10) / 10, -5.4, 5.4); y = clamp(Math.round(y * 10) / 10, -5.4, 5.4); st.p.x = x; st.p.y = y; m.set('pre', -1); },
  draw(g, st, T) {
    st.g = g.frame(-5.6, 5.6, -5.6, 5.6, { pad: 18 }); g.grid(1); g.axes();
    const { x, y } = st.p, R = Math.hypot(x, y);
    for (const [q, qx, qy] of [['1º Q', 3.6, 4.8], ['2º Q', -4.6, 4.8], ['3º Q', -4.6, -4.8], ['4º Q', 3.6, -4.8]]) g.text(q, qx, qy, 'mute');
    if (R < .05) return;
    const th = (Math.atan2(y, x) + TAU) % TAU, naive = x !== 0 ? Math.atan(y / x) : (y > 0 ? Math.PI / 2 : -Math.PI / 2);
    const L = 7; g.seg(-L * Math.cos(th), -L * Math.sin(th), L * Math.cos(th), L * Math.sin(th), 'amp', 1.2, [2, 5], .7);
    const arc = (a0, a1, r, col, lw, dash) => { const pts = []; const n = 40; for (let i = 0; i <= n; i++) { const t = lerp(a0, a1, i / n); pts.push([r * Math.cos(t), r * Math.sin(t)]); } g.line(pts, col, lw, dash); };
    arc(0, naive, 1.1, 'mute', 2, [4, 4]); arc(0, th, 1.6, 'blood', 3);
    const nr = Math.max(R, 1.5); g.seg(0, 0, nr * Math.cos(naive), nr * Math.sin(naive), 'mute', 2.5, [6, 5]);
    g.seg(0, 0, x, y, 'blood', 4);
    g.text('calculadora', nr * Math.cos(naive), nr * Math.sin(naive), 'mute', 'left', 8, 12);
    g.dot(x, y, 8, 'blood'); g.text('P', x, y, 'ink', 'left', 10, -12);
  },
  read(st) {
    const { x, y } = st.p, th = (Math.atan2(y, x) + TAU) % TAU, nv = x !== 0 ? Math.atan(y / x) : NaN;
    const q = x > 0 && y >= 0 ? '1º' : x <= 0 && y > 0 ? '2º' : x < 0 && y <= 0 ? '3º' : '4º';
    return [['(x, y)', '(' + fmt(x, 1) + '; ' + fmt(y, 1) + ')'], ['tan θ = y/x', x !== 0 ? fmt(y / x) : '∄ (x = 0)'], ['calculadora', Number.isFinite(nv) ? V.pi(nv) : 'erro'], ['θ correto', V.pi(th), 1], ['quadrante', x === 0 || y === 0 ? 'sobre eixo' : q]];
  }
});

/* ---------- 03 galeria de superfícies ---------- */
const ANALOG = {
  cil: ['r = c', 'Uma <b>lata de refrigerante</b> infinita: todos os pontos estão à mesma distância c do eixo z. θ e z ficam livres.'],
  semi: ['θ = c', 'Uma <b>porta giratória</b> parada, ou a faca no corte da pizza: uma parede que sai do eixo z na direção θ = c.'],
  plano: ['z = c', 'O <b>piso de um andar</b> do prédio: altura fixa, r e θ livres.'],
  cone: ['z = r', 'Uma <b>casquinha de sorvete</b>: quanto mais longe do eixo, mais alto. A altura cresce igual ao raio.'],
  parab: ['z = r²', 'Uma <b>antena parabólica</b> ou tigela: sobe devagar perto do centro e rápido na borda.'],
  esfera: ['r² + z² = R²', 'A <b>bola</b>: troque x² + y² por r² na equação da esfera e pronto.'],
  cos: ['r = 2a cos θ', 'Um <b>cano encostado no eixo z</b>: cilindro de raio a com centro em (a, 0). O eixo passa pela parede, não pelo meio.'],
  sin: ['r = 2a sen θ', 'O mesmo cano, agora encostado do lado do eixo y: centro em (0, a).'],
  sela: ['z = r² cos 2θ', 'Uma <b>sela de cavalo</b> (ou batata Pringles): sobe na direção x, desce na direção y. Em cartesianas, z = x² − y².']
};
const capG = $('#cap-galeria');
const pick = k => { if (capG) capG.innerHTML = `<b style="color:var(--amp)">${ANALOG[k][0]}</b> — ${ANALOG[k][1]}`; };
V.mount('#v-galeria', lib.galeria({ itens: ['cil', 'semi', 'plano', 'cone', 'parab', 'esfera', 'cos', 'sin', 'sela'], onPick: pick, semRead: true }));
pick('cil');

/* ---------- 04 truques: r = 4 cos θ ---------- */
V.mount('#v-truque', lib.polarTraco({ rf: t => 4 * Math.cos(t), th: [-Math.PI / 2, Math.PI / 2], centro2: [2, 0], rotCentro: 'centro (2, 0)', eq: 'x² + y² = 4x', centro: [1.5, 0, .5] }));

/* ---------- 05 pizza e carrossel ---------- */
V.mount('#v-pizza', {
  type: '2d', h: 400, alt: 'Pizza cortada em fatias e anéis: pedaços da borda são maiores',
  controls: [{ k: 'k', label: 'anel', min: 1, max: 5, step: 1, value: 5 }, { k: 'gira', type: 'toggle', label: 'Carrossel', value: 1 }],
  init(st) { st.ang = 0; },
  draw(g, st, T, dt) {
    const N = 5, M = 12, dr = 1, dth = TAU / M, k = st.p.k;
    g.frame(-5.6, 5.6, -5.4, 5.4, { pad: 14 });
    if (st.p.gira) st.ang += dt * .5;
    const wedge = (i, j, col, a) => { const r0 = i * dr, r1 = (i + 1) * dr, t0 = j * dth + st.ang, t1 = t0 + dth, pts = []; for (let s = 0; s <= 10; s++) pts.push([r1 * Math.cos(lerp(t0, t1, s / 10)), r1 * Math.sin(lerp(t0, t1, s / 10))]); for (let s = 10; s >= 0; s--) pts.push([r0 * Math.cos(lerp(t0, t1, s / 10)), r0 * Math.sin(lerp(t0, t1, s / 10))]); g.fill(pts, col, a); g.line([...pts, pts[0]], 'bg', 2); };
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) wedge(i, j, i % 2 ? 'rust' : 'panel2', i % 2 ? .55 : 1);
    wedge(0, 1, 'volt', .95); wedge(k - 1, 1, 'amp', .95);
    g.circle(0, 0, N, 'amp', 3);
    const tr = (r, col) => { const t1 = st.ang + 2.2 * dth, t0 = t1 - 2 * dth, pts = []; for (let s = 0; s <= 24; s++) { const t = lerp(t0, t1, s / 24); pts.push([r * Math.cos(t), r * Math.sin(t)]); } g.line(pts, col, 4); g.dot(r * Math.cos(t1), r * Math.sin(t1), 7, col); };
    if (st.p.gira) { tr(.5, 'volt'); tr(k - .5, 'amp'); }
    const mid = (r, col, txt) => { const t = st.ang + 1.5 * dth, c = g.c; c.font = '700 13px "JetBrains Mono", monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(txt, g.X(r * Math.cos(t)), g.Y(r * Math.sin(t))); };
    mid(.5, 'bg', '1×'); mid(k - .5, 'bg', (2 * k - 1) + '×');
  },
  read(st) { const k = st.p.k, dth = TAU / 12, a1 = dth / 2 * 1, ak = dth / 2 * (k * k - (k - 1) ** 2); return [['pedaço do centro', fmt(a1, 3)], ['pedaço do anel ' + k, fmt(ak, 3), 1], ['proporção', fmt(ak / a1, 0) + '× maior'], ['≈ r·Δr·Δθ (r no meio)', fmt((k - .5) * dth, 3)]]; }
});
V.mount('#v-elemento', lib.elemento());

/* ---------- 06 quiz do torno ---------- */
(() => {
  const box = $('#quiz-torno'), sc = $('#quiz-score'); if (!box) return;
  const itens = [['Lata de refrigerante', 'c', 'Tem eixo central: r ≤ a, 0 ≤ z ≤ h.'], ['Tijolo', 'x', 'Cara de caixa: limites constantes em x, y, z.'], ['Funil', 'c', 'Cone feito no torno: z = r.'], ['Caixa de sapato', 'x', 'Comprimento × largura × altura.'], ['Vaso de cerâmica', 'c', 'Feito na roda de oleiro: perfil r(z) girado.'], ['Dado', 'x', 'Um cubo: cartesianas são perfeitas.'], ['Parafuso', 'c', 'Corpo cilíndrico girado no torno.'], ['Pirâmide de base quadrada', 'x', 'Faces planas, base quadrada: cartesianas.'], ['Casquinha de sorvete', 'c', 'Cone + calota: cilíndricas (ou esféricas).'], ['Prateleira', 'x', 'Placas retangulares: cartesianas.']];
  let ok = 0, done = 0;
  for (const [nome, cert, why] of itens) {
    const d = document.createElement('div'); d.className = 'qcard';
    d.innerHTML = `<h4>${nome}</h4><div class="qb"><button class="vbtn" data-v="c" type="button">Cilíndricas</button><button class="vbtn" data-v="x" type="button">Cartesianas</button></div><p class="qf">Cabe num torno?</p>`;
    d.querySelectorAll('button').forEach(b => b.onclick = () => {
      if (d.dataset.done) return; d.dataset.done = 1; done++;
      const right = b.dataset.v === cert; if (right) ok++;
      b.setAttribute('aria-pressed', 'true'); d.classList.add(right ? 'ok' : 'no');
      d.querySelector('.qf').textContent = (right ? 'Isso aí! ' : 'Quase. ') + why;
      sc.textContent = `Placar: ${ok}/${done}` + (done === itens.length ? (ok === itens.length ? ' — gabaritou!' : ' — clique em "Recomeçar" e tente de novo') : '');
    });
    box.appendChild(d);
  }
  $('#quiz-reset').onclick = () => { ok = done = 0; sc.textContent = 'Placar: 0/0'; box.querySelectorAll('.qcard').forEach(d => { delete d.dataset.done; d.className = 'qcard'; d.querySelector('.qf').textContent = 'Cabe num torno?'; d.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false')); }); };
})();

/* ---------- 07 roteiro ---------- */
const mRot = V.mount('#v-roteiro', lib.solidoCil({
  geo: { th: [0, TAU], r2: () => Math.sqrt(3), z1: r => r * r / 2, z2: r => 3 - r * r / 2 },
  exato: '9π/2 ≈ 14,137', zTopo: 'teto: z = 3 − r²/2', zBase: 'piso: z = r²/2', rotSombra: 'sombra: disco r ≤ √3', cz: 1.4, size: 7, autoplay: false, R: 2
}));
document.querySelectorAll('[data-rot]').forEach(b => b.onclick = () => {
  const s = +b.dataset.rot; document.querySelectorAll('[data-rot]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  mRot.set('pilar', s >= 1 ? 1 : 0); mRot.set('sombra', s >= 2 ? 1 : 0);
  if (s === 3) mRot.play('build'); else { mRot.stopAnim(); mRot.set('build', 1); }
});

/* ---------- 08 bolo ---------- */
V.mount('#v-bolo', lib.voxels({
  b: [[-1.6, 1.6], [-1.6, 1.6], [0, 1.2]], inside: (x, y, z) => x * x + y * y <= 2.56, n: 6, max: 18,
  dens: (x, y, z) => z / 1.2, densReal: (x, y, z) => 1 + z, densLabel: 'Recheio (densidade)',
  exatoTxt: 'π·1,6²·1,2 ≈ 9,651', massaTxt: '≈ 15,441',
  contorno: g => g.surf((u, v) => cyl(1.6, u, v), [0, TAU, 40], [0, 1.2, 1], { wire: true, color: 'mute', alpha: .5, lw: 1 }), centro: [0, 0, .5], size: 4.8
}));

/* ---------- 08 patinadora ---------- */
V.mount('#v-patina', {
  type: '2d', h: 380, alt: 'Patinadora vista de cima girando mais rápido ao encolher os braços',
  controls: [{ k: 'd', label: 'braços', min: .25, max: 1.6, step: .01, value: 1.6, show: v => fmt(v) + ' m' }, { type: 'play', k: 'd', label: 'Abrir e fechar', dur: 6, mode: 'ping', min: 1.6, max: .25 }],
  init(st) { st.phi = 0; st.trail = []; },
  draw(g, st, T, dt) {
    const d = st.p.d, I0 = 1.2, m = 3, I = I0 + 2 * m * d * d, Iopen = I0 + 2 * m * 1.6 * 1.6, w = Iopen * 1.1 / I;
    st.phi += w * dt; g.frame(-2.2, 2.2, -2.2, 2.2, { pad: 10 });
    for (let r = .5; r <= 2; r += .5) g.circle(0, 0, r, 'line', 1);
    st.trail.push([st.phi, d]); if (st.trail.length > 40) st.trail.shift();
    st.trail.forEach(([p, dd], i) => { const a = i / st.trail.length * .6; for (const s of [0, Math.PI]) { g.c.globalAlpha = a; g.dot(dd * Math.cos(p + s), dd * Math.sin(p + s), 3, 'blood'); } }); g.c.globalAlpha = 1;
    for (const s of [0, Math.PI]) { const x = d * Math.cos(st.phi + s), y = d * Math.sin(st.phi + s); g.seg(0, 0, x, y, 'bone', 6); g.dot(x, y, 11, 'blood'); }
    g.c.beginPath(); g.c.arc(g.X(0), g.Y(0), .32 * g.sx, 0, TAU); g.c.fillStyle = V.rgba('amp'); g.c.fill();
    g.dot(.18 * Math.cos(st.phi + Math.PI / 2), .18 * Math.sin(st.phi + Math.PI / 2), 6, 'ink');
    g.text('vista de cima', -2.1, 2.05, 'mute');
  },
  read(st) { const d = st.p.d, I = 1.2 + 6 * d * d, Io = 1.2 + 6 * 2.56; return [['I = ∭ r² δ dV', fmt(I, 2) + ' kg·m²'], ['velocidade de giro', fmt(Io / I, 1) + '×', 1], ['massa nos braços', '2 × 3 kg']]; }
});

/* ---------- 09 cartesianas ---------- */
V.mount('#v-caixa', lib.riemann({ x: [0, 1], y: [0, 2], z: [0, 3], f: (x, y, z) => x * y * z, fmax: 6, exato: 4.5, exatoTxt: '½ · 2 · 9/2 = 4,5', n: 3 }));
V.mount('#v-predio', lib.solidoXY({
  geo: { x: [0, 2.5], y1: () => 0, y2: x => 1.5 + .45 * Math.sin(2 * x), z1: () => 0, z2: (x, y) => 1 + .3 * x + .25 * Math.sin(2.4 * y) },
  sombra: 1, pilar: 1, autoplay: false, ymax: 2, zmax: 2, centro: [1.25, 1, .8], zTopo: 'teto z = h(x, y)', zBase: 'chão z = 0'
}));
V.mount('#v-tetra', lib.solidoXY({
  geo: p => ({ x: [0, p.a], y1: () => 0, y2: x => p.b * (1 - x / p.a), z1: () => 0, z2: (x, y) => Math.max(0, p.c * (1 - x / p.a - y / p.b)) }),
  controls: [{ k: 'a', label: 'a', min: .5, max: 3, step: .1, value: 2 }, { k: 'b', label: 'b', min: .5, max: 3, step: .1, value: 3 }, { k: 'c', label: 'c', min: .5, max: 3, step: .1, value: 2 }],
  chaves: ['a', 'b', 'c'], exato: p => 'abc/6 = ' + fmt(p.a * p.b * p.c / 6, 3), ymax: 3, zmax: 3, size: 7, centro: [1, 1.2, .8], ny: 12, nx: 12, passo: 1
}));
V.mount('#v-pao', lib.solidoXY({
  geo: { x: [0, 1], y1: () => 0, y2: x => x * x, z1: () => 0, z2: (x, y) => y }, ymax: 1, zmax: 1, size: 2.4, centro: [.55, .45, .3], passo: .25, ax: [1.5, 1.4, 1.3],
  fatias: [[0, 'nenhuma'], ['x', 'x = cte (ordem dz dy dx)'], ['z', 'z = cte (ordem dx dy dz)']], fatia: 'x', autoplay: false,
  fatiaPoly(modo, pos) { const z0 = clamp(pos, .02, .97), poly = []; for (let i = 0; i <= 24; i++) { const y = lerp(z0, 1, i / 24); poly.push([Math.sqrt(y), y, z0]); } for (let i = 0; i <= 24; i++) { const y = lerp(1, z0, i / 24); poly.push([1, y, z0]); } return { poly, txt: 'z = ' + fmt(z0) }; },
  exato: '1/10 = 0,100'
}));

/* ---------- 10 esféricas: GPS ---------- */
V.mount('#v-gps', {
  h: 400, alt: 'Coordenadas esféricas ρ, φ, θ', view: { yaw: -.6, pitch: .35, size: 7 },
  controls: [{ k: 'rho', label: 'ρ', min: .5, max: 2.8, step: .05, value: 2.2 }, { k: 'phi', label: 'φ', min: 0, max: Math.PI, step: .01, value: .8, show: V.deg }, { k: 'th', label: 'θ', min: 0, max: TAU, step: .01, value: .9, show: V.deg }, { k: 'cone', type: 'toggle', label: 'Cone φ = cte', value: 0 }],
  draw(g, st) {
    const { rho, phi, th } = st.p, P = [rho * Math.sin(phi) * Math.cos(th), rho * Math.sin(phi) * Math.sin(th), rho * Math.cos(phi)];
    g.axes(3.2); g.floorPolar(3, { color: 'line' });
    g.surf((u, v) => [rho * Math.sin(v) * Math.cos(u), rho * Math.sin(v) * Math.sin(u), rho * Math.cos(v)], [0, TAU, 24], [0, Math.PI, 12], { wire: true, color: 'mute', alpha: .35, lw: 1, every: 2 });
    if (st.p.cone) g.surf((u, v) => [v * Math.sin(phi) * Math.cos(u), v * Math.sin(phi) * Math.sin(u), v * Math.cos(phi)], [0, TAU, 36], [0, 2.8, 5], { color: 'volt', alpha: .4 });
    g.seg([0, 0, 0], P, { color: 'blood', lw: 3.5, bias: -2 }); g.label([P[0] / 2, P[1] / 2, P[2] / 2], 'ρ', { color: 'blood' });
    const ra = Math.min(1, rho * .5), arc = []; for (let i = 0; i <= 30; i++) { const f = phi * i / 30; arc.push([ra * Math.sin(f) * Math.cos(th), ra * Math.sin(f) * Math.sin(th), ra * Math.cos(f)]); }
    g.line(arc, { color: 'amp', lw: 2.5, bias: -2 }); g.label(arc[15], 'φ', { color: 'amp' });
    g.arc([0, 0, 0], .8, 0, th, 'xy', { color: 'volt', lw: 2.5, bias: -2 }); g.label(cyl(.95, th / 2, 0), 'θ', { color: 'volt' });
    g.seg([P[0], P[1], 0], P, { color: 'mute', dash: [4, 4] }); g.seg([0, 0, 0], [P[0], P[1], 0], { color: 'mute', dash: [4, 4] });
    g.dot(P, { color: 'blood', r: 7, bias: -3 });
  },
  read(st) { const { rho, phi, th } = st.p; return [['x = ρ sen φ cos θ', fmt(rho * Math.sin(phi) * Math.cos(th))], ['y = ρ sen φ sen θ', fmt(rho * Math.sin(phi) * Math.sin(th))], ['z = ρ cos φ', fmt(rho * Math.cos(phi)), 1], ['"latitude" φ', V.deg(phi)]]; }
});

/* ---------- 11 bexiga ---------- */
V.mount('#v-bexiga', lib.elipsoide());

/* ---------- 13 checklist com memória ---------- */
document.querySelectorAll('.check input').forEach((c, i) => {
  const k = 'calc3-check-' + i; c.checked = localStorage.getItem(k) === '1';
  c.onchange = () => localStorage.setItem(k, c.checked ? '1' : '0');
});
})();
