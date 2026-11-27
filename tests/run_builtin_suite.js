// CI-friendly runner for the built-in MATHCRYPT test suite (M5.runTests()).
// Usage: node tests/run_builtin_suite.js site/index.html [results.json]
// Exits with code 1 if any test fails or the page reports a JavaScript error.
// Optional: set CHROME_PATH to use an installed Chrome/Chromium binary.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const page_file = path.resolve(process.argv[2] || 'site/index.html');
  const out = process.argv[3] || 'builtin_results.json';
  const opts = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  const browser = await chromium.launch(opts);
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => {
    // Optional CDN resources (three.js, Google Fonts) are expected to fail offline.
    if (m.type() === 'error' && !/three|jsdelivr|fonts\.g|ERR_|Failed to load resource/.test(m.text())) errors.push('CONSOLE ' + m.text());
  });
  await page.goto('file://' + page_file);
  await page.waitForTimeout(1500);
  const t0 = Date.now();
  const r = await page.evaluate(() => M5.runTests());
  const failed = r.filter(x => !x.ok);
  const summary = {
    browser: 'Chromium ' + browser.version(),
    date: new Date().toISOString(),
    total: r.length,
    passed: r.length - failed.length,
    duration_ms: Date.now() - t0,
    errors,
    results: r.map(x => [x.n, x.ok])
  };
  fs.writeFileSync(out, JSON.stringify(summary, null, 1));
  console.log(`${summary.browser}: ${summary.passed}/${summary.total} tests passed in ${summary.duration_ms} ms`);
  failed.forEach(x => console.log('FAIL', x.n, '|', x.a, '|', x.b));
  errors.forEach(e => console.log(e));
  await browser.close();
  process.exit(failed.length || errors.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
