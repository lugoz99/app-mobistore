import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from './cloudinary.provider';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 as CloudinarySDK } from 'cloudinary';
import * as streamifier from 'streamifier';
// cloudinary-response.ts

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;


@Injectable()
export class UploadsService {
  

  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinarySDK){}

  uploadImageToCloudinary(file: Express.Multer.File):Promise<CloudinaryResponse>{
    return new Promise<CloudinaryResponse>((resolve,reject) =>{
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {folder:'store-devices'},
        (error,result) =>{
          if(error) return reject(error)
          resolve(result)
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream); 
    });
  }

  async deleteImageFromCloudinary(publicId: string): Promise<void> {
    if (!publicId) return; 
    await this.cloudinary.uploader.destroy(publicId);
  }
}

