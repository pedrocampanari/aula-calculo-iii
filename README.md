# Resumão: Coordenadas Cilíndricas e Integrais Triplas

Material de revisão que acompanha as listas `exercicios-coordenadas-cilindricas.md` e `exercicios-integrais-triplas.md`.

---

## 1. Coordenadas cilíndricas

São coordenadas **polares no plano $xy$**, com o $z$ mantido igual.

> **Analogia: o farol e o elevador.** Imagine que você está num farol no meio do mar e quer indicar onde está um barco:
> - **$r$** = a que distância ele está do farol;
> - **$\theta$** = para que direção apontar a luz (o ângulo, como numa bússola);
> - **$z$** = a altura. Se o "barco" fosse um drone, seria em que andar do elevador imaginário ele está.
>
> As cartesianas são como as ruas de um bairro em grade ("3 quadras para leste, 2 para norte"). As cilíndricas são como um radar ("a 5 km, na direção 60°").

### Conversões

| De cilíndricas para cartesianas | De cartesianas para cilíndricas |
| --- | --- |
| $x = r\cos\theta$ | $r = \sqrt{x^2+y^2}$ |
| $y = r\sin\theta$ | $\tan\theta = \dfrac{y}{x}$ (olhe o quadrante!) |
| $z = z$ | $z = z$ |

Convenção usual: $r \ge 0$, $0 \le \theta < 2\pi$.

**Armadilha do quadrante:** $\tan\theta = -\sqrt{3}$ pode ser $\frac{2\pi}{3}$ (2º quadrante) ou $\frac{5\pi}{3}$ (4º quadrante). Decida pelos sinais de $x$ e $y$.

> **Analogia: o ponteiro do relógio.** A tangente só enxerga a inclinação do ponteiro, não para que lado ele aponta. Um ponteiro marcando 1h30 e outro marcando 7h30 têm a mesma inclinação, mas apontam para lados opostos. Os sinais de $x$ e $y$ dizem qual dos dois é o certo.

**Pontos sobre os eixos:** $(0, y)$ com $y > 0$ dá $\theta = \frac{\pi}{2}$; com $y < 0$ dá $\theta = \frac{3\pi}{2}$.

### Superfícies básicas

| Equação | Superfície |
| --- | --- |
| $r = c$ | Cilindro de raio $c$ em torno do eixo $z$ |
| $\theta = c$ | Semiplano vertical que sai do eixo $z$ |
| $z = c$ | Plano horizontal |
| $z = r$ | Cone (folha superior) |
| $z = r^2$ | Paraboloide |
| $r^2 + z^2 = R^2$ | Esfera de raio $R$ |
| $r = 2a\cos\theta$ | Cilindro de raio $a$ centrado em $(a, 0)$ |
| $r = 2a\sin\theta$ | Cilindro de raio $a$ centrado em $(0, a)$ |

> **Analogias para as superfícies:**
> - $r = c$: uma **lata de refrigerante** infinita. Todos os pontos estão à mesma distância do eixo central.
> - $\theta = c$: uma **porta giratória** parada, ou a faca no corte de uma pizza. É uma parede que sai do eixo.
> - $z = c$: o **piso de um andar** do prédio.
> - $z = r$: uma **casquinha de sorvete** de cabeça para baixo. Quanto mais longe do centro, mais alto.
> - $z = r^2$: uma **antena parabólica** ou uma tigela.
> - $r = 2a\cos\theta$: um **cano** que encosta no eixo $z$, em vez de ter o eixo no meio.

### Truques de conversão de equações

- Trocar $x^2 + y^2$ por $r^2$ sempre que aparecer.
- Se aparece $x$ ou $y$ sozinho ao lado de $r^2$, **divida por $r$**: $r^2 = 4r\cos\theta \Rightarrow r = 4\cos\theta$.
- No caminho inverso, **multiplique por $r$**: $r = 2\sin\theta \Rightarrow r^2 = 2r\sin\theta \Rightarrow x^2 + y^2 = 2y$.
- Identidades úteis: $r^2\cos 2\theta = x^2 - y^2$ e $r^2\sin 2\theta = 2xy$.

### Elemento de volume

$$dV = r\,dz\,dr\,d\theta$$

O fator $r$ vem do Jacobiano:

$$J = \det\begin{pmatrix} \cos\theta & -r\sin\theta & 0 \\ \sin\theta & r\cos\theta & 0 \\ 0 & 0 & 1 \end{pmatrix} = r$$

**Esquecer o $r$ é o erro mais comum da matéria.**

> **Analogia: as fatias de pizza.** Corte uma pizza em fatias iguais e depois em anéis. Um pedacinho perto do centro é minúsculo; um pedacinho da borda, com o mesmo ângulo e a mesma largura de anel, é bem maior. O tamanho do pedaço **cresce com a distância ao centro**, e o $r$ no $dV$ faz exatamente essa correção.
>
> **Outra: o carrossel.** Numa volta completa, o cavalinho da borda percorre um caminho muito maior que o da parte de dentro. O arco percorrido é $r\,d\theta$, e não apenas $d\theta$.

### Quando usar cilíndricas

- A região tem simetria em torno do eixo $z$ (cilindros, cones, paraboloides, esferas cortadas por cilindros).
- O integrando ou os limites têm $x^2 + y^2$.
- A projeção no plano $xy$ é um disco, anel ou setor circular.

> **Regra prática: "isso cabe num torno?"** Se o objeto poderia ser feito girando um material num torno ou numa roda de oleiro (copo, vaso, lata, funil, parafuso, cano), use cilíndricas. Se tem cara de caixa ou de tijolo, use cartesianas.

### Roteiro para montar a integral

1. Ache $z$ de baixo e de cima em função de $r$ (e $\theta$): limites de dentro.
2. Projete no plano $xy$ e descreva a sombra em polares: limites de $r$ e $\theta$.
3. Troque $x^2+y^2$ por $r^2$ e coloque o $r$ extra.

$$\iiint_E f\,dV = \int_{\alpha}^{\beta}\int_{r_1(\theta)}^{r_2(\theta)}\int_{z_1(r,\theta)}^{z_2(r,\theta)} f(r\cos\theta,\, r\sin\theta,\, z)\;r\,dz\,dr\,d\theta$$

### Converter uma integral cartesiana

Se os limites de $y$ são $\pm\sqrt{a^2 - x^2}$ e $x$ vai de $-a$ a $a$, a sombra é o **disco de raio $a$**: troque por $0 \le r \le a$, $0 \le \theta \le 2\pi$.

> **Analogia: a tradução.** Descrever um disco em cartesianas é como explicar o caminho até a casa de alguém dando cada curva ("anda 3, vira, anda $\sqrt{4-x^2}$..."). Em cilíndricas é como dizer "é tudo num raio de 2 km da praça". É o mesmo lugar, dito na língua certa.

---

## 2. Integral tripla: a ideia

A integral tripla soma uma função $f(x,y,z)$ sobre um sólido $E$ do espaço:

$$\iiint_E f(x,y,z)\,dV$$

| Integrando | O que a integral calcula |
| --- | --- |
| $f = 1$ | Volume de $E$ |
| $f = \delta(x,y,z)$ (densidade) | Massa de $E$ |
| $f = z\,\delta$ (ou $x\,\delta$, $y\,\delta$) | Momento, usado para achar o centro de massa |
| $f = (x^2+y^2)\,\delta$ | Momento de inércia em relação ao eixo $z$ |

> **Analogia: o bolo de padaria.** Pense em $E$ como um bolo e em $dV$ como um cubinho minúsculo dele. A integral tripla corta o bolo em milhões de cubinhos, mede algo em cada um e soma tudo.
> - Com $f = 1$, você só **conta os cubinhos**, ou seja, mede o tamanho do bolo (volume).
> - Com $f = \delta$, cada cubinho tem um peso diferente: os que têm mais recheio de chocolate pesam mais. Somar dá o **peso total do bolo** (massa).
>
> **Centro de massa** é o ponto onde você equilibraria o bolo na ponta do dedo.
>
> **Momento de inércia** mede o quanto é difícil fazer o objeto girar. É por isso que a patinadora gira mais rápido quando encolhe os braços: com a massa mais perto do eixo, ela tem menos inércia de rotação.

---

## 3. Coordenadas cartesianas

### Caixa (limites constantes)

$$\int_a^b\int_c^d\int_e^f g(x,y,z)\,dz\,dy\,dx$$

Se o integrando é produto de funções de uma variável só, a integral vira **produto de três integrais simples**:

$$\iiint_{\text{caixa}} g_1(x)\,g_2(y)\,g_3(z)\,dV = \left(\int g_1\,dx\right)\left(\int g_2\,dy\right)\left(\int g_3\,dz\right)$$

> **Analogia: a caixa de sapato.** Numa caixa, o comprimento não depende da largura, e nenhum dos dois depende da altura. Cada dimensão "cuida da sua vida". Por isso a conta se separa, assim como o volume da caixa é só comprimento × largura × altura.

### Regiões gerais (limites variáveis)

Regra de ouro: **limites de fora são números, limites de dentro podem depender das variáveis de fora**.

$$\int_{a}^{b}\int_{g_1(x)}^{g_2(x)}\int_{h_1(x,y)}^{h_2(x,y)} f\,dz\,dy\,dx$$

Roteiro:

1. Descubra o "piso" e o "teto" em $z$: são os limites de dentro.
2. Projete o sólido no plano $xy$ e descreva essa região $D$.
3. Integre em $D$ como numa integral dupla.

> **Analogia: o prédio e a planta baixa.** Para cada ponto do terreno, pergunte "onde é o chão e onde é o teto aqui?". Essa é a integral de dentro, em $z$. Depois olhe o prédio de cima, de helicóptero: a **sombra** dele no chão é a região $D$, a planta baixa. Os limites de fora descrevem essa planta.
>
> **Por que os limites de fora são números?** É como um endereço: primeiro a cidade (fixa), depois a rua (que depende da cidade), depois o número (que depende da rua). Não faz sentido a cidade depender do número da casa.

### Tetraedro (caso clássico)

Sólido limitado pelos planos coordenados e por $\frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1$:

$$V = \frac{abc}{6}$$

### Mudança de ordem

Escreva a região como desigualdades encadeadas e releia na nova ordem. Exemplo:

$$0 \le x \le 1,\; 0 \le y \le x^2,\; 0 \le z \le y \quad\Longleftrightarrow\quad 0 \le z \le 1,\; z \le y \le 1,\; \sqrt{y} \le x \le 1$$

> **Analogia: fatiar o pão.** Você pode cortar um pão de forma em fatias verticais, horizontais ou de lado. O formato das fatias muda, mas a quantidade de pão é a mesma. Mudar a ordem de integração é só escolher outro jeito de fatiar o mesmo sólido.

---

## 4. Coordenadas esféricas (para comparar)

$$x = \rho\sin\varphi\cos\theta \qquad y = \rho\sin\varphi\sin\theta \qquad z = \rho\cos\varphi$$

$$\rho^2 = x^2+y^2+z^2 \qquad dV = \rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta$$

| Equação | Superfície |
| --- | --- |
| $\rho = c$ | Esfera de raio $c$ |
| $\varphi = c$ | Cone com vértice na origem |
| $\varphi = \frac{\pi}{4}$ | Cone $z = \sqrt{x^2+y^2}$ |

Use esféricas quando aparece $x^2+y^2+z^2$ ou a região é uma bola, casca esférica ou "casquinha de sorvete".

> **Analogia: o GPS do globo.** As esféricas são como localizar algo na Terra: $\rho$ é a distância até o centro do planeta, $\varphi$ funciona como a latitude (medida a partir do Polo Norte) e $\theta$ é a longitude.
>
> **Cilíndricas × esféricas:** a cilíndrica é a coordenada da **lata**, que tem um eixo central. A esférica é a coordenada da **bola**, que tem um ponto central.

---

## 5. Mudança de variáveis geral (Jacobiano)

$$\iiint_E f\,dx\,dy\,dz = \iiint_{S} f\big(x(u,v,w), \dots\big)\,\left|\frac{\partial(x,y,z)}{\partial(u,v,w)}\right|\,du\,dv\,dw$$

| Transformação | $\lvert J\rvert$ |
| --- | --- |
| Cilíndricas | $r$ |
| Esféricas | $\rho^2\sin\varphi$ |
| $x = au,\ y = bv,\ z = cw$ (elipsoide) | $abc$ |

> **Analogia: o câmbio de moeda.** Quando você troca de coordenadas, é como trocar de moeda: 1 "cubinho" em $(u,v,w)$ não vale 1 cubinho em $(x,y,z)$. O Jacobiano é a **taxa de câmbio** entre os volumes.
>
> **Outra: a bexiga.** Desenhe uma bolinha numa bexiga murcha e encha. A bolinha vira um elipsoide, e a bexiga esticou $a$ vezes num sentido, $b$ no outro e $c$ no terceiro. O volume ficou multiplicado por $abc$, que é o Jacobiano.

---

## 6. Fórmulas que valem decorar

| Resultado | Fórmula |
| --- | --- |
| Volume da esfera | $\frac{4}{3}\pi R^3$ |
| Volume do elipsoide | $\frac{4}{3}\pi abc$ |
| Volume do cilindro | $\pi a^2 h$ |
| Volume do cone | $\frac{1}{3}\pi a^2 h$ |
| Volume do tetraedro (interceptos $a, b, c$) | $\frac{abc}{6}$ |
| Centroide do hemisfério sólido | $\bar z = \frac{3R}{8}$ |
| Inércia do cilindro sólido (eixo $z$) | $I_z = \frac{1}{2}Ma^2$ |
| $\int_0^{\pi}\sin^4\theta\,d\theta$ | $\frac{3\pi}{8}$ |
| $\int_0^{2\pi}\sin^2\theta\,d\theta = \int_0^{2\pi}\cos^2\theta\,d\theta$ | $\pi$ |

---

## 7. Checklist antes de entregar a prova

- [ ] Os limites de fora são números?
- [ ] Coloquei o Jacobiano ($r$, $\rho^2\sin\varphi$ ou outro)?
- [ ] O $\theta$ da conversão está no quadrante certo?
- [ ] Usei simetria para zerar $\bar x$ e $\bar y$ quando possível? (Um pião bem feito se equilibra no eixo: se o objeto é simétrico em torno de $z$, o centro de massa está sobre o eixo.)
- [ ] O resultado de um volume deu positivo?
- [ ] Conferi com uma fórmula conhecida (cilindro, cone, esfera) quando dava?