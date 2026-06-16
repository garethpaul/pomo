'use strict';

const path = require('node:path');
const { handleCloseApp } = require('./main-process');

function isExternalHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:')
      && !parsed.username
      && !parsed.password;
  } catch (error) {
    return false;
  }
}

function isTrustedIpcSender(event, window) {
  return Boolean(
    event
    && event.senderFrame
    && window
    && window.webContents
    && event.sender === window.webContents
    && event.senderFrame === window.webContents.mainFrame
  );
}

function createWindowOptions(preloadPath) {
  return {
    width: 278,
    height: 250,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  };
}

function positionWindow(tray, window, screen) {
  const trayBounds = tray.getBounds();
  const windowBounds = window.getBounds();
  const display = screen.getDisplayNearestPoint({
    x: Math.round(trayBounds.x + trayBounds.width / 2),
    y: Math.round(trayBounds.y + trayBounds.height / 2)
  });
  const workArea = display.workArea;
  const centeredX = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
  const x = Math.max(workArea.x, Math.min(centeredX, workArea.x + workArea.width - windowBounds.width));
  const opensDown = trayBounds.y < workArea.y + workArea.height / 2;
  const desiredY = opensDown
    ? trayBounds.y + trayBounds.height
    : trayBounds.y - windowBounds.height;
  const y = Math.max(workArea.y, Math.min(desiredY, workArea.y + workArea.height - windowBounds.height));
  window.setPosition(x, y);
}

function createPomoApplication(electron, options) {
  options = options || {};
  const appRoot = options.appRoot || path.join(__dirname, '..');
  const smokeTest = options.smokeTest === true;
  const app = electron.app;
  let quitting = false;
  let tray;
  let window;

  function hideWindow() {
    if (window) {
      window.hide();
    }
  }

  function showWindow() {
    if (!window || !tray) {
      return;
    }
    positionWindow(tray, window, electron.screen);
    window.show();
    window.focus();
  }

  function toggleWindow() {
    if (window && window.isVisible()) {
      hideWindow();
      return;
    }
    showWindow();
  }

  function createWindow() {
    window = new electron.BrowserWindow(createWindowOptions(path.join(appRoot, 'preload.js')));
    window.webContents.setWindowOpenHandler(function () {
      return { action: 'deny' };
    });
    window.webContents.on('will-navigate', function (event) {
      event.preventDefault();
    });
    window.loadFile(path.join(appRoot, 'index.html'));
    window.on('blur', function () {
      if (!window.webContents.isDevToolsOpened()) {
        hideWindow();
      }
    });
    window.on('close', function (event) {
      if (!quitting) {
        event.preventDefault();
        hideWindow();
      }
    });
    if (smokeTest) {
      window.webContents.once('did-finish-load', function () {
        console.log('Pomo Electron smoke test passed.');
        app.quit();
      });
    }
  }

  function createTray() {
    tray = new electron.Tray(path.join(appRoot, 'res', 'pomo.png'));
    tray.setToolTip('Pomo');
    tray.setContextMenu(electron.Menu.buildFromTemplate([
      {
        label: 'About',
        click: function () {
          electron.dialog.showMessageBox({
            title: 'Pomo',
            type: 'info',
            message: 'A pomodoro app in your menubar/tray.',
            buttons: ['Close']
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: function () {
          app.quit();
        }
      }
    ]));
    tray.on('click', toggleWindow);
  }

  electron.ipcMain.on('closeApp', function (event, command) {
    if (!isTrustedIpcSender(event, window)) {
      return false;
    }
    handleCloseApp(app, command);
  });
  electron.ipcMain.handle('openExternal', function (event, url) {
    if (!isTrustedIpcSender(event, window) || !isExternalHttpUrl(url)) {
      return false;
    }
    return Promise.resolve(electron.shell.openExternal(url)).then(function () {
      return true;
    });
  });

  app.on('before-quit', function () {
    quitting = true;
  });
  app.on('activate', showWindow);

  const ready = app.whenReady().then(function () {
    createWindow();
    createTray();
  });

  return {
    ready: ready,
    hideWindow: hideWindow,
    showWindow: showWindow,
    toggleWindow: toggleWindow
  };
}

module.exports = {
  createPomoApplication: createPomoApplication,
  createWindowOptions: createWindowOptions,
  isExternalHttpUrl: isExternalHttpUrl,
  isTrustedIpcSender: isTrustedIpcSender,
  positionWindow: positionWindow
};
