import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { DevicesModule } from '../devices/devices.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[DevicesModule,AuthModule]
})
export class SeedModule {}
