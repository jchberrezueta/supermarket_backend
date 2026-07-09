import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IdUtil } from '@common/index';
import { MetodoPagoClienteEntity } from '@entities';
import { DataSource, EntityManager } from 'typeorm';
import { CreateMetodoPagoDto, UpdateMetodoPagoDto } from './dto';

/**
 * Servicio para gestionar los métodos de pago de los clientes.
 *
 * Antes dependía de funciones PostgreSQL:
 * - fn_insertar_metodo_pago_cliente
 * - fn_actualizar_metodo_pago_cliente
 * - fn_eliminar_metodo_pago_cliente
 *
 * Ahora usa TypeORM y transacciones.
 */
@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async crearMetodoPago(body: CreateMetodoPagoDto) {
    const ideClie = IdUtil.requireId(
      body.ideClie,
      'El ID del cliente no es válido.',
    );

    try {
      const metodoPago = await this.dataSource.transaction(async (manager) => {
        if (body.esPredeterminado === 'si') {
          await this.quitarPredeterminadosCliente(ideClie, manager);
        }

        const repository = manager.getRepository(MetodoPagoClienteEntity);

        const metodo = repository.create({
          ideClie,
          tipoPago: body.tipoPago as MetodoPagoClienteEntity['tipoPago'],
          nombreTitular: body.nombreTitular,
          numeroTarjetaMasked: body.numeroTarjetaMasked ?? null,
          marcaTarjeta:
            (body.marcaTarjeta as MetodoPagoClienteEntity['marcaTarjeta']) ??
            null,
          fechaExpiracion: body.fechaExpiracion ?? null,
          emailPaypal: body.emailPaypal ?? null,
          esPredeterminado: this.normalizarSiNo(body.esPredeterminado),
          alias: body.alias ?? null,
          estado: 'activo',
          usuaIngre: body.usuaIngre || 'mobile',
        });

        return repository.save(metodo);
      });

      return {
        success: true,
        message: 'Método de pago registrado correctamente',
        ideMetoPago: metodoPago.ideMetoPago,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'No se pudo crear el método de pago.',
      );
    }
  }

  async listarMetodosPago(idCliente: number) {
    const ideClie = IdUtil.parseId(idCliente);

    if (ideClie === null) {
      return [];
    }

    const metodos = await this.dataSource.transaction((manager) =>
      manager.getRepository(MetodoPagoClienteEntity).find({
        where: {
          ideClie,
          estado: 'activo',
        },
        order: {
          esPredeterminado: 'DESC',
          fechaIngre: 'DESC',
        },
      }),
    );

    return metodos.map((metodo) => this.mapearMetodoPagoACamelCase(metodo));
  }

  async obtenerMetodoPago(ideMetoPago: number, idCliente: number) {
    const idMetodoPago = IdUtil.requireId(
      ideMetoPago,
      'El ID del método de pago no es válido.',
    );
    const ideClie = IdUtil.requireId(
      idCliente,
      'El ID del cliente no es válido.',
    );

    const metodo = await this.dataSource.transaction((manager) =>
      manager.getRepository(MetodoPagoClienteEntity).findOne({
        where: {
          ideMetoPago: idMetodoPago,
          ideClie,
          estado: 'activo',
        },
      }),
    );

    if (!metodo) {
      throw new NotFoundException('Método de pago no encontrado');
    }

    return this.mapearMetodoPagoACamelCase(metodo);
  }

  async actualizarMetodoPago(body: UpdateMetodoPagoDto, idCliente: number) {
    const ideMetoPago = IdUtil.requireId(
      body.ideMetoPago,
      'El ID del método de pago no es válido.',
    );
    const ideClie = IdUtil.requireId(
      idCliente,
      'El ID del cliente no es válido.',
    );

    try {
      await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(MetodoPagoClienteEntity);

        const metodo = await repository.findOne({
          where: {
            ideMetoPago,
            ideClie,
            estado: 'activo',
          },
        });

        if (!metodo) {
          throw new NotFoundException('Método de pago no encontrado');
        }

        if (body.esPredeterminado === 'si') {
          await this.quitarPredeterminadosCliente(ideClie, manager);
        }

        if (body.nombreTitular !== undefined && body.nombreTitular !== null) {
          metodo.nombreTitular = body.nombreTitular;
        }

        if (
          body.fechaExpiracion !== undefined &&
          body.fechaExpiracion !== null
        ) {
          metodo.fechaExpiracion = body.fechaExpiracion;
        }

        if (
          body.esPredeterminado !== undefined &&
          body.esPredeterminado !== null
        ) {
          metodo.esPredeterminado = this.normalizarSiNo(body.esPredeterminado);
        }

        if (body.alias !== undefined) {
          metodo.alias = body.alias ?? null;
        }

        metodo.usuaActua = body.usuaActua || 'mobile';
        metodo.fechaActua = new Date();

        await repository.save(metodo);
      });

      return {
        success: true,
        message: 'Método de pago actualizado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        error?.message || 'No se pudo actualizar el método de pago.',
      );
    }
  }

  async eliminarMetodoPago(
    ideMetoPago: number,
    idCliente: number,
    usuaActua = 'mobile',
  ) {
    const idMetodoPago = IdUtil.requireId(
      ideMetoPago,
      'El ID del método de pago no es válido.',
    );
    const ideClie = IdUtil.requireId(
      idCliente,
      'El ID del cliente no es válido.',
    );

    try {
      await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(MetodoPagoClienteEntity);

        const metodo = await repository.findOne({
          where: {
            ideMetoPago: idMetodoPago,
            ideClie,
            estado: 'activo',
          },
        });

        if (!metodo) {
          throw new NotFoundException('Método de pago no encontrado');
        }

        metodo.estado = 'inactivo';
        metodo.esPredeterminado = 'no';
        metodo.usuaActua = usuaActua;
        metodo.fechaActua = new Date();

        await repository.save(metodo);
      });

      return {
        success: true,
        message: 'Método de pago eliminado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        error?.message || 'No se pudo eliminar el método de pago.',
      );
    }
  }

  async establecerPredeterminado(ideMetoPago: number, idCliente: number) {
    const idMetodoPago = IdUtil.requireId(
      ideMetoPago,
      'El ID del método de pago no es válido.',
    );
    const ideClie = IdUtil.requireId(
      idCliente,
      'El ID del cliente no es válido.',
    );

    try {
      await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(MetodoPagoClienteEntity);

        const metodo = await repository.findOne({
          where: {
            ideMetoPago: idMetodoPago,
            ideClie,
            estado: 'activo',
          },
        });

        if (!metodo) {
          throw new NotFoundException('Método de pago no encontrado');
        }

        await this.quitarPredeterminadosCliente(ideClie, manager);

        metodo.esPredeterminado = 'si';
        metodo.fechaActua = new Date();
        metodo.usuaActua = 'mobile';

        await repository.save(metodo);
      });

      return {
        success: true,
        message: 'Método de pago establecido como predeterminado',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(
        error?.message ||
          'No se pudo establecer el método de pago como predeterminado.',
      );
    }
  }

  private async quitarPredeterminadosCliente(
    ideClie: number,
    manager: EntityManager,
  ): Promise<void> {
    await manager
      .getRepository(MetodoPagoClienteEntity)
      .createQueryBuilder()
      .update(MetodoPagoClienteEntity)
      .set({
        esPredeterminado: 'no',
        fechaActua: new Date(),
      })
      .where('ide_clie = :ideClie', { ideClie })
      .andWhere('estado = :estado', { estado: 'activo' })
      .execute();
  }

  private normalizarSiNo(value: unknown): 'si' | 'no' {
    return value === 'si' ? 'si' : 'no';
  }

  private mapearMetodoPagoACamelCase(metodo: MetodoPagoClienteEntity) {
    return {
      ideMetoPago: metodo.ideMetoPago,
      ideClie: metodo.ideClie,
      tipoPago: metodo.tipoPago,
      nombreTitular: metodo.nombreTitular,
      numeroTarjetaMasked: metodo.numeroTarjetaMasked,
      marcaTarjeta: metodo.marcaTarjeta,
      fechaExpiracion: metodo.fechaExpiracion,
      emailPaypal: metodo.emailPaypal,
      esPredeterminado: metodo.esPredeterminado,
      alias: metodo.alias,
      estado: metodo.estado,
      fechaIngre: metodo.fechaIngre,
    };
  }
}
