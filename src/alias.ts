import fsP from 'fs/promises';

import { CmdOptions } from './types.js';
import { findFiles } from './utils/fileFiles.js';
import { ArrayTools, MathsTools, PromiseTools } from 'swiss-ak';
import { warn } from './utils/warn.js';
import { getStoredSegment } from './nameStore.js';

export const runAlias = async (options: CmdOptions) => {
  const files = await findFiles(options.alias);

  const stats = await PromiseTools.mapLimit(16, files, replaceAliasesInFile);
  const [changedCounts, unchangedCounts] = ArrayTools.zip(...stats) as number[][];
  const changed = MathsTools.addAll(...(changedCounts || []));
  const unchanged = MathsTools.addAll(...(unchangedCounts || []));

  if (changed > 0) console.log(`Replaced ${changed} aliases`);
  if (unchanged > 0) warn(`  WARNING: Unable to replace ${unchanged} aliases`);
};

const readFile = async (file: string): Promise<string> => {
  return await fsP.readFile(file, 'utf8');
};
const writeFile = async (file: string, newContents: string): Promise<undefined> => {
  await fsP.writeFile(file, newContents, 'utf8');
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
    return;
  }

  const body = segment.body ? ['', '', ...(segment.body || '').split('\n')].join('\n * ') : '';
  const result = `/**<!-- DOCS-ALIAS: ${aliasName} -->
 * ${segment.title}${body}
 */`;

  return result;
};

const replaceComments = (contents: string): { changed: number; unchanged: number; newContents: string } => {
  let newContents = contents;

  let changed = 0;
  let unchanged = 0;

  newContents = contents.replaceAll(/(?:^|\n)([ \t]*?)(?:(?:\/\*{1,3}((?:.|\n)*?)\s\*\/)|(?:\/\/\s?([^\n]*)))/g, (...args) => {
    const [fullMatch, indent, commentText1, commentText2] = args;
    const commentText = (commentText1 || commentText2 || '').trim();

    if (commentText.match(/<!-- ?DOCS-ALIAS: (.*?)-->/)) {
      const newComment = getNewComment({ fullMatch, indent, commentText });

      if (newComment) {
        changed++;
        return ['', ...newComment.split('\n')].join('\n' + indent);
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
