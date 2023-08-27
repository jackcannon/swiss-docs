import { Segment, SegmentFlatList, SegmentTree } from 'types.js';

/**
 * After being organised, the segments are in a nested tree structure.
 *
 * This allows you to get a flat list of all segments.
 *
 * Segments are unaltered, and still have their children, so the output list should only be used shallowly.
 *
 * A function can be passed that will determine whether or not to include a segments children, cutting off that branch of the tree (from being output here, not from the tree itself)
 */
export const flattenTree = (tree: SegmentTree, excludeChildrenFn?: (segment: Segment) => boolean): SegmentFlatList => {
  const output: SegmentFlatList = [];

  tree.forEach((segment) => {
    output.push(segment);

    if (segment.children?.length && !excludeChildrenFn?.(segment)) {
      output.push(...flattenTree(segment.children, excludeChildrenFn));
    }
  });

  return output;
};

export const findParent = (tree: SegmentTree, segment: Segment): Segment | undefined => {
  const parent = tree.find((parent) => parent.children?.includes(segment));
  if (parent) return parent;

  for (const child of tree) {
    if (child.children?.length) {
      const found = findParent(child.children, segment);
      if (found) return found;
    }
  }

  return undefined;
};

export const findAncestorSubsection = (tree: SegmentTree, segment: Segment): Segment | undefined => {
  let ancestor: Segment;
  do {
    ancestor = findParent(tree, ancestor || segment);
  } while (ancestor && !ancestor.subsection);
  return ancestor;
};
