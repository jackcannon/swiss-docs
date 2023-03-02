import fsP from 'fs/promises';

import { formatMain, formatTOC } from './format.js';
import { CmdOptions, DocSegment } from './types.js';

export const exportAndSave = async (segments: DocSegment[], opts: CmdOptions) => {
  const template = await fsP.readFile(opts.template || opts.output, 'utf8');
  let output = template;

  const tags = [...template.match(/<!-- ?DOCS: ?(.*?) ?-->/g)].map((s) => s.replace(/<!-- ?DOCS: ?(.*?) ?-->/g, '$1').trim());

  const wantsTOC = tags.filter((tag) => tag.toUpperCase().includes('TOC')).length >= 2;
  if (wantsTOC) {
    const toc = formatTOC(segments, opts);

    const replacement = ['<!-- DOCS: TOC START -->', '', toc, '', '<!-- DOCS: TOC END -->'].join('\n');

    output = output.replace(/<!-- ?DOCS: ?(START TOC|TOC START) ?-->(.|\n)*?<!-- ?DOCS: ?(END TOC|TOC END) ?-->/gi, replacement);
  }

  const wantsMain = tags.filter((tag) => tag.toUpperCase().includes('MAIN')).length >= 2;
  if (wantsMain) {
    const main = formatMain(segments, opts);
    const replacement = ['<!-- DOCS: MAIN START -->', '', main, '', '<!-- DOCS: MAIN END -->'].join('\n');

    output = output.replace(/<!-- ?DOCS: ?(START MAIN|MAIN START) ?-->(.|\n)*?<!-- ?DOCS: ?(END MAIN|MAIN END) ?-->/gi, replacement);
  }

  await fsP.writeFile(opts.output, output, 'utf8');
};
