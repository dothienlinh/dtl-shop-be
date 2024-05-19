import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { IPayload } from 'src/interfaces/payload.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByEmail(username);

    if (user) {
      const { password } = user;
      const isValidPassword = await this.usersService.isValidPassword(
        pass,
        password,
      );

      if (isValidPassword) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser, response: Response) {
    const payload: IPayload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      role: user.role._id,
    };

    const refreshToken = this.createRefreshToken(payload);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')),
    });

    const [role] = await Promise.all([
      this.rolesService.findOne(`${user.role._id}`),
      this.usersService.updateRefreshToken(refreshToken, user.id),
    ]);

    return {
      accessToken: this.jwtService.sign({
        ...payload,
        permissions: role.permissions,
      }),
    };
  }

  refreshToken = async (refreshToken: string) => {
    try {
      await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });

      const user = await this.usersService.findByRefreshToken(refreshToken);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const permissions = (await this.rolesService.findOne(`${user.role}`))
        .permissions;

      const payload: IPayload = {
        email: user.email,
        sub: user._id,
        name: user.name,
        role: user.role,
      };

      return { accessToken: this.jwtService.sign({ ...payload, permissions }) };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  };

  createRefreshToken = (payload: IPayload) => {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      privateKey: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });
  };
}
