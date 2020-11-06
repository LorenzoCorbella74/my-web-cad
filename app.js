const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let windowWidth = 0;
let windowHeight = 0;

const footer = document.getElementById('footer');

const pointerStatus = {
    PAN: "PAN",
    SELECT: "SELECT",
    DEFAULT: "DEFAULT"
};

let SNAP_TO_GRID = true;

const captureMouse = function (element) {
    var mouse = { x: 0, y: 0, event: null },
        body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;

    element.addEventListener('mousemove', function (event) {
        var x, y;

        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + body_scrollLeft + element_scrollLeft;
            y = event.clientY + body_scrollTop + element_scrollTop;
        }
        x -= offsetLeft;
        y -= offsetTop;

        if (SNAP_TO_GRID) {
            let restoH = x % 20;
            if (restoH > 10) {
                x - restoH + 10
            } else {
                x -= restoH;
            }
            let restoV = y % 20;
            if (restoV > 10) {
                y - restoV + 10
            } else {
                y -= restoV;
            }
        }

        mouse.x = x;
        mouse.y = y;
        mouse.event = event;
    }, false);

    return mouse;
};

let mouse = captureMouse(canvas);

function resizeCanvas () {
    canvas.width = window.innerWidth * 0.8;     // 20% is the sidebar
    canvas.height = window.innerHeight - 34;    // footer height
    windowWidth = canvas.width;
    windowHeight = canvas.height;
    draw();
}

function draw () {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCanvas();
    drawPointer();
}

function drawPointer () {
    // TODO: distinguere il cursore i funzione dell'operazione
    ctx.strokeStyle = "rgb(0,103,28)";    // green
    ctx.strokeRect(mouse.x - 4.5, mouse.y - 5.5, 10, 10);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(mouse.x, 0);
    ctx.lineTo(mouse.x, windowHeight);
    ctx.moveTo(0, mouse.y);
    ctx.lineTo(windowWidth, mouse.y);
    ctx.closePath();
    ctx.stroke();
}

function drawCanvas () {
    ctx.fillStyle = "rgb(31,40,49)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // colonne
    for (i = 0; i < windowWidth; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i + 0.5, 0);
        ctx.lineTo(i + 0.5, windowHeight);
        if (i % 100 === 0) {
            ctx.strokeStyle = "rgb(48,55,71)";
        } else {
            ctx.strokeStyle = "rgb(36,45,56)";
        }
        ctx.lineWidth = 0.5;
        ctx.closePath()
        ctx.stroke();
    }
    // righe
    for (i = windowHeight; i > 0; i -= 20) {
        ctx.beginPath();
        ctx.moveTo(0, i + 0.5);
        ctx.lineTo(windowWidth, i + 0.5);
        if ((windowHeight - i) % 100 === 0) {
            ctx.strokeStyle = "rgb(48,55,71)";
        } else {
            ctx.strokeStyle = "rgb(36,45,56)";
        }
        ctx.lineWidth = 0.5;
        ctx.closePath()
        ctx.stroke();
    }
}

window.onload = function () {

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    canvas.addEventListener('mousemove', function () {
        footer.textContent = `> x: ${mouse.x} - y: ${mouse.y}`;
        draw();
    }, false);

    resizeCanvas();
};

