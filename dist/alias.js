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
import { findFiles } from "./utils/fileFiles.js";
import { ArrayTools, MathsTools, PromiseTools } from "swiss-ak";
import { warn } from "./utils/warn.js";
import { getStoredSegment } from "./nameStore.js";
export var runAlias = function() {
    var _ref = _asyncToGenerator(function(options) {
        var _ArrayTools, _MathsTools, _MathsTools1, files, stats, _zip_apply, changedCounts, unchangedCounts, changed, unchanged;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        findFiles(options.alias)
                    ];
                case 1:
                    files = _state.sent();
                    return [
                        4,
                        PromiseTools.mapLimit(16, files, replaceAliasesInFile)
                    ];
                case 2:
                    stats = _state.sent();
                    _zip_apply = _slicedToArray((_ArrayTools = ArrayTools).zip.apply(_ArrayTools, _toConsumableArray(stats)), 2), changedCounts = _zip_apply[0], unchangedCounts = _zip_apply[1];
                    changed = (_MathsTools = MathsTools).addAll.apply(_MathsTools, _toConsumableArray(changedCounts || []));
                    unchanged = (_MathsTools1 = MathsTools).addAll.apply(_MathsTools1, _toConsumableArray(unchangedCounts || []));
                    if (changed > 0) console.log("Replaced ".concat(changed, " aliases"));
                    if (unchanged > 0) warn("  WARNING: Unable to replace ".concat(unchanged, " aliases"));
                    return [
                        2
                    ];
            }
        });
    });
    return function runAlias(options) {
        return _ref.apply(this, arguments);
    };
}();
var readFile = function() {
    var _ref = _asyncToGenerator(function(file) {
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fsP.readFile(file, "utf8")
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return function readFile(file) {
        return _ref.apply(this, arguments);
    };
}();
var writeFile = function() {
    var _ref = _asyncToGenerator(function(file, newContents) {
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fsP.writeFile(file, newContents, "utf8")
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return function writeFile(file, newContents) {
        return _ref.apply(this, arguments);
    };
}();
var getNewComment = function(param) {
    var commentText = param.commentText;
    var _commentText_match;
    var aliasName = (((_commentText_match = commentText.match(/<!-- ?DOCS-ALIAS: (.*?)-->/)) === null || _commentText_match === void 0 ? void 0 : _commentText_match[1]) || "").trim();
    var segment = getStoredSegment(aliasName);
    if (!segment) {
        return;
    }
    var body = segment.body ? [
        "",
        ""
    ].concat(_toConsumableArray((segment.body || "").split("\n"))).join("\n * ") : "";
    var result = "/**<!-- DOCS-ALIAS: ".concat(aliasName, " -->\n * ").concat(segment.title).concat(body, "\n */");
    return result;
};
var replaceComments = function(contents) {
    var newContents = contents;
    var changed = 0;
    var unchanged = 0;
    newContents = contents.replaceAll(/(?:^|\n)([ \t]*?)(?:(?:\/\*{1,3}((?:.|\n)*?)\s?\*\/)|(?:\/\/\s?([^\n]*)))/g, function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        var _args = _slicedToArray(args, 4), fullMatch = _args[0], indent = _args[1], commentText1 = _args[2], commentText2 = _args[3];
        var commentText = (commentText1 || commentText2 || "").trim();
        console.log({
            fullMatch: fullMatch
        });
        if (commentText.match(/<!-- ?DOCS-ALIAS: (.*?)-->/)) {
            var newComment = getNewComment({
                fullMatch: fullMatch,
                indent: indent,
                commentText: commentText
            });
            if (newComment) {
                changed++;
                var result = [
                    ""
                ].concat(_toConsumableArray(newComment.split("\n"))).join("\n" + indent);
                // console.log({ fullMatch, result });
                return result;
            } else {
                unchanged++;
            }
        }
        // No change
        return fullMatch;
    });
    return {
        changed: changed,
        unchanged: unchanged,
        newContents: newContents
    };
};
var replaceAliasesInFile = function() {
    var _ref = _asyncToGenerator(function(file) {
        var contents, _replaceComments, changed, unchanged, newContents;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        readFile(file)
                    ];
                case 1:
                    contents = _state.sent();
                    _replaceComments = replaceComments(contents), changed = _replaceComments.changed, unchanged = _replaceComments.unchanged, newContents = _replaceComments.newContents;
                    return [
                        4,
                        writeFile(file, newContents)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2,
                        [
                            changed,
                            unchanged
                        ]
                    ];
            }
        });
    });
    return function replaceAliasesInFile(file) {
        return _ref.apply(this, arguments);
    };
}();
