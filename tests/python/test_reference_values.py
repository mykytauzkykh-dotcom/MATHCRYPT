"""Independent checks of control values asserted by the MATHCRYPT built-in suite.

Each expected value below appears verbatim in a test of the browser suite
(see tests/test_results.json). Here it is recomputed with the independent
Python implementations in examples/reference.py.
"""
from math import gcd

import pytest

import reference as ref


def test_extended_gcd_240_46():
    g, x, y = ref.extended_gcd(240, 46)
    assert g == 2 and 240 * x + 46 * y == 2
    assert (x, y) == (-9, 47)  # "240·(−9) + 46·47" in the visualiser test


def test_euclid_steps_35_22():
    steps = ref.euclid_steps(35, 22)
    assert steps[:4] == [(35, 22, 1, 13), (22, 13, 1, 9), (13, 9, 1, 4), (9, 4, 2, 1)]
    assert steps[-1][3] == 0


def test_euclid_252_105_three_steps():
    assert len(ref.euclid_steps(252, 105)) == 3


@pytest.mark.parametrize("a,b,c", [(35, 22, 1), (-12, 18, 6), (10**30, 10**30 + 1, 1)])
def test_linear_diophantine_solution_substitutes(a, b, c):
    x0, y0, dx, dy = ref.solve_linear_diophantine(a, b, c)
    for t in range(-3, 4):
        assert a * (x0 + dx * t) + b * (y0 - dy * t) == c


def test_linear_diophantine_no_solution():
    assert ref.solve_linear_diophantine(6, 9, 7) is None  # 3 does not divide 7


def test_nonnegative_counts():
    assert ref.count_nonnegative_solutions(3, 5, 7) == 0
    assert ref.count_nonnegative_solutions(5, 8, 150) == 4


def test_large_gcd_exact():
    assert gcd(2**128 - 1, 2**96 - 1) == 2**32 - 1


def test_modular_arithmetic():
    assert pow(4, 13, 497) == 445
    assert pow(2, 100, 10**9 + 7) == 976371285
    assert ref.mod_inverse(3, 11) == 4
    assert ref.mod_inverse(3, 40) == 27
    assert pow(7, 3, 55) == 13
    assert pow(7, 560, 561) == 1


def test_toy_rsa_reference_example():
    r = ref.toy_rsa(61, 53, 17, 65)
    assert (r["n"], r["d"], r["c"], r["decrypted"]) == (3233, 2753, 2790, 65)


def test_toy_rsa_exhaustive_roundtrip():
    r = ref.toy_rsa(61, 53, 17, 0)
    n, d = r["n"], r["d"]
    assert all(pow(pow(m, 17, n), d, n) == m for m in range(n))


@pytest.mark.parametrize(
    "d,expected",
    [(2, (3, 2)), (13, (649, 180)), (61, (1766319049, 226153980)),
     (109, (158070671986249, 15140424455100))],
)
def test_pell_fundamental(d, expected):
    x, y = ref.pell_fundamental(d)
    assert (x, y) == expected and x * x - d * y * y == 1


def test_pell_square_rejected():
    with pytest.raises(ValueError):
        ref.pell_fundamental(9)


def test_crt():
    assert ref.crt([2, 3, 2], [3, 5, 7]) == (23, 105)
    assert ref.crt([2, 6], [6, 10]) == (26, 30)
    assert ref.crt([1, 2], [4, 6]) is None


def test_continued_fractions():
    assert ref.continued_fraction_rational(415, 93) == [4, 2, 6, 7]
    assert ref.convergents([4, 2, 6, 7]) == [(4, 1), (9, 2), (58, 13), (415, 93)]
    assert ref.sqrt_continued_fraction(2) == (1, [2])
    assert ref.sqrt_continued_fraction(23) == (4, [1, 3, 1, 8])
    assert len(ref.sqrt_continued_fraction(13)[1]) == 5


def test_miller_rabin():
    assert not ref.is_probable_prime(561)  # Carmichael number
    assert ref.is_probable_prime(2**61 - 1)
    assert not ref.is_probable_prime(2**67 - 1)
    assert ref.is_probable_prime(10**12 + 39)


def test_euler_phi():
    assert ref.euler_phi(100) == 40
    assert ref.euler_phi(36) == 12


def test_fermat_numbers_factor():
    assert 641 * 6700417 == 2**32 + 1
    assert 274177 * 67280421310721 == 2**64 + 1
