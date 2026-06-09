'use strict';
const shell = require('electron').shell;
const Timer = window.PomoTimer;

var display = document.querySelector('#time');
var display_short = document.querySelector('#time_short');
var display_long = document.querySelector('#time_long');

function isExternalHttpUrl(url) {
    return /^https?:\/\//i.test(url);
}

$(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault();

    if (isExternalHttpUrl(this.href)) {
        shell.openExternal(this.href);
    }
});


let normalTimer = new Timer(25);

$('#start').click(() => {

    normalTimer.startTimer(display);
    $('#stop').show();
    $('#start').hide();
})

$('#stop').click(() => {
    normalTimer.stopTimer();
    $('#start').show();
    $('#stop').hide();
});

$('#reset').click(() => {
    normalTimer.resetTimer('#time');

    $('#start').show();
    $('#stop').hide();
});

let shortTimer = new Timer(5);

$('#short_start').click(() => {
    shortTimer.startTimer(display_short);
    $('#short_stop').show();
    $('#short_start').hide();
})

$('#short_stop').click(() => {
    shortTimer.stopTimer();

    $('#short_start').show();
    $('#short_stop').hide();
});

$('#short_reset').click(() => {
    shortTimer.resetTimer('#time_short');

    $('#short_start').show();
    $('#short_stop').hide();
});

let longTimer = new Timer(10);

$('#long_start').click(() => {
    longTimer.startTimer(display_long);

    $('#long_stop').show();
    $('#long_start').hide();
})

$('#long_stop').click(() => {
    longTimer.stopTimer();
    $('#long_start').show();
    $('#long_stop').hide();
});

$('#long_reset').click(() => {
    longTimer.resetTimer('#time_long');

    $('#long_start').show();
    $('#long_stop').hide();
});


function closeApp() {
    ipc.send('closeApp', 'close');
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    let activeTab = e.target.toString();
    let nameActiveTab = activeTab.split('#');

    if (nameActiveTab[1] == 'pomodoro') {
        normalTimer.resetTimer('#time');
    }
    else if (nameActiveTab[1] == 'short') {
        shortTimer.resetTimer('#time_short');
    }
    else if (nameActiveTab[1] == 'long') {
        longTimer.resetTimer('#time_long');
    }
})
