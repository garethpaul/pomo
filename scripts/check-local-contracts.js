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
const GATE_WRAPPER_PLAN = 'docs/plans/2026-06-09-gate-wrapper-contract.md';
const ACCESSIBLE_CONTROL_PLAN = 'docs/plans/2026-06-09-renderer-accessible-controls.md';
const TIMER_DURATION_PLAN = 'docs/plans/2026-06-10-timer-duration-validation.md';
const TIMER_RESTART_PLAN = 'docs/plans/2026-06-10-completed-timer-restart.md';
const TIMER_PAUSE_PLAN = 'docs/plans/2026-06-12-timer-pause-resume.md';
const CI_BASELINE_PLAN = 'docs/plans/2026-06-10-ci-baseline.md';
const HOSTED_NODE_PLAN = 'docs/plans/2026-06-10-hosted-node-validation.md';
const CI_WORKFLOW = '.github/workflows/check.yml';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assertFile(relativePath) {
  assert.ok(fs.existsSync(path.join(ROOT, relativePath)), `${relativePath} must exist`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function openingTagByAttribute(markup, tagName, attributeName, attributeValue) {
  const pattern = new RegExp(
    `<${tagName}\\b(?=[^>]*\\b${escapeRegExp(attributeName)}=["']${escapeRegExp(attributeValue)}["'])[^>]*>`,
    'i'
  );
  const match = markup.match(pattern);

  return match ? match[0] : undefined;
}

function attributeValue(openingTag, attributeName) {
  const pattern = new RegExp(`\\b${escapeRegExp(attributeName)}=(["'])(.*?)\\1`, 'i');
  const match = openingTag.match(pattern);

  return match ? match[2] : undefined;
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
  GATE_WRAPPER_PLAN,
  ACCESSIBLE_CONTROL_PLAN,
  TIMER_DURATION_PLAN,
  TIMER_RESTART_PLAN,
  TIMER_PAUSE_PLAN,
  CI_BASELINE_PLAN,
  HOSTED_NODE_PLAN,
  CI_WORKFLOW,
  'index.html',
  'index.js',
  'js/app.js',
  'js/main-process.js',
  'js/notification.js',
  'js/timer.js',
  'package.json',
  'Makefile',
  'README.md',
  'SECURITY.md',
  'scripts/test-app-wiring.js',
  'scripts/test-main-process.js',
  'VISION.md'
].forEach(assertFile);

const workflow = read(CI_WORKFLOW);
const workflowActions = Array.from(
  workflow.matchAll(/^\s*(?:-\s*)?uses:\s*(\S+)(?:\s+#.*)?$/gm),
  (match) => match[1]
);
const checkoutContract = [
  '      - name: Check out repository',
  '        uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10 # v6.0.3',
  '        with:',
  '          persist-credentials: false'
].join('\n');
assert.ok(workflow.includes(checkoutContract), 'hosted checkout must stay pinned and credential-free');
assert.deepEqual(workflowActions, [
  'actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10',
  'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e'
], 'hosted checks must keep only the reviewed checkout and setup-node actions');
assert.equal((workflow.match(/persist-credentials:/g) || []).length, 1, 'hosted checkout credentials must be configured once');
assert.equal((workflow.match(/^permissions:$/gm) || []).length, 1, 'hosted permissions must be configured once');
assert.ok(/^permissions:\n  contents: read$/m.test(workflow), 'hosted checks must use read-only contents permission');
assert.ok(!/^\s+[A-Za-z-]+:\s+write\s*$/m.test(workflow), 'hosted checks must not request write permissions');
assert.ok(workflow.includes('node: [20.x, 24.x]'), 'hosted checks must cover Node 20 and 24');
assert.ok(workflow.includes('workflow_dispatch:'), 'hosted checks must allow manual dispatch');
assert.ok(workflow.includes('cancel-in-progress: true'), 'hosted checks must cancel superseded runs');
assert.ok(workflow.includes('runs-on: ubuntu-24.04'), 'hosted checks must use the fixed Ubuntu runner');
assert.ok(workflow.includes('timeout-minutes: 10'), 'hosted checks must stay bounded');
assert.ok(/^\s+run: make check$/m.test(workflow), 'hosted checks must run the canonical make check gate');
assert.ok(!/\bnpm (?:ci|install)\b/.test(workflow), 'hosted checks must not install the legacy Electron dependency tree');

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.scripts.contracts, 'node scripts/check-local-contracts.js');
assert.equal(pkg.scripts.build, 'npm run contracts');
assert.ok(pkg.scripts.lint.includes('node --check js/main-process.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-main-process.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-app-wiring.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-main-process.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-app-wiring.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/check-local-contracts.js'));
assert.ok(pkg.scripts.verify.includes('npm run build'));

const makefile = read('Makefile');
assert.ok(/^check: verify$/m.test(makefile), 'Makefile must expose make check');
assert.ok(/^lint:\n\tnpm run lint$/m.test(makefile), 'Makefile must expose npm lint');
assert.ok(/^test:\n\tnpm test$/m.test(makefile), 'Makefile must expose npm test');
assert.ok(/^build:\n\tnpm run build$/m.test(makefile), 'Makefile must expose npm build');
assert.ok(/^verify:\n\tnpm run verify$/m.test(makefile), 'Makefile must expose npm verify');

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

const rendererButtonLabels = {
  close_app: 'Close Pomo',
  start: 'Start Pomodoro timer',
  stop: 'Pause Pomodoro timer',
  reset: 'Reset Pomodoro timer',
  short_start: 'Start short break timer',
  short_stop: 'Pause short break timer',
  short_reset: 'Reset short break timer',
  long_start: 'Start long break timer',
  long_stop: 'Pause long break timer',
  long_reset: 'Reset long break timer'
};

for (const [buttonId, expectedLabel] of Object.entries(rendererButtonLabels)) {
  const button = openingTagByAttribute(index, 'button', 'id', buttonId);
  assert.ok(button, `renderer button #${buttonId} must exist`);
  assert.equal(attributeValue(button, 'aria-label'), expectedLabel, `renderer button #${buttonId} must expose an accessible label`);
  assert.equal(attributeValue(button, 'title'), expectedLabel, `renderer button #${buttonId} must expose a tooltip title`);
}

const brandLogo = openingTagByAttribute(index, 'img', 'src', 'res/pomo_logo.png');
assert.ok(brandLogo, 'renderer brand logo must stay present');
assert.equal(attributeValue(brandLogo, 'alt'), 'Pomo', 'renderer brand logo must expose alt text');

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

const timer = read('js/timer.js');
assert.ok(timer.includes('assertPositiveIntegerDuration'), 'timer durations must be validated');
assert.ok(timer.includes("'minutes'"), 'timer minutes must reject invalid durations');
assert.ok(timer.includes("'seconds'"), 'timer seconds must reject invalid durations');
assert.ok(timer.includes('must be a positive integer'), 'timer duration errors must stay explicit');
assert.ok(timer.includes('this.timer === 0'), 'completed timers must restart from their initial duration');
assert.ok(timer.includes('Number(this.minutes) * 60 + Number(this.seconds)'), 'paused timers must resume from numeric remaining time');

const timerTests = read('scripts/test-timer.js');
assert.ok(timerTests.includes("assert.equal(resumeDisplay.textContent, '01:05')"), 'timer tests must pause with zero-padded seconds');
assert.ok(timerTests.includes("assert.equal(resumeDisplay.textContent, '01:04')"), 'timer tests must resume at the next second');

const readme = read('README.md');
assert.ok(readme.includes('paused timer with zero-padded seconds'), 'README must document the paused timer regression');

const docs = ['README.md', 'SECURITY.md', 'VISION.md', 'CHANGES.md'].map(read).join('\n');
for (const phrase of ['npm run contracts', 'local-only', 'remote script', 'local asset', 'notification icon', 'user action', 'close IPC', 'unknown tab', 'window title', 'http/https', 'accessible label', 'timer durations', 'completed timer', 'paused timer', 'GitHub Actions']) {
  assert.ok(docs.toLowerCase().includes(phrase.toLowerCase()), `docs must mention ${phrase}`);
}

for (const planPath of [LOCAL_ONLY_PLAN, MAIN_PROCESS_PLAN, RENDERER_WIRING_PLAN, TAB_RESET_PLAN, WINDOW_TITLE_PLAN, LOCAL_ASSET_PLAN, NOTIFICATION_ICON_PLAN, GATE_WRAPPER_PLAN, ACCESSIBLE_CONTROL_PLAN, TIMER_DURATION_PLAN, TIMER_RESTART_PLAN, TIMER_PAUSE_PLAN, CI_BASELINE_PLAN, HOSTED_NODE_PLAN]) {
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
assert.ok(read(GATE_WRAPPER_PLAN).includes('make build'));
assert.ok(read(ACCESSIBLE_CONTROL_PLAN).includes('icon-only controls'));
assert.ok(read(TIMER_DURATION_PLAN).includes('positive integer'));
assert.ok(read(TIMER_RESTART_PLAN).includes('initial duration'));
assert.ok(read(TIMER_PAUSE_PLAN).includes('01:05'));
assert.ok(read(CI_BASELINE_PLAN).includes('GitHub Actions'));
assert.ok(read(HOSTED_NODE_PLAN).includes('Node 20 and Node 24'));
assertFile('docs/plans/2026-06-09-external-link-protocol-guard.md');
const externalLinkPlan = read('docs/plans/2026-06-09-external-link-protocol-guard.md');
assert.ok(externalLinkPlan.includes('Status: Completed'));
assert.ok(externalLinkPlan.includes('make check'));
assert.ok(externalLinkPlan.includes('http/https'));

console.log('local-only contract checks passed.');
