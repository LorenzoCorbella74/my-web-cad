import '../style.css'

import KeyboardEvents from './keyboards_events';
import HistoryManagement from './history_management';
import { colorsTable } from './utils';
import InputDialogue from './input-dialogue';

import { CANVAS_DIMENSIONS, COLORS, UNITS, OPERATIONS, TEXT } from './constants';

// Commands
import PanCommand from './commands/pan';
import ZoomCommand from './commands/zoom';
import SelectCommand from './commands/select';
import DeleteCommand from './commands/delete';
import LineCommand from './commands/line';
import RectCommand from './commands/rect';
import CircleCommand from './commands/circle';
import MoveCommand from './commands/move';
import CopyCommand from './commands/copy'
import ResizeCommand from './commands/resize'
import TextCommand from './commands/text';

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
            'COPY': new CopyCommand(this),
            'MOVE': new MoveCommand(this),
            'RESIZE': new ResizeCommand(this),
            'PAN': new PanCommand(this),
            'ZOOM': new ZoomCommand(this),
            'LINE': new LineCommand(this),
            'RECT': new RectCommand(this),
            'CIRCLE': new CircleCommand(this),
            'TEXT': new TextCommand(this)
        }

        this.textModal = new InputDialogue(this)

        this.mouse = {
            x: 0,
            y: 0,
            event: null
        };

        this.zoomLevel = 1;
        this.choosenUnitSystem = 'ONE'

        this.shapes = [];
        this.tempShape = []
        this.selected = null;
        this.HM = new HistoryManagement(this);

        this.startListening()
        this.resizeCanvas()
    }

    setUnitSystem(what) {
        this.choosenUnitSystem = what
    }

    getValueAccordingToUnitSystem(val) {
        return val ? val / UNITS[this.choosenUnitSystem] : 0;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ghostcanvas.width = window.innerWidth;
        this.ghostcanvas.height = window.innerHeight;
        /* this.canvas.style.cursor = "none" */
        this.drawAll();
    }

    startListening() {
        // resize the canvas to fill browser window dynamically
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        this.canvas.oncontextmenu = () => false;
        this.canvas.addEventListener('click', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mousemove', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mousedown', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mouseup', this.globalHandler.bind(this), false);
        this.canvas.addEventListener('mouseout', this.globalHandler.bind(this), false);
    }

    globalHandler(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        let x = parseInt(ev.clientX / this.zoomLevel);
        let y = parseInt(ev.clientY / this.zoomLevel);

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

    loop() {
        this.drawAll();
        requestAnimationFrame(() => {
            this.loop()
        });
    }

    start() {
        this.loop();
    }

    /* ---------------------------- RENDER ----------------------------- */

    drawPointer() {
        this.ctx.strokeStyle = COLORS.CURSOR; // green
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
        this.ctx.fillText(`x: ${this.getValueAccordingToUnitSystem(this.mouse.x - this.netPanningX)} - y: ${this.getValueAccordingToUnitSystem(this.mouse.y - this.netPanningY)}`, this.mouse.x + 12.5 - this.netPanningX, this.mouse.y + 12.5 - this.netPanningY)
        this.ctx.closePath();
        this.ctx.setLineDash([]);
    }

    drawCanvas() {
        this.ctx.fillStyle = COLORS.CANVAS;
        this.ctx.fillRect(0, 0, CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT);
        // colonne
        for (let i = 0; i < CANVAS_DIMENSIONS.WIDTH; i += this.keys.currentSnap) {
            if (this.keys.hasSnap) {
                this.ctx.beginPath();
                this.ctx.moveTo(i + 0.5, 0);
                this.ctx.lineTo(i + 0.5, CANVAS_DIMENSIONS.HEIGHT);
                if (i % 100 === 0) {
                    this.ctx.strokeStyle = COLORS.LINES_BIG;
                } else {
                    this.ctx.strokeStyle = COLORS.LINES_SMALL;
                }
                this.ctx.lineWidth = 0.5;
                this.ctx.closePath()
                this.ctx.stroke();
            }
            if (i % 100 === 0) {
                this.ctx.font = TEXT.FONT;
                this.ctx.fillStyle = COLORS.LINES;
                // this.ctx.textAlign = "center";
                this.ctx.fillText(
                    this.getValueAccordingToUnitSystem(i).toString(),
                    i + 2.5, 10 - (this.netPanningY > 0 ? 0 : this.netPanningY));
            }
        }
        // righe
        for (let i = 0; i < CANVAS_DIMENSIONS.HEIGHT; i += this.keys.currentSnap) {
            if (this.keys.hasSnap) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, i + 0.5);
                this.ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, i + 0.5);
                if (i % 100 === 0) {
                    this.ctx.strokeStyle = COLORS.LINES_BIG;
                } else {
                    this.ctx.strokeStyle = COLORS.LINES_SMALL;
                }
                this.ctx.lineWidth = 0.5;
                this.ctx.closePath()
                this.ctx.stroke();
            }
            if (i % 100 === 0) {
                this.ctx.font = TEXT.FONT;
                this.ctx.fillStyle = COLORS.LINES;
                // this.ctx.textAlign = "center";
                this.ctx.fillText(
                    this.getValueAccordingToUnitSystem(i).toString(),
                    2.5 - (this.netPanningX > 0 ? 0 : this.netPanningX), i - 2.5);
            }
        }
    }

    drawShapes(ctx, hit) {
        [...this.HM.value, ...this.tempShape].forEach(item => {
            if (hit) {
                ctx.lineWidth = 10 // to select lines or sides of rect...
            } else {
                ctx.lineWidth = 0.5
            }
            if (item.text) {
                if (hit) {
                    ctx.save()
                    ctx.fillStyle = item.colorKey
                    ctx.beginPath()
                    ctx.rect(item.start_x, item.start_y - 15, 100, 20)
                    ctx.fill()
                    ctx.stroke()
                    ctx.restore()
                } else {
                    ctx.save()
                    ctx.fillStyle = item.selected ? COLORS.shapes_fill_selected : (hit ? item.colorKey : item.color)
                    ctx.beginPath()
                    ctx.font = item.font;
                    ctx.fillText(item.text, item.start_x, item.start_y);
                    ctx.restore()
                }
                ctx.save()
                ctx.fillStyle = item.selected ? COLORS.shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.beginPath()
                ctx.font = item.font;
                ctx.fillText(item.text, item.start_x, item.start_y);
                ctx.restore()
            } else if (item.w && item.h) {
                ctx.save()
                ctx.fillStyle = item.selected ? COLORS.shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.strokeStyle = item.selected ? COLORS.shapes_stroke_selected : (hit ? item.colorKey : item.stroke)
                ctx.beginPath()
                ctx.rect(item.start_x, item.start_y, item.w, item.h)
                ctx.fill()
                ctx.stroke()
                ctx.restore()
            } else if (item.radius) {
                ctx.save()
                ctx.strokeStyle = item.selected ? COLORS.shapes_stroke_selected : (hit ? item.colorKey : item.stroke)
                ctx.fillStyle = item.selected ? COLORS.shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.beginPath()
                // x, y, radius, startAngle, endAngle, antiClockwise = false by default
                ctx.arc(item.start_x, item.start_y, item.radius, 0, 2 * Math.PI, false) // full circle
                ctx.fill()
                ctx.stroke()
                ctx.restore()
            } else {
                ctx.save()
                ctx.strokeStyle = item.selected ? COLORS.shapes_stroke_selected : (hit ? item.colorKey : item.stroke)
                ctx.beginPath()
                if (item.dashed) {
                    ctx.setLineDash([this.keys.currentSnap / 3, this.keys.currentSnap]);
                }
                ctx.moveTo(item.start_x, item.start_y)
                ctx.lineTo(item.end_x, item.end_y)
                ctx.closePath()
                ctx.stroke()
                ctx.restore()
            }
        });
    }

    drawAll() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(this.zoomLevel, this.zoomLevel); // apply scale
        this.ctx.translate(this.netPanningX, this.netPanningY); // apply translation
        this.drawCanvas();
        this.drawPointer();
        this.drawShapes(this.ctx, false);
        this.ctx.restore();

        this.gctx.fillStyle = "black";
        this.gctx.fillRect(0, 0, this.ghostcanvas.width, this.ghostcanvas.height);
        this.gctx.save();
        this.gctx.scale(this.zoomLevel, this.zoomLevel); // apply scale
        this.gctx.translate(this.netPanningX, this.netPanningY); // apply translation
        this.drawShapes(this.gctx, true);
        this.gctx.restore();
    }

    /* ---------------------------- RENDER ----------------------------- */
}



