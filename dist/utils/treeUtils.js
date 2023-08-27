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
/**
 * After being organised, the segments are in a nested tree structure.
 *
 * This allows you to get a flat list of all segments.
 *
 * Segments are unaltered, and still have their children, so the output list should only be used shallowly.
 *
 * A function can be passed that will determine whether or not to include a segments children, cutting off that branch of the tree (from being output here, not from the tree itself)
 */ export var flattenTree = function(tree, excludeChildrenFn) {
    var output = [];
    tree.forEach(function(segment) {
        var _segment_children;
        output.push(segment);
        if (((_segment_children = segment.children) === null || _segment_children === void 0 ? void 0 : _segment_children.length) && !(excludeChildrenFn === null || excludeChildrenFn === void 0 ? void 0 : excludeChildrenFn(segment))) {
            var _output;
            (_output = output).push.apply(_output, _toConsumableArray(flattenTree(segment.children, excludeChildrenFn)));
        }
    });
    return output;
};
export var findParent = function(tree, segment) {
    var parent = tree.find(function(parent) {
        var _parent_children;
        return (_parent_children = parent.children) === null || _parent_children === void 0 ? void 0 : _parent_children.includes(segment);
    });
    if (parent) return parent;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = tree[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var child = _step.value;
            var _child_children;
            if ((_child_children = child.children) === null || _child_children === void 0 ? void 0 : _child_children.length) {
                var found = findParent(child.children, segment);
                if (found) return found;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return undefined;
};
export var findAncestorSubsection = function(tree, segment) {
    var ancestor;
    do {
        ancestor = findParent(tree, ancestor || segment);
    }while (ancestor && !ancestor.subsection);
    return ancestor;
};
