import { parseJSDocTags } from './parseJSDoc.js';
import { Segment, FoundComment } from './types.js';

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
  const subsection = metaContent.includes('#!');

  return {
    fullMeta,
    name,
    priority,
    titleLevel,
    subsection
  };
};

const parseComment = ({ fileLevelComment, comment }: FoundComment): Segment => {
  let filePriority = undefined;
  let fileTitleLevel = undefined;

  if (fileLevelComment) {
    const { priority, titleLevel } = parseMeta(fileLevelComment);
    filePriority = priority;
    fileTitleLevel = titleLevel;
  }

  // parse the metadata
  const { fullMeta, name, priority, titleLevel, subsection } = parseMeta(comment, filePriority, fileTitleLevel);

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

  const withoutJSDoc = bodyRaw.replaceAll(/(\n@[A-Za-z].*)|(^@[A-Za-z].*\n)|(@[A-Za-z].*$)/g, '') || '';

  const accessors = [...withoutJSDoc.matchAll(/^\s?- \`(.*)\`$/gm)].map((match) => match[1]);
  const withoutAccessors = withoutJSDoc
    .replace(/^\s?- \`(.*)\`$/gm, '')
    .trim()
    .replaceAll(/\n{3,}/g, '\n\n');

  const body = withoutAccessors.trim() || undefined;

  const jsdoc = parseJSDocTags(jsdocTags);

  return {
    priority,
    titleLevel,
    subsection,
    name,
    title,
    body,
    accessors,
    jsdoc
  };
};

export const parseComments = (comments: FoundComment[]) => {
  return comments.map(parseComment);
};
