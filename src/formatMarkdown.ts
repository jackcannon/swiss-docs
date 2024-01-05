import { StringTools } from 'swiss-ak';
import { table } from 'swiss-node';

import { findAncestorSubsection, flattenTree } from './utils/treeUtils.js';
import { CmdOptions, Segment, JSDocParam, SegmentFlatList, SegmentTree } from './types.js';

const specialToken = 'SUPERSECRETSPECIALCHARACTERFORSWISS123GOAWAYTHX';

const hasUniqueNormalID = (segment: Segment, flat: SegmentFlatList) => {
  const id = getIDFromTitle(segment.title);
  const sameTitle = flat.find((s) => s !== segment && getIDFromTitle(s.title) === id);
  return !sameTitle;
};

const getSpecialIDFromName = (name: string) => name.replace(/[^A-Za-z0-9]/g, '_').toLowerCase();
const getIDFromTitle = (title: string) =>
  StringTools.toLowerSlugCase(title.replace(/[^A-Za-z0-9 ]/g, specialToken)).replaceAll(specialToken.toLowerCase(), '');

const inlineCode = (text: string) =>
  text.includes('`') ? '``' + (text.startsWith('`') ? ' ' : '') + text + (text.endsWith('`') ? ' ' : '') + '``' : '`' + text + '`';

const getTableOfContents = (
  segments: SegmentFlatList,
  opts: CmdOptions,
  levelOffset: number,
  includeFirstLine: boolean = false,
  flat: SegmentFlatList
) => {
  const lines = segments.map((segment) => {
    const isUnique = hasUniqueNormalID(segment, flat);
    const id = isUnique ? getIDFromTitle(segment.title) : getSpecialIDFromName(segment.name);

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

export const formatPrimaryTOC = (segments: SegmentFlatList, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList): string =>
  getTableOfContents(segments, opts, 0, true, flat);

const getParamTypeDisplay = (param: JSDocParam) => (param.isRestParam ? param.type.replace(/^\.\.\./, '') + '[]' : param.type);

const formatSegmentTitle = (segment: Segment, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList) => {
  const isUnique = hasUniqueNormalID(segment, flat);
  const hashes = '#'.repeat(segment.titleLevel);
  if (isUnique) {
    return `${hashes} ${segment.title}`;
  } else {
    return `${hashes} <span id="${getSpecialIDFromName(segment.name)}">${segment.title}</span>`;
  }
};

const formatSegmentTOC = (segment: Segment, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList) => {
  const childSegments = flattenTree(segment.children || [], (segment) => segment.subsection);
  const toc = getTableOfContents([segment, ...childSegments], opts, Math.max(0, segment.titleLevel - 1), false, flat);
  return '\n' + toc + '\n';
};
const formatSegmentBody = (segment: Segment, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList) => {
  const body = segment.body;
  return '\n' + body + '\n';
};
const formatSegmentJSDoc = (segment: Segment, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList) => {
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
        inlineCode(param.name),
        param.isOptional ? '*No*' : '**Yes**',
        hasTypes ? (param.type ? inlineCode(typeOut) : '') : IGNORE,
        hasDefaults ? (param.defaultValue ? inlineCode(param.defaultValue) : '') || '' : IGNORE,
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
      ]) as any[],
      maxWidth: Infinity
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
        returns.type ? inlineCode(returns.type) : '',
        hasComments ? returns.comment : IGNORE
      ])
    ];

    const tableOut = table.markdown(rows, header, { maxWidth: Infinity });
    output += '\n' + tableOut.join('\n') + '\n';
  }
  return output;
};
const formatSegmentSignature = (segment: Segment, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList) => {
  const accessors = segment.accessors.length ? segment.accessors : [segment.name];

  let section: string = '';

  const isFunction = !!segment.jsdoc?.returns;
  if (isFunction) {
    const params =
      segment.jsdoc.params
        ?.map((param) => {
          return `${param.isRestParam ? '...' : ''}${param.name}${param.type ? ': ' + getParamTypeDisplay(param) : ''}`;
        })
        .join(', ') ?? '';
    const funcSuffix = `(${params})${segment.jsdoc?.returns?.type ? ': ' + segment.jsdoc.returns.type : ''}`;

    section = accessors.map((accessor) => `${accessor}${funcSuffix}`).join('\n');
  } else {
    section = accessors.map((accessor) => `${accessor};`).join('\n');
  }

  return '\n\n```typescript\n' + section + '\n```\n';
};
const formatSegmentBackToX = (segment: Segment, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList) => {
  const target = findAncestorSubsection(tree, segment);

  let targetURL = '#';
  let targetName = 'top';
  if (target) {
    targetURL = '#' + getIDFromTitle(target.title);
    targetName = `<b>${target.title}</b>`;
  }

  const backToX = `\n<p style="text-align: right" align="right"><a href="${targetURL}"> [↑ Back to ${targetName} ↑] </a></p>`;
  return backToX;
};

const formatMainSegment = (segment: Segment, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList): string => {
  let output = '';

  const showBody = !!(segment.body !== undefined && segment.body !== '');
  const showJSDoc = !!(segment.jsdoc?.params?.length || segment.jsdoc?.returns);
  const showTOC = segment.subsection && segment.children?.length;
  const showSignature = segment.accessors.length;

  output += formatSegmentTitle(segment, opts, tree, flat);
  if (showSignature) output += formatSegmentSignature(segment, opts, tree, flat);
  if (showBody) output += formatSegmentBody(segment, opts, tree, flat);
  if (showTOC) output += formatSegmentTOC(segment, opts, tree, flat);
  if (showJSDoc) output += formatSegmentJSDoc(segment, opts, tree, flat);
  if (showBody || showJSDoc || showTOC) output += formatSegmentBackToX(segment, opts, tree, flat);

  return output;
};

export const formatMain = (segments: SegmentFlatList, opts: CmdOptions, tree: SegmentTree, flat: SegmentFlatList): string => {
  return segments.map((segment) => formatMainSegment(segment, opts, tree, flat)).join('\n\n');
};
