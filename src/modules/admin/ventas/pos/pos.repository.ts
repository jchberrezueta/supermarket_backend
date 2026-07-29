import { Injectable } from '@nestjs/common';
import {
  ClienteEntity,
  DetalleVentaEntity,
  LoteEntity,
  MetodoPagoClienteEntity,
  MovimientoInventarioEntity,
  ProductoEntity,
  VentaEntity,
} from '@entities';
import { EntityManager } from 'typeorm';

interface RegistrarMovimientoVentaParams {
  ideProd: number;
  ideLote: number;
  ideDetaVent: number;
  tipoMovi: MovimientoInventarioEntity['tipoMovi'];
  cantidadMovi: number;
  stockProdAnterior: number;
  stockProdPosterior: number;
  stockLoteAnterior: number;
  stockLotePosterior: number;
  observacionMovi: string;
  usuaIngre?: string;
}

@Injectable()
export class PosRepository {
  async findProductoActivoByCodigo(codigo: string, manager: EntityManager) {
    return manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .where('producto.codigoBarraProd = :codigo', { codigo })
      .andWhere('producto.estadoProd = :estado', { estado: 'activo' })
      .getOne();
  }

  async findProductoActivoByIdForUpdate(
    ideProd: number,
    manager: EntityManager,
  ) {
    return manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .setLock('pessimistic_write')
      .where('producto.ideProd = :ideProd', { ideProd })
      .andWhere('producto.estadoProd = :estado', { estado: 'activo' })
      .getOne();
  }

  async findProductoByIdForUpdate(ideProd: number, manager: EntityManager) {
    return manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .setLock('pessimistic_write')
      .where('producto.ideProd = :ideProd', { ideProd })
      .getOne();
  }

  /**
   * Lotes vendibles en orden FEFO:
   * primero vence, primero sale.
   *
   * La fecha es la autoridad real para impedir la venta de caducados.
   * El bloqueo evita que dos ventas consuman simultáneamente las mismas
   * unidades.
   */
  async findLotesVendiblesFefoForUpdate(
    ideProd: number,
    manager: EntityManager,
  ): Promise<LoteEntity[]> {
    return manager
      .getRepository(LoteEntity)
      .createQueryBuilder('lote')
      .setLock('pessimistic_write')
      .where('lote.ideProd = :ideProd', { ideProd })
      .andWhere('lote.stockLote > 0')
      .andWhere('DATE(lote.fechaCaducidadLote) >= CURRENT_DATE')
      .andWhere('lote.estadoLote <> :estadoDevuelto', {
        estadoDevuelto: 'devuelto',
      })
      .orderBy('lote.fechaCaducidadLote', 'ASC')
      .addOrderBy('lote.ideLote', 'ASC')
      .getMany();
  }

  async findLoteByIdForUpdate(ideLote: number, manager: EntityManager) {
    return manager
      .getRepository(LoteEntity)
      .createQueryBuilder('lote')
      .setLock('pessimistic_write')
      .where('lote.ideLote = :ideLote', { ideLote })
      .getOne();
  }

  async findClienteByCedula(cedula: string, manager: EntityManager) {
    return manager
      .getRepository(ClienteEntity)
      .createQueryBuilder('cliente')
      .where('cliente.cedulaClie = :cedula', { cedula })
      .getOne();
  }

  async findClienteById(ideClie: number, manager: EntityManager) {
    return manager
      .getRepository(ClienteEntity)
      .createQueryBuilder('cliente')
      .where('cliente.ideClie = :ideClie', { ideClie })
      .getOne();
  }

  async findMetodoPagoActivoByCliente(
    ideMetoPago: number,
    ideClie: number,
    manager: EntityManager,
  ) {
    return manager.getRepository(MetodoPagoClienteEntity).findOne({
      where: {
        ideMetoPago,
        ideClie,
        estado: 'activo',
      },
    });
  }

  async guardarVenta(venta: Partial<VentaEntity>, manager: EntityManager) {
    const ventaRepository = manager.getRepository(VentaEntity);
    const nuevaVenta = ventaRepository.create(venta);

    return ventaRepository.save(nuevaVenta);
  }

  async guardarDetalleVenta(
    detalle: Partial<DetalleVentaEntity>,
    manager: EntityManager,
  ) {
    const detalleRepository = manager.getRepository(DetalleVentaEntity);
    const nuevoDetalle = detalleRepository.create(detalle);

    return detalleRepository.save(nuevoDetalle);
  }

  async guardarProducto(producto: ProductoEntity, manager: EntityManager) {
    return manager.getRepository(ProductoEntity).save(producto);
  }

  async guardarLote(lote: LoteEntity, manager: EntityManager) {
    return manager.getRepository(LoteEntity).save(lote);
  }

  async registrarMovimientoVenta(
    params: RegistrarMovimientoVentaParams,
    manager: EntityManager,
  ) {
    const repository = manager.getRepository(MovimientoInventarioEntity);

    const movimiento = repository.create({
      ideProd: params.ideProd,
      ideLote: params.ideLote,
      ideDetaEntr: null,
      ideDetaVent: params.ideDetaVent,
      tipoMovi: params.tipoMovi,
      cantidadMovi: params.cantidadMovi,
      stockProdAnterior: params.stockProdAnterior,
      stockProdPosterior: params.stockProdPosterior,
      stockLoteAnterior: params.stockLoteAnterior,
      stockLotePosterior: params.stockLotePosterior,
      observacionMovi: params.observacionMovi,
      usuaIngre: params.usuaIngre ?? 'pos',
    });

    return repository.save(movimiento);
  }

  async findVentaByIdForUpdate(ideVent: number, manager: EntityManager) {
    return manager
      .getRepository(VentaEntity)
      .createQueryBuilder('venta')
      .setLock('pessimistic_write')
      .where('venta.ideVent = :ideVent', { ideVent })
      .getOne();
  }

  async findDetallesByVenta(ideVent: number, manager: EntityManager) {
    return manager
      .getRepository(DetalleVentaEntity)
      .createQueryBuilder('detalle')
      .where('detalle.ideVent = :ideVent', { ideVent })
      .orderBy('detalle.ideDetaVent', 'ASC')
      .getMany();
  }

  async findMovimientosSalidaVentaByDetalleForUpdate(
    ideDetaVent: number,
    manager: EntityManager,
  ): Promise<MovimientoInventarioEntity[]> {
    return manager
      .getRepository(MovimientoInventarioEntity)
      .createQueryBuilder('movimiento')
      .setLock('pessimistic_write')
      .where('movimiento.ideDetaVent = :ideDetaVent', { ideDetaVent })
      .andWhere('movimiento.tipoMovi = :tipoMovi', {
        tipoMovi: 'salida_venta',
      })
      .orderBy('movimiento.ideMovi', 'ASC')
      .getMany();
  }
}
