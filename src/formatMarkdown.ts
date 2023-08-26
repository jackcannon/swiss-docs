import { StringTools } from 'swiss-ak';
import { table } from 'swiss-node';

import { CmdOptions, DocSegment, JSDocParam } from './types.js';

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

const getParamTypeDisplay = (param: JSDocParam) => (param.isRestParam ? param.type.replace(/^\.\.\./, '') + '[]' : param.type);

const formatSegmentTitle = (segment: DocSegment, opts: CmdOptions) => {
  return `${'#'.repeat(segment.titleLevel)} ${segment.title}`;
};
const formatSegmentBody = (segment: DocSegment, opts: CmdOptions, removeAccessors: boolean = false) => {
  const body = removeAccessors
    ? segment.body
        .replace(/^\s?- \`(.*)\`$/gm, '')
        .trim()
        .replaceAll(/\n{3,}/g, '\n\n')
    : segment.body;

  return '\n' + body + '\n';
};
const formatSegmentJSDoc = (segment: DocSegment, opts: CmdOptions) => {
  let output = '';

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
      const typeOut = hasTypes && param.type && getParamTypeDisplay(param);
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
  return output;
};
const formatSegmentSignature = (segment: DocSegment, opts: CmdOptions) => {
  const accessors = [...segment.body.matchAll(/^\s?- \`(.*)\`$/gm)].map((match) => match[1]);

  const params = segment.jsdoc.params
    ?.map((param) => {
      return `${param.isRestParam ? '...' : ''}${param.name}${param.type ? ': ' + getParamTypeDisplay(param) : ''}`;
    })
    .join(', ');
  const funcSuffix = `(${params})${segment.jsdoc?.returns?.type ? ': ' + segment.jsdoc.returns.type : ''}`;

  const section = (accessors.length ? accessors : [segment.name]).map((accessor) => `${accessor}${funcSuffix}`).join('\n');
  return '\n\n```typescript\n' + section + '\n```\n';
};
const formatSegmentBackToTop = (segment: DocSegment, opts: CmdOptions) => {
  const backToTop = `\n<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>`;
  return backToTop;
};

const formatMainSegment = (segment: DocSegment, opts: CmdOptions): string => {
  let output = '';

  const showBody = !!(segment.body !== undefined && segment.body !== '');
  const showJSDoc = !!(segment.jsdoc?.params?.length || segment.jsdoc?.returns);
  const showSignature = !!segment.jsdoc?.returns;

  output += formatSegmentTitle(segment, opts);
  if (showSignature) output += formatSegmentSignature(segment, opts);
  if (showBody) output += formatSegmentBody(segment, opts, showSignature);
  if (showJSDoc) output += formatSegmentJSDoc(segment, opts);
  if (showBody || showSignature || showJSDoc) output += formatSegmentBackToTop(segment, opts);

  return output;
};

export const formatMain = (segments: DocSegment[], opts: CmdOptions): string => {
  return segments.map((segment) => formatMainSegment(segment, opts)).join('\n\n');
};
