import { OPERATIONS, SNAP_GRID } from './constants';

// https://css-tricks.com/snippets/javascript/javascript-keycodes/
export default class KeyboardEvents {

    constructor(main) {

        this.main = main;
        // DEFAULTS
        this.choosenCommand = OPERATIONS.SELECT
        this.currentSnap = SNAP_GRID.M;
        this.hasSnap = true;

        this.startListenDocumentKeyup()
    }

    startListenDocumentKeyup() {
        document.onkeyup = (e) => {
            if (e.key == 'Escape' || e.key == 's') {
                this.choosenCommand = OPERATIONS.SELECT;
                /* } else if (e.key == 'd') {
                    this.choosenCommand = OPERATIONS.DELETE;
                } else if (e.key == 'c') {
                    this.choosenCommand = OPERATIONS.COPY;
                } else if (e.key == 'm') {
                    this.choosenCommand = OPERATIONS.MOVE;
                } else if (e.key == 'r') {
                    this.choosenCommand = OPERATIONS.ROTATE;
                } else if (e.key == 'p') {
                    this.choosenCommand = OPERATIONS.PULL;
                } else if (e.key == 's') {
                    this.choosenCommand = OPERATIONS.SCALE;
                } else if (e.key == 'l') {
                    this.choosenCommand = OPERATIONS.LINE;
                } else if (e.key == 'q') {
                    this.choosenCommand = OPERATIONS.RECT;
                } else if (e.key == 'o') {
                    this.choosenCommand = OPERATIONS.CIRCLE;
                } else if (e.key == 'a') {
                    this.choosenCommand = OPERATIONS.ARC;
                } else if (e.key == 'f') {
                    this.choosenCommand = OPERATIONS.FILL; */
            } else if (e.key == 'l') {
                this.choosenCommand = OPERATIONS.LINE;
            } else if (e.key == 'r') {
                this.choosenCommand = OPERATIONS.RECT;
            } else if (e.key == 'c') {
                this.choosenCommand = OPERATIONS.CIRCLE;
            } else if (e.key == 'p') {
                this.choosenCommand = OPERATIONS.PAN;
            } else if (e.key == 0) {
                this.hasSnap = false;
            } else if (e.key == "1") {
                this.hasSnap = true;
                this.currentSnap = SNAP_GRID.L
            } else if (e.key == "2") {
                this.hasSnap = true;
                this.currentSnap = SNAP_GRID.M
            } else if (e.key == "3") {
                this.hasSnap = true;
                this.currentSnap = SNAP_GRID.S
            } else if (e.key == "4") {
                this.hasSnap = true;
                this.currentSnap = SNAP_GRID.XS
            } else if (e.ctrlKey && e.key == 'z') {
                // alert("Ctrl + Z shortcut combination was pressed");
                this.main.HM.undo()
            } else if (e.ctrlKey && e.key == 'y') {
                // alert("Ctrl + Y shortcut combination was pressed");
                this.main.HM.redo()
            }
        }
    }
}