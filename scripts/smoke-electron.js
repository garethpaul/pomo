'use strict';

const path = require('node:path');
const { spawn } = require('node:child_process');

const appRoot = path.join(__dirname, '..');
const electronPath = require('electron');
const output = [];
const child = spawn(electronPath, ['--no-sandbox', path.join(appRoot, 'index.js')], {
  cwd: appRoot,
  env: Object.assign({}, process.env, { POMO_SMOKE_TEST: '1' }),
  stdio: ['ignore', 'pipe', 'pipe']
});

child.stdout.on('data', function (chunk) {
  output.push(chunk.toString());
});
child.stderr.on('data', function (chunk) {
  output.push(chunk.toString());
});

const timeout = setTimeout(function () {
  child.kill('SIGKILL');
  console.error(output.join(''));
  console.error('Electron smoke test exceeded 30 seconds.');
  process.exit(1);
}, 30000);

child.on('error', function (error) {
  clearTimeout(timeout);
  console.error(error);
  process.exit(1);
});

child.on('close', function (code, signal) {
  clearTimeout(timeout);
  const combinedOutput = output.join('');
  if (code !== 0 || signal || !combinedOutput.includes('Pomo Electron smoke test passed.')) {
    console.error(combinedOutput);
    console.error('Electron smoke test failed with code %s and signal %s.', code, signal);
    process.exit(1);
  }
  console.log('Electron application smoke test passed.');
});
