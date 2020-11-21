import { COLORS } from "../constants";
import Command from "./command";

import { trackSelection } from '../utils'

export default class CopyCommand extends Command {

    constructor(state) {
        super(state)
        this.started = false;
        this.start = {}
    }

    mousemove(event) {
        this.main.mouse.x = event._x;
        this.main.mouse.y = event._y;
        this.main.mouse.event = event;

        if (this.started && (this.main.selected || this.main.selected === 0)) {
            this.main.tempShape = [{
                start_x: this.start.x,
                start_y: this.start.y,
                end_x: event._x - this.main.netPanningX,
                end_y: event._y - this.main.netPanningY,
                stroke: COLORS.LINES
            }]
        }
    }

    mousedown(event) {
        const pixel = this.main.gctx.getImageData(event._x * this.main.zoomLevel, event._y * this.main.zoomLevel, 1, 1).data;
        // create rgb color for that pixel
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        // find a shape with the same colour

        this.main.shapes.forEach((item, index) => {
            if (item.colorKey === color) {
                item.selected = true;
                this.main.selected = index;
            } else {
                item.selected = false;
            }
        });
        if (this.main.shapes.every(e => e.selected === false)) {
            this.main.selected = null;
        } else {
            this.started = true;
            this.start.x = event._x - this.main.netPanningX;
            this.start.y = event._y - this.main.netPanningY;
        }
    }

    mouseup(event) {
        if (this.started && (this.main.selected || this.main.selected === 0)) {
            this.started = false;
            this.main.tempShape.length = 0;
            // rect & circle
            if (this.main.shapes[this.main.selected].w) {
                let dx = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy = this.start.y - this.main.shapes[this.main.selected].start_y;
                this.main.shapes.push(trackSelection({
                    start_x: (event._x - this.main.netPanningX) - dx,
                    start_y: (event._y - this.main.netPanningY) - dy,
                    w: this.main.shapes[this.main.selected].w,
                    h: this.main.shapes[this.main.selected].h,
                    color: COLORS.shapes_fill,
                    stroke: COLORS.shapes_stroke
                }));
                this.main.HM.set(this.main.shapes)
            } else if (this.main.shapes[this.main.selected].radius) {
                let dx = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy = this.start.y - this.main.shapes[this.main.selected].start_y;
                this.main.shapes.push(trackSelection({
                    start_x: (event._x - this.main.netPanningX) - dx,
                    start_y: (event._y - this.main.netPanningY) - dy,
                    radius: this.main.shapes[this.main.selected].radius,
                    color: COLORS.shapes_fill,
                    stroke: COLORS.shapes_stroke
                }));
                this.main.HM.set(this.main.shapes)
            } else {
                // lines
                let dx1 = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy1 = this.start.y - this.main.shapes[this.main.selected].start_y;
                let dx2 = this.start.x - this.main.shapes[this.main.selected].end_x;
                let dy2 = this.start.y - this.main.shapes[this.main.selected].end_y;
                this.main.shapes.push(trackSelection({
                    start_x: (event._x - this.main.netPanningX) - dx1,
                    start_y: (event._y - this.main.netPanningY) - dy1,
                    end_x: (event._x - this.main.netPanningX) - dx2,
                    end_y: (event._y - this.main.netPanningY) - dy2,
                    stroke: COLORS.shapes_stroke
                }));
                this.main.HM.set(this.main.shapes);
            }
        }
    }

    mouseout(event) {
        if (this.started && (this.main.selected || this.main.selected === 0)) {
            this.started = false;
            this.main.tempShape.length = 0;
            // rect & circle
            if (this.main.shapes[this.main.selected].w) {
                let dx = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy = this.start.y - this.main.shapes[this.main.selected].start_y;
                this.main.shapes.push(trackSelection({
                    start_x: (event._x - this.main.netPanningX) - dx,
                    start_y: (event._y - this.main.netPanningY) - dy,
                    w: this.main.shapes[this.main.selected].w,
                    h: this.main.shapes[this.main.selected].h,
                    color: COLORS.shapes_fill,
                    stroke: COLORS.shapes_stroke
                }));
                this.main.HM.set(this.main.shapes)
            } else if (this.main.shapes[this.main.selected].radius) {
                let dx = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy = this.start.y - this.main.shapes[this.main.selected].start_y;
                this.main.shapes.push(trackSelection({
                    start_x: (event._x - this.main.netPanningX) - dx,
                    start_y: (event._y - this.main.netPanningY) - dy,
                    radius: this.main.shapes[this.main.selected].radius,
                    color: COLORS.shapes_fill,
                    stroke: COLORS.shapes_stroke
                }));
                this.main.HM.set(this.main.shapes)
            } else {
                // lines
                let dx1 = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy1 = this.start.y - this.main.shapes[this.main.selected].start_y;
                let dx2 = this.start.x - this.main.shapes[this.main.selected].end_x;
                let dy2 = this.start.y - this.main.shapes[this.main.selected].end_y;
                this.main.shapes.push(trackSelection({
                    start_x: (event._x - this.main.netPanningX) - dx1,
                    start_y: (event._y - this.main.netPanningY) - dy1,
                    end_x: (event._x - this.main.netPanningX) - dx2,
                    end_y: (event._y - this.main.netPanningY) - dy2,
                    stroke: COLORS.shapes_stroke
                }));
                this.main.HM.set(this.main.shapes);
            }
        }
    }

}