import { parseJSDocTags } from './parseJSDoc.js';
import { DocSegment, FoundComment } from './types.js';

const parseMeta = (comment: string, defaultPriority: number = 10000, defaultTitleLevel: number = 0) => {
  const [fullMeta, metaContent] = comment.match(/<!-- DOCS:(.*?)-->/);

  if (!metaContent) {
    return {
      fullMeta,
      priority: defaultPriority,
      titleLevel: defaultTitleLevel
    };
  }

  const name = metaContent.match(/(^|\s)[A-Za-z-_.]+(\s|$)/g)?.[0].trim() || undefined;
  const priority = Number(metaContent.match(/-?[0-9]{1,}([.][0-9]{1,})?/g)?.[0] ?? defaultPriority);
  const titleLevel = (metaContent.match(/#+/g)?.[0] ?? '#'.repeat(defaultTitleLevel)).length;

  return {
    fullMeta,
    name,
    priority,
    titleLevel
  };
};

const parseComment = ({ fileLevelComment, comment }: FoundComment): DocSegment => {
  let filePriority = undefined;
  let fileTitleLevel = undefined;

  if (fileLevelComment) {
    const { priority, titleLevel } = parseMeta(fileLevelComment);
    filePriority = priority;
    fileTitleLevel = titleLevel;
  }

  // parse the metadata
  const { fullMeta, name, priority, titleLevel } = parseMeta(comment, filePriority, fileTitleLevel);

  // parse the content
  const withoutMeta = comment.replace(fullMeta, '');
  const content = withoutMeta
    .replace(/(^\/\*{1,3}\n?)|(\n?[ \t]{0,}\*\/$)/g, '')
    .replace(/(^|\n)[ \t]{0,}\* ?/g, '\n')
    .replace(/^\n/g, '');
  const [title, bodyRaw] = [...content.split(/\n(.*)/s), ''].map((s) => s.trim());

  // Find and remove the jsdoc tags
  const jsdocTags = (bodyRaw.match(/(^|\n)@[A-Za-z].*/g) || [])
    .map((line) => line.trim())
    .map((tag) => {
      // Clean tags
      let edited = tag;

      // Remove any import() statements that have been added
      edited = edited.replaceAll(/import\(.*?\)\./g, '');

      return edited;
    });
  const body = bodyRaw.replaceAll(/(\n@[A-Za-z].*)|(^@[A-Za-z].*\n)|(@[A-Za-z].*$)/g, '') || undefined;

  const jsdoc = parseJSDocTags(jsdocTags);

  return {
    name,
    priority,
    titleLevel,
    title,
    body,
    jsdoc
  };
};

export const parseComments = (comments: FoundComment[]) => {
  return comments.map(parseComment);
};
