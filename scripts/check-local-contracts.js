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
const ELECTRON_MIGRATION_PLAN = 'docs/plans/2026-06-12-electron-42-security-migration.md';
const TRAY_LIFECYCLE_PLAN = 'docs/plans/2026-06-13-tray-lifecycle-regression-tests.md';
const PRELOAD_URL_TYPE_PLAN = 'docs/plans/2026-06-13-preload-external-url-type-guard.md';
const IPC_SENDER_PLAN = 'docs/plans/2026-06-13-ipc-sender-identity-guard.md';
const LOCATION_INDEPENDENT_MAKE_PLAN = 'docs/plans/2026-06-14-location-independent-make.md';
const IPC_MAIN_FRAME_PLAN = 'docs/plans/2026-06-16-ipc-main-frame-identity-guard.md';
const OPEN_EXTERNAL_FAILURE_PLAN = 'docs/plans/2026-06-16-open-external-failure-boundary.md';
const NOTIFICATION_PERMISSION_PLAN = 'docs/plans/2026-06-16-notification-denied-permission-boundary.md';
const NOTIFICATION_REQUEST_FAILURE_PLAN = 'docs/plans/2026-06-16-notification-permission-request-failure.md';
const NOTIFICATION_CONSTRUCTION_FAILURE_PLAN = 'docs/plans/2026-06-17-notification-construction-failure.md';
const TIMER_COMPLETION_SETTLEMENT_PLAN = 'docs/plans/2026-06-17-timer-completion-settlement.md';
const UNDICI_ADVISORY_PLAN = 'docs/plans/2026-06-18-undici-advisory-remediation.md';
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
  ELECTRON_MIGRATION_PLAN,
  TRAY_LIFECYCLE_PLAN,
  PRELOAD_URL_TYPE_PLAN,
  IPC_SENDER_PLAN,
  LOCATION_INDEPENDENT_MAKE_PLAN,
  IPC_MAIN_FRAME_PLAN,
  OPEN_EXTERNAL_FAILURE_PLAN,
  NOTIFICATION_PERMISSION_PLAN,
  NOTIFICATION_REQUEST_FAILURE_PLAN,
  NOTIFICATION_CONSTRUCTION_FAILURE_PLAN,
  CI_WORKFLOW,
  '.nvmrc',
  'index.html',
  'index.js',
  'preload.js',
  'js/app.js',
  'js/electron-app.js',
  'js/main-process.js',
  'js/notification.js',
  'js/timer.js',
  'package.json',
  'package-lock.json',
  'Makefile',
  'README.md',
  'SECURITY.md',
  'scripts/test-app-wiring.js',
  'scripts/test-electron-app.js',
  'scripts/test-main-process.js',
  'scripts/test-preload-api.js',
  'scripts/smoke-electron.js',
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
  'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e',
  'actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10',
  'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e'
], 'hosted jobs must keep only the reviewed checkout and setup-node actions');
assert.equal((workflow.match(/persist-credentials:/g) || []).length, 2, 'both hosted checkouts must disable credential persistence');
assert.equal((workflow.match(/^permissions:$/gm) || []).length, 1, 'hosted permissions must be configured once');
assert.ok(/^permissions:\n  contents: read$/m.test(workflow), 'hosted checks must use read-only contents permission');
assert.ok(!/^\s+[A-Za-z-]+:\s+write\s*$/m.test(workflow), 'hosted checks must not request write permissions');
assert.ok(workflow.includes('node: [22.x, 24.x]'), 'hosted checks must cover Node 22 and 24');
assert.ok(workflow.includes('workflow_dispatch:'), 'hosted checks must allow manual dispatch');
assert.ok(!workflow.includes('branches: [master]'), 'hosted push checks must run on feature branches');
assert.ok(workflow.includes('cancel-in-progress: true'), 'hosted checks must cancel superseded runs');
assert.ok(workflow.includes('runs-on: ubuntu-24.04'), 'hosted checks must use the fixed Ubuntu runner');
assert.ok(workflow.includes('timeout-minutes: 10'), 'hosted contract checks must stay bounded');
assert.ok(workflow.includes('timeout-minutes: 15'), 'hosted Electron smoke must stay bounded');
assert.ok(/^\s+run: make check$/m.test(workflow), 'hosted checks must run the canonical make check gate');
assert.ok(workflow.includes('npm ci --ignore-scripts --no-audit --no-fund'), 'hosted contract checks must install the lockfile without scripts');
assert.ok(workflow.includes('npm ci --no-audit --no-fund'), 'hosted smoke must install Electron from the lockfile');
assert.ok(workflow.includes('run: npm audit'), 'hosted checks must audit the dependency graph');
assert.ok(workflow.includes('run: npm run smoke'), 'hosted checks must launch the Electron smoke test');

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.scripts.contracts, 'node scripts/check-local-contracts.js');
assert.equal(pkg.scripts.build, 'npm run contracts');
assert.equal(pkg.scripts.smoke, 'xvfb-run -a node scripts/smoke-electron.js');
assert.deepEqual(pkg.engines, { node: '>=22.12.0' });
assert.deepEqual(pkg.devDependencies, { electron: '42.4.0' });
assert.equal(pkg.dependencies, undefined);
assert.deepEqual(pkg.files, ['audio', 'css', 'fonts', 'index.html', 'index.js', 'js', 'preload.js', 'res/*.png']);
assert.equal(read('.nvmrc').trim(), '22');
assert.ok(pkg.scripts.lint.includes('node --check js/main-process.js'));
assert.ok(pkg.scripts.lint.includes('node --check js/electron-app.js'));
assert.ok(pkg.scripts.lint.includes('node --check preload.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/smoke-electron.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-main-process.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-app-wiring.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-electron-app.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/test-preload-api.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-main-process.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-app-wiring.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-electron-app.js'));
assert.ok(pkg.scripts.test.includes('node scripts/test-preload-api.js'));
assert.ok(pkg.scripts.lint.includes('node --check scripts/check-local-contracts.js'));
assert.ok(pkg.scripts.verify.includes('npm run build'));

const lock = JSON.parse(read('package-lock.json'));
assert.equal(lock.lockfileVersion, 3);
assert.deepEqual(lock.packages[''].devDependencies, pkg.devDependencies);
assert.deepEqual(lock.packages[''].engines, pkg.engines);
assert.equal(Boolean(lock.packages['node_modules/menubar']), false, 'lockfile must not restore menubar');
assert.equal(Boolean(lock.packages['node_modules/devtron']), false, 'lockfile must not restore devtron');
assert.equal(Boolean(lock.packages['node_modules/gulp']), false, 'lockfile must not restore gulp');
assert.equal(Boolean(lock.packages['node_modules/electron-packager']), false, 'lockfile must not restore electron-packager');
assert.equal(
  lock.packages['node_modules/undici'].version,
  '7.28.0',
  'lockfile must retain the patched undici release'
);

const makefile = read('Makefile');
assert.ok(
  /^override REPO_ROOT := \$\(abspath \$\(dir \$\(lastword \$\(MAKEFILE_LIST\)\)\)\)$/m.test(makefile),
  'Makefile must resolve an override-protected repository root from its own path'
);
assert.ok(/^check: verify$/m.test(makefile), 'Makefile must expose make check');
assert.ok(/^lint:\n\tcd "\$\(REPO_ROOT\)" && npm run lint$/m.test(makefile), 'Makefile must root npm lint');
assert.ok(/^test:\n\tcd "\$\(REPO_ROOT\)" && npm test$/m.test(makefile), 'Makefile must root npm test');
assert.ok(/^build:\n\tcd "\$\(REPO_ROOT\)" && npm run build$/m.test(makefile), 'Makefile must root npm build');
assert.ok(/^verify:\n\tcd "\$\(REPO_ROOT\)" && npm run verify$/m.test(makefile), 'Makefile must root npm verify');

const main = read('index.js');
assert.ok(main.includes("require('./js/electron-app')"));
assert.ok(main.includes('createPomoApplication(electron'));
assert.ok(!main.includes("require('menubar')"));

const electronApp = read('js/electron-app.js');
for (const phrase of [
  'new electron.BrowserWindow',
  'new electron.Tray',
  'contextIsolation: true',
  'nodeIntegration: false',
  'sandbox: true',
  "electron.ipcMain.handle('openExternal'",
  'isExternalHttpUrl(url)',
  "electron.ipcMain.on('closeApp'",
  "tray.on('click', toggleWindow)",
  "window.on('blur'",
  "window.webContents.once('did-finish-load'",
  'window.webContents.setWindowOpenHandler',
  "window.webContents.on('will-navigate'"
]) {
  assert.ok(electronApp.includes(phrase), `Electron app must include ${phrase}`);
}
assert.ok(/setWindowOpenHandler[\s\S]*return \{ action: 'deny' \}/.test(electronApp), 'renderer-created windows must stay denied');
assert.ok(/on\('will-navigate'[\s\S]*event\.preventDefault\(\)/.test(electronApp), 'renderer navigation must stay denied');
assert.ok(electronApp.includes('event.sender === window.webContents'), 'privileged IPC must require the application window sender');
assert.ok(electronApp.includes('event.senderFrame === window.webContents.mainFrame'), 'privileged IPC must require the application main frame');
assert.ok(electronApp.includes('&& event.senderFrame'), 'privileged IPC must reject missing sender frames');
assert.ok(/return Promise\.resolve\(\)[\s\S]*return electron\.shell\.openExternal\(url\)/.test(electronApp), 'external launches must capture synchronous platform failures');
assert.ok(/return true;[\s\S]*function \(\) \{[\s\S]*return false;/.test(electronApp), 'external launch rejections must resolve to false');

const mainProcess = read('js/main-process.js');
assert.ok(mainProcess.includes("command !== 'close'"), 'close IPC must require the explicit close command');

const index = read('index.html');
assert.ok(!/<script[^>]+src=["']https?:\/\//i.test(index), 'index.html must not load remote scripts');
assert.ok(!index.includes('oss.maxcdn.com'), 'legacy CDN shims must stay removed');
assert.ok(index.includes('<title>Pomo</title>'), 'index.html window title must use the app name');
assert.ok(index.includes('js/notification.js') && index.includes('js/timer.js') && index.includes('js/app.js'));
assert.ok(index.includes('Content-Security-Policy'), 'renderer must declare a Content Security Policy');
assert.ok(index.includes("script-src 'self'"), 'renderer CSP must allow only local scripts');
assert.ok(index.includes("connect-src 'none'"), 'renderer CSP must disable network connections');
assert.ok(!index.includes('onclick='), 'renderer must not depend on inline event handlers');
assert.ok(!index.includes("require('electron')"), 'renderer HTML must not access Electron directly');

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
assert.ok(app.includes('desktop.openExternal(this.href);'));
assert.ok(app.includes('desktop.close();'));
assert.ok(app.includes("$('#close_app').click(closeApp);"));
assert.ok(!app.includes("require('electron')"), 'renderer JavaScript must not access Electron directly');
assert.ok(app.includes("nameActiveTab[1] == 'long'"), 'long timer reset must require the long tab');
assert.ok(!app.includes('setInterval(shell.openExternal'), 'external links must not be opened from background timers');

const preload = read('preload.js');
const preloadRequires = Array.from(
  preload.matchAll(/\brequire\s*\(\s*(['"])(.*?)\1\s*\)/g),
  (match) => match[2]
);
assert.deepEqual(preloadRequires, ['electron'], 'sandboxed preload may only require Electron');
assert.ok(preload.includes("exposeInMainWorld('pomoDesktop'"));
assert.ok(preload.includes("ipcRenderer.send('closeApp', 'close')"));
assert.ok(preload.includes("typeof url !== 'string'"), 'preload must reject non-string external URLs');
assert.ok(preload.includes('return Promise.resolve(false);'), 'preload rejection must preserve the async API');
assert.ok(preload.includes("ipcRenderer.invoke('openExternal', url)"));

const preloadTests = read('scripts/test-preload-api.js');
assert.ok(preloadTests.includes("[null, 42, { url: 'https://example.com/' }]"), 'preload tests must cover representative non-string values');
assert.ok(preloadTests.includes("assert.deepEqual(invoked, [], 'non-string values must not cross the IPC boundary')"), 'preload tests must prove rejected values do not invoke IPC');

const notification = read('js/notification.js');
assert.ok(notification.includes('requestPermission'), 'notification permission prompts must stay explicit');
assert.ok(notification.includes("NotificationApi.permission !== 'default'"), 'only default notification permission may be requested');
assert.ok(notification.includes("NotificationApi.permission === 'granted'"), 'granted notification permission must remain explicit');
assert.ok(notification.includes('requestNotificationPermissionIfDefault(notificationApi)'), 'notification delivery must share the default-only request boundary');
assert.ok(notification.includes('try {'), 'notification permission requests must contain synchronous failures');
assert.ok(notification.includes("typeof permissionRequest.then === 'function'"), 'notification permission requests must detect promise-like results');
assert.ok(notification.includes('Promise.resolve(permissionRequest).catch(function () {})'), 'notification permission requests must contain rejected promises');
assert.equal((notification.match(/catch \(error\)/g) || []).length, 2, 'notification permission and construction failures must both be contained');
assert.ok(notification.includes("var notification = new notificationApi('Wow! Time\\'s up'"), 'notification construction must remain explicit');
assert.ok(notification.includes('return notification;'), 'successful notification construction must return the notification object');
assert.ok(!notification.includes('fetch(') && !notification.includes('XMLHttpRequest'), 'notifications must stay local-only');

const notificationTests = read('scripts/test-notification.js');
assert.ok(notificationTests.includes('ensureNotificationPermission(deniedNotification)'), 'notification tests must cover denied permission');
assert.ok(notificationTests.includes('assert.equal(notifyPermissionRequested, false)'), 'notification tests must prove denied permission is not requested again');
assert.ok(notificationTests.includes('runPermissionRequestFailureAssertions'), 'notification tests must exercise permission request failures');
assert.ok(notificationTests.includes('runPermissionRequestFailureAssertions().catch(error => {'), 'notification failure assertions must execute and surface test failures');
assert.ok(notificationTests.includes("process.once('unhandledRejection', captureUnhandledRejection)"), 'notification tests must observe rejected permission promises');
assert.ok(notificationTests.includes('assert.equal(requestNotificationPermissionIfDefault(throwingRequest), false)'), 'notification tests must contain synchronous permission failures');
assert.ok(notificationTests.includes('function ThrowingNotification()'), 'notification tests must cover construction failures');
assert.ok(notificationTests.includes('assert.equal(notifyUser(ThrowingNotification), undefined)'), 'notification tests must contain construction failures');
assert.ok(notificationTests.includes('assert.equal(constructionAttempts, 1)'), 'notification tests must execute construction exactly once');

const appWiringTests = read('scripts/test-app-wiring.js');
assert.ok(appWiringTests.includes("permission: 'denied'"), 'renderer wiring tests must exercise denied notification permission');
assert.ok(appWiringTests.includes('assert.equal(deniedPermissionRequests, 0)'), 'renderer wiring tests must prove startup does not retry denied permission');

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
const timerCompletionBranch = timer.slice(timer.indexOf('if (this.minutes == 0 && this.seconds == 0)'));
const completionStopIndex = timerCompletionBranch.indexOf('this.stopTimer();');
const completionNotificationIndex = timerCompletionBranch.indexOf("typeof root.notifyUser === 'function'");
assert.ok(completionStopIndex >= 0 && completionNotificationIndex >= 0 && completionStopIndex < completionNotificationIndex, 'completed timers must settle interval ownership before notification dispatch');

const timerTests = read('scripts/test-timer.js');
assert.ok(timerTests.includes("assert.equal(resumeDisplay.textContent, '01:05')"), 'timer tests must pause with zero-padded seconds');
assert.ok(timerTests.includes("assert.equal(resumeDisplay.textContent, '01:04')"), 'timer tests must resume at the next second');
assert.ok(timerTests.includes("throw new Error('unexpected notification hook failure')"), 'timer tests must exercise an unexpected completion hook failure');
assert.ok(timerTests.includes('assert.equal(clearedIntervals.length, clearsBeforeThrowingCompletion + 1)'), 'timer tests must prove cleanup precedes notification dispatch');
assert.ok(timerTests.includes('assert.equal(throwingNotifications, 1)'), 'timer tests must preserve exactly one failing notification attempt');

const electronAppTests = read('scripts/test-electron-app.js');
for (const phrase of [
  "assert.deepEqual(negativeDisplayPosition, [{ x: -1920, y: 750 }])",
  'trays[0].menu.template[0].click()',
  'trays[0].menu.template[2].click()',
  'events.activate()',
  'windows[0].devToolsOpen = true',
  'assert.equal(hiddenCloseEvent.prevented, true)',
  'assert.equal(isTrustedIpcSender(trustedEvent, windows[0]), true)',
  'assert.equal(isTrustedIpcSender(childFrameEvent, windows[0]), false)',
  'assert.equal(isTrustedIpcSender(missingFrameEvent, windows[0]), false)',
  "ipcHandlers.openExternal(childFrameEvent, 'https://child.example/')",
  "ipcListeners.closeApp(childFrameEvent, 'close')",
  "ipcHandlers.openExternal(untrustedEvent, 'https://untrusted.example/')",
  "openExternalFailure = 'reject'",
  "assert.equal(await ipcHandlers.openExternal(trustedEvent, 'https://rejected.example/'), false)",
  "openExternalFailure = 'throw'",
  "assert.equal(await ipcHandlers.openExternal(trustedEvent, 'https://throwing.example/'), false)",
  "assert.equal(await ipcHandlers.openExternal(trustedEvent, 'https://recovered.example/'), true)",
  "ipcListeners.closeApp(untrustedEvent, 'close')"
]) {
  assert.ok(electronAppTests.includes(phrase), `Electron application tests must preserve ${phrase}`);
}

const readme = read('README.md');
assert.ok(readme.includes('paused timer with zero-padded seconds'), 'README must document the paused timer regression');
assert.ok(readme.toLowerCase().includes('notification construction failures'), 'README must document notification construction failures');
assert.ok(readme.includes('settles interval ownership before notification dispatch'), 'README must document timer completion settlement ordering');

const docs = ['README.md', 'SECURITY.md', 'VISION.md', 'CHANGES.md'].map(read).join('\n');
for (const phrase of ['npm run contracts', 'local-only', 'remote script', 'local asset', 'notification icon', 'denied notification permission', 'notification permission request failures', 'notification construction failures', 'user action', 'close IPC', 'IPC sender', 'main frame', 'child and missing-frame', 'external launch failure', 'unknown tab', 'window title', 'http/https', 'accessible label', 'timer durations', 'completed timer', 'paused timer', 'tray positioning', 'GitHub Actions', 'Electron 42.4.0', 'Node 22', 'Node 24', 'package-lock.json', 'npm ci', 'context isolation', 'preload', 'Electron smoke']) {
  assert.ok(docs.toLowerCase().includes(phrase.toLowerCase()), `docs must mention ${phrase}`);
}
for (const path of ['README.md', 'SECURITY.md', 'VISION.md', 'CHANGES.md']) {
  assert.ok(read(path).toLowerCase().includes('notification permission request failures'), `${path} must document notification permission request failures`);
}

for (const planPath of [LOCAL_ONLY_PLAN, MAIN_PROCESS_PLAN, RENDERER_WIRING_PLAN, TAB_RESET_PLAN, WINDOW_TITLE_PLAN, LOCAL_ASSET_PLAN, NOTIFICATION_ICON_PLAN, GATE_WRAPPER_PLAN, ACCESSIBLE_CONTROL_PLAN, TIMER_DURATION_PLAN, TIMER_RESTART_PLAN, TIMER_PAUSE_PLAN, CI_BASELINE_PLAN, HOSTED_NODE_PLAN, TRAY_LIFECYCLE_PLAN, PRELOAD_URL_TYPE_PLAN, IPC_SENDER_PLAN, LOCATION_INDEPENDENT_MAKE_PLAN, IPC_MAIN_FRAME_PLAN, OPEN_EXTERNAL_FAILURE_PLAN]) {
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
assert.ok(read(HOSTED_NODE_PLAN).includes('superseded'));
assert.ok(read(TRAY_LIFECYCLE_PLAN).includes('negative coordinates'));
assert.ok(read(PRELOAD_URL_TYPE_PLAN).includes('non-string'));
assert.ok(read(IPC_SENDER_PLAN).includes('untrusted sender'));
assert.ok(read(IPC_SENDER_PLAN).includes('Node 22'));
assert.ok(read(IPC_SENDER_PLAN).includes('Node 24'));
assert.ok(read(IPC_SENDER_PLAN).includes('hostile mutations rejected'));
assert.ok(read(LOCATION_INDEPENDENT_MAKE_PLAN).includes('unrelated directory'));
assert.ok(read(LOCATION_INDEPENDENT_MAKE_PLAN).includes('Node 22'));
assert.ok(read(LOCATION_INDEPENDENT_MAKE_PLAN).includes('Node 24'));
assert.ok(read(LOCATION_INDEPENDENT_MAKE_PLAN).includes('hostile mutations rejected'));
const ipcMainFramePlan = read(IPC_MAIN_FRAME_PLAN);
assert.deepEqual(ipcMainFramePlan.match(/^Status:\s*(.+)$/gm), ['Status: Completed']);
for (const phrase of ['Node 24', 'zero vulnerabilities', '26-file', 'Six isolated hostile mutations', 'Exact diff']) {
  assert.ok(ipcMainFramePlan.includes(phrase), `IPC main-frame plan must preserve ${phrase}`);
}
const openExternalFailurePlan = read(OPEN_EXTERNAL_FAILURE_PLAN);
assert.deepEqual(openExternalFailurePlan.match(/^Status:\s*(.+)$/gm), ['Status: Completed']);
for (const phrase of ['synchronous throw', 'rejected promise', 'zero vulnerabilities', 'Seven isolated hostile mutations', 'Exact diff']) {
  assert.ok(openExternalFailurePlan.includes(phrase), `external launch failure plan must preserve ${phrase}`);
}
const notificationPermissionPlan = read(NOTIFICATION_PERMISSION_PLAN);
assert.deepEqual(notificationPermissionPlan.match(/^status:\s*(.+)$/gm), ['status: completed']);
for (const phrase of ['focused notification and app-wiring tests passed', 'npm run verify', 'external directory', 'Six isolated hostile mutations', 'Exact diff']) {
  assert.ok(notificationPermissionPlan.includes(phrase), `notification permission plan must preserve ${phrase}`);
}
const notificationRequestFailurePlan = read(NOTIFICATION_REQUEST_FAILURE_PLAN);
assert.deepEqual(notificationRequestFailurePlan.match(/^status:\s*(.+)$/gm), ['status: completed']);
for (const phrase of ['synchronous throws', 'rejected permission promises', 'Seven isolated hostile mutations', 'make check', 'Exact diff']) {
  assert.ok(notificationRequestFailurePlan.includes(phrase), `notification request failure plan must preserve ${phrase}`);
}
const notificationConstructionFailurePlan = read(NOTIFICATION_CONSTRUCTION_FAILURE_PLAN);
assert.deepEqual(notificationConstructionFailurePlan.match(/^status:\s*(.+)$/gm), ['status: completed']);
for (const phrase of ['throwing constructor', 'successful notification', 'zero vulnerabilities', 'hostile mutations', 'make check', 'Exact diff']) {
  assert.ok(notificationConstructionFailurePlan.includes(phrase), `notification construction failure plan must preserve ${phrase}`);
}
const timerCompletionSettlementPlan = read(TIMER_COMPLETION_SETTLEMENT_PLAN);
assert.deepEqual(timerCompletionSettlementPlan.match(/^status:\s*(.+)$/gm), ['status: completed']);
for (const phrase of ['throwing notification hook', 'settlement order', 'hostile mutations', 'make check', 'Exact diff']) {
  assert.ok(timerCompletionSettlementPlan.includes(phrase), `timer completion settlement plan must preserve ${phrase}`);
}
const undiciAdvisoryPlan = read(UNDICI_ADVISORY_PLAN);
assert.deepEqual(undiciAdvisoryPlan.match(/^status:\s*(.+)$/gm), ['status: completed']);
for (const phrase of ['7.28.0', 'zero vulnerabilities', '27774816051', '27774828870', 'Exact diff']) {
  assert.ok(undiciAdvisoryPlan.includes(phrase), `undici advisory plan must preserve ${phrase}`);
}
const electronMigrationPlan = read(ELECTRON_MIGRATION_PLAN);
assert.deepEqual(electronMigrationPlan.match(/^Status:\s*(.+)$/gm), ['Status: Completed']);
assert.ok(electronMigrationPlan.includes('## Work Completed'));
assert.ok(electronMigrationPlan.includes('## Verification'));
assert.ok(!/\b(?:Pending|TODO|TBD)\b/i.test(electronMigrationPlan));
assert.ok(electronMigrationPlan.includes('Electron 42.4.0'));
assert.ok(electronMigrationPlan.includes('glibc 2.31'));
assert.ok(electronMigrationPlan.includes('27429429948'));
assert.ok(electronMigrationPlan.includes('27429431879'));
assert.ok(electronMigrationPlan.includes('27429429487'));
assert.ok(electronMigrationPlan.includes('npm audit'));
assert.ok(electronMigrationPlan.includes('make check'));
assert.ok(electronMigrationPlan.includes('npm pack --dry-run --json'));
assertFile('docs/plans/2026-06-09-external-link-protocol-guard.md');
const externalLinkPlan = read('docs/plans/2026-06-09-external-link-protocol-guard.md');
assert.ok(externalLinkPlan.includes('Status: Completed'));
assert.ok(externalLinkPlan.includes('make check'));
assert.ok(externalLinkPlan.includes('http/https'));

console.log('local-only contract checks passed.');
