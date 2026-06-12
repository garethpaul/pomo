'use strict';

const assert = require('node:assert/strict');

const Timer = require('../js/timer');

assert.equal(new Timer(5)._getDoubleDigit(5), '05');
assert.equal(new Timer(12)._getDoubleDigit(12), '12');
assert.throws(() => new Timer(0), /minutes must be a positive integer/);
assert.throws(() => new Timer(-1), /minutes must be a positive integer/);
assert.throws(() => new Timer(1.5), /minutes must be a positive integer/);
assert.throws(() => new Timer('5'), /minutes must be a positive integer/);
assert.throws(() => new Timer(5, 0), /seconds must be a positive integer/);

const timer = new Timer(25);
timer._initializePomotime();
assert.equal(timer.pomodoroTime, 1500);

timer.minutes = 4;
timer.seconds = 30;
timer._initializePomotime();
assert.equal(timer.pomodoroTime, 270);

const originalSetInterval = global.setInterval;
const originalClearInterval = global.clearInterval;
const originalNotifyUser = global.notifyUser;

try {
  const callbacks = [];
  const clearedIntervals = [];
  let notifications = 0;

  global.setInterval = (callback, delay) => {
    assert.equal(delay, 1000);
    callbacks.push(callback);
    return 42;
  };
  global.clearInterval = intervalId => {
    clearedIntervals.push(intervalId);
  };
  global.notifyUser = () => {
    notifications += 1;
  };

  const display = { textContent: '' };
  const countdown = new Timer(1);
  countdown.startTimer(display);

  assert.equal(callbacks.length, 1);
  assert.deepEqual(clearedIntervals, [undefined]);

  for (let tick = 0; tick < 59; tick += 1) {
    callbacks[0]();
  }

  assert.equal(display.textContent, '00:01');
  assert.equal(notifications, 0);

  callbacks[0]();

  assert.equal(display.textContent, '00:00');
  assert.equal(notifications, 1);
  assert.deepEqual(clearedIntervals, [undefined, 42]);

  countdown.startTimer(display);
  assert.equal(callbacks.length, 2);
  assert.deepEqual(clearedIntervals, [undefined, 42, 42]);

  callbacks[1]();
  assert.equal(display.textContent, '00:59');
  assert.equal(notifications, 1);

  const resumeDisplay = { textContent: '' };
  const resumable = new Timer(2);
  resumable.startTimer(resumeDisplay);

  for (let tick = 0; tick < 55; tick += 1) {
    callbacks[2]();
  }

  assert.equal(resumeDisplay.textContent, '01:05');
  resumable.stopTimer();
  resumable.startTimer(resumeDisplay);
  callbacks[3]();
  assert.equal(resumeDisplay.textContent, '01:04');
} finally {
  global.setInterval = originalSetInterval;
  global.clearInterval = originalClearInterval;
  global.notifyUser = originalNotifyUser;
}
