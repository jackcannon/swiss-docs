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
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
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
import { ObjectTools } from "swiss-ak";
//<!-- DOCS: -1 -->
// Note: originally planned to add to StringTools in swiss-ak, but not reliable enough, and had very limited application
/**<!-- DOCS: matchBrackets ### -->
 * matchBrackets
 *
 * Tools for matching corresponding brackets in a string
 */ export var matchBrackets; // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
(function(matchBrackets) {
    // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE
    var defaultReplaceSymbols = {
        END: "✧",
        "(": "❪",
        ")": "❫",
        "[": "❲",
        "]": "❳",
        "{": "❴",
        "}": "❵",
        "<": "❰",
        ">": "❱"
    };
    var runReplace = function(input) {
        var replaceSymbols = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, outputDepth = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        var fullSyms = getReplaceSymbols(replaceSymbols);
        var infos = {
            round: {
                depth: -1,
                currentID: -1,
                active: []
            },
            square: {
                depth: -1,
                currentID: -1,
                active: []
            },
            curly: {
                depth: -1,
                currentID: -1,
                active: []
            },
            angle: {
                depth: -1,
                currentID: -1,
                active: []
            }
        };
        var updateInfo = function(info, startBr, endBr, br) {
            var depth;
            var id;
            if (br === startBr || br === endBr) {
                if (br === startBr) {
                    // start pair
                    depth = ++info.depth;
                    id = ++info.currentID;
                    info.active.push([
                        depth,
                        id
                    ]);
                } else {
                    // end pair
                    depth = info.depth--;
                    var activeIndex = info.active.findIndex(function(param) {
                        var _param = _slicedToArray(param, 2), d = _param[0], i = _param[1];
                        return d === depth;
                    });
                    if (activeIndex !== -1) {
                        var _info_active_splice;
                        var found = (_info_active_splice = info.active.splice(activeIndex, 1)) === null || _info_active_splice === void 0 ? void 0 : _info_active_splice[0];
                        if (found) id = found[1];
                    }
                }
            }
            return outputDepth ? depth : id;
        };
        return input.replaceAll(/\(|\)|\[|\]|\{|\}|\<|\>/g, function(br) {
            var id = updateInfo(infos.round, "(", ")", br) || updateInfo(infos.square, "[", "]", br) || updateInfo(infos.curly, "{", "}", br) || updateInfo(infos.angle, "<", ">", br);
            return fullSyms[br] + (id || "0") + fullSyms.END;
        });
    };
    var unique = matchBrackets.unique = function(input) {
        var replaceSymbols = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return runReplace(input, replaceSymbols, false);
    };
    var depth = matchBrackets.depth = function(input) {
        var replaceSymbols = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        return runReplace(input, replaceSymbols, true);
    };
    var clean = matchBrackets.clean = function(input) {
        var replaceSymbols = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var fullSyms = getReplaceSymbols(replaceSymbols);
        var invertedSyms = ObjectTools.invert(fullSyms);
        var END = fullSyms.END, withoutEND = _objectWithoutProperties(fullSyms, [
            "END"
        ]);
        var startSyms = Object.values(withoutEND);
        var regex = new RegExp("(".concat(startSyms.map(function(s) {
            return "\\".concat(s);
        }).join("|"), ")[0-9]+").concat(fullSyms.END), "g");
        return input.replaceAll(regex, function(m, startSym) {
            return invertedSyms[startSym] || "";
        });
    };
    var runGrab = function(input) {
        var bracketType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "round", subjectID = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, replaceSymbols = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, isDepth = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
        var fullSyms = getReplaceSymbols(replaceSymbols);
        var _bracketType_map = _slicedToArray(({
            "()": [
                "(",
                ")"
            ],
            "[]": [
                "[",
                "]"
            ],
            "{}": [
                "{",
                "}"
            ],
            "<>": [
                "<",
                ">"
            ],
            round: [
                "(",
                ")"
            ],
            square: [
                "[",
                "]"
            ],
            curly: [
                "{",
                "}"
            ],
            angle: [
                "<",
                ">"
            ]
        })[bracketType].map(function(s) {
            return fullSyms[s];
        }), 2), openSym = _bracketType_map[0], closeSym = _bracketType_map[1];
        var endSym = fullSyms.END;
        var fullDirty = isDepth ? depth(input, replaceSymbols) : unique(input, replaceSymbols);
        var regex = new RegExp("".concat(openSym).concat(subjectID).concat(endSym, "(.|\n)*?").concat(closeSym).concat(subjectID).concat(endSym), "g");
        var foundDirty = _toConsumableArray(fullDirty.matchAll(regex) || []).map(function(match) {
            return match[0];
        });
        var found = foundDirty.map(function(str) {
            return clean(str, replaceSymbols);
        });
        return found;
    };
    var grab = matchBrackets.grab = function(input) {
        var bracketType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "round", depthID = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, replaceSymbols = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        return runGrab(input, bracketType, depthID, replaceSymbols, true);
    };
    var grabUnique = matchBrackets.grabUnique = function(input) {
        var bracketType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "round", uniqueID = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, replaceSymbols = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
        var _runGrab;
        return (_runGrab = runGrab(input, bracketType, uniqueID, replaceSymbols, false)) === null || _runGrab === void 0 ? void 0 : _runGrab[0];
    };
    var getReplaceSymbols = matchBrackets.getReplaceSymbols = function() {
        var replaceSymbols = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return _objectSpread({}, defaultReplaceSymbols, replaceSymbols);
    };
})(matchBrackets || (matchBrackets = {}));
