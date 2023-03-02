import { StringUtils } from 'swiss-ak';
import { CmdOptions, DocSegment } from './types.js';

const specialToken = 'SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX';

const getID = (title: string) =>
  StringUtils.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), '');

export const formatTOC = (segments: DocSegment[], opts: CmdOptions): string => {
  const lines = segments.map(({ title, titleLevel }) => {
    const id = getID(title);
    const indent = '  '.repeat(titleLevel);
    const link = `[${title}](#${id})`;
    return `${indent}- ${link}`;
  });

  const firstLine = `  - [${opts.header || 'Table of Contents'}](#${opts.rootId || ''})`;

  const output = [firstLine, ...lines].join('\n');

  return output;
};

const formatMainSegment = (segment: DocSegment, opts: CmdOptions): string => {
  let output = '';

  // Title
  output += `${'#'.repeat(segment.titleLevel)} ${segment.title}`;

  // Body
  if (segment.body !== undefined) {
    output += '\n' + segment.body + '\n';

    // Back to top
    const backToTop = opts.rootId ? `\n<a href="#${opts.rootId}" style="text-align: right"> [↑ Back to top ↑] </a>` : '';
    output += backToTop;
  }

  return output;
};

export const formatMain = (segments: DocSegment[], opts: CmdOptions): string => {
  return segments.map((segment) => formatMainSegment(segment, opts)).join('\n\n');
};
