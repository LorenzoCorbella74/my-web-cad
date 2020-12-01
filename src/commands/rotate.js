import { COLORS } from "../constants";
import Command from "./command";

export default class RotateCommand extends Command {

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
            let dx = (event._x - this.main.netPanningX) - this.start.x;
            let dy = (event._y - this.main.netPanningY) - this.start.y;
            let angle = Math.atan2(dy, dx);
            this.main.info = `Angle: ${Math.floor(angle * 180 / Math.PI)}`;
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
                let dx = (event._x - this.main.netPanningX) - sel.start_x;
                let dy = (event._y - this.main.netPanningY) - sel.start_y;
                let angle = Math.atan2(dy, dx);
                // console.log(Math.floor(angle * 180 / Math.PI))
                sel.angle = angle;
                this.main.HM.set(this.main.shapes)
                this.main.info = '';
            }
        }
    }

}