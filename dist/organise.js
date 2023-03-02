import { ArrayUtils } from "swiss-ak";
export var organise = function(comments) {
    // 'sort' by priority, maintaining original order for equal priorities
    var groups = ArrayUtils.group(comments, function(c) {
        return c.priority;
    });
    var sorted = ArrayUtils.sortByMapped(groups, function(g) {
        return g[0].priority;
    });
    return sorted.flat();
};
