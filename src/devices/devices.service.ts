import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    try {
      return await this.deviceRepository.find({});
    } catch (error) {
      this.hadleDbExceptions(error);
    }
  }

  async findOne(id:string) {
      const record = await this.deviceRepository.findOneBy({ id });
      if (!record) throw new NotFoundException('Device not found!')
      return record;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

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
