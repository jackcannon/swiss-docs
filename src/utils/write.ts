import fsP from 'fs/promises';
import { QueueManager } from 'swiss-ak';

const writeQueue = new QueueManager();

export const write = async (file: string, output: string) => {
  await writeQueue.add('write', async () => fsP.writeFile(file, output, 'utf8'));
  // await fsP.writeFile(file, output, 'utf8');
};
