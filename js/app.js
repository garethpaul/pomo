'use strict';
const Timer = window.PomoTimer;
const desktop = window.pomoDesktop || {
    close: function () {},
    openExternal: function () { return Promise.resolve(false); }
};

var display = document.querySelector('#time');
var display_short = document.querySelector('#time_short');
var display_long = document.querySelector('#time_long');

function isExternalHttpUrl(url) {
    return /^https?:\/\//i.test(url);
}

$(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault();

    if (isExternalHttpUrl(this.href)) {
        desktop.openExternal(this.href);
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
    desktop.close();
}

$('#close_app').click(closeApp);

const timerTabs = {
    pomodoro: {
        timer: normalTimer,
        display: '#time',
        start: '#start',
        stop: '#stop'
    },
    short: {
        timer: shortTimer,
        display: '#time_short',
        start: '#short_start',
        stop: '#short_stop'
    },
    long: {
        timer: longTimer,
        display: '#time_long',
        start: '#long_start',
        stop: '#long_stop'
    }
};
const timers = [normalTimer, shortTimer, longTimer];

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    let activeTab = e.target.toString();
    let nameActiveTab = activeTab.split('#');
    const activeTimerTab = timerTabs[nameActiveTab[1]];

    if (!activeTimerTab) {
        return;
    }

    timers.forEach(timer => {
        if (timer !== activeTimerTab.timer) {
            timer.stopTimer();
        }
    });
    activeTimerTab.timer.resetTimer(activeTimerTab.display);
    $(activeTimerTab.start).show();
    $(activeTimerTab.stop).hide();
})
