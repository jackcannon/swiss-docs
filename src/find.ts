import fsP from 'fs/promises';

import { ArrayTools, PromiseTools, fn, range } from 'swiss-ak';
import { FoundComment } from 'types.js';
import { findFiles } from './utils/fileFiles.js';

const findCommentsInFile = async (file: string): Promise<FoundComment[]> => {
  const text = await fsP.readFile(file, 'utf8');

  const lines = text.split('\n');
  const trimmedLines = text.split('\n').map((s) => s.trim());

  let fileLevelDefinitions = lines
    .map((line, index) => [index, line] as [number, string])
    .filter(([index, line]) => line.match(/\/\/ {0,}<!-- {0,}DOCS: ?(.*?) {0,}-->/g));
  // sort them in a way so that the first one to match is the most recent (basically backwards)
  fileLevelDefinitions = ArrayTools.sortByMapped(fileLevelDefinitions, ([index]) => index, fn.desc);

  // find all javadoc comments
  const javadocComments = [...(text.match(/\/\*{1,3}(.|\n)*?\s\*\//g) || [])];

  // only include comments that have a meta tag
  const withMeta = javadocComments.filter((comment) => comment.match(/<!-- ?DOCS: .*?-->/));

  const founds: FoundComment[] = withMeta.map((comment) => {
    let fileLevelComment = '';
    if (fileLevelDefinitions.length) {
      const commentLines = comment.split('\n').map((s) => s.trim());
      const lineIndex = trimmedLines.findIndex((line, index) =>
        range(Math.min(3, commentLines.length)).every((i) => trimmedLines[index + i] === commentLines[i])
      );
      const fileLevelDef = fileLevelDefinitions.find(([index]) => index <= lineIndex);

      if (fileLevelDef) {
        fileLevelComment = fileLevelDef[1];
      }
    }
    return {
      fileLevelComment,
      file,
      comment
    };
  });

  return founds;
};

export const find = async (directory: string) => {
  // find all files
  const allFiles = await findFiles(directory, 'js,ts,jsx,tsx,mjs,mts,mjsx,mtsx');

  // find raw comments in all the files
  const allCommentsRaw = await PromiseTools.mapLimit(16, allFiles, findCommentsInFile);
  const allComments = allCommentsRaw.flat();

  return allComments;
};
