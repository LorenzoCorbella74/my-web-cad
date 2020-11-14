import KeyboardEvents from './keyboards_events';
import { CANVAS_DIMENSIONS, OPERATIONS } from './constants';

window.onload = () => {
    const cad = new WebCAD();
    document.getElementById('canvas').replaceWith(cad.canvas);
    cad.start();
    window.cad = cad;
}

export class WebCAD {

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext('2d');
        this.keys = new KeyboardEvents();

        this.commands = {
            'PAN': {},
            'SELECT': {}
        }
        this.currentCommand = OPERATIONS.SELECT

        this.mouse = {
            x: 0,
            y: 0,
            event: null
        };

        // this.mouse drag related variables
        this.isDown = false;
        this.startX, this.startY;

        // the accumulated horizontal(X) & vertical(Y) panning the user has done in total
        this.netPanningX = 0;
        this.netPanningY = 0;

        this.startListening()
        this.resizeCanvas()
    }

    resizeCanvas () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.cursor = "none"
        this.drawAll();
    }

    startListening () {
        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);

        this.canvas.addEventListener('mousemove', (e) => {
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();

            let x = parseInt(e.clientX);
            let y = parseInt(e.clientY);

            if (this.keys.hasSnap) {
                let restoH = x % this.keys.currentSnap;
                if (restoH >= this.keys.currentSnap) {
                    x = x - restoH + this.keys.currentSnap
                } else {
                    x -= restoH;
                }
                let restoV = y % this.keys.currentSnap;
                if (restoV >= this.keys.currentSnap) {
                    y = y - restoV + this.keys.currentSnap
                } else {
                    y -= restoV;
                }
            }
            // only do this code if the this.mouse is being dragged
            if (this.isDown) {
                // dx & dy are the distance the this.mouse has moved since the last this.mousemove event
                var dx = x - this.startX;
                var dy = y - this.startY;

                // reset the vars for next this.mousemove
                this.startX = x;
                this.startY = y;

                // accumulate the net panning done
                this.netPanningX += dx;
                this.netPanningY += dy;
                console.clear()
                console.log(`Net change in panning: x:${this.netPanningX}px, y:${this.netPanningY}px`);
            }
            this.mouse.x = x;
            this.mouse.y = y;
            this.mouse.event = event;

        }, false);

        this.canvas.addEventListener('mousedown', (e) => {
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();

            let x = parseInt(e.clientX);
            let y = parseInt(e.clientY);

            if (this.keys.hasSnap) {
                let restoH = x % this.keys.currentSnap;
                if (restoH >= this.keys.currentSnap) {
                    x = x - restoH + this.keys.currentSnap
                } else {
                    x -= restoH;
                }
                let restoV = y % this.keys.currentSnap;
                if (restoV >= this.keys.currentSnap) {
                    y = y - restoV + this.keys.currentSnap
                } else {
                    y -= restoV;
                }
            }

            // calc the starting this.mouse X,Y for the drag
            this.startX = x;
            this.startY = y;

            // set the isDragging flag
            this.isDown = true;
        }, false);

        this.canvas.addEventListener('mouseup', this.afterAll.bind(this), false);
        this.canvas.addEventListener('mouseout', this.afterAll.bind(this), false);
    }

    loop () {
        this.drawAll();
        requestAnimationFrame(() => {
            this.loop()
        });
    }

    start () {
        this.loop();
    }

    /* --------------------------------------------------------- */

    afterAll (e) {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // clear the isDragging flag
        this.isDown = false;
    }

    drawPointer () {
        this.ctx.strokeStyle = "rgb(0,103,28)"; // green
        this.ctx.strokeRect(this.mouse.x - 4.5 - this.netPanningX, this.mouse.y - 5.5 - this.netPanningY, 10, 10);
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouse.x - this.netPanningX, 0);
        this.ctx.lineTo(this.mouse.x - this.netPanningX, CANVAS_DIMENSIONS.HEIGHT);
        this.ctx.moveTo(0, this.mouse.y - this.netPanningY);
        this.ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, this.mouse.y - this.netPanningY);
        this.ctx.stroke();
        this.ctx.fillStyle = "grey";
        this.ctx.fillText(`${this.keys.choosenCommand.toUpperCase()}`, this.mouse.x + 12.5 - this.netPanningX, this.mouse.y - 4.5 - this.netPanningY)
        this.ctx.fillText(`x: ${this.mouse.x - this.netPanningX} - y: ${this.mouse.y - this.netPanningY}`, this.mouse.x + 12.5 - this.netPanningX, this.mouse.y + 12.5 - this.netPanningY)
        this.ctx.closePath();
    }

    drawCanvas () {
        this.ctx.fillStyle = "rgb(31,40,49)";
        this.ctx.fillRect(0, 0, CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT);
        // colonne
        for (let i = 0; i < CANVAS_DIMENSIONS.WIDTH; i += this.keys.currentSnap) {
            if (this.keys.hasSnap) {
                this.ctx.beginPath();
                this.ctx.moveTo(i + 0.5, 0);
                this.ctx.lineTo(i + 0.5, CANVAS_DIMENSIONS.HEIGHT);
                if (i % 100 === 0) {
                    this.ctx.strokeStyle = "rgb(48,55,71)";
                } else {
                    this.ctx.strokeStyle = "rgb(36,45,56)";
                }
                this.ctx.lineWidth = 0.5;
                this.ctx.closePath()
                this.ctx.stroke();
            }
            if (i % 100 === 0) {
                this.ctx.font = "11px Arial";
                this.ctx.fillStyle = "grey";
                // this.ctx.textAlign = "center";
                this.ctx.fillText(i.toString(), i + 2.5, 10 - (this.netPanningY > 0 ? 0 : this.netPanningY));
            }
        }
        // righe
        for (let i = 0; i < CANVAS_DIMENSIONS.HEIGHT; i += this.keys.currentSnap) {
            if (this.keys.hasSnap) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, i + 0.5);
                this.ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, i + 0.5);
                if (i % 100 === 0) {
                    this.ctx.strokeStyle = "rgb(48,55,71)";
                } else {
                    this.ctx.strokeStyle = "rgb(36,45,56)";
                }
                this.ctx.lineWidth = 0.5;
                this.ctx.closePath()
                this.ctx.stroke();
            }
            if (i % 100 === 0) {
                this.ctx.font = "11px Arial";
                this.ctx.fillStyle = "grey";
                // this.ctx.textAlign = "center";
                this.ctx.fillText(i.toString(), 2.5 - (this.netPanningX > 0 ? 0 : this.netPanningX), i - 2.5);
            }
        }
    }

    drawAll () {
        // this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT
        this.ctx.save();
        this.ctx.scale(1, 1 /* this.viewport.scale[0], this.viewport.scale[1] */); // apply scale
        this.ctx.translate(this.netPanningX, this.netPanningY); // apply translation
        this.drawCanvas();
        this.drawPointer();
        this.ctx.restore();
    }

}



