import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'bodega';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
