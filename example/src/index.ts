import { subFunc } from './folder/sub.js';

/**<!-- DOCS: # 1 -->
 * Intro
 *
 * Blah blah blah
 */

/**<!-- DOCS: main-run ### 1 -->
 * run
 *
 * this is the run function
 *
 * ```ts
 * const example = run('foo');
 * ```
 *
 * @param {string} foo the foo
 * @returns {string} the foo
 */
export const run = (foo: string) => {
  subFunc(foo);
  return foo;
};
