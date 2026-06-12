'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomoDesktop', Object.freeze({
  close: function () {
    ipcRenderer.send('closeApp', 'close');
  },
  openExternal: function (url) {
    return ipcRenderer.invoke('openExternal', url);
  }
}));
