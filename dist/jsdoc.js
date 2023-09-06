function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
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
import { PromiseTools, getProgressBar } from "swiss-ak";
import transpile from "ts-to-jsdoc";
import { write } from "./utils/write.js";
import { warn } from "./utils/logs.js";
import { parseComments } from "./parseComment.js";
import { findCommentsInText, findSrcFiles } from "./find.js";
import { coloredOut } from "./utils/coloredOut.js";
var DEBUG_JSDOC = false;
var debug = function(message) {
    if (DEBUG_JSDOC) console.log(coloredOut.PROPNAME(message));
};
export var runJSDocUpdate = function() {
    var _ref = _asyncToGenerator(function(opts) {
        var allFiles, useFiles, progressBar, concurrentLimit;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        findSrcFiles(opts)
                    ];
                case 1:
                    allFiles = _state.sent();
                    useFiles = allFiles;
                    // .filter((file) => file.includes('$$.ts'));
                    if (DEBUG_JSDOC) console.log(useFiles);
                    progressBar = getProgressBar(useFiles.length, {
                        prefix: " Updating JSDocs "
                    });
                    progressBar.start();
                    concurrentLimit = DEBUG_JSDOC ? 1 : 8;
                    return [
                        4,
                        PromiseTools.eachLimit(concurrentLimit, useFiles, function() {
                            var _ref = _asyncToGenerator(function(file) {
                                return __generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                updateSingleFile(file)
                                            ];
                                        case 1:
                                            _state.sent();
                                            progressBar.next();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            });
                            return function(file) {
                                return _ref.apply(this, arguments);
                            };
                        }())
                    ];
                case 2:
                    _state.sent();
                    progressBar.finish();
                    return [
                        2
                    ];
            }
        });
    });
    return function runJSDocUpdate(opts) {
        return _ref.apply(this, arguments);
    };
}();
// Edit the file before it gets handled by ts-to-jsdoc
var preEditFileText = function() {
    var _ref = _asyncToGenerator(function(text) {
        var edited;
        return __generator(this, function(_state) {
            edited = text;
            edited = edited.replaceAll(/\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-START(.|\n)*?SWISS-DOCS-JSDOC-REMOVE-END(.*)\n/g, "");
            edited = edited.replaceAll(/\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-NEXT-LINE(.*)?\n(.*)?\n/g, "");
            edited = edited.replaceAll(/\n(.*)\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-THIS-LINE(.*)\n/g, "\n");
            edited = edited.replaceAll(/\n(.*)\n(.*)\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-PREV-LINE(.*)\n/g, "\n");
            return [
                2,
                edited
            ];
        });
    });
    return function preEditFileText(text) {
        return _ref.apply(this, arguments);
    };
}();
// Edit the transpiled/updated comment before it gets written back to the original file
var postEditComment = function(newComment, oldComment) {
    var edited = newComment;
    // Match the indentation of the old comment
    var indentation = oldComment.match(/\n((\s|\t)*)\*/)[1];
    edited = indentation ? edited.replaceAll(/\n((\s|\t)*)\*/g, "\n".concat(indentation, "*")) : edited;
    // Remove any 'import()' statements that have been added
    edited = edited.replaceAll(/(\*\s@.*?)import\(.*?\)\./g, "$1");
    // Remove JSDoc tags that aren't ones we want
    var acceptedTags = [
        "@param ",
        "@returns ",
        "@arg ",
        "@argument ",
        "@return "
    ];
    edited = edited.replaceAll(/(?:(?:\n\s*\*)|(?:^\/\*\*)) (@.*)/g, function(match, tag) {
        var allowed = acceptedTags.some(function(test) {
            return tag.startsWith(test);
        });
        return allowed ? match : "";
    });
    return edited;
};
var getParsedComments = function() {
    var _ref = _asyncToGenerator(function(text, file) {
        var foundComments, parsedComments;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        findCommentsInText(text, file)
                    ];
                case 1:
                    foundComments = _state.sent();
                    parsedComments = parseComments(foundComments);
                    return [
                        2,
                        foundComments.map(function(foundComment, index) {
                            var parsedComment = parsedComments[index];
                            var result = _objectSpread({}, foundComment, parsedComment);
                            return result;
                        })
                    ];
            }
        });
    });
    return function getParsedComments(text, file) {
        return _ref.apply(this, arguments);
    };
}();
var pairUpComments = function(originalComments, transpiledComments) {
    var mappedPairs = originalComments.map(function(orig) {
        var byName = transpiledComments.filter(function(c) {
            return orig.name ? orig.name === c.name : orig.title === c.title;
        });
        if (!byName.length) return [
            undefined,
            undefined
        ];
        var matched = byName.length === 1 ? byName[0] : byName.find(function(c) {
            return orig.priority === c.priority && orig.titleLevel === c.titleLevel && orig.title === c.title;
        }) || byName[0];
        if (!matched) return [
            undefined,
            undefined
        ];
        var result = [
            orig,
            matched
        ];
        return result;
    });
    var filtered = mappedPairs.filter(function(pair) {
        return pair && pair[0] && pair[1];
    });
    return filtered;
};
var updateSingleFile = function() {
    var _ref = _asyncToGenerator(function(file) {
        var original, originalComments, preEdited, transpiled, transpiledComments, pairs, rows, output, e;
        return __generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        7,
                        ,
                        8
                    ]);
                    debug("");
                    debug("  " + file);
                    return [
                        4,
                        fsP.readFile(file, "utf8")
                    ];
                case 1:
                    original = _state.sent();
                    return [
                        4,
                        getParsedComments(original, file)
                    ];
                case 2:
                    originalComments = _state.sent().filter(function(segment) {
                        return segment.allowJSDocUpdates;
                    });
                    if (originalComments.length === 0) {
                        debug("      - no comments with allowJSDocUpdates enabled found");
                        return [
                            2
                        ];
                    }
                    debug("      - before transpile");
                    return [
                        4,
                        preEditFileText(original)
                    ];
                case 3:
                    preEdited = _state.sent();
                    return [
                        4,
                        transpile(preEdited)
                    ];
                case 4:
                    transpiled = _state.sent();
                    return [
                        4,
                        getParsedComments(transpiled, file)
                    ];
                case 5:
                    transpiledComments = _state.sent();
                    debug("      - after transpile");
                    debug("      - before pair");
                    pairs = pairUpComments(originalComments, transpiledComments);
                    debug("      - after pair");
                    rows = [];
                    output = original;
                    pairs.forEach(function(param, index) {
                        var _param = _slicedToArray(param, 2), originalComment = _param[0], transpiledComment = _param[1];
                        debug("      - handling pair ".concat(index + 1, "/").concat(pairs.length));
                        if (!originalComment || !transpiledComment) {
                            warn("Comment not found in transpiled file: ".concat((originalComment === null || originalComment === void 0 ? void 0 : originalComment.name) || (originalComment === null || originalComment === void 0 ? void 0 : originalComment.title) || (transpiledComment === null || transpiledComment === void 0 ? void 0 : transpiledComment.name) || (transpiledComment === null || transpiledComment === void 0 ? void 0 : transpiledComment.title)));
                        }
                        try {
                            var postEdited = postEditComment(transpiledComment.comment, originalComment.comment);
                            rows.push([
                                originalComment.comment,
                                postEdited
                            ]);
                            // matches all the relevant props
                            if (originalComment.comment !== postEdited) {
                                output = output.replace(originalComment.comment, postEdited.replaceAll("$", "$$$$"));
                            }
                        } catch (e) {
                            // do nothing
                            if (DEBUG_JSDOC) console.error(coloredOut.RED("ERROR"), e);
                        }
                    });
                    debug("      - before write");
                    return [
                        4,
                        write(file, output)
                    ];
                case 6:
                    _state.sent();
                    debug("      - after write");
                    debug("");
                    debug("");
                    return [
                        3,
                        8
                    ];
                case 7:
                    e = _state.sent();
                    if (DEBUG_JSDOC) console.error(coloredOut.RED("ERROR"), e);
                    return [
                        3,
                        8
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    });
    return function updateSingleFile(file) {
        return _ref.apply(this, arguments);
    };
}();
