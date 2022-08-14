import { SetMetadata } from '@nestjs/common';

export const Roles = (roleName = 'roles', roles: string[]) =>
  SetMetadata(roleName, roles);
