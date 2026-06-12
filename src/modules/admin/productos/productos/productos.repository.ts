import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProductosRepository {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findActivoByCodigo(codigo: string): Promise<ProductoEntity | null> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.codigoBarraProd = :codigo', { codigo })
      .andWhere('producto.estadoProd = :estado', { estado: 'activo' })
      .getOne();
  }

  async findActivoById(ideProd: number): Promise<ProductoEntity | null> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.ideProd = :ideProd', { ideProd })
      .andWhere('producto.estadoProd = :estado', { estado: 'activo' })
      .getOne();
  }

  async findStockBajo(stockMinimo = 5): Promise<ProductoEntity[]> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.estadoProd = :estado', { estado: 'activo' })
      .andWhere('producto.stockProd <= :stockMinimo', { stockMinimo })
      .orderBy('producto.stockProd', 'ASC')
      .getMany();
  }

  async descontarStock(
    manager: EntityManager,
    ideProd: number,
    cantidad: number,
    usuario = 'sistema',
  ): Promise<ProductoEntity> {
    const producto = await manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .setLock('pessimistic_write')
      .where('producto.ideProd = :ideProd', { ideProd })
      .andWhere('producto.estadoProd = :estado', { estado: 'activo' })
      .getOne();

    if (!producto) {
      throw new Error(`Producto ${ideProd} no encontrado o inactivo.`);
    }

    if (producto.stockProd < cantidad) {
      throw new Error(
        `Stock insuficiente para ${producto.nombreProd}. Disponible: ${producto.stockProd}`,
      );
    }

    producto.stockProd -= cantidad;
    producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
    producto.usuaActua = usuario;
    producto.fechaActua = new Date();

    return manager.getRepository(ProductoEntity).save(producto);
  }
}
