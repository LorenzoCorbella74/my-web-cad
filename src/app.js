import '../style.css'


import KeyboardEvents from './keyboards_events';
import HistoryManagement from './history_management';
import { colorsTable, interpolate } from './utils';

import CommandsPanel from './components/commands-panel'; // web component for the command
import InputDialogue from './components/input-dialogue';

import { UNITS, ANIMATION } from './constants';

import { renderPointer, renderCanvas, renderShapes } from './renderFn'

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
        this.selectedTheme = 'grey'; // white, grey, blue
        this.selectedColorInPanel = '#0074D9'

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
        this.panel = new CommandsPanel(this);

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

        this.lastTime = (new Date()).getTime();
        this.currentTime = 0;
        this.delta = 0;

        this.startListening()
        this.resizeCanvas()
    }

    setUnitSystem (what) {
        this.choosenUnitSystem = what
    }

    getValueAccordingToUnitSystem (val) {
        return val ? val / UNITS[this.choosenUnitSystem] : 0;
    }

    resizeCanvas () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ghostcanvas.width = window.innerWidth;
        this.ghostcanvas.height = window.innerHeight;
        /* this.canvas.style.cursor = "none" */
        this.draw();
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

    loop () {
        // time management for animation
        this.currentTime = (new Date()).getTime();
        this.dt = (this.currentTime - this.lastTime) / 1000;

        this.update(this.dt)

        this.draw();

        this.lastTime = this.currentTime;

        requestAnimationFrame(() => {
            this.loop()
        });
    }

    start () {
        this.loop();
    }

    unselectAll () {
        this.shapes.forEach((item, index) => {
            item.selected = false;
        });
        this.selected = null;
    }

    update (dt) {
        // console.log(dt)
        this.HM.value.forEach(item => {
            // ANIMATION on COPY / MOVE
            if (item.animationEdit) {
                if (item.counterEdit <= ANIMATION.TIME) {
                    item.counterEdit += ANIMATION.STEP
                    let { x, y } = interpolate({ x: item.start_x, y: item.start_y }, { x: item.new_start_x, y: item.new_start_y }, item.counterEdit / ANIMATION.TIME);
                    item.start_x = x;
                    item.start_y = y;
                } else {
                    item.animationEdit = false;
                    this.unselectAll();
                }
            }
            // Animation on shape creation
            if (item.animationCreate) {
                if (item.counterCreate <= ANIMATION.TIME) {
                    item.counterCreate += ANIMATION.STEP
                    // RECT
                    if (item.final_w) {
                        let { x, y } = interpolate({ x: item.w, y: item.h }, { x: item.final_w, y: item.final_h }, item.counterCreate / ANIMATION.TIME);
                        item.w = x;
                        item.h = y;
                    }
                    // LINE
                    if (item.final_end_x) {
                        let { x, y } = interpolate({ x: item.end_x, y: item.end_y }, { x: item.final_end_x, y: item.final_end_y }, item.counterCreate / ANIMATION.TIME);
                        item.end_x = x;
                        item.end_y = y;
                    }
                    // CIRCLE
                    if (item.final_radius) {
                        let { x } = interpolate({ x: item.radius, y: 0 }, { x: item.final_radius, y: 0 }, item.counterCreate / ANIMATION.TIME);
                        item.radius = x;
                    }
                } else {
                    item.animationCreate = false;
                }
            }
        })
    }

    draw () {
        // CANCAS
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(this.zoomLevel, this.zoomLevel); // apply scale
        this.ctx.translate(this.netPanningX, this.netPanningY); // apply translation
        renderCanvas(this);
        renderShapes(this, this.ctx, false);
        renderPointer(this);
        this.ctx.restore();

        // GHOST CANVAS for HIT Detection
        this.gctx.fillStyle = "black";
        this.gctx.fillRect(0, 0, this.ghostcanvas.width, this.ghostcanvas.height);
        this.gctx.save();
        this.gctx.scale(this.zoomLevel, this.zoomLevel); // apply scale
        this.gctx.translate(this.netPanningX, this.netPanningY); // apply translation
        renderShapes(this, this.gctx, true);
        this.gctx.restore();
    }
}



