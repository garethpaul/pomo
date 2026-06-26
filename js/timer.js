(function (root) {
    'use strict';

    function assertPositiveIntegerDuration(value, label) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new TypeError(label + ' must be a positive integer');
        }

        return value;
    }

    class Timer {
        constructor(minutes, seconds = 60) {
            this.minutes = assertPositiveIntegerDuration(minutes, 'minutes');
            this.seconds = assertPositiveIntegerDuration(seconds, 'seconds');
            this.initialMinutes = this.minutes;
            this.initialSeconds = this.seconds;
            this.timer = undefined;
            this.pomodoroTime = undefined;
            this.pomodoroIntervalId = undefined;
        }

        startTimer(display, onComplete) {
            if (this.timer === 0) {
                this.minutes = this.initialMinutes;
                this.seconds = this.initialSeconds;
            }

            this._initializePomotime();
            this.timer = this.pomodoroTime;
            clearInterval(this.pomodoroIntervalId);

            this.pomodoroIntervalId = setInterval(() => {
                if (--(this.timer) < 0) {
                    this.timer = this.pomodoroTime;
                }

                this.minutes = parseInt(this.timer / 60, 10);
                this.seconds = parseInt(this.timer % 60, 10);

                this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
                this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;

                display.textContent = this.minutes + ":" + this.seconds;

                if (this.minutes == 0 && this.seconds == 0) {
                    this.stopTimer();
                    if (typeof onComplete === 'function') {
                        onComplete();
                    }
                    if (typeof root.notifyUser === 'function') {
                        root.notifyUser();
                    }
                }
            }, 1000);
        }

        stopTimer() {
            clearInterval(this.pomodoroIntervalId);
        }

        resetTimer(selector) {
            this.minutes = this.initialMinutes;
            this.seconds = this.initialSeconds;
            clearInterval(this.pomodoroIntervalId);
            document.querySelector(selector).textContent = `${this._getDoubleDigit(this.initialMinutes)}:00`;
        }

        _getDoubleDigit(number) {
            const filledNumber = '0' + number.toString();
            return filledNumber.length >= 3 ? filledNumber.slice(1, filledNumber.length) : filledNumber;
        }

        _initializePomotime() {
            if (this.minutes == this.initialMinutes && this.seconds == this.initialSeconds) {
                this.pomodoroTime = this.minutes * this.seconds;
            } else {
                this.pomodoroTime = Number(this.minutes) * 60 + Number(this.seconds);
            }
        }
    }

    root.PomoTimer = Timer;

    if (typeof module === 'object' && module.exports) {
        module.exports = Timer;
    }
}(typeof window !== 'undefined' ? window : global));
