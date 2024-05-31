import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/interfaces/user.interface';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ERole } from 'src/enums/role';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(ERole.SELLER)
  @ApiOperation({
    summary: 'Create a product',
  })
  @ResponseMessage('Create product successfully')
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all product',
  })
  @ResponseMessage('Get list product successfully')
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by id',
  })
  @ResponseMessage('Get product successfully')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles(ERole.SELLER)
  @ApiOperation({
    summary: 'Update product by id',
  })
  @ResponseMessage('Updated product successfully')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @User() user: IUser) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Roles(ERole.SELLER)
  @ApiOperation({
    summary: 'Delete peoduct by id',
  })
  @ResponseMessage('Deleted product successfully')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
