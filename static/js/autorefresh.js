var inactivityTime = function () {
  var timer;

  window.onload = timerReset;
  document.onkeypress = timerReset;
  document.onmousemove = timerReset;
  document.onmousedown = timerReset;
  document.ontouchstart = timerReset;
  document.onclick = timerReset;
  document.onscroll = timerReset;
  document.onkeypress = timerReset;

  function timerElapsed() {
    console.log('Refresh');
    location.reload();
  }

  function timerReset() {
    console.log('Reset timer');
    clearTimeout(timer);
    timer = setTimeout(timerElapsed, 30 * 60 * 1000); // 5 mins
  }
};
