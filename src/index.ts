#!/usr/bin/env node

import { getOptions } from './options.js';
import { findAllComments } from './find.js';
import { parseComments } from './parseComment.js';
import { organise } from './organise.js';
import { exportAndSave } from './exportMarkdown.js';
import { storeSegmentsInNameStore } from './nameStore.js';
import { runAlias } from './alias.js';
import { runJSDocUpdate } from './jsdoc.js';
import { CmdOptions } from 'types.js';
import { coloredOut } from './utils/coloredOut.js';

const getValueDisplay = (value: any) => {
  if (value === undefined) return coloredOut.NONE('[none]');
  if (value === true) return coloredOut.GREEN('true');
  if (value === false) return coloredOut.NONE('false');
  return coloredOut.REGULARVALUE(value + '');
};

const printOptions = (opts: CmdOptions) => {
  console.log(`${coloredOut.HEADER('Running ')}${coloredOut.PACKAGENAME('swiss-docs')}${coloredOut.HEADER(' with options:')}`);
  Object.entries(opts).forEach(([key, value]) => console.log(`${coloredOut.PROPNAME(` - ${key}:`)} ${getValueDisplay(value)}`));
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
    const segmentsUnsorted = parseComments(foundComments);

    storeSegmentsInNameStore(segmentsUnsorted);

    const organised = organise(segmentsUnsorted);

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
