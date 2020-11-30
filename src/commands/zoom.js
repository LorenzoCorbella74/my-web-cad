import Command from './command';

export default class ZoomCommand extends Command {

    constructor(state) {
        super(state)
        this.mouseDown = false;
    }

    mousemove(e) {
        // console.log('Zoom: mousemove', e, this)
        this.main.mouse.x = e._x;
        this.main.mouse.y = e._y;
        this.main.mouse.event = e;

        if (this.mouseDown) {
            if (!e.ctrlKey) {
                this.main.zoomLevel += .005;
            } else {
                this.main.zoomLevel -= .005;
            }
        }
    }

    mousedown(e) {
        // console.log('Zoom: mousedown', e, this)
        this.mouseDown = true

    }

    mouseup(event) {
        // console.log('Zoom: mouseup', event, this)
        this.mouseDown = false;
    }

}