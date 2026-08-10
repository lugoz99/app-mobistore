import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // reflector - info de la metadata | guards
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    if (validRoles.length === 0) return true; // cualquiera entra | vacio, no configurado
    const user = request.user as User;
    if (!user) {
      throw new BadRequestException('Uset not found!');
    }
    for (const rol of user.roles) {
      if (validRoles.includes(rol)) {
        return true; // con uno
      }
      throw new ForbiddenException(
        `User ${user.fullName} needs a valid rols [${validRoles}]`,
      );
    }

    return true;
  }
}
