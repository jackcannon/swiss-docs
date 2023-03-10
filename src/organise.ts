import { ArrayUtils } from 'swiss-ak';
import { DocSegment } from './types.js';

export const organise = (comments: DocSegment[]) => {
  // 'sort' by priority, maintaining original order for equal priorities
  const groups = ArrayUtils.group(comments, (c) => c.priority);
  const sorted = ArrayUtils.sortByMapped(groups, (g) => g[0].priority);

  // console.log(
  //   'DEBUG',
  //   sorted.map((g) => g.map(({ priority, title }) => ({ priority, title })))
  // );

  return sorted.flat();
};
