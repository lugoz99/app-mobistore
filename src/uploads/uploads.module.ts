import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Asegúrate de importar esto si usas ConfigService
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { cloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule], // Permite usar el ConfigService dentro de este módulo
  controllers: [UploadsController],
  providers: [UploadsService, cloudinaryProvider],
  exports: [UploadsService], 
})
export class UploadsModule {}
