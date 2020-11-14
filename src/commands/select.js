import Command from './command';

export default class SelectCommand extends Command {

    constructor(state) {
        super(state)
    }

    mousemove (e) {
        console.log('SelectCommand: mousemove', e, this)
    }

    mousedown (e) {
        console.log('SelectCommand: mousedown', e, this)
    }

    mouseup (event) {
        console.log('SelectCommand: mouseup', event, this)
    }

    mouseout (event) {
        console.log('SelectCommand: mouseout', event, this)
    }

}