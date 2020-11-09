export class Mouse {

    constructor(canvas) {
        // Current mouse position on the screen, at any time regardless of state
        this.current = {
            x: 0,
            y: 0
        };

        // Memorized mouse position (for measuring dragging distance)
        this.memory = {
            x: 0,
            y: 0
        };

        this.difference = {
            x: 0,
            y: 0
        }; // Difference
        this.inverse = {
            x: 0,
            y: 0
        }; // Handle negative distance
        this.dragging = false; // Not dragging by default
        // Mouse Button Was Clicked!
        canvas.addEventListener("mousedown", (e) => {
            // We are not currently dragging
            if (this.dragging == false) {
                // Start tracking dragging coordinates
                this.dragging = true;
                // Memorize mouse click location
                this.memory.x = this.current.x;
                this.memory.y = this.current.y;
                // Reset inverse coordinates
                this.inverse.x = this.memory.x;
                this.inverse.y = this.memory.y;
            }
        });
        // Mouse Button Was Released!
        canvas.addEventListener("mouseup", (e) => {
            // Mouse button has been released, disable drag state
            this.dragging = false;
            // Reset everything to 0
            this.current.x = 0;
            this.current.y = 0;
            this.memory.x = 0;
            this.memory.y = 0;
            this.difference.x = 0;
            this.difference.y = 0;
            this.inverse.x = 0;
            this.inverse.y = 0;
        });
        // Capture Mouse Move Event
        canvas.addEventListener("mousemove", (e) => {
            // Get the mouse coordinates 
            this.current.x = e.pageX;
            this.current.y = e.pageY;
            // If mouse is currently being dragged
            if (this.dragging) {
                this.difference.x = this.current.x - this.memory.x;
                this.difference.y = this.current.y - this.memory.y;
                if (this.current.x < this.memory.x)
                    this.inverse.x = this.current.x;
                if (this.current.y < this.memory.y)
                    this.inverse.y = this.current.y;
            }
        });
    }
};