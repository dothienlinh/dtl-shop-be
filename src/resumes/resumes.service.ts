import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createResumeDto: CreateResumeDto) {
    return await this.resumeModel.create(createResumeDto);
  }

  async findAll() {
    return await this.resumeModel.find().populate([
      { path: 'userId', select: ['name', 'email', 'role'] },
      { path: 'companyId', select: 'name' },
      { path: 'jobId', select: 'name' },
    ]);
  }

  findOne(id: string) {
    return this.resumeModel.findById(id);
  }

  update(id: string, updateResumeDto: UpdateResumeDto) {
    return this.resumeModel.updateOne({ _id: id }, updateResumeDto);
  }

  remove(id: string) {
    return this.resumeModel.delete({ _id: id });
  }
}
