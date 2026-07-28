import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { CuentaEntity, OpcionesEntity, PerfilOpcionesEntity } from '@entities';
import { DataSource } from 'typeorm';
import { PERMISSION_KEY, RequiredPermission } from './permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permisoRequerido =
      this.reflector.getAllAndOverride<RequiredPermission>(PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    /*
     * Los endpoints que no declaran permisos
     * continúan funcionando normalmente.
     */
    if (!permisoRequerido) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const ideCuen = Number(request.user?.sub);

    if (!Number.isInteger(ideCuen) || ideCuen <= 0) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    const ruta = permisoRequerido.ruta.trim();

    const accion = permisoRequerido.accion;

    const resultado = await this.dataSource
      .getRepository(PerfilOpcionesEntity)
      .createQueryBuilder('permiso')
      .innerJoin(CuentaEntity, 'cuenta', 'cuenta.idePerf = permiso.idePerf')
      .innerJoin(OpcionesEntity, 'opcion', 'opcion.ideOpci = permiso.ideOpci')
      .select(`permiso.${accion}`, 'permitido')
      .where('cuenta.ideCuen = :ideCuen', {
        ideCuen,
      })
      .andWhere('cuenta.estadoCuen = :estadoCuenta', {
        estadoCuenta: 'activo',
      })
      .andWhere('cuenta.debeCambiarClave = false')
      .andWhere(
        `
            (
              cuenta.fechaBloqueoCuen IS NULL
              OR cuenta.fechaBloqueoCuen <= CURRENT_TIMESTAMP
            )
          `,
      )
      .andWhere('opcion.rutaOpci = :ruta', {
        ruta,
      })
      .andWhere('opcion.activoOpci = :estadoOpcion', {
        estadoOpcion: 'si',
      })
      .getRawOne<{
        permitido: 'si' | 'no' | null;
      }>();

    if (resultado?.permitido !== 'si') {
      throw new ForbiddenException(
        'No tiene permiso para realizar esta operación.',
      );
    }

    return true;
  }
}
