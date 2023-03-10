/**<!-- DOCS: 2 ## -->
 * Command line options
 */
export interface CmdOptions {
  /**<!-- DOCS: 2 ### -->
   * --src
   *
   * Alias: -s or -i
   *
   * The source folder to search for documentation
   */
  src: string;

  /**<!-- DOCS: 2 ### -->
   * --output
   *
   * Alias: -o
   *
   * The output file to write the markdown to
   */
  output: string;

  /**<!-- DOCS: 2 ### -->
   * --template
   *
   * Alias: -t
   *
   * An optional template to use for the output markdown
   *
   * Default: [output]
   */
  template: string;

  /**<!-- DOCS: 2 ### -->
   * --header
   *
   * Alias: -h
   *
   * The name to use at the top of the table of contents
   *
   * Default: 'Table of Contents'
   */
  header: string;
}

export interface FoundComment {
  fileLevelComment: string;
  file: string;
  comment: string;
}

export interface DocSegment {
  priority: number;
  titleLevel: number;
  title: string;
  body: string;
}
