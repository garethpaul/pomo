'use strict';

function quitApp(app) {
  if (!app || typeof app.quit !== 'function') {
    return false;
  }

  app.quit();
  return true;
}

function handleCloseApp(app, command) {
  if (command !== 'close') {
    return false;
  }

  return quitApp(app);
}

function createSharedObject(menubarApp) {
  return {
    hide: function () {
      if (menubarApp && typeof menubarApp.hideWindow === 'function') {
        menubarApp.hideWindow();
      }
    },
    quit: function () {
      if (menubarApp && menubarApp.app) {
        quitApp(menubarApp.app);
      }
    },
    pinned: false
  };
}

module.exports = {
  createSharedObject: createSharedObject,
  handleCloseApp: handleCloseApp,
  quitApp: quitApp
};
