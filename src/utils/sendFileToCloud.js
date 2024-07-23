import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import { env } from '../utils/env.js';

const cloud_name = env('CLOUD_NAME');
const api_key = env('API_KEY');
const api_secret = env('API_SECRET');

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export const sendFileToCloud = async (file, folder) => {
  const res = await cloudinary.uploader.upload(file.path, {
    folder,
  });

  await fs.unlink(file.path);

  return res.url;
};
