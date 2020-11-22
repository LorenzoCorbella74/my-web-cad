export default class InputDialogue {

    constructor(app) {

        this.main = app
        // Get the modal
        this.modal = document.getElementById("myModal");
        this.content = this.modal.querySelector(".modal-content")
        this.input = this.modal.querySelector(".modal-content input")
        // Get the <span> element that closes the modal
        this.closeBtn = document.getElementsByClassName("close")[0];
        this.saveBtn = document.getElementsByClassName("save")[0];

        this.closeBtn.addEventListener('click', this.close.bind(this))
        this.saveBtn.addEventListener('click', this.save.bind(this))

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == this.modal /* && this.isOpen */) {
                this.close(event)
            }
        }
    }

    close(e) {
        this.modal.style.display = "none";
        /* this.isOpen = false; */
    }

    save(e) {
        this.close();
        this.callback && this.callback({ x: this.x, y: this.y, val: this.input.value });
        this.input.value = '';
    }

    open(x, y, value, callback) {
        /* this.isOpen = true; */
        this.x = x;
        this.y = y;
        this.modal.style.display = "block";
        this.content.style.position = "absolute";
        this.content.style.left = x + 'px';
        this.content.style.top = y + 'px';
        this.input.value = value
        this.input.focus()
        this.callback = callback;
    }
}