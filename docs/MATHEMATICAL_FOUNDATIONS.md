# Mathematical foundations

This document summarises the mathematics behind the main MATHCRYPT 6.0 modules. It complements
[`ALGORITHMS.md`](ALGORITHMS.md) (implementation notes) and [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md).
All integer computations in MATHCRYPT use exact `BigInt` arithmetic; floating point is used only for
statistics, quantum amplitudes and plots.

Every numerical example below is asserted by the built-in test suite and independently recomputed by
[`tests/python/test_reference_values.py`](../tests/python/test_reference_values.py).

## 1. The Euclidean algorithm and Bézout's identity

For integers $a, b$ not both zero, repeated division

$$
r_{k-1} = q_k\, r_k + r_{k+1}, \qquad 0 \le r_{k+1} < |r_k|,
$$

terminates with $r_{n+1} = 0$ and $r_n = \gcd(a,b)$. Tracking the coefficients gives Bézout's identity

$$
a x + b y = \gcd(a, b), \qquad x, y \in \mathbb{Z}.
$$

By Lamé's theorem the number of division steps is at most five times the number of decimal digits of
$\min(|a|,|b|)$.

*Example:* $\gcd(240, 46) = 2 = 240 \cdot (-9) + 46 \cdot 47$.

## 2. Linear Diophantine equations

**Theorem.** $ax + by = c$ has an integer solution if and only if $g = \gcd(a,b)$ divides $c$.
If $(x_0, y_0)$ is one solution, all solutions are

$$
x = x_0 + \frac{b}{g}\, t, \qquad y = y_0 - \frac{a}{g}\, t, \qquad t \in \mathbb{Z}.
$$

*Examples:* $35x + 22y = 1$ is solvable; $6x + 9y = 7$ is not, because $3 \nmid 7$.
With the constraint $x, y \ge 0$, $5x + 8y = 150$ has exactly four solutions.

### Systems over the integers

For $A x = b$ with $A \in \mathbb{Z}^{m \times n}$, MATHCRYPT computes the **Smith normal form**

$$
U A V = D = \operatorname{diag}(d_1, \dots, d_r, 0, \dots), \qquad d_1 \mid d_2 \mid \dots \mid d_r,
$$

with unimodular $U, V$ ($\det = \pm 1$). Writing $c = U b$, the system is solvable if and only if
$d_i \mid c_i$ for $i \le r$ and $c_i = 0$ for $i > r$; then $x = V y$ with $y_i = c_i / d_i$ and the free
coordinates spanning the integer kernel. Every reported solution is verified by substitution into
$A x = b$. *Example:* the Smith form of $\begin{pmatrix} 2 & 4 & 4 \\ -6 & 6 & 12 \\ 10 & -4 & -16 \end{pmatrix}$ is
$\operatorname{diag}(2, 6, 12)$.

## 3. Modular arithmetic and the Chinese remainder theorem

$a$ is invertible modulo $m$ if and only if $\gcd(a, m) = 1$; the inverse is the Bézout coefficient $x$ in
$a x + m y = 1$. Euler's theorem states $a^{\varphi(n)} \equiv 1 \pmod n$ for $\gcd(a,n)=1$.

The (generalised) CRT: the system $x \equiv r_i \pmod{n_i}$ is solvable if and only if
$r_i \equiv r_j \pmod{\gcd(n_i, n_j)}$ for all $i, j$, and the solution is unique modulo
$\operatorname{lcm}(n_1, \dots, n_k)$.

*Examples:* $x \equiv 2 \ (3),\ x \equiv 3 \ (5),\ x \equiv 2 \ (7) \Rightarrow x \equiv 23 \pmod{105}$;
$x \equiv 1 \ (4),\ x \equiv 2 \ (6)$ has no solution.

## 4. Continued fractions and Pell's equation

A rational number has a finite expansion, e.g. $\tfrac{415}{93} = [4; 2, 6, 7]$ with convergents
$4/1,\ 9/2,\ 58/13,\ 415/93$. For a non-square $D > 0$, $\sqrt{D} = [a_0; \overline{a_1, \dots, a_\ell}]$ is
periodic, e.g. $\sqrt{23} = [4; \overline{1, 3, 1, 8}]$.

The **Pell equation**

$$
x^2 - D y^2 = 1
$$

has its fundamental solution $(x_1, y_1)$ among the convergents of $\sqrt{D}$ (at index $\ell - 1$ or
$2\ell - 1$); all positive solutions are given by $x_k + y_k \sqrt{D} = (x_1 + y_1 \sqrt{D})^k$.

*Example:* for $D = 61$ the fundamental solution is $(1\,766\,319\,049,\ 226\,153\,980)$.

## 5. Textbook RSA (educational)

Choose primes $p, q$, set $n = pq$, $\varphi(n) = (p-1)(q-1)$, pick $e$ with $\gcd(e, \varphi(n)) = 1$ and
compute $d \equiv e^{-1} \pmod{\varphi(n)}$. Then

$$
c \equiv m^e \pmod n, \qquad m \equiv c^d \pmod n .
$$

*Reference example:* $p = 61,\ q = 53,\ e = 17$ gives $n = 3233,\ d = 2753$ and $65 \mapsto 2790$.

> **Warning.** Textbook RSA without padding is deterministic and malleable and is **not secure**. Real
> systems use RSA-OAEP / RSA-PSS with keys of at least 2048 bits, constant-time implementations and vetted
> libraries. MATHCRYPT's RSA exists to illustrate the number theory only.

## 6. Primality

Miller–Rabin: write $n - 1 = 2^s d$ with $d$ odd; $n$ passes for base $a$ if $a^d \equiv 1$ or
$a^{2^r d} \equiv -1 \pmod n$ for some $0 \le r < s$. A composite $n$ passes for at most a quarter of bases.
*Example:* the Carmichael number $561 = 3 \cdot 11 \cdot 17$ satisfies Fermat's test for every base coprime
to it, but is rejected by Miller–Rabin.

## 7. Lattices

A lattice $L = \{ \sum_i z_i \mathbf{b}_i : z_i \in \mathbb{Z} \}$ has many bases. LLL reduction (with
$\delta = 3/4$) produces a basis satisfying size reduction $|\mu_{i,j}| \le \tfrac12$ and the Lovász
condition

$$
\delta \, \lVert \mathbf{b}_{k-1}^{*} \rVert^2 \le \lVert \mathbf{b}_k^{*} \rVert^2 + \mu_{k,k-1}^2 \lVert \mathbf{b}_{k-1}^{*} \rVert^2 ,
$$

while preserving $|\det L|$. MATHCRYPT uses exact rational arithmetic for LLL and applies it in a toy
Kannan-embedding attack on very small LWE instances.

## 8. Learning With Errors (educational)

LWE public data are $(A, \mathbf{b} = A\mathbf{s} + \mathbf{e} \bmod q)$ with a small error $\mathbf{e}$.
A bit $\mu$ is encrypted as $\mathbf{u} = A^{\mathsf T}\mathbf{r},\ v = \mathbf{b}^{\mathsf T}\mathbf{r} + \mu \lfloor q/2 \rfloor$;
decryption computes $v - \mathbf{s}^{\mathsf T}\mathbf{u} = \mathbf{e}^{\mathsf T}\mathbf{r} + \mu\lfloor q/2 \rfloor$, which is correct when
$|\mathbf{e}^{\mathsf T}\mathbf{r}| < q/4$. The ML-KEM number-theoretic transform uses $q = 3329$ and the
primitive 256-th root of unity $\zeta = 17$. These are teaching components; they are **not** an
implementation of ML-KEM (FIPS 203).

## 9. Quantum algorithms (classical simulation)

States of $n$ qubits are vectors in $\mathbb{C}^{2^n}$ evolved by unitary gates. Grover search after $k$
iterations succeeds with probability $\sin^2\big((2k+1)\theta\big)$, where $\sin^2\theta = M/N$.
Shor's order finding is simulated with a QFT followed by classical continued-fraction post-processing.
The cost of classical simulation grows as $2^n$, which limits the interactive lab to small $n$.

## References

Primary sources and DOIs for the literature used by the program are listed and checked in
[`SOURCES_VERIFICATION.md`](SOURCES_VERIFICATION.md).
