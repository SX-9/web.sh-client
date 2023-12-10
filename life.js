/**
 * Returns the first element that matches the specified selector.
 *
 * @param {string} el - The selector to match.
 * @returns {Element} - The first element that matches the selector, or null if no matches found.
 */
const $ = (el) => document.querySelector(el);
const { host, pass, cmds } = localStorage;
let saved = cmds ? JSON.parse(cmds) : [];
let fs = false;
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  $('#install').style.display = 'inline-block';
  deferredPrompt = e;
});

function run(cmd, stdin) {
  $("#out").innerText = "Loading...";
  fetch(`http://${host}:6942/run?pass=${pass}&stdin=${stdin}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd.split(" ")),
  })
    .then((res) => res.json())
    .then((data) => {
      $("#out").innerText = data.output || data.error || data.message;
    });
}

function create(cmd, name, stdin) {
  added = cmd.split(" ");
  saved.push({ cmd: added, name, stdin });
  localStorage.setItem("cmds", JSON.stringify(saved));
  init(saved);
}

function init(cmds) {
  location.protocol !== "https:" ? location.protocol = "https:" : null;
  
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((worker) => {
        worker.active?.postMessage("cache");
      })
      .catch(console.error);
  }

  if (!host || !pass) $("#info").showModal();
  $("#info").onsubmit = (e) => {
    localStorage.setItem("host", $("#host").value);
    localStorage.setItem("pass", $("#pass").value);
  };

  $("#host").value = host;
  $("#pass").value = pass;
  $("div#btns").innerHTML = "";

  cmds.forEach((cmd) => {
    const el = document.createElement("button");
    el.innerText = cmd.name;
    el.onclick = () => run(cmd.cmd, cmd.stdin);
    el.ondblclick = () => del(cmd.name);
    $("div#btns").appendChild(el);
  });
}

function del(name) {
  if (fs) return;
  localStorage.setItem(
    "cmds",
    JSON.stringify(saved.filter((obj) => obj.name !== name))
  );``
  location.reload();
}

async function install() {
  if (deferredPrompt !== null) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
    }
  }
}

function fullscreen() {
  let el = $('div#grp');
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
  fs = true;
  el.classList.add('big');
  $('#outs').removeAttribute('open');
}

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) return;
  fs = false;
  $('div#grp').classList.remove('big');
});

init(saved);
