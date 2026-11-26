# Mathematical algorithms (reference)

All arithmetic on integers uses JavaScript `BigInt` (exact). Floating point is used only for statistics, quantum amplitudes and plots.

## Number theory
* **Euclid / extended Euclid:** `gcd(a,b)=gcd(b, a mod b)`; the extended version tracks `(x,y)` with `ax+by=gcd`. Step count ≤ ≈ 4.8·log₁₀(b) (Lamé).
* **Linear Diophantine `ax+by=c`:** solvable ⇔ `gcd(a,b) | c`; general solution `x=x₀+(b/g)t`, `y=y₀−(a/g)t`.
* **Systems `Ax=b` over ℤ:** Smith normal form `U·A·V = D` (U, V unimodular). With `c=Ub`, solvable ⇔ `dᵢ | cᵢ` for `i≤rank` and `cᵢ=0` beyond; `x=V·y`, `yᵢ=cᵢ/dᵢ`, free coordinates give the kernel lattice. Every result is verified by substituting into `A·x=b` and `A·k=0`.
* **Hermite normal form:** row-style, unimodular `U` with `H=U·A` upper-triangular, pivots positive.
* **Pell `x²−Dy²=1`:** fundamental solution from the period of the continued fraction of √D; further solutions by powers.
* **CRT, φ, μ, τ, σ, Carmichael λ, Jacobi/Legendre, Miller–Rabin, Pollard-type and trial factorisation.**
* **Non-linear Diophantine equations:** only *bounded search* is performed; absence of solutions in a box is **not** a proof of non-existence, and the UI says so.

## Lattices
* Lagrange–Gauss reduction (n = 2) and exact-rational **LLL** (δ = 3/4 by default). Reduced bases keep `|det|`.

## Statistics (`M5.S`, `M5.S2`)
Shapiro–Wilk (Royston approximation), Mann–Whitney U (exact DP for small samples, normal approximation with tie correction otherwise), Wilcoxon signed-rank (exact / asymptotic), Kruskal–Wallis (tie-corrected χ²), one-way ANOVA, percentile and BCa bootstrap, QR-based OLS (multiple and polynomial), Huber IRLS regression, power of the t-test via the non-central t distribution, correlation matrix. Each tool states its null hypothesis, assumptions and limits and never writes a scientific conclusion automatically. Values were checked against SciPy 1.18 / NumPy 2.5 (reference numbers embedded in the tests).

## Quantum simulator (`M5.Q`) — classical
State vector of `2ⁿ` complex amplitudes (qubit 0 = least significant bit), exact gate matrices X, Y, Z, H, S, T, CNOT, Bloch vectors, entropy, sampling, QFT (matrix, FFT-based and circuit forms), Grover (amplitude amplification) and Shor order finding with classical post-processing. It is **not** a quantum computer.

## Post-quantum teaching code (`M5.PQ`)
LWE samples and a Kannan-embedding + LLL attack on tiny parameters, ML-KEM number-theoretic transform (`q=3329`, `ζ=17`), Module-LWE encryption toy, centred binomial sampling, Lamport one-time signature. Parameter/size tables for standards are for orientation — verify against FIPS 203/204/205 before citing.

## Experiments A–F
A: gcd algorithms (Euclid vs binary); B: solvability density of `ax+by=c`; C: SHA avalanche; D: prime distribution; E: Pell equations; F: Gauss reduction. All use a seeded `mulberry32` generator; the data checksum is FNV-1a of the JSON data and SHA-256 is stored in reproducibility packages.
