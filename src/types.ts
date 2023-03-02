/**<!-- DOCS: 1 ## -->
 * Command line options
 */
export interface CmdOptions {
  /**<!-- DOCS: 1 ### -->
   * --src, -s or -i
   *
   * The source folder to search for documentation
   */
  src: string;

  /**<!-- DOCS: 1 ### -->
   * --output or -o
   *
   * The output file to write the markdown to
   */
  output: string;

  /**<!-- DOCS: 1 ### -->
   * --template or -t
   *
   * An optional template to use for the output markdown
   *
   * Default: [output]
   */
  template: string;

  /**<!-- DOCS: 1 ### -->
   * --rootid or -r
   *
   * The name of the root id that 'Back to Top' links will use
   *
   * Default: wont add a 'Back to Top' link
   */
  rootId: string;
}

export interface DocSegment {
  priority: number;
  titleLevel: number;
  title: string;
  body: string;
}
