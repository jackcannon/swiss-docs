function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
var parseMeta = function(comment) {
    var defaultPriority = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10000, defaultTitleLevel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
    var _metaContent_match, _metaContent_match1;
    var _comment_match = _slicedToArray(comment.match(/<!-- DOCS:(.*?)-->/), 2), fullMeta = _comment_match[0], metaContent = _comment_match[1];
    if (!metaContent) {
        return {
            fullMeta: fullMeta,
            priority: defaultPriority,
            titleLevel: defaultTitleLevel
        };
    }
    var _metaContent_match_;
    var priority = Number((_metaContent_match_ = (_metaContent_match = metaContent.match(/[0-9.]{1,}/g)) === null || _metaContent_match === void 0 ? void 0 : _metaContent_match[0]) !== null && _metaContent_match_ !== void 0 ? _metaContent_match_ : defaultPriority);
    var _metaContent_match_1;
    var titleLevel = ((_metaContent_match_1 = (_metaContent_match1 = metaContent.match(/#+/g)) === null || _metaContent_match1 === void 0 ? void 0 : _metaContent_match1[0]) !== null && _metaContent_match_1 !== void 0 ? _metaContent_match_1 : "#".repeat(defaultTitleLevel)).length;
    return {
        fullMeta: fullMeta,
        priority: priority,
        titleLevel: titleLevel
    };
};
var parseComment = function(param) {
    var fileLevelComment = param.fileLevelComment, comment = param.comment;
    var filePriority = undefined;
    var fileTitleLevel = undefined;
    if (fileLevelComment) {
        var _parseMeta = parseMeta(fileLevelComment), priority = _parseMeta.priority, titleLevel = _parseMeta.titleLevel;
        filePriority = priority;
        fileTitleLevel = titleLevel;
    }
    // parse the metadata
    var _parseMeta1 = parseMeta(comment, filePriority, fileTitleLevel), fullMeta = _parseMeta1.fullMeta, priority1 = _parseMeta1.priority, titleLevel1 = _parseMeta1.titleLevel;
    // parse the content
    var withoutMeta = comment.replace(fullMeta, "");
    var content = withoutMeta.replace(/(^\/\*{1,3}\n?)|(\n?[ \t]{0,}\*\/$)/g, "").replace(/(^|\n)[ \t]{0,}\* ?/g, "\n").replace(/^\n/g, "");
    var _content_split_map = _slicedToArray(content.split(RegExp("\\n(.*)", "s")).map(function(s) {
        return s.trim();
    }), 2), title = _content_split_map[0], body = _content_split_map[1];
    // if (title === 'update') {
    //   console.log('DEBUG', {
    //     fileLevelComment,
    //     comment,
    //     filePriority,
    //     fileTitleLevel,
    //     fullMeta,
    //     priority,
    //     titleLevel,
    //     title,
    //     body
    //   });
    // }
    return {
        priority: priority1,
        titleLevel: titleLevel1,
        title: title,
        body: body
    };
};
export var parseComments = function(comments) {
    return comments.map(parseComment);
};
