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
   *
   * If not given, the markdown will not be exported.
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

  /**<!-- DOCS: 2 ### -->
   * --alias
   *
   * Alias: -a
   *
   * Replace DOCS-ALIAS tags in the given file/dir with corresponding comments from the source
   *
   * If not given, no ALIAS tags will be replaced
   *
   * Default: false
   */
  alias: string;

  /**<!-- DOCS: 2 ### -->
   * --jsdoc
   *
   * Alias: -j
   *
   * Update the JSDoc @ tags in the src files before running the docs.
   *
   * > Note: this will make changes to the original source files
   *
   * Default: false
   */
  jsdoc: boolean;
}

export interface FoundComment {
  id?: string;
  fileLevelComment: string;
  file: string;
  comment: string;
}

export interface JSDocParam {
  name: string;
  type?: string;
  isOptional: boolean;
  isRestParam: boolean;
  defaultValue?: string;
  comment?: string;
}
export interface JSDocReturns {
  type?: string;
  comment?: string;
}
export interface JSDocInfo {
  allTags: string[];
  params?: JSDocParam[];
  returns?: JSDocReturns;
}

export interface DocSegment {
  priority: number;
  titleLevel: number;
  name?: string;
  title: string;
  body: string;
  jsdoc: JSDocInfo;
}

export type CombinedComment = FoundComment & DocSegment;
