import { APP_VERSION } from '../constants';
import { formatDate } from '../utils';

export default class CommandsPanel {
    constructor(app) {

        this.main = app
        this.x = this.x || 0
        this.y = this.y || 0
        this.newX = this.newX || 0
        this.newY = this.newY || 0
        this.panel = document.querySelector('#panel')
        this.header = document.querySelector('#panel-header')
        this.paletteBtn = document.querySelector('.right');

        this.choosenCommand = 'SELECT'; // default
        this.adjustSelection();

        // EVENTS
        this.header.onmousedown = this.dragMouseDown.bind(this);
        this.panel.onclick = this.click.bind(this);

        document.body.addEventListener('CMD-KEYS', (passed) => {
            console.log(`Event from keyboard: ${passed.detail}`);
            this.choosenCommand = passed.detail;
            this.adjustSelection()
        }, true);
    }

    adjustSelection () {
        let all = this.panel.querySelectorAll('.cmd');
        for (let i = 0; i < all.length; i++) {
            const element = all[i];
            if (element.dataset.cmd === this.choosenCommand) {
                element.classList.add('selected');
            } else {
                element.classList.remove('selected')
            }
        }
    }

    click (e) {
        console.log(`Event from commands panel: ${e.target.dataset.cmd}`);
        this.choosenCommand = e.target.parentNode.dataset.cmd;
        if (this.choosenCommand) {
            if (this.choosenCommand === 'UNDO') {
                this.main.HM.undo();
                return;
            }
            if (this.choosenCommand === 'REDO') {
                this.main.HM.redo();
                return;
            }
            if (this.choosenCommand === 'FILL') {
                console.log('TODO: fill')
                return;
            }
            if (this.choosenCommand === 'CONFIG') {
                console.log('TODO: config')
                return;
            }
            if (this.choosenCommand === 'SAVE') {
                this.save();
                return;
            }
            if (this.choosenCommand === 'IMPORT') {
                this.import();
                return;
            }
            if (this.choosenCommand === 'HELP') {
                console.log('TODO: help')
                return;
            }
            if (this.choosenCommand === 'PALETTE') {
                this.paletteBtn.classList.toggle('hide')
                return;
            }
            if (!e.target.classList.contains('disabled')) {
                const event = new CustomEvent('CMD-PANEL', { bubbles: true, detail: this.choosenCommand });
                this.panel.dispatchEvent(event);
                this.adjustSelection()
            }
        }
    }
    
    dragMouseDown (e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        this.newX = e.clientX;
        this.newY = e.clientY;
        this.panel.onmouseup = this.closeDragElement.bind(this);
        // call a function whenever the cursor moves:
        this.panel.onmousemove = this.elementDrag.bind(this);
    }

    elementDrag (e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        this.x = this.newX - e.clientX;
        this.y = this.newY - e.clientY;
        this.newX = e.clientX;
        this.newY = e.clientY;
        // set the element's new position:
        this.panel.style.top = (this.panel.offsetTop - this.y) + "px";
        this.panel.style.left = (this.panel.offsetLeft - this.x) + "px";
    }

    closeDragElement () {
        /* stop moving when mouse button is released:*/
        this.panel.onmouseup = null;
        this.panel.onmousemove = null;
    }

    import () {
        let input = document.getElementById('file-input');
        input.onchange = e => {
            // getting a hold of the file reference
            var file = e.target.files[0];
            // setting up the reader
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
                var content = readerEvent.target.result; // this is the content!
                try {
                    this.createDrawingFromImportedFile(JSON.parse(content));
                } catch (error) {
                    console.log('Was not possible to import the file!')
                }
            }
        }
        input.click();
    }

    save () {
        let output = {
            ver: APP_VERSION,
            date: formatDate(new Date()),
            shapes: this.main.HM.value
        }
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(output));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `draw_${formatDate(new Date())}.json`); // ``
        dlAnchorElem.click();
    }

    createDrawingFromImportedFile (data) {
        this.main.HM.clean();
        this.main.shapes = data.shapes;
        this.main.HM.set(this.main.shapes   );
    }

}