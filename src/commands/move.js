import { COLORS } from "../constants";
import Command from "./command";
// import { COLORS } from '../constants';

export default class MoveCommand extends Command {

    constructor(state) {
        super(state)
        this.started = false;
        this.start = {}
        this.currentlySelected = {}
    }

    mousemove(event) {
        this.main.mouse.x = event._x;
        this.main.mouse.y = event._y;
        this.main.mouse.event = event;

        if (this.started) {
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
        this.start.x = event._x - this.main.netPanningX;
        this.start.y = event._y - this.main.netPanningY;
        this.started = true;
    }

    mouseup(event) {
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