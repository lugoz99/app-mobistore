import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DeviceImagesService } from './device-images.service';

@Injectable()
export class DevicesService {
  // Logger to print errors in the console, useful for debugging
  private readonly logger = new Logger('DevicesService');

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly deviceImagesService: DeviceImagesService,
  ) {}

  // CREATE - same logic as your original code, not changed
  async create(createDeviceDto: CreateDeviceDto, files: Express.Multer.File[]) {
    try {
      // 1. Separate the images (text) from the rest of the device data
      const { images = [], ...deviceProperties } = createDeviceDto;

      // Empty array to store the final DeviceImage entities
      let finalImagesEntities = [];

      // 2. If the client sent files, upload them to Cloudinary
      if (files.length > 0) {
        finalImagesEntities = await this.deviceImagesService.createFromFiles(files);
      }

      // 3. If the client also sent plain text URLs, add them too
      if (images.length > 0) {
        const textImageEntities = this.deviceImagesService.createFromUrls(images);
        finalImagesEntities = [...finalImagesEntities, ...textImageEntities];
      }

      // 4. Create the device with the combined images
      const device = this.deviceRepository.create({
        ...deviceProperties,
        images: finalImagesEntities,
      });

      // 5. Save the device and its images (cascade)
      await this.deviceRepository.save(device);

      return device;

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  // FIND ALL - returns a paginated list of devices
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const devices = await this.deviceRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true, // include the images relation
      },
    });

    // Return devices with a simple images array (only urls), like a plain JSON
    return devices.map(device => ({
      ...device,
      images: device.images.map(image => image.url),
    }));
  }

  // FIND ONE - internal method, returns the raw entity with relations
  // Used by update() and findOnePlain()
  async findOne(term: string) {
    const device = await this.deviceRepository.findOne({
      where: { id: term },
      relations: { images: true },
    });

    if (!device) {
      throw new NotFoundException(`Device with id ${term} not found`);
    }

    return device;
  }

  // FIND ONE PLAIN - public method, returns device with simple images array
  async findOnePlain(term: string) {
    const device = await this.findOne(term);

    return {
      ...device,
      images: device.images.map(image => image.url),
    };
  }

  // UPDATE - can also replace images if the client sends new ones
  async update(id: string, updateDeviceDto: UpdateDeviceDto, files: Express.Multer.File[] = []) {
    try {
      const { images, ...deviceProperties } = updateDeviceDto;

      // 1. Find the device with its current images loaded
      const device = await this.findOne(id);

      // 2. Check if the client wants to replace the images
      // This happens only if new files or new text URLs were sent
      const wantsToReplaceImages = files.length > 0 || (images && images.length > 0);

      if (wantsToReplaceImages) {
        // 2a. Delete the old images first (from Cloudinary and from the database)
        await this.deviceImagesService.deleteImages(device.images);

        // 2b. Build the new images from files and/or text URLs
        let newImagesEntities = [];

        if (files.length > 0) {
          newImagesEntities = await this.deviceImagesService.createFromFiles(files);
        }

        if (images && images.length > 0) {
          const textImageEntities = this.deviceImagesService.createFromUrls(images);
          newImagesEntities = [...newImagesEntities, ...textImageEntities];
        }

        device.images = newImagesEntities;
      }

      // 3. Update the other device properties
      Object.assign(device, deviceProperties);

      // 4. Save everything
      await this.deviceRepository.save(device);

      return this.findOnePlain(id);

    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  // REMOVE - deletes a device and its images (Cloudinary + database)
  async remove(id: string) {
    const device = await this.findOne(id);

    // delete the images first (Cloudinary + database rows)
    await this.deviceImagesService.deleteImages(device.images);

    // delete the device itself
    await this.deviceRepository.remove(device);

    return { message: `Device with id ${id} was deleted` };
  }

  // Handles database errors and throws proper HTTP exceptions
  private handleDbExceptions(error: any) {
    // 23505 is the Postgres code for "unique constraint violation"
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}