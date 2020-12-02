import Command from './command';

import { COLORS } from '../constants';
import { trackSelection } from '../utils'

export default class LineCommand extends Command {

    constructor(state) {
        super(state)
        this.started = false;
        this.start = {}
    }

    mousemove (event) {
        this.main.mouse.x = event._x;
        this.main.mouse.y = event._y;
        this.main.mouse.event = event;

        if (this.started) {
            this.main.tempShape = [{
                start_x: this.start.x,
                start_y: this.start.y,
                end_x: event._x - this.main.netPanningX,
                end_y: event._y - this.main.netPanningY,
                stroke: COLORS[this.main.selectedTheme].LINES
            }]

            let dx = this.start.x - (event._x - this.main.netPanningX);
            let dy = this.start.y - (event._y - this.main.netPanningY);
            this.main.info = {
                key: 'Dist: ',
                value1: Math.floor(Math.sqrt(dx * dx + dy * dy))
            };
        }
    }

    mousedown (event) {
        this.start.x = event._x - this.main.netPanningX;
        this.start.y = event._y - this.main.netPanningY;
        this.started = true;
    }

    mouseup (event) {
        if (this.started) {
            this.started = false;
            this.main.tempShape.length = 0;
            this.main.shapes.push(trackSelection({
                start_x: this.start.x,
                start_y: this.start.y,
                end_x: this.start.x,
                end_y: this.start.y,
                final_end_x: event._x - this.main.netPanningX,
                final_end_y: event._y - this.main.netPanningY,
                animationCreate: true,
                counterCreate: 0,
                stroke: COLORS[this.main.selectedTheme].shapes_stroke
            }));
            this.main.HM.set(this.main.shapes)
            this.main.info = {
                key: '',
                value1: '',
                value2: ''
            };
        }
    }

}