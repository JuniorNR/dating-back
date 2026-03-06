import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles-auth.decorator';
import { AuthenticatedRequest } from '../types/jwt.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (user.roles.some((role) => requiredRoles.includes(role.type))) {
      return true;
    }

    throw new ForbiddenException({
      statusCode: 403,
      error: this.i18n.t('error.accessDenied'),
      message: this.i18n.t('error.accessDeniedRequiredRoles', {
        args: {
          requiredRoles: requiredRoles.join(', '),
          userRoles: user.roles.map((role) => role.type).join(', '),
        },
      }),
    });
  }
}
