# Exercícios de Coordenadas Cilíndricas

**Fórmulas de referência**

$$x = r\cos\theta \qquad y = r\sin\theta \qquad z = z$$

$$r^2 = x^2 + y^2 \qquad \tan\theta = \frac{y}{x} \qquad dV = r\,dz\,dr\,d\theta$$

Convenção: $r \ge 0$ e $0 \le \theta < 2\pi$.

---

## Nível Iniciante

Conversões de pontos e identificação de superfícies simples.

**1.** Converta o ponto $(r, \theta, z) = \left(2, \frac{\pi}{3}, 5\right)$ para coordenadas cartesianas.

**2.** Converta o ponto $(r, \theta, z) = (3, \pi, -2)$ para coordenadas cartesianas.

**3.** Converta o ponto cartesiano $(1, 1, 4)$ para coordenadas cilíndricas.

**4.** Converta o ponto cartesiano $(-2, 2\sqrt{3}, 1)$ para coordenadas cilíndricas.

**5.** Converta o ponto cartesiano $(0, -5, 3)$ para coordenadas cilíndricas.

**6.** Identifique e descreva cada superfície dada em coordenadas cilíndricas:

- a) $r = 3$
- b) $\theta = \frac{\pi}{4}$
- c) $z = r$

---

## Nível Intermediário

Conversão de equações e integrais simples.

**7.** Escreva a equação $x^2 + y^2 = 4x$ em coordenadas cilíndricas e descreva a superfície.

**8.** Escreva o paraboloide $z = x^2 + y^2$ em coordenadas cilíndricas.

**9.** Escreva a esfera $x^2 + y^2 + z^2 = 9$ em coordenadas cilíndricas.

**10.** Converta $r = 2\sin\theta$ para coordenadas cartesianas e identifique a superfície.

**11.** Converta $z = r^2\cos 2\theta$ para coordenadas cartesianas e identifique a superfície.

**12.** Descreva o sólido dado por $0 \le r \le 2$, $0 \le \theta \le \frac{\pi}{2}$, $0 \le z \le 3$ e calcule seu volume.

**13.** Calcule a integral abaixo, onde $E$ é o cilindro $x^2 + y^2 \le 1$, $0 \le z \le 2$:

$$\iiint_E \sqrt{x^2+y^2}\,dV$$

---

## Nível Avançado

Volumes entre superfícies, mudança de coordenadas em integrais e aplicações físicas.

**14.** Encontre o volume do sólido que está dentro da esfera $x^2 + y^2 + z^2 = 4$ e fora do cilindro $x^2 + y^2 = 1$.

**15.** Encontre o volume do sólido limitado pelo paraboloide $z = x^2 + y^2$ e pelo plano $z = 2y$.

**16.** Um cilindro sólido $x^2 + y^2 \le a^2$, $0 \le z \le h$ tem densidade igual à distância ao eixo $z$, ou seja, $\delta = r$. Encontre sua massa.

**17.** Mostre que o momento de inércia em relação ao eixo $z$ de um cilindro sólido homogêneo de raio $a$, altura $h$ e massa $M$ é:

$$I_z = \frac{1}{2}Ma^2$$

**18.** Converta para coordenadas cilíndricas e calcule:

$$\int_{-2}^{2}\int_{-\sqrt{4-x^2}}^{\sqrt{4-x^2}}\int_{\sqrt{x^2+y^2}}^{2} (x^2+y^2)\,dz\,dy\,dx$$

**19.** Calcule o Jacobiano da transformação $(r, \theta, z) \mapsto (x, y, z)$ e justifique por que $dV = r\,dz\,dr\,d\theta$:

$$J = \frac{\partial(x,y,z)}{\partial(r,\theta,z)}$$

---

## Gabarito

Tente resolver antes de olhar.

| Nº | Resposta | Dica rápida |
| --- | --- | --- |
| 1 | $(1, \sqrt{3}, 5)$ | $x = 2\cos\frac{\pi}{3}$, $y = 2\sin\frac{\pi}{3}$ |
| 2 | $(-3, 0, -2)$ | $\cos\pi = -1$, $\sin\pi = 0$ |
| 3 | $\left(\sqrt{2}, \frac{\pi}{4}, 4\right)$ | $r = \sqrt{1+1}$, $\tan\theta = 1$ no 1º quadrante |
| 4 | $\left(4, \frac{2\pi}{3}, 1\right)$ | $\tan\theta = -\sqrt{3}$, mas o ponto está no 2º quadrante |
| 5 | $\left(5, \frac{3\pi}{2}, 3\right)$ | Ponto sobre o eixo $y$ negativo |
| 6 | a) cilindro de raio 3 em torno do eixo $z$; b) semiplano vertical $y = x$ com $x \ge 0$; c) cone circular, folha superior | Fixe uma coordenada e veja o que sobra livre |
| 7 | $r = 4\cos\theta$ | $r^2 = 4r\cos\theta$; cilindro circular de raio 2 centrado em $(2, 0)$ |
| 8 | $z = r^2$ | $x^2 + y^2 = r^2$ |
| 9 | $r^2 + z^2 = 9$ | Substitua $x^2 + y^2$ por $r^2$ |
| 10 | $x^2 + (y-1)^2 = 1$ | Multiplique por $r$: $r^2 = 2r\sin\theta$; cilindro de raio 1 centrado em $(0, 1)$ |
| 11 | $z = x^2 - y^2$ | $r^2\cos 2\theta = r^2\cos^2\theta - r^2\sin^2\theta$; paraboloide hiperbólico (sela) |
| 12 | $3\pi$ | Um quarto de cilindro de raio 2 e altura 3: $\frac{1}{4}\cdot\pi\cdot 4\cdot 3$ |
| 13 | $\frac{4\pi}{3}$ | $\int_0^{2\pi}\int_0^1\int_0^2 r\cdot r\,dz\,dr\,d\theta$ |
| 14 | $4\sqrt{3}\,\pi$ | $\int_0^{2\pi}\int_1^2 2\sqrt{4-r^2}\;r\,dr\,d\theta$ |
| 15 | $\frac{\pi}{2}$ | Interseção: $r = 2\sin\theta$, $0 \le \theta \le \pi$; integrando $(2r\sin\theta - r^2)\,r$ |
| 16 | $\frac{2\pi h a^3}{3}$ | $\int_0^{2\pi}\int_0^a\int_0^h r\cdot r\,dz\,dr\,d\theta$ |
| 17 | $I_z = \frac{\pi\delta h a^4}{2}$ | $I_z = \iiint r^2\,\delta\,dV$ e $M = \delta\pi a^2 h$ |
| 18 | $\frac{16\pi}{5}$ | Região: $0 \le r \le 2$, $r \le z \le 2$; integrando $r^2\cdot r$ |
| 19 | $J = r$ | Determinante da matriz com linhas $(\cos\theta, -r\sin\theta, 0)$, $(\sin\theta, r\cos\theta, 0)$, $(0, 0, 1)$ |