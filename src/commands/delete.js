import Command from './command';

export default class DeleteCommand extends Command {

    constructor(state) {
        super(state)
    }

    click(e) {
        const pixel = this.main.gctx.getImageData(e._x, e._y, 1, 1).data;
        // create rgb color for that pixel
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        // remove the shape with the same colour
        for (var i = this.main.shapes.length - 1; i >= 0; i--) {
            if (this.main.shapes[i].colorKey === color) {
                this.main.shapes.splice(i, 1);
                this.main.HM.set(this.main.shapes)
            }
        }
    }

}