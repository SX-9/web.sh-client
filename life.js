const run = () => {
    let host = document.getElementById('host').value;
    let pass = document.getElementById('pass').value;
    
    let cmd = document.getElementById('cmd').value.split(' ');
    let exec = cmd[0];
    let args = cmd.slice(1);

    console.log(cmd, exec, args)

    fetch(`http://${host}:6942/run?pass=${pass}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            exec: exec, args: args
        })
    }).then(res => res.json()).then(data => {
        alert(data.message);
        document.getElementById('out').innerText = data.output;
    });
}

document.getElementById('run').onclick = run;
window.onkeypress = (e) => {
    if (e.key === 'Enter') run();
}