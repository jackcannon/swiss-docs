/*<!-- DOCS: ## 3 -->
 * Sub folder B
 */

//<!-- DOCS: 3 -->

/**<!-- DOCS: subFunc-Alias_T.est ### @ -->
 * subFunc
 *
 * this logs it out
 *
 * ```ts
 * subFunc('foo');
 * ```
 */
export const subFunc = (foo: string) => {
  console.log(foo + 'bar');
};

/*<!-- DOCS: -1 -->
 * IGNORE ME
 *
 * Don't show me in the README, but visible elsewhere, and can be used with DOCS-ALIAS
 */

//<!-- DOCS: 2 -->

/*<!-- DOCS: ## -->
 * Sub folder A (higher priority)
 *
 * Should show above Sub Folder B
 */
