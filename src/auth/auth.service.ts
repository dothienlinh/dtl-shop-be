import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { IUser } from 'src/types/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);

      if (isValid) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, email, name, role } = user;

    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      email,
      name,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')),
    });

    await this.usersService.updateUserToken(refresh_token, _id);
    return {
      access_token: this.jwtService.sign(payload),
      user: { _id, name, email },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const newUser = await this.usersService.register(registerUserDto);

    return {
      _id: newUser?._id,
      createdAt: newUser.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });

    return refreshToken;
  };

  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      await this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findUserByToken(refresh_token);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const currentUser: IUser = {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return await this.login(currentUser, response);
    } catch (error) {
      throw new BadRequestException('Refresh token could not be decoded');
    }
  };

  logout = async (user: IUser, response: Response) => {
    const { _id } = user;
    response.clearCookie('refresh_token');
    await this.usersService.updateUserToken(null, _id);
  };
}
