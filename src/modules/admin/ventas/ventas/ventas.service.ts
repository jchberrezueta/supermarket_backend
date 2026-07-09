import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, IdUtil, MoneyUtil } from '@common/index';
import { DetalleVentaEntity, ProductoEntity } from '@entities';
import { DataSource, EntityManager } from 'typeorm';
import { CreateVentaDTO } from './dto/create_venta.dto';
import { CreateVentaDetalleDTO } from './dto/create_venta_detalle.dto';
import { FilterVentaDTO } from './dto/filter_venta.dto';
import { UpdateVentaDTO } from './dto/update_venta.dto';
import { UpdateVentaDetalleDTO } from './dto/update_venta_detalle.dto';
import { VentasMapper } from './ventas.mapper';
import { VentasRepository } from './ventas.repository';

type TipoPagoVenta =
  | 'efectivo'
  | 'tarjeta_credito'
  | 'tarjeta_debito'
  | 'paypal';

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
        await this.validarClienteEmpleadoYPago(
          body.cabeceraVenta.ideClie,
          body.cabeceraVenta.ideEmpl,
          body.cabeceraVenta.tipoPagoVent,
          body.cabeceraVenta.ideMetoPago ?? null,
          manager,
          (tipoPagoVent, ideMetoPago) => {
            body.cabeceraVenta.tipoPagoVent = tipoPagoVent;
            body.cabeceraVenta.ideMetoPago = ideMetoPago;
          },
        );

        const totales = this.calcularTotalesDesdeDetalle(body.detalleVenta);

        if (body.cabeceraVenta.estadoVent === 'completado') {
          await this.ajustarStockPorCambioDeDetalles(
            new Map<number, number>(),
            this.consolidarCantidadesPorProducto(body.detalleVenta),
            manager,
          );
        }

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

        await this.validarClienteEmpleadoYPago(
          body.cabeceraVenta.ideClie,
          body.cabeceraVenta.ideEmpl,
          body.cabeceraVenta.tipoPagoVent,
          body.cabeceraVenta.ideMetoPago ?? null,
          manager,
          (tipoPagoVent, ideMetoPago) => {
            body.cabeceraVenta.tipoPagoVent = tipoPagoVent;
            body.cabeceraVenta.ideMetoPago = ideMetoPago;
          },
        );

        const detallesActuales =
          await this.ventasRepository.listarDetallesPorVenta(ideVent, manager);

        const cantidadesAnteriores =
          ventaActual.estadoVent === 'completado'
            ? this.consolidarCantidadesPorProducto(detallesActuales)
            : new Map<number, number>();

        const cantidadesNuevas =
          body.cabeceraVenta.estadoVent === 'completado'
            ? this.consolidarCantidadesPorProducto(body.detalleVenta)
            : new Map<number, number>();

        await this.ajustarStockPorCambioDeDetalles(
          cantidadesAnteriores,
          cantidadesNuevas,
          manager,
        );

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
      const affected = await this.dataSource.transaction(async (manager) => {
        const ventaActual = await this.ventasRepository.buscarPorIdForUpdate(
          ideVent,
          manager,
        );

        if (!ventaActual) {
          return 0;
        }

        const detallesActuales =
          await this.ventasRepository.listarDetallesPorVenta(ideVent, manager);

        if (ventaActual.estadoVent === 'completado') {
          await this.ajustarStockPorCambioDeDetalles(
            this.consolidarCantidadesPorProducto(detallesActuales),
            new Map<number, number>(),
            manager,
          );
        }

        return this.ventasRepository.eliminarVentaConDetalles(ideVent, manager);
      });

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

  private async validarClienteEmpleadoYPago(
    ideClieRaw: number,
    ideEmplRaw: number | null | undefined,
    tipoPagoSolicitado: TipoPagoVenta | undefined,
    ideMetoPagoRaw: number | null | undefined,
    manager: EntityManager,
    aplicarPagoValidado: (
      tipoPagoVent: TipoPagoVenta,
      ideMetoPago: number | null,
    ) => void,
  ): Promise<void> {
    const ideClie = IdUtil.requireId(
      ideClieRaw,
      'El ID del cliente no es válido.',
    );

    const cliente = await this.ventasRepository.buscarClientePorId(
      ideClie,
      manager,
    );

    if (!cliente) {
      throw new BadRequestException('El cliente seleccionado no existe.');
    }

    if (ideEmplRaw !== null && ideEmplRaw !== undefined) {
      const ideEmpl = IdUtil.requireId(
        ideEmplRaw,
        'El ID del empleado no es válido.',
      );

      const empleado = await this.ventasRepository.buscarEmpleadoActivoPorId(
        ideEmpl,
        manager,
      );

      if (!empleado) {
        throw new BadRequestException(
          'El empleado seleccionado no existe o no está activo.',
        );
      }
    }

    const pagoValidado = await this.resolverMetodoPagoVenta(
      tipoPagoSolicitado,
      ideMetoPagoRaw,
      ideClie,
      manager,
    );

    aplicarPagoValidado(pagoValidado.tipoPagoVent, pagoValidado.ideMetoPago);
  }

  private async resolverMetodoPagoVenta(
    tipoPagoSolicitado: TipoPagoVenta | undefined,
    ideMetoPagoRaw: number | null | undefined,
    ideClie: number,
    manager: EntityManager,
  ): Promise<{
    tipoPagoVent: TipoPagoVenta;
    ideMetoPago: number | null;
  }> {
    const tipoPagoBase = tipoPagoSolicitado ?? 'efectivo';

    const ideMetoPago =
      ideMetoPagoRaw === null || ideMetoPagoRaw === undefined
        ? null
        : IdUtil.requireId(
            ideMetoPagoRaw,
            'El ID del método de pago no es válido.',
          );

    if (ideMetoPago === null) {
      if (tipoPagoBase !== 'efectivo') {
        throw new BadRequestException(
          'Debe seleccionar un método de pago válido para ventas con tarjeta o PayPal.',
        );
      }

      return {
        tipoPagoVent: 'efectivo',
        ideMetoPago: null,
      };
    }

    const metodoPago =
      await this.ventasRepository.buscarMetodoPagoActivoPorCliente(
        ideMetoPago,
        ideClie,
        manager,
      );

    if (!metodoPago) {
      throw new BadRequestException(
        'El método de pago seleccionado no existe, no está activo o no pertenece al cliente.',
      );
    }

    if (tipoPagoSolicitado && metodoPago.tipoPago !== tipoPagoSolicitado) {
      throw new BadRequestException(
        'El tipo de pago no coincide con el método de pago seleccionado.',
      );
    }

    return {
      tipoPagoVent: metodoPago.tipoPago,
      ideMetoPago,
    };
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

  private consolidarCantidadesPorProducto(
    detalles: Array<
      CreateVentaDetalleDTO | UpdateVentaDetalleDTO | DetalleVentaEntity
    >,
  ): Map<number, number> {
    const cantidades = new Map<number, number>();

    for (const detalle of detalles) {
      const ideProd = IdUtil.requireId(
        detalle.ideProd,
        'El ID del producto no es válido.',
      );

      const cantidadAnterior = cantidades.get(ideProd) ?? 0;
      cantidades.set(ideProd, cantidadAnterior + detalle.cantidadProd);
    }

    return cantidades;
  }

  private async ajustarStockPorCambioDeDetalles(
    cantidadesAnteriores: Map<number, number>,
    cantidadesNuevas: Map<number, number>,
    manager: EntityManager,
  ): Promise<void> {
    const productosIds = new Set<number>([
      ...cantidadesAnteriores.keys(),
      ...cantidadesNuevas.keys(),
    ]);

    for (const ideProd of productosIds) {
      const cantidadAnterior = cantidadesAnteriores.get(ideProd) ?? 0;
      const cantidadNueva = cantidadesNuevas.get(ideProd) ?? 0;

      if (cantidadAnterior === cantidadNueva) {
        continue;
      }

      const producto = await this.ventasRepository.buscarProductoPorIdForUpdate(
        ideProd,
        manager,
      );

      if (!producto) {
        throw new BadRequestException(
          `El producto con ID ${ideProd} no existe.`,
        );
      }

      this.validarProductoParaNuevaVenta(producto, cantidadNueva);

      const stockDisponible = producto.stockProd + cantidadAnterior;

      if (stockDisponible < cantidadNueva) {
        throw new BadRequestException(
          `Stock insuficiente para "${producto.nombreProd}". Disponible: ${stockDisponible}, solicitado: ${cantidadNueva}.`,
        );
      }

      producto.stockProd = stockDisponible - cantidadNueva;
      producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
      producto.usuaActua = 'admin';
      producto.fechaActua = new Date();

      await this.ventasRepository.guardarProducto(producto, manager);
    }
  }

  private validarProductoParaNuevaVenta(
    producto: ProductoEntity,
    cantidadNueva: number,
  ): void {
    if (cantidadNueva <= 0) {
      return;
    }

    if (producto.estadoProd !== 'activo') {
      throw new BadRequestException(
        `El producto "${producto.nombreProd}" no está activo.`,
      );
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
