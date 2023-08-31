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
import { fn } from "swiss-ak";
import { parseJSDocTags } from "./parseJSDoc.js";
var parseMeta = function(comment) {
    var defaultPriority = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10000, defaultTitleLevel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    var _comment_match = _slicedToArray(comment.match(/<!-- DOCS:(.*?)-->/), 2), fullMeta = _comment_match[0], metaContent = _comment_match[1];
    if (!metaContent) {
        return {
            fullMeta: fullMeta,
            priority: defaultPriority,
            titleLevel: defaultTitleLevel
        };
    }
    var split = metaContent.trim().split(" ").filter(fn.isTruthy);
    // get 'name'
    var name = split.find(function(item) {
        return item.match(/^[A-Za-z-_.]/);
    });
    if (name) split = split.filter(function(item) {
        return item !== name;
    });
    // get 'priority'
    var priorityItem = split.find(function(item) {
        return item.match(/^[0-9-.]*$/);
    });
    var priority = Number(priorityItem || defaultPriority);
    if (priorityItem) split = split.filter(function(item) {
        return item !== priorityItem;
    });
    // get 'titleLevel'
    var titleLevelItem = split.find(function(item) {
        return item.match(/^#/);
    });
    var titleLevel = titleLevelItem ? titleLevelItem.split("#").length - 1 : defaultTitleLevel;
    if (titleLevelItem) split = split.filter(function(item) {
        return item !== titleLevelItem;
    });
    // get 'subsection'
    var subsection = Boolean(titleLevelItem && titleLevelItem.endsWith("!"));
    // get 'allowJSDocUpdates'
    var allowJSDocUpdatesItem = split.find(function(item) {
        return item.match(/@/);
    });
    var allowJSDocUpdates = Boolean(allowJSDocUpdatesItem);
    if (allowJSDocUpdates) split = split.filter(function(item) {
        return item !== allowJSDocUpdatesItem;
    });
    return {
        fullMeta: fullMeta,
        name: name,
        priority: priority,
        titleLevel: titleLevel,
        subsection: subsection,
        allowJSDocUpdates: allowJSDocUpdates
    };
};
var parseComment = function(param) {
    var file = param.file, fileLevelComment = param.fileLevelComment, comment = param.comment;
    var filePriority = undefined;
    var fileTitleLevel = undefined;
    if (fileLevelComment) {
        var _parseMeta = parseMeta(fileLevelComment), priority = _parseMeta.priority, titleLevel = _parseMeta.titleLevel;
        filePriority = priority;
        fileTitleLevel = titleLevel;
    }
    // parse the metadata
    var _parseMeta1 = parseMeta(comment, filePriority, fileTitleLevel), fullMeta = _parseMeta1.fullMeta, name = _parseMeta1.name, priority1 = _parseMeta1.priority, titleLevel1 = _parseMeta1.titleLevel, subsection = _parseMeta1.subsection, allowJSDocUpdates = _parseMeta1.allowJSDocUpdates;
    // parse the content
    var withoutMeta = comment.replace(fullMeta, "");
    var content = withoutMeta.replace(/(^\/\*{1,3}\n?)|(\n?[ \t]{0,}\*\/$)/g, "").replace(/(^|\n)[ \t]{0,}\* ?/g, "\n").replace(/^\n/g, "");
    var _toConsumableArray_concat_map = _slicedToArray(_toConsumableArray(content.split(RegExp("\\n(.*)", "s"))).concat([
        ""
    ]).map(function(s) {
        return s.trim();
    }), 2), title = _toConsumableArray_concat_map[0], bodyRaw = _toConsumableArray_concat_map[1];
    // Find and remove the jsdoc tags
    var jsdocTags = (bodyRaw.match(/(^|\n)@[A-Za-z].*/g) || []).map(function(line) {
        return line.trim();
    }).map(function(tag) {
        // Clean tags
        var edited = tag;
        // Remove any import() statements that have been added
        edited = edited.replaceAll(/import\(.*?\)\./g, "");
        return edited;
    });
    var withoutJSDoc = bodyRaw.replaceAll(/(\n@[A-Za-z].*)|(^@[A-Za-z].*\n)|(@[A-Za-z].*$)/g, "") || "";
    var accessors = _toConsumableArray(withoutJSDoc.matchAll(/^\s?- \`(.*)\`$/gm)).map(function(match) {
        return match[1];
    });
    var withoutAccessors = withoutJSDoc.replace(/^\s?- \`(.*)\`$/gm, "").trim().replaceAll(/\n{3,}/g, "\n\n");
    var body = withoutAccessors.trim() || undefined;
    var jsdoc = parseJSDocTags(jsdocTags);
    return {
        file: file,
        priority: priority1,
        titleLevel: titleLevel1,
        subsection: subsection,
        allowJSDocUpdates: allowJSDocUpdates,
        name: name,
        title: title,
        body: body,
        accessors: accessors,
        jsdoc: jsdoc
    };
};
export var parseComments = function(comments) {
    return comments.map(parseComment);
};
