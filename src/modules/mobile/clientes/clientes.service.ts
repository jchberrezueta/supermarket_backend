import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IdUtil } from '@common/index';
import { ClienteEntity, CuentaClienteEntity } from '@entities';
import { DataSource, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CambiarPasswordDto, UpdateClienteDto } from './dto';

/**
 * Servicio para perfil del cliente móvil.
 *
 * Antes dependía de:
 * - DatabaseService
 * - SQL directo
 * - fn_actualizar_cliente
 *
 * Ahora usa TypeORM y transacciones.
 */
@Injectable()
export class MobileClientesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Obtener perfil completo del cliente autenticado.
   */
  async obtenerPerfil(idCliente: number) {
    const ideClie = IdUtil.parseId(idCliente);

    if (ideClie === null) {
      return null;
    }

    const cliente = await this.dataSource.transaction((manager) =>
      this.buscarClienteConCuenta(ideClie, manager),
    );

    if (!cliente) {
      return null;
    }

    return this.mapearClienteACamelCase(cliente);
  }

  /**
   * Actualizar datos del cliente.
   */
  async actualizarPerfil(idCliente: number, data: UpdateClienteDto) {
    const ideClie = IdUtil.requireId(
      idCliente,
      'El ID del cliente no es válido.',
    );

    try {
      await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(ClienteEntity);

        const cliente = await repository.findOne({
          where: {
            ideClie,
          },
        });

        if (!cliente) {
          throw new BadRequestException('Cliente no encontrado.');
        }

        if (this.tieneValor(data.cedulaClie)) {
          cliente.cedulaClie = data.cedulaClie;
        }

        if (this.tieneValor(data.fechaNacimientoClie)) {
          const fechaNacimiento = new Date(data.fechaNacimientoClie);

          cliente.fechaNacimientoClie = fechaNacimiento;
          cliente.edadClie = this.calcularEdad(fechaNacimiento);
        }

        if (this.tieneValor(data.telefonoClie)) {
          cliente.telefonoClie = data.telefonoClie;
        }

        if (this.tieneValor(data.primerNombreClie)) {
          cliente.primerNombreClie = data.primerNombreClie;
        }

        if (this.tieneValor(data.segundoNombreClie)) {
          cliente.segundoNombreClie = data.segundoNombreClie;
        }

        if (this.tieneValor(data.apellidoPaternoClie)) {
          cliente.apellidoPaternoClie = data.apellidoPaternoClie;
        }

        if (this.tieneValor(data.apellidoMaternoClie)) {
          cliente.apellidoMaternoClie = data.apellidoMaternoClie;
        }

        if (this.tieneValor(data.emailClie)) {
          cliente.emailClie = data.emailClie;
        }

        if (this.tieneValor(data.esSocio)) {
          cliente.esSocio = data.esSocio;
        }

        if (this.tieneValor(data.esTerceraEdad)) {
          cliente.esTerceraEdad = data.esTerceraEdad;
        }

        cliente.usuaActua = 'mobile';
        cliente.fechaActua = new Date();

        await repository.save(cliente);
      });

      return this.obtenerPerfil(ideClie);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        error?.message || 'Error al actualizar el perfil.',
      );
    }
  }

  /**
   * Cambiar contraseña del cliente.
   */
  async cambiarPassword(idCliente: number, data: CambiarPasswordDto) {
    const ideClie = IdUtil.requireId(
      idCliente,
      'El ID del cliente no es válido.',
    );

    return this.dataSource.transaction(async (manager) => {
      const cuenta = await manager.getRepository(CuentaClienteEntity).findOne({
        where: {
          ideClie,
        },
        order: {
          ideCuenClie: 'DESC',
        },
      });

      if (!cuenta) {
        throw new BadRequestException('Cuenta de cliente no encontrada.');
      }

      const passwordValida = await bcrypt.compare(
        data.passwordActual,
        cuenta.passwordClie,
      );

      if (!passwordValida) {
        throw new UnauthorizedException('La contraseña actual es incorrecta.');
      }

      cuenta.passwordClie = await bcrypt.hash(data.passwordNuevo, 10);
      cuenta.fechaActua = new Date();

      await manager.getRepository(CuentaClienteEntity).save(cuenta);

      return {
        success: true,
        message: 'Contraseña actualizada correctamente.',
      };
    });
  }

  private async buscarClienteConCuenta(
    ideClie: number,
    manager: EntityManager,
  ): Promise<ClienteEntity | null> {
    return manager
      .getRepository(ClienteEntity)
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.cuentasCliente', 'cuentaCliente')
      .where('cliente.ideClie = :ideClie', { ideClie })
      .orderBy('cuentaCliente.ideCuenClie', 'DESC')
      .getOne();
  }

  /**
   * Mapear campos internos a camelCase para la app móvil.
   */
  private mapearClienteACamelCase(cliente: ClienteEntity) {
    const cuentaCliente = cliente.cuentasCliente?.[0];

    return {
      ideClie: cliente.ideClie,
      cedulaClie: cliente.cedulaClie,
      fechaNacimientoClie: cliente.fechaNacimientoClie,
      edadClie: cliente.edadClie,
      telefonoClie: cliente.telefonoClie,
      primerNombreClie: cliente.primerNombreClie,
      segundoNombreClie: cliente.segundoNombreClie,
      apellidoPaternoClie: cliente.apellidoPaternoClie,
      apellidoMaternoClie: cliente.apellidoMaternoClie,
      emailClie: cliente.emailClie,
      esSocio: cliente.esSocio,
      esTerceraEdad: cliente.esTerceraEdad,
      ideCuenClie: cuentaCliente?.ideCuenClie ?? null,
      usuarioClie: cuentaCliente?.usuarioClie ?? null,
      emailCuenta: cuentaCliente?.emailClie ?? null,
      estadoClie: cuentaCliente?.estadoClie ?? null,
    };
  }

  private calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  private tieneValor<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }
}
