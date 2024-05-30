import { BadRequestException, Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { mkdir } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => {
    return process.cwd();
  };

  ensureExists(targetDirectory: string) {
    mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created, or it already exists.');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          break;
        case 'ENOTDIR':
          break;
        default:
          console.error(error);
          break;
      }
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = 'uploads';
          this.ensureExists(`public/${folder}`);
          cb(null, join(this.getRootPath(), `public/${folder}`));
        },
        filename: (req, file, cb) => {
          const extName = extname(file.originalname);
          const finalName = `${uuidv4()}${extName}`;
          cb(null, finalName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    };
  }
}
