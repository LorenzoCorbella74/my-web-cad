import KeyboardEvents from './keyboards_events';
import { CANVAS_DIMENSIONS, OPERATIONS } from './constants';

// commands
import PanCommand from './commands/select';
import SelectCommand from './commands/pan';

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
            'PAN': new PanCommand(this),
            'SELECT': new SelectCommand(this)
        }
        // DEFAULT
        this.currentCommand = this.commands[OPERATIONS.SELECT]

        this.mouse = {
            x: 0,
            y: 0,
            event: null
        };

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

        this.canvas.addEventListener('mousemove', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mousedown', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mouseup', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mouseout', this.globalHandler.bind(this), false);
    }

    globalHandler (ev) {
        this.currentCommand = this.commands[this.keys.choosenCommand]
        ev._x = parseInt(ev.clientX);
        ev._y = parseInt(ev.clientY);
        var func = this.currentCommand[ev.type].bind(this.currentCommand);
        if (func) {
            func(ev);
        }
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



