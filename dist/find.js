function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
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
import { ArrayTools, PromiseTools, fn, range } from "swiss-ak";
import { findFiles } from "./utils/findFiles.js";
var findCommentsInFile = function() {
    var _ref = _asyncToGenerator(function(file) {
        var text;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fsP.readFile(file, "utf8")
                    ];
                case 1:
                    text = _state.sent();
                    return [
                        2,
                        findCommentsInText(text, file)
                    ];
            }
        });
    });
    return function findCommentsInFile(file) {
        return _ref.apply(this, arguments);
    };
}();
export var findCommentsInText = function() {
    var _ref = _asyncToGenerator(function(text, file) {
        var lines, trimmedLines, fileLevelDefinitions, javadocComments, withMeta, founds;
        return __generator(this, function(_state) {
            lines = text.split("\n");
            trimmedLines = text.split("\n").map(function(s) {
                return s.trim();
            });
            fileLevelDefinitions = lines.map(function(line, index) {
                return [
                    index,
                    line
                ];
            }).filter(function(param) {
                var _param = _slicedToArray(param, 2), index = _param[0], line = _param[1];
                return line.match(/\/\/ {0,}<!-- {0,}DOCS: ?(.*?) {0,}-->/g);
            });
            // sort them in a way so that the first one to match is the most recent (basically backwards)
            fileLevelDefinitions = ArrayTools.sortByMapped(fileLevelDefinitions, function(param) {
                var _param = _slicedToArray(param, 1), index = _param[0];
                return index;
            }, fn.desc);
            javadocComments = _toConsumableArray(text.match(/\/\*{1,3}(.|\n)*?\s?\*\//g) || []);
            withMeta = javadocComments.filter(function(comment) {
                return comment.match(/<!-- ?DOCS: .*?-->/);
            });
            founds = withMeta.map(function(comment) {
                var fileLevelComment = "";
                if (fileLevelDefinitions.length) {
                    var commentLines = comment.split("\n").map(function(s) {
                        return s.trim();
                    });
                    var lineIndex = trimmedLines.findIndex(function(line, index) {
                        return range(Math.min(3, commentLines.length)).every(function(i) {
                            return trimmedLines[index + i] === commentLines[i];
                        });
                    });
                    var fileLevelDef = fileLevelDefinitions.find(function(param) {
                        var _param = _slicedToArray(param, 1), index = _param[0];
                        return index <= lineIndex;
                    });
                    if (fileLevelDef) {
                        fileLevelComment = fileLevelDef[1];
                    }
                }
                return {
                    fileLevelComment: fileLevelComment,
                    file: file,
                    comment: comment
                };
            });
            return [
                2,
                founds
            ];
        });
    });
    return function findCommentsInText(text, file) {
        return _ref.apply(this, arguments);
    };
}();
export var findSrcFiles = function() {
    var _ref = _asyncToGenerator(function(opts) {
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        findFiles(opts.src, "js,ts,jsx,tsx,mjs,mts,mjsx,mtsx")
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return function findSrcFiles(opts) {
        return _ref.apply(this, arguments);
    };
}();
export var findAllComments = function() {
    var _ref = _asyncToGenerator(function(opts) {
        var allFiles, allCommentsRaw, allComments;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        findSrcFiles(opts)
                    ];
                case 1:
                    allFiles = _state.sent();
                    return [
                        4,
                        PromiseTools.mapLimit(16, allFiles, findCommentsInFile)
                    ];
                case 2:
                    allCommentsRaw = _state.sent();
                    allComments = allCommentsRaw.flat();
                    return [
                        2,
                        allComments
                    ];
            }
        });
    });
    return function findAllComments(opts) {
        return _ref.apply(this, arguments);
    };
}();
