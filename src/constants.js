export const APP_VERSION = '0.7.0';

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
    ONE: 1,         // pixels
    TEN: 10,        // cm
    HUNDRED: 100    // mt
};

export const OPERATIONS = {
    // VIEW
    PAN: "PAN",
    ZOOM: "ZOOM",
    SELECT: "SELECT",
    DELETE: "DELETE",
    // EDIT
    MOVE: 'MOVE',
    ROTATE: "ROTATE",
    COPY: 'COPY',
    RESIZE: "RESIZE",
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

export const COLORS_CMD_PANEL = [
    // NAVY
    '#001f3f',
    // Blue
    '#0074D9',
    // AQUA
    '#7FDBFF',
    // TEAL
    '#39CCCC',
    // OLIVE
    '#3D9970',
    // GREEN
    '#2ECC40',
    // LIME
    '#01FF70',
    // YELLOW
    '#FFDC00',
    // ORANGE
    '#FF851B',
    // BROWN
    '#8B4513',
    // RED
    '#FF4136',
    // MAROON
    '#85144b',
    // FUCHSIA
    '#F012BE',
    // PURPLE
    '#B10DC9',
    // BLACK-
    '#111111',
    // GRAY
    '#AAAAAA',
    // SILVER
    '#DDDDDD'
];

export const COLORS = {
    grey: {
        shapes_fill_temp: '#E8E9E9',
        shapes_fill_selected: 'rgb(200,0,100,0.25)',
        shapes_stroke: 'white',
        shapes_stroke_selected: 'salmon',
        LINES: 'grey',
        CURSOR: 'orange',
        CANVAS: "rgb(31,40,49)",
        LINES_BIG: "rgb(48,55,71)",
        LINES_SMALL: "rgb(36,45,56)"
    },
    blue: {
        shapes_fill_temp: '#E8E9E9',
        shapes_fill_selected: 'rgba(200,0,100,0.25)',
        shapes_stroke: '#D1D3D4',
        shapes_stroke_selected: 'salmon',
        LINES: 'white',
        CURSOR: '#ad7fa8',
        CANVAS: "#0f223e",
        LINES_BIG: "rgb(48,55,71)",
        LINES_SMALL: "rgb(36,45,56)"
    },
    white: {
        shapes_fill_temp: '#D1D3D4',
        shapes_fill_selected: 'rgba(231,76,60,0.25)',
        shapes_stroke: 'black',
        shapes_stroke_selected: 'salmon',
        LINES: 'black',
        CURSOR: '#2ecc71',
        CANVAS: "rgb(235,242,250)",
        LINES_BIG: "#D1D3D4",
        LINES_SMALL: "#E8E9E9"
    }
}

export const TEXT = {
    OFFSET: 5,
    FONT: '13px Arial'
}

export const ANIMATION = {
    TIME: 1,
    STEP: .05
}