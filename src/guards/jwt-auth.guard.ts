import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorators';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else if (info && info.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }
      throw err || new UnauthorizedException();
    }

    const req: Request = context.switchToHttp().getRequest();
    const targetMethod = req.method;
    const targetPath: string = req.route?.path;
    const permissions: Permission[] = user.permissions ?? [];

    const isExist = permissions.find(
      (permission) =>
        permission.method === targetMethod && permission.apiPath === targetPath,
    );

    if (!isExist) {
      throw new ForbiddenException('You do not have access.');
    }

    return user;
  }
}
