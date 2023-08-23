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
import { StringTools } from "swiss-ak";
import { table } from "swiss-node";
var specialToken = "SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX";
var getID = function(title) {
    return StringTools.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), "");
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
    var _segment_jsdoc, _segment_jsdoc_params, _segment_jsdoc1;
    var output = "";
    // Title
    output += "".concat("#".repeat(segment.titleLevel), " ").concat(segment.title);
    // Body
    var showBody = segment.body !== undefined && segment.body !== "";
    if (showBody) {
        output += "\n" + segment.body + "\n";
    }
    // JSDoc
    var showJSDoc = ((_segment_jsdoc = segment.jsdoc) === null || _segment_jsdoc === void 0 ? void 0 : (_segment_jsdoc_params = _segment_jsdoc.params) === null || _segment_jsdoc_params === void 0 ? void 0 : _segment_jsdoc_params.length) || ((_segment_jsdoc1 = segment.jsdoc) === null || _segment_jsdoc1 === void 0 ? void 0 : _segment_jsdoc1.returns);
    if (showJSDoc) {
        var _segment_jsdoc2 = segment.jsdoc, params = _segment_jsdoc2.params, returns = _segment_jsdoc2.returns;
        var IGNORE = -123;
        var sanitise = function(row) {
            return row.filter(function(s) {
                return s !== IGNORE;
            }).map(function(cell) {
                return cell === null || cell === void 0 ? void 0 : cell.replaceAll("|", "\\|");
            });
        };
        // parameters
        if (params === null || params === void 0 ? void 0 : params.length) {
            var hasTypes = params.some(function(param) {
                return param.type;
            });
            var hasDefaults = params.some(function(param) {
                return param.defaultValue;
            });
            var hasComments = params.some(function(param) {
                return param.comment;
            });
            var header = [
                sanitise([
                    "#",
                    "Parameter Name",
                    "Required",
                    hasTypes ? "Type" : IGNORE,
                    hasDefaults ? "Default" : IGNORE,
                    hasComments ? "Description" : IGNORE
                ])
            ];
            var rows = params.map(function(param, index) {
                var typeOut = hasTypes && param.type && param.isRestParam ? param.type.replace(/^\.\.\./, "") + "[]" : param.type;
                return sanitise([
                    "*".concat(index).concat(param.isRestParam ? "…" : "", "*"),
                    "`" + param.name + "`",
                    param.isOptional ? "*No*" : "**Yes**",
                    hasTypes ? param.type ? "`" + typeOut + "`" : "" : IGNORE,
                    hasDefaults ? (param.defaultValue ? "`" + param.defaultValue + "`" : "") || "" : IGNORE,
                    hasComments ? param.comment || "" : IGNORE
                ]);
            });
            // output += '\n' + 'Parameters';
            var tableOut = table.markdown(rows, header, {
                alignCols: sanitise([
                    "center",
                    "left",
                    "left",
                    hasTypes ? "left" : IGNORE,
                    hasDefaults ? "left" : IGNORE,
                    hasComments ? "left" : IGNORE // description
                ])
            });
            output += "\n" + tableOut.join("\n") + "\n";
        }
        // return type
        if (returns) {
            var hasComments1 = !!returns.comment;
            var header1 = [
                sanitise([
                    //
                    "Return Type",
                    hasComments1 ? "" : IGNORE
                ])
            ];
            var rows1 = [
                sanitise([
                    //
                    returns.type ? "`" + returns.type + "`" : "",
                    hasComments1 ? returns.comment : IGNORE
                ])
            ];
            var tableOut1 = table.markdown(rows1, header1);
            output += "\n" + tableOut1.join("\n") + "\n";
        }
    }
    // Back to top
    if (showBody || showJSDoc) {
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
