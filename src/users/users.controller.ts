import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchUsersDto } from './dto/search-user.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/interfaces/user.interface';
import { Roles } from 'src/decorators/roles.decorator';
import { ERole } from 'src/enums/role';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles()
  @ApiOperation({
    summary: 'Create a new user',
  })
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get users',
  })
  @ResponseMessage('Get users successfully')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: true, type: [String] })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('role') role: string[]) {
    if (!Array.isArray(role)) {
      role = [role];
    }

    return this.usersService.findAll(page, limit, role as ERole[]);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search users',
  })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'role', required: true, type: [String] })
  @ApiQuery({ name: '_id', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ResponseMessage('Search users successfully')
  search(@Query() query: SearchUsersDto, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    if (!Array.isArray(query.role)) {
      query = {
        ...query,
        role: [query.role],
      };
    }

    return this.usersService.findByField(query, page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles()
  @ApiOperation({
    summary: 'Update user by id',
  })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @Roles()
  @ApiOperation({
    summary: 'Delete user by id',
  })
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
