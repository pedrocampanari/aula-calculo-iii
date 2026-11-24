/* math.js — renderiza as fórmulas com KaTeX (se o CDN carregou) */
(() => {
  const opts = { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false, ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'canvas'] };
  window.renderMath = el => { if (window.renderMathInElement) window.renderMathInElement(el || document.body, opts); };
  window.renderMath();
})();
