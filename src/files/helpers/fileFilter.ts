
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

export const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
    
  if (!file) {
    return callback(new Error('File is empty'));
  }
  
  const fileExtension = file.mimetype.split("/")[1];
  const validExtensions = ['jpg','png','jpeg','gif'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(null, false);
};
