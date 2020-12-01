import Command from './command';

import { COLORS } from '../constants';

export default class ResizeCommand extends Command {

    constructor(state) {
        super(state)

        this.isResizeDrag = false;
        this.expectResize = -1;
        this.selectionHandles = [{}, {}, {}, {}, {}, {}, {}, {}];

        this.mySelColor = '#CC0000';
        this.mySelWidth = 10;
        this.mySelBoxColor = 'darkred'; // New for selection boxes
        this.mySelBoxSize = 10;
    }

    click (e) {
        // get pixel under cursor
        const pixel = this.main.gctx.getImageData(e._x * this.main.zoomLevel, e._y * this.main.zoomLevel, 1, 1).data;
        // create rgb color for that pixel
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        // find a shape with the same colour

        this.main.shapes.forEach((item, index) => {
            if (item.colorKey === color) {
                item.selected = true;
                this.main.selected = index;
            } else {
                item.selected = false;
            }
        });
        if (this.main.shapes.every(e => e.selected === false)) {
            this.main.selected = null;
        }

        // if there is a selected and is a rectangle
        if ((this.main.selected || this.main.selected === 0) /* && this.main.shapes[this.main.selected].w */) {
            this.createBoxes();
        } else {
            this.removeBoxes();
        }
    }

    removeBoxes () {
        this.main.tempShape.length = 0;
        this.selectionHandles = [{}, {}, {}, {}, {}, {}, {}, {}];
    }

    createBoxes () {
        let half = this.mySelBoxSize / 2;
        let choosen = this.main.shapes[this.main.selected]

        // 0  1  2
        // 3     4
        // 5  6  7

        if (choosen.w && choosen.h) {
            // top left, middle, right
            this.selectionHandles[0].x = choosen.start_x - half;
            this.selectionHandles[0].y = choosen.start_y - half;

            this.selectionHandles[1].x = choosen.start_x + choosen.w / 2 - half;
            this.selectionHandles[1].y = choosen.start_y - half;

            this.selectionHandles[2].x = choosen.start_x + choosen.w - half;
            this.selectionHandles[2].y = choosen.start_y - half;

            //middle left
            this.selectionHandles[3].x = choosen.start_x - half;
            this.selectionHandles[3].y = choosen.start_y + choosen.h / 2 - half;

            //middle right
            this.selectionHandles[4].x = choosen.start_x + choosen.w - half;
            this.selectionHandles[4].y = choosen.start_y + choosen.h / 2 - half;

            //bottom left, middle, right
            this.selectionHandles[6].x = choosen.start_x + choosen.w / 2 - half;
            this.selectionHandles[6].y = choosen.start_y + choosen.h - half;

            this.selectionHandles[5].x = choosen.start_x - half;
            this.selectionHandles[5].y = choosen.start_y + choosen.h - half;

            this.selectionHandles[7].x = choosen.start_x + choosen.w - half;
            this.selectionHandles[7].y = choosen.start_y + choosen.h - half;
        } else if (choosen.radius) {
            // top left, middle, right
            this.selectionHandles[0].x = choosen.start_x - choosen.radius - half;
            this.selectionHandles[0].y = choosen.start_y - choosen.radius - half;

            this.selectionHandles[1].x = choosen.start_x - half;
            this.selectionHandles[1].y = choosen.start_y - choosen.radius - half;

            this.selectionHandles[2].x = choosen.start_x + choosen.radius - half;
            this.selectionHandles[2].y = choosen.start_y - choosen.radius - half;

            //middle left
            this.selectionHandles[3].x = choosen.start_x - choosen.radius - half;
            this.selectionHandles[3].y = choosen.start_y - half;

            //middle right
            this.selectionHandles[4].x = choosen.start_x + choosen.radius - half;
            this.selectionHandles[4].y = choosen.start_y - half;

            //bottom left, middle, right
            this.selectionHandles[6].x = choosen.start_x - half;
            this.selectionHandles[6].y = choosen.start_y + choosen.radius - half;

            this.selectionHandles[5].x = choosen.start_x - choosen.radius - half;
            this.selectionHandles[5].y = choosen.start_y + choosen.radius - half;

            this.selectionHandles[7].x = choosen.start_x + choosen.radius - half;
            this.selectionHandles[7].y = choosen.start_y + choosen.radius - half;
        }


        let anchors = []
        for (let i = 0; i < 8; i++) {
            let ret = this.selectionHandles[i];
            anchors.push({
                start_x: this.selectionHandles[i].x /* - this.main.netPanningX */,
                start_y: this.selectionHandles[i].y /* - this.main.netPanningY */,
                w: this.mySelWidth,
                h: this.mySelWidth,
                color: this.mySelColor,
                stroke: COLORS[this.main.selectedTheme].shapes_stroke
            })
        }
        this.main.tempShape = [...anchors]
    }

    mousemove (e) {
        this.main.mouse.x = e._x;
        this.main.mouse.y = e._y;
        this.main.mouse.event = e;

        let mySel = this.main.shapes[this.main.selected]
        let mx = this.main.mouse.x - this.main.netPanningX
        let my = this.main.mouse.y - this.main.netPanningY

        if (this.isResizeDrag && mySel) {

            let oldx = mySel.start_x;
            let oldy = mySel.start_y;

            // 0  1  2
            // 3     4
            // 5  6  7
            if (mySel.w && mySel.h) {

                switch (this.expectResize) {
                    case 0:
                        mySel.start_x = mx;
                        mySel.start_y = my;
                        mySel.w += oldx - mx;
                        mySel.h += oldy - my;
                        break;
                    case 1:
                        mySel.start_y = my;
                        mySel.h += oldy - my;
                        break;
                    case 2:
                        mySel.start_y = my;
                        mySel.w = mx - oldx;
                        mySel.h += oldy - my;
                        break;
                    case 3:
                        mySel.start_x = mx;
                        mySel.w += oldx - mx;
                        break;
                    case 4:
                        mySel.w = mx - oldx;
                        break;
                    case 5:
                        mySel.start_x = mx;
                        mySel.w += oldx - mx;
                        mySel.h = my - oldy;
                        break;
                    case 6:
                        mySel.h = my - oldy;
                        break;
                    case 7:
                        mySel.w = mx - oldx;
                        mySel.h = my - oldy;
                        break;
                }
            } else if (mySel.radius) {
                let dx = oldx - mx;
                let dy = oldy - my;
                let dr = Math.sqrt(dx * dx + dy * dy);
                mySel.radius = dr; // updating radius
            }
            this.createBoxes()
        }


        if (mySel !== null && !this.isResizeDrag) {
            for (var i = 0; i < 8; i++) {
                // 0  1  2
                // 3     4
                // 5  6  7

                var cur = this.selectionHandles[i];

                // we dont need to use the ghost context because
                // selection handles will always be rectangles
                if (mx >= cur.x && mx <= cur.x + this.mySelBoxSize &&
                    my >= cur.y && my <= cur.y + this.mySelBoxSize) {
                    // we found one!
                    this.expectResize = i;

                    switch (i) {
                        case 0:
                            this.main.canvas.style.cursor = 'nw-resize';
                            break;
                        case 1:
                            this.main.canvas.style.cursor = 'n-resize';
                            break;
                        case 2:
                            this.main.canvas.style.cursor = 'ne-resize';
                            break;
                        case 3:
                            this.main.canvas.style.cursor = 'w-resize';
                            break;
                        case 4:
                            this.main.canvas.style.cursor = 'e-resize';
                            break;
                        case 5:
                            this.main.canvas.style.cursor = 'sw-resize';
                            break;
                        case 6:
                            this.main.canvas.style.cursor = 's-resize';
                            break;
                        case 7:
                            this.main.canvas.style.cursor = 'se-resize';
                            break;
                    }
                    return;
                }
            }
            // not over a selection box, return to normal
            this.isResizeDrag = false;
            this.expectResize = -1;
            this.main.canvas.style.cursor = 'auto';

        }

    }

    mousedown (e) {
        // console.log('Command: mousedown', e, this)
        //we are over a selection box
        if (this.expectResize !== -1) {
            this.isResizeDrag = true;
            return;
        }
    }

    mouseup (event) {
        // console.log('Command: mouseup', event, this)
        this.isResizeDrag = false;
        this.expectResize = -1;
    }

}