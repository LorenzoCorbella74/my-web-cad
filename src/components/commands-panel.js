export default class CommandsPanel {
    constructor(app) {

        this.main = app
        this.x = this.x || 50
        this.y = this.y || 50
        this.newX = this.newX || 0
        this.newY = this.newY || 0
        this.panel = document.querySelector('#panel')
        this.header = document.querySelector('#panel-header')

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
            const event = new CustomEvent('CMD-PANEL', { bubbles: true, detail: this.choosenCommand });
            this.adjustSelection()
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
                console.log('TODO: config')
                return;
            }
            if (this.choosenCommand === 'IMPORT') {
                console.log('TODO: config')
                return;
            }
            if (!e.target.classList.contains('disabled')) {
                this.panel.dispatchEvent(event);
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
}