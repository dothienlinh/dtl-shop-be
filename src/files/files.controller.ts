import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { FileUploadDto } from './dto/file-upload.dto';
import { FilesService } from './services/files.service';

@ApiTags('Uploaded File')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a file',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @ResponseMessage('Uploaded file successfully')
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return {
      fileName: file.filename,
    };
  }
}
