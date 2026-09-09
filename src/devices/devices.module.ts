import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { Device, DeviceImage } from './entities';
import { UploadsModule } from '../uploads/uploads.module';
import { DevicesController } from './devices.controller';
import { DeviceImagesService } from './device-images.service';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, DeviceImagesService],
  imports: [
    TypeOrmModule.forFeature([Device, DeviceImage]),
    UploadsModule,
    CommonModule,
    AuthModule,
    CategoriesModule,
  ],
  exports: [DevicesService, TypeOrmModule], // typeormodule para orm
})
export class DevicesModule {}
