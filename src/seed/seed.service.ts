import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../devices/entities';
import { DevicesService } from '../devices/devices.service';
import { initialData } from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    
    @InjectRepository(Device)
    private readonly device:Device,
    private readonly deviceService:DevicesService
  ){}  
  async runSeed() {
    await this.insertNewProducst();
    return 'SEED EXECUTED'
  }
  

  private async insertNewProducst(){
    this.deviceService.deleteAllProducts();
    const devices = initialData.devices;
    const insertPromises = [];
    devices.forEach( device => {
      insertPromises.push(this.deviceService.create(device))
    });
    await Promise.all(insertPromises);
    return true;
  } 
}
