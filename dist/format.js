function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
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
import { StringUtils } from "swiss-ak";
var specialToken = "SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX";
var getID = function(title) {
    return StringUtils.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), "");
};
export var formatTOC = function(segments, opts) {
    var lines = segments.map(function(param) {
        var title = param.title, titleLevel = param.titleLevel;
        var id = getID(title);
        var indent = "  ".repeat(titleLevel);
        var link = "[".concat(title, "](#").concat(id, ")");
        return "".concat(indent, "- ").concat(link);
    });
    var firstLine = "  - [".concat(opts.header || "Table of Contents", "](#)");
    var output = [
        firstLine
    ].concat(_toConsumableArray(lines)).join("\n");
    return output;
};
var formatMainSegment = function(segment, opts) {
    var output = "";
    // Title
    output += "".concat("#".repeat(segment.titleLevel), " ").concat(segment.title);
    // Body
    if (segment.body !== undefined) {
        output += "\n" + segment.body + "\n";
        // Back to top
        var backToTop = '\n<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>';
        output += backToTop;
    }
    return output;
};
export var formatMain = function(segments, opts) {
    return segments.map(function(segment) {
        return formatMainSegment(segment, opts);
    }).join("\n\n");
};
