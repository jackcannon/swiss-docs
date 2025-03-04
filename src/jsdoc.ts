import fsP from 'fs/promises';

import { PromiseTools } from 'swiss-ak';
import { getProgressBar } from 'swiss-node';
import transpile from 'ts-to-jsdoc';

import { write } from './utils/write.js';
import { warn } from './utils/logs.js';

import { CmdOptions, CombinedComment } from './types.js';
import { parseComments } from './parseComment.js';
import { findCommentsInText, findSrcFiles } from './find.js';
import { coloredOut } from './utils/coloredOut.js';

const DEBUG_JSDOC = false;
const debug = (message: string) => {
  if (DEBUG_JSDOC) console.log(coloredOut.PROPNAME(message));
};

export const runJSDocUpdate = async (opts: CmdOptions) => {
  const allFiles = await findSrcFiles(opts);

  const useFiles = allFiles;
  // .filter((file) => file.includes('$$.ts'));

  if (DEBUG_JSDOC) console.log(useFiles);

  const progressBar = getProgressBar(useFiles.length, {
    prefix: ' Updating JSDocs '
  });
  progressBar.start();

  const concurrentLimit = DEBUG_JSDOC ? 1 : 8;

  await PromiseTools.eachLimit(concurrentLimit, useFiles, async (file) => {
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
  try {
    debug('');
    debug('  ' + file);

    const original = await fsP.readFile(file, 'utf8');
    const originalComments = (await getParsedComments(original, file)).filter((segment) => segment.allowJSDocUpdates);

    if (originalComments.length === 0) {
      debug('      - no comments with allowJSDocUpdates enabled found');
      return;
    }

    debug('      - before transpile');
    const preEdited = await preEditFileText(original);
    const transpiled = await transpile(preEdited);
    const transpiledComments = await getParsedComments(transpiled, file);
    debug('      - after transpile');

    debug('      - before pair');
    const pairs = pairUpComments(originalComments, transpiledComments);
    debug('      - after pair');

    const rows: string[][] = [];

    let output = original;

    pairs.forEach(([originalComment, transpiledComment], index) => {
      debug(`      - handling pair ${index + 1}/${pairs.length}`);
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
          output = output.replace(originalComment.comment, postEdited.replaceAll('$', '$$$$'));
        }
      } catch (e) {
        // do nothing
        if (DEBUG_JSDOC) console.error(coloredOut.RED('ERROR'), e);
      }
    });

    debug('      - before write');
    await write(file, output);
    debug('      - after write');

    debug('');
    debug('');
  } catch (e) {
    if (DEBUG_JSDOC) console.error(coloredOut.RED('ERROR'), e);
  }
};
