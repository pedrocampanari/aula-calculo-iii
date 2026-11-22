# Exercícios de Integrais Triplas

## Nível Iniciante

Limites constantes e regiões simples.

**1.** Calcule:

$$\int_0^1\int_0^2\int_0^3 (x+y+z)\,dz\,dy\,dx$$

**2.** Calcule:

$$\int_0^1\int_0^1\int_0^1 xyz\,dx\,dy\,dz$$

**3.** Calcule:

$$\int_0^{\pi}\int_0^1\int_0^2 x^2\,y\,\sin z\;dx\,dy\,dz$$

**4.** Calcule a integral abaixo e diga o que esse valor representa geometricamente:

$$\int_0^1\int_0^x\int_0^y dz\,dy\,dx$$

## Nível Intermediário

Limites variáveis e coordenadas cilíndricas.

**5.** Encontre o volume do tetraedro limitado pelos planos coordenados e pelo plano $2x + y + z = 4$.

**6.** Calcule a integral abaixo, onde $E$ é o tetraedro limitado por $x = 0$, $y = 0$, $z = 0$ e $x + y + z = 1$:

$$\iiint_E x\,dV$$

**7.** Usando coordenadas cilíndricas, calcule a integral abaixo, onde $E$ é o cilindro $x^2 + y^2 \le 4$, $0 \le z \le 3$:

$$\iiint_E (x^2+y^2)\,dV$$

**8.** Encontre o volume do sólido acima do plano $z = 0$ e abaixo do paraboloide $z = 4 - x^2 - y^2$.

## Nível Avançado

Coordenadas esféricas, mudança de ordem, aplicações e Jacobiano.

**9.** Calcule a integral abaixo, onde $B$ é a bola unitária $x^2 + y^2 + z^2 \le 1$:

$$\iiint_B e^{(x^2+y^2+z^2)^{3/2}}\,dV$$

**10.** Encontre o volume da região acima do cone $z = \sqrt{x^2 + y^2}$ e abaixo da esfera $x^2 + y^2 + z^2 = 1$ (a "casquinha de sorvete").

**11.** Reescreva a integral abaixo na ordem $dx\,dy\,dz$:

$$\int_0^1\int_0^{x^2}\int_0^{y} f(x,y,z)\,dz\,dy\,dx$$

**12.** Encontre o centroide $(\bar x, \bar y, \bar z)$ do hemisfério sólido $x^2 + y^2 + z^2 \le a^2$, $z \ge 0$, com densidade constante.

**13.** Usando a mudança de variáveis $x = au$, $y = bv$, $z = cw$, mostre que o volume do elipsoide abaixo é $\frac{4}{3}\pi abc$:

$$\frac{x^2}{a^2}+\frac{y^2}{b^2}+\frac{z^2}{c^2} \le 1$$

## Gabarito

Tente resolver antes de olhar.

| Nº | Resposta | Dica rápida |
| --- | --- | --- |
| 1 | $18$ | Separe em três integrais; cada uma é (média da variável) × volume 6 |
| 2 | $\frac{1}{8}$ | Produto de três integrais iguais a $\int_0^1 t\,dt = \frac{1}{2}$ |
| 3 | $\frac{8}{3}$ | $\frac{8}{3}\cdot\frac{1}{2}\cdot 2$ |
| 4 | $\frac{1}{6}$ | É o volume da região $0 \le z \le y \le x \le 1$ |
| 5 | $\frac{16}{3}$ | Interceptos 2, 4 e 4, então $V = \frac{2\cdot 4\cdot 4}{6}$ |
| 6 | $\frac{1}{24}$ | $\int_0^1 x\cdot\frac{(1-x)^2}{2}\,dx$ |
| 7 | $24\pi$ | $\int_0^{2\pi}\int_0^2\int_0^3 r^2\cdot r\,dz\,dr\,d\theta$ (não esqueça o $r$ do Jacobiano) |
| 8 | $8\pi$ | $\int_0^{2\pi}\int_0^2 (4-r^2)\,r\,dr\,d\theta$ |
| 9 | $\frac{4\pi}{3}(e-1)$ | Em esféricas: $4\pi\int_0^1 e^{\rho^3}\rho^2\,d\rho$, com $u=\rho^3$ |
| 10 | $\frac{\pi(2-\sqrt{2})}{3}$ | $0 \le \rho \le 1$, $0 \le \varphi \le \frac{\pi}{4}$, $0 \le \theta \le 2\pi$ |
| 11 | $\int_0^1\int_z^1\int_{\sqrt{y}}^1 f\,dx\,dy\,dz$ | Região: $0 \le z \le y \le x^2 \le 1$ |
| 12 | $\left(0,\,0,\,\frac{3a}{8}\right)$ | Por simetria $\bar x = \bar y = 0$; $\bar z = \dfrac{\iiint z\,dV}{\frac{2}{3}\pi a^3}$ |
| 13 | $\frac{4}{3}\pi abc$ | Jacobiano $= abc$; a região vira a bola unitária, de volume $\frac{4}{3}\pi$ |