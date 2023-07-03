import glob from 'glob';
import { explodePath } from 'swiss-node';

export const findFiles = async (directory: string, exts?: string): Promise<string[]> => {
  if (explodePath(directory).ext) return [directory];
  const files = await glob(`${directory}/**/*.${exts ? `{${exts}}` : '*'}`, { ignore: 'node_modules/**' });
  return [...(files || [])] as string[];
};
