'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomoDesktop', Object.freeze({
  close: function () {
    ipcRenderer.send('closeApp', 'close');
  },
  openExternal: function (url) {
    if (typeof url !== 'string') {
      return Promise.resolve(false);
    }
    return ipcRenderer.invoke('openExternal', url);
  }
}));
