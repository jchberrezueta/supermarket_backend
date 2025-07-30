import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'gerente';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
