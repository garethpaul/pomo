'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');

const {
  createPomoApplication,
  createWindowOptions,
  isExternalHttpUrl,
  positionWindow
} = require('../js/electron-app');

const preloadPath = path.join(__dirname, '..', 'preload.js');
const windowOptions = createWindowOptions(preloadPath);
assert.equal(windowOptions.width, 278);
assert.equal(windowOptions.height, 250);
assert.equal(windowOptions.show, false);
assert.equal(windowOptions.frame, false);
assert.equal(windowOptions.skipTaskbar, true);
assert.equal(windowOptions.webPreferences.preload, preloadPath);
assert.equal(windowOptions.webPreferences.contextIsolation, true);
assert.equal(windowOptions.webPreferences.nodeIntegration, false);
assert.equal(windowOptions.webPreferences.sandbox, true);

assert.equal(isExternalHttpUrl('https://example.com/path'), true);
assert.equal(isExternalHttpUrl('http://example.com/path'), true);
assert.equal(isExternalHttpUrl('file:///etc/passwd'), false);
assert.equal(isExternalHttpUrl('javascript:alert(1)'), false);
assert.equal(isExternalHttpUrl('https://user:pass@example.com/'), false);
assert.equal(isExternalHttpUrl('not a url'), false);

const positioned = [];
positionWindow({
  getBounds() {
    return { x: 900, y: 0, width: 24, height: 24 };
  }
}, {
  getBounds() {
    return { width: 278, height: 250 };
  },
  setPosition(x, y) {
    positioned.push({ x, y });
  }
}, {
  getDisplayNearestPoint() {
    return { workArea: { x: 0, y: 0, width: 1024, height: 768 } };
  }
});
assert.deepEqual(positioned, [{ x: 746, y: 24 }]);

const events = {};
const ipcHandlers = {};
const ipcListeners = {};
const openedUrls = [];
const windows = [];
const trays = [];
let quitCount = 0;

class FakeWindow {
  constructor(options) {
    this.options = options;
    this.visible = false;
    this.windowEvents = {};
    this.webContents = {
      once: (name, handler) => {
        this.loadHandler = handler;
      },
      isDevToolsOpened: () => false
    };
    windows.push(this);
  }

  loadFile(file) {
    this.loadedFile = file;
  }

  on(name, handler) {
    this.windowEvents[name] = handler;
  }

  isVisible() {
    return this.visible;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  focus() {
    this.focused = true;
  }

  getBounds() {
    return { width: 278, height: 250 };
  }

  setPosition(x, y) {
    this.position = { x, y };
  }
}

class FakeTray {
  constructor(icon) {
    this.icon = icon;
    this.trayEvents = {};
    trays.push(this);
  }

  setToolTip(value) {
    this.tooltip = value;
  }

  setContextMenu(menu) {
    this.menu = menu;
  }

  on(name, handler) {
    this.trayEvents[name] = handler;
  }

  getBounds() {
    return { x: 900, y: 0, width: 24, height: 24 };
  }
}

const electron = {
  app: {
    whenReady() {
      return Promise.resolve();
    },
    on(name, handler) {
      events[name] = handler;
    },
    quit() {
      quitCount += 1;
    }
  },
  BrowserWindow: FakeWindow,
  Tray: FakeTray,
  Menu: {
    buildFromTemplate(template) {
      return { template };
    }
  },
  dialog: {
    showMessageBox() {}
  },
  ipcMain: {
    handle(name, handler) {
      ipcHandlers[name] = handler;
    },
    on(name, handler) {
      ipcListeners[name] = handler;
    }
  },
  screen: {
    getDisplayNearestPoint() {
      return { workArea: { x: 0, y: 0, width: 1024, height: 768 } };
    }
  },
  shell: {
    openExternal(url) {
      openedUrls.push(url);
      return Promise.resolve();
    }
  }
};

(async function run() {
  const application = createPomoApplication(electron, {
    appRoot: path.join(__dirname, '..'),
    smokeTest: false
  });
  await application.ready;

  assert.equal(windows.length, 1);
  assert.equal(trays.length, 1);
  assert.equal(windows[0].loadedFile, path.join(__dirname, '..', 'index.html'));
  assert.equal(trays[0].tooltip, 'Pomo');
  assert.equal(trays[0].menu.template.length, 3);

  trays[0].trayEvents.click();
  assert.equal(windows[0].visible, true);
  assert.equal(windows[0].focused, true);
  trays[0].trayEvents.click();
  assert.equal(windows[0].visible, false);

  assert.equal(await ipcHandlers.openExternal({}, 'file:///etc/passwd'), false);
  assert.equal(await ipcHandlers.openExternal({}, 'https://example.com/'), true);
  assert.deepEqual(openedUrls, ['https://example.com/']);

  ipcListeners.closeApp({}, 'noop');
  assert.equal(quitCount, 0);
  ipcListeners.closeApp({}, 'close');
  assert.equal(quitCount, 1);

  windows[0].visible = true;
  windows[0].windowEvents.blur();
  assert.equal(windows[0].visible, false);

  events['before-quit']();
  const closeEvent = { prevented: false, preventDefault() { this.prevented = true; } };
  windows[0].windowEvents.close(closeEvent);
  assert.equal(closeEvent.prevented, false);

  console.log('electron app tests passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
