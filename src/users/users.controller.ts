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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/types/user.interface';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create user')
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string = '0',
    @Query('pageSize') limit: string = '10',
    @Query() queryString: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, queryString);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Update user')
  update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete user')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user._id);
  }

  @Patch(':id')
  restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  @Get('/list/deleted')
  getAllDeleted() {
    return this.usersService.getAllDeleted();
  }
}
