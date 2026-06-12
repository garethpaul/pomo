'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

const displays = {
  '#time': { textContent: '' },
  '#time_short': { textContent: '' },
  '#time_long': { textContent: '' }
};
const timers = [];
const clickHandlers = new Map();
const delegatedHandlers = [];
const directHandlers = new Map();
const visibility = new Map();
const openedUrls = [];
let closeCalls = 0;

function last(values) {
  return values[values.length - 1];
}

class FakeTimer {
  constructor(minutes) {
    this.minutes = minutes;
    this.startCalls = [];
    this.stopCalls = 0;
    this.resetCalls = [];
    timers.push(this);
  }

  startTimer(display) {
    this.startCalls.push(display);
  }

  stopTimer() {
    this.stopCalls += 1;
  }

  resetTimer(selector) {
    this.resetCalls.push(selector);
  }
}

const documentStub = {
  querySelector(selector) {
    assert.ok(displays[selector], `unexpected display selector ${selector}`);
    return displays[selector];
  }
};

function selectorKey(target) {
  return target === documentStub ? 'document' : String(target);
}

function jqueryStub(target) {
  const key = selectorKey(target);

  return {
    click(handler) {
      clickHandlers.set(key, handler);
      return this;
    },

    hide() {
      visibility.set(key, 'hidden');
      return this;
    },

    show() {
      visibility.set(key, 'shown');
      return this;
    },

    on(eventName, selectorOrHandler, maybeHandler) {
      if (typeof maybeHandler === 'function') {
        delegatedHandlers.push({
          eventName,
          handler: maybeHandler,
          selector: selectorOrHandler,
          target: key
        });
      } else {
        directHandlers.set(`${key}:${eventName}`, selectorOrHandler);
      }

      return this;
    }
  };
}

const context = {
  console,
  document: documentStub,
  window: {
    PomoTimer: FakeTimer,
    pomoDesktop: {
      close() {
        closeCalls += 1;
      },
      openExternal(url) {
        openedUrls.push(url);
        return Promise.resolve(true);
      }
    }
  },
  $: jqueryStub
};
context.global = context;

vm.createContext(context);
vm.runInContext(`${source}\nglobal.__closeApp = closeApp;`, context, { filename: 'js/app.js' });

assert.deepEqual(timers.map(timer => timer.minutes), [25, 5, 10]);

const externalLinkHandler = delegatedHandlers.find(handler =>
  handler.target === 'document' &&
  handler.eventName === 'click' &&
  handler.selector === 'a[href^="http"]'
);
assert.ok(externalLinkHandler, 'external link handler must be delegated through document clicks');

let defaultPrevented = false;
externalLinkHandler.handler.call({ href: 'https://example.com/docs' }, {
  preventDefault() {
    defaultPrevented = true;
  }
});
assert.equal(defaultPrevented, true);
assert.deepEqual(openedUrls, ['https://example.com/docs']);

defaultPrevented = false;
externalLinkHandler.handler.call({ href: 'httpnot-a-real-url' }, {
  preventDefault() {
    defaultPrevented = true;
  }
});
assert.equal(defaultPrevented, true);
assert.deepEqual(openedUrls, ['https://example.com/docs']);

clickHandlers.get('#start')();
assert.deepEqual(timers[0].startCalls, [displays['#time']]);
assert.equal(visibility.get('#stop'), 'shown');
assert.equal(visibility.get('#start'), 'hidden');

clickHandlers.get('#stop')();
assert.equal(timers[0].stopCalls, 1);
assert.equal(visibility.get('#start'), 'shown');
assert.equal(visibility.get('#stop'), 'hidden');

clickHandlers.get('#reset')();
assert.deepEqual(timers[0].resetCalls, ['#time']);

clickHandlers.get('#short_start')();
assert.deepEqual(timers[1].startCalls, [displays['#time_short']]);
clickHandlers.get('#short_stop')();
assert.equal(timers[1].stopCalls, 1);
clickHandlers.get('#short_reset')();
assert.deepEqual(timers[1].resetCalls, ['#time_short']);

clickHandlers.get('#long_start')();
assert.deepEqual(timers[2].startCalls, [displays['#time_long']]);
clickHandlers.get('#long_stop')();
assert.equal(timers[2].stopCalls, 1);
clickHandlers.get('#long_reset')();
assert.deepEqual(timers[2].resetCalls, ['#time_long']);

const tabHandler = directHandlers.get('a[data-toggle="tab"]:shown.bs.tab');
assert.ok(tabHandler, 'tab shown handler must be registered');

tabHandler({ target: { toString: () => 'pomo://app#pomodoro' } });
tabHandler({ target: { toString: () => 'pomo://app#short' } });
tabHandler({ target: { toString: () => 'pomo://app#long' } });

assert.equal(last(timers[0].resetCalls), '#time');
assert.equal(last(timers[1].resetCalls), '#time_short');
assert.equal(last(timers[2].resetCalls), '#time_long');

const resetCounts = timers.map(timer => timer.resetCalls.length);
tabHandler({ target: { toString: () => 'pomo://app#unknown' } });
assert.deepEqual(
  timers.map(timer => timer.resetCalls.length),
  resetCounts,
  'unknown tabs must not reset a timer'
);

context.__closeApp();
assert.equal(closeCalls, 1);
clickHandlers.get('#close_app')();
assert.equal(closeCalls, 2);

console.log('renderer wiring tests passed.');
