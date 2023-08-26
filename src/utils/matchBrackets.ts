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
        depth: -1,
        currentID: -1,
        active: []
      },
      square: {
        depth: -1,
        currentID: -1,
        active: []
      },
      curly: {
        depth: -1,
        currentID: -1,
        active: []
      },
      angle: {
        depth: -1,
        currentID: -1,
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

      return outputDepth ? depth : id;
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
  export const depth = (input: string, replaceSymbols: Partial<BracketReplaceSymbols> = {}): string => runReplace(input, replaceSymbols, true);

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

  const runGrab = (
    input: string,
    bracketType: '()' | '[]' | '{}' | '<>' | 'round' | 'square' | 'curly' | 'angle' = 'round',
    subjectID: number = 0,
    replaceSymbols: Partial<BracketReplaceSymbols> = {},
    isDepth: boolean = false
  ): string[] => {
    const fullSyms = getReplaceSymbols(replaceSymbols);
    const [openSym, closeSym] = {
      '()': ['(', ')'],
      '[]': ['[', ']'],
      '{}': ['{', '}'],
      '<>': ['<', '>'],
      round: ['(', ')'],
      square: ['[', ']'],
      curly: ['{', '}'],
      angle: ['<', '>']
    }[bracketType].map((s) => fullSyms[s] as string);
    const endSym = fullSyms.END;

    const fullDirty = isDepth ? depth(input, replaceSymbols) : unique(input, replaceSymbols);
    const regex = new RegExp(`${openSym}${subjectID}${endSym}(.|\n)*?${closeSym}${subjectID}${endSym}`, 'g');
    const foundDirty = [...(fullDirty.matchAll(regex) || [])].map((match) => match[0]);

    const found = foundDirty.map((str) => clean(str, replaceSymbols));
    return found;
  };

  /**<!-- DOCS: StringTools.matchBrackets.grab #### -->
   * grab
   *
   * - `StringTools.matchBrackets.grab`
   *
   * TODO descpription
   * Grabs all at given depth
   *
   * ```typescript
   * // TODO example
   * ```
   */
  export const grab = (
    input: string,
    bracketType: '()' | '[]' | '{}' | '<>' | 'round' | 'square' | 'curly' | 'angle' = 'round',
    depthID: number = 0,
    replaceSymbols: Partial<BracketReplaceSymbols> = {}
  ): string[] => runGrab(input, bracketType, depthID, replaceSymbols, true);

  /**<!-- DOCS: StringTools.matchBrackets.grabUnique #### -->
   * grabUnique
   *
   * - `StringTools.matchBrackets.grabUnique`
   *
   * TODO descpription
   * Grabs all at given depth
   *
   * ```typescript
   * // TODO example
   * ```
   */
  export const grabUnique = (
    input: string,
    bracketType: '()' | '[]' | '{}' | '<>' | 'round' | 'square' | 'curly' | 'angle' = 'round',
    uniqueID: number = 0,
    replaceSymbols: Partial<BracketReplaceSymbols> = {}
  ): string => runGrab(input, bracketType, uniqueID, replaceSymbols, false)?.[0];

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
