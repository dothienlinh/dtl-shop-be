import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { FilesController } from './files.controller';
import { MulterConfigService } from './services/multer.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
