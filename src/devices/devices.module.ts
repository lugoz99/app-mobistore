import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports: [
    TypeOrmModule.forFeature([Device])
  ]
})
export class DevicesModule {}
