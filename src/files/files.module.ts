import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './services/files.service';
import { MulterConfigService } from './services/multer.service';
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
