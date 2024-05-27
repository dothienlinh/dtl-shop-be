import {
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  Req,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorators';
import { User } from 'src/decorators/user.decorator';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Request, Response } from 'express';
import { IUser } from 'src/interfaces/user.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ERole } from 'src/enums/role';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ResponseMessage('Login successful')
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ summary: 'Log in' })
  async handleLogin(
    @User() user,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }
  @Public()
  @Get('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  async handleRefreshToken(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;

    return this.authService.refreshToken(refreshToken);
  }

  @Get('/account')
  @Roles(ERole.SELLER, ERole.USER)
  @ApiOperation({ summary: 'Get accout' })
  getAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: AuthRegisterDto })
  @ResponseMessage('Successfully registered')
  async register(@Body() authRegisterDto: AuthRegisterDto) {
    return this.authService.register(authRegisterDto);
  }
}
