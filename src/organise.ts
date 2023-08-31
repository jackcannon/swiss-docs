import { ArrayTools } from 'swiss-ak';

import { coloredOut } from './utils/coloredOut.js';

import { Segment, SegmentFlatList, SegmentTree } from './types.js';

const DEBUG_NAMES = true;

const organiseSort = (segments: SegmentFlatList): SegmentFlatList => {
  // 'sort' by priority, maintaining original order for equal priorities
  const groups = ArrayTools.group(segments, (c) => c.priority);
  const sorted = ArrayTools.sortByMapped(groups, (g) => g[0].priority);

  return sorted.flat();
};

const recursiveChildAdopter = (list: SegmentFlatList, depthOld: number): SegmentTree => {
  const depth = Math.min(...list.map((item) => item.titleLevel));

  const items = list.filter((item) => item.titleLevel === depth);

  if (items.length && list.indexOf(items[0]) !== 0) {
    // Sometimes it jumps 2 levels, but we don't want to lose the first item
    items.unshift(list[0]);
  }

  const indexes = items.map((item) => list.indexOf(item));

  const sections = indexes.map((parentIndex, i) => list.slice(parentIndex + 1, indexes.at(i + 1)));

  ArrayTools.zip(items, indexes, sections).forEach(([item, index, children]) => {
    if (children.length) {
      item.children = recursiveChildAdopter(children, depth + 1);
    }
  });
  return items;
};

const nestList = (list: SegmentFlatList): SegmentTree => {
  const lowestTitleLevel = Math.min(...list.map((item) => item.titleLevel));
  const newList = recursiveChildAdopter(list, lowestTitleLevel);
  return newList;
};

const organiseNest = (segments: SegmentFlatList): SegmentTree => {
  const notShown = segments.filter((item) => item.priority < 0);
  const shown = segments.filter((item) => item.priority >= 0);

  const notShownNested = nestList(notShown);
  const shownNested = nestList(shown);

  return [...notShownNested, ...shownNested];
};

export const organise = (segments: SegmentFlatList): SegmentTree => {
  const sorted = organiseSort(segments);

  if (DEBUG_NAMES) {
    const noNames = sorted.filter(({ name }) => !name);
    if (noNames.length) {
      console.log(coloredOut.BOLD(coloredOut.YELLOW('  Segments without names:')));
      const pwd = process.cwd();
      noNames.forEach(({ title, file }) => {
        console.log(coloredOut.YELLOW(`   - ${title}`), coloredOut.NONE(`(${file.replace(pwd, '.')})`));
      });
      console.log('');
    }
  }

  const nested = organiseNest(sorted);

  return nested;
};
