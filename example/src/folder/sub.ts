/**<!-- DOCS: ## 3 -->
 * Sub folder B
 */

//<!-- DOCS: 3 -->

/**<!-- DOCS: ### -->
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

//<!-- DOCS: 2 -->

/**<!-- DOCS: ## -->
 * Sub folder A (higher priority)
 *
 * Should show above Sub Folder B
 */
