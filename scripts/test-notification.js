'use strict';

const assert = require('node:assert/strict');

const {
  ensureNotificationPermission,
  notifyUser
} = require('../js/notification');

let alertMessage;
assert.equal(
  ensureNotificationPermission(undefined, message => {
    alertMessage = message;
  }),
  false
);
assert.equal(
  alertMessage,
  'Desktop notifications not available in your browser. Try Chromium.'
);
assert.equal(notifyUser(undefined), undefined);

let requestedPermission = false;
const permissionPromptNotification = {
  permission: 'default',
  requestPermission() {
    requestedPermission = true;
  }
};

assert.equal(
  ensureNotificationPermission(permissionPromptNotification),
  false
);
assert.equal(requestedPermission, true);

let constructedNotification;
function GrantedNotification(title, options) {
  constructedNotification = {
    title,
    options
  };
  return constructedNotification;
}
GrantedNotification.permission = 'granted';
GrantedNotification.requestPermission = () => {
  throw new Error('requestPermission should not be called when granted');
};

assert.equal(ensureNotificationPermission(GrantedNotification), true);

const notification = notifyUser(GrantedNotification);
assert.equal(notification.title, 'Wow! Time\'s up');
assert.deepEqual(notification.options, {
  icon: 'res/big_pomo.png',
  body: "Hey there! You've been notified!"
});
assert.equal(typeof notification.onclose, 'function');
assert.equal(notification, constructedNotification);

let notifyPermissionRequested = false;
const deniedNotification = {
  permission: 'denied',
  requestPermission() {
    notifyPermissionRequested = true;
  }
};

assert.equal(notifyUser(deniedNotification), undefined);
assert.equal(notifyPermissionRequested, true);
