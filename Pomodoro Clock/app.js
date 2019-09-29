$(document).ready(() => {
  const breakLength = document.querySelector('#break-length');
  const bIncrement = document.querySelector('#break-increment');
  const bDecrement = document.querySelector('#break-decrement');
  const sessionLength = document.querySelector('#session-length');
  const sIncrement = document.querySelector('#session-increment');
  const sDecrement = document.querySelector('#session-decrement');
  const timerLabel = document.querySelector('#timer-label');
  const timeLeft = document.querySelector('#time-left');
  const startStop = document.querySelector('#start_stop');
  const reset = document.querySelector('#reset');
  const alarm = document.querySelector('#beep');


  bIncrement.addEventListener('click', () => {
    if (parseInt(breakLength.textContent) < 60 && parseInt(breakLength.textContent) > 1) {
      breakLength.textContent = parseInt(breakLength.textContent) + 1;
    }
  })

  bDecrement.addEventListener('click', () => {
    if (parseInt(breakLength.textContent) < 60 && parseInt(breakLength.textContent) > 1) {
      breakLength.textContent = parseInt(breakLength.textContent) - 1;
    }
  })

  sIncrement.addEventListener('click', () => {
    if (parseInt(sessionLength.textContent) < 60 && parseInt(sessionLength.textContent) > 1) {
      sessionLength.textContent = parseInt(sessionLength.textContent) + 1;
    }
    displayTimeLeft(parseInt(sessionLength.textContent) * 60);
  })

  sDecrement.addEventListener('click', () => {
    if (parseInt(sessionLength.textContent) < 60 && parseInt(sessionLength.textContent) > 1) {
      sessionLength.textContent = parseInt(sessionLength.textContent) - 1;
    }
    displayTimeLeft(parseInt(sessionLength.textContent) * 60);
  })

  let countdown;
  let hasStarted = false;
  let isPause = false;
  let seconds = 25 * 60;
  let isBreak = true;
  let sessionTime = 0;
  let breakTime = 0;

  function timer() {
    seconds--;
    if (seconds < 0) {
      clearInterval(countdown);
      alarm.currentTime = 0;
      alarm.play();
      seconds = (isBreak ? breakTime : sessionTime) * 60;
      if (isBreak) {
        timerLabel.textContent = 'Break';
      } else {
        timerLabel.textContent = 'Session';
      }
      isBreak = !isBreak;
      countdown = setInterval(timer, 1000);
    }

    displayTimeLeft(seconds);
  }

  function clock(sessionSeconds, breakSeconds) {
    if (!isPause) {
      isPause = true;
      countdown = setInterval(timer, 1000);
    } else {
      isPause = false;
      clearInterval(countdown);
    }
  }

  function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timeLeft.innerHTML = display;
    document.title = display;
  }

  function startClock(sessionTime, breakTime) {
    clock(sessionTime, breakTime);
  }

  startStop.addEventListener('click', () => {
    if (hasStarted) {
      if (timerLabel.textContent == 'Session') {
        sessionTime = parseInt((timeLeft.textContent).split(":")[0]) * 60 + parseInt((timeLeft.textContent).split(":")[1]);
        breakTime = parseInt(breakLength.textContent);

        startClock(sessionTime, breakTime);
      } else if (timerLabel.textContent == 'Break') {
        sessionTime = parseInt(sessionLength.textContent);
        breakTime = parseInt((timeLeft.textContent).split(":")[0]) * 60 + parseInt((timeLeft.textContent).split(":")[1]);

        startClock(sessionTime, breakTime);
      }

    } else {
      hasStarted = true;

      sessionTime = parseInt(sessionLength.textContent);
      breakTime = parseInt(breakLength.textContent);
      seconds = (isBreak ? sessionTime : breakTime) * 60;
      
      startClock(sessionTime, breakTime);
    }
  });

  function resetClock() {
    clearInterval(countdown);
    alarm.pause();
    alarm.src = `https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3`;
    alarm.currentTime = 0;
    timeLeft.textContent = "25:00";
    sessionLength.textContent = 25;
    breakLength.textContent = 5;
    timerLabel.textContent = 'Session';
    seconds = 25 * 60;
    hasStarted = false;
    isPause = false;
    isBreak = true;
  }

  reset.addEventListener('click', resetClock);
});