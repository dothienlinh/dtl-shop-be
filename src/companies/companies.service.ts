import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/types/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, sort, projection, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const totalItem = (await this.companyModel.find(filter)).length;
    const totalPage = Math.ceil(totalItem / limit);

    const data = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .select(projection)
      .populate(population)
      .exec();

    return {
      data,
      totalItem,
      totalPage,
      currentPage,
      limit,
    };
  }

  findOne(id: string) {
    return this.companyModel.findById(id);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    return await this.companyModel.delete({ _id: id }, user._id);
  }

  async restore(id: string) {
    return await this.companyModel.restore({ _id: id });
  }
}
