import { createParamDecorator, type ExecutionContext, SetMetadata } from '@nestjs/common';

export interface AuthUser {
  id: string;
  firebaseUid: string;
  role: 'PLAYER' | 'EDITOR' | 'ADMIN';
  isAnonymous: boolean;
  displayName: string;
  email: string | null;
}

export const IS_PUBLIC = 'isPublic';
export const ROLES = 'roles';
/** Kimlik doğrulama istemeyen uç. */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC, true);
/** Yalnızca verilen rollerin erişebildiği uç. */
export const Roles = (...roles: AuthUser['role'][]): MethodDecorator & ClassDecorator => SetMetadata(ROLES, roles);
/** İsteğin doğrulanmış kullanıcısı. */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest<{ user: AuthUser }>().user,
);
