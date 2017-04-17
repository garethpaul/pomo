var ipc = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', function () {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyUser() {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Wow! Time\'s up', {
      icon: 'res/big_pomo.png',
      body: "Hey there! You've been notified!"
    });

    notification.onclose = function(){
      //notiSound.pause();
    }
  }
}
