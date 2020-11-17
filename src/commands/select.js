import Command from './command';

export default class SelectCommand extends Command {

    constructor(state) {
        super(state)
    }

    mousemove(e) {
        this.main.mouse.x = e._x;
        this.main.mouse.y = e._y;
        this.main.mouse.event = e;
    }

    mousedown(e) {

    }

    mouseup(event) {
    }

    mouseout(event) {
    }

    click(e) {
        // get pixel under cursor
        const pixel = this.main.gctx.getImageData(e._x, e._y, 1, 1).data;
        // create rgb color for that pixel
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        // find a shape with the same colour
        this.main.shapes.forEach(item => {
            if (item.colorKey === color) {
                item.selected = true;
                this.main.theOneSelected = item;
            } else {
                item.selected = false;
            }
        });
    }

}