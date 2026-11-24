/* Lista 1 — Coordenadas cilíndricas: enunciados, respostas e gabarito comentado */
(() => {
const R = String.raw, PI = Math.PI, TAU = 2 * PI, sq = Math.sqrt;
const cil = (o) => Object.assign({ tipo: 'solidoCil', autoplay: false }, o);
const passos3 = [{ pilar: 1, sombra: 0, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }];

window.EXERCICIOS = { id: 'cilindricas', itens: [
/* ---------------- INICIANTE ---------------- */
{ n: 1, nivel: 'iniciante', titulo: 'De cilíndricas para cartesianas',
  enun: R`Converta o ponto $(r, \theta, z) = \left(2, \frac{\pi}{3}, 5\right)$ para coordenadas cartesianas.`,
  resp: { tipo: 'tupla', rotulos: ['x', 'y', 'z'], valores: [1, sq(3), 5] }, dica: R`$x = 2\cos\frac{\pi}{3}$ e $y = 2\sin\frac{\pi}{3}$.`,
  passos: [
    R`<p><b>Leia o ponto como no farol:</b> está a distância $r = 2$ do eixo, na direção $\theta = \frac{\pi}{3}$ (60°), e na altura $z = 5$.</p>`,
    R`<p><b>Ache o $x$.</b> É a "sombra" do raio no eixo $x$:</p><p>$$x = r\cos\theta = 2\cos\tfrac{\pi}{3} = 2\cdot\tfrac{1}{2} = 1$$</p>`,
    R`<p><b>Ache o $y$.</b> É a sombra no eixo $y$:</p><p>$$y = r\sin\theta = 2\sin\tfrac{\pi}{3} = 2\cdot\tfrac{\sqrt3}{2} = \sqrt3$$</p>`,
    R`<p><b>O $z$ não muda.</b> Cilíndricas só mexem no plano $xy$; a altura continua $z = 5$.</p>`],
  final: R`$(x, y, z) = (1,\ \sqrt3,\ 5)$`,
  ideia: R`Confira de cabeça: $1^2 + (\sqrt3)^2 = 4 = r^2$. Se $x^2 + y^2$ não der $r^2$, alguma conta escorregou.`,
  viz: { tipo: 'ponto', r: 2, th: PI / 3, z: 5, size: 11, center: [0, 0, 1.6], mapa: [{ step: 1 }, { step: 2 }, { step: 2 }, { step: 3 }] },
  vizCap: 'Vermelho: o raio r. Âmbar: o ângulo θ. Azul: as sombras x e y nos eixos.' },

{ n: 2, nivel: 'iniciante', titulo: 'Ângulo raso',
  enun: R`Converta o ponto $(r, \theta, z) = (3, \pi, -2)$ para coordenadas cartesianas.`,
  resp: { tipo: 'tupla', rotulos: ['x', 'y', 'z'], valores: [-3, 0, -2] }, dica: R`$\cos\pi = -1$ e $\sin\pi = 0$.`,
  passos: [
    R`<p><b>Onde aponta $\theta = \pi$?</b> Meia volta a partir do eixo $x$ positivo: o raio aponta para o lado <b>negativo</b> do eixo $x$.</p>`,
    R`<p>$$\begin{aligned}x &= 3\cos\pi = 3\cdot(-1) = -3 \\ y &= 3\sin\pi = 3\cdot 0 = 0\end{aligned}$$</p><p>Faz sentido: o ponto está em cima do eixo $x$, do lado negativo, então $y = 0$.</p>`,
    R`<p><b>Altura:</b> $z = -2$, ou seja, dois andares abaixo do chão. Nada muda na conversão.</p>`],
  final: R`$(x, y, z) = (-3,\ 0,\ -2)$`,
  viz: { tipo: 'ponto', r: 3, th: PI, z: -2, size: 10, mapa: [{ step: 1 }, { step: 2 }, { step: 3 }] } },

{ n: 3, nivel: 'iniciante', titulo: 'De cartesianas para cilíndricas',
  enun: R`Converta o ponto cartesiano $(1, 1, 4)$ para coordenadas cilíndricas.`,
  resp: { tipo: 'tupla', rotulos: ['r', 'θ', 'z'], valores: [sq(2), PI / 4, 4], mod: [0, TAU, 0] }, dica: R`$r = \sqrt{1+1}$ e $\tan\theta = 1$ no 1º quadrante.`,
  passos: [
    R`<p><b>Primeiro localize a sombra no chão:</b> o ponto $(1, 1)$ do plano $xy$. Os dois sinais são positivos, então estamos no <b>1º quadrante</b>.</p>`,
    R`<p><b>Distância até o eixo</b> (Pitágoras):</p><p>$$r = \sqrt{x^2+y^2} = \sqrt{1+1} = \sqrt2$$</p>`,
    R`<p><b>Direção:</b> $\tan\theta = \frac{y}{x} = \frac{1}{1} = 1$. No 1º quadrante, o ângulo com tangente 1 é $\theta = \frac{\pi}{4}$ (45°).</p>`,
    R`<p><b>Altura:</b> continua $z = 4$.</p>`],
  final: R`$(r, \theta, z) = \left(\sqrt2,\ \frac{\pi}{4},\ 4\right)$`,
  viz: { tipo: 'ponto', r: sq(2), th: PI / 4, z: 4, size: 9, center: [0, 0, 1.4], s1: 1, s2: 0, s3: 3, mapa: [{ step: 0 }, { step: 1 }, { step: 2 }, { step: 3 }] } },

{ n: 4, nivel: 'iniciante', titulo: 'A armadilha do quadrante',
  enun: R`Converta o ponto cartesiano $(-2, 2\sqrt{3}, 1)$ para coordenadas cilíndricas.`,
  resp: { tipo: 'tupla', rotulos: ['r', 'θ', 'z'], valores: [4, 2 * PI / 3, 1], mod: [0, TAU, 0] }, dica: R`$\tan\theta = -\sqrt3$, mas o ponto está no 2º quadrante.`,
  passos: [
    R`<p><b>Distância:</b></p><p>$$r = \sqrt{(-2)^2 + (2\sqrt3)^2} = \sqrt{4 + 12} = \sqrt{16} = 4$$</p>`,
    R`<p><b>A tangente:</b> $\tan\theta = \frac{2\sqrt3}{-2} = -\sqrt3$. A calculadora responde $\arctan(-\sqrt3) = -\frac{\pi}{3}$ (a seta cinza na animação), que aponta para o 4º quadrante.</p>`,
    R`<p><b>Olhe os sinais:</b> $x < 0$ e $y > 0$, então o ponto está no <b>2º quadrante</b>. A calculadora errou o lado; some $\pi$:</p><p>$$\theta = -\tfrac{\pi}{3} + \pi = \tfrac{2\pi}{3}$$</p><p>Teste: $4\cos\frac{2\pi}{3} = 4\cdot(-\frac12) = -2$ ✔</p>`,
    R`<p><b>Altura:</b> $z = 1$.</p>`],
  final: R`$(r, \theta, z) = \left(4,\ \frac{2\pi}{3},\ 1\right)$`,
  erro: R`Responder $\theta = -\frac{\pi}{3}$ ou $\frac{5\pi}{3}$. Esses ângulos têm a mesma tangente, mas apontam para o lado oposto, como os ponteiros de 1h30 e 7h30.`,
  viz: { tipo: 'ponto', r: 4, th: 2 * PI / 3, z: 1, size: 11, ghost: -PI / 3, ghostLabel: 'calculadora: −π/3', s1: 2, s2: 0, s3: 3, mapa: [{ step: 0 }, { step: 1 }, { step: 2 }, { step: 3 }] },
  vizCap: 'Cinza tracejado: o ângulo que a calculadora devolve. Vermelho: o θ certo, no 2º quadrante.' },

{ n: 5, nivel: 'iniciante', titulo: 'Ponto em cima do eixo',
  enun: R`Converta o ponto cartesiano $(0, -5, 3)$ para coordenadas cilíndricas.`,
  resp: { tipo: 'tupla', rotulos: ['r', 'θ', 'z'], valores: [5, 3 * PI / 2, 3], mod: [0, TAU, 0] }, dica: 'O ponto está sobre o eixo y negativo.',
  passos: [
    R`<p><b>Distância:</b> $r = \sqrt{0^2 + (-5)^2} = 5$.</p>`,
    R`<p><b>Direção:</b> aqui $\frac{y}{x} = \frac{-5}{0}$ nem existe, então não dá para usar a tangente. Desenhe: $x = 0$ e $y < 0$ é o eixo $y$ <b>negativo</b>, que fica a três quartos de volta: $\theta = \frac{3\pi}{2}$ (270°).</p>`,
    R`<p><b>Altura:</b> $z = 3$.</p>`],
  final: R`$(r, \theta, z) = \left(5,\ \frac{3\pi}{2},\ 3\right)$`,
  ideia: R`Nos eixos, não faça conta: <b>desenhe</b>. Eixo $x$ positivo é $0$, eixo $y$ positivo é $\frac{\pi}{2}$, $x$ negativo é $\pi$, $y$ negativo é $\frac{3\pi}{2}$.`,
  viz: { tipo: 'ponto', r: 5, th: 3 * PI / 2, z: 3, size: 12, s1: 1, s2: 0, s3: 2, mapa: [{ step: 0 }, { step: 1 }, { step: 2 }] } },

{ n: 6, nivel: 'iniciante', titulo: 'Reconheça a superfície',
  enun: R`<p>Identifique e descreva cada superfície dada em coordenadas cilíndricas:</p><p>a) $r = 3$ &nbsp;&nbsp; b) $\theta = \frac{\pi}{4}$ &nbsp;&nbsp; c) $z = r$</p>`,
  resp: { tipo: 'escolha', perguntas: [
    { p: R`a) $r = 3$`, opcoes: ['Esfera de raio 3', 'Cilindro de raio 3 em torno do eixo z', 'Plano z = 3'], certa: 1 },
    { p: R`b) $\theta = \frac{\pi}{4}$`, opcoes: ['Semiplano vertical (y = x, x ≥ 0)', 'Cone', 'Plano horizontal'], certa: 0 },
    { p: R`c) $z = r$`, opcoes: ['Paraboloide', 'Cilindro', 'Cone (folha de cima)'], certa: 2 }] },
  dica: 'Fixe uma coordenada e veja o que fica livre.',
  passos: [
    R`<p><b>a) $r = 3$:</b> todos os pontos à distância 3 do eixo $z$, em qualquer direção $\theta$ e qualquer altura $z$. É a <b>lata de refrigerante</b> infinita: cilindro de raio 3.</p>`,
    R`<p><b>b) $\theta = \frac{\pi}{4}$:</b> a direção fica travada em 45°, mas $r \ge 0$ e $z$ ficam livres. É uma <b>parede</b> que sai do eixo $z$ (a porta giratória parada): o semiplano $y = x$ com $x \ge 0$.</p>`,
    R`<p><b>c) $z = r$:</b> a altura é igual à distância ao eixo. No centro $z = 0$; a 1 unidade, $z = 1$; a 2, $z = 2$... Girando essa reta em torno do eixo, sai a <b>casquinha de sorvete</b>: o cone $z = \sqrt{x^2+y^2}$.</p>`],
  final: R`a) cilindro de raio 3 · b) semiplano vertical $y = x$, $x \ge 0$ · c) cone circular (folha de cima)`,
  viz: { tipo: 'galeria', itens: ['cil', 'semi', 'cone'], cs: [2.4, PI / 4, 0], semC: true, rotulos: ['a) r = 3', 'b) θ = π/4', 'c) z = r'], mapa: [{ sel: 0 }, { sel: 1 }, { sel: 2 }] },
  vizCap: 'Os botões trocam a superfície; os passos do gabarito também. (Raio desenhado em escala reduzida.)' },

/* ---------------- INTERMEDIÁRIO ---------------- */
{ n: 7, nivel: 'intermediario', titulo: 'O cano encostado no eixo',
  enun: R`Escreva a equação $x^2 + y^2 = 4x$ em coordenadas cilíndricas e descreva a superfície.`,
  resp: { tipo: 'escolha', perguntas: [{ opcoes: [R`$r = 4\cos\theta$`, R`$r = 2\cos\theta$`, R`$r^2 = 4\cos\theta$`, R`$r = 4\sin\theta$`], certa: 0 }] },
  dica: R`$x^2+y^2 = r^2$ e $x = r\cos\theta$; depois divida por $r$.`,
  passos: [
    R`<p><b>Troque as peças:</b> $x^2 + y^2$ vira $r^2$ e $x$ vira $r\cos\theta$:</p><p>$$r^2 = 4r\cos\theta$$</p>`,
    R`<p><b>Divida por $r$:</b></p><p>$$r = 4\cos\theta$$</p><p>Perdemos alguma coisa? Só o ponto $r = 0$ (a origem), mas ele já aparece em $r = 4\cos\theta$ quando $\theta = \frac{\pi}{2}$. Então nada se perdeu.</p>`,
    R`<p><b>Que superfície é?</b> Volte para cartesianas e complete o quadrado:</p><p>$$x^2 - 4x + y^2 = 0 \;\Rightarrow\; (x-2)^2 + y^2 = 4$$</p><p>É um círculo de raio 2 com centro em $(2, 0)$. Como $z$ está livre, ele sobe e vira um <b>cilindro</b> que encosta no eixo $z$.</p>`],
  final: R`$r = 4\cos\theta$: cilindro de raio 2 centrado em $(2, 0)$`,
  viz: { tipo: 'polarTraco', rf: t => 4 * Math.cos(t), th: [-PI / 2, PI / 2], centro2: [2, 0], rotCentro: 'centro (2, 0)', eq: 'r = 4 cos θ', centro: [1.5, 0, .5], mapa: [{ par: 0 }, { par: 0, play: 'tr' }, { par: 1 }] },
  vizCap: 'Com θ indo de −π/2 a π/2, r = 4 cos θ desenha o círculo inteiro. No último passo as paredes sobem: cilindro.' },

{ n: 8, nivel: 'intermediario', titulo: 'Paraboloide',
  enun: R`Escreva o paraboloide $z = x^2 + y^2$ em coordenadas cilíndricas.`,
  resp: { tipo: 'escolha', perguntas: [{ opcoes: [R`$z = r$`, R`$z = r^2$`, R`$z = r^2\cos\theta$`, R`$z^2 = r$`], certa: 1 }] }, dica: R`$x^2 + y^2 = r^2$.`,
  passos: [
    R`<p>Apareceu $x^2 + y^2$? Troque direto por $r^2$:</p><p>$$z = r^2$$</p>`,
    R`<p><b>Por que fica tão simples?</b> A equação não tem $\theta$, então a superfície é igual em toda direção: basta girar a parábola $z = r^2$ em torno do eixo $z$. É a <b>tigela</b> (ou antena parabólica).</p>`],
  final: R`$z = r^2$`,
  viz: { tipo: 'revolucao', perfil: t => [t, t * t], t: [0, 1.6], eq: 'z = r²', rotulo: 'z = r²', cz: 1 },
  vizCap: 'A parábola vermelha (perfil no plano rz) girando em torno do eixo gera o paraboloide.' },

{ n: 9, nivel: 'intermediario', titulo: 'Esfera',
  enun: R`Escreva a esfera $x^2 + y^2 + z^2 = 9$ em coordenadas cilíndricas.`,
  resp: { tipo: 'escolha', perguntas: [{ opcoes: [R`$r = 3$`, R`$r^2 + z^2 = 9$`, R`$r + z = 3$`, R`$r^2 = 9 + z^2$`], certa: 1 }] }, dica: R`Substitua só o $x^2 + y^2$.`,
  passos: [
    R`<p>Agrupe o pedaço que vira $r^2$:</p><p>$$\underbrace{x^2 + y^2}_{r^2} + z^2 = 9 \;\Rightarrow\; r^2 + z^2 = 9$$</p>`,
    R`<p>No plano $rz$ (uma "fatia" vertical) isso é um semicírculo de raio 3. Girando o semicírculo em torno do eixo $z$, ele varre a esfera inteira.</p>`],
  final: R`$r^2 + z^2 = 9$`,
  erro: R`Responder $r = 3$. Isso é o <b>cilindro</b> de raio 3. Em cilíndricas, $r$ é a distância ao <b>eixo</b>, não à origem.`,
  viz: { tipo: 'revolucao', perfil: t => [3 * Math.sin(t), 3 * Math.cos(t)], t: [0, PI], eq: 'r² + z² = 9', rotulo: 'semicírculo', size: 9, cz: 0, ax: 4 } },

{ n: 10, nivel: 'intermediario', titulo: 'Caminho inverso: multiplique por r',
  enun: R`Converta $r = 2\sin\theta$ para coordenadas cartesianas e identifique a superfície.`,
  resp: { tipo: 'escolha', perguntas: [{ opcoes: [R`$x^2 + (y-1)^2 = 1$`, R`$x^2 + y^2 = 2$`, R`$(x-1)^2 + y^2 = 1$`, R`$y = 2x$`], certa: 0 }] }, dica: R`Multiplique por $r$: $r^2 = 2r\sin\theta$.`,
  passos: [
    R`<p><b>Multiplique os dois lados por $r$</b>, para aparecerem peças conhecidas:</p><p>$$r^2 = 2r\sin\theta$$</p>`,
    R`<p><b>Traduza:</b> $r^2 = x^2+y^2$ e $r\sin\theta = y$:</p><p>$$x^2 + y^2 = 2y$$</p>`,
    R`<p><b>Complete o quadrado em $y$:</b></p><p>$$x^2 + y^2 - 2y + 1 = 1 \;\Rightarrow\; x^2 + (y-1)^2 = 1$$</p><p>Círculo de raio 1 com centro em $(0, 1)$. Com $z$ livre: <b>cilindro</b> encostado no eixo $z$, do lado do $y$ positivo.</p>`],
  final: R`$x^2 + (y-1)^2 = 1$: cilindro de raio 1 centrado em $(0, 1)$`,
  viz: { tipo: 'polarTraco', rf: t => 2 * Math.sin(t), th: [0, PI], centro2: [0, 1], rotCentro: 'centro (0, 1)', eq: 'x² + (y−1)² = 1', size: 6, centro: [0, 1, .5], mapa: [{ par: 0, play: 'tr' }, { par: 0 }, { par: 1 }] } },

{ n: 11, nivel: 'intermediario', titulo: 'A sela',
  enun: R`Converta $z = r^2\cos 2\theta$ para coordenadas cartesianas e identifique a superfície.`,
  resp: { tipo: 'escolha', perguntas: [{ opcoes: [R`$z = x^2 + y^2$`, R`$z = x^2 - y^2$`, R`$z = 2xy$`, R`$z = x - y$`], certa: 1 }] }, dica: R`$\cos 2\theta = \cos^2\theta - \sin^2\theta$.`,
  passos: [
    R`<p><b>Abra o cosseno do arco duplo:</b> $\cos 2\theta = \cos^2\theta - \sin^2\theta$.</p><p>$$z = r^2\cos^2\theta - r^2\sin^2\theta$$</p>`,
    R`<p><b>Agrupe:</b> $r^2\cos^2\theta = (r\cos\theta)^2 = x^2$ e $r^2\sin^2\theta = (r\sin\theta)^2 = y^2$:</p><p>$$z = x^2 - y^2$$</p>`,
    R`<p><b>Superfície:</b> paraboloide hiperbólico, a famosa <b>sela</b>. Na direção do eixo $x$ ela sobe ($z = x^2$); na direção do eixo $y$ ela desce ($z = -y^2$).</p>`],
  final: R`$z = x^2 - y^2$: paraboloide hiperbólico (sela)`,
  ideia: 'Pense na batata Pringles: curva para cima num sentido e para baixo no outro.', ideiaTag: 'Analogia',
  viz: { tipo: 'galeria', itens: ['sela'], semC: true, rotulos: ['z = x² − y²'] },
  vizCap: 'Cores quentes: z alto. Repare que a altura oscila com cos 2θ: sobe duas vezes e desce duas vezes por volta.' },

{ n: 12, nivel: 'intermediario', titulo: 'Um quarto de cilindro',
  enun: R`Descreva o sólido dado por $0 \le r \le 2$, $0 \le \theta \le \frac{\pi}{2}$, $0 \le z \le 3$ e calcule seu volume.`,
  resp: { tipo: 'num', valor: 3 * PI, ph: 'ex.: 3pi' }, dica: R`Um quarto de cilindro de raio 2 e altura 3.`,
  passos: [
    R`<p><b>Descreva:</b> $r$ até 2 e $z$ até 3 formam um cilindro de raio 2 e altura 3. Mas $\theta$ só vai de 0 a $\frac{\pi}{2}$: é só a parte no 1º quadrante, <b>um quarto</b> do cilindro (uma fatia de queijo).</p>`,
    R`<p><b>Monte a integral</b> (não esqueça o $r$!):</p><p>$$V = \int_0^{\pi/2}\int_0^2\int_0^3 r\,dz\,dr\,d\theta$$</p>`,
    R`<p><b>Resolva de dentro para fora.</b> Como os limites são constantes, a integral se separa:</p><p>$$V = \underbrace{\int_0^{\pi/2} d\theta}_{\pi/2}\cdot\underbrace{\int_0^2 r\,dr}_{2}\cdot\underbrace{\int_0^3 dz}_{3} = \frac{\pi}{2}\cdot 2\cdot 3 = 3\pi$$</p><p>Conferindo com a fórmula: $\frac14\cdot\pi\cdot 2^2\cdot 3 = 3\pi$ ✔</p>`],
  final: R`Um quarto de cilindro; $V = 3\pi \approx 9{,}42$`,
  viz: cil({ geo: { th: [0, PI / 2], r2: () => 2, z1: () => 0, z2: () => 3 }, exato: '3π ≈ 9,425', zTopo: 'z = 3', zBase: 'z = 0', rotSombra: 'quarto de disco', cz: 1.4, size: 7, mapa: passos3 }) },

{ n: 13, nivel: 'intermediario', titulo: 'Integrando √(x²+y²)',
  enun: R`<p>Calcule a integral abaixo, onde $E$ é o cilindro $x^2 + y^2 \le 1$, $0 \le z \le 2$:</p>$$\iiint_E \sqrt{x^2+y^2}\,dV$$`,
  resp: { tipo: 'num', valor: 4 * PI / 3 }, dica: R`O integrando vira $r$, e ainda tem o $r$ do $dV$: fica $r\cdot r$.`,
  passos: [
    R`<p><b>Traduza o integrando:</b> $\sqrt{x^2+y^2} = \sqrt{r^2} = r$ (a distância ao eixo).</p>`,
    R`<p><b>Limites:</b> o disco de raio 1 é $0 \le r \le 1$, $0 \le \theta \le 2\pi$; a altura é $0 \le z \le 2$.</p>`,
    R`<p><b>Monte, com o $r$ do $dV$:</b></p><p>$$\begin{aligned}&\int_0^{2\pi}\int_0^1\int_0^2 \underbrace{r}_{\text{integrando}}\cdot\underbrace{r}_{dV}\,dz\,dr\,d\theta \\ &= 2\pi\cdot\int_0^1 r^2\,dr\cdot 2 = 2\pi\cdot\tfrac13\cdot 2 = \tfrac{4\pi}{3}\end{aligned}$$</p>`],
  final: R`$\dfrac{4\pi}{3} \approx 4{,}19$`,
  erro: R`Usar só um $r$ e chegar em $2\pi$. São <b>dois</b> $r$: um da função e um do Jacobiano.`,
  viz: cil({ geo: { th: [0, TAU], r2: () => 1, z1: () => 0, z2: () => 2 }, f: r => r, cor: q => Math.hypot(q[0], q[1]), rotulo: '∭ r dV (numérico)', exato: '4π/3 ≈ 4,189', size: 4.5, cz: 1, R: 1.5, ax: 2, mapa: [{ pilar: 0, sombra: 0, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }] }),
  vizCap: 'A cor mostra o integrando r: perto da borda pesa mais (vermelho/âmbar), no eixo vale zero.' },

/* ---------------- AVANÇADO ---------------- */
{ n: 14, nivel: 'avancado', titulo: 'Esfera com um furo',
  enun: R`Encontre o volume do sólido que está dentro da esfera $x^2 + y^2 + z^2 = 4$ e fora do cilindro $x^2 + y^2 = 1$.`,
  resp: { tipo: 'num', valor: 4 * sq(3) * PI, ph: 'ex.: 4sqrt(3)pi' }, dica: R`$\int_0^{2\pi}\int_1^2 2\sqrt{4-r^2}\;r\,dr\,d\theta$, com $u = 4 - r^2$.`,
  passos: [
    R`<p><b>Imagine:</b> uma bola de raio 2 com um furo cilíndrico de raio 1 no meio, como uma conta de colar (ou uma maçã sem o miolo).</p>`,
    R`<p><b>Pilar ($z$):</b> da esfera, $r^2 + z^2 = 4 \Rightarrow z = \pm\sqrt{4-r^2}$. O pilar vai de $-\sqrt{4-r^2}$ até $\sqrt{4-r^2}$, altura $2\sqrt{4-r^2}$.</p>`,
    R`<p><b>Sombra:</b> fora do furo ($r \ge 1$) e dentro da bola ($r \le 2$): é um <b>anel</b> $1 \le r \le 2$, $0 \le \theta \le 2\pi$.</p>`,
    R`<p><b>Monte:</b></p><p>$$V = \int_0^{2\pi}\int_1^2 2\sqrt{4-r^2}\;r\,dr\,d\theta$$</p>`,
    R`<p><b>Substituição</b> $u = 4 - r^2$, $du = -2r\,dr$. Quando $r = 1$, $u = 3$; quando $r = 2$, $u = 0$:</p><p>$$\begin{aligned}\int_1^2 2r\sqrt{4-r^2}\,dr &= \int_0^3 \sqrt u\,du = \tfrac23\,u^{3/2}\Big|_0^3 \\ &= \tfrac23\cdot 3\sqrt3 = 2\sqrt3\end{aligned}$$</p>`,
    R`<p><b>Multiplique pelo $\theta$:</b> $V = 2\pi\cdot 2\sqrt3 = 4\sqrt3\,\pi$.</p>`],
  final: R`$V = 4\sqrt3\,\pi \approx 21{,}77$`,
  ideia: R`Confira o bom senso: a bola inteira tem $\frac43\pi\cdot 8 \approx 33{,}5$. Tirando o miolo, sobrou $21{,}8$. Faz sentido!`, ideiaTag: 'Teste de sanidade',
  viz: cil({ geo: { th: [0, TAU], r1: () => 1, r2: () => 2, z1: r => -sq(Math.max(0, 4 - r * r)), z2: r => sq(Math.max(0, 4 - r * r)) }, exato: '4√3π ≈ 21,766', zTopo: 'z = √(4 − r²)', zBase: 'z = −√(4 − r²)', rotSombra: 'anel 1 ≤ r ≤ 2', chao: false, zChao: -2.2, cz: 0, size: 7, R: 2, ax: 2.8, pilarR: 1.5,
    mapa: [{ pilar: 0, sombra: 0, build: .75 }, { pilar: 1, sombra: 0, build: .75 }, { pilar: 1, sombra: 1, build: .75 }, { pilar: 1, sombra: 1, build: .75 }, { pilar: 1, sombra: 1, build: .75 }, { pilar: 1, sombra: 1, play: 'build' }] }),
  vizCap: 'Sólido cortado (75%) para mostrar o furo azul por dentro. O último passo varre θ até fechar.' },

{ n: 15, nivel: 'avancado', titulo: 'Paraboloide cortado por plano inclinado',
  enun: R`Encontre o volume do sólido limitado pelo paraboloide $z = x^2 + y^2$ e pelo plano $z = 2y$.`,
  resp: { tipo: 'num', valor: PI / 2, ph: 'ex.: pi/2' }, dica: R`Interseção: $r = 2\sin\theta$, $0 \le \theta \le \pi$; integrando $(2r\sin\theta - r^2)\,r$.`,
  passos: [
    R`<p><b>Quem está em cima?</b> Dentro da região, o plano $z = 2y = 2r\sin\theta$ fica acima do paraboloide $z = r^2$. Pilar: $r^2 \le z \le 2r\sin\theta$.</p>`,
    R`<p><b>Sombra:</b> onde as duas superfícies se encontram, $r^2 = 2r\sin\theta \Rightarrow r = 2\sin\theta$. É o círculo do exercício 10! Ele é percorrido com $\theta$ de $0$ a $\pi$ (onde $\sin\theta \ge 0$).</p><p>Sombra: $0 \le \theta \le \pi$, $0 \le r \le 2\sin\theta$.</p>`,
    R`<p><b>Monte:</b></p><p>$$V = \int_0^{\pi}\int_0^{2\sin\theta} (2r\sin\theta - r^2)\,r\,dr\,d\theta$$</p>`,
    R`<p><b>Integral em $r$:</b></p><p>$$\begin{aligned}&\int_0^{2\sin\theta}(2r^2\sin\theta - r^3)\,dr \\ &= \tfrac23(2\sin\theta)^3\sin\theta - \tfrac{(2\sin\theta)^4}{4} \\ &= \tfrac{16}{3}\sin^4\theta - 4\sin^4\theta = \tfrac43\sin^4\theta\end{aligned}$$</p>`,
    R`<p><b>Integral em $\theta$</b> (use a tabela: $\int_0^\pi \sin^4\theta\,d\theta = \frac{3\pi}{8}$):</p><p>$$V = \tfrac43\cdot\tfrac{3\pi}{8} = \tfrac{\pi}{2}$$</p>`],
  final: R`$V = \dfrac{\pi}{2} \approx 1{,}57$`,
  erro: R`Colocar $\theta$ de $0$ a $2\pi$. Para $\pi < \theta < 2\pi$ teríamos $r = 2\sin\theta < 0$, o que não existe com $r \ge 0$. O círculo inteiro já é desenhado com $\theta \in [0, \pi]$.`,
  viz: cil({ geo: { th: [0, PI], r2: t => 2 * Math.sin(t), z1: r => r * r, z2: (r, t) => 2 * r * Math.sin(t) }, exato: 'π/2 ≈ 1,571', zTopo: 'plano z = 2y', zBase: 'z = r²', rotSombra: 'r ≤ 2 sen θ', view: { center: [0, 1, 1.4] }, size: 8, pilarTh: PI / 2, pilarR: 1, R: 2,
    mapa: [{ pilar: 1, sombra: 0, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }] }) },

{ n: 16, nivel: 'avancado', titulo: 'Massa com densidade variável',
  enun: R`Um cilindro sólido $x^2 + y^2 \le a^2$, $0 \le z \le h$ tem densidade igual à distância ao eixo $z$, ou seja, $\delta = r$. Encontre sua massa.`,
  resp: { tipo: 'num', valor: v => 2 * PI * v.h * v.a ** 3 / 3, vars: { a: 1, h: 1 }, ph: 'ex.: 2pi h a^3/3' }, dica: R`$\int_0^{2\pi}\int_0^a\int_0^h r\cdot r\,dz\,dr\,d\theta$.`,
  passos: [
    R`<p><b>Massa = integral da densidade:</b> $M = \iiint_E \delta\,dV$. Aqui $\delta = r$: quanto mais longe do eixo, mais pesado (como um pneu com a borracha concentrada na borda).</p>`,
    R`<p><b>Monte</b> (densidade $r$ vezes o $r$ do $dV$):</p><p>$$M = \int_0^{2\pi}\int_0^a\int_0^h r\cdot r\,dz\,dr\,d\theta$$</p>`,
    R`<p><b>Separe:</b></p><p>$$M = 2\pi\cdot\int_0^a r^2\,dr\cdot h = 2\pi\cdot\frac{a^3}{3}\cdot h = \frac{2\pi h a^3}{3}$$</p>`],
  final: R`$M = \dfrac{2\pi h a^3}{3}$`,
  viz: cil({ geo: { th: [0, TAU], r2: () => 1.5, z1: () => 0, z2: () => 2 }, f: r => r, cor: q => Math.hypot(q[0], q[1]) / 1.5, rotulo: 'Massa (a = 1,5; h = 2)', exato: '2πha³/3 ≈ 14,137', size: 6, cz: 1, R: 2, mapa: [{ pilar: 0, sombra: 0, build: 1 }, { pilar: 1, sombra: 0, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }] }),
  vizCap: 'Com a = 1,5 e h = 2. A cor é a densidade δ = r: a casca de fora é a parte mais pesada.' },

{ n: 17, nivel: 'avancado', titulo: 'Inércia do cilindro: I = ½Ma²',
  enun: R`<p>Mostre que o momento de inércia em relação ao eixo $z$ de um cilindro sólido homogêneo de raio $a$, altura $h$ e massa $M$ é:</p>$$I_z = \frac{1}{2}Ma^2$$`,
  resp: { tipo: 'escolha', perguntas: [{ p: 'Qual integral calcula I_z?', opcoes: [R`$\displaystyle\int_0^{2\pi}\!\!\int_0^a\!\!\int_0^h r^2\,\delta\;r\,dz\,dr\,d\theta$`, R`$\displaystyle\int_0^{2\pi}\!\!\int_0^a\!\!\int_0^h r\,\delta\,dz\,dr\,d\theta$`, R`$\displaystyle\int_0^{2\pi}\!\!\int_0^a\!\!\int_0^h z^2\,\delta\;r\,dz\,dr\,d\theta$`], certa: 0 }] },
  dica: R`$I_z = \iiint (x^2+y^2)\,\delta\,dV$ e $x^2+y^2 = r^2$.`,
  passos: [
    R`<p><b>Fórmula da inércia:</b> $I_z = \iiint_E (x^2+y^2)\,\delta\,dV$. O $x^2 + y^2 = r^2$ é a distância ao eixo <b>ao quadrado</b>: massa longe do eixo conta muito mais.</p>`,
    R`<p><b>Monte</b> ($\delta$ constante):</p><p>$$\begin{aligned}I_z &= \delta\int_0^{2\pi}\int_0^a\int_0^h r^2\cdot r\,dz\,dr\,d\theta \\ &= \delta\cdot 2\pi\cdot\frac{a^4}{4}\cdot h = \frac{\pi\delta h a^4}{2}\end{aligned}$$</p>`,
    R`<p><b>Escreva em função de $M$.</b> A massa é densidade × volume: $M = \delta\cdot\pi a^2 h$. Então:</p><p>$$I_z = \frac{\pi\delta h a^4}{2} = \frac{1}{2}\underbrace{(\delta\pi a^2 h)}_{M}\,a^2 = \frac12 Ma^2 \;\;\blacksquare$$</p>`],
  final: R`$I_z = \dfrac{\pi\delta h a^4}{2} = \dfrac12 Ma^2$`,
  ideia: R`É por isso que, num jogo, um barril (cilindro maciço, $k = \frac12$) desce a rampa mais devagar que um bloco que só escorrega. Veja a animação na página de Aplicações.`, ideiaTag: 'Na vida real',
  viz: cil({ geo: { th: [0, TAU], r2: () => 1.5, z1: () => 0, z2: () => 2 }, f: r => r * r, cor: q => (q[0] ** 2 + q[1] ** 2) / 2.25, rotulo: 'I_z (a = 1,5; h = 2; δ = 1)', exato: 'πha⁴/2 ≈ 15,904', size: 6, cz: 1, R: 2, mapa: [{ pilar: 0, sombra: 0, build: 1 }, { pilar: 1, sombra: 0, play: 'build' }, { pilar: 1, sombra: 0, build: 1 }] }),
  vizCap: 'A cor agora é r²: o anel de fora domina a inércia.' },

{ n: 18, nivel: 'avancado', titulo: 'Traduzindo uma integral cartesiana',
  enun: R`<p>Converta para coordenadas cilíndricas e calcule:</p>$$\int_{-2}^{2}\int_{-\sqrt{4-x^2}}^{\sqrt{4-x^2}}\int_{\sqrt{x^2+y^2}}^{2} (x^2+y^2)\,dz\,dy\,dx$$`,
  resp: { tipo: 'num', valor: 16 * PI / 5, ph: 'ex.: 16pi/5' }, dica: R`Região: $0 \le r \le 2$, $r \le z \le 2$; integrando $r^2\cdot r$.`,
  passos: [
    R`<p><b>Leia os limites de fora:</b> $x$ de $-2$ a $2$ e $y$ de $-\sqrt{4-x^2}$ a $\sqrt{4-x^2}$ descrevem o <b>disco de raio 2</b>. Em polares: $0 \le r \le 2$, $0 \le \theta \le 2\pi$.</p>`,
    R`<p><b>Limites de $z$:</b> de $\sqrt{x^2+y^2} = r$ (o cone) até $2$ (um plano). O sólido é um cone de ponta para baixo, tampado em $z = 2$.</p>`,
    R`<p><b>Integrando e Jacobiano:</b> $x^2+y^2 = r^2$, mais o $r$ do $dV$:</p><p>$$\int_0^{2\pi}\int_0^2\int_r^2 r^2\cdot r\,dz\,dr\,d\theta = 2\pi\int_0^2 r^3(2 - r)\,dr$$</p>`,
    R`<p><b>Calcule:</b></p><p>$$2\pi\left[\frac{2r^4}{4} - \frac{r^5}{5}\right]_0^2 = 2\pi\left(8 - \frac{32}{5}\right) = 2\pi\cdot\frac85 = \frac{16\pi}{5}$$</p>`],
  final: R`$\dfrac{16\pi}{5} \approx 10{,}05$`,
  ideia: R`Esse é o exemplo da "tradução": em cartesianas, cada limite é uma raiz chata. Em cilíndricas, vira "raio até 2, do cone até o teto".`, ideiaTag: 'Analogia: a tradução',
  viz: cil({ geo: { th: [0, TAU], r2: () => 2, z1: r => r, z2: () => 2 }, f: r => r * r, cor: q => (q[0] ** 2 + q[1] ** 2) / 4, rotulo: '∭ r² dV (numérico)', exato: '16π/5 ≈ 10,053', zTopo: 'z = 2', zBase: 'cone z = r', rotSombra: 'disco r ≤ 2', size: 6.5, cz: 1, R: 2, mapa: [{ pilar: 0, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }] }) },

{ n: 19, nivel: 'avancado', titulo: 'O Jacobiano das cilíndricas',
  enun: R`<p>Calcule o Jacobiano da transformação $(r, \theta, z) \mapsto (x, y, z)$ e justifique por que $dV = r\,dz\,dr\,d\theta$:</p>$$J = \frac{\partial(x,y,z)}{\partial(r,\theta,z)}$$`,
  resp: { tipo: 'num', valor: v => v.r, vars: { r: 1 }, prefixo: 'J =', ph: 'ex.: r' }, dica: R`Expanda o determinante pela 3ª linha.`,
  passos: [
    R`<p><b>Monte a matriz das derivadas.</b> Cada linha é uma das funções $x = r\cos\theta$, $y = r\sin\theta$, $z = z$, derivada em $r$, $\theta$ e $z$:</p><p>$$J = \det\begin{pmatrix} \cos\theta & -r\sin\theta & 0 \\ \sin\theta & r\cos\theta & 0 \\ 0 & 0 & 1 \end{pmatrix}$$</p>`,
    R`<p><b>Expanda pela 3ª linha</b> (só o 1 sobrevive):</p><p>$$\begin{aligned}J &= 1\cdot\big(\cos\theta\cdot r\cos\theta - (-r\sin\theta)\cdot\sin\theta\big) \\ &= r\cos^2\theta + r\sin^2\theta = r\end{aligned}$$</p>`,
    R`<p><b>Interpretação geométrica:</b> o pedacinho de cilíndricas tem lados $dr$ (para fora), $r\,d\theta$ (o arco: quanto mais longe, maior) e $dz$ (para cima). Volume: $dr\cdot r\,d\theta\cdot dz$. Por isso $dV = r\,dz\,dr\,d\theta$.</p>`],
  final: R`$J = r$, logo $dV = r\,dz\,dr\,d\theta$`,
  ideia: R`Lembre do carrossel: o cavalinho da borda anda $r\,d\theta$ quando o carrossel gira $d\theta$. O Jacobiano é esse $r$.`, ideiaTag: 'Analogia',
  viz: { tipo: 'elemento' },
  vizCap: 'Afaste o pedaço do eixo: com o mesmo dr, dθ e dz, o volume cresce proporcional a r.' }
] };
})();
