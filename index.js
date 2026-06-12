'use strict';

const electron = require('electron');
const { createPomoApplication } = require('./js/electron-app');

const smokeTest = process.env.POMO_SMOKE_TEST === '1';
if (smokeTest) {
  electron.app.commandLine.appendSwitch('disable-gpu');
}

createPomoApplication(electron, {
  appRoot: __dirname,
  smokeTest: smokeTest
});
