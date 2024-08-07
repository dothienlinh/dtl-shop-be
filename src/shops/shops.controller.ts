import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ERole } from 'src/common/enums/role';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopsService } from './shops.service';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @Roles(ERole.Seller)
  @ApiOperation({
    summary: 'Create a shop',
  })
  create(@Body() createShopDto: CreateShopDto, @User() user: IUser) {
    return this.shopsService.create(createShopDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list shop',
  })
  findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get shop by id',
  })
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Patch(':id')
  @Roles(ERole.Seller)
  @ApiOperation({
    summary: 'Update shop by id',
  })
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto, @User() user: IUser) {
    return this.shopsService.update(id, updateShopDto, user);
  }

  @Delete(':id')
  @Roles(ERole.Seller)
  @ApiOperation({
    summary: 'Delete shop by id',
  })
  remove(@Param('id') id: string) {
    return this.shopsService.remove(id);
  }
}
