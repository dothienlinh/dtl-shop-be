import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    const role = await this.roleModel.find({ name });

    if (role) {
      throw new BadRequestException('Role already exists');
    }

    return (await this.roleModel.create(createRoleDto)).populate(
      'permissions',
      'name',
    );
  }

  async findAll() {
    return await this.roleModel.find();
  }

  async findOne(id: string) {
    return await this.roleModel.findById(id);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return await this.roleModel.updateOne({ _id: id }, updateRoleDto);
  }

  async remove(id: string) {
    return await this.roleModel.delete({ _id: id });
  }
}
