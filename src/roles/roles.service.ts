import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/interfaces/user.interface';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private rolesModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return (
      await this.rolesModel.create({
        ...createRoleDto,
        createdBy: userMetadata,
        updatedBy: userMetadata,
      })
    ).populate('permissions', ['name', 'apiPath', 'module', 'method']);
  }

  async findAll() {
    return await this.rolesModel.find().populate('permissions', ['name', 'apiPath', 'module', 'method']);
  }

  async findOne(id: string) {
    return await this.rolesModel.findById(id).populate('permissions', ['name', 'apiPath', 'module', 'method']);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const userMetadata = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    return await this.rolesModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto,
        updatedBy: userMetadata,
      },
    );
  }

  async remove(id: string, user: IUser) {
    return await this.rolesModel.delete({ _id: id }, user.id);
  }

  checkPermissions = async (roleId: mongoose.Schema.Types.ObjectId) => {
    const role = await this.rolesModel
      .findOne({ _id: roleId })
      .populate('permissions', ['name', 'apiPath', 'module', 'method']);

    if (role.permissions.length > 0) {
      return role.permissions;
    }

    return null;
  };

  findByName = async (nameRole: string) => {
    return await this.rolesModel.findOne({ name: nameRole });
  };
}
