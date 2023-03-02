import { StringUtils } from "swiss-ak";
var specialToken = "SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX";
var getID = function(title) {
    return StringUtils.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), "");
};
export var formatTOC = function(segments, opts) {
    var output = segments.map(function(param) {
        var title = param.title, titleLevel = param.titleLevel;
        var id = getID(title);
        var indent = "  ".repeat(titleLevel - 1);
        var link = "[".concat(title, "](#").concat(id, ")");
        return "".concat(indent, "- ").concat(link);
    }).join("\n");
    return output;
};
var formatMainSegment = function(segment, opts) {
    var output = "";
    // Title
    output += "".concat("#".repeat(segment.titleLevel), " ").concat(segment.title, "\n\n");
    // Body
    output += segment.body;
    // Back to top
    var backToTop = opts.rootId ? "\n\n[↑ Back to top ↑](#".concat(opts.rootId, ")") : "";
    output += backToTop;
    return output;
};
export var formatMain = function(segments, opts) {
    return segments.map(function(segment) {
        return formatMainSegment(segment, opts);
    }).join("\n\n");
};
