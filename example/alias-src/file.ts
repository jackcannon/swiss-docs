{
  /** <!-- DOCS-ALIAS: main-run --> */
  const run = (foo: string) => {};

  // <!-- DOCS-ALIAS: subFunc-Alias_T.est -->
  const subFunc = (foo: string) => {};

  /**
   * This shouldn't change
   */
  const subFunc2 = (foo: string) => {};

  /**<!-- DOCS-ALIAS: subFunc-Alias_T.est -->
   * Already Has something here
   */
  const subFunc3 = (foo: string) => {};
}
