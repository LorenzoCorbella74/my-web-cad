// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OPERATIONS = exports.SNAP_GRID = exports.CANVAS_DIMENSIONS = void 0;
var CANVAS_DIMENSIONS = {
  WIDTH: 4000,
  HEIGHT: 3000
};
exports.CANVAS_DIMENSIONS = CANVAS_DIMENSIONS;
var SNAP_GRID = {
  'XS': 10,
  'S': 20,
  'M': 25,
  'L': 50
};
exports.SNAP_GRID = SNAP_GRID;
var OPERATIONS = {
  // view
  PAN: "PAN",
  ZOOM: "ZOOM",
  SELECT: "SELECT",
  DELETE: "DELETE",
  // MODIFICA
  MOVE: 'MOVE',
  ROTATE: "ROTATE",
  PULL: "PULL",
  SCALE: 'SCALE',
  COPY: 'COPY',
  // SHAPES
  LINE: 'LINE',
  RECT: 'RECT',
  CIRCLE: 'CIRCLE',
  ARC: 'ARC',
  // STYLE
  FILL: 'FILL'
};
exports.OPERATIONS = OPERATIONS;
},{}],"src/keyboards_events.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// https://css-tricks.com/snippets/javascript/javascript-keycodes/
var KeyboardEvents = /*#__PURE__*/function () {
  function KeyboardEvents() {
    _classCallCheck(this, KeyboardEvents);

    // DEFAULTS
    this.currentCommand = _constants.OPERATIONS.SELECT;
    this.currentSnap = _constants.SNAP_GRID.M;
    this.hasSnap = true;
    this.startListenDocumentKeyup();
  }

  _createClass(KeyboardEvents, [{
    key: "startListenDocumentKeyup",
    value: function startListenDocumentKeyup() {
      document.onkeyup = function (e) {
        if (e.key == 'Escape' || e.key == 's') {
          this.currentCommand = _constants.OPERATIONS.SELECT;
        } else if (e.key == 'd') {
          this.currentCommand = _constants.OPERATIONS.DELETE;
        } else if (e.key == 'c') {
          this.currentCommand = _constants.OPERATIONS.COPY;
        } else if (e.key == 'm') {
          this.currentCommand = _constants.OPERATIONS.MOVE;
        } else if (e.key == 'r') {
          this.currentCommand = _constants.OPERATIONS.ROTATE;
        } else if (e.key == 'p') {
          this.currentCommand = _constants.OPERATIONS.PULL;
        } else if (e.key == 's') {
          this.currentCommand = _constants.OPERATIONS.SCALE;
        } else if (e.key == 'l') {
          this.currentCommand = _constants.OPERATIONS.LINE;
        } else if (e.key == 'q') {
          this.currentCommand = _constants.OPERATIONS.RECT;
        } else if (e.key == 'o') {
          this.currentCommand = _constants.OPERATIONS.CIRCLE;
        } else if (e.key == 'a') {
          this.currentCommand = _constants.OPERATIONS.ARC;
        } else if (e.key == 'f') {
          this.currentCommand = _constants.OPERATIONS.FILL;
        } else if (e.key == 0) {
          this.hasSnap = false;
        } else if (e.key == "1") {
          this.hasSnap = true;
          this.currentSnap = _constants.SNAP_GRID.L;
        } else if (e.key == "2") {
          this.hasSnap = true;
          this.currentSnap = _constants.SNAP_GRID.M;
        } else if (e.key == "3") {
          this.hasSnap = true;
          this.currentSnap = _constants.SNAP_GRID.S;
        } else if (e.key == "4") {
          this.hasSnap = true;
          this.currentSnap = _constants.SNAP_GRID.XS;
        } else if (e.ctrlKey && e.key == 'z') {
          alert("Ctrl + Z shortcut combination was pressed");
        } else if (e.ctrlKey && e.key == 'y') {
          alert("Ctrl + Y shortcut combination was pressed");
        }
      };
    }
  }]);

  return KeyboardEvents;
}();

exports.default = KeyboardEvents;
},{"./constants":"src/constants.js"}],"src/app.js":[function(require,module,exports) {
"use strict";

var _keyboards_events = _interopRequireDefault(require("./keyboards_events"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keys = {};
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var mouse = {
  x: 0,
  y: 0,
  event: null
}; // mouse drag related variables

var isDown = false;
var startX, startY; // the accumulated horizontal(X) & vertical(Y) panning the user has done in total

var netPanningX = 0;
var netPanningY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cursor = "none";
  drawAll();
}

function drawPointer() {
  ctx.strokeStyle = "rgb(0,103,28)"; // green

  ctx.strokeRect(mouse.x - 4.5 - netPanningX, mouse.y - 5.5 - netPanningY, 10, 10);
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(mouse.x - netPanningX, 0);
  ctx.lineTo(mouse.x - netPanningX, _constants.CANVAS_DIMENSIONS.HEIGHT);
  ctx.moveTo(0, mouse.y - netPanningY);
  ctx.lineTo(_constants.CANVAS_DIMENSIONS.WIDTH, mouse.y - netPanningY);
  ctx.stroke();
  ctx.fillStyle = "grey";
  ctx.fillText("".concat(keys.currentCommand.toUpperCase()), mouse.x + 12.5 - netPanningX, mouse.y - 4.5 - netPanningY);
  ctx.fillText("x: ".concat(mouse.x - netPanningX, " - y: ").concat(mouse.y - netPanningY), mouse.x + 12.5 - netPanningX, mouse.y + 12.5 - netPanningY);
  ctx.closePath();
}

function drawCanvas() {
  ctx.fillStyle = "rgb(31,40,49)";
  ctx.fillRect(0, 0, _constants.CANVAS_DIMENSIONS.WIDTH, _constants.CANVAS_DIMENSIONS.HEIGHT); // colonne

  for (var i = 0; i < _constants.CANVAS_DIMENSIONS.WIDTH; i += keys.currentSnap) {
    if (keys.hasSnap) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0);
      ctx.lineTo(i + 0.5, _constants.CANVAS_DIMENSIONS.HEIGHT);

      if (i % 100 === 0) {
        ctx.strokeStyle = "rgb(48,55,71)";
      } else {
        ctx.strokeStyle = "rgb(36,45,56)";
      }

      ctx.lineWidth = 0.5;
      ctx.closePath();
      ctx.stroke();
    }

    if (i % 100 === 0) {
      ctx.font = "11px Arial";
      ctx.fillStyle = "grey"; // ctx.textAlign = "center";

      ctx.fillText(i.toString(), i + 2.5, 10 - (netPanningY > 0 ? 0 : netPanningY));
    }
  } // righe


  for (var _i = 0; _i < _constants.CANVAS_DIMENSIONS.HEIGHT; _i += keys.currentSnap) {
    if (keys.hasSnap) {
      ctx.beginPath();
      ctx.moveTo(0, _i + 0.5);
      ctx.lineTo(_constants.CANVAS_DIMENSIONS.WIDTH, _i + 0.5);

      if (_i % 100 === 0) {
        ctx.strokeStyle = "rgb(48,55,71)";
      } else {
        ctx.strokeStyle = "rgb(36,45,56)";
      }

      ctx.lineWidth = 0.5;
      ctx.closePath();
      ctx.stroke();
    }

    if (_i % 100 === 0) {
      ctx.font = "11px Arial";
      ctx.fillStyle = "grey"; // ctx.textAlign = "center";

      ctx.fillText(_i.toString(), 2.5 - (netPanningX > 0 ? 0 : netPanningX), _i - 2.5);
    }
  }
}

function drawAll() {
  // ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // CANVAS_DIMENSIONS.WIDTH, CANVAS_DIMENSIONS.HEIGHT

  ctx.save();
  ctx.scale(1, 1
  /* this.viewport.scale[0], this.viewport.scale[1] */
  ); // apply scale

  ctx.translate(netPanningX, netPanningY); // apply translation

  drawCanvas();
  drawPointer();
  ctx.restore();
  console.log(keys);
}

function loop() {
  drawAll();
  requestAnimationFrame(function () {
    loop();
  });
}

function afterAll(e) {
  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation(); // clear the isDragging flag

  isDown = false;
}

window.onload = function () {
  keys = new _keyboards_events.default(); // resize the canvas to fill browser window dynamically

  window.addEventListener('resize', resizeCanvas, false);
  canvas.addEventListener('mousemove', function (e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    var x = parseInt(e.clientX);
    var y = parseInt(e.clientY);

    if (keys.hasSnap) {
      var restoH = x % keys.currentSnap;

      if (restoH >= keys.currentSnap) {
        x = x - restoH + keys.currentSnap;
      } else {
        x -= restoH;
      }

      var restoV = y % keys.currentSnap;

      if (restoV >= keys.currentSnap) {
        y = y - restoV + keys.currentSnap;
      } else {
        y -= restoV;
      }
    } // only do this code if the mouse is being dragged


    if (isDown) {
      // dx & dy are the distance the mouse has moved since the last mousemove event
      var dx = x - startX;
      var dy = y - startY; // reset the vars for next mousemove

      startX = x;
      startY = y; // accumulate the net panning done

      netPanningX += dx;
      netPanningY += dy;
      console.clear();
      console.log("Net change in panning: x:".concat(netPanningX, "px, y:").concat(netPanningY, "px"));
    }

    mouse.x = x;
    mouse.y = y;
    mouse.event = event;
  }, false);
  canvas.addEventListener('mousedown', function (e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();
    var x = parseInt(e.clientX);
    var y = parseInt(e.clientY);

    if (keys.hasSnap) {
      var restoH = x % keys.currentSnap;

      if (restoH >= keys.currentSnap) {
        x = x - restoH + keys.currentSnap;
      } else {
        x -= restoH;
      }

      var restoV = y % keys.currentSnap;

      if (restoV >= keys.currentSnap) {
        y = y - restoV + keys.currentSnap;
      } else {
        y -= restoV;
      }
    } // calc the starting mouse X,Y for the drag


    startX = x;
    startY = y; // set the isDragging flag

    isDown = true;
  }, false);
  canvas.addEventListener('mouseup', afterAll, false);
  canvas.addEventListener('mouseout', afterAll, false);
  resizeCanvas();
  loop();
};
},{"./keyboards_events":"src/keyboards_events.js","./constants":"src/constants.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62258" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.js"], null)
//# sourceMappingURL=/app.a6a4d504.js.map