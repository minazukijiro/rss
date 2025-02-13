let interval = 5 * 60 * 1000;
let time = new Date().getTime();

$(document.body).bind("mousemove keypress", function(e) {
  time = new Date().getTime();
});

function refresh() {
  if(new Date().getTime() - time >= interval) {
    console.log('Refresh');
    window.location.reload(true);
  } else {
    console.og('Reset interval');
    setTimeout(refresh, interval);
  }
}

setTimeout(refresh, interval);
