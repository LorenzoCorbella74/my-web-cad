import KeyboardEvents from './keyboards_events';
import HistoryManagement from './history_management';
import { colorsTable } from './utils';

import { CANVAS_DIMENSIONS, COLORS } from './constants';

// Commands
import PanCommand from './commands/pan';
import ZoomCommand from './commands/zoom';
import SelectCommand from './commands/select';
import DeleteCommand from './commands/delete';
import LineCommand from './commands/line';
import RectCommand from './commands/rect';
import CircleCommand from './commands/circle';
import MoveCommand from './commands/move';

window.onload = () => {
    const cad = new WebCAD();
    document.getElementById('canvas').replaceWith(cad.canvas);
    cad.start();
    window.cad = cad;   // debug
}

export class WebCAD {

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d');

        // ghost canvas for selection
        this.ghostcanvas = document.createElement('canvas');;
        this.gctx = this.ghostcanvas.getContext('2d');
        this.keys = new KeyboardEvents(this);
        this.colorsTable = colorsTable;

        this.commands = {
            'SELECT': new SelectCommand(this),
            'DELETE': new DeleteCommand(this),
            'PAN': new PanCommand(this),
            'ZOOM': new ZoomCommand(this),
            'MOVE': new MoveCommand(this),
            'LINE': new LineCommand(this),
            'RECT': new RectCommand(this),
            'CIRCLE': new CircleCommand(this),
        }

        this.mouse = {
            x: 0,
            y: 0,
            event: null
        };

        this.zoomLevel = 1;

        this.shapes = [];
        this.tempShape = []
        this.HM = new HistoryManagement(this);

        this.startListening()
        this.resizeCanvas()
    }

    resizeCanvas () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ghostcanvas.width = window.innerWidth;
        this.ghostcanvas.height = window.innerHeight;
        this.canvas.style.cursor = "none"
        this.drawAll();
    }

    startListening () {
        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        this.canvas.oncontextmenu = () => false;
        this.canvas.addEventListener('click', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mousemove', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mousedown', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mouseup', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mouseout', this.globalHandler.bind(this), false);
    }

    globalHandler (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        let x = parseInt(ev.clientX);
        let y = parseInt(ev.clientY);

        /* ----------------- SNAP 2 GRID ----------------- */
        if (this.keys.hasSnap && !(this.keys.choosenCommand === 'DELETE' || this.keys.choosenCommand === 'SELECT')) {
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
        ev._x = x;
        ev._y = y;

        this.currentCommand = this.commands[this.keys.choosenCommand]
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

    /* ---------------------------- RENDER ----------------------------- */

    drawPointer () {
        this.ctx.strokeStyle = "rgb(0,103,28)"; // green
        this.ctx.strokeRect(this.mouse.x - 5 - this.netPanningX, this.mouse.y - 5 - this.netPanningY, 10, 10);
        this.ctx.lineWidth = 0.5;
        this.ctx.setLineDash([this.keys.currentSnap, this.keys.currentSnap]);   // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouse.x - this.netPanningX, 0);
        this.ctx.lineTo(this.mouse.x - this.netPanningX, this.mouse.y - 5 - this.netPanningY);
        this.ctx.moveTo(this.mouse.x - this.netPanningX, this.mouse.y + 5 - this.netPanningY);
        this.ctx.lineTo(this.mouse.x - this.netPanningX, CANVAS_DIMENSIONS.HEIGHT);
        this.ctx.moveTo(0, this.mouse.y - this.netPanningY);
        this.ctx.lineTo(this.mouse.x - 5 - this.netPanningX, this.mouse.y - this.netPanningY);
        this.ctx.moveTo(this.mouse.x + 5 - this.netPanningX, this.mouse.y - this.netPanningY);
        this.ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, this.mouse.y - this.netPanningY);
        this.ctx.stroke();
        this.ctx.fillStyle = COLORS.LINES;
        this.ctx.fillText(`${this.keys.choosenCommand.toUpperCase()}`, this.mouse.x + 12.5 - this.netPanningX, this.mouse.y - 4.5 - this.netPanningY)
        this.ctx.fillText(`x: ${this.mouse.x - this.netPanningX} - y: ${this.mouse.y - this.netPanningY}`, this.mouse.x + 12.5 - this.netPanningX, this.mouse.y + 12.5 - this.netPanningY)
        this.ctx.closePath();
        this.ctx.setLineDash([]);
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
                this.ctx.fillStyle = COLORS.LINES;
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
                this.ctx.fillStyle = COLORS.LINES;
                // this.ctx.textAlign = "center";
                this.ctx.fillText(i.toString(), 2.5 - (this.netPanningX > 0 ? 0 : this.netPanningX), i - 2.5);
            }
        }
    }

    drawShapes (ctx, hit) {
        [...this.HM.value, ...this.tempShape].forEach(item => {
            if (item.w) {
                ctx.save()
                ctx.fillStyle = item.selected ? COLORS.shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.strokeStyle = hit ? item.colorKey : item.stroke
                ctx.beginPath()
                ctx.rect(item.x, item.y, item.w, item.h)
                ctx.fill()
                ctx.stroke()
                ctx.restore()
            } else if (item.radius) {
                ctx.save()
                ctx.strokeStyle = hit ? item.colorKey : item.stroke
                ctx.fillStyle = item.selected ? COLORS.shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.beginPath()
                // x, y, radius, startAngle, endAngle, antiClockwise = false by default
                ctx.arc(item.start_x, item.start_y, item.radius, 0, 2 * Math.PI, false) // full circle
                ctx.fill()
                ctx.stroke()
                ctx.restore()
            } else {
                ctx.save()
                ctx.strokeStyle = item.selected ? COLORS.shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.beginPath()
                ctx.moveTo(item.start_x, item.start_y)
                ctx.lineTo(item.end_x, item.end_y)
                ctx.closePath()
                ctx.stroke()
                ctx.restore()
            }
        });
    }


    limitCamera (panx, pany) {
        let x, y;
        if (panx < 0) {
            x = Math.max(-CANVAS_DIMENSIONS.WIDTH, panx)
        } else {
            x = 0
        }
        if (pany < 0) {
            y = Math.max(-CANVAS_DIMENSIONS.HEIGHT, pany)
        } else {
            y = 0
        }
        return { x, y }
    }

    drawAll () {
        let {x, y} = this.limitCamera(this.netPanningX, this.netPanningY)
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(this.zoomLevel, this.zoomLevel); // apply scale
        this.ctx.translate(x,y); // apply translation
        this.drawCanvas();
        this.drawPointer();
        this.drawShapes(this.ctx, false);
        this.ctx.restore();

        this.gctx.fillStyle = "black";
        this.gctx.fillRect(0, 0, this.ghostcanvas.width, this.ghostcanvas.height);
        this.gctx.save();
        this.gctx.scale(this.zoomLevel, this.zoomLevel); // apply scale
        this.gctx.translate(x,y); // apply translation
        this.drawShapes(this.gctx, true);
        this.gctx.restore();
    }

    /* ---------------------------- RENDER ----------------------------- */
}



