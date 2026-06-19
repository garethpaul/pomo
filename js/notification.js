function requestNotificationPermissionIfDefault(NotificationApi) {
  if (NotificationApi.permission !== 'default') {
    return false;
  }

  try {
    var permissionRequest = NotificationApi.requestPermission();
    if (permissionRequest && typeof permissionRequest.then === 'function') {
      Promise.resolve(permissionRequest).catch(function () {});
    }
    return true;
  } catch (error) {
    return false;
  }
}

function ensureNotificationPermission(NotificationApi, alertUser) {
  if (!NotificationApi) {
    if (typeof alertUser === 'function') {
      alertUser('Desktop notifications not available in your browser. Try Chromium.');
    }
    return false;
  }

  if (NotificationApi.permission === 'granted') {
    return true;
  }

  requestNotificationPermissionIfDefault(NotificationApi);
  return false;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    /* global Notification, alert */
    var notificationApi = typeof Notification !== 'undefined' ? Notification : undefined;
    var alertUser = typeof alert === 'function' ? alert : undefined;
    ensureNotificationPermission(notificationApi, alertUser);
  });
}

function notifyUser(NotificationApi) {
  var notificationApi = NotificationApi || (typeof Notification !== 'undefined' ? Notification : undefined);

  if (!notificationApi) {
    if (typeof alert === 'function') {
      alert('Desktop notifications not available in your browser. Try Chromium.');
    }
    return;
  }

  if (notificationApi.permission !== 'granted') {
    requestNotificationPermissionIfDefault(notificationApi);
    return;
  }

  var notification = new notificationApi('Wow! Time\'s up', {
    icon: 'res/big_pomo.png',
    body: "Hey there! You've been notified!"
  });

  notification.onclose = function(){
    //notiSound.pause();
  }

  return notification;
}

if (typeof window !== 'undefined') {
  window.notifyUser = notifyUser;
}

if (typeof module === 'object' && module.exports) {
  module.exports = {
    ensureNotificationPermission: ensureNotificationPermission,
    requestNotificationPermissionIfDefault: requestNotificationPermissionIfDefault,
    notifyUser: notifyUser
  };
}
