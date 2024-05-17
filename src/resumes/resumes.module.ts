import { Module } from '@nestjs/common';
import { ResumeService } from './resumes.service';
import { ResumeController } from './resumes.controller';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
