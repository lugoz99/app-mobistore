import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DeviceImagesService } from './device-images.service';
import { User } from '../auth/entities/user.entity';
import { DeviceImage } from './entities';

@Injectable()
export class DevicesService {
  // Logger to print errors in the console
  private readonly logger = new Logger('DevicesService');

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly deviceImagesService: DeviceImagesService,
    private readonly dataSource: DataSource,
  ) {}

  // CREATE
  async create(
    createDeviceDto: CreateDeviceDto,
    files: Express.Multer.File[],
    user: User,
  ) {
    try {
      // Separate the images from the other device data
      const { images = [], ...deviceProperties } = createDeviceDto;

      // Array to store all the new images
      let finalImagesEntities = [];

      // Upload the files to Cloudinary
      if (files.length > 0) {
        finalImagesEntities =
          await this.deviceImagesService.createFromFiles(files);
      }

      // Add the image URLs
      if (images.length > 0) {
        const textImageEntities =
          this.deviceImagesService.createFromUrls(images);

        finalImagesEntities = [...finalImagesEntities, ...textImageEntities];
      }

      // Create the device
      const device = this.deviceRepository.create({
        ...deviceProperties,
        images: finalImagesEntities,
        user,
      });

      // Save the device and its images
      await this.deviceRepository.save(device);

      return device;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  // FIND ALL
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const devices = await this.deviceRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    // Return only the image URLs
    return devices.map((device) => ({
      ...device,
      images: device.images.map((image) => image.url),
    }));
  }

  // FIND ONE
  // This method returns the device with its images
  async findOne(term: string) {
    const device = await this.deviceRepository.findOne({
      where: { id: term },
      relations: {
        images: true,
      },
    });

    if (!device) {
      throw new NotFoundException(`Device with id ${term} not found`);
    }

    return device;
  }

  // FIND ONE PLAIN
  // This method returns the device with only image URLs
  async findOnePlain(term: string) {
    const device = await this.findOne(term);

    return {
      ...device,
      images: device.images.map((image) => image.url),
    };
  }

  // UPDATE
  // This method updates the device using a transaction
  async update(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
    files: Express.Multer.File[] = [],
    user: User,
  ) {
    return this.updateWithTransaction(id, updateDeviceDto, files, user);
  }

  // UPDATE WITH TRANSACTION
  // This method updates the device and its images in one transaction
  public async updateWithTransaction(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
    files: Express.Multer.File[] = [],
    user: User,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Separate the images from the other device data
      const { images, ...deviceProperties } = updateDeviceDto;

      // Find the device with its current images
      const device = await queryRunner.manager.findOne(Device, {
        where: { id },
        relations: {
          images: true,
        },
      });

      if (!device) {
        throw new NotFoundException('Device not found');
      }

      // Check if the images need to be replaced
      const wantsToReplaceImages =
        files.length > 0 || (images && images.length > 0);

      if (wantsToReplaceImages) {
        // Delete the old images from Cloudinary
        await this.deviceImagesService.deleteImages(device.images);

        // Delete the old images from the database
        await queryRunner.manager.delete(DeviceImage, {
          device: { id },
        });

        // Create the new images
        let newImagesEntities: DeviceImage[] = [];

        // Upload the new files to Cloudinary
        if (files.length > 0) {
          const fileImages =
            await this.deviceImagesService.createFromFiles(files);

          newImagesEntities = [...fileImages];
        }

        // Add the new image URLs
        if (images && images.length > 0) {
          const urlImages = this.deviceImagesService.createFromUrls(images);

          newImagesEntities = [...newImagesEntities, ...urlImages];
        }

        // Connect each image to the device
        for (const image of newImagesEntities) {
          image.device = device;
        }

        // Save the new images
        await queryRunner.manager.save(DeviceImage, newImagesEntities);
      }

      // Update the device properties
      Object.assign(device, deviceProperties);

      // Save the user who updated the device
      device.user = user;

      // Save the device
      await queryRunner.manager.save(Device, device);

      // Confirm all database changes
      await queryRunner.commitTransaction();

      // Return the updated device
      return this.findOnePlain(id);
    } catch (error) {
      // Undo all database changes if something fails
      await queryRunner.rollbackTransaction();

      this.handleDbExceptions(error);
    } finally {
      // Close the query runner
      await queryRunner.release();
    }
  }

  // REMOVE
  // This method deletes the device and its images
  async remove(id: string) {
    const device = await this.findOne(id);

    // Delete the images from Cloudinary and the database
    await this.deviceImagesService.deleteImages(device.images);

    // Delete the device
    await this.deviceRepository.remove(device);

    return {
      message: `Device with id ${id} was deleted`,
    };
  }

  // Handle database errors
  private handleDbExceptions(error: any) {
    // 23505 means a unique constraint violation in PostgreSQL
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAllDevices() {
    await this.deviceRepository
      .createQueryBuilder()
      .delete()
      .from(Device)
      .execute();
  }
}
