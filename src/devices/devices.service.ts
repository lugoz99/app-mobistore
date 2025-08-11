import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid'
@Injectable()
export class DevicesService {


  private readonly logger = new Logger('deviceService');

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository:Repository<Device>
  ) {}



  async create(createDeviceDto: CreateDeviceDto) {

    try {
      /**
       * First we created the device and Second save the device in database
       */
      const device = this.deviceRepository.create(createDeviceDto);
      await this.deviceRepository.save(device);

    } catch (error) {
      this.hadleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    
    const { limit = 10,offset = 0} = paginationDto;
    return await this.deviceRepository.find({
      take: limit,
      skip: offset
    });
    
  }

  async findOne(term: string): Promise<Device> {
    let device: Device;
    if (isUUID(term)) {
      device = await this.deviceRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.deviceRepository.createQueryBuilder('device');
      device = await queryBuilder
        .where('UPPER(device.modelName) = :modelName OR LOWER(device.modelSlug) = :modelSlug', {
          modelName: term.toUpperCase(),
          modelSlug: term.toLowerCase(),
        })
        .getOne();
    }
    if (!device) {
      throw new NotFoundException(`Device with term '${term}' not found`);
    }
    return device;
  }



  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  /**
   * 
   * @param id 
   */
  async remove(id: string) {
      let record = await this.findOne(id);
      await this.deviceRepository.remove(record);
  }

  /**
   * 
   * @param error 
   */
  private hadleDbExceptions( error:any ) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
