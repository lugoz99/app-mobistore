import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { Device, DeviceImage } from './entities';
import { UploadsModule } from '../uploads/uploads.module';
import { DevicesController } from './devices.controller';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports: [
    TypeOrmModule.forFeature([Device,DeviceImage]),
    UploadsModule,
    CommonModule
  ],
  exports:[DevicesService,TypeOrmModule] // typeormodule para orm
})
export class DevicesModule {}
