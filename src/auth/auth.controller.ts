import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/decorators/isPublic';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Request, Response } from 'express';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/types/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Registration successful')
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage('Get user details successful')
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh')
  async handleRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = req.cookies['refresh_token'];
    return this.authService.processNewToken(refresh_token, response);
  }

  @ResponseMessage('Logout successful')
  @Post('/logout')
  async handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }
}
