import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Check if user has admin role
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    // Check if user account is active
    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    return true;
  }
}


// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { UserRole } from '../../users/schemas/user.schema';

// @Injectable()
// export class AdminGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user || user.role !== UserRole.ADMIN) {
//       throw new ForbiddenException('Admin access required');
//     }

//     return true;
//   }
// }
