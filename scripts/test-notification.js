'use strict';

const assert = require('node:assert/strict');

const {
  ensureNotificationPermission,
  requestNotificationPermissionIfDefault,
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
assert.equal(
  requestNotificationPermissionIfDefault(permissionPromptNotification),
  true
);

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

assert.equal(
  ensureNotificationPermission(deniedNotification),
  false
);
assert.equal(notifyUser(deniedNotification), undefined);
assert.equal(
  requestNotificationPermissionIfDefault(deniedNotification),
  false
);
assert.equal(notifyPermissionRequested, false);

let constructionAttempts = 0;
function ThrowingNotification() {
  constructionAttempts += 1;
  throw new Error('notification construction failed');
}
ThrowingNotification.permission = 'granted';
ThrowingNotification.requestPermission = () => {
  throw new Error('requestPermission should not be called when granted');
};

assert.equal(notifyUser(ThrowingNotification), undefined);
assert.equal(constructionAttempts, 1);

async function runPermissionRequestFailureAssertions() {
  let unhandledRejection;
  function captureUnhandledRejection(error) {
    unhandledRejection = error;
  }
  process.once('unhandledRejection', captureUnhandledRejection);

  const rejectedRequest = {
    permission: 'default',
    requestPermission() {
      return Promise.reject(new Error('permission prompt rejected'));
    }
  };

  assert.equal(requestNotificationPermissionIfDefault(rejectedRequest), true);
  await new Promise(resolve => setImmediate(resolve));
  process.removeListener('unhandledRejection', captureUnhandledRejection);
  assert.equal(unhandledRejection, undefined);

  const throwingRequest = {
    permission: 'default',
    requestPermission() {
      throw new Error('permission prompt threw');
    }
  };

  assert.equal(requestNotificationPermissionIfDefault(throwingRequest), false);
}

runPermissionRequestFailureAssertions().catch(error => {
  console.error(error);
  process.exit(1);
});
