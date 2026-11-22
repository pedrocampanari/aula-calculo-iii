# Integrais Triplas e Coordenadas Cilíndricas na Engenharia de Computação

Onde essa matéria aparece de verdade, com exemplos e código para testar.

---

## 1. Motores de física em jogos e simulações

Engines como Unity (PhysX), Unreal (Chaos), Godot e Bullet precisam saber, para cada objeto, a **massa**, o **centro de massa** e o **tensor de inércia**. Esses três valores decidem como o objeto cai, quica e gira.

Todos eles são integrais triplas:

$$M = \iiint_E \delta\,dV \qquad \bar z = \frac{1}{M}\iiint_E z\,\delta\,dV \qquad I_z = \iiint_E (x^2+y^2)\,\delta\,dV$$

As formas de colisão mais usadas são cilindros e cápsulas: personagens, barris, rodas, latas. Nesses casos as cilíndricas dão a fórmula fechada:

$$I_z^{\text{cilindro}} = \int_0^{2\pi}\int_0^a\int_0^h r^2\cdot\delta\,r\,dz\,dr\,d\theta = \frac{1}{2}Ma^2$$

> **Na prática:** quando você coloca um `Rigidbody` num barril e ele rola de um jeito realista, foi essa conta que rodou por baixo. Uma malha qualquer, que não tem fórmula pronta, é aproximada somando tetraedros, ou seja, quebrando a integral tripla em pedaços.

---

## 2. Robótica

### Inércia dos elos

O arquivo URDF, que descreve um robô no ROS, exige um bloco `<inertia>` para cada peça. Um braço robótico é quase sempre um conjunto de cilindros, então as fórmulas vêm direto de integrais em coordenadas cilíndricas:

```xml
<!-- Cilindro de massa m, raio r, altura h, eixo z -->
<inertia ixx="m*(3*r*r + h*h)/12" iyy="m*(3*r*r + h*h)/12" izz="m*r*r/2"
         ixy="0" ixz="0" iyz="0"/>
```

Se a inércia estiver errada, o controlador calcula o torque errado e o braço oscila ou não para no ponto certo.

### Robô cilíndrico

Existe uma categoria de robô industrial chamada **robô cilíndrico**: uma base que gira ($\theta$), uma coluna que sobe e desce ($z$) e um braço que estica ($r$). A posição da garra é literalmente $(r, \theta, z)$. A cinemática direta é a conversão que você já sabe fazer:

$$x = r\cos\theta \qquad y = r\sin\theta \qquad z = z$$

O **espaço de trabalho** (tudo que a garra alcança) é um cilindro vazado, e o volume dele é:

$$V = \int_0^{2\pi}\int_{r_{\min}}^{r_{\max}}\int_{z_{\min}}^{z_{\max}} r\,dz\,dr\,d\theta = \pi\left(r_{\max}^2 - r_{\min}^2\right)(z_{\max} - z_{\min})$$

---

## 3. Sensores: LiDAR e câmeras 360°

Um LiDAR giratório, como os de carros autônomos e robôs aspiradores, mede naturalmente "distância + ângulo + altura do feixe". Os dados já nascem em coordenadas cilíndricas (ou esféricas), e o software converte para cartesianas antes de montar a nuvem de pontos:

```python
import numpy as np

def lidar_para_xyz(r, theta, z):
    """Converte leituras (r, theta, z) de um LiDAR para pontos cartesianos."""
    return np.column_stack((r * np.cos(theta), r * np.sin(theta), z))
```

O caminho inverso também é comum: algoritmos de segmentação projetam a nuvem numa **imagem cilíndrica** (eixo horizontal = $\theta$, eixo vertical = $z$) para poder usar redes neurais 2D.

Panoramas de 360° no celular usam a mesma ideia: a **projeção cilíndrica** "desenrola" a cena ao redor da câmera num retângulo.

---

## 4. Computação gráfica

- **Renderização volumétrica:** fumaça, nuvens, fogo e exames médicos (tomografia, ressonância) são campos de densidade em 3D. Para saber quanta luz atravessa um objeto, o renderizador integra a densidade ao longo de cada raio de luz (*ray marching*). Calcular a "quantidade total de fumaça" numa região é uma integral tripla.
- **Voxels:** em jogos como Minecraft ou em impressão 3D, o volume vira uma grade de cubinhos. Somar voxels é a versão discreta de $\iiint dV$, exatamente a ideia da soma de Riemann.
- **Modelagem por revolução:** a ferramenta *Lathe* (torno) do Blender, ou *Revolve* em CAD, cria objetos girando um perfil em torno de um eixo. São objetos feitos para coordenadas cilíndricas.

---

## 5. Hardware e eletromagnetismo

| Componente | Onde entra a matéria |
| --- | --- |
| **Cabo coaxial** (rede, antena, TV) | Simetria cilíndrica perfeita. A capacitância e a indutância por metro saem de integrais em $r$, e o resultado tem $\ln(b/a)$, a razão entre os raios. |
| **Indutores e solenoides** | A energia do campo magnético é $\iiint \frac{B^2}{2\mu}\,dV$ sobre o volume da bobina, que é um cilindro. |
| **HD (disco rígido) e ventoinhas** | O motor precisa vencer o momento de inércia do disco, $\frac{1}{2}Ma^2$, para acelerar até 7200 RPM. Isso define o tempo de *spin-up* e o consumo. |
| **Dissipadores e *heat pipes*** | O calor armazenado num bloco é $\iiint \rho\,c\,T(x,y,z)\,dV$. Os *heat pipes* são tubos, então a análise térmica é feita em cilíndricas. |
| **Antenas** | A potência total irradiada é uma integral sobre uma esfera em volta da antena (coordenadas esféricas). |

---

## 6. Probabilidade, IA e ciência de dados

Para três variáveis aleatórias com densidade conjunta $f(x,y,z)$, toda probabilidade é uma integral tripla:

$$P\big((X,Y,Z) \in E\big) = \iiint_E f(x,y,z)\,dV$$

- **Normalização:** uma densidade só é válida se $\iiint_{\mathbb{R}^3} f\,dV = 1$.
- **Valor esperado:** $E[X] = \iiint x\,f(x,y,z)\,dV$.
- **Gaussianas 3D:** a constante da normal tridimensional sai de uma integral tripla. Em coordenadas esféricas ou cilíndricas ela fica fácil, porque $x^2+y^2+z^2$ vira $\rho^2$ e o termo $x^2+y^2$ vira $r^2$.
- **Localização de robôs e drones:** filtros (de Kalman, de partículas) representam a incerteza sobre a posição como uma densidade em 3D. "Qual a chance de o drone estar dentro desta zona?" é uma integral tripla.

---

## 7. Métodos numéricos: quando não dá para integrar na mão

Na vida real, muitas regiões não têm limites bonitos. Aí entram dois métodos que você vai programar.

### Integração numérica com SciPy

```python
from scipy import integrate
import numpy as np

# Exercício 18 da lista de cilíndricas: integral de r^2 sobre o cone, em cilíndricas
# Ordem do tplquad: func(z, r, theta), limites de theta, depois r, depois z
valor, erro = integrate.tplquad(
    lambda z, r, theta: r**2 * r,   # integrando (x^2 + y^2) vezes o Jacobiano r
    0, 2 * np.pi,                  # theta
    lambda theta: 0, lambda theta: 2,  # r
    lambda theta, r: r, lambda theta, r: 2  # z de r até 2
)
print(valor, 16 * np.pi / 5)  # os dois devem dar ~10.053
```

### Monte Carlo

A ideia: jogue pontos aleatórios dentro de uma caixa e conte quantos caem no sólido. A fração que caiu, vezes o volume da caixa, aproxima o volume do sólido.

```python
import numpy as np

rng = np.random.default_rng(42)
N = 2_000_000

# "Casquinha de sorvete": acima do cone z = sqrt(x^2 + y^2), dentro da esfera de raio 1
x, y = rng.uniform(-1, 1, N), rng.uniform(-1, 1, N)
z = rng.uniform(0, 1, N)
dentro = (z >= np.sqrt(x**2 + y**2)) & (x**2 + y**2 + z**2 <= 1)

volume_caixa = 2 * 2 * 1
estimativa = volume_caixa * dentro.mean()
exato = np.pi * (2 - np.sqrt(2)) / 3

print(f"Monte Carlo: {estimativa:.4f}   Exato: {exato:.4f}")
```

O erro do Monte Carlo diminui com $\frac{1}{\sqrt{N}}$, **não importa a dimensão**. Por isso ele é o método preferido para integrais em muitas dimensões, como as de renderização realista (*path tracing*) e de IA.

> **Analogia:** é como estimar a área de um lago jogando milhares de pedrinhas aleatórias num terreno quadrado e contando quantas fizeram "splash".

---

## Resumo: matéria × aplicação

| Conceito da aula | Onde aparece |
| --- | --- |
| $\iiint \delta\,dV$ (massa) | Motores de física, impressão 3D (peso da peça), robótica |
| Centro de massa | Equilíbrio de robôs e drones, física de jogos |
| Momento de inércia $\frac{1}{2}Ma^2$ | URDF/ROS, HDs, ventoinhas, rodas de robôs |
| Conversão $(r,\theta,z) \leftrightarrow (x,y,z)$ | LiDAR, robôs cilíndricos, panoramas 360° |
| $dV = r\,dz\,dr\,d\theta$ | Cabos coaxiais, solenoides, *heat pipes* |
| Integral tripla de densidade | Probabilidade 3D, filtros de localização, renderização volumétrica |
| Soma de Riemann | Voxels, integração numérica |
| Monte Carlo | *Path tracing*, simulações, IA |
