import { CANVAS_DIMENSIONS, COLORS, TEXT } from './constants';
import { hexToRGB } from './utils';

export function renderPointer (scope) {
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

export function renderCanvas (scope) {
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

export function renderShapes (scope, ctx, hit) {
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
                ctx.rect(item.start_x, item.start_y - 13, 9 * item.text.length, 20) /* 9px for each char */
                ctx.fill()
                ctx.stroke()
                ctx.restore()
            } else {
                ctx.save()
                ctx.fillStyle = item.selected ? COLORS[scope.selectedTheme].shapes_fill_selected : (hit ? item.colorKey : item.color)
                ctx.beginPath()
                ctx.font = item.font;
                ctx.fillText(item.text, item.start_x, item.start_y);
                ctx.restore()
            }
        } else if (item.textMidLine) {
            if (hit) {
                // TODO
            } else {
                drawLineWithArrows(ctx, item.start_x, item.start_y, item.end_x, item.end_y, 5, 8, true, true)
                textAtMidLine(scope, ctx, item, hit)
            }
        } else if (item.w && item.h) {
            ctx.save()
            ctx.fillStyle = item.selected ? COLORS[scope.selectedTheme].shapes_fill_selected : (hit ? item.colorKey : hexToRGB(item.color))
            ctx.strokeStyle = item.selected ? COLORS[scope.selectedTheme].shapes_stroke_selected : (hit ? item.colorKey : item.stroke)
            ctx.beginPath()
            ctx.rect(item.start_x, item.start_y, item.w, item.h)
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
            ctx.save()
            ctx.strokeStyle = item.selected ? COLORS[scope.selectedTheme].shapes_stroke_selected : (hit ? item.colorKey : item.stroke)
            ctx.beginPath()
            if (item.dashed) {
                ctx.setLineDash([3.5, 10]);
            }
            ctx.moveTo(item.start_x, item.start_y)
            ctx.lineTo(item.end_x, item.end_y)
            ctx.closePath()
            ctx.stroke()
            ctx.restore()
        }
    });
}

// SOURCE: https://stackoverflow.com/questions/34402883/finding-the-midway-between-two-points
function textAtMidLine (scope, ctx, line, hit) {

    // save the unmodified context state
    ctx.save();

    // calc line's midpoint
    var midX = line.start_x + (line.end_x - line.start_x) * 0.50;
    var midY = line.start_y + (line.end_y - line.start_y) * 0.50;

    // calc width of text
    ctx.font = line.font;
    var textwidth = ctx.measureText(line.textMidLine).width;

    // clear the line at the midpoint
    ctx.globalCompositeOperation = 'destination-out'; // "erases" 
    // ctx.fillStyle = COLORS[scope.selectedTheme].CANVAS;
    ctx.fillRect(midX - textwidth / 2, midY - 13 / 2, textwidth, 13 * 1.286);
    ctx.globalCompositeOperation = 'source-over';  // reset to default

    // tell canvas to horizontally & vertically center text around an [x,y]
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'

    // ctx.fillStyle = 'black';
    // draw text at the midpoint
    ctx.fillText(line.textMidLine, midX, midY);

    // restore the unmodified context state
    ctx.restore();
}


function drawLineWithArrows (ctx, x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd, hit) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var angle = Math.atan2(dy, dx);
    var length = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = 'grey';
    ctx.translate(x0, y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    if (arrowStart) {
        ctx.moveTo(aLength, -aWidth);
        ctx.lineTo(0, 0);
        ctx.lineTo(aLength, aWidth);
    }
    if (arrowEnd) {
        ctx.moveTo(length - aLength, -aWidth);
        ctx.lineTo(length, 0);
        ctx.lineTo(length - aLength, aWidth);
    }
    //
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}