import { StringTools } from 'swiss-ak';
import { table } from 'swiss-node';

import { CmdOptions, DocSegment } from './types.js';

const specialToken = 'SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX';

const getID = (title: string) =>
  StringTools.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), '');

export const formatTOC = (segments: DocSegment[], opts: CmdOptions): string => {
  const lines = segments.map(({ title, titleLevel }) => {
    const id = getID(title);
    const indent = '  '.repeat(titleLevel);
    const link = `[${title}](#${id})`;
    return `${indent}- ${link}`;
  });

  const firstLine = `  - [${opts.header || 'Table of Contents'}](#)`;

  const output = [firstLine, ...lines].join('\n');

  return output;
};

const formatMainSegment = (segment: DocSegment, opts: CmdOptions): string => {
  let output = '';

  // Title
  output += `${'#'.repeat(segment.titleLevel)} ${segment.title}`;

  // Body
  const showBody = segment.body !== undefined && segment.body !== '';
  if (showBody) {
    output += '\n' + segment.body + '\n';
  }

  // JSDoc
  const showJSDoc = segment.jsdoc?.params?.length || segment.jsdoc?.returns;
  if (showJSDoc) {
    const { params, returns } = segment.jsdoc;
    const IGNORE = -123;
    const sanitise = (row: (string | -123)[]): string[] => {
      return (row.filter((s) => s !== IGNORE) as string[]).map((cell) => cell?.replaceAll('|', '\\|'));
    };

    // parameters
    if (params?.length) {
      const hasTypes = params.some((param) => param.type);
      const hasDefaults = params.some((param) => param.defaultValue);
      const hasComments = params.some((param) => param.comment);

      const header = [
        sanitise([
          '#', // index
          'Parameter Name',
          'Required',
          hasTypes ? 'Type' : IGNORE,
          hasDefaults ? 'Default' : IGNORE,
          hasComments ? 'Description' : IGNORE
        ])
      ];
      const rows = params.map((param, index) => {
        const typeOut = hasTypes && param.type && param.isRestParam ? param.type.replace(/^\.\.\./, '') + '[]' : param.type;
        return sanitise([
          `*${index}${param.isRestParam ? '…' : ''}*`,
          '`' + param.name + '`',
          param.isOptional ? '*No*' : '**Yes**',
          hasTypes ? (param.type ? '`' + typeOut + '`' : '') : IGNORE,
          hasDefaults ? (param.defaultValue ? '`' + param.defaultValue + '`' : '') || '' : IGNORE,
          hasComments ? param.comment || '' : IGNORE
        ]);
      });

      // output += '\n' + 'Parameters';
      const tableOut = table.markdown(rows, header, {
        alignCols: sanitise([
          'center', // index
          'left', // name
          'left', // required
          hasTypes ? 'left' : IGNORE, // type
          hasDefaults ? 'left' : IGNORE, // default
          hasComments ? 'left' : IGNORE // description
        ]) as any[]
      });
      output += '\n' + tableOut.join('\n') + '\n';
    }
    // return type
    if (returns) {
      const hasComments = !!returns.comment;

      const header = [
        sanitise([
          //
          'Return Type',
          hasComments ? '' : IGNORE
        ])
      ];
      const rows = [
        sanitise([
          //
          returns.type ? '`' + returns.type + '`' : '',
          hasComments ? returns.comment : IGNORE
        ])
      ];
      const tableOut = table.markdown(rows, header);
      output += '\n' + tableOut.join('\n') + '\n';
    }
  }

  // Back to top
  if (showBody || showJSDoc) {
    const backToTop = `\n<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>`;
    output += backToTop;
  }

  return output;
};

export const formatMain = (segments: DocSegment[], opts: CmdOptions): string => {
  return segments.map((segment) => formatMainSegment(segment, opts)).join('\n\n');
};
