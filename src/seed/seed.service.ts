import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../devices/entities';
import { DevicesService } from '../devices/devices.service';
import { initialData } from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    // This is the repository, it lets us query and delete devices directly
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly deviceService: DevicesService,
  ) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    // First, delete all existing devices before inserting new ones
    await this.deleteAllProducts();

    const devices = initialData.devices;
    const insertPromises = [];

    devices.forEach(device => {
      // create() needs two things: the device data, and an array of files
      // Here we don't have real files, only text URLs, so we pass an empty array
      insertPromises.push(this.deviceService.create(device, []));
    });

    await Promise.all(insertPromises);
    return true;
  }

  // This method deletes all devices from the database
  // Images are deleted too because of the cascade relation
  private async deleteAllProducts() {
    const query = this.deviceRepository.createQueryBuilder('device');
    await query.delete().where({}).execute();
  }
}