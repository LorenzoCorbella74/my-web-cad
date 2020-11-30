export const colorsTable = {}

export function trackSelection (shape) {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    let key = `rgb(${r},${g},${b})`;
    shape.colorKey = key;
    if (!(key in colorsTable)) {
        colorsTable[key] = shape
    }
    return shape;
}

export function interpolate (a = { x: 0, y: 0 }, b = { x: 0, y: 0 }, frac) {
    var nx = a.x + (b.x - a.x) * frac;
    var ny = a.y + (b.y - a.y) * frac;
    return { x: nx, y: ny };
}

export function formatDate (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
export function hexToRGB (h) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }
    return `rgba(${+r},${+g},${+b},.3)`;
}