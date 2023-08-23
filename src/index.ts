#!/usr/bin/env node

import { getOptions } from './options.js';
import { findAllComments } from './find.js';
import { parseComments } from './parse.js';
import { organise } from './organise.js';
import { exportAndSave } from './exportMarkdown.js';
import { storeSegmentsInNameStore } from './nameStore.js';
import { runAlias } from './alias.js';
import { runJSDocUpdate } from './jsdoc.js';
import { CmdOptions } from 'types.js';

const getValueDisplay = (value: any) => {
  if (value === undefined) return '\u001b[90m[none]\u001b[39m';
  if (value === true) return '\u001b[32mtrue\u001b[39m';
  if (value === false) return '\u001b[90mfalse\u001b[39m';
  return value;
};

const printOptions = (opts: CmdOptions) => {
  console.log('Running \u001b[1mswiss-docs\u001b[22m with options:');
  Object.entries(opts).forEach(([key, value]) => console.log(` - ${key}: ${getValueDisplay(value)}`));
  console.log('');
};

const run = async () => {
  try {
    const opts = getOptions();

    console.log('');
    printOptions(opts);

    if (opts.jsdoc) {
      await runJSDocUpdate(opts);
    }

    const foundComments = await findAllComments(opts);
    const parsedComments = parseComments(foundComments);

    storeSegmentsInNameStore(parsedComments);

    const organised = organise(parsedComments);

    if (opts.output) {
      await exportAndSave(organised, opts);
    }

    if (opts.alias) {
      await runAlias(opts);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();
