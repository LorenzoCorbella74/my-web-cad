export default class Command {

    constructor(main) {
        // ref to main class istance
        this.main = main;
    }

    mousemove(e) {
        this.main.mouse.x = e._x;
        this.main.mouse.y = e._y;
        this.main.mouse.event = e;
    }

    mousedown(e) {
        // console.log('Command: mousedown', e, this)
    }

    mouseup(event) {
        // console.log('Command: mouseup', event, this)
    }

    mouseout(event) {
        // console.log('Command: mouseout', event, this)
    }

    click(event) {
        // console.log('Command: click', event, this)
    }

}