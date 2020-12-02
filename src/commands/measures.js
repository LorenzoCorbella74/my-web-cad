import Command from './command';

import { COLORS, TEXT } from '../constants';
import { trackSelection } from '../utils'

export default class MeasuresCommand extends Command {

    constructor(state) {
        super(state)
        this.first = false;
        this.start = {}
        this.d = 0
    }

    mousemove(event) {
        this.main.mouse.x = event._x;
        this.main.mouse.y = event._y;
        this.main.mouse.event = event;

        if (this.first) {
            this.main.tempShape = [{
                start_x: this.start.x,
                start_y: this.start.y,
                dashed: true,
                end_x: event._x - this.main.netPanningX,
                end_y: event._y - this.main.netPanningY,
                stroke: COLORS[this.main.selectedTheme].LINES
            }]

            let dx = this.start.x - (event._x - this.main.netPanningX);
            let dy = this.start.y - (event._y - this.main.netPanningY);
            this.d = Math.floor(Math.sqrt(dx * dx + dy * dy));
            this.main.info = `Dist: ${this.d}`;
        }
    }

    mousedown(event) {
        this.start.x = event._x - this.main.netPanningX;
        this.start.y = event._y - this.main.netPanningY;
        this.first = true;
    }

    mouseup(event) {
        if (this.first) {
            this.first = false;
            this.main.tempShape.length = 0;
            let dashed_line = trackSelection({
                start_x: this.start.x,
                start_y: this.start.y,
                // dashed: true,
                arrowStart: true,
                arrowEnd: true,
                end_x: event._x - this.main.netPanningX,
                end_y: event._y - this.main.netPanningY,
                stroke: COLORS[this.main.selectedTheme].LINES
            });
            this.main.shapes.push(dashed_line);
            var midX = dashed_line.start_x + (dashed_line.end_x - dashed_line.start_x) * 0.50;
            var midY = dashed_line.start_y + (dashed_line.end_y - dashed_line.start_y) * 0.50;
            this.main.shapes.push({
                start_x: (midX - this.main.netPanningX),
                start_y: (midY - this.main.netPanningY),
                measure: this.d,
                font: TEXT.FONT,
                fill: COLORS[this.main.selectedTheme].shapes_stroke,
                colorKey: dashed_line.colorKey
            });
            this.main.HM.set(this.main.shapes)
            this.main.info = '';
            this.d = 0;
        }
    }

}