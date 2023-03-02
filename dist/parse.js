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
var parseComment = function(comment) {
    var _comment_match = _slicedToArray(comment.match(/<!-- DOCS:(.*?)-->/), 2), fullMeta = _comment_match[0], metaContent = _comment_match[1];
    // parse the metadata
    var priority = Number(metaContent.match(/[0-9.]/g)[0]);
    var titleLevel = metaContent.match(/#+/g)[0].length;
    // parse the content
    var withoutMeta = comment.replace(fullMeta, "");
    var content = withoutMeta.replace(/(^\/\*{2,3}\n?)|(\n? ?\*\/$)/g, "").replace(/(^|\n) ?\* ?/g, "\n").replace(/^\n/g, "");
    var _content_split_map = _slicedToArray(content.split(RegExp("\\n(.*)", "s")).map(function(s) {
        return s.trim();
    }), 2), title = _content_split_map[0], body = _content_split_map[1];
    return {
        priority: priority,
        titleLevel: titleLevel,
        title: title,
        body: body
    };
};
export var parseComments = function(comments) {
    return comments.map(parseComment);
};
