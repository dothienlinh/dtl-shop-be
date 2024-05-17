import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/types/user.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser,
  ) {
    return await this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string = '0',
    @Query('pageSize') limit: string = '10',
    @Query() queryString: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, queryString);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }

  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.companiesService.restore(id);
  }
}
