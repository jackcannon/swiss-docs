var WARN_ANSI_START = "\x1b[33m\x1b[1m";
var WARN_ANSI_END = "\x1b[22m\x1b[39m";
export var warn = function(message) {
    console.warn("  ".concat(WARN_ANSI_START).concat(message).concat(WARN_ANSI_END));
};
var SUCCESS_ANSI_START = "\x1b[32m\x1b[1m";
var SUCCESS_ANSI_END = "\x1b[22m\x1b[39m";
export var success = function(message) {
    console.log("  ".concat(SUCCESS_ANSI_START).concat(message).concat(SUCCESS_ANSI_END));
};
