import Command from './command';

import { COLORS, TEXT } from '../constants';
import { trackSelection } from '../utils'

export default class TextCommand extends Command {

    constructor(state) {
        super(state)
        this.started = false;
        this.start = {}
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
                stroke: COLORS[this.main.selectedTheme].LINES
            }]
        }
    }

    mousedown(event) {
        this.start.x = event._x - this.main.netPanningX;
        this.start.y = event._y - this.main.netPanningY;
        this.started = true;
    }

    mouseup(event) {
        if (this.started) {
            this.started = false;
            this.main.tempShape.length = 0;

            this.main.textModal.open(
                (event._x - this.main.netPanningX),
                (event._y - this.main.netPanningY),
                '',
                (val) => this.saveText(val))
        }
    }

    saveText(info) {
        let { x, y, val } = info;
        let dashed_line = trackSelection({
            start_x: this.start.x,
            start_y: this.start.y,
            dashed: true,
            end_x: x - this.main.netPanningX,
            end_y: y - this.main.netPanningY,
            stroke: COLORS[this.main.selectedTheme].LINES
        });
        this.main.shapes.push(dashed_line);
        this.main.shapes.push({
            start_x: (x - this.main.netPanningX) + TEXT.OFFSET,
            start_y: (y - this.main.netPanningY) - TEXT.OFFSET,
            text: val,
            font: TEXT.FONT,
            fill: COLORS[this.main.selectedTheme].shapes_stroke,
            colorKey: dashed_line.colorKey
        });
        this.main.HM.set(this.main.shapes)
    }

}