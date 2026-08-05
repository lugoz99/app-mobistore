import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { Device, DeviceImage } from './entities';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports: [
    TypeOrmModule.forFeature([Device,DeviceImage]),
    CommonModule
  ]
})
export class DevicesModule {}
