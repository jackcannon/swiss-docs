import fsP from 'fs/promises';

import { PromiseTools, getProgressBar } from 'swiss-ak';
import transpile from 'ts-to-jsdoc';

import { write } from './utils/write.js';
import { warn } from './utils/logs.js';

import { CmdOptions, CombinedComment } from './types.js';
import { parseComments } from './parseComment.js';
import { findCommentsInText, findSrcFiles } from './find.js';

export const runJSDocUpdate = async (opts: CmdOptions) => {
  const allFiles = await findSrcFiles(opts);

  const progressBar = getProgressBar(allFiles.length, {
    prefix: ' Updating JSDocs '
  });
  progressBar.start();

  await PromiseTools.eachLimit(8, allFiles, async (file) => {
    await updateSingleFile(file);
    progressBar.next();
  });
  progressBar.finish();
};

// Edit the file before it gets handled by ts-to-jsdoc
const preEditFileText = async (text: string) => {
  let edited = text;
  edited = edited.replaceAll(/\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-START(.|\n)*?SWISS-DOCS-JSDOC-REMOVE-END(.*)\n/g, '');
  edited = edited.replaceAll(/\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-NEXT-LINE(.*)?\n(.*)?\n/g, '');
  edited = edited.replaceAll(/\n(.*)\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-THIS-LINE(.*)\n/g, '\n');
  edited = edited.replaceAll(/\n(.*)\n(.*)\/\/?\s?SWISS-DOCS-JSDOC-REMOVE-PREV-LINE(.*)\n/g, '\n');
  return edited;
};

// Edit the transpiled/updated comment before it gets written back to the original file
const postEditComment = (newComment: string, oldComment: string): string => {
  let edited = newComment;

  // Match the indentation of the old comment
  const indentation = oldComment.match(/\n((\s|\t)*)\*/)[1];
  edited = indentation ? edited.replaceAll(/\n((\s|\t)*)\*/g, `\n${indentation}*`) : edited;

  // Remove any 'import()' statements that have been added
  edited = edited.replaceAll(/(\*\s@.*?)import\(.*?\)\./g, '$1');

  // Remove JSDoc tags that aren't ones we want
  const acceptedTags = ['@param ', '@returns ', '@arg ', '@argument ', '@return '];
  edited = edited.replaceAll(/(?:(?:\n\s*\*)|(?:^\/\*\*)) (@.*)/g, (match, tag) => {
    const allowed = acceptedTags.some((test) => tag.startsWith(test));
    return allowed ? match : '';
  });

  return edited;
};

const getParsedComments = async (text: string, file: string) => {
  const foundComments = await findCommentsInText(text, file);
  const parsedComments = parseComments(foundComments);

  return foundComments.map((foundComment, index) => {
    const parsedComment = parsedComments[index];
    const result: CombinedComment = {
      ...foundComment,
      ...parsedComment
    };
    return result;
  });
};

const pairUpComments = (originalComments: CombinedComment[], transpiledComments: CombinedComment[]): [CombinedComment, CombinedComment][] => {
  const mappedPairs: [CombinedComment, CombinedComment][] = originalComments.map((orig) => {
    const byName = transpiledComments.filter((c) => (orig.name ? orig.name === c.name : orig.title === c.title));
    if (!byName.length) return [undefined, undefined];
    const matched =
      byName.length === 1
        ? byName[0]
        : byName.find((c) => orig.priority === c.priority && orig.titleLevel === c.titleLevel && orig.title === c.title) || byName[0];
    if (!matched) return [undefined, undefined];
    const result: [CombinedComment, CombinedComment] = [orig, matched];
    return result;
  });

  const filtered = mappedPairs.filter((pair) => pair && pair[0] && pair[1]);

  return filtered;
};

const updateSingleFile = async (file: string) => {
  const original = await fsP.readFile(file, 'utf8');
  const preEdited = await preEditFileText(original);
  const transpiled = await transpile(preEdited);

  const originalComments = await getParsedComments(original, file);
  const transpiledComments = await getParsedComments(transpiled, file);

  const pairs = pairUpComments(originalComments, transpiledComments);

  const rows: string[][] = [];

  let output = original;

  pairs.forEach(([originalComment, transpiledComment]) => {
    if (!originalComment || !transpiledComment) {
      warn(
        `Comment not found in transpiled file: ${
          originalComment?.name || originalComment?.title || transpiledComment?.name || transpiledComment?.title
        }`
      );
    }

    try {
      const postEdited = postEditComment(transpiledComment.comment, originalComment.comment);

      rows.push([originalComment.comment, postEdited]);

      // matches all the relevant props
      if (originalComment.comment !== postEdited) {
        output = output.replace(originalComment.comment, postEdited);
      }
    } catch (e) {
      // do nothing
    }
  });

  await write(file, output);
};
