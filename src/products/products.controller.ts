import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/responseMessage.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ERole } from 'src/common/enums/role';
import { IUser } from 'src/common/interfaces/user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(ERole.Seller)
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
  @Roles(ERole.Seller)
  @ApiOperation({
    summary: 'Update product by id',
  })
  @ResponseMessage('Updated product successfully')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @User() user: IUser) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Roles(ERole.Seller)
  @ApiOperation({
    summary: 'Delete peoduct by id',
  })
  @ResponseMessage('Deleted product successfully')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
