'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');

const {
  createPomoApplication,
  createWindowOptions,
  isExternalHttpUrl,
  isTrustedIpcSender,
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

const negativeDisplayPosition = [];
positionWindow({
  getBounds() {
    return { x: -1900, y: 1000, width: 24, height: 24 };
  }
}, {
  getBounds() {
    return { width: 278, height: 250 };
  },
  setPosition(x, y) {
    negativeDisplayPosition.push({ x, y });
  }
}, {
  getDisplayNearestPoint() {
    return { workArea: { x: -1920, y: 0, width: 1920, height: 1080 } };
  }
});
assert.deepEqual(negativeDisplayPosition, [{ x: -1920, y: 750 }]);

const events = {};
const ipcHandlers = {};
const ipcListeners = {};
const openedUrls = [];
const dialogs = [];
const windows = [];
const trays = [];
let quitCount = 0;

class FakeWindow {
  constructor(options) {
    this.options = options;
    this.visible = false;
    this.windowEvents = {};
    this.webContentsEvents = {};
    this.devToolsOpen = false;
    this.webContents = {
      on: (name, handler) => {
        this.webContentsEvents[name] = handler;
      },
      once: (name, handler) => {
        this.loadHandler = handler;
      },
      isDevToolsOpened: () => this.devToolsOpen,
      setWindowOpenHandler: (handler) => {
        this.windowOpenHandler = handler;
      }
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
    showMessageBox(options) {
      dialogs.push(options);
    }
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
  const trustedEvent = { sender: windows[0].webContents };
  const untrustedEvent = { sender: {} };
  assert.equal(isTrustedIpcSender(trustedEvent, windows[0]), true);
  assert.equal(isTrustedIpcSender(untrustedEvent, windows[0]), false);
  assert.equal(windows[0].loadedFile, path.join(__dirname, '..', 'index.html'));
  assert.deepEqual(windows[0].windowOpenHandler({ url: 'https://example.com/' }), { action: 'deny' });
  const navigationEvent = { prevented: false, preventDefault() { this.prevented = true; } };
  windows[0].webContentsEvents['will-navigate'](navigationEvent, 'https://example.com/');
  assert.equal(navigationEvent.prevented, true);
  assert.equal(trays[0].tooltip, 'Pomo');
  assert.equal(trays[0].menu.template.length, 3);

  trays[0].menu.template[0].click();
  assert.deepEqual(dialogs, [{
    title: 'Pomo',
    type: 'info',
    message: 'A pomodoro app in your menubar/tray.',
    buttons: ['Close']
  }]);
  trays[0].menu.template[2].click();
  assert.equal(quitCount, 1);

  events.activate();
  assert.equal(windows[0].visible, true);
  assert.equal(windows[0].focused, true);

  trays[0].trayEvents.click();
  assert.equal(windows[0].visible, false);
  trays[0].trayEvents.click();
  assert.equal(windows[0].visible, true);

  assert.equal(await ipcHandlers.openExternal(trustedEvent, 'file:///etc/passwd'), false);
  assert.equal(await ipcHandlers.openExternal(untrustedEvent, 'https://untrusted.example/'), false);
  assert.equal(await ipcHandlers.openExternal(trustedEvent, 'https://example.com/'), true);
  assert.deepEqual(openedUrls, ['https://example.com/']);

  ipcListeners.closeApp(trustedEvent, 'noop');
  assert.equal(quitCount, 1);
  ipcListeners.closeApp(untrustedEvent, 'close');
  assert.equal(quitCount, 1);
  ipcListeners.closeApp(trustedEvent, 'close');
  assert.equal(quitCount, 2);

  windows[0].devToolsOpen = true;
  windows[0].visible = true;
  windows[0].windowEvents.blur();
  assert.equal(windows[0].visible, true);
  windows[0].devToolsOpen = false;
  windows[0].windowEvents.blur();
  assert.equal(windows[0].visible, false);

  windows[0].visible = true;
  const hiddenCloseEvent = { prevented: false, preventDefault() { this.prevented = true; } };
  windows[0].windowEvents.close(hiddenCloseEvent);
  assert.equal(hiddenCloseEvent.prevented, true);
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
