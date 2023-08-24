import { ObjectTools } from 'swiss-ak';

//<!-- DOCS: -1 -->

// Note: originally planned to add to StringTools in swiss-ak, but not reliable enough, and had very limited application

/**<!-- DOCS: matchBrackets ### -->
 * matchBrackets
 *
 * Tools for matching corresponding brackets in a string
 */
export namespace matchBrackets {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

  const defaultReplaceSymbols: BracketReplaceSymbols = {
    END: '✧',
    '(': '❪',
    ')': '❫',
    '[': '❲',
    ']': '❳',
    '{': '❴',
    '}': '❵',
    '<': '❰',
    '>': '❱'
  };

  const runReplace = (input: string, replaceSymbols: Partial<BracketReplaceSymbols> = {}, outputDepth: boolean = false): string => {
    const fullSyms = getReplaceSymbols(replaceSymbols);

    interface BracketInfo {
      depth: number;
      currentID: number;
      active: [number, number][];
    }
    let infos = {
      round: {
        depth: 0,
        currentID: 0,
        active: []
      },
      square: {
        depth: 0,
        currentID: 0,
        active: []
      },
      curly: {
        depth: 0,
        currentID: 0,
        active: []
      },
      angle: {
        depth: 0,
        currentID: 0,
        active: []
      }
    };

    const updateInfo = (info: BracketInfo, startBr: string, endBr: string, br: string) => {
      let depth: number;
      let id: number;
      if (br === startBr || br === endBr) {
        if (br === startBr) {
          // start pair
          depth = ++info.depth;
          id = ++info.currentID;
          info.active.push([depth, id]);
        } else {
          // end pair
          depth = info.depth--;

          const activeIndex = info.active.findIndex(([d, i]) => d === depth);
          if (activeIndex !== -1) {
            const found = info.active.splice(activeIndex, 1)?.[0];
            if (found) id = found[1];
          }
        }
      }

      return id;
    };

    return input.replaceAll(/\(|\)|\[|\]|\{|\}|\<|\>/g, (br) => {
      let id =
        updateInfo(infos.round, '(', ')', br) ||
        updateInfo(infos.square, '[', ']', br) ||
        updateInfo(infos.curly, '{', '}', br) ||
        updateInfo(infos.angle, '<', '>', br);

      return fullSyms[br] + (id || '0') + fullSyms.END;
    });
  };

  /**<!-- DOCS: StringTools.matchBrackets.unique #### -->
   * unique
   *
   * - `StringTools.matchBrackets.unique`
   *
   * Replace brackets with symbols and with a unique ID for each bracket pair of each type
   *
   * ```typescript
   * // TODO example
   * ```
   * @param {string} input
   * @param {Partial<BracketReplaceSymbols>} [replaceSymbols={}]
   * @returns {string}
   */
  export const unique = (input: string, replaceSymbols: Partial<BracketReplaceSymbols> = {}): string => runReplace(input, replaceSymbols, false);

  /**<!-- DOCS: StringTools.matchBrackets.depth #### -->
   * depth
   *
   * - `StringTools.matchBrackets.depth`
   *
   * Replace brackets with symbols and with a numbers for how deep each bracket pair is for that bracket type
   *
   * ```typescript
   * // TODO example
   * ```
   * @param {string} input
   * @param {Partial<BracketReplaceSymbols>} [replaceSymbols={}]
   * @returns {string}
   */
  export const depth = (input: string, replaceSymbols: Partial<BracketReplaceSymbols> = {}): string => runReplace(input, replaceSymbols, false);

  /**<!-- DOCS: StringTools.matchBrackets.clean #### -->
   * clean
   *
   * - `StringTools.matchBrackets.clean`
   *
   * TODO descpription
   *
   * Default replace symbols:
   * ```typescript
   * {
   *   'END': '✧',
   *   '(': '❪',
   *   ')': '❫',
   *   '[': '❲',
   *   ']': '❳',
   *   '{': '❴',
   *   '}': '❵',
   *   '<': '❰',
   *   '>': '❱'
   * }
   * ```
   *
   * ```typescript
   * // TODO example
   * ```
   * @param {string} input
   * @param {Partial<BracketReplaceSymbols>} [replaceSymbols={}]
   * @returns {string}
   */
  export const clean = (input: string, replaceSymbols: Partial<BracketReplaceSymbols> = {}): string => {
    const fullSyms = getReplaceSymbols(replaceSymbols);
    const invertedSyms = ObjectTools.invert(fullSyms);

    const { END, ...withoutEND } = fullSyms;
    const startSyms = Object.values(withoutEND);
    const regex = new RegExp(`(${startSyms.map((s) => `\\${s}`).join('|')})[0-9]+${fullSyms.END}`, 'g');
    return input.replaceAll(regex, (m, startSym) => invertedSyms[startSym] || '');
  };

  /**<!-- DOCS: StringTools.matchBrackets.getReplaceSymbols #### -->
   * getReplaceSymbols
   *
   * - `StringTools.matchBrackets.getReplaceSymbols`
   *
   * Get a full set of replace symbols
   *
   * ```typescript
   * // TODO example
   * ```
   * @param {Partial<BracketReplaceSymbols>} [replaceSymbols={}]
   * @returns {BracketReplaceSymbols}
   */
  export const getReplaceSymbols = (replaceSymbols: Partial<BracketReplaceSymbols> = {}): BracketReplaceSymbols => {
    return {
      ...defaultReplaceSymbols,
      ...replaceSymbols
    };
  };

  /**<!-- DOCS: StringTools.matchBrackets.BracketReplaceSymbols #### -->
   * BracketReplaceSymbols
   *
   * - `StringTools.matchBrackets.BracketReplaceSymbols`
   *
   * Type for controlling the symbols used to replace brackets
   *
   * ```typescript
   * {
   *   END: string;
   *   '(': string;
   *   ')': string;
   *   '[': string;
   *   ']': string;
   *   '{': string;
   *   '}': string;
   *   '<': string;
   *   '>': string;
   * }
   * ```
   */
  export interface BracketReplaceSymbols {
    END: string;
    '(': string;
    ')': string;
    '[': string;
    ']': string;
    '{': string;
    '}': string;
    '<': string;
    '>': string;
  }
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
