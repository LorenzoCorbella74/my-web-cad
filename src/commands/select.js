import Command from './command';
import { colorsTable } from '../utils';

export default class SelectCommand extends Command {

    constructor(state) {
        super(state)
        this.foundCoordinates = {}
    }

    mousemove (e) {
        this.main.mouse.x = e._x;
        this.main.mouse.y = e._y;
        this.main.mouse.event = e;
    }

    isSamePoint (point) {
        return this.foundCoordinates.x === point.x && this.foundCoordinates.y === point.y;
    }

    mousedown (e) {
        let x = e._x - this.main.netPanningX;
        let y = e._y - this.main.netPanningY;
        if (!this.isSamePoint({ x, y })) {
            // get pixel under cursor
            const pixel = this.main.gctx.getImageData(x, y, 1, 1).data;
            // create rgb color for that pixel
            const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
            // find a shape with the same colour
            this.main.shapes.forEach(item => {
                if (color === item.colorKey) {
                    item.selected = true;
                    this.main.theOneSelected = item;
                    this.foundCoordinates = {...{ x, y }}
                } else {
                    item.selected = false;
                }
            });
        }
    }

    mouseup (event) {
    }

    mouseout (event) {
    }

}