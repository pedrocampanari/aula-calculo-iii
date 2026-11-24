/* exercicios.js — monta a lista de exercícios com resposta conferível
   e gabarito comentado passo a passo, sincronizado com a animação. */
(() => {
'use strict';
const D = window.EXERCICIOS, root = document.getElementById('lista');
if (!D || !root) return;
const KEY = 'calc3-' + D.id;
let saved = {}; try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* modo privado */ } };
const NIVEIS = { iniciante: ['Iniciante', 'Aquecimento: conversões e contas diretas.'], intermediario: ['Intermediário', 'Equações e integrais com limites simples.'], avancado: ['Avançado', 'Volumes entre superfícies, aplicações físicas e demonstrações.'] };

/* ---------- parser de expressões (aceita 4pi/3, 2√3, 16π/5, a^2h...) ---------- */
const FN = { sqrt: Math.sqrt, sen: Math.sin, sin: Math.sin, cos: Math.cos, tan: Math.tan, tg: Math.tan, exp: Math.exp, ln: Math.log, log: Math.log10 };
const NAMES = ['sqrt', 'sen', 'sin', 'cos', 'tan', 'tg', 'exp', 'ln', 'log', 'pi'];
function tokenize(s) {
  s = s.toLowerCase().replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/[·×]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/δ/g, 'd').replace(/θ/g, 't');
  const out = []; let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.,]/.test(ch)) { let j = i; while (j < s.length && /[0-9.,]/.test(s[j])) j++; const t = s.slice(i, j).replace(',', '.'); if (t === '.' || isNaN(+t)) throw 0; out.push({ t: 'n', v: +t }); i = j; continue; }
    if (/[a-z]/.test(ch)) {
      const nm = NAMES.find(n => s.startsWith(n, i));
      if (nm) { out.push(nm === 'pi' ? { t: 'n', v: Math.PI } : { t: 'f', v: FN[nm] }); i += nm.length; continue; }
      out.push(ch === 'e' ? { t: 'n', v: Math.E } : { t: 'v', v: ch }); i++; continue;
    }
    if ('+-*/^()'.includes(ch)) { out.push({ t: ch }); i++; continue; }
    throw 0;
  }
  return out;
}
function compile(src) {
  const tk = tokenize(src); let p = 0;
  const eat = t => (tk[p] && tk[p].t === t) ? (p++, true) : false;
  const starts = () => tk[p] && ['n', 'v', 'f', '('].includes(tk[p].t);
  function expr() { let a = term(); for (;;) { if (eat('+')) { const b = term(), x = a; a = v => x(v) + b(v); } else if (eat('-')) { const b = term(), x = a; a = v => x(v) - b(v); } else return a; } }
  function term() { let a = unary(); for (;;) { if (eat('*')) { const b = unary(), x = a; a = v => x(v) * b(v); } else if (eat('/')) { const b = unary(), x = a; a = v => x(v) / b(v); } else if (starts()) { const b = power(), x = a; a = v => x(v) * b(v); } else return a; } }
  function unary() { if (eat('-')) { const a = unary(); return v => -a(v); } if (eat('+')) return unary(); return power(); }
  function power() { const b = atom(); if (eat('^')) { const e = unary(); return v => Math.pow(b(v), e(v)); } return b; }
  function atom() {
    const t = tk[p++]; if (!t) throw 0;
    if (t.t === 'n') { const c = t.v; return () => c; }
    if (t.t === 'v') { const k = t.v; return v => { if (!(k in v)) throw 0; return v[k]; }; }
    if (t.t === 'f') { const f = t.v, a = power(); return v => f(a(v)); }
    if (t.t === '(') { const a = expr(); if (!eat(')')) throw 0; return a; }
    throw 0;
  }
  const f = expr(); if (p !== tk.length) throw 0; return f;
}
const close = (u, w) => Number.isFinite(u) && Math.abs(u - w) <= Math.max(2e-3, 6e-3 * Math.abs(w));
function checkExpr(src, valor, vars) {
  let f; try { f = compile(src); } catch (e) { return null; }
  const keys = Object.keys(vars || {}), trials = keys.length ? 3 : 1;
  for (let i = 0; i < trials; i++) {
    const v = {}; keys.forEach((k, j) => v[k] = 1.15 + .83 * i + .37 * j);
    let u; try { u = f(v); } catch (e) { return null; }
    if (!close(u, typeof valor === 'function' ? valor(v) : valor)) return false;
  }
  return true;
}

/* ---------- painel de progresso ---------- */
const vu = document.getElementById('vu'), vuT = document.getElementById('vu-t');
const total = D.itens.length;
function updVU() {
  const n = D.itens.filter(e => saved[e.n]).length;
  if (vu) { if (!vu.children.length) D.itens.forEach(e => { const i = document.createElement('i'); i.className = e.nivel === 'avancado' ? 'h' : e.nivel === 'intermediario' ? 'm' : ''; i.title = 'Exercício ' + e.n; vu.appendChild(i); }); [...vu.children].forEach((i, k) => i.classList.toggle('on', !!saved[D.itens[k].n])); }
  if (vuT) vuT.textContent = `${n}/${total} resolvidos`;
}

/* ---------- cartões ---------- */
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
let nivelAtual = null;
for (const ex of D.itens) {
  if (ex.nivel !== nivelAtual) {
    nivelAtual = ex.nivel;
    const h = el('div', 'nivel-h'); h.dataset.nivel = ex.nivel;
    h.innerHTML = `<h2>${NIVEIS[ex.nivel][0]}</h2><p>${NIVEIS[ex.nivel][1]}</p>`; root.appendChild(h);
  }
  const card = el('article', 'ex'); card.id = 'ex-' + ex.n; card.dataset.nivel = ex.nivel;
  card.innerHTML = `<header class="ex-h"><span class="ex-n">${String(ex.n).padStart(2, '0')}</span><div><span class="chip ${ex.nivel}">${NIVEIS[ex.nivel][0]}</span><h3>${ex.titulo}</h3></div><span class="ex-ok" hidden>Resolvido</span></header><div class="ex-body"><div class="ex-enun">${ex.enun}</div></div>`;
  const body = card.querySelector('.ex-body');
  const marcar = () => { saved[ex.n] = 1; save(); card.classList.add('feito'); card.querySelector('.ex-ok').hidden = false; updVU(); };
  if (saved[ex.n]) { card.classList.add('feito'); card.querySelector('.ex-ok').hidden = false; }

  /* --- tentativa --- */
  const R = ex.resp, tr = el('div', 'try'); tr.appendChild(el('p', 'try-l', 'Sua resposta'));
  const fb = el('p', 'fb'); fb.setAttribute('aria-live', 'polite');
  const dica = ex.dica ? ` Dica: ${ex.dica}` : '';
  const certo = msg => { fb.className = 'fb ok'; fb.innerHTML = msg || 'Na mosca! Abra o gabarito para conferir se o caminho também bateu.'; marcar(); if (window.renderMath) window.renderMath(fb); };
  const errado = msg => { fb.className = 'fb no'; fb.innerHTML = msg || ('Ainda não bateu.' + dica); if (window.renderMath) window.renderMath(fb); };
  if (R.tipo === 'num') {
    const inp = el('input'); inp.type = 'text'; inp.placeholder = R.ph || 'ex.: 4pi/3'; inp.setAttribute('aria-label', 'Resposta do exercício ' + ex.n); inp.autocomplete = 'off'; inp.spellcheck = false;
    const pre = R.prefixo ? el('span', 'tl', R.prefixo) : null;
    const b = el('button', 'vbtn', 'Conferir'); b.type = 'button';
    const go = () => { const r = checkExpr(inp.value, R.valor, R.vars); if (r === null) errado('Não entendi a expressão. Escreva algo como <code>4pi/3</code>, <code>2sqrt(3)</code> ou <code>16π/5</code>.'); else if (r) certo(); else errado(); };
    b.onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
    if (pre) { pre.className = 'tl'; tr.appendChild(pre); } tr.append(inp, b);
    tr.appendChild(el('p', 'fmt-hint', R.vars ? `Use as letras ${Object.keys(R.vars).join(', ')} na resposta. Aceita π (ou pi), √ (ou sqrt), ^ e frações.` : 'Aceita π (ou pi), √ (ou sqrt), ^, frações e decimais com vírgula ou ponto.'));
  } else if (R.tipo === 'tupla') {
    const row = el('div', 'qrow'); const ins = R.rotulos.map(l => { const lab = el('label', 'tl', l + ' ='); const i = el('input', 'sm'); i.type = 'text'; i.autocomplete = 'off'; i.spellcheck = false; i.setAttribute('aria-label', l); lab.appendChild(i); row.appendChild(lab); return i; });
    const b = el('button', 'vbtn', 'Conferir'); b.type = 'button'; row.appendChild(b); tr.appendChild(row);
    const go = () => {
      let ok = true, bad = false; const erros = [];
      ins.forEach((i, k) => {
        let f; try { f = compile(i.value); } catch (e) { bad = true; return; }
        let u; try { u = f({}); } catch (e) { bad = true; return; }
        let w = R.valores[k];
        if (R.mod && R.mod[k]) { const M = R.mod[k]; u = ((u % M) + M) % M; w = ((w % M) + M) % M; if (Math.abs(u - w) > M / 2) u += u < w ? M : -M; }
        if (!close(u, w)) { ok = false; erros.push(R.rotulos[k]); }
      });
      if (bad) errado('Preencha todos os campos com números ou expressões, como <code>sqrt(3)</code> ou <code>2pi/3</code>.');
      else if (ok) certo(); else errado(`Confira ${erros.join(' e ')}.` + dica);
    };
    b.onclick = go; ins.forEach(i => i.onkeydown = e => { if (e.key === 'Enter') go(); });
    tr.appendChild(el('p', 'fmt-hint', 'Aceita π (ou pi), √ (ou sqrt) e frações. Ângulos em radianos, entre 0 e 2π.'));
  } else if (R.tipo === 'escolha') {
    const acertos = R.perguntas.map(() => false);
    R.perguntas.forEach((q, qi) => {
      if (q.p) tr.appendChild(el('p', 'try-l', q.p));
      const box = el('div', 'opts');
      q.opcoes.forEach((op, oi) => {
        const b = el('button', 'vbtn opt', op); b.type = 'button';
        b.onclick = () => {
          box.querySelectorAll('.opt').forEach(x => x.classList.remove('wrong'));
          if (oi === q.certa) { b.classList.add('right'); acertos[qi] = true; if (acertos.every(Boolean)) certo(R.perguntas.length > 1 ? 'Tudo certo! Abra o gabarito para ver o porquê de cada uma.' : null); else { fb.className = 'fb ok'; fb.textContent = 'Essa está certa. Falta(m) a(s) outra(s).'; } }
          else { b.classList.add('wrong'); errado(q.porque ? q.porque[oi] || ('Não é essa.' + dica) : ('Não é essa.' + dica)); }
        };
        box.appendChild(b);
      });
      tr.appendChild(box);
    });
  }
  tr.appendChild(fb); body.appendChild(tr);

  /* --- gabarito --- */
  const ob = el('button', 'vbtn big', '▼ Abrir gabarito animado'); ob.type = 'button'; ob.setAttribute('aria-expanded', 'false'); body.appendChild(ob);
  const gab = el('div', 'gab'); gab.hidden = true;
  const N = ex.passos.length;
  gab.innerHTML = `<div class="gab-grid"><div class="gab-steps"><ol class="passos">${ex.passos.map(p => `<li class="passo" hidden>${p}</li>`).join('')}</ol>
    <div class="stepper"><button class="vbtn" data-a="prev" type="button">◀ Voltar</button><button class="vbtn amp" data-a="next" type="button">Próximo passo ▶</button><button class="vbtn" data-a="all" type="button">Ver tudo</button><span class="cnt"></span></div>
    <div class="final" hidden><span class="stamp">Resposta</span><p>${ex.final}</p></div>
    ${ex.erro ? `<div class="alerta" data-tag="Erro comum"><p>${ex.erro}</p></div>` : ''}
    ${ex.ideia ? `<div class="riff" data-tag="${ex.ideiaTag || 'Pense assim'}"><p>${ex.ideia}</p></div>` : ''}</div>
    <div class="gab-viz">${ex.viz ? '<div class="vz"></div>' : ''}${ex.vizCap ? `<p class="cap">${ex.vizCap}</p>` : ''}</div></div>`;
  body.appendChild(gab);
  const lis = [...gab.querySelectorAll('.passo')], fin = gab.querySelector('.final'), cnt = gab.querySelector('.cnt');
  const bPrev = gab.querySelector('[data-a=prev]'), bNext = gab.querySelector('[data-a=next]'), bAll = gab.querySelector('[data-a=all]');
  let m = null;
  const show = n => {
    lis.forEach((li, i) => { li.hidden = i > n; li.classList.toggle('cur', i === n); });
    fin.hidden = n < N - 1; cnt.textContent = `Passo ${n + 1} de ${N}`;
    bPrev.disabled = n === 0; bNext.disabled = n === N - 1; bPrev.style.opacity = n === 0 ? .4 : 1; bNext.style.opacity = n === N - 1 ? .4 : 1;
    gab.dataset.k = n;
    if (m) {
      m.stopAnim(); const mp = ex.viz.mapa, ov = mp ? mp[Math.min(n, mp.length - 1)] : { step: n };
      for (const k in ov) { if (k === 'play') m.play(ov[k]); else m.set(k, ov[k]); }
    }
  };
  bPrev.onclick = () => show(Math.max(0, +gab.dataset.k - 1));
  bNext.onclick = () => { show(Math.min(N - 1, +gab.dataset.k + 1)); lis[+gab.dataset.k].scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
  bAll.onclick = () => show(N - 1);
  ob.onclick = () => {
    const open = gab.hidden; gab.hidden = !open; ob.setAttribute('aria-expanded', String(open));
    ob.textContent = open ? '▲ Fechar gabarito' : '▼ Abrir gabarito animado';
    if (open && !m && ex.viz) { const { tipo, mapa, ...op } = ex.viz; const def = typeof tipo === 'function' ? tipo(op) : V.lib[tipo](op); m = V.mount(gab.querySelector('.vz'), def); }
    if (open && gab.dataset.k === undefined) show(0);
  };
  root.appendChild(card);
}
updVU();

/* ---------- filtro por nível ---------- */
document.querySelectorAll('[data-filtro]').forEach(b => b.onclick = () => {
  const f = b.dataset.filtro;
  document.querySelectorAll('[data-filtro]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  root.querySelectorAll('.ex,.nivel-h').forEach(e => { e.hidden = f !== 'todos' && e.dataset.nivel !== f; });
});
const rst = document.getElementById('zerar');
if (rst) rst.onclick = () => { saved = {}; save(); root.querySelectorAll('.ex').forEach(c => { c.classList.remove('feito'); c.querySelector('.ex-ok').hidden = true; }); updVU(); };
})();
