import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const { apiPath, method } = createPermissionDto;

    const permission = await this.permissionModel.find({ apiPath, method });

    if (permission.length) {
      throw new BadRequestException('permission already exists');
    }

    return await this.permissionModel.create(createPermissionDto);
  }

  async findAll() {
    return await this.permissionModel.find();
  }

  async findOne(id: string) {
    return await this.permissionModel.findById(id);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionModel.updateOne(
      { _id: id },
      updatePermissionDto,
    );
  }

  async remove(id: string) {
    return await this.permissionModel.delete({ _id: id });
  }
}
