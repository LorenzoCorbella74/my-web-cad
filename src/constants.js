export const CANVAS_DIMENSIONS = {
    WIDTH: 4000,
    HEIGHT: 3000
}

// key : value in pixel
export const SNAP_GRID = {
    'XS': 5,
    'S': 10,
    'M': 20,
    'L': 40,
    'XL': 80
};

// proportion from different unit measures 
// pixels are the base...
export const UNITS = {
    ONE: 1,
    TEN: 10,
    HUNDRED: 100
};

export const OPERATIONS = {
    // view
    PAN: "PAN",
    ZOOM: "ZOOM",
    SELECT: "SELECT",
    DELETE: "DELETE",
    // MODIFICA
    MOVE: 'MOVE',
    ROTATE: "ROTATE",
    COPY: 'COPY',
    RESIZE: "RESIZE",
    // SCALE: 'SCALE',
    // SHAPES
    LINE: 'LINE',
    RECT: 'RECT',
    CIRCLE: 'CIRCLE',
    ARC: 'ARC',
    // STYLE
    FILL: 'FILL',
    // UTILS
    TEXT: 'TEXT',
    MEASURES: 'MEASURES'
};

export const COLORS = {
    shapes_fill: 'rgba(100,100,255,0.25)',
    shapes_fill_temp: 'rgba(100,100,180,0.20)',
    shapes_fill_selected: 'rgba(200,0,100,0.25)',
    shapes_stroke: 'white',
    shapes_stroke_selected: 'salmon',
    LINES: 'grey',
    CURSOR: 'rgb(1, 255, 112)',
    CANVAS: "rgb(31,40,49)",
    LINES_BIG: "rgb(48,55,71)",
    LINES_SMALL: "rgb(36,45,56)"
}

export const TEXT = {
    OFFSET: 5,
    FONT: '11px Arial'
}