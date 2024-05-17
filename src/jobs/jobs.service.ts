import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SoftDeleteModel } from 'mongoose-delete';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/types/user.interface';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  async create(createJobDto: CreateJobDto) {
    const { startDate, endDate } = createJobDto;

    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        throw new BadRequestException(
          'Start date cannot be greater than end date',
        );
      }
    }

    return (await this.jobModel.create(createJobDto)).populate('companyId', [
      'name',
      'description',
      'logo',
      'address',
    ]);
  }

  async findAll() {
    return await this.jobModel
      .find()
      .populate('companyId', ['name', 'description', 'logo', 'address']);
  }

  async findOne(id: string) {
    return await this.jobModel.findById(id);
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    return await this.jobModel.updateOne({ _id: id }, updateJobDto);
  }

  async remove(id: string, user: IUser) {
    return await this.jobModel.delete({ _id: id }, user._id);
  }
}
