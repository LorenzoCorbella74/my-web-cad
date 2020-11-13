import KeyboardEvents from './keyboards_events';
import { CANVAS_DIMENSIONS } from './constants';


let keys = {};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const mouse = {
    x: 0,
    y: 0,
    event: null
};

// mouse drag related variables
let isDown = false;
let startX, startY;

// the accumulated horizontal(X) & vertical(Y) panning the user has done in total
let netPanningX = 0;
let netPanningY = 0;

function resizeCanvas () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cursor = "none"
    drawAll();
}

function drawPointer () {
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
    ctx.fillText(`${keys.currentCommand.toUpperCase()}`, mouse.x + 12.5 - netPanningX, mouse.y - 4.5 - netPanningY)
    ctx.fillText(`x: ${mouse.x - netPanningX} - y: ${mouse.y - netPanningY}`, mouse.x + 12.5 - netPanningX, mouse.y + 12.5 - netPanningY)
    ctx.closePath();
}

function drawCanvas () {
    ctx.fillStyle = "rgb(31,40,49)";
    ctx.fillRect(0, 0, CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT);
    // colonne
    for (let i = 0; i < CANVAS_DIMENSIONS.WIDTH; i += keys.currentSnap) {
        if (keys.hasSnap) {
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
            ctx.fillText(i.toString(), i + 2.5, 10 - (netPanningY > 0 ? 0 : netPanningY));
        }
    }
    // righe
    for (let i = 0; i < CANVAS_DIMENSIONS.HEIGHT; i += keys.currentSnap) {
        if (keys.hasSnap) {
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
            ctx.fillText(i.toString(), 2.5 - (netPanningX > 0 ? 0 : netPanningX), i - 2.5);
        }
    }
}

function drawAll () {
    // ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height); // CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT
    ctx.save();
    ctx.scale(1, 1 /* this.viewport.scale[0], this.viewport.scale[1] */); // apply scale
    ctx.translate(netPanningX, netPanningY); // apply translation
    drawCanvas();
    drawPointer();
    ctx.restore();
    console.log(keys);
}

function loop () {
    drawAll();
    requestAnimationFrame(() => {
        loop()
    });
}

function afterAll (e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    // clear the isDragging flag
    isDown = false;
}

window.onload = function () {

    keys = new KeyboardEvents()

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    canvas.addEventListener('mousemove', (e) => {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        let x = parseInt(e.clientX);
        let y = parseInt(e.clientY);

        if (keys.hasSnap) {
            let restoH = x % keys.currentSnap;
            if (restoH >= keys.currentSnap) {
                x = x - restoH + keys.currentSnap
            } else {
                x -= restoH;
            }
            let restoV = y % keys.currentSnap;
            if (restoV >= keys.currentSnap) {
                y = y - restoV + keys.currentSnap
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

        if (keys.hasSnap) {
            let restoH = x % keys.currentSnap;
            if (restoH >= keys.currentSnap) {
                x = x - restoH + keys.currentSnap
            } else {
                x -= restoH;
            }
            let restoV = y % keys.currentSnap;
            if (restoV >= keys.currentSnap) {
                y = y - restoV + keys.currentSnap
            } else {
                y -= restoV;
            }
        }

        // calc the starting mouse X,Y for the drag
        startX = x;
        startY = y;

        // set the isDragging flag
        isDown = true;
    }, false);

    canvas.addEventListener('mouseup', afterAll, false);
    canvas.addEventListener('mouseout', afterAll, false);

    resizeCanvas();
    loop()
};