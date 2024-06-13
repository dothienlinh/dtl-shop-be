import { Controller, Post, UseGuards, Get, Res, Req, Body } from '@nestjs/common';
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
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';

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
  async handleLogin(@User() user, @Res({ passthrough: true }) response: Response) {
    return await this.authService.login(user, response);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Log out' })
  async handleLogout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['refreshToken'];

    return await this.authService.logout(refreshToken, response);
  }

  @Public()
  @Get('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  async handleRefreshToken(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;

    return this.authService.refreshToken(refreshToken);
  }

  @Get('/account')
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

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ChangePasswordDto })
  @ResponseMessage('Successfully registered')
  async resetPassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
