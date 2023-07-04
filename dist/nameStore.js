import { warn } from "./utils/logs.js";
export var nameStore = {};
export var storeSegmentsInNameStore = function(segments) {
    segments.forEach(function(segment) {
        if (segment.name) {
            if (nameStore[segment.name]) {
                warn("WARNING: Multiple segments with the name '".concat(segment.name, "' found. Only the latest one will be used."));
            }
            nameStore[segment.name] = segment;
        }
    });
};
export var getStoredSegment = function(name) {
    return nameStore[name];
};
