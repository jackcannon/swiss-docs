import minimist from 'minimist';
import pathModule from 'node:path';
const cancel = (message) => {
    throw new Error(message);
};
const prefixCwd = (path) => (path === undefined ? undefined : pathModule.join(process.cwd(), path));
export const getOptions = () => {
    const args = minimist(process.argv.slice(2));
    const options = {
        src: prefixCwd(args.src || args.s || args.i || args._[0] || cancel('No src folder provided')),
        output: prefixCwd(args.output || args.o || cancel('No output file provided')),
        template: prefixCwd(args.template || args.t || undefined),
        rootId: args.rootid || args.r || undefined
    };
    return options;
};
