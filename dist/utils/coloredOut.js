export var coloredOut = {
    HEADER: function(str) {
        return "\x1b[97m\x1b[2m".concat(str, "\x1b[22m\x1b[39m");
    },
    PACKAGENAME: function(str) {
        return "\x1b[97m\x1b[1m".concat(str, "\x1b[22m\x1b[39m");
    },
    PROPNAME: function(str) {
        return "\x1b[37m\x1b[2m".concat(str, "\x1b[22m\x1b[39m");
    },
    REGULARVALUE: function(str) {
        return "\x1b[37m".concat(str, "\x1b[39m");
    },
    NONE: function(str) {
        return "\x1b[90m\x1b[2m".concat(str, "\x1b[22m\x1b[39m");
    },
    GREEN: function(str) {
        return "\x1b[32m".concat(str, "\x1b[39m");
    },
    RED: function(str) {
        return "\x1b[31m".concat(str, "\x1b[39m");
    },
    YELLOW: function(str) {
        return "\x1b[33m".concat(str, "\x1b[39m");
    },
    BOLD: function(str) {
        return "\x1b[1m".concat(str, "\x1b[22m");
    }
};
