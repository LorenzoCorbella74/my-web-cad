import Command from './command';

import { COLORS } from '../constants';
import { trackSelection } from '../utils'

export default class CircleCommand extends Command {

    constructor(state) {
        super(state)
        this.started = false;
        this.start = {}
        this.radius = 0
    }

    mousemove(event) {
        this.main.mouse.x = event._x;
        this.main.mouse.y = event._y;
        this.main.mouse.event = event;

        if (this.started) {
            let dx = this.start.x - (event._x - this.main.netPanningX);
            let dy = this.start.y - (event._y - this.main.netPanningY);
            this.radius = Math.sqrt(dx * dx + dy * dy);
            this.main.tempShape = [{
                start_x: this.start.x,
                start_y: this.start.y,
                radius: this.radius
            }]
        }
    }

    mousedown(event) {
        /* this.main.ctx.beginPath(); */
        this.start.x = event._x - this.main.netPanningX;
        this.start.y = event._y - this.main.netPanningY;
        this.started = true;
    }

    mouseup(event) {
        if (this.started) {
            this.started = false;
            this.main.tempShape.length = 0;
            this.main.shapes.push(trackSelection({
                start_x: this.start.x,
                start_y: this.start.y,
                radius: this.radius,
                color: COLORS.shapes_fill,
                stroke: COLORS.shapes_stroke
            }));
            this.main.HM.set(this.main.shapes)
            this.radius = 0;
        }
    }

    mouseout(event) {
        if (this.started) {
            this.started = false;
            this.main.tempShape.length = 0;
            this.main.shapes.push(trackSelection({
                start_x: this.start.x,
                start_y: this.start.y,
                radius: this.radius,
                color: COLORS.shapes_fill,
                stroke: COLORS.shapes_stroke
            }));
            this.main.HM.set(this.main.shapes)
            this.radius = 0;
        }
    }

    click(e) { }
}