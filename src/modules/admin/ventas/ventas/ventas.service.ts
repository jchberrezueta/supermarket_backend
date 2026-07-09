import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, IdUtil, MoneyUtil } from '@common/index';
import { DataSource } from 'typeorm';
import { CreateVentaDTO } from './dto/create_venta.dto';
import { CreateVentaDetalleDTO } from './dto/create_venta_detalle.dto';
import { FilterVentaDTO } from './dto/filter_venta.dto';
import { UpdateVentaDTO } from './dto/update_venta.dto';
import { UpdateVentaDetalleDTO } from './dto/update_venta_detalle.dto';
import { VentasMapper } from './ventas.mapper';
import { VentasRepository } from './ventas.repository';

interface TotalesVentaCalculados {
  cantidadVent: number;
  subTotalVent: number;
  totalVent: number;
}

@Injectable()
export class VentasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly ventasRepository: VentasRepository,
  ) {}

  async listar() {
    const ventas = await this.dataSource.transaction((manager) =>
      this.ventasRepository.listar(manager),
    );

    return ApiResponseFactory.legacyRead(
      VentasMapper.toRows(ventas),
      'Listado de ventas obtenido',
    );
  }

  async buscar(id: number) {
    const ideVent = IdUtil.requireId(id, 'El ID de la venta no es válido.');

    const venta = await this.dataSource.transaction((manager) =>
      this.ventasRepository.buscarPorId(ideVent, manager),
    );

    return ApiResponseFactory.legacyRead(
      venta ? [VentasMapper.toRow(venta)] : [],
      'Venta encontrada',
    );
  }

  async filtrar(queryParams: FilterVentaDTO) {
    const ventas = await this.dataSource.transaction((manager) =>
      this.ventasRepository.filtrar(queryParams, manager),
    );

    return ApiResponseFactory.legacyRead(
      VentasMapper.toRows(ventas),
      'Filtrado de ventas completado',
    );
  }

  async insertar(body: CreateVentaDTO) {
    this.validarDetalleVenta(body.detalleVenta);

    try {
      const venta = await this.dataSource.transaction(async (manager) => {
        const totales = this.calcularTotalesDesdeDetalle(body.detalleVenta);

        const ventaCreada = await this.ventasRepository.crearVenta(
          body.cabeceraVenta,
          totales,
          manager,
        );

        await this.ventasRepository.reemplazarDetalles(
          ventaCreada.ideVent,
          body.detalleVenta,
          manager,
        );

        return ventaCreada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Venta registrada correctamente',
        venta.ideVent,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo registrar la venta.',
      );
    }
  }

  async actualizar(body: UpdateVentaDTO) {
    this.validarDetalleVenta(body.detalleVenta);

    const ideVent = IdUtil.requireId(
      body.cabeceraVenta.ideVent,
      'El ID de la venta no es válido.',
    );

    try {
      const venta = await this.dataSource.transaction(async (manager) => {
        const ventaActual = await this.ventasRepository.buscarPorIdForUpdate(
          ideVent,
          manager,
        );

        if (!ventaActual) {
          throw new NotFoundException('No se encontró la venta indicada.');
        }

        const totales = this.calcularTotalesDesdeDetalle(body.detalleVenta);

        const ventaActualizada = await this.ventasRepository.actualizarVenta(
          ventaActual,
          body.cabeceraVenta,
          totales,
          manager,
        );

        await this.ventasRepository.reemplazarDetalles(
          ventaActualizada.ideVent,
          body.detalleVenta,
          manager,
        );

        return ventaActualizada;
      });

      return ApiResponseFactory.legacyWrite(
        1,
        'Venta actualizada correctamente',
        venta.ideVent,
      );
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo actualizar la venta.',
      );
    }
  }

  async eliminar(id: number) {
    const ideVent = IdUtil.requireId(id, 'El ID de la venta no es válido.');

    try {
      const affected = await this.dataSource.transaction((manager) =>
        this.ventasRepository.eliminarVentaConDetalles(ideVent, manager),
      );

      if (affected === 0) {
        return ApiResponseFactory.legacyWrite(
          0,
          'No se encontró la venta indicada.',
        );
      }

      return ApiResponseFactory.legacyWrite(1, 'Venta eliminada correctamente');
    } catch (error) {
      return ApiResponseFactory.legacyWrite(
        0,
        error?.message || 'No se pudo eliminar la venta.',
      );
    }
  }

  async buscarDetallesVenta(ideVent: number) {
    const id = IdUtil.requireId(ideVent, 'El ID de la venta no es válido.');

    const detalles = await this.dataSource.transaction((manager) =>
      this.ventasRepository.listarDetallesPorVenta(id, manager),
    );

    return ApiResponseFactory.legacyRead(
      VentasMapper.toDetalleRows(detalles),
      'Filtrado de detalles de venta completado',
    );
  }

  private validarDetalleVenta(
    detalles: Array<CreateVentaDetalleDTO | UpdateVentaDetalleDTO>,
  ): void {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      throw new BadRequestException(
        'Debe agregar al menos un producto a la venta.',
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
    detalles: Array<CreateVentaDetalleDTO | UpdateVentaDetalleDTO>,
  ): TotalesVentaCalculados {
    return detalles.reduce<TotalesVentaCalculados>(
      (totales, detalle) => ({
        cantidadVent: totales.cantidadVent + detalle.cantidadProd,
        subTotalVent: MoneyUtil.add(totales.subTotalVent, detalle.subtotalProd),
        totalVent: MoneyUtil.add(totales.totalVent, detalle.totalProd),
      }),
      {
        cantidadVent: 0,
        subTotalVent: 0,
        totalVent: 0,
      },
    );
  }
}
