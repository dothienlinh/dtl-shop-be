import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Post()
  @Roles()
  @ApiOperation({
    summary: 'Create a new role',
  })
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.roleService.create(createRoleDto, user);
  }

  @Get()
  @Roles()
  @ApiOperation({
    summary: 'Get all roles',
  })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles()
  @ApiOperation({
    summary: 'Get role by id',
  })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Roles()
  @ApiOperation({
    summary: 'Update role by id',
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.roleService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @Roles()
  @ApiOperation({
    summary: 'Delete role by id',
  })
  remove(@Param('id') id: string, user: IUser) {
    return this.roleService.remove(id, user);
  }
}
