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
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
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
  create(@Body() createDeviceDto: CreateDeviceDto, @GetUser() user: User) {
    return this.devicesService.create(createDeviceDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.devicesService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term', ParseUUIDPipe) term: string) {
    return this.devicesService.findOnePlain(term);
  }

  @Patch(':id')
  // @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @GetUser() user: User,
  ) {
    return this.devicesService.updateWithTransaction(id, updateDeviceDto, user);
  }

  @Delete(':id')
  // @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.remove(id);
  }
}
