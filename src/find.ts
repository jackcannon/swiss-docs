import fsP from 'fs/promises';
import glob from 'glob';
import { PromiseUtils } from 'swiss-ak';

const findFiles = async (directory: string) => {
  const files = await glob(`${directory}/**/*.{js,ts,jsx,tsx,mjs,mts,mjsx,mtsx}`, { ignore: 'node_modules/**' });
  return files;
};

const findCommentsInFile = async (file: string): Promise<string[]> => {
  const text = await fsP.readFile(file, 'utf8');

  // find all javadoc comments
  const javadocComments = [...text.match(/\/\*{2,3}(.|\n)*?\s\*\//g)];

  // only include comments that have a meta tag
  const withMeta = javadocComments.filter((comment) => comment.match(/<!-- ?DOCS: .*?-->/));

  return withMeta;
};

export const find = async (directory: string) => {
  // find all files
  const allFiles = await findFiles(directory);

  // find raw comments in all the files
  const allComments = (await PromiseUtils.mapLimit(16, allFiles, findCommentsInFile)).flat();

  return allComments;
};
