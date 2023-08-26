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
var getParamTypeDisplay = function(param) {
    return param.isRestParam ? param.type.replace(/^\.\.\./, "") + "[]" : param.type;
};
var formatSegmentTitle = function(segment, opts) {
    return "".concat("#".repeat(segment.titleLevel), " ").concat(segment.title);
};
var formatSegmentBody = function(segment, opts) {
    var removeAccessors = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    var body = removeAccessors ? segment.body.replace(/^\s?- \`(.*)\`$/gm, "").trim().replaceAll(/\n{3,}/g, "\n\n") : segment.body;
    return "\n" + body + "\n";
};
var formatSegmentJSDoc = function(segment, opts) {
    var output = "";
    var _segment_jsdoc = segment.jsdoc, params = _segment_jsdoc.params, returns = _segment_jsdoc.returns;
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
            var typeOut = hasTypes && param.type && getParamTypeDisplay(param);
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
    return output;
};
var formatSegmentSignature = function(segment, opts) {
    var _segment_jsdoc_params, _segment_jsdoc, _segment_jsdoc_returns;
    var accessors = _toConsumableArray(segment.body.matchAll(/^\s?- \`(.*)\`$/gm)).map(function(match) {
        return match[1];
    });
    var params = (_segment_jsdoc_params = segment.jsdoc.params) === null || _segment_jsdoc_params === void 0 ? void 0 : _segment_jsdoc_params.map(function(param) {
        return "".concat(param.isRestParam ? "..." : "").concat(param.name).concat(param.type ? ": " + getParamTypeDisplay(param) : "");
    }).join(", ");
    var funcSuffix = "(".concat(params, ")").concat(((_segment_jsdoc = segment.jsdoc) === null || _segment_jsdoc === void 0 ? void 0 : (_segment_jsdoc_returns = _segment_jsdoc.returns) === null || _segment_jsdoc_returns === void 0 ? void 0 : _segment_jsdoc_returns.type) ? ": " + segment.jsdoc.returns.type : "");
    var section = (accessors.length ? accessors : [
        segment.name
    ]).map(function(accessor) {
        return "".concat(accessor).concat(funcSuffix);
    }).join("\n");
    return "\n\n```typescript\n" + section + "\n```\n";
};
var formatSegmentBackToTop = function(segment, opts) {
    var backToTop = '\n<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>';
    return backToTop;
};
var formatMainSegment = function(segment, opts) {
    var _segment_jsdoc, _segment_jsdoc_params, _segment_jsdoc1, _segment_jsdoc2;
    var output = "";
    var showBody = !!(segment.body !== undefined && segment.body !== "");
    var showJSDoc = !!(((_segment_jsdoc = segment.jsdoc) === null || _segment_jsdoc === void 0 ? void 0 : (_segment_jsdoc_params = _segment_jsdoc.params) === null || _segment_jsdoc_params === void 0 ? void 0 : _segment_jsdoc_params.length) || ((_segment_jsdoc1 = segment.jsdoc) === null || _segment_jsdoc1 === void 0 ? void 0 : _segment_jsdoc1.returns));
    var showSignature = !!((_segment_jsdoc2 = segment.jsdoc) === null || _segment_jsdoc2 === void 0 ? void 0 : _segment_jsdoc2.returns);
    output += formatSegmentTitle(segment, opts);
    if (showSignature) output += formatSegmentSignature(segment, opts);
    if (showBody) output += formatSegmentBody(segment, opts, showSignature);
    if (showJSDoc) output += formatSegmentJSDoc(segment, opts);
    if (showBody || showSignature || showJSDoc) output += formatSegmentBackToTop(segment, opts);
    return output;
};
export var formatMain = function(segments, opts) {
    return segments.map(function(segment) {
        return formatMainSegment(segment, opts);
    }).join("\n\n");
};
