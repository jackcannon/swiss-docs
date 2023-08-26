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
import { ObjectTools, fn, StringTools } from "swiss-ak";
export var parseJSDocTags = function(jsdocTags) {
    var params = jsdocTags.filter(function(tag) {
        return tag.startsWith("@param") || tag.startsWith("@arg ") || tag.startsWith("@argument");
    }).map(function(tag) {
        var withoutTag = tag.replace(/\s*@\S+/, "").trim();
        var typeRaw = "";
        if (withoutTag.startsWith("{")) {
            typeRaw = StringTools.matchBrackets.grabUnique(withoutTag, "curly", 0);
        }
        var type = typeRaw.replaceAll(/^\{|\}$/g, "") || undefined;
        var withoutType = withoutTag.replace(typeRaw, "").trim();
        var words;
        var name;
        var isOptional = false;
        var defaultValue;
        if (withoutType.startsWith("[") && withoutType.includes("]")) {
            isOptional = true;
            var nameRaw = StringTools.matchBrackets.grabUnique(withoutType, "square", 0);
            var withoutName = withoutType.replace(nameRaw, "").trim();
            words = withoutName.split(" ").filter(fn.isTruthy);
            nameRaw = nameRaw.slice(1, -1);
            var nameSplit = nameRaw.split("=");
            defaultValue = nameSplit.slice(1).join("=");
            name = nameSplit[0];
        } else {
            words = withoutType.split(" ").filter(fn.isTruthy);
            name = words.splice(0, 1)[0] || "";
        }
        if (!name) return undefined;
        var isRestParam = (type === null || type === void 0 ? void 0 : type.startsWith("...")) || false;
        var comment = words.slice(words[0] === "-" ? 1 : 0).join(" ") || undefined;
        var result = ObjectTools.clean({
            name: name,
            type: type,
            isOptional: isOptional,
            isRestParam: isRestParam,
            defaultValue: defaultValue,
            comment: comment
        });
        return result;
    }).filter(fn.isTruthy);
    var returns = function() {
        var tag = jsdocTags.find(function(tag) {
            return tag.startsWith("@return");
        });
        if (!tag) return undefined;
        var withoutTag = tag.replace(/\s*@\S+/, "").trim();
        var typeRaw = "";
        if (withoutTag.startsWith("{")) {
            typeRaw = StringTools.matchBrackets.grabUnique(withoutTag, "curly", 0);
        }
        var type = typeRaw.replaceAll(/^\{|\}$/g, "") || undefined;
        var withoutType = withoutTag.replace(typeRaw, "").trim();
        var words = _toConsumableArray(withoutType.split(" ").slice(1)).concat([
            ""
        ]);
        var comment = words.slice(words[0] === "-" ? 1 : 0).join(" ").trim() || undefined;
        return ObjectTools.clean({
            type: type,
            comment: comment
        });
    }();
    var jsdoc = ObjectTools.clean({
        allTags: jsdocTags,
        params: params.length ? params : undefined,
        returns: returns
    });
    return jsdoc;
};
