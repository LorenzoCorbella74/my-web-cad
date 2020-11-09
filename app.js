const CANVAS_DIMENSIONS = {
    WIDTH: 4000,
    HEIGHT: 3000
}

const pointerStatus = {
    PAN: "PAN",
    SELECT: "SELECT",
    DEFAULT: "DEFAULT"
};

let SNAP_TO_GRID = true;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const mouse = {
    x: 0,
    y: 0,
    event: null
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawAll();
}

function drawPointer() {
    // TODO: distinguere il cursore in funzione dell'operazione
    ctx.strokeStyle = "rgb(0,103,28)"; // green
    ctx.strokeRect(mouse.x - 4.5, mouse.y - 5.5, 10, 10);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(mouse.x, 0);
    ctx.lineTo(mouse.x, CANVAS_DIMENSIONS.HEIGHT);
    ctx.moveTo(0, mouse.y);
    ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, mouse.y);
    ctx.stroke();
    ctx.fillStyle = "grey";
    ctx.fillText(`x: ${mouse.x} - y: ${mouse.y}`, mouse.x + 10, mouse.y + 10)
    ctx.closePath();
}

function drawCanvas() {
    ctx.fillStyle = "rgb(31,40,49)";
    ctx.fillRect(0, 0, CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT);
    // colonne
    for (let i = 0; i < CANVAS_DIMENSIONS.WIDTH; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i + 0.5, 0);
        ctx.lineTo(i + 0.5, CANVAS_DIMENSIONS.HEIGHT);
        if (i % 100 === 0) {
            ctx.strokeStyle = "rgb(48,55,71)";
        } else {
            ctx.strokeStyle = "rgb(36,45,56)";
        }
        ctx.lineWidth = 0.5;
        ctx.closePath()
        ctx.stroke();
        if (i % 100 === 0) {
            ctx.font = "11px Arial";
            ctx.fillStyle = "grey";
            // ctx.textAlign = "center";
            ctx.fillText(i.toString(), i + 2.5, 10 - netPanningY);
        }
    }
    // righe
    for (let i = 0; i < CANVAS_DIMENSIONS.HEIGHT; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i + 0.5);
        ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, i + 0.5);
        if (i % 100 === 0) {
            ctx.strokeStyle = "rgb(48,55,71)";
        } else {
            ctx.strokeStyle = "rgb(36,45,56)";
        }
        ctx.lineWidth = 0.5;
        ctx.closePath()
        ctx.stroke();
        if (i % 100 === 0) {
            ctx.font = "11px Arial";
            ctx.fillStyle = "grey";
            // ctx.textAlign = "center";
            ctx.fillText(i.toString(), 2.5 - netPanningX, i - 2.5);
        }
    }
}

// mouse drag related variables
var isDown = false;
var startX, startY;

// the accumulated horizontal(X) & vertical(Y) panning the user has done in total
var netPanningX = 0;
var netPanningY = 0;

function begin() {
    ctx.save();
    applyScale();
    applyTranslation();
}

function end() {
    ctx.restore();
}

function applyScale() {
    ctx.scale(1, 1 /* this.viewport.scale[0], this.viewport.scale[1] */ );
}

function applyTranslation() {
    let xFixed = netPanningX < 0 ? netPanningX : 0; // TODO: FIX estremo dx
    let yFixed = netPanningY < 0 ? netPanningY : 0
    ctx.translate(xFixed, yFixed);
}

function drawAll() {
    // ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT
    begin()
    drawCanvas();
    drawPointer();
    end()
}

function loop() {
    drawAll();
    requestAnimationFrame(() => {
        loop()
    });
}

function afterDragging(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // clear the isDragging flag
    isDown = false;
}

window.onload = function () {

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    canvas.addEventListener('mousemove', (e) => {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        let x = parseInt(event.clientX);
        let y = parseInt(event.clientY);

        if (SNAP_TO_GRID) {
            let restoH = x % 20;
            if (restoH >= 20) {
                x = x - restoH + 20
            } else {
                x -= restoH;
            }
            let restoV = y % 20;
            if (restoV >= 20) {
                y = y - restoV + 20
            } else {
                y -= restoV;
            }
        }
        // only do this code if the mouse is being dragged
        if (isDown) {
            // dx & dy are the distance the mouse has moved since the last mousemove event
            var dx = mouse.x - startX;
            var dy = mouse.y - startY;

            // reset the vars for next mousemove
            startX = mouse.x;
            startY = mouse.y;

            // accumulate the net panning done
            netPanningX += dx;
            netPanningY += dy;
            console.clear()
            console.log(`Net change in panning: x:${netPanningX}px, y:${netPanningY}px`);
        }
        mouse.x = x;
        mouse.y = y;
        mouse.event = event;

    }, false);

    canvas.addEventListener('mousedown', function (e) {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        // calc the starting mouse X,Y for the drag
        startX = parseInt(e.clientX);
        startY = parseInt(e.clientY);

        console.log(startX, startY);

        // set the isDragging flag
        isDown = true;
    }, false);

    canvas.addEventListener('mouseup', afterDragging, false);
    canvas.addEventListener('mouseout', afterDragging, false);

    resizeCanvas();
    loop()
};