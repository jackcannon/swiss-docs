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
import { findAncestorSubsection, flattenTree } from "./utils/treeUtils.js";
var specialToken = "SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX";
var getID = function(title) {
    return StringTools.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), "");
};
var getTableOfContents = function(segments, opts, levelOffset) {
    var includeFirstLine = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
    var lines = segments.map(function(segment) {
        var _segment_children;
        var id = getID(segment.title);
        var indent = "  ".repeat(segment.titleLevel - levelOffset);
        var titleOut = segment.subsection || ((_segment_children = segment.children) === null || _segment_children === void 0 ? void 0 : _segment_children.length) ? "**".concat(segment.title, "**") : segment.title;
        var link = "[".concat(titleOut, "](#").concat(id, ")");
        return "".concat(indent, "- ").concat(link);
    });
    var firstLine = "  - [**".concat(opts.header || "Table of Contents", "**](#)");
    var outLines = includeFirstLine ? [
        firstLine
    ].concat(_toConsumableArray(lines)) : lines;
    var output = outLines.join("\n");
    return output;
};
export var formatPrimaryTOC = function(segments, opts, tree) {
    return getTableOfContents(segments, opts, 0, true);
};
var getParamTypeDisplay = function(param) {
    return param.isRestParam ? param.type.replace(/^\.\.\./, "") + "[]" : param.type;
};
var formatSegmentTitle = function(segment, opts, tree) {
    return "".concat("#".repeat(segment.titleLevel), " ").concat(segment.title);
};
var formatSegmentTOC = function(segment, opts, tree) {
    var childSegments = flattenTree(segment.children || [], function(segment) {
        return segment.subsection;
    });
    var toc = getTableOfContents([
        segment
    ].concat(_toConsumableArray(childSegments)), opts, Math.max(0, segment.titleLevel - 1), false);
    return "\n" + toc + "\n";
};
var formatSegmentBody = function(segment, opts, tree) {
    var body = segment.body;
    return "\n" + body + "\n";
};
var formatSegmentJSDoc = function(segment, opts, tree) {
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
var formatSegmentSignature = function(segment, opts, tree) {
    var _segment_jsdoc;
    var accessors = segment.accessors.length ? segment.accessors : [
        segment.name
    ];
    var section = "";
    var isFunction = !!((_segment_jsdoc = segment.jsdoc) === null || _segment_jsdoc === void 0 ? void 0 : _segment_jsdoc.returns);
    if (isFunction) {
        var _segment_jsdoc_params, _segment_jsdoc1, _segment_jsdoc_returns;
        var params = (_segment_jsdoc_params = segment.jsdoc.params) === null || _segment_jsdoc_params === void 0 ? void 0 : _segment_jsdoc_params.map(function(param) {
            return "".concat(param.isRestParam ? "..." : "").concat(param.name).concat(param.type ? ": " + getParamTypeDisplay(param) : "");
        }).join(", ");
        var funcSuffix = "(".concat(params, ")").concat(((_segment_jsdoc1 = segment.jsdoc) === null || _segment_jsdoc1 === void 0 ? void 0 : (_segment_jsdoc_returns = _segment_jsdoc1.returns) === null || _segment_jsdoc_returns === void 0 ? void 0 : _segment_jsdoc_returns.type) ? ": " + segment.jsdoc.returns.type : "");
        section = accessors.map(function(accessor) {
            return "".concat(accessor).concat(funcSuffix);
        }).join("\n");
    } else {
        section = accessors.map(function(accessor) {
            return "".concat(accessor, ";");
        }).join("\n");
    }
    return "\n\n```typescript\n" + section + "\n```\n";
};
var formatSegmentBackToX = function(segment, opts, tree) {
    var target = findAncestorSubsection(tree, segment);
    var targetURL = "#";
    var targetName = "top";
    if (target) {
        targetURL = "#" + getID(target.title);
        targetName = target.title;
    }
    var backToX = '\n<p style="text-align: right" align="right"><a href="'.concat(targetURL, '"> [↑ Back to ').concat(targetName, " ↑] </a></p>");
    return backToX;
};
var formatMainSegment = function(segment, opts, tree) {
    var _segment_jsdoc, _segment_jsdoc_params, _segment_jsdoc1, _segment_children;
    var output = "";
    var showBody = !!(segment.body !== undefined && segment.body !== "");
    var showJSDoc = !!(((_segment_jsdoc = segment.jsdoc) === null || _segment_jsdoc === void 0 ? void 0 : (_segment_jsdoc_params = _segment_jsdoc.params) === null || _segment_jsdoc_params === void 0 ? void 0 : _segment_jsdoc_params.length) || ((_segment_jsdoc1 = segment.jsdoc) === null || _segment_jsdoc1 === void 0 ? void 0 : _segment_jsdoc1.returns));
    var showTOC = segment.subsection && ((_segment_children = segment.children) === null || _segment_children === void 0 ? void 0 : _segment_children.length);
    var showSignature = segment.accessors.length;
    output += formatSegmentTitle(segment, opts, tree);
    if (showSignature) output += formatSegmentSignature(segment, opts, tree);
    if (showBody) output += formatSegmentBody(segment, opts, tree);
    if (showTOC) output += formatSegmentTOC(segment, opts, tree);
    if (showJSDoc) output += formatSegmentJSDoc(segment, opts, tree);
    if (showBody || showJSDoc) output += formatSegmentBackToX(segment, opts, tree);
    return output;
};
export var formatMain = function(segments, opts, tree) {
    return segments.map(function(segment) {
        return formatMainSegment(segment, opts, tree);
    }).join("\n\n");
};
