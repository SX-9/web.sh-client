const $ = (el) => document.querySelector(el);
const { host, pass, cmds } = localStorage;
let saved = cmds ? JSON.parse(cmds) : [];

function run(cmd) {
	$('#out').innerText = 'Loading...';
  fetch(`http://${host}:6942/run?pass=${pass}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  })
    .then((res) => res.json())
    .then((data) => {
      $("#out").innerText = data.output || data.message;
    });
}

function create(cmd, name) {
  added = cmd.split(" ");
  saved.push({ cmd: added, name });
  localStorage.setItem("cmds", JSON.stringify(saved));
  init(saved);
}

function init(cmds) {
  $("div").innerHTML = "";
  cmds.forEach((cmd) => {
    const el = document.createElement("button");
    el.innerText = cmd.name;
    el.onclick = () => run(cmd.cmd);
		el.oncontextmenu = () => del(cmd.name)
    $("div").appendChild(el);
  });
}

function del(name) {
	localStorage.setItem('cmds', JSON.stringify(saved.filter(obj => obj.name !== name)));
	location.reload();
}

if (!host || !pass) $("#info").showModal();
$("#info").onsubmit = (e) => {
  localStorage.setItem("host", $("#host").value);
  localStorage.setItem("pass", $("#pass").value);
};

$("#host").value = host;
$("#pass").value = pass;
init(saved);
