function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return(g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g);
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
import fsP from "fs/promises";
import { write } from "./utils/write.js";
import { flattenTree } from "./utils/treeUtils.js";
import { formatMain, formatPrimaryTOC } from "./formatMarkdown.js";
export var exportAndSave = function() {
    var _ref = _asyncToGenerator(function(tree, opts) {
        var template, output, flat, tags, wantsTOC, filteredSegments, toc, replacement, wantsMain, filteredSegments1, main, replacement1;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fsP.readFile(opts.template || opts.output, "utf8")
                    ];
                case 1:
                    template = _state.sent();
                    output = template;
                    flat = flattenTree(tree);
                    tags = _toConsumableArray(template.match(/<!-- ?DOCS: ?(.*?) ?-->/g)).map(function(s) {
                        return s.replace(/<!-- ?DOCS: ?(.*?) ?-->/g, "$1").trim();
                    });
                    wantsTOC = tags.filter(function(tag) {
                        return tag.toUpperCase().includes("TOC");
                    }).length >= 2;
                    if (wantsTOC) {
                        filteredSegments = flattenTree(tree, function(segment) {
                            return segment.subsection;
                        })// don't include segments with negative priority
                        .filter(function(segment) {
                            return segment.priority >= 0;
                        });
                        toc = formatPrimaryTOC(filteredSegments, opts, tree, flat);
                        replacement = [
                            "<!-- DOCS: TOC START -->",
                            "",
                            toc,
                            "",
                            "<!-- DOCS: TOC END -->"
                        ].join("\n");
                        output = output.replace(/<!-- ?DOCS: ?(START TOC|TOC START) ?-->(.|\n)*?<!-- ?DOCS: ?(END TOC|TOC END) ?-->/gi, replacement);
                    }
                    wantsMain = tags.filter(function(tag) {
                        return tag.toUpperCase().includes("MAIN");
                    }).length >= 2;
                    if (wantsMain) {
                        filteredSegments1 = flat// don't include segments with negative priority
                        .filter(function(segment) {
                            return segment.priority >= 0;
                        });
                        main = formatMain(filteredSegments1, opts, tree, flat);
                        replacement1 = [
                            "<!-- DOCS: MAIN START -->",
                            "",
                            main,
                            "",
                            "<!-- DOCS: MAIN END -->"
                        ].join("\n");
                        output = output.replace(/<!-- ?DOCS: ?(START MAIN|MAIN START) ?-->(.|\n)*?<!-- ?DOCS: ?(END MAIN|MAIN END) ?-->/gi, replacement1);
                    }
                    return [
                        4,
                        write(opts.output, output)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return function exportAndSave(tree, opts) {
        return _ref.apply(this, arguments);
    };
}();
