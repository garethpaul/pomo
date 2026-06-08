'use strict';
const electron = require('electron');
var menubar = require('menubar');
const {
  createSharedObject,
  handleCloseApp
} = require('./js/main-process');

const ipcMain = require('electron').ipcMain;

var mb = menubar({dir:__dirname, tooltip: "Pomo", icon:__dirname + "/res/pomo.png", width:278, height:250, resizable: false, alwaysOnTop :true});

const contextMenu = electron.Menu.buildFromTemplate([
  {
    label: 'About',
    click() {
      electron.dialog.showMessageBox({title: "Pomo", type:"info", message: "A pomodoro app in your menubar/tray.", buttons: ["Close"] });
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Quit',
    click() {
      mb.app.quit();
    }
  }

]);

ipcMain.on('closeApp', (event, close) => {
  handleCloseApp(mb.app, close);
});

mb.on('ready', function ready () {
  global.sharedObj = createSharedObject(mb);

  console.log('Pomo is ready to serve in the menubar.');

  if (process.platform == 'win32') {
    mb.tray.setContextMenu(contextMenu);
  }
});

mb.on('after-create-window', function(){
  //mb.window.openDevTools()
})
