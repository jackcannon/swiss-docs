import { ArrayUtils } from 'swiss-ak';
export const organise = (comments) => {
    // 'sort' by priority, maintaining original order for equal priorities
    const groups = ArrayUtils.group(comments, (c) => c.priority);
    const sorted = ArrayUtils.sortByMapped(groups, (g) => g[0].priority);
    return sorted.flat();
};
