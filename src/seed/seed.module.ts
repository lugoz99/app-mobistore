import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { DevicesModule } from '../devices/devices.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[DevicesModule]
})
export class SeedModule {}
