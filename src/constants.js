export const CANVAS_DIMENSIONS = {
    WIDTH: 4000,
    HEIGHT: 3000
}

export const SNAP_GRID = {
    'XS': 5,
    'S': 10,
    'M': 20,
    'L': 40,
    'XL': 80
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
    // PULL: "PULL", una volta selezionato...
    // SCALE: 'SCALE',
    COPY: 'COPY',
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
    LINES: 'grey'
}