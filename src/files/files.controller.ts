import { diskStorage } from 'multer';
import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { fileNamer } from './helpers/fileNamer';
import { Response } from 'express'
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService:ConfigService
  ) {}

  @Get("device/imageName")
  findDeviceImage(
    @Res() resp: Response,// response
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName);
    resp.sendFile(path);
  }

  @Post('device')
  @UseInterceptors(FileInterceptor('file',{
    // limits,
    fileFilter: fileFilter,
    storage: diskStorage({
      destination:'./static/products',
      filename: fileNamer
    })
  }))
  uploadDeviceFile(@UploadedFile() file: Express.Multer.File) {
    // Poner archivos en en fileSystem conlleva a problemas de seguiridad
    // Es mejor un bucket

    if (!file) {
      throw new BadRequestException('Make sure that file is an image');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/device/${file.filename}`;
    return { secureUrl };
  }

  
}
