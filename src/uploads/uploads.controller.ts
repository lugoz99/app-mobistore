import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageDevice(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Acepta image/png, image/jpeg, image/jpg, image/gif
          new FileTypeValidator({ fileType: /^image\/(png|jpeg|jpg|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // el pipe verifica tambien que se proporcione el file
    const result = await this.uploadsService.uploadImageToCloudinary(file);

    // Retorno con estructura limpia, semántica y profesional
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  }
}
