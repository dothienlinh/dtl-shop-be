import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { Request } from 'express';
import { mkdir } from 'fs';
import { diskStorage } from 'multer';
import { basename, extname, join } from 'path';

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
          // Error:
          // Requested location already exists, but it's not a directory.
          break;
        case 'ENOTDIR':
          // Error:
          // The parent hierarchy contains a file with the same name as the dir
          // you're trying to create.
          break;
        default:
          // Some other error like permission denied.
          console.error(error);
          break;
      }
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, destination: string) => void,
        ) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.ensureExists(`public/images/${folder}`);
          callback(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, destination: string) => void,
        ) => {
          //get image extension
          const extName = extname(file.originalname);
          //get image's name (without extension)
          const baseName = basename(file.originalname, extName);
          const finalName = `${baseName}-${Date.now()}${extName}`;
          callback(null, finalName);
        },
      }),
    };
  }
}
