'use strict';

const assert = require('node:assert/strict');

const {
  createSharedObject,
  handleCloseApp,
  quitApp
} = require('../js/main-process');

assert.equal(quitApp(undefined), false);
assert.equal(quitApp({}), false);

let quitCount = 0;
const app = {
  quit() {
    quitCount += 1;
  }
};

assert.equal(handleCloseApp(app, 'noop'), false);
assert.equal(quitCount, 0);

assert.equal(handleCloseApp(app, 'close'), true);
assert.equal(quitCount, 1);

let hideCount = 0;
const sharedObject = createSharedObject({
  hideWindow() {
    hideCount += 1;
  },
  app: app
});

assert.equal(sharedObject.pinned, false);
sharedObject.hide();
assert.equal(hideCount, 1);
sharedObject.quit();
assert.equal(quitCount, 2);

createSharedObject({}).hide();
createSharedObject({ app: {} }).quit();
