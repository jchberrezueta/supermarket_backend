import { Injectable } from '@nestjs/common';
import {
  ClienteEntity,
  DetalleVentaEntity,
  ProductoEntity,
  VentaEntity,
} from '@entities';
import { EntityManager } from 'typeorm';

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
      .getMany();
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
}
