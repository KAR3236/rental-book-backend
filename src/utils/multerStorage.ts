import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomAlphaNumeric } from './randomNumber';

export const storageConfig = {
  storage: diskStorage({
    destination: './upload',
    filename: (req, file, cb) => {
      const filename = `${randomAlphaNumeric(16)}${extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
};
