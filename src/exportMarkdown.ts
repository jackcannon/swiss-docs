import fsP from 'fs/promises';

import { write } from './utils/write.js';
import { flattenTree } from './utils/treeUtils.js';

import { formatMain, formatPrimaryTOC } from './formatMarkdown.js';
import { CmdOptions, Segment, SegmentTree } from './types.js';

export const exportAndSave = async (tree: SegmentTree, opts: CmdOptions) => {
  const template = await fsP.readFile(opts.template || opts.output, 'utf8');
  let output = template;

  const flat = flattenTree(tree);

  const tags = [...template.match(/<!-- ?DOCS: ?(.*?) ?-->/g)].map((s) => s.replace(/<!-- ?DOCS: ?(.*?) ?-->/g, '$1').trim());

  const wantsTOC = tags.filter((tag) => tag.toUpperCase().includes('TOC')).length >= 2;
  if (wantsTOC) {
    const filteredSegments = flattenTree(tree, (segment) => segment.subsection)
      // don't include segments with negative priority
      .filter((segment) => segment.priority >= 0);

    const toc = formatPrimaryTOC(filteredSegments, opts, tree, flat);

    const replacement = ['<!-- DOCS: TOC START -->', '', toc, '', '<!-- DOCS: TOC END -->'].join('\n').replaceAll('$', '$$$$');

    output = output.replace(/<!-- ?DOCS: ?(START TOC|TOC START) ?-->(.|\n)*?<!-- ?DOCS: ?(END TOC|TOC END) ?-->/gi, replacement);
  }

  const wantsMain = tags.filter((tag) => tag.toUpperCase().includes('MAIN')).length >= 2;
  if (wantsMain) {
    const filteredSegments = flat
      // don't include segments with negative priority
      .filter((segment) => segment.priority >= 0);
    const main = formatMain(filteredSegments, opts, tree, flat);

    const replacement = ['<!-- DOCS: MAIN START -->', '', main, '', '<!-- DOCS: MAIN END -->'].join('\n').replaceAll('$', '$$$$');

    output = output.replace(/<!-- ?DOCS: ?(START MAIN|MAIN START) ?-->(.|\n)*?<!-- ?DOCS: ?(END MAIN|MAIN END) ?-->/gi, replacement);
  }

  await write(opts.output, output);
};
