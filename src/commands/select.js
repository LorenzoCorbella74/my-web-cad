import Command from './command';

export default class SelectCommand extends Command {

    constructor(state) {
        super(state)
    }

    click(e) {
        // get pixel under cursor
        const pixel = this.main.gctx.getImageData(e._x * this.main.zoomLevel, e._y * this.main.zoomLevel, 1, 1).data;
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
        }
    }

}