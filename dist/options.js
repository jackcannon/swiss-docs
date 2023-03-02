import minimist from "minimist";
import pathModule from "node:path";
var cancel = function(message) {
    throw new Error(message);
};
var prefixCwd = function(path) {
    return path === undefined ? undefined : pathModule.join(process.cwd(), path);
};
export var getOptions = function() {
    var args = minimist(process.argv.slice(2));
    var options = {
        src: prefixCwd(args.src || args.s || args.i || args._[0] || cancel("No src folder provided")),
        output: prefixCwd(args.output || args.o || cancel("No output file provided")),
        template: prefixCwd(args.template || args.t || undefined),
        rootId: args.rootid || args.r || undefined
    };
    return options;
};
