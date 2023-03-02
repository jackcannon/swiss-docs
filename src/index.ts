#!/usr/bin/env node

import { getOptions } from './options.js';
import { find } from './find.js';
import { parseComments } from './parse.js';
import { organise } from './organise.js';
import { formatMain } from './format.js';
import { exportAndSave } from './export.js';

console.log('test');

const run = async () => {
  const opts = getOptions();

  const rawComments = await find(opts.src);
  const parsedComments = parseComments(rawComments);

  const organised = organise(parsedComments);

  await exportAndSave(organised, opts);
};

run();
