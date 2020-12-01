import { CANVAS_DIMENSIONS, COLORS, TEXT } from './constants';
import { hexToRGB } from './utils';

export function renderPointer(scope) {
    scope.ctx.strokeStyle = COLORS[scope.selectedTheme].CURSOR; // green
    scope.ctx.strokeRect(scope.mouse.x - 5 - scope.netPanningX, scope.mouse.y - 5 - scope.netPanningY, 10, 10);
    scope.ctx.lineWidth = 0.5;
    scope.ctx.setLineDash([scope.keys.currentSnap, scope.keys.currentSnap]);   // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
    scope.ctx.beginPath();
    scope.ctx.moveTo(scope.mouse.x - scope.netPanningX, 0);
    scope.ctx.lineTo(scope.mouse.x - scope.netPanningX, scope.mouse.y - 5 - scope.netPanningY);
    scope.ctx.moveTo(scope.mouse.x - scope.netPanningX, scope.mouse.y + 5 - scope.netPanningY);
    scope.ctx.lineTo(scope.mouse.x - scope.netPanningX, CANVAS_DIMENSIONS.HEIGHT);
    scope.ctx.moveTo(0, scope.mouse.y - scope.netPanningY);
    scope.ctx.lineTo(scope.mouse.x - 5 - scope.netPanningX, scope.mouse.y - scope.netPanningY);
    scope.ctx.moveTo(scope.mouse.x + 5 - scope.netPanningX, scope.mouse.y - scope.netPanningY);
    scope.ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, scope.mouse.y - scope.netPanningY);
    scope.ctx.stroke();
    scope.ctx.fillStyle = COLORS[scope.selectedTheme].LINES;
    scope.ctx.fillText(`${scope.keys.choosenCommand.toUpperCase()}`, scope.mouse.x + 12.5 - scope.netPanningX, scope.mouse.y - 4.5 - scope.netPanningY)
    scope.ctx.fillText(`x: ${scope.getValueAccordingToUnitSystem(scope.mouse.x - scope.netPanningX)} - y: ${scope.getValueAccordingToUnitSystem(scope.mouse.y - scope.netPanningY)}`, scope.mouse.x + 12.5 - scope.netPanningX, scope.mouse.y + 12.5 - scope.netPanningY)
    scope.ctx.fillText(`${scope.info}`, scope.mouse.x + 12.5 - scope.netPanningX, scope.mouse.y + 27.5 - scope.netPanningY)
    scope.ctx.closePath();
    scope.ctx.setLineDash([]);
}

export function renderCanvas(scope) {
    scope.ctx.fillStyle = COLORS[scope.selectedTheme].CANVAS;
    scope.ctx.fillRect(0, 0, CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT);
    // colonne
    for (let i = 0; i < CANVAS_DIMENSIONS.WIDTH; i += scope.keys.currentSnap) {
        if (scope.keys.hasSnap) {
            scope.ctx.beginPath();
            scope.ctx.moveTo(i + 0.5, 0);
            scope.ctx.lineTo(i + 0.5, CANVAS_DIMENSIONS.HEIGHT);
            if (i % 100 === 0) {
                scope.ctx.strokeStyle = COLORS[scope.selectedTheme].LINES_BIG;
            } else {
                scope.ctx.strokeStyle = COLORS[scope.selectedTheme].LINES_SMALL;
            }
            scope.ctx.lineWidth = 0.5;
            scope.ctx.closePath()
            scope.ctx.stroke();
        }
        if (i % 100 === 0) {
            scope.ctx.font = TEXT.FONT;
            scope.ctx.fillStyle = COLORS[scope.selectedTheme].LINES;
            // scope.ctx.textAlign = "center";
            scope.ctx.fillText(
                scope.getValueAccordingToUnitSystem(i).toString(),
                i + 2.5, 10 - (scope.netPanningY > 0 ? 0 : scope.netPanningY));
        }
    }
    // righe
    for (let i = 0; i < CANVAS_DIMENSIONS.HEIGHT; i += scope.keys.currentSnap) {
        if (scope.keys.hasSnap) {
            scope.ctx.beginPath();
            scope.ctx.moveTo(0, i + 0.5);
            scope.ctx.lineTo(CANVAS_DIMENSIONS.WIDTH, i + 0.5);
            if (i % 100 === 0) {
                scope.ctx.strokeStyle = COLORS[scope.selectedTheme].LINES_BIG;
            } else {
                scope.ctx.strokeStyle = COLORS[scope.selectedTheme].LINES_SMALL;
            }
            scope.ctx.lineWidth = 0.5;
            scope.ctx.closePath()
            scope.ctx.stroke();
        }
        if (i % 100 === 0) {
            scope.ctx.font = TEXT.FONT;
            scope.ctx.fillStyle = COLORS[scope.selectedTheme].LINES;
            // scope.ctx.textAlign = "center";
            scope.ctx.fillText(
                scope.getValueAccordingToUnitSystem(i).toString(),
                2.5 - (scope.netPanningX > 0 ? 0 : scope.netPanningX), i - 2.5);
        }
    }
}

export function renderShapes(scope, ctx, hit) {
    [...scope.HM.value, ...scope.tempShape].forEach(item => {
        if (hit) {
            ctx.lineWidth = 10 // to select lines or sides of rect...
        } else {
            ctx.lineWidth = 0.5
        }
        if (item.text) {
            if (hit) {
                ctx.save()
                ctx.fillStyle = item.colorKey
                ctx.beginPath()
                let textLength = ctx.measureText(item.text).width;
                // console.log(textLength, 9 * item.text.length) /* 9px for each char */
                ctx.rect(item.start_x - textLength / 2, item.start_y - 13, textLength, 20)
                ctx.fill()
                ctx.stroke()
                ctx.restore()
            } else {
                ctx.save()
                ctx.fillStyle = item.selected ? COLORS[scope.selectedTheme].shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.beginPath()
                ctx.font = item.font;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle'
                ctx.fillText(item.text, item.start_x, item.start_y);
                ctx.restore()
            }
        } else if (item.w && item.h) {
            ctx.save()
            ctx.fillStyle = item.selected ? COLORS[scope.selectedTheme].shapes_fill_selected : (hit ? item.colorKey : hexToRGB(item.color))
            ctx.strokeStyle = item.selected ? COLORS[scope.selectedTheme].shapes_stroke_selected : (hit ? item.colorKey : item.stroke)
            ctx.beginPath()
            ctx.translate(item.start_x + item.w / 2, item.start_y + item.h / 2);
            if (item.angle) {
                ctx.rotate(item.angle);
            }
            ctx.rect(-item.w / 2, -item.h / 2, item.w, item.h)
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        } else if (item.radius) {
            ctx.save()
            ctx.strokeStyle = item.selected ? COLORS[scope.selectedTheme].shapes_stroke_selected : (hit ? item.colorKey : item.stroke)
            ctx.fillStyle = item.selected ? COLORS[scope.selectedTheme].shapes_fill_selected : (hit ? item.colorKey : hexToRGB(item.color))
            ctx.beginPath()
            // x, y, radius, startAngle, endAngle, antiClockwise = false by default
            ctx.arc(item.start_x, item.start_y, item.radius, 0, 2 * Math.PI, false) // full circle
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        } else {
            drawLine(scope, ctx, item, hit);
        }
    });

}

function drawLine(scope, ctx, item, hit) {
    let aWidth = 5, aLength = 8;
    ctx.setLineDash([0, 0]);
    let dx = item.end_x - item.start_x;
    let dy = item.end_y - item.start_y;
    let angle = Math.atan2(dy, dx);
    let length = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = item.selected ? COLORS[scope.selectedTheme].shapes_stroke_selected : (hit ? item.colorKey : item.stroke);
    ctx.translate(item.start_x, item.start_y);
    ctx.rotate(angle);
    ctx.beginPath();
    if (item.dashed) {
        ctx.setLineDash([3.5, 10]);
    }
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    if (!hit && item.arrowStart) {
        ctx.moveTo(aLength, -aWidth);
        ctx.lineTo(0, 0);
        ctx.lineTo(aLength, aWidth);
    }
    if (!hit && item.arrowEnd) {
        ctx.moveTo(length - aLength, -aWidth);
        ctx.lineTo(length, 0);
        ctx.lineTo(length - aLength, aWidth);
    }
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}