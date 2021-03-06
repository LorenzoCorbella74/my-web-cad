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

        document.body.addEventListener('CMD-PANEL', (passed) => {
            this.choosenCommand = passed.detail;
        }, false);
    }

    startListenDocumentKeyup() {
        document.onkeyup = (e) => {

            // track keyboard events only if the text input modal is not open
            if (!this.main.textModal.isOpen) {

                if (e.key == 'Escape' || e.key == 's') {
                    this.choosenCommand = OPERATIONS.SELECT;
                    this.main.shapes.forEach(e => {
                        e.selected = false;
                    });
                    this.main.selected = null;
                    /* 
                } else if (e.key == 'a') {
                    this.choosenCommand = OPERATIONS.ARC;*/
                } else if (e.key == 'w') {
                    this.choosenCommand = OPERATIONS.ROTATE;
                } else if (e.key == 'f') {
                    this.choosenCommand = OPERATIONS.MEASURES;
                } else if (e.key == 'e') {
                    this.choosenCommand = OPERATIONS.RESIZE;
                } else if (e.key == 'c') {
                    this.choosenCommand = OPERATIONS.COPY;
                } else if (e.key == 'm') {
                    this.choosenCommand = OPERATIONS.MOVE;
                } else if (e.key == 'd') {
                    this.choosenCommand = OPERATIONS.DELETE;
                } else if (e.key == 'l') {
                    this.choosenCommand = OPERATIONS.LINE;
                } else if (e.key == 'r') {
                    this.choosenCommand = OPERATIONS.RECT;
                } else if (e.key == 'a') {
                    this.choosenCommand = OPERATIONS.CIRCLE;
                } else if (e.key == 'p') {
                    this.choosenCommand = OPERATIONS.PAN;
                } else if (e.key == 't') {
                    this.choosenCommand = OPERATIONS.TEXT;
                } else if (e.key == 0) {
                    this.hasSnap = false;
                    this.sendCustomEvent('CMD-SNAP', '0');
                } else if (e.key == "1") {
                    this.hasSnap = true;
                    this.currentSnap = SNAP_GRID.XL
                    this.sendCustomEvent('CMD-SNAP', '1');
                } else if (e.key == "2") {
                    this.hasSnap = true;
                    this.currentSnap = SNAP_GRID.L
                    this.sendCustomEvent('CMD-SNAP', '2');
                } else if (e.key == "3") {
                    this.hasSnap = true;
                    this.currentSnap = SNAP_GRID.M
                    this.sendCustomEvent('CMD-SNAP', '3');
                } else if (e.key == "4") {
                    this.hasSnap = true;
                    this.currentSnap = SNAP_GRID.S
                    this.sendCustomEvent('CMD-SNAP', '4');
                } else if (e.key == "5") {
                    this.hasSnap = true;
                    this.currentSnap = SNAP_GRID.XS
                    this.sendCustomEvent('CMD-SNAP', '5');
                } else if (e.ctrlKey && e.key == 'z') {
                    this.main.HM.undo()
                } else if (e.ctrlKey && e.key == 'y') {
                    this.main.HM.redo()
                } else if (e.ctrlKey && e.key == 'x') {
                    this.main.zoomLevel = 1;
                } else if (e.altKey && e.key == '+') {
                    this.main.zoomLevel += 0.1;
                } else if (e.altKey && e.key == '-') {
                    this.main.zoomLevel -= 0.1;
                } else if (e.key == 'x') {
                    this.choosenCommand = OPERATIONS.ZOOM;
                }
            }

            this.sendCustomEvent('CMD-KEYS', this.choosenCommand);

        }
    }

    sendCustomEvent(key, payload) {
        const event = new CustomEvent(key, { bubbles: true, detail: payload });
        document.body.dispatchEvent(event);
    }
}