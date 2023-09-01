// <!-- DOCS: 10 -->
/**<!-- DOCS: parent-section ## 10 -->
 * parent Section
 *
 * This is a parent section
 */
export namespace parentSection {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

  /**<!-- DOCS: childA-section ###! 10 -->
   * childA Section
   *
   * This is a childA section
   */
  export namespace childASection {
    // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

    /**<!-- DOCS: childA-section.doFoo #### @ -->
     * doFoo
     *
     * do a foo
     */
    export const doFoo = (param1?: string) => 'foo';

    /**<!-- DOCS: childA-section.doBar #### @ -->
     * doBar
     *
     * do a bar
     */
    export const doBar = (param1?: string) => 'bar';

    /**<!-- DOCS: childA-section.doBaz #### @ -->
     * doBaz
     *
     * do a baz
     */
    export const doBaz = (param1?: string) => 'baz';

    /**<!-- DOCS: childA-section.doQuz #### @ -->
     * doQuz
     *
     * do a quz
     */
    export const doQuz = (param1?: string) => 'quz';

    /**<!-- DOCS: childA-section.doCorge #### @ -->
     * doCorge
     *
     * do a corge
     */
    export const doCorge = (param1?: string) => 'corge';
  } // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE

  /**<!-- DOCS: childB-section ###! 10 -->
   * childB Section
   *
   * This is a childB section
   */
  export namespace childBSection {
    // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

    /**<!-- DOCS: childB-section.doLorem #### @ -->
     * doLorem
     *
     * do a lorem
     */
    export const doLorem = (param1?: string) => 'lorem';

    /**<!-- DOCS: childB-section.doIpsum #### @ -->
     * doIpsum
     *
     * do a ipsum
     */
    export const doIpsum = (param1?: string) => 'ipsum';

    /**<!-- DOCS: childB-section.doDolor #### @ -->
     * doDolor
     *
     * do a dolor
     */
    export const doDolor = (param1?: string) => 'dolor';

    /**<!-- DOCS: childB-section.doSit #### @ -->
     * doSit
     *
     * do a sit
     */
    export const doSit = (param1?: string) => 'sit';

    /**<!-- DOCS: childB-section.doAmet #### @ -->
     * doAmet
     *
     * do a amet
     */
    export const doAmet = (param1?: string) => 'amet';
  } // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
