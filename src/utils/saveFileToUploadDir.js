import path from 'node:path';
import fs from 'node:fs/promises';
import { env } from './env.js';

import { PUBLIC_DIR } from '../constans/uploadFiles.js';

export const saveFileToUploadDir = async (file, filePath) => {
  const newPath = path.join(PUBLIC_DIR, filePath, file.filename);
  await fs.rename(file.path, newPath);

  const domain = env('APP_DOMAIN');

  return `${domain}/${filePath}/${file.filename}`;
};
