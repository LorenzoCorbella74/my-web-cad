import Command from './command';

import { COLORS } from '../constants';

export default class RectCommand extends Command {

    constructor(state) {
        super(state)
        this.started = false;
        this.start = {}
        this.x, this.y
        this.width, this.height
    }

    mousemove(event) {
        this.main.mouse.x = event._x;
        this.main.mouse.y = event._y;
        this.main.mouse.event = event;

        if (this.started) {
            this.x = Math.min(event._x, this.start.x),
                this.y = Math.min(event._y, this.start.y),
                this.w = Math.abs(event._x - this.start.x),
                this.h = Math.abs(event._y - this.start.y);
            if (!this.w || !this.h) {
                return;
            }
            this.main.tempShape = [{
                x: this.x - this.main.netPanningX,
                y: this.y - this.main.netPanningY,
                w: this.w,
                h: this.h
            }]
        }

    }

    mousedown(event) {
        this.main.ctx.beginPath();
        this.start.x = event._x;
        this.start.y = event._y;
        this.started = true;
    }

    mouseup(event) {
        if (this.started) {
            this.started = false;
            this.main.tempShape.length = 0;
            this.main.shapes.push({
                x: this.x - this.main.netPanningX,
                y: this.y - this.main.netPanningY,
                w: this.w,
                h: this.h,
                color: COLORS.shapes_fill,
                stroke: COLORS.shapes_stroke
            });
            this.main.HM.set(this.main.shapes)
        }
    }

    mouseout(event) {
        if (this.started) {
            this.started = false;
            this.main.tempShape.length = 0;
            this.main.shapes.push({
                x: this.x - this.main.netPanningX,
                y: this.y - this.main.netPanningY,
                w: this.w,
                h: this.h,
                color: COLORS.shapes_fill,
                stroke: COLORS.shapes_stroke
            });
            this.main.HM.set(this.main.shapes)
        }
    }

}