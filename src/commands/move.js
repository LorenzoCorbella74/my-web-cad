import { COLORS } from "../constants";
import Command from "./command";

export default class MoveCommand extends Command {

    constructor(state) {
        super(state)
        this.started = false;
        this.start = {}
    }

    mousemove(event) {
        this.main.mouse.x = event._x;
        this.main.mouse.y = event._y;
        this.main.mouse.event = event;

        // draw a line when dragging
        if (this.started && (this.main.selected || this.main.selected === 0)) {
            this.main.tempShape = [{
                start_x: this.start.x,
                start_y: this.start.y,
                dashed: true,
                end_x: event._x - this.main.netPanningX,
                end_y: event._y - this.main.netPanningY,
                stroke: COLORS[this.main.selectedTheme].LINES
            }]
        }
    }

    mousedown(event) {// get pixel under cursor
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
            let sel = this.main.shapes[this.main.selected];
            // rect & circle
            if (sel.w || sel.radius) {
                let dx = this.start.x - sel.start_x;
                let dy = this.start.y - sel.start_y;
                sel.new_start_x = (event._x - this.main.netPanningX) - dx;
                sel.new_start_y = (event._y - this.main.netPanningY) - dy;
                sel.start_x = this.start.x - dx;
                sel.start_y = this.start.y - dy;
                sel.animation = true;
                sel.counter = 0;
                this.main.HM.set(this.main.shapes)
            } else {
                // lines
                let dx1 = this.start.x - sel.start_x;
                let dy1 = this.start.y - sel.start_y;
                let dx2 = this.start.x - sel.end_x;
                let dy2 = this.start.y - sel.end_y;
                sel.start_x = (event._x - this.main.netPanningX) - dx1;
                sel.start_y = (event._y - this.main.netPanningY) - dy1;
                sel.end_x = (event._x - this.main.netPanningX) - dx2;
                sel.end_y = (event._y - this.main.netPanningY) - dy2;
                this.main.HM.set(this.main.shapes)
            }
        }
    }

    mouseout(event) {
        if (this.started && (this.main.selected || this.main.selected === 0)) {
            this.started = false;
            this.main.tempShape.length = 0;
            // rect & circle
            if (this.main.shapes[this.main.selected].w || this.main.shapes[this.main.selected].radius) {
                let dx = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy = this.start.y - this.main.shapes[this.main.selected].start_y;
                this.main.shapes[this.main.selected].start_x = (event._x - this.main.netPanningX) - dx;
                this.main.shapes[this.main.selected].start_y = (event._y - this.main.netPanningY) - dy;
                this.main.HM.set(this.main.shapes)
            } else {
                // lines
                let dx1 = this.start.x - this.main.shapes[this.main.selected].start_x;
                let dy1 = this.start.y - this.main.shapes[this.main.selected].start_y;
                let dx2 = this.start.x - this.main.shapes[this.main.selected].end_x;
                let dy2 = this.start.y - this.main.shapes[this.main.selected].end_y;
                this.main.shapes[this.main.selected].start_x = (event._x - this.main.netPanningX) - dx1;
                this.main.shapes[this.main.selected].start_y = (event._y - this.main.netPanningY) - dy1;
                this.main.shapes[this.main.selected].end_x = (event._x - this.main.netPanningX) - dx2;
                this.main.shapes[this.main.selected].end_y = (event._y - this.main.netPanningY) - dy2;
                this.main.HM.set(this.main.shapes)
            }
        }
    }

}