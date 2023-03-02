import { DocSegment } from './types.js';

const parseComment = (comment: string): DocSegment => {
  const [fullMeta, metaContent] = comment.match(/<!-- DOCS:(.*?)-->/);

  // parse the metadata
  const priority = Number(metaContent.match(/[0-9.]/g)[0]);
  const titleLevel = metaContent.match(/#+/g)[0].length;

  // parse the content
  const withoutMeta = comment.replace(fullMeta, '');
  const content = withoutMeta
    .replace(/(^\/\*{1,3}\n?)|(\n?[ \t]{0,}\*\/$)/g, '')
    .replace(/(^|\n)[ \t]{0,}\* ?/g, '\n')
    .replace(/^\n/g, '');
  const [title, body] = content.split(/\n(.*)/s).map((s) => s.trim());

  return {
    priority,
    titleLevel,
    title,
    body
  };
};

export const parseComments = (comments: string[]) => {
  return comments.map(parseComment);
};
