'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LOCAL_ONLY_PLAN = 'docs/plans/2026-06-08-local-only-contracts.md';
const MAIN_PROCESS_PLAN = 'docs/plans/2026-06-08-main-process-guards.md';
const RENDERER_WIRING_PLAN = 'docs/plans/2026-06-08-renderer-wiring-tests.md';
const TAB_RESET_PLAN = 'docs/plans/2026-06-09-renderer-tab-reset-guard.md';
const WINDOW_TITLE_PLAN = 'docs/plans/2026-06-09-window-title-contract.md';
const LOCAL_ASSET_PLAN = 'docs/plans/2026-06-09-local-asset-reference-contract.md';
const NOTIFICATION_ICON_PLAN = 'docs/plans/2026-06-09-notification-icon-asset-contract.md';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assertFile(relativePath) {
  assert.ok(fs.existsSync(path.join(ROOT, relativePath)), `${relativePath} must exist`);
}

function rendererAssetReferences(markup) {
  const references = [];
  const assetPattern = /<(?:script|link|img|audio)\b[^>]*(?:src|href)=["']([^"']+)["']/gi;
  let match;

  while ((match = assetPattern.exec(markup)) !== null) {
    references.push(match[1]);
  }

  return references;
}

[
  LOCAL_ONLY_PLAN,
  MAIN_PROCESS_PLAN,
  RENDERER_WIRING_PLAN,
  TAB_RESET_PLAN,
  WINDOW_TITLE_PLAN,
  LOCAL_ASSET_PLAN,
  NOTIFICATION_ICON_PLAN,
  'index.html',
  'index.js',
  'js/app.js',
  'js/main-process.js',
  'js/notification.js',
  'js/timer.js',
  'package.json',
  'README.md',
  'SECURITY.md',
  'scripts/test-app-wiring.js',
  'scripts/test-main-process.js',
  'VISION.md'
].forEach(assertFile);

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.scripts.contracts, 'node scripts/check-local-contracts.js');
assert.ok(pkg.scripts.lint.includes('node --check js/main-process.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-main-process.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-app-wiring.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-main-process.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-app-wiring.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/check-local-contracts.js'));
assert.ok(pkg.scripts.verify.includes('npm run contracts'));

const main = read('index.js');
assert.ok(main.includes("require('./js/main-process')"));
assert.ok(main.includes('handleCloseApp(mb.app, close);'));

const mainProcess = read('js/main-process.js');
assert.ok(mainProcess.includes("command !== 'close'"), 'close IPC must require the explicit close command');

const index = read('index.html');
assert.ok(!/<script[^>]+src=["']https?:\/\//i.test(index), 'index.html must not load remote scripts');
assert.ok(!index.includes('oss.maxcdn.com'), 'legacy CDN shims must stay removed');
assert.ok(index.includes('<title>Pomo</title>'), 'index.html window title must use the app name');
assert.ok(index.includes('js/notification.js') && index.includes('js/timer.js') && index.includes('js/app.js'));

const rendererAssets = rendererAssetReferences(index);
assert.ok(rendererAssets.includes('css/bootstrap.min.css'), 'renderer must reference local Bootstrap CSS');
assert.ok(rendererAssets.includes('audio/alert.wav'), 'renderer must reference the local alert audio');
for (const reference of rendererAssets) {
  assert.ok(!/^[a-z][a-z0-9+.-]*:/i.test(reference), `${reference} must be a local renderer asset`);
  assert.ok(!reference.startsWith('//'), `${reference} must be a local renderer asset`);

  const localPath = reference.split(/[?#]/)[0];
  assert.ok(localPath && !path.isAbsolute(localPath), `${reference} must use a relative local path`);
  assertFile(localPath);
}

const app = read('js/app.js');
assert.ok(app.includes("$(document).on('click', 'a[href^=\"http\"]'"), 'external links must stay user-click gated');
assert.ok(app.includes('event.preventDefault();'));
assert.ok(app.includes('isExternalHttpUrl(this.href)'), 'external links must stay protocol guarded');
assert.ok(app.includes('shell.openExternal(this.href);'));
assert.ok(app.includes("nameActiveTab[1] == 'long'"), 'long timer reset must require the long tab');
assert.ok(!app.includes('setInterval(shell.openExternal'), 'external links must not be opened from background timers');

const notification = read('js/notification.js');
assert.ok(notification.includes('requestPermission'), 'notification permission prompts must stay explicit');
assert.ok(!notification.includes('fetch(') && !notification.includes('XMLHttpRequest'), 'notifications must stay local-only');

const notificationIconMatch = notification.match(/\bicon:\s*['"]([^'"]+)['"]/);
assert.ok(notificationIconMatch, 'notification icon must stay configured');
const notificationIcon = notificationIconMatch[1];
assert.ok(!/^[a-z][a-z0-9+.-]*:/i.test(notificationIcon), 'notification icon must be a local asset');
assert.ok(!notificationIcon.startsWith('//'), 'notification icon must be a local asset');
const notificationIconPath = notificationIcon.split(/[?#]/)[0];
assert.ok(notificationIconPath && !path.isAbsolute(notificationIconPath), 'notification icon must use a relative local path');
assertFile(notificationIconPath);

const docs = ['README.md', 'SECURITY.md', 'VISION.md', 'CHANGES.md'].map(read).join('\n');
for (const phrase of ['npm run contracts', 'local-only', 'remote script', 'local asset', 'notification icon', 'user action', 'close IPC', 'unknown tab', 'window title', 'http/https']) {
  assert.ok(docs.toLowerCase().includes(phrase.toLowerCase()), `docs must mention ${phrase}`);
}

for (const planPath of [LOCAL_ONLY_PLAN, MAIN_PROCESS_PLAN, RENDERER_WIRING_PLAN, TAB_RESET_PLAN, WINDOW_TITLE_PLAN, LOCAL_ASSET_PLAN, NOTIFICATION_ICON_PLAN]) {
  const plan = read(planPath);
  assert.ok(plan.includes('Status: Completed'));
  assert.ok(plan.includes('make check'));
}

assert.ok(read(LOCAL_ONLY_PLAN).includes('npm run contracts'));
assert.ok(read(MAIN_PROCESS_PLAN).includes('test-main-process'));
assert.ok(read(RENDERER_WIRING_PLAN).includes('test-app-wiring'));
assert.ok(read(TAB_RESET_PLAN).includes('unknown tabs'));
assert.ok(read(WINDOW_TITLE_PLAN).includes('<title>Pomo</title>'));
assert.ok(read(LOCAL_ASSET_PLAN).includes('local asset references'));
assert.ok(read(NOTIFICATION_ICON_PLAN).includes('notification icon'));
assertFile('docs/plans/2026-06-09-external-link-protocol-guard.md');
const externalLinkPlan = read('docs/plans/2026-06-09-external-link-protocol-guard.md');
assert.ok(externalLinkPlan.includes('Status: Completed'));
assert.ok(externalLinkPlan.includes('make check'));
assert.ok(externalLinkPlan.includes('http/https'));

console.log('local-only contract checks passed.');
