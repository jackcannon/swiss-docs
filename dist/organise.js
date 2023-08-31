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
import { ArrayTools } from "swiss-ak";
import { coloredOut } from "./utils/coloredOut.js";
var DEBUG_NAMES = true;
var organiseSort = function(segments) {
    // 'sort' by priority, maintaining original order for equal priorities
    var groups = ArrayTools.group(segments, function(c) {
        return c.priority;
    });
    var sorted = ArrayTools.sortByMapped(groups, function(g) {
        return g[0].priority;
    });
    return sorted.flat();
};
var recursiveChildAdopter = function(list, depthOld) {
    var _Math;
    var depth = (_Math = Math).min.apply(_Math, _toConsumableArray(list.map(function(item) {
        return item.titleLevel;
    })));
    var items = list.filter(function(item) {
        return item.titleLevel === depth;
    });
    if (items.length && list.indexOf(items[0]) !== 0) {
        // Sometimes it jumps 2 levels, but we don't want to lose the first item
        items.unshift(list[0]);
    }
    var indexes = items.map(function(item) {
        return list.indexOf(item);
    });
    var sections = indexes.map(function(parentIndex, i) {
        return list.slice(parentIndex + 1, indexes.at(i + 1));
    });
    ArrayTools.zip(items, indexes, sections).forEach(function(param) {
        var _param = _slicedToArray(param, 3), item = _param[0], index = _param[1], children = _param[2];
        if (children.length) {
            item.children = recursiveChildAdopter(children, depth + 1);
        }
    });
    return items;
};
var nestList = function(list) {
    var _Math;
    var lowestTitleLevel = (_Math = Math).min.apply(_Math, _toConsumableArray(list.map(function(item) {
        return item.titleLevel;
    })));
    var newList = recursiveChildAdopter(list, lowestTitleLevel);
    return newList;
};
var organiseNest = function(segments) {
    var notShown = segments.filter(function(item) {
        return item.priority < 0;
    });
    var shown = segments.filter(function(item) {
        return item.priority >= 0;
    });
    var notShownNested = nestList(notShown);
    var shownNested = nestList(shown);
    return _toConsumableArray(notShownNested).concat(_toConsumableArray(shownNested));
};
export var organise = function(segments) {
    var sorted = organiseSort(segments);
    if (DEBUG_NAMES) {
        var noNames = sorted.filter(function(param) {
            var name = param.name;
            return !name;
        });
        if (noNames.length) {
            console.log(coloredOut.BOLD(coloredOut.YELLOW("  Segments without names:")));
            var pwd = process.cwd();
            noNames.forEach(function(param) {
                var title = param.title, file = param.file;
                console.log(coloredOut.YELLOW("   - ".concat(title)), coloredOut.NONE("(".concat(file.replace(pwd, "."), ")")));
            });
            console.log("");
        }
    }
    var nested = organiseNest(sorted);
    return nested;
};
