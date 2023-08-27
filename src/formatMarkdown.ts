import { StringTools } from 'swiss-ak';
import { table } from 'swiss-node';

import { findAncestorSubsection, flattenTree } from './utils/treeUtils.js';
import { CmdOptions, Segment, JSDocParam, SegmentFlatList, SegmentTree } from './types.js';

const specialToken = 'SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX';

const getID = (title: string) =>
  StringTools.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), '');

const getTableOfContents = (segments: SegmentFlatList, opts: CmdOptions, levelOffset: number, includeFirstLine: boolean = false) => {
  const lines = segments.map((segment) => {
    const id = getID(segment.title);
    const indent = '  '.repeat(segment.titleLevel - levelOffset);
    const titleOut = segment.subsection || segment.children?.length ? `**${segment.title}**` : segment.title;
    const link = `[${titleOut}](#${id})`;
    return `${indent}- ${link}`;
  });

  const firstLine = `  - [**${opts.header || 'Table of Contents'}**](#)`;

  const outLines = includeFirstLine ? [firstLine, ...lines] : lines;
  const output = outLines.join('\n');

  return output;
};

export const formatPrimaryTOC = (segments: SegmentFlatList, opts: CmdOptions, tree: SegmentTree): string =>
  getTableOfContents(segments, opts, 0, true);

const getParamTypeDisplay = (param: JSDocParam) => (param.isRestParam ? param.type.replace(/^\.\.\./, '') + '[]' : param.type);

const formatSegmentTitle = (segment: Segment, opts: CmdOptions, tree: SegmentTree) => {
  return `${'#'.repeat(segment.titleLevel)} ${segment.title}`;
};

const formatSegmentTOC = (segment: Segment, opts: CmdOptions, tree: SegmentTree) => {
  const childSegments = flattenTree(segment.children || [], (segment) => segment.subsection);
  const toc = getTableOfContents([segment, ...childSegments], opts, Math.max(0, segment.titleLevel - 1), false);
  return '\n' + toc + '\n';
};
const formatSegmentBody = (segment: Segment, opts: CmdOptions, tree: SegmentTree) => {
  const body = segment.body;
  return '\n' + body + '\n';
};
const formatSegmentJSDoc = (segment: Segment, opts: CmdOptions, tree: SegmentTree) => {
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
const formatSegmentSignature = (segment: Segment, opts: CmdOptions, tree: SegmentTree) => {
  const accessors = segment.accessors.length ? segment.accessors : [segment.name];

  let section: string = '';

  const isFunction = !!segment.jsdoc?.returns;
  if (isFunction) {
    const params = segment.jsdoc.params
      ?.map((param) => {
        return `${param.isRestParam ? '...' : ''}${param.name}${param.type ? ': ' + getParamTypeDisplay(param) : ''}`;
      })
      .join(', ');
    const funcSuffix = `(${params})${segment.jsdoc?.returns?.type ? ': ' + segment.jsdoc.returns.type : ''}`;

    section = accessors.map((accessor) => `${accessor}${funcSuffix}`).join('\n');
  } else {
    section = accessors.map((accessor) => `${accessor};`).join('\n');
  }

  return '\n\n```typescript\n' + section + '\n```\n';
};
const formatSegmentBackToX = (segment: Segment, opts: CmdOptions, tree: SegmentTree) => {
  const target = findAncestorSubsection(tree, segment);

  let targetURL = '#';
  let targetName = 'top';
  if (target) {
    targetURL = '#' + getID(target.title);
    targetName = `<b>${target.title}</b>`;
  }

  const backToX = `\n<p style="text-align: right" align="right"><a href="${targetURL}"> [↑ Back to ${targetName} ↑] </a></p>`;
  return backToX;
};

const formatMainSegment = (segment: Segment, opts: CmdOptions, tree: SegmentTree): string => {
  let output = '';

  const showBody = !!(segment.body !== undefined && segment.body !== '');
  const showJSDoc = !!(segment.jsdoc?.params?.length || segment.jsdoc?.returns);
  const showTOC = segment.subsection && segment.children?.length;
  const showSignature = segment.accessors.length;

  output += formatSegmentTitle(segment, opts, tree);
  if (showSignature) output += formatSegmentSignature(segment, opts, tree);
  if (showBody) output += formatSegmentBody(segment, opts, tree);
  if (showTOC) output += formatSegmentTOC(segment, opts, tree);
  if (showJSDoc) output += formatSegmentJSDoc(segment, opts, tree);
  if (showBody || showJSDoc) output += formatSegmentBackToX(segment, opts, tree);

  return output;
};

export const formatMain = (segments: SegmentFlatList, opts: CmdOptions, tree: SegmentTree): string => {
  return segments.map((segment) => formatMainSegment(segment, opts, tree)).join('\n\n');
};
