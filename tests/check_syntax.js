// Syntax check of every JavaScript module in source/modules (no execution).
// Usage: node tests/check_syntax.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const dir = path.join(__dirname, '..', 'source', 'modules');
let bad = 0;
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
  try { new vm.Script(fs.readFileSync(path.join(dir, f), 'utf8'), { filename: f }); }
  catch (e) { bad++; console.log('SYNTAX ERROR', f, e.message); }
}
console.log(bad ? `${bad} module(s) with syntax errors` : 'All modules parse.');
process.exit(bad ? 1 : 0);
