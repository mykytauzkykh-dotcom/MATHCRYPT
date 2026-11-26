# Verification of scientific sources — MATHCRYPT 6.0.0

Date of the check: 2026-11-26. Method: every bibliographic entry built into the program and every standard cited in its texts was compared with a primary source (publisher's page or the publication itself, NIST/CSRC pages and the official FIPS PDFs, library catalogues). A DOI is given only where the DOI itself was seen in a primary source; nothing was added from memory.

## 1. Post-quantum standards (tab *Post-Quantum Cryptography*)

| Table in the program | Official source | Result |
|---|---|---|
| ML-KEM-512/768/1024: category 1/3/5; encapsulation key 800/1184/1568 B; decapsulation key 1632/2400/3168 B; ciphertext 768/1088/1568 B; shared secret 32 B | NIST FIPS 203, *Module-Lattice-Based Key-Encapsulation Mechanism Standard*, 13 Aug 2024, Tables 2–3 and §3.2 — https://doi.org/10.6028/NIST.FIPS.203 | **Correct.** Column names changed to the FIPS 203 terms (encapsulation / decapsulation key). |
| ML-DSA-44/65/87: category 2/3/5; public key 1312/1952/2592 B; private key 2560/4032/4896 B; signature 2420/3309/4627 B | NIST FIPS 204, *Module-Lattice-Based Digital Signature Standard*, 13 Aug 2024, Tables 1–2 — https://doi.org/10.6028/NIST.FIPS.204 | **Correct.** |
| SLH-DSA 128s/128f/192s/192f/256s/256f: public key 32/32/48/48/64/64 B; private key 64/64/96/96/128/128 B; signature 7856/17088/16224/35664/29792/49856 B | NIST FIPS 205, *Stateless Hash-Based Digital Signature Standard*, 13 Aug 2024, Table 2 and §3.1 (pk = 2n, sk = 4n) — https://doi.org/10.6028/NIST.FIPS.205 | **Sizes correct.** Names corrected to the official parameter-set names (`SLH-DSA-SHA2-…` / `SLH-DSA-SHAKE-…`; both variants have the same sizes). |
| Comparison table: “best known attacks on ML-KEM are lattice (BKZ, sub-exponential)” | Published analyses of BKZ with sieving (classical ≈ 2^0.292·d, quantum ≈ 2^0.265·d) | **Error corrected:** the best known lattice attacks are *exponential* in the dimension, not sub-exponential. |

The note “sizes given from the program author's memory” was replaced by these sources.

## 2. Built-in bibliography (Publications Center, report templates A–F)

| Entry | Checked | Result |
|---|---|---|
| Knuth, D. E. *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms*, 3rd ed. Addison-Wesley, 1997. | Publisher / catalogue records (ISBN 0-201-89684-2) | Correct. No DOI added (none confirmed for this edition). |
| Cohen, H. *A Course in Computational Algebraic Number Theory* (GTM 138). Springer, 1993. | Springer page, catalogues | Correct. DOI not added (not seen explicitly). |
| Hardy, G. H.; Wright, E. M. *An Introduction to the Theory of Numbers*, 6th ed. Oxford University Press, 2008. | OUP / MAA records | Correct; note added: revised by D. R. Heath-Brown and J. H. Silverman. |
| NIST. *Secure Hash Standard (SHS)*, FIPS PUB 180-4, 2015. | CSRC page (Aug 2015) | Correct; DOI 10.6028/NIST.FIPS.180-4 added. |
| Lenstra, A. K.; Lenstra, H. W.; Lovász, L. Factoring polynomials with rational coefficients. *Math. Ann.* 261(4), 515–534, 1982. | Springer article page, author's PDF | Correct; DOI 10.1007/BF01457454 added. |
| Lenstra, H. W. Solving the Pell equation. *Notices AMS* 49(2), 182–192, 2002. | Article PDF, Leiden repository | Correct. No DOI added. |
| Apostol, T. M. *Introduction to Analytic Number Theory*. Springer, 1976. | Springer page | Correct; series (UTM) and DOI 10.1007/978-1-4757-5579-4 added. |
| Micciancio, D.; Goldwasser, S. *Complexity of Lattice Problems: A Cryptographic Perspective*. Kluwer, 2002. | Author's page, catalogues | Correct; series (SECS 671) added. DOI not added (not seen explicitly). |
| Webster, A. F.; Tavares, S. E. On the design of S-boxes. CRYPTO ’85, LNCS 218, 523–534. Springer, 1986. | First page of the paper (Springer) | Correct; editor (H. C. Williams) and DOI 10.1007/3-540-39799-X_41 added. |

In-text references: “Royston (1995), AS R94” — confirmed: Royston, P., *A Remark on Algorithm AS 181: The W-Test for Normality*, JRSS Series C (Applied Statistics) 44(4), 547–551, 1995, doi:10.2307/2986146. “Lagrange, 1768” (Pell equation) — confirmed by Lenstra (2002): Lagrange's proof was written and submitted in 1768.

**No entry had to be removed; no entry is unconfirmed.** Entries without a DOI simply have none recorded in the program.

## 3. Not covered by this check

* Historical narrative in the *History* tabs (dates such as RSA 1977, Cocks 1973, RSA-129 1994, Shor 1994) — general historical facts, not bibliographic entries; not re-checked here.
* User-entered references in the Publications Center are the user's responsibility.
