const SNAP_GRID = {
    'XS': 10,
    'S': 20,
    'M': 25,
    'L': 50
};
let CURRENT_SNAP = SNAP_GRID.M;
let SNAP_TO_GRID = true;

const operation = {
    // view
    PAN: "PAN",
    ZOOM: "ZOOM",
    SELECT: "SELECT",
    DELETE: "DELETE",
    // MODIFICA
    MOVE: 'MOVE',
    ROTATE: "ROTATE",
    PULL: "PULL",
    SCALE: 'SCALE',
    COPY: 'COPY',
    // SHAPES
    LINE: 'LINE',
    RECT: 'RECT',
    CIRCLE: 'CIRCLE',
    ARC: 'ARC',
    // STYLE
    FILL: 'FILL'
};
let currentCommand = operation.SELECT

// https://css-tricks.com/snippets/javascript/javascript-keycodes/
function KeyboardEvents() {

    document.onkeyup = function (e) {
        if (e.key == 'Escape' || e.key == 's') {
            currentCommand = operation.SELECT;
        } else if (e.key == 'd') {
            currentCommand = operation.DELETE;
        } else if (e.key == 'c') {
            currentCommand = operation.COPY;
        } else if (e.key == 'm') {
            currentCommand = operation.MOVE;
        } else if (e.key == 'r') {
            currentCommand = operation.ROTATE;
        } else if (e.key == 'p') {
            currentCommand = operation.PULL;
        } else if (e.key == 's') {
            currentCommand = operation.SCALE;
        } else if (e.key == 'l') {
            currentCommand = operation.LINE;
        } else if (e.key == 'q') {
            currentCommand = operation.RECT;
        } else if (e.key == 'o') {
            currentCommand = operation.CIRCLE;
        } else if (e.key == 'a') {
            currentCommand = operation.ARC;
        } else if (e.key == 'f') {
            currentCommand = operation.FILL;
        } else if (e.key == 0) {
            SNAP_TO_GRID = false;
        } else if (e.key == "1") {
            SNAP_TO_GRID = true;
            CURRENT_SNAP = SNAP_GRID.L
        } else if (e.key == "2") {
            SNAP_TO_GRID = true;
            CURRENT_SNAP = SNAP_GRID.M
        } else if (e.key == "3") {
            SNAP_TO_GRID = true;
            CURRENT_SNAP = SNAP_GRID.S
        } else if (e.key == "4") {
            SNAP_TO_GRID = true;
            CURRENT_SNAP = SNAP_GRID.XS
        } else if (e.ctrlKey && e.key == 'z') {
            alert("Ctrl + Z shortcut combination was pressed");
        } else if (e.ctrlKey && e.key == 'y') {
            alert("Ctrl + Y shortcut combination was pressed");
        }
    };
}

const CANVAS_DIMENSIONS = {
    WIDTH: 4000,
    HEIGHT: 3000
}

const canvas = document.getElementById("canvas");
canvas.style.cursor = "none"
const ctx = canvas.getContext('2d');
const mouse = {
    x: 0,
    y: 0,
    event: null
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cursor = "none"
    drawAll();
}

function drawPointer() {
    ctx.strokeStyle = "rgb(0,103,28)"; // green
    ctx.strokeRect(mouse.x - 4.5 - netPanningX, mouse.y - 5.5 - netPanningY, 10, 10);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(mouse.x - netPanningX, 0);
    ctx.lineTo(mouse.x - netPanningX, CANVAS_DIMENSIONS.HEIGHT);
    ctx.moveTo(0, mouse.y - netPanningY);
    ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, mouse.y - netPanningY);
    ctx.stroke();
    ctx.fillStyle = "grey";
    ctx.fillText(`${currentCommand.toUpperCase()}`, mouse.x + 12.5 - netPanningX, mouse.y - 2.5 - netPanningY)
    ctx.fillText(`x: ${mouse.x - netPanningX} - y: ${mouse.y - netPanningY}`, mouse.x + 12.5 - netPanningX, mouse.y + 12.5 - netPanningY)
    ctx.closePath();
}

function drawCanvas() {
    ctx.fillStyle = "rgb(31,40,49)";
    ctx.fillRect(0, 0, CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT);
    // colonne
    for (let i = 0; i < CANVAS_DIMENSIONS.WIDTH; i += CURRENT_SNAP) {
        if (SNAP_TO_GRID) {
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
        }
        if (i % 100 === 0) {
            ctx.font = "11px Arial";
            ctx.fillStyle = "grey";
            // ctx.textAlign = "center";
            ctx.fillText(i.toString(), i + 2.5, 10 - (netPanningY > 0 ? 0 : netPanningY)); // TODO: fix se netPanningX >0
        }
    }
    // righe
    for (let i = 0; i < CANVAS_DIMENSIONS.HEIGHT; i += CURRENT_SNAP) {
        if (SNAP_TO_GRID) {
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
        }
        if (i % 100 === 0) {
            ctx.font = "11px Arial";
            ctx.fillStyle = "grey";
            // ctx.textAlign = "center";
            ctx.fillText(i.toString(), 2.5 - (netPanningX > 0 ? 0 : netPanningX), i - 2.5); // TODO: fix se netPanningX >0
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
    ctx.scale(1, 1 /* this.viewport.scale[0], this.viewport.scale[1] */);
}

function applyTranslation() {
    /* let xFixed = netPanningX < 0 ? netPanningX : 0; // TODO: FIX estremo dx
    let yFixed = netPanningY < 0 ? netPanningY : 0
    ctx.translate(xFixed, yFixed); */
    ctx.translate(netPanningX, netPanningY);
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

    KeyboardEvents()

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    canvas.addEventListener('mousemove', (e) => {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        let x = parseInt(e.clientX);
        let y = parseInt(e.clientY);

        if (SNAP_TO_GRID) {
            let restoH = x % CURRENT_SNAP;
            if (restoH >= CURRENT_SNAP) {
                x = x - restoH + CURRENT_SNAP
            } else {
                x -= restoH;
            }
            let restoV = y % CURRENT_SNAP;
            if (restoV >= CURRENT_SNAP) {
                y = y - restoV + CURRENT_SNAP
            } else {
                y -= restoV;
            }
        }
        // only do this code if the mouse is being dragged
        if (isDown) {
            // dx & dy are the distance the mouse has moved since the last mousemove event
            var dx = x - startX;
            var dy = y - startY;

            // reset the vars for next mousemove
            startX = x;
            startY = y;

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

        let x = parseInt(e.clientX);
        let y = parseInt(e.clientY);

        if (SNAP_TO_GRID) {
            let restoH = x % CURRENT_SNAP;
            if (restoH >= CURRENT_SNAP) {
                x = x - restoH + CURRENT_SNAP
            } else {
                x -= restoH;
            }
            let restoV = y % CURRENT_SNAP;
            if (restoV >= CURRENT_SNAP) {
                y = y - restoV + CURRENT_SNAP
            } else {
                y -= restoV;
            }
        }

        // calc the starting mouse X,Y for the drag
        startX = x;
        startY = y;

        console.log(startX, startY);

        // set the isDragging flag
        isDown = true;
    }, false);

    canvas.addEventListener('mouseup', afterDragging, false);
    canvas.addEventListener('mouseout', afterDragging, false);

    resizeCanvas();
    loop()
};