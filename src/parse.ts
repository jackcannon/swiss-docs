import { DocSegment, FoundComment, JSDocInfo, JSDocParam, JSDocReturns } from './types.js';
import { ObjectTools, fn } from 'swiss-ak';

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

const parseJSDocTags = (jsdocTags: string[]): JSDocInfo => {
  const params: JSDocParam[] = jsdocTags
    .filter((tag) => tag.startsWith('@param') || tag.startsWith('@arg ') || tag.startsWith('@argument'))
    .map((tag) => {
      const typeRaw = tag.match(/\{.*\}/)?.[0] || '';
      const type = typeRaw.slice(1, -1) || undefined;

      const withoutTag = tag.replace(/\s*@\S+/, '').trim();
      const withoutType = withoutTag.replace(typeRaw, '').trim();

      let words: string[];
      let name: string;
      let isOptional: boolean = false;
      let defaultValue: string;
      if (withoutType.startsWith('[') && withoutType.includes(']')) {
        isOptional = true;
        let nameRaw = withoutType.match(/\[.*\]/)?.[0];
        const withoutName = withoutType.replace(nameRaw, '').trim();
        words = withoutName.split(' ').filter(fn.isTruthy);
        nameRaw = nameRaw.slice(1, -1);
        const nameSplit = nameRaw.split('=');
        defaultValue = nameSplit.slice(1).join('=');
        name = nameSplit[0];
      } else {
        words = withoutType.split(' ').filter(fn.isTruthy);

        name = words.splice(0, 1)[0] || '';
      }

      if (!name) return undefined;

      const isRestParam = type?.startsWith('...') || false;

      const comment = words.slice(words[0] === '-' ? 1 : 0).join(' ') || undefined;

      const result: JSDocParam = ObjectTools.clean<JSDocParam, JSDocParam>({
        name,
        type,
        isOptional,
        isRestParam,
        defaultValue,
        comment
      });
      return result;
    })
    .filter(fn.isTruthy);

  const returns: JSDocReturns = (() => {
    const tag = jsdocTags.find((tag) => tag.startsWith('@return'));
    if (!tag) return undefined;

    const withoutTag = tag.replace(/\s*@\S+/, '').trim();

    const typeRaw = withoutTag.match(/\{.*\}/)?.[0] || '';
    const type = typeRaw.slice(1, -1) || undefined;

    const withoutType = withoutTag.replace(typeRaw, '').trim();

    const words = [...withoutType.split(' ').slice(1), ''];

    const comment =
      words
        .slice(words[0] === '-' ? 1 : 0)
        .join(' ')
        .trim() || undefined;

    return ObjectTools.clean<JSDocReturns, JSDocReturns>({
      type,
      comment
    });
  })();

  const jsdoc = ObjectTools.clean<JSDocInfo, JSDocInfo>({
    allTags: jsdocTags,
    params: params.length ? params : undefined,
    returns
  });

  return jsdoc;
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
  const jsdocTags = (bodyRaw.match(/(^|\n)@[A-Za-z].*/g) || []).map((line) => line.trim());
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
