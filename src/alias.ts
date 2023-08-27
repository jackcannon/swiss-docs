import fsP from 'fs/promises';

import { ArrayTools, MathsTools, PromiseTools, symbols } from 'swiss-ak';

import { findFiles } from './utils/findFiles.js';
import { write } from './utils/write.js';
import { success, warn } from './utils/logs.js';

import { CmdOptions } from './types.js';
import { getStoredSegment } from './nameStore.js';

export const runAlias = async (options: CmdOptions) => {
  const files = await findFiles(options.alias);

  const stats = await PromiseTools.mapLimit(16, files, replaceAliasesInFile);
  const [changedCounts, unchangedCounts] = ArrayTools.zip(...stats) as number[][];
  const changed = MathsTools.addAll(...(changedCounts || []));
  const unchanged = MathsTools.addAll(...(unchangedCounts || []));

  if (unchanged > 0) {
    console.log();
    warn(`WARNING: Unable to replace ${unchanged} aliases\n`);
  }
  if (changed > 0) success(`${symbols.TICK} Replaced ${changed} aliases\n`);

  // if (changed > 0 || unchanged > 0) console.log();
};

const readFile = async (file: string): Promise<string> => {
  return await fsP.readFile(file, 'utf8');
};
const writeFile = async (file: string, newContents: string): Promise<undefined> => {
  await write(file, newContents);
};

interface CommentInfo {
  fullMatch: string;
  indent: string;
  commentText: string;
}

const getNewComment = ({ commentText }: CommentInfo): string => {
  const aliasName = (commentText.match(/<!-- ?DOCS-ALIAS: (.*?)-->/)?.[1] || '').trim();

  const segment = getStoredSegment(aliasName);

  if (!segment) {
    warn(`WARNING: Unable to find docs for '${aliasName}'`);
    return;
  }

  const accessors = segment.accessors?.length ? '\n * \n' + [...(segment.accessors || '')].map((acc) => ` * - \`${acc}\``).join('\n') : '';
  const body = segment.body ? ['', '', ...(segment.body || '').split('\n')].join('\n * ') : '';
  const jsdocTags = segment.jsdoc?.allTags?.length ? ['', ...(segment.jsdoc.allTags || '')].join('\n * ') : '';
  const result = `/**<!-- DOCS-ALIAS: ${aliasName} -->
 * ${segment.title}${accessors}${body}${jsdocTags}
 */`;

  return result;
};

const replaceComments = (contents: string): { changed: number; unchanged: number; newContents: string } => {
  let newContents = contents;

  let changed = 0;
  let unchanged = 0;

  newContents = contents.replaceAll(/(?:^|\n)([ \t]*?)(?:(?:\/\*{1,3}((?:.|\n)*?)\s?\*\/)|(?:\/\/\s?([^\n]*)))/g, (...args) => {
    const [fullMatch, indent, commentText1, commentText2] = args;
    const commentText = (commentText1 || commentText2 || '').trim();

    if (commentText.match(/<!-- ?DOCS-ALIAS: (.*?)-->/)) {
      const newComment = getNewComment({ fullMatch, indent, commentText });

      if (newComment) {
        changed++;
        const result = ['', ...newComment.split('\n')].join('\n' + indent);
        return result;
      } else {
        unchanged++;
      }
    }

    // No change
    return fullMatch;
  });

  return { changed, unchanged, newContents };
};

const replaceAliasesInFile = async (file: string): Promise<[number, number]> => {
  const contents = await readFile(file);

  let { changed, unchanged, newContents } = replaceComments(contents);

  await writeFile(file, newContents);

  return [changed, unchanged];
};
