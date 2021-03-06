import { APP_VERSION, COLORS_CMD_PANEL, SNAP_GRID, UNITS } from '../constants';
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
        this.colors = document.querySelector('.colors');
        this.fillBtn = document.querySelector('.right');
        this.slider = document.querySelector('.slider');

        this.generateColors();

        this.choosenCommand = 'SELECT'; // default
        this.adjustSelection();
        this.adjustColorSelection(this.main.selectedColorInPanel)

        // EVENTS
        this.header.onmousedown = this.dragMouseDown.bind(this);
        this.panel.onclick = this.click.bind(this);

        // EVENTS from USER KEYBOARDS
        document.body.addEventListener('CMD-KEYS', (passed) => {
            console.log(`Event from keyboard: ${passed.detail}`);
            this.choosenCommand = passed.detail;
            this.adjustSelection()
        }, true);

        // EVENTS from USER KEYBOARDS for SNAP
        document.body.addEventListener('CMD-SNAP', (passed) => {
            console.log(`Event from keyboard: ${passed.detail}`);
            this.slider.value = passed.detail;
        }, true);

        // EVENTS from USER SELECTION
        document.body.addEventListener('SELECT-ITEM', (passed) => {
            console.log(`Selected element: ${passed.detail}`);
            if (passed.detail || passed.detail == 0) {
                this.main.selectedColorInPanel = this.main.shapes[passed.detail].color;
                this.adjustColorSelection(this.main.selectedColorInPanel)
            }
        }, true);

        this.slider.addEventListener('input', (e) => {
            switch (e.target.value) {
                case '0':
                    this.main.keys.hasSnap = false;
                    break;
                case '1':
                    this.main.keys.hasSnap = true;
                    this.main.keys.currentSnap = SNAP_GRID.XL
                    break;
                case '2':
                    this.main.keys.hasSnap = true;
                    this.main.keys.currentSnap = SNAP_GRID.L
                    break;
                case '3':
                    this.main.keys.hasSnap = true;
                    this.main.keys.currentSnap = SNAP_GRID.M
                    break;
                case '4':
                    this.main.keys.hasSnap = true;
                    this.main.keys.currentSnap = SNAP_GRID.S
                    break;
                case '5':
                    this.main.keys.hasSnap = true;
                    this.main.keys.currentSnap = SNAP_GRID.XS
                    break;
                default:
                    this.main.keys.hasSnap = true;
                    this.main.keys.currentSnap = SNAP_GRID.M
                    break;
            }
        }, false);
    }

    // http://clrs.cc/
    generateColors () {
        let li = COLORS_CMD_PANEL;
        this.colors.innerHTML = '<ul>' + li.map((e) => `<li class="color-dot" data-color="${e}" style="background-color:${e}"></li>`)
            .join('') + '</ul>';
        this.colors.addEventListener('click', this.selectColor.bind(this))
    }

    selectColor (evt) {
        let c = evt.target.dataset.color;
        this.main.selectedColorInPanel = c;
        this.adjustColorSelection(c);
    }

    adjustColorSelection (c) {
        let items = this.colors.getElementsByTagName("li");
        for (let i = 0; i < items.length; ++i) {
            items[i].classList.remove('selected-color');
            if (items[i].dataset.color === c) {
                items[i].classList.add('selected-color');
            }
        }
        if (this.main.selected || this.main.selected == 0) {
            this.main.shapes[this.main.selected].color = this.main.selectedColorInPanel;
        }
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
                this.fillBtn.classList.toggle('hide')
                return;
            }
            if (this.choosenCommand === 'CONFIG') {
                this.switchUnitSystem()
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
                window.open("https://github.com/LorenzoCorbella74/my-web-cad");
                return;
            }
            if (this.choosenCommand === 'PALETTE') {
                this.switchTheme()
                return;
            }
            if (!e.target.classList.contains('disabled')) {
                const event = new CustomEvent('CMD-PANEL', { bubbles: true, detail: this.choosenCommand });
                this.panel.dispatchEvent(event);
                this.adjustSelection()
            }
        }
    }

    switchUnitSystem () {
        let options = Object.keys(UNITS);
        let index = options.findIndex(e => e === this.main.choosenUnitSystem);
        if (index < options.length - 1) {
            index++;
        } else {
            index = 0;
        }
        this.main.choosenUnitSystem = options[index];
    }
    switchTheme () {
        let options = ['grey', 'white', 'blue'];
        let index = options.findIndex(e => e === this.main.selectedTheme);
        if (index < options.length - 1) {
            index++;
        } else {
            index = 0;
        }
        this.main.selectedTheme = options[index];
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
            shapes: this.main.HM.value,
            theme: this.main.selectedTheme
        }
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(output));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `draw_${formatDate(new Date())}.json`); // ``
        dlAnchorElem.click();
    }

    createDrawingFromImportedFile (data) {
        this.main.selectedTheme = data.theme;
        this.main.HM.clean();
        this.main.shapes = data.shapes;
        this.main.HM.set(this.main.shapes);
    }

}