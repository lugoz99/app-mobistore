import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { DeviceImage, Device } from './entities';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger('DevicesService');

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,

    @InjectRepository(DeviceImage)
    private readonly deviceImageRepository: Repository<DeviceImage>,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new device along with its related images.
   */
  async create(createDeviceDto: CreateDeviceDto) {
    try {
      const { images = [], ...deviceProperties } = createDeviceDto;

      // Instantiate device entity and map array of image URLs to DeviceImage entities
      const device = this.deviceRepository.create({
        ...deviceProperties,
        images: images.map((img) =>
          this.deviceImageRepository.create({ url: img }),
        ),
      });

      // Save both the device and associated images in cascade
      await this.deviceRepository.save(device);

      return { ...device, images };
    } catch (error) {
      this.hadleDbExceptions(error);
    }
  }

  /**
   * Retrieves all devices with pagination and flattens image entities to simple URL strings.
   */
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const devices = await this.deviceRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });

    return devices.map((device) => ({
      ...device,
      images: device.images ? device.images.map((img) => img.url) : [],
    }));
  }

  /**
   * Helper method to fetch a device by term and return a flattened object with image URLs.
   */
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  /**
   * Finds a device by ID (UUID), model name, or model slug.
   * Loads image relations in all search branches.
   */
  async findOne(term: string): Promise<Device> {
    let device: Device;

    if (isUUID(term)) {
      device = await this.deviceRepository.findOne({
        where: { id: term },
        relations: { images: true },
      });
    } else {
      const queryBuilder = this.deviceRepository.createQueryBuilder('device');
      device = await queryBuilder
        .leftJoinAndSelect('device.images', 'deviceImages')
        .where(
          'device.id = :id OR UPPER(device.modelName) = :modelName OR LOWER(device.modelSlug) = :modelSlug',
          {
            id: term,
            modelName: term.toUpperCase(),
            modelSlug: term.toLowerCase(),
          },
        )
        .getOne();
    }

    if (!device) {
      throw new NotFoundException(`Device with term '${term}' not found`);
    }

    return device;
  }

  /**
   * Updates an existing device and manages image replacements using a database transaction.
   */
  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const { images, ...toUpdate } = updateDeviceDto;

    // Load existing device attributes without loading relations
    const device = await this.deviceRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!device) throw new NotFoundException(`Device with id '${id}' not found!`);

    // Create QueryRunner for transactional consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        // Delete previous images associated with this device
        await queryRunner.manager.delete(DeviceImage, { device: { id } });

        // Instantiate new image entities and assign to device
        device.images = images.map((image) =>
          this.deviceImageRepository.create({ url: image }),
        );
      }

      // Save updated device and new images within the transaction
      await queryRunner.manager.save(device);

      // Commit transaction and release database connection
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // Return flattened device entity with updated image URLs
      return this.findOnePlain(id);
    } catch (error) {
      // Rollback transaction on failure and release connection
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.hadleDbExceptions(error);
    }
  }

  /**
   * Removes a device entity from the database.
   */
  async remove(id: string) {
    const record = await this.findOne(id);
    await this.deviceRepository.remove(record);
  }

  /**
   * Centralized database error handler.
   */
  private hadleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAllProducts(){
    const query = this.deviceRepository.createQueryBuilder('device');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.hadleDbExceptions(error);
    }

  }
}