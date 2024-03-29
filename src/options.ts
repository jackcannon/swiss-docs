import minimist from 'minimist';
import pathModule from 'node:path';

import { CmdOptions } from './types.js';

const cancel = (message) => {
  throw new Error(message);
};

const prefixCwd = (path: string) => (path === undefined ? undefined : pathModule.join(process.cwd(), path));

export const getOptions = (): CmdOptions => {
  const args = minimist(process.argv.slice(2));

  const options: CmdOptions = {
    src: prefixCwd(args.src || args.s || args.i || args._[0] || cancel('No src folder provided')),
    output: prefixCwd(args.output || args.o || undefined),
    template: prefixCwd(args.template || args.t || undefined),
    header: args.header || args.h || undefined,
    alias: prefixCwd(args.alias || args.a || undefined),
    jsdoc: Boolean(args.jsdoc || args.j || undefined)
  };

  return options;
};
