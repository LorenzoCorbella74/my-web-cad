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
        const pixel = this.main.gctx.getImageData(e._x* this.main.zoomLevel, e._y* this.main.zoomLevel, 1, 1).data;
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
        /* let found = false
        for (var i = this.main.shapes.length - 1; i >= 0; i--) {
            if (this.main.shapes[i].colorKey === color) {
                let aside = this.main.shapes.splice(i, 1);
                aside[0].selected = true;
                this.main.tempShape = aside
                found = true
            } else {
                this.main.shapes[i].selected = false;
            }
        }
        if (!found) {
            let aside = this.main.tempShape.splice(0, 1);
            if (aside) {
                aside[0].selected = false;
                this.main.shapes = [...this.main.shapes, ...aside]
            }
            this.main.shapes.forEach(element => {
                element.selected = false;
            });
        } */
    }

}