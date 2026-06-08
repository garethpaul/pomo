'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PLAN = 'docs/plans/2026-06-08-local-only-contracts.md';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assertFile(relativePath) {
  assert.ok(fs.existsSync(path.join(ROOT, relativePath)), `${relativePath} must exist`);
}

[
  PLAN,
  'index.html',
  'js/app.js',
  'js/notification.js',
  'js/timer.js',
  'package.json',
  'README.md',
  'SECURITY.md',
  'VISION.md'
].forEach(assertFile);

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.scripts.contracts, 'node scripts/check-local-contracts.js');
assert.ok(pkg.scripts.lint.includes('node --check scripts/check-local-contracts.js'));
assert.ok(pkg.scripts.verify.includes('npm run contracts'));

const index = read('index.html');
assert.ok(!/<script[^>]+src=["']https?:\/\//i.test(index), 'index.html must not load remote scripts');
assert.ok(!index.includes('oss.maxcdn.com'), 'legacy CDN shims must stay removed');
assert.ok(index.includes('js/notification.js') && index.includes('js/timer.js') && index.includes('js/app.js'));

const app = read('js/app.js');
assert.ok(app.includes("$(document).on('click', 'a[href^=\"http\"]'"), 'external links must stay user-click gated');
assert.ok(app.includes('event.preventDefault();'));
assert.ok(app.includes('shell.openExternal(this.href);'));
assert.ok(!app.includes('setInterval(shell.openExternal'), 'external links must not be opened from background timers');

const notification = read('js/notification.js');
assert.ok(notification.includes('requestPermission'), 'notification permission prompts must stay explicit');
assert.ok(!notification.includes('fetch(') && !notification.includes('XMLHttpRequest'), 'notifications must stay local-only');

const docs = ['README.md', 'SECURITY.md', 'VISION.md', 'CHANGES.md'].map(read).join('\n');
for (const phrase of ['npm run contracts', 'local-only', 'remote script', 'user action']) {
  assert.ok(docs.toLowerCase().includes(phrase.toLowerCase()), `docs must mention ${phrase}`);
}

const plan = read(PLAN);
assert.ok(plan.includes('Status: Completed'));
assert.ok(plan.includes('npm run contracts'));
assert.ok(plan.includes('make check'));

console.log('local-only contract checks passed.');
