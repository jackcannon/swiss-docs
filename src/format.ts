import { StringUtils } from 'swiss-ak';
import { CmdOptions, DocSegment } from './types.js';

const specialToken = 'SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX';

const getID = (title: string) =>
  StringUtils.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), '');

export const formatTOC = (segments: DocSegment[], opts: CmdOptions): string => {
  const output = segments
    .map(({ title, titleLevel }) => {
      const id = getID(title);
      const indent = '  '.repeat(titleLevel - 1);
      const link = `[${title}](#${id})`;
      return `${indent}- ${link}`;
    })
    .join('\n');

  return output;
};

const formatMainSegment = (segment: DocSegment, opts: CmdOptions): string => {
  let output = '';

  // Title
  output += `${'#'.repeat(segment.titleLevel)} ${segment.title}\n\n`;

  // Body
  output += segment.body;

  // Back to top
  const backToTop = opts.rootId ? `\n\n[↑ Back to top ↑](#${opts.rootId})` : '';
  output += backToTop;

  return output;
};

export const formatMain = (segments: DocSegment[], opts: CmdOptions): string => {
  return segments.map((segment) => formatMainSegment(segment, opts)).join('\n\n');
};
