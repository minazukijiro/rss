let refresh_interval = 30 * 60 * 1000;
let check_interval = 60 * 1000;
let time = new Date().getTime();

onmousemove = () => { time = new Date().getTime(); };
onclick = () => { time = new Date().getTime(); };

refresh = () => {
  if (new Date().getTime() - time >= refresh_interval)
    window.location.reload(true);
  else
    setTimeout(refresh, check_interval);
};

setTimeout(refresh, check_interval);
