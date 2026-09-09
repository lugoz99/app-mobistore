import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DeviceImagesService } from './device-images.service';
import { User } from '../auth/entities/user.entity';
import { DeviceImage } from './entities';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly deviceImagesService: DeviceImagesService,
    private readonly dataSource: DataSource,
    private readonly categoryService: CategoriesService,
  ) {}

  // CREATE
  async create(createDeviceDto: CreateDeviceDto, user: User) {
    // Separate the images from the other device data
    const { images = [], categoryId, ...deviceProperties } = createDeviceDto;

    const imageEntities = this.deviceImagesService.createFromUrls(images);

    let category = await this.categoryService.findOne(categoryId);

    // Create the device
    const device = this.deviceRepository.create({
      ...deviceProperties,
      images: imageEntities,
      user,
      category: category,
    });

    // Save the device and its images
    await this.deviceRepository.save(device);

    return device;
  }

  // FIND ALL
  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;

    const devices = await this.deviceRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
        category: true,
      },
      select: {
        category: {
          id: true,
          name: true,
        },
      },
    });

    // todo: totalPages = Math.ceil(totalRegistros / limit)
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
        category: true,
      },
      select: {
        category: { name: true },
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
  async update(id: string, updateDeviceDto: UpdateDeviceDto, user: User) {
    return this.updateWithTransaction(id, updateDeviceDto, user);
  }

  // UPDATE WITH TRANSACTION
  // This method updates the device and its images in one transaction
  public async updateWithTransaction(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
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
      const wantsToReplaceImages = images !== undefined;

      if (wantsToReplaceImages) {
        // Delete the old images from Cloudinary
        await this.deviceImagesService.deleteImages(device.images);

        // Delete the old images from the database
        await queryRunner.manager.delete(DeviceImage, {
          device: { id },
        });

        const newImagesEntities =
          this.deviceImagesService.createFromUrls(images);

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

      throw error;
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

  async deleteAllDevices() {
    await this.deviceRepository
      .createQueryBuilder()
      .delete()
      .from(Device)
      .execute();
  }
}
