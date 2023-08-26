import { ObjectTools, fn, StringTools } from 'swiss-ak';
import { JSDocInfo, JSDocParam, JSDocReturns } from './types.js';

export const parseJSDocTags = (jsdocTags: string[]): JSDocInfo => {
  const params: JSDocParam[] = jsdocTags
    .filter((tag) => tag.startsWith('@param') || tag.startsWith('@arg ') || tag.startsWith('@argument'))
    .map((tag) => {
      const withoutTag = tag.replace(/\s*@\S+/, '').trim();

      let typeRaw: string = '';
      if (withoutTag.startsWith('{')) {
        typeRaw = StringTools.matchBrackets.grabUnique(withoutTag, 'curly', 0);
      }
      const type = typeRaw.replaceAll(/^\{|\}$/g, '') || undefined;

      const withoutType = withoutTag.replace(typeRaw, '').trim();

      let words: string[];
      let name: string;
      let isOptional: boolean = false;
      let defaultValue: string;
      if (withoutType.startsWith('[') && withoutType.includes(']')) {
        isOptional = true;
        let nameRaw = StringTools.matchBrackets.grabUnique(withoutType, 'square', 0);
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

    let typeRaw: string = '';
    if (withoutTag.startsWith('{')) {
      typeRaw = StringTools.matchBrackets.grabUnique(withoutTag, 'curly', 0);
    }
    const type = typeRaw.replaceAll(/^\{|\}$/g, '') || undefined;

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
