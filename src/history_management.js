export default class HistoryManagement {

    constructor(main) {
        this.main = main
        this.history = [[]];
        this.position = 0;
    }

    get value() {
        return this.history[this.position];
    }

    get selected() {
        return this.history[this.position].find(e => e.selected)[0];
    }

    set(value) {
        if (this.position < this.history.length - 1) {
            this.history = this.history.slice(0, this.position + 1);
        }
        this.history.push([...value]);
        this.position += 1;
    }

    undo() {
        if (this.position > 0) {
            this.position--;
            this.main.shapes = [...this.value];
        } else {
            console.log('No more undo ...')
        }
    }

    redo() {
        if (this.position < this.history.length - 1) {
            this.position++;
            this.main.shapes = [...this.value];
        } else {
            console.log('No more redo ...')
        }
    }

    // toString function to aid in illustrating
    toString() {
        console.log("Currnent Value: ", this.value)
        console.log("History: ", this.history)
        console.log("Position: ", this.position);
    }
}
