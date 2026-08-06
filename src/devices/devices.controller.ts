import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, FileTypeValidator, ParseFilePipe, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  // CREATE - same as your original endpoint, no changes here
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createDeviceDto: CreateDeviceDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\/(png|jpeg|jpg|gif)$/ })],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.devicesService.create(createDeviceDto, files || []);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.devicesService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term', ParseUUIDPipe) term: string) {
    return this.devicesService.findOnePlain(term);
  }

  // UPDATE - now it can also receive new files to replace old images
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /^image\/(png|jpeg|jpg|gif)$/ })],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.devicesService.update(id, updateDeviceDto, files || []);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.remove(id);
  }
}