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