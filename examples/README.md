# Worked examples

Each example below can be reproduced in three independent ways:

1. **In MATHCRYPT** — open `site/index.html` and use the tab named in the example.
2. **In the built-in test suite** — every value is asserted by a test of the *Automatic tests* tab
   (results recorded in [`tests/test_results.json`](../tests/test_results.json)).
3. **In Python** — with the dependency-free reference code in [`reference.py`](reference.py):

```bash
python3 examples/reference.py              # prints three examples
python3 -m pytest tests/python -q          # recomputes every value below
```

`reference.py` is an independent re-implementation for checking, not the MATHCRYPT engine
(which is JavaScript with `BigInt`).

## 1. Linear Diophantine equation — tab *Diophantine equations*

Input $35x + 22y = 1$.

| Step | Division |
|---|---|
| 1 | $35 = 22 \cdot 1 + 13$ |
| 2 | $22 = 13 \cdot 1 + 9$ |
| 3 | $13 = 9 \cdot 1 + 4$ |
| 4 | $9 = 4 \cdot 2 + 1$ |
| 5 | $4 = 1 \cdot 4 + 0$ |

$\gcd(35, 22) = 1 \mid 1$, so the equation is solvable. Back-substitution gives
$x_0 = -5,\ y_0 = 8$ (check: $35 \cdot (-5) + 22 \cdot 8 = 1$), and the general solution is

$$x = -5 + 22t, \qquad y = 8 - 35t, \qquad t \in \mathbb{Z}.$$

```python
>>> from reference import solve_linear_diophantine
>>> solve_linear_diophantine(35, 22, 1)   # (x0, y0, b/g, a/g)
(-5, 8, 22, 35)
```

## 2. Applied problem with non-negative solutions

$5x + 8y = 150$ with $x, y \ge 0$ has exactly **4** solutions:
$(30, 0), (22, 5), (14, 10), (6, 15)$.

## 3. Pell equation — tab *Pell equation*

| $D$ | Fundamental solution $(x_1, y_1)$ of $x^2 - Dy^2 = 1$ |
|---|---|
| 2 | $(3, 2)$ |
| 13 | $(649, 180)$ |
| 61 | $(1\,766\,319\,049,\ 226\,153\,980)$ |
| 109 | $(158\,070\,671\,986\,249,\ 15\,140\,424\,455\,100)$ |

## 4. Chinese remainder theorem — tab *Chinese Remainder Theorem*

$x \equiv 2 \pmod 3,\ x \equiv 3 \pmod 5,\ x \equiv 2 \pmod 7 \Rightarrow x \equiv 23 \pmod{105}$ (Sunzi's problem).
Non-coprime moduli: $x \equiv 2 \pmod 6,\ x \equiv 6 \pmod{10} \Rightarrow x \equiv 26 \pmod{30}$.
Inconsistent: $x \equiv 1 \pmod 4,\ x \equiv 2 \pmod 6$ has no solution.

## 5. Textbook RSA — tab *RSA: step-by-step lab* (educational only)

| Quantity | Value |
|---|---|
| $p, q$ | 61, 53 |
| $n = pq$ | 3233 |
| $\varphi(n)$ | 3120 |
| $e$ | 17 |
| $d = e^{-1} \bmod \varphi(n)$ | 2753 |
| $m = 65 \mapsto c = m^e \bmod n$ | 2790 |
| $c^d \bmod n$ | 65 |

The built-in suite also checks decryption for **every** $m \in [0, 3233)$; so does the Python test.

> Textbook RSA (no padding, tiny primes) is insecure and must never protect real data.

## 6. Continued fractions — tab *Continued fractions*

$\tfrac{415}{93} = [4; 2, 6, 7]$, convergents $4/1,\ 9/2,\ 58/13,\ 415/93$;
$\sqrt{23} = [4; \overline{1, 3, 1, 8}]$ (period 4).

## 7. Primality — tab *Prime numbers*

Miller–Rabin: $561$ (Carmichael) is composite, $2^{61} - 1$ is prime, $2^{67} - 1$ is composite.
Factorisations: $2^{32} + 1 = 641 \cdot 6\,700\,417$ and $2^{64} + 1 = 274\,177 \cdot 67\,280\,421\,310\,721$.
