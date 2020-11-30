import Command from './command';

import { CANVAS_DIMENSIONS } from '../constants'

export default class PanCommand extends Command {

    constructor(state) {
        super(state)

        // this.mouse drag related variables
        this.isMouseDown = false;
        this.startX, this.startY;
        // the accumulated horizontal(X) & vertical(Y) panning the user has done in total
        this.main.netPanningX = 0;
        this.main.netPanningY = 0;
    }

    limitCamera(panx, pany) {
        let a, b;
        if (panx < 0) {
            a = Math.max(-CANVAS_DIMENSIONS.WIDTH, panx)
        } else {
            a = 0
        }
        if (pany < 0) {
            b = Math.max(-CANVAS_DIMENSIONS.HEIGHT, pany)
        } else {
            b = 0
        }
        return { a, b }
    }

    mousemove(e) {
        let x = e._x;
        let y = e._y;

        // if the this.mouse is being dragged
        if (this.isMouseDown) {
            // dx & dy are the distance the this.mouse has moved since the last this.mousemove event
            var dx = x - this.startX;
            var dy = y - this.startY;

            // reset the vars for next this.mousemove
            this.startX = x;
            this.startY = y;

            // accumulate the net panning done
            this.main.netPanningX += dx;
            this.main.netPanningY += dy;

            let { a, b } = this.limitCamera(this.main.netPanningX, this.main.netPanningY)
            this.main.netPanningX = a;
            this.main.netPanningY = b;
            // console.clear()
            // console.log(`Net change in panning: x:${this.main.netPanningX}px, y:${this.main.netPanningY}px`);
        }
        this.main.mouse.x = e._x;
        this.main.mouse.y = e._y;
        this.main.mouse.event = e;
    }

    mousedown(e) {
        // calc the starting this.mouse X,Y for the drag
        this.startX = e._x;
        this.startY = e._y;
        // set the isDragging flag
        this.isMouseDown = true;
    }

    mouseup(e) {
        // clear the isDragging flag
        this.isMouseDown = false;
    }

}