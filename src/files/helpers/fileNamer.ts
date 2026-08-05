
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';
import { v6 as uuid } from 'uuid'

export const fileNamer = (
  _req: Request,
  file: Express.Multer.File,
  callback:Function,
) => {
    
  if (!file) {
    return callback(new Error('File is empty'));
  }
  
  const fileExtension = file.mimetype.split("/")[1];
  const fileName = `${uuid}.${fileExtension}`
  callback(null,fileName)
};
