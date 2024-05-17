import { Controller, Post, UseGuards, Get, Res, Req } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorators';
import { User } from 'src/decorators/user.decorator';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import { Request, Response } from 'express';
import { IUser } from 'src/interfaces/user.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dto/auth-login.dto';

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
  @ApiOperation({ summary: 'Get accout' })
  getAccount(@User() user: IUser) {
    return user;
  }
}
