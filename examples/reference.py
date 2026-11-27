"""Independent Python reference implementations for MATHCRYPT examples.

These functions are deliberately short, dependency-free re-implementations of
textbook algorithms. They are NOT part of the MATHCRYPT application (which is
written in JavaScript with BigInt arithmetic). Their purpose is to reproduce,
outside the browser, the control values that the built-in MATHCRYPT test suite
asserts, so that a reader can check the examples in README.md and examples/
with nothing but a Python 3.9+ interpreter.

Educational code only. Textbook RSA without padding is insecure.

License: MIT (see LICENSE). Copyright (c) 2026 Mykyta Uzkykh.
"""

from __future__ import annotations

from math import gcd, isqrt
from typing import List, Optional, Tuple


def extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
    """Return (g, x, y) with a*x + b*y = g = gcd(a, b), g >= 0."""
    old_r, r = a, b
    old_x, x = 1, 0
    old_y, y = 0, 1
    while r != 0:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_x, x = x, old_x - q * x
        old_y, y = y, old_y - q * y
    if old_r < 0:
        old_r, old_x, old_y = -old_r, -old_x, -old_y
    return old_r, old_x, old_y


def euclid_steps(a: int, b: int) -> List[Tuple[int, int, int, int]]:
    """Division steps (a, b, q, r) of the Euclidean algorithm, a = b*q + r."""
    steps = []
    while b != 0:
        q, r = divmod(a, b)
        steps.append((a, b, q, r))
        a, b = b, r
    return steps


def solve_linear_diophantine(a: int, b: int, c: int) -> Optional[Tuple[int, int, int, int]]:
    """Solve a*x + b*y = c over the integers (a, b not both zero).

    Returns (x0, y0, dx, dy) such that every solution is
    (x0 + dx*t, y0 - dy*t) for integer t, or None if gcd(a, b) does not divide c.
    """
    if a == 0 and b == 0:
        raise ValueError("a and b must not both be zero")
    g, x, y = extended_gcd(a, b)
    if c % g != 0:
        return None
    k = c // g
    return x * k, y * k, b // g, a // g


def count_nonnegative_solutions(a: int, b: int, c: int) -> int:
    """Number of solutions of a*x + b*y = c with x, y >= 0 (a, b > 0)."""
    return sum(1 for x in range(c // a + 1) if (c - a * x) % b == 0)


def mod_inverse(a: int, m: int) -> int:
    g, x, _ = extended_gcd(a % m, m)
    if g != 1:
        raise ValueError(f"{a} has no inverse modulo {m}")
    return x % m


def crt(residues: List[int], moduli: List[int]) -> Optional[Tuple[int, int]]:
    """Generalised Chinese remainder theorem (moduli need not be coprime).

    Returns (x, M) with x mod M the unique solution, or None if inconsistent.
    """
    x, m = 0, 1
    for r, n in zip(residues, moduli):
        g, p, _ = extended_gcd(m, n)
        if (r - x) % g != 0:
            return None
        lcm = m // g * n
        x = (x + (r - x) // g * p % (n // g) * m) % lcm
        m = lcm
    return x, m


def continued_fraction_rational(p: int, q: int) -> List[int]:
    terms = []
    while q:
        a, r = divmod(p, q)
        terms.append(a)
        p, q = q, r
    return terms


def convergents(terms: List[int]) -> List[Tuple[int, int]]:
    h_prev, h = 1, terms[0]
    k_prev, k = 0, 1
    out = [(h, k)]
    for a in terms[1:]:
        h_prev, h = h, a * h + h_prev
        k_prev, k = k, a * k + k_prev
        out.append((h, k))
    return out


def sqrt_continued_fraction(d: int) -> Tuple[int, List[int]]:
    """Continued fraction of sqrt(d) for non-square d: (a0, period)."""
    a0 = isqrt(d)
    if a0 * a0 == d:
        raise ValueError("d is a perfect square")
    m, den, a = 0, 1, a0
    period = []
    while a != 2 * a0:
        m = den * a - m
        den = (d - m * m) // den
        a = (a0 + m) // den
        period.append(a)
    return a0, period


def pell_fundamental(d: int) -> Tuple[int, int]:
    """Fundamental solution of x^2 - d*y^2 = 1 (d > 0 not a square)."""
    a0, period = sqrt_continued_fraction(d)
    terms = [a0]
    while True:
        terms.extend(period)
        for x, y in convergents(terms):
            if x * x - d * y * y == 1:
                return x, y


def is_probable_prime(n: int) -> bool:
    """Deterministic Miller-Rabin for n < 3.3e24 (first 12 prime bases)."""
    if n < 2:
        return False
    bases = (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37)
    for p in bases:
        if n % p == 0:
            return n == p
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    for a in bases:
        x = pow(a, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True


def euler_phi(n: int) -> int:
    result, p, m = n, 2, n
    while p * p <= m:
        if m % p == 0:
            while m % p == 0:
                m //= p
            result -= result // p
        p += 1
    if m > 1:
        result -= result // m
    return result


def toy_rsa(p: int, q: int, e: int, message: int) -> dict:
    """Textbook RSA (no padding) — for teaching only, never for real data."""
    n = p * q
    phi = (p - 1) * (q - 1)
    if gcd(e, phi) != 1:
        raise ValueError("e must be coprime to phi(n)")
    d = mod_inverse(e, phi)
    c = pow(message, e, n)
    return {"n": n, "phi": phi, "d": d, "c": c, "decrypted": pow(c, d, n)}


if __name__ == "__main__":  # pragma: no cover - demonstration only
    print("35x + 22y = 1 ->", solve_linear_diophantine(35, 22, 1))
    print("Pell D=61 ->", pell_fundamental(61))
    print("Toy RSA p=61, q=53, e=17, m=65 ->", toy_rsa(61, 53, 17, 65))
