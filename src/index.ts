#!/usr/bin/env node

import { getOptions } from './options.js';
import { find } from './find.js';
import { parseComments } from './parse.js';
import { organise } from './organise.js';
import { formatMain } from './format.js';
import { exportAndSave } from './export.js';

/*<!-- DOCS: 1 ### -->
 * Setup
 */
/*<!-- DOCS: 1 ### -->
 * Install
 *
 * ```bash
 * yarn add -D swiss-docs
 * ```
 *
 * or
 *
 * ```bash
 * npm install --save-dev swiss-docs
 * ```
 */
/*<!-- DOCS: 1 ### -->
 * Add to scripts
 *
 * Add a script to your package.json
 *
 * ```json
 * {
 *  "scripts": {
 *   "docs": "swiss-docs -i src -o README.md"
 * }
 * ```
 */

const run = async () => {
  try {
    const opts = getOptions();

    console.log('');
    console.log('Running \u001b[1mswiss-docs\u001b[22m with options:');
    Object.entries(opts).forEach(([key, value]) => console.log(` - ${key}: ${value ?? '\u001b[90m[none]\u001b[39m'}`));
    console.log('');

    const foundComments = await find(opts.src);
    const parsedComments = parseComments(foundComments);

    const organised = organise(parsedComments);

    await exportAndSave(organised, opts);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

run();
