import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as CloudinaryAPI } from "cloudinary";

export const CLOUDINARY = "CLOUDINARY";

export const cloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  inject: [ConfigService], // * : Le dice a NestJS que busque e inyecte el ConfigService
  useFactory: (config: ConfigService) => {
    CloudinaryAPI.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
    return CloudinaryAPI;
  }
}