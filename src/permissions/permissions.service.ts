import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    return await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user.id,
        name: user.name,
        role: user.role,
      },
      updatedBy: {
        _id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  }

  async findAll() {
    return await this.permissionModel.find();
  }

  async findOne(id: string) {
    return await this.permissionModel.findById(id);
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user.id,
          name: user.name,
          role: user.role,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    return await this.permissionModel.delete({ _id: id }, user.id);
  }
}
