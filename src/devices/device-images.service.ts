import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceImage } from './entities/device-image.entity';
import { UploadsService } from '../uploads/uploads.service';
import { DeviceImageDto } from './dto/create-device.dto';

@Injectable()
export class DeviceImagesService {
  constructor(
    @InjectRepository(DeviceImage)
    private readonly deviceImageRepository: Repository<DeviceImage>,
    private readonly uploadsService: UploadsService,
  ) {}

  // This method creates DeviceImage entities from uploaded files
  // It uploads each file to Cloudinary first
  async createFromFiles(
    files: Express.Multer.File[] = [],
  ): Promise<DeviceImage[]> {
    if (files.length === 0) return []; // no files, return empty list

    const uploadResults = await Promise.all(
      files.map((file) => this.uploadsService.uploadImageToCloudinary(file)),
    );

    return uploadResults.map((result) =>
      this.deviceImageRepository.create({
        url: result.secure_url,
        publicId: result.public_id,
      }),
    );
  }

  // This method creates DeviceImage entities from plain text URLs
  // No upload to Cloudinary here, the URL already exists
  createFromUrls(images: DeviceImageDto[] = []): DeviceImage[] {
    if (images.length === 0) return [];

    return images.map(({ url, publicId }) =>
      this.deviceImageRepository.create({ url, publicId }),
    );
  }

  // This method deletes old images: from Cloudinary (if they have a publicId)
  // and also from the database
  async deleteImages(images: DeviceImage[] = []): Promise<void> {
    if (images.length === 0) return;

    // delete each image from Cloudinary if it has a publicId
    await Promise.all(
      images
        .filter((image) => image.publicId) // only images uploaded to Cloudinary have publicId
        .map((image) =>
          this.uploadsService.deleteImageFromCloudinary(image.publicId),
        ),
    );

    // delete the rows from the database
    await this.deviceImageRepository.remove(images);
  }
}
