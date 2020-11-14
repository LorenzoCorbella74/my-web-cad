import Command from './command';

export default class PanCommand extends Command {

    constructor(state) {
        super(state)

        // this.mouse drag related variables
        this.isDown = false;
        this.startX, this.startY;

        // the accumulated horizontal(X) & vertical(Y) panning the user has done in total
        this.main.netPanningX = 0;
        this.main.netPanningY = 0;
    }

    mousemove(e) {

        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();

        let x = e._x;
        let y = e._y;

        // if the this.mouse is being dragged
        if (this.isDown) {
            // dx & dy are the distance the this.mouse has moved since the last this.mousemove event
            var dx = x - this.startX;
            var dy = y - this.startY;

            // reset the vars for next this.mousemove
            this.startX = x;
            this.startY = y;

            // accumulate the net panning done
            this.main.netPanningX += dx;
            this.main.netPanningY += dy;
            console.clear()
            console.log(`Net change in panning: x:${this.main.netPanningX}px, y:${this.main.netPanningY}px`);
        }
        this.main.mouse.x = x;
        this.main.mouse.y = y;
        this.main.mouse.event = e;
    }

    mousedown(e) {
        e.preventDefault();
        e.stopPropagation();

        // calc the starting this.mouse X,Y for the drag
        this.startX = e._x;
        this.startY = e._y;

        // set the isDragging flag
        this.isDown = true;
    }

    mouseup(e) {
        console.log('PanCommand: mouseup', e, this)
        e.preventDefault();
        e.stopPropagation();
        // clear the isDragging flag
        this.isDown = false;
    }

    mouseout(e) {
        console.log('PanCommand: mouseout', e, this)
        e.preventDefault();
        e.stopPropagation();
        // clear the isDragging flag
        this.isDown = false;
    }

}