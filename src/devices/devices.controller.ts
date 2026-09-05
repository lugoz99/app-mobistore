import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Device } from './entities';

@ApiTags('devices')
@Controller('devices')
// @Auth()
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  // CREATE - same as your original endpoint, no changes here
  @Post()
  // @Auth(ValidRoles.admin)
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: Device,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden.Token Related' })
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createDeviceDto: CreateDeviceDto,
    @GetUser() user: User,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpeg|jpg|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.devicesService.create(createDeviceDto, files || [], user);
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
  // @Auth(ValidRoles.admin)
  @UseInterceptors(FilesInterceptor('images', 5))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @GetUser() user: User,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpeg|jpg|gif)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.devicesService.updateWithTransaction(
      id,
      updateDeviceDto,
      files || [],
      user,
    );
  }

  @Delete(':id')
  // @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.remove(id);
  }
}
