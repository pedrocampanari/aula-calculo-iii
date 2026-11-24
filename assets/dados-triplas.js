/* Lista 2 — Integrais triplas: enunciados, respostas e gabarito comentado */
(() => {
const R = String.raw, PI = Math.PI, TAU = 2 * PI, sq = Math.sqrt;
const cil = o => Object.assign({ tipo: 'solidoCil', autoplay: false }, o);
const xy = o => Object.assign({ tipo: 'solidoXY', autoplay: false }, o);
const tetra1 = { x: [0, 1], y1: () => 0, y2: x => 1 - x, z1: () => 0, z2: (x, y) => Math.max(0, 1 - x - y) };

window.EXERCICIOS = { id: 'triplas', itens: [
/* ---------------- INICIANTE ---------------- */
{ n: 1, nivel: 'iniciante', titulo: 'Caixa com soma',
  enun: R`<p>Calcule:</p>$$\int_0^1\int_0^2\int_0^3 (x+y+z)\,dz\,dy\,dx$$`,
  resp: { tipo: 'num', valor: 18 }, dica: 'Separe em três integrais; cada uma é (média da variável) × volume 6.',
  passos: [
    R`<p><b>Primeiro em $z$</b> (de 0 a 3), tratando $x$ e $y$ como constantes:</p><p>$$\begin{aligned}\int_0^3 (x+y+z)\,dz &= (x+y)\cdot 3 + \frac{z^2}{2}\Big|_0^3 \\ &= 3x + 3y + \frac92\end{aligned}$$</p>`,
    R`<p><b>Agora em $y$</b> (de 0 a 2):</p><p>$$\int_0^2 \left(3x + 3y + \tfrac92\right)dy = 6x + \tfrac{3\cdot 4}{2} + 9 = 6x + 15$$</p>`,
    R`<p><b>Por fim em $x$</b> (de 0 a 1):</p><p>$$\int_0^1 (6x + 15)\,dx = 3 + 15 = 18$$</p>`,
    R`<p><b>Atalho esperto:</b> a caixa tem volume $1\cdot2\cdot3 = 6$. A média de $x$ é $\frac12$, a de $y$ é $1$ e a de $z$ é $\frac32$; média de $x+y+z$ = $3$. Integral = média × volume = $3\cdot 6 = 18$.</p>`],
  final: R`$18$`,
  viz: { tipo: 'riemann', x: [0, 1], y: [0, 2], z: [0, 3], f: (x, y, z) => x + y + z, fmax: 6, exato: 18, exatoTxt: '18', n: 2, mapa: [{ n: 2 }, { n: 4 }, { n: 6 }, { play: 'n' }] },
  vizCap: 'Cada cubinho vale f(centro) × volume. Cores quentes: x + y + z grande (canto de cima, ao fundo).' },

{ n: 2, nivel: 'iniciante', titulo: 'Produto que se separa',
  enun: R`<p>Calcule:</p>$$\int_0^1\int_0^1\int_0^1 xyz\,dx\,dy\,dz$$`,
  resp: { tipo: 'num', valor: 1 / 8 }, dica: R`Produto de três integrais iguais a $\int_0^1 t\,dt = \frac12$.`,
  passos: [
    R`<p><b>Repare:</b> limites constantes (uma caixa) e integrando que é produto de uma função de $x$, uma de $y$ e uma de $z$. A integral <b>se separa</b>:</p><p>$$\int_0^1 x\,dx\cdot\int_0^1 y\,dy\cdot\int_0^1 z\,dz$$</p>`,
    R`<p>Cada uma vale $\frac{t^2}{2}\Big|_0^1 = \frac12$. Então:</p><p>$$\tfrac12\cdot\tfrac12\cdot\tfrac12 = \tfrac18$$</p>`],
  final: R`$\dfrac18 = 0{,}125$`,
  ideia: 'Caixa de sapato: cada dimensão cuida da sua vida, então a conta vira três contas independentes.', ideiaTag: 'Analogia',
  viz: { tipo: 'riemann', x: [0, 1], y: [0, 1], z: [0, 1], f: (x, y, z) => x * y * z, fmax: 1, exato: .125, exatoTxt: '1/8', n: 3, size: 3.2, mapa: [{ n: 3 }, { play: 'n' }] } },

{ n: 3, nivel: 'iniciante', titulo: 'Separando com seno',
  enun: R`<p>Calcule:</p>$$\int_0^{\pi}\int_0^1\int_0^2 x^2\,y\,\sin z\;dx\,dy\,dz$$`,
  resp: { tipo: 'num', valor: 8 / 3 }, dica: R`$\frac{8}{3}\cdot\frac{1}{2}\cdot 2$.`,
  passos: [
    R`<p><b>Atenção à ordem:</b> $dx$ é a de dentro (0 a 2), depois $dy$ (0 a 1), depois $dz$ (0 a $\pi$). Como é uma caixa e o integrando é produto, separe:</p><p>$$\int_0^2 x^2\,dx\cdot\int_0^1 y\,dy\cdot\int_0^\pi \sin z\,dz$$</p>`,
    R`<p><b>Calcule cada uma:</b></p><p>$$\begin{gathered}\int_0^2 x^2\,dx = \tfrac83 \qquad \int_0^1 y\,dy = \tfrac12 \\ \int_0^\pi\sin z\,dz = -\cos z\Big|_0^\pi = 1 - (-1) = 2\end{gathered}$$</p>`,
    R`<p><b>Multiplique:</b> $\frac83\cdot\frac12\cdot 2 = \frac83$.</p>`],
  final: R`$\dfrac83 \approx 2{,}67$`,
  erro: R`Errar o sinal de $\int_0^\pi \sin z\,dz$: é $[-\cos z]_0^\pi = -\cos\pi + \cos 0 = 1 + 1 = 2$.`,
  viz: { tipo: 'riemann', x: [0, 2], y: [0, 1], z: [0, PI], f: (x, y, z) => x * x * y * Math.sin(z), fmax: 4, exato: 8 / 3, exatoTxt: '8/3 ≈ 2,6667', n: 3, size: 6, mapa: [{ n: 3 }, { n: 5 }, { play: 'n' }] },
  vizCap: 'Os cubinhos do meio da altura (sen z perto de 1) e do canto x = 2, y = 1 são os mais quentes.' },

{ n: 4, nivel: 'iniciante', titulo: 'O que essa integral mede?',
  enun: R`<p>Calcule a integral abaixo e diga o que esse valor representa geometricamente:</p>$$\int_0^1\int_0^x\int_0^y dz\,dy\,dx$$`,
  resp: { tipo: 'num', valor: 1 / 6, ph: 'ex.: 1/6' }, dica: R`É o volume da região $0 \le z \le y \le x \le 1$.`,
  passos: [
    R`<p><b>O integrando é 1</b>, então estamos medindo um <b>volume</b> (só contando cubinhos).</p>`,
    R`<p><b>Em $z$:</b> $\int_0^y dz = y$. <b>Em $y$:</b> $\int_0^x y\,dy = \frac{x^2}{2}$. <b>Em $x$:</b> $\int_0^1 \frac{x^2}{2}\,dx = \frac16$.</p>`,
    R`<p><b>Que sólido é?</b> As desigualdades $0 \le z \le y \le x \le 1$ descrevem um <b>tetraedro</b> com vértices $(0,0,0)$, $(1,0,0)$, $(1,1,0)$ e $(1,1,1)$. Ele ocupa $\frac16$ do cubo unitário.</p>`],
  final: R`$\dfrac16$: volume do tetraedro $0 \le z \le y \le x \le 1$`,
  ideia: R`Curiosidade: existem 6 ordens possíveis para $x, y, z$ ($x\le y\le z$, $x \le z \le y$, ...). Cada uma dá um tetraedro igual, e os 6 juntos montam o cubo. Por isso $\frac16$.`, ideiaTag: 'Curiosidade',
  viz: xy({ geo: { x: [0, 1], y1: () => 0, y2: x => x, z1: () => 0, z2: (x, y) => y }, exato: '1/6 ≈ 0,167', ymax: 1, zmax: 1, size: 2.4, centro: [.5, .5, .3], passo: .25, ax: [1.5, 1.4, 1.3], mapa: [{ pilar: 1 }, { pilar: 1, sombra: 1, play: 'build' }, { pilar: 0, sombra: 0, build: 1 }] }) },

/* ---------------- INTERMEDIÁRIO ---------------- */
{ n: 5, nivel: 'intermediario', titulo: 'Tetraedro de um plano',
  enun: R`Encontre o volume do tetraedro limitado pelos planos coordenados e pelo plano $2x + y + z = 4$.`,
  resp: { tipo: 'num', valor: 16 / 3 }, dica: R`Interceptos 2, 4 e 4, então $V = \frac{2\cdot 4\cdot 4}{6}$.`,
  passos: [
    R`<p><b>Ache onde o plano corta cada eixo</b> (zere as outras variáveis):</p><p>$x$: $2x = 4 \Rightarrow x = 2$; &nbsp; $y$: $y = 4$; &nbsp; $z$: $z = 4$.</p>`,
    R`<p><b>Pilar:</b> do chão $z = 0$ até o plano $z = 4 - 2x - y$.</p><p><b>Sombra no chão</b> (faça $z = 0$): o triângulo $0 \le x \le 2$, $0 \le y \le 4 - 2x$.</p>`,
    R`<p><b>Monte e calcule:</b></p><p>$$\begin{aligned}V &= \int_0^2\int_0^{4-2x}(4 - 2x - y)\,dy\,dx \\ &= \int_0^2 \frac{(4-2x)^2}{2}\,dx = \frac{16}{3}\end{aligned}$$</p>`,
    R`<p><b>Confira com a fórmula</b> $V = \frac{abc}{6}$: $\frac{2\cdot 4\cdot 4}{6} = \frac{32}{6} = \frac{16}{3}$ ✔</p>`],
  final: R`$V = \dfrac{16}{3} \approx 5{,}33$`,
  viz: xy({ geo: { x: [0, 2], y1: () => 0, y2: x => 4 - 2 * x, z1: () => 0, z2: (x, y) => Math.max(0, 4 - 2 * x - y) }, exato: '16/3 ≈ 5,333', ymax: 4, zmax: 4, size: 8.5, centro: [1, 1.6, 1.2], passo: 1, mapa: [{ pilar: 0, sombra: 0, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }] }) },

{ n: 6, nivel: 'intermediario', titulo: 'Integrando x num tetraedro',
  enun: R`<p>Calcule a integral abaixo, onde $E$ é o tetraedro limitado por $x = 0$, $y = 0$, $z = 0$ e $x + y + z = 1$:</p>$$\iiint_E x\,dV$$`,
  resp: { tipo: 'num', valor: 1 / 24, ph: 'ex.: 1/24' }, dica: R`$\int_0^1 x\cdot\frac{(1-x)^2}{2}\,dx$.`,
  passos: [
    R`<p><b>Limites</b> (pilar, depois sombra): $0 \le z \le 1 - x - y$, &nbsp; $0 \le y \le 1 - x$, &nbsp; $0 \le x \le 1$.</p>`,
    R`<p><b>Em $z$:</b> $\int_0^{1-x-y} x\,dz = x(1 - x - y)$.</p><p><b>Em $y$:</b> $\int_0^{1-x} x(1-x-y)\,dy = x\cdot\frac{(1-x)^2}{2}$ (é a área do triângulo de catetos $1-x$, vezes $x$).</p>`,
    R`<p><b>Em $x$:</b></p><p>$$\begin{aligned}&\frac12\int_0^1 (x - 2x^2 + x^3)\,dx \\ &= \frac12\left(\frac12 - \frac23 + \frac14\right) = \frac12\cdot\frac1{12} = \frac1{24}\end{aligned}$$</p>`],
  final: R`$\dfrac{1}{24} \approx 0{,}0417$`,
  ideia: R`Isso é $\bar x \cdot V$. Como $V = \frac16$, o centro de massa tem $\bar x = \frac{1/24}{1/6} = \frac14$. Por simetria, o centroide do tetraedro é $\left(\frac14, \frac14, \frac14\right)$.`, ideiaTag: 'Bônus',
  viz: xy({ geo: tetra1, f: x => x, cor: q => q[0], rotulo: '∭ x dV (numérico)', exato: '1/24 ≈ 0,042', ymax: 1, zmax: 1, size: 2.4, centro: [.45, .45, .3], passo: .25, ax: [1.4, 1.4, 1.3], mapa: [{ pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 0, sombra: 0, play: 'build' }] }),
  vizCap: 'A cor é o integrando x: a ponta do tetraedro no eixo x é a parte que mais pesa.' },

{ n: 7, nivel: 'intermediario', titulo: 'Cilindro com integrando r²',
  enun: R`<p>Usando coordenadas cilíndricas, calcule a integral abaixo, onde $E$ é o cilindro $x^2 + y^2 \le 4$, $0 \le z \le 3$:</p>$$\iiint_E (x^2+y^2)\,dV$$`,
  resp: { tipo: 'num', valor: 24 * PI }, dica: R`$\int_0^{2\pi}\int_0^2\int_0^3 r^2\cdot r\,dz\,dr\,d\theta$ (não esqueça o $r$).`,
  passos: [
    R`<p><b>Traduza:</b> $x^2+y^2 = r^2$; o cilindro é $0 \le r \le 2$, $0 \le \theta \le 2\pi$, $0 \le z \le 3$.</p>`,
    R`<p><b>Monte com o $r$ do Jacobiano:</b></p><p>$$\int_0^{2\pi}\int_0^2\int_0^3 r^2\cdot r\,dz\,dr\,d\theta$$</p>`,
    R`<p><b>Separe:</b> $2\pi\cdot\int_0^2 r^3\,dr\cdot 3 = 2\pi\cdot\frac{16}{4}\cdot 3 = 2\pi\cdot 4\cdot 3 = 24\pi$.</p>`],
  final: R`$24\pi \approx 75{,}40$`,
  erro: R`Sem o $r$ do Jacobiano daria $2\pi\cdot\frac83\cdot 3 = 16\pi$. Errado!`,
  viz: cil({ geo: { th: [0, TAU], r2: () => 2, z1: () => 0, z2: () => 3 }, f: r => r * r, cor: q => (q[0] ** 2 + q[1] ** 2) / 4, rotulo: '∭ r² dV (numérico)', exato: '24π ≈ 75,398', size: 7, cz: 1.4, R: 2, mapa: [{ pilar: 0, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }] }) },

{ n: 8, nivel: 'intermediario', titulo: 'Debaixo do paraboloide',
  enun: R`Encontre o volume do sólido acima do plano $z = 0$ e abaixo do paraboloide $z = 4 - x^2 - y^2$.`,
  resp: { tipo: 'num', valor: 8 * PI }, dica: R`$\int_0^{2\pi}\int_0^2 (4-r^2)\,r\,dr\,d\theta$.`,
  passos: [
    R`<p><b>Pilar:</b> do chão $z = 0$ até $z = 4 - r^2$ (o paraboloide, em cilíndricas).</p>`,
    R`<p><b>Sombra:</b> o paraboloide toca o chão quando $4 - r^2 = 0$, ou seja, $r = 2$. A sombra é o disco $0 \le r \le 2$.</p>`,
    R`<p><b>Monte e calcule:</b></p><p>$$\begin{aligned}V &= \int_0^{2\pi}\int_0^2 (4 - r^2)\,r\,dr\,d\theta \\ &= 2\pi\left[2r^2 - \frac{r^4}{4}\right]_0^2 = 2\pi(8 - 4) = 8\pi\end{aligned}$$</p>`],
  final: R`$V = 8\pi \approx 25{,}13$`,
  ideia: R`Compare: o cilindro de raio 2 e altura 4 tem volume $16\pi$. O paraboloide ocupa exatamente <b>metade</b> dele.`, ideiaTag: 'Teste de sanidade',
  viz: cil({ geo: { th: [0, TAU], r2: () => 2, z1: () => 0, z2: r => 4 - r * r }, exato: '8π ≈ 25,133', zTopo: 'z = 4 − r²', zBase: 'z = 0', rotSombra: 'disco r ≤ 2', size: 7.5, cz: 1.6, R: 2, mapa: passosPadrao() }) },

/* ---------------- AVANÇADO ---------------- */
{ n: 9, nivel: 'avancado', titulo: 'Bola em esféricas',
  enun: R`<p>Calcule a integral abaixo, onde $B$ é a bola unitária $x^2 + y^2 + z^2 \le 1$:</p>$$\iiint_B e^{(x^2+y^2+z^2)^{3/2}}\,dV$$`,
  resp: { tipo: 'num', valor: 4 * PI / 3 * (Math.E - 1), ph: 'ex.: 4pi(e-1)/3' }, dica: R`Em esféricas: $4\pi\int_0^1 e^{\rho^3}\rho^2\,d\rho$, com $u = \rho^3$.`,
  passos: [
    R`<p><b>Escolha a ferramenta:</b> apareceu $x^2+y^2+z^2$ e a região é uma bola. É caso de <b>esféricas</b>: $x^2+y^2+z^2 = \rho^2$, então $(\rho^2)^{3/2} = \rho^3$.</p>`,
    R`<p><b>Limites e Jacobiano:</b> bola unitária é $0 \le \rho \le 1$, $0 \le \varphi \le \pi$, $0 \le \theta \le 2\pi$, e $dV = \rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta$.</p><p>$$\int_0^{2\pi}\int_0^\pi\int_0^1 e^{\rho^3}\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta$$</p>`,
    R`<p><b>Separe:</b> $\int_0^{2\pi}d\theta = 2\pi$ e $\int_0^\pi\sin\varphi\,d\varphi = 2$. Sobra:</p><p>$$4\pi\int_0^1 e^{\rho^3}\rho^2\,d\rho$$</p>`,
    R`<p><b>Substituição</b> $u = \rho^3$, $du = 3\rho^2\,d\rho$:</p><p>$$4\pi\cdot\frac13\int_0^1 e^u\,du = \frac{4\pi}{3}(e - 1)$$</p>`],
  final: R`$\dfrac{4\pi}{3}(e-1) \approx 7{,}20$`,
  ideia: R`Pense numa cebola: a bola é feita de cascas finas de raio $\rho$, área $4\pi\rho^2$ e espessura $d\rho$. Em cada casca o integrando é constante ($e^{\rho^3}$). Somar as cascas é a integral $\int 4\pi\rho^2 e^{\rho^3}\,d\rho$.`, ideiaTag: 'Analogia: a cebola',
  viz: { tipo: 'cebola', mapa: [{ rho: .3 }, { rho: .6 }, { rho: .8 }, { play: 'rho' }] },
  vizCap: 'Bola cortada: cada casca tem a cor do integrando e^(ρ³). A leitura acumula as cascas até o raio ρ.' },

{ n: 10, nivel: 'avancado', titulo: 'A casquinha de sorvete',
  enun: R`Encontre o volume da região acima do cone $z = \sqrt{x^2 + y^2}$ e abaixo da esfera $x^2 + y^2 + z^2 = 1$.`,
  resp: { tipo: 'num', valor: PI * (2 - sq(2)) / 3, ph: 'ex.: pi(2-sqrt2)/3' }, dica: R`$0 \le \rho \le 1$, $0 \le \varphi \le \frac{\pi}{4}$, $0 \le \theta \le 2\pi$.`,
  passos: [
    R`<p><b>Em esféricas, tudo vira constante:</b> a esfera é $\rho = 1$ e o cone $z = \sqrt{x^2+y^2}$ é $\varphi = \frac{\pi}{4}$ (o cone que abre 45° a partir do eixo $z$).</p>`,
    R`<p><b>Limites:</b> $0 \le \rho \le 1$, &nbsp; $0 \le \varphi \le \frac{\pi}{4}$ (de dentro do cone), &nbsp; $0 \le \theta \le 2\pi$.</p>`,
    R`<p><b>Calcule:</b></p><p>$$\begin{aligned}V &= \int_0^{2\pi}\int_0^{\pi/4}\int_0^1 \rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta \\ &= 2\pi\cdot\left(1 - \frac{\sqrt2}{2}\right)\cdot\frac13\end{aligned}$$</p>`,
    R`<p><b>Simplifique:</b> $\frac{2\pi}{3}\cdot\frac{2-\sqrt2}{2} = \frac{\pi(2-\sqrt2)}{3}$.</p>`],
  final: R`$V = \dfrac{\pi(2-\sqrt2)}{3} \approx 0{,}613$`,
  ideia: R`Na animação o sólido está desenhado em cilíndricas: pilar do cone $z = r$ até a esfera $z = \sqrt{1-r^2}$, sombra $r \le \frac{1}{\sqrt2}$. Dá o mesmo volume, só que a conta fica mais chata. Esse mesmo sólido aparece no Monte Carlo da página de Aplicações.`, ideiaTag: 'Outro caminho',
  viz: cil({ geo: { th: [0, TAU], r2: () => Math.SQRT1_2, z1: r => r, z2: r => sq(Math.max(0, 1 - r * r)) }, exato: 'π(2 − √2)/3 ≈ 0,613', zTopo: 'esfera ρ = 1', zBase: 'cone φ = π/4', size: 2.6, cz: .55, R: 1, ax: 1.3, mapa: [{ pilar: 1, sombra: 0, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }] }) },

{ n: 11, nivel: 'avancado', titulo: 'Mudando a ordem',
  enun: R`<p>Reescreva a integral abaixo na ordem $dx\,dy\,dz$:</p>$$\int_0^1\int_0^{x^2}\int_0^{y} f(x,y,z)\,dz\,dy\,dx$$`,
  resp: { tipo: 'escolha', perguntas: [{ opcoes: [R`$\displaystyle\int_0^1\!\!\int_z^1\!\!\int_{\sqrt y}^1 f\,dx\,dy\,dz$`, R`$\displaystyle\int_0^1\!\!\int_0^z\!\!\int_0^{\sqrt y} f\,dx\,dy\,dz$`, R`$\displaystyle\int_0^1\!\!\int_z^1\!\!\int_0^{y^2} f\,dx\,dy\,dz$`], certa: 0 }] },
  dica: R`Região: $0 \le z \le y \le x^2 \le 1$.`,
  passos: [
    R`<p><b>Escreva a região como uma corrente de desigualdades:</b></p><p>$$\begin{gathered}0 \le z \le y, \qquad 0 \le y \le x^2, \qquad 0 \le x \le 1 \\ \Longrightarrow\quad 0 \le z \le y \le x^2 \le 1\end{gathered}$$</p>`,
    R`<p><b>Nova ordem: $z$ por fora.</b> O menor valor de $z$ é 0 e o maior é 1, então $0 \le z \le 1$. Fixado $z$, a fatia é horizontal (veja a animação).</p>`,
    R`<p><b>Depois $y$:</b> pela corrente, $z \le y$ e $y \le x^2 \le 1$, então $z \le y \le 1$.</p><p><b>Por dentro $x$:</b> $x^2 \ge y$ dá $x \ge \sqrt y$, e $x \le 1$. Então $\sqrt y \le x \le 1$.</p><p>$$\int_0^1\int_z^1\int_{\sqrt y}^1 f(x,y,z)\,dx\,dy\,dz$$</p>`],
  final: R`$\displaystyle\int_0^1\int_z^1\int_{\sqrt{y}}^1 f\,dx\,dy\,dz$`,
  ideia: 'Fatiar o pão: na ordem original as fatias são perpendiculares a x (triângulos). Na nova, são horizontais (z = cte). O pão é o mesmo, então o volume também: com f = 1 as duas dão 1/10.', ideiaTag: 'Analogia: o pão',
  viz: xy({ geo: { x: [0, 1], y1: () => 0, y2: x => x * x, z1: () => 0, z2: (x, y) => y }, ymax: 1, zmax: 1, size: 2.4, centro: [.55, .45, .3], passo: .25, ax: [1.5, 1.4, 1.3], exato: '1/10 = 0,100',
    fatias: [[0, 'nenhuma'], ['x', 'x = cte'], ['z', 'z = cte']], fatia: 'x',
    fatiaPoly(modo, pos) { const z0 = Math.min(.97, Math.max(.02, pos)), poly = []; for (let i = 0; i <= 24; i++) { const y = z0 + (1 - z0) * i / 24; poly.push([sq(y), y, z0]); } for (let i = 0; i <= 24; i++) { const y = 1 - (1 - z0) * i / 24; poly.push([1, y, z0]); } return { poly, txt: 'z = ' + V.fmt(z0) }; },
    mapa: [{ fatia: 'x' }, { fatia: 'z' }, { fatia: 'z' }] }),
  vizCap: 'Fatia âmbar: "x = cte" mostra a ordem original; "z = cte" mostra a nova. Arraste a posição.' },

{ n: 12, nivel: 'avancado', titulo: 'Onde equilibrar o hemisfério',
  enun: R`Encontre o centroide $(\bar x, \bar y, \bar z)$ do hemisfério sólido $x^2 + y^2 + z^2 \le a^2$, $z \ge 0$, com densidade constante.`,
  resp: { tipo: 'num', valor: v => 3 * v.a / 8, vars: { a: 1 }, prefixo: 'z̄ =', ph: 'ex.: 3a/8' }, dica: R`Por simetria $\bar x = \bar y = 0$; $\bar z = \dfrac{\iiint z\,dV}{\frac23\pi a^3}$.`,
  passos: [
    R`<p><b>Simetria primeiro:</b> o hemisfério é igual em todas as direções em torno do eixo $z$, como um pião. Então o centro de massa está <b>no eixo</b>: $\bar x = \bar y = 0$. Só falta $\bar z$.</p>`,
    R`<p><b>Volume:</b> metade da bola, $V = \frac12\cdot\frac43\pi a^3 = \frac23\pi a^3$.</p>`,
    R`<p><b>Momento em $z$</b> (em esféricas, $z = \rho\cos\varphi$, e $\varphi$ só vai até $\frac{\pi}{2}$ porque $z \ge 0$):</p><p>$$\begin{aligned}\iiint z\,dV &= \int_0^{2\pi}\int_0^{\pi/2}\int_0^a \rho\cos\varphi\;\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta \\ &= 2\pi\cdot\frac12\cdot\frac{a^4}{4} = \frac{\pi a^4}{4}\end{aligned}$$</p>`,
    R`<p><b>Divida:</b></p><p>$$\bar z = \frac{\pi a^4/4}{2\pi a^3/3} = \frac{3a}{8}$$</p><p>Faz sentido: fica abaixo da metade da altura ($\frac{a}{2}$), porque a base é mais larga e tem mais massa.</p>`],
  final: R`$(\bar x, \bar y, \bar z) = \left(0,\ 0,\ \frac{3a}{8}\right)$`,
  ideia: 'Centro de massa é o ponto onde você equilibraria o objeto na ponta do dedo. Para uma tigela maciça virada para baixo, esse ponto fica perto da base, a 3/8 da altura.', ideiaTag: 'Analogia',
  viz: cil({ geo: { th: [0, TAU], r2: () => 1.5, z1: () => 0, z2: r => sq(Math.max(0, 2.25 - r * r)) }, exato: '2πa³/3 ≈ 7,069', marca: { z: 3 * 1.5 / 8, txt: 'z̄ = 3a/8' }, size: 5.5, cz: .7, R: 2, ax: 2.2, mapa: [{ build: .75 }, { build: .75 }, { build: .75 }, { play: 'build' }] }),
  vizCap: 'Hemisfério com a = 1,5, cortado para mostrar o ponto de equilíbrio (azul) no eixo.' },

{ n: 13, nivel: 'avancado', titulo: 'O volume do elipsoide',
  enun: R`<p>Usando a mudança de variáveis $x = au$, $y = bv$, $z = cw$, mostre que o volume do elipsoide abaixo é $\frac{4}{3}\pi abc$:</p>$$\frac{x^2}{a^2}+\frac{y^2}{b^2}+\frac{z^2}{c^2} \le 1$$`,
  resp: { tipo: 'escolha', perguntas: [{ p: 'Quanto vale o Jacobiano da transformação?', opcoes: ['$abc$', '$a+b+c$', '$1/(abc)$', '$(abc)^2$'], certa: 0 }] },
  dica: 'O Jacobiano é o determinante de uma matriz diagonal.',
  passos: [
    R`<p><b>Substitua na região:</b> $\frac{(au)^2}{a^2} + \frac{(bv)^2}{b^2} + \frac{(cw)^2}{c^2} = u^2 + v^2 + w^2 \le 1$. No mundo $(u,v,w)$, o elipsoide vira a <b>bola unitária</b>!</p>`,
    R`<p><b>Jacobiano:</b></p><p>$$\frac{\partial(x,y,z)}{\partial(u,v,w)} = \det\begin{pmatrix} a & 0 & 0\\ 0 & b & 0\\ 0 & 0 & c\end{pmatrix} = abc$$</p>`,
    R`<p><b>Calcule:</b></p><p>$$\begin{aligned}V &= \iiint_{\text{bola}} abc\;du\,dv\,dw \\ &= abc\cdot\underbrace{\tfrac43\pi}_{\text{vol. da bola}} = \tfrac43\pi abc \;\;\blacksquare\end{aligned}$$</p>`],
  final: R`$V = \dfrac43\pi abc$`,
  ideia: R`A bexiga: desenhe uma bolinha numa bexiga murcha e encha. Ela estica $a$, $b$ e $c$ vezes nas três direções, e o volume fica multiplicado por $abc$. Com $a = b = c = R$, volta a esfera $\frac43\pi R^3$.`, ideiaTag: 'Analogia: a bexiga',
  viz: { tipo: 'elipsoide', mapa: [{ t: 0 }, { play: 't' }, { t: 1 }] } }
] };
function passosPadrao() { return [{ pilar: 1, sombra: 0, build: 1 }, { pilar: 1, sombra: 1, build: 1 }, { pilar: 1, sombra: 1, play: 'build' }]; }
})();
