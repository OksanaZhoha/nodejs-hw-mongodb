import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constans/uploadFiles.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, callback) => {
    const uniquePreffix = Date.now();
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();
  if (extension === 'exe') {
    throw createHttpError(400, 'exe file is not allowed');
  }
  callback(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
