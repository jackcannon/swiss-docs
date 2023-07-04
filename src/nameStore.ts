import { DocSegment } from './types.js';
import { warn } from './utils/logs.js';

export const nameStore = {};

export const storeSegmentsInNameStore = (segments: DocSegment[]) => {
  segments.forEach((segment) => {
    if (segment.name) {
      if (nameStore[segment.name]) {
        warn(`WARNING: Multiple segments with the name '${segment.name}' found. Only the latest one will be used.`);
      }
      nameStore[segment.name] = segment;
    }
  });
};

export const getStoredSegment = (name: string): DocSegment => {
  return nameStore[name];
};
