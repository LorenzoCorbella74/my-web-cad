import Command from './command';
import { COLORS, TEXT } from '../constants';
import { trackSelection } from '../utils'

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

        // if it's a text open the dialogue
        if (this.main.shapes[this.main.selected] && this.main.shapes[this.main.selected].text) {
            let theOne = this.main.shapes[this.main.selected]
            this.main.textModal.open(
                theOne.start_x - this.main.netPanningX,
                theOne.start_y - this.main.netPanningY,
                theOne.text,
                (val) => this.updateText(val))
        }
    }

    updateText(info) {
        let { val } = info;
        this.main.shapes[this.main.selected].text = val;
        this.main.HM.set(this.main.shapes)
    }

}