import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateProductoDTO } from './dto/create_producto.dto';
import { FilterProductoDTO } from './dto/filter_producto.dto';
import { UpdateProductoDTO } from './dto/update_producto.dto';

@Injectable()
export class ProductosRepository {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<ProductoEntity[]> {
    return this.getRepository(manager).find({
      relations: {
        categoria: true,
        marca: true,
      },
      order: {
        nombreProd: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideProd: number,
    manager?: EntityManager,
  ): Promise<ProductoEntity | null> {
    return this.getRepository(manager).findOne({
      where: {
        ideProd,
      },
      relations: {
        categoria: true,
        marca: true,
      },
    });
  }

  async buscarPorIdForUpdate(
    ideProd: number,
    manager: EntityManager,
  ): Promise<ProductoEntity | null> {
    return manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .setLock('pessimistic_write')
      .where('producto.ideProd = :ideProd', {
        ideProd,
      })
      .getOne();
  }

  async filtrar(
    filtros: FilterProductoDTO,
    manager?: EntityManager,
  ): Promise<ProductoEntity[]> {
    const qb = this.getRepository(manager)
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.marca', 'marca')
      .orderBy('producto.nombreProd', 'ASC');

    if (filtros.ideCate !== undefined && filtros.ideCate !== null) {
      qb.andWhere('producto.ideCate = :ideCate', {
        ideCate: filtros.ideCate,
      });
    }

    if (filtros.ideMarc !== undefined && filtros.ideMarc !== null) {
      qb.andWhere('producto.ideMarc = :ideMarc', {
        ideMarc: filtros.ideMarc,
      });
    }

    if (filtros.nombreProd) {
      qb.andWhere('LOWER(producto.nombreProd) LIKE LOWER(:nombreProd)', {
        nombreProd: `%${filtros.nombreProd}%`,
      });
    }

    if (filtros.codigoBarraProd) {
      qb.andWhere('producto.codigoBarraProd = :codigoBarraProd', {
        codigoBarraProd: filtros.codigoBarraProd,
      });
    }

    if (filtros.estadoProd) {
      qb.andWhere('producto.estadoProd = :estadoProd', {
        estadoProd: filtros.estadoProd,
      });
    }

    if (filtros.disponibleProd) {
      qb.andWhere('producto.disponibleProd = :disponibleProd', {
        disponibleProd: filtros.disponibleProd,
      });
    }

    return qb.getMany();
  }

  async crear(
    dto: CreateProductoDTO,
    manager?: EntityManager,
  ): Promise<ProductoEntity> {
    const repository = this.getRepository(manager);

    const producto = repository.create({
      ideCate: dto.ideCate,
      ideMarc: dto.ideMarc,
      codigoBarraProd: dto.codigoBarraProd,
      nombreProd: dto.nombreProd,
      urlImgProd: dto.urlImgProd ?? null,
      precioVentaProd: dto.precioVentaProd.toFixed(2),
      ivaProd: dto.ivaProd.toFixed(2),
      dctoPromoProd: dto.dctoPromoProd.toFixed(2),

      /**
       * El catálogo no introduce inventario.
       *
       * El stock nace únicamente de movimientos formales.
       */
      stockProd: 0,
      disponibleProd: 'no',

      stockMinimoProd: dto.stockMinimoProd ?? 0,

      estadoProd: dto.estadoProd,
      descripcionProd: dto.descripcionProd ?? null,
      usuaIngre: 'admin',
    });

    return repository.save(producto);
  }

  async actualizar(
    producto: ProductoEntity,
    dto: UpdateProductoDTO,
    manager?: EntityManager,
  ): Promise<ProductoEntity> {
    producto.ideCate = dto.ideCate;
    producto.ideMarc = dto.ideMarc;
    producto.codigoBarraProd = dto.codigoBarraProd;
    producto.nombreProd = dto.nombreProd;
    producto.urlImgProd = dto.urlImgProd ?? null;

    producto.precioVentaProd = dto.precioVentaProd.toFixed(2);

    producto.ivaProd = dto.ivaProd.toFixed(2);

    producto.dctoPromoProd = dto.dctoPromoProd.toFixed(2);

    producto.stockMinimoProd =
      dto.stockMinimoProd ?? producto.stockMinimoProd ?? 0;

    producto.estadoProd = dto.estadoProd;

    producto.descripcionProd = dto.descripcionProd ?? null;

    /**
     * stockProd no se reemplaza con el DTO.
     *
     * disponibleProd tampoco se acepta desde el formulario:
     * siempre se deriva del stock real persistido.
     */
    producto.disponibleProd = Number(producto.stockProd) > 0 ? 'si' : 'no';

    producto.usuaActua = 'admin';
    producto.fechaActua = new Date();

    return this.getRepository(manager).save(producto);
  }

  async desactivar(
    producto: ProductoEntity,
    manager?: EntityManager,
  ): Promise<ProductoEntity> {
    producto.estadoProd = 'inactivo';

    /**
     * No alteramos stock ni disponibilidad.
     *
     * La existencia física sigue registrada, pero el producto
     * deja de estar habilitado para nuevas operaciones normales.
     */
    producto.disponibleProd = Number(producto.stockProd) > 0 ? 'si' : 'no';

    producto.usuaActua = 'admin';
    producto.fechaActua = new Date();

    return this.getRepository(manager).save(producto);
  }

  async findActivoByCodigo(
    codigo: string,
    manager?: EntityManager,
  ): Promise<ProductoEntity | null> {
    return this.getRepository(manager)
      .createQueryBuilder('producto')
      .where('producto.codigoBarraProd = :codigo', { codigo })
      .andWhere('producto.estadoProd = :estado', { estado: 'activo' })
      .getOne();
  }

  async findActivoById(
    ideProd: number,
    manager?: EntityManager,
  ): Promise<ProductoEntity | null> {
    return this.getRepository(manager)
      .createQueryBuilder('producto')
      .where('producto.ideProd = :ideProd', { ideProd })
      .andWhere('producto.estadoProd = :estado', { estado: 'activo' })
      .getOne();
  }

  async findStockBajo(
    stockMinimo = 5,
    manager?: EntityManager,
  ): Promise<ProductoEntity[]> {
    return this.getRepository(manager)
      .createQueryBuilder('producto')
      .where('producto.estadoProd = :estado', { estado: 'activo' })
      .andWhere(
        '(producto.stockProd <= producto.stockMinimoProd OR producto.stockProd <= :stockMinimo)',
        { stockMinimo },
      )
      .orderBy('producto.stockProd', 'ASC')
      .getMany();
  }

  /**
   * Temporal:
   * Este método todavía descuenta stock general del producto.
   * En la siguiente fase se reemplazará por descuento FEFO contra lote.
   */
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

  private getRepository(manager?: EntityManager): Repository<ProductoEntity> {
    if (manager) {
      return manager.getRepository(ProductoEntity);
    }

    return this.productoRepository;
  }
}
