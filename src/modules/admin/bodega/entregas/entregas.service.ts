import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  ApiResponseFactory,
  ComboMapper,
  IdUtil,
  MoneyUtil,
} from '@common/index';
import { DataSource } from 'typeorm';
import { CreateEntregaDTO } from './dto/create_entrega.dto';
import { CreateEntregaDetalleDTO } from './dto/create_entrega_detalle.dto';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { UpdateEntregaDTO } from './dto/update_entrega.dto';
import { UpdateEntregaDetalleDTO } from './dto/update_entrega_detalle.dto';
import { EntregasMapper } from './entregas.mapper';
import { EntregasRepository } from './entregas.repository';

interface TotalesEntregaCalculados {
  cantidadTotalEntr: number;
  totalEntr: number;
}

@Injectable()
export class EntregasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly entregasRepository: EntregasRepository,
  ) {}

  async listar() {
    const entregas = await this.dataSource.transaction((manager) =>
      this.entregasRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      EntregasMapper.toRows(entregas),
      'Listado de entregas obtenido',
    );
  }

  async buscar(id: number) {
    const ideEntr = IdUtil.requireId(id, 'El ID de la entrega no es válido.');

    const entrega = await this.dataSource.transaction((manager) =>
      this.entregasRepository.buscarPorId(ideEntr, manager),
    );

    return ApiResponseFactory.legacyRead(
      entrega ? [EntregasMapper.toRow(entrega)] : [],
      'Entrega encontrada',
    );
  }

  async filtrar(queryParams: FilterEntregaDTO) {
    const entregas = await this.dataSource.transaction((manager) =>
      this.entregasRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      EntregasMapper.toRows(entregas),
      'Filtrado de entregas completado',
    );
  }

  async insertar(body: CreateEntregaDTO) {
    const detalles = body.detalleEntrega ?? [];
    this.validarDetalleEntrega(detalles, false);

    try {
      const entrega = await this.dataSource.transaction(async (manager) => {
        const totales = this.calcularTotalesDesdeDetalle(
          detalles,
          body.cabeceraEntrega,
        );

        const entregaCreada = await this.entregasRepository.crearEntrega(
          body.cabeceraEntrega,
          totales,
          manager,
        );

        await this.entregasRepository.reemplazarDetalles(
          entregaCreada.ideEntr,
          detalles,
          manager,
        );

        return entregaCreada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega registrada correctamente',
        entrega.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la entrega.',
      );
    }
  }

  async actualizar(body: UpdateEntregaDTO) {
    const detalles = body.detalleEntrega ?? [];
    this.validarDetalleEntrega(detalles, false);

    const ideEntr = IdUtil.requireId(
      body.cabeceraEntrega.ideEntr,
      'El ID de la entrega no es válido.',
    );

    try {
      const entrega = await this.dataSource.transaction(async (manager) => {
        const entregaActual =
          await this.entregasRepository.buscarPorIdForUpdate(ideEntr, manager);

        if (!entregaActual) {
          throw new NotFoundException('No se encontró la entrega indicada.');
        }

        const totales = this.calcularTotalesDesdeDetalle(
          detalles,
          body.cabeceraEntrega,
        );

        const entregaActualizada =
          await this.entregasRepository.actualizarEntrega(
            entregaActual,
            body.cabeceraEntrega,
            totales,
            manager,
          );

        await this.entregasRepository.reemplazarDetalles(
          entregaActualizada.ideEntr,
          detalles,
          manager,
        );

        return entregaActualizada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega actualizada correctamente',
        entrega.ideEntr,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la entrega.',
      );
    }
  }

  async eliminar(id: number) {
    const ideEntr = IdUtil.requireId(id, 'El ID de la entrega no es válido.');

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.entregasRepository.eliminarEntregaConDetalles(ideEntr, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la entrega indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(
        1,
        'Entrega eliminada correctamente',
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar la entrega.',
      );
    }
  }

  /**
   * JOINS
   */
  async listarEntregas() {
    return this.listar();
  }

  async filtrarEntregas(queryParams: FilterEntregaDTO) {
    return this.filtrar(queryParams);
  }

  async listarDetallesEntrega(idEntrega: number) {
    const ideEntr = IdUtil.requireId(
      idEntrega,
      'El ID de la entrega no es válido.',
    );

    const detalles = await this.dataSource.transaction((manager) =>
      this.entregasRepository.listarDetallesPorEntrega(ideEntr, manager),
    );

    return ApiResponseFactory.legacyRead(
      EntregasMapper.toDetalleRows(detalles),
      'Filtrado de detalles de entrega completado',
    );
  }

  /**
   * COMBOS
   */
  async listarComboEstados() {
    return ComboMapper.fromValues(['completo', 'incompleto']);
  }

  private validarDetalleEntrega(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    obligatorio: boolean,
  ): void {
    if (!Array.isArray(detalles)) {
      throw new BadRequestException('El detalle de entrega no es válido.');
    }

    if (obligatorio && detalles.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto a la entrega.',
      );
    }

    for (const detalle of detalles) {
      const ideProd = IdUtil.parseId(detalle.ideProd);

      if (ideProd === null) {
        throw new BadRequestException(
          'Todos los detalles deben tener un producto válido.',
        );
      }

      if (
        detalle.cantidadProd === null ||
        detalle.cantidadProd === undefined ||
        Number.isNaN(Number(detalle.cantidadProd)) ||
        Number(detalle.cantidadProd) <= 0
      ) {
        throw new BadRequestException(
          'Todos los detalles deben tener una cantidad válida.',
        );
      }
    }
  }

  private calcularTotalesDesdeDetalle(
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    cabecera: {
      cantidadTotalEntr: number;
      totalEntr: number;
    },
  ): TotalesEntregaCalculados {
    if (!detalles.length) {
      return {
        cantidadTotalEntr: cabecera.cantidadTotalEntr,
        totalEntr: cabecera.totalEntr,
      };
    }

    return detalles.reduce<TotalesEntregaCalculados>(
      (totales, detalle) => ({
        cantidadTotalEntr: totales.cantidadTotalEntr + detalle.cantidadProd,
        totalEntr: MoneyUtil.add(totales.totalEntr, detalle.totalProd),
      }),
      {
        cantidadTotalEntr: 0,
        totalEntr: 0,
      },
    );
  }
}
