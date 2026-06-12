'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'preload.js'), 'utf8');
const sent = [];
const invoked = [];
let exposed;

const context = {
  require(moduleName) {
    assert.equal(moduleName, 'electron');
    return {
      contextBridge: {
        exposeInMainWorld(name, api) {
          exposed = { name, api };
        }
      },
      ipcRenderer: {
        send(channel, value) {
          sent.push({ channel, value });
        },
        invoke(channel, value) {
          invoked.push({ channel, value });
          return Promise.resolve(true);
        }
      }
    };
  },
  Object
};

vm.createContext(context);
vm.runInContext(source, context, { filename: 'preload.js' });

assert.equal(exposed.name, 'pomoDesktop');
assert.equal(Object.isFrozen(exposed.api), true);
assert.deepEqual(Object.keys(exposed.api).sort(), ['close', 'openExternal']);
exposed.api.close();
assert.deepEqual(sent, [{ channel: 'closeApp', value: 'close' }]);

exposed.api.openExternal('https://example.com/').then((result) => {
  assert.equal(result, true);
  assert.deepEqual(invoked, [{ channel: 'openExternal', value: 'https://example.com/' }]);
  console.log('preload API tests passed.');
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
