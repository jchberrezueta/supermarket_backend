import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'required_permission';

export type PermissionAction = 'listar' | 'insertar' | 'modificar' | 'eliminar';

export interface RequiredPermission {
  ruta: string;
  accion: PermissionAction;
}

export const RequirePermission = (ruta: string, accion: PermissionAction) =>
  SetMetadata(PERMISSION_KEY, {
    ruta,
    accion,
  } satisfies RequiredPermission);
