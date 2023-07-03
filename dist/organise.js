import { ArrayTools } from "swiss-ak";
export var organise = function(comments) {
    // 'sort' by priority, maintaining original order for equal priorities
    var groups = ArrayTools.group(comments, function(c) {
        return c.priority;
    });
    var sorted = ArrayTools.sortByMapped(groups, function(g) {
        return g[0].priority;
    });
    return sorted.flat();
};
