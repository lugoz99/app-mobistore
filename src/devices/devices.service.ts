import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';

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

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
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
