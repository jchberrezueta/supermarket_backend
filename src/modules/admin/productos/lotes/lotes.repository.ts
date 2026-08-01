import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoteEntity, ProductoEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { FilterLoteDTO } from './dto/filter_lote.dto';

@Injectable()
export class LotesRepository {
  constructor(
    @InjectRepository(LoteEntity)
    private readonly loteRepository: Repository<LoteEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async actualizarEstadosPorFecha(manager?: EntityManager): Promise<void> {
    const entityManager = manager ?? this.loteRepository.manager;

    await entityManager.query(`
      UPDATE lote
      SET estado_lote = CASE
        WHEN estado_lote = 'devuelto' THEN 'devuelto'
        WHEN fecha_caducidad_lote < CURRENT_DATE THEN 'caducado'
        WHEN fecha_caducidad_lote <= CURRENT_DATE + INTERVAL '30 days'
          THEN 'proximo'
        ELSE 'correcto'
      END
      WHERE estado_lote <> 'devuelto'
        AND estado_lote IS DISTINCT FROM CASE
          WHEN fecha_caducidad_lote < CURRENT_DATE THEN 'caducado'
          WHEN fecha_caducidad_lote <= CURRENT_DATE + INTERVAL '30 days'
            THEN 'proximo'
          ELSE 'correcto'
        END
    `);
  }

  async listar(manager?: EntityManager): Promise<LoteEntity[]> {
    return this.getLoteRepository(manager).find({
      relations: {
        producto: true,
      },
      order: {
        fechaCaducidadLote: 'ASC',
        ideLote: 'ASC',
      },
    });
  }

  async buscarPorId(
    ideLote: number,
    manager?: EntityManager,
  ): Promise<LoteEntity | null> {
    return this.getLoteRepository(manager).findOne({
      where: {
        ideLote,
      },
      relations: {
        producto: true,
      },
    });
  }

  async filtrar(
    filtros: FilterLoteDTO,
    manager?: EntityManager,
  ): Promise<LoteEntity[]> {
    const qb = this.getLoteRepository(manager)
      .createQueryBuilder('lote')
      .leftJoinAndSelect('lote.producto', 'producto')
      .orderBy('lote.fechaCaducidadLote', 'ASC')
      .addOrderBy('lote.ideLote', 'ASC');

    if (filtros.ideLote !== undefined && filtros.ideLote !== null) {
      qb.andWhere('lote.ideLote = :ideLote', {
        ideLote: filtros.ideLote,
      });
    }

    if (filtros.producto) {
      qb.andWhere('LOWER(producto.nombreProd) LIKE LOWER(:producto)', {
        producto: `%${filtros.producto}%`,
      });
    }

    if (filtros.estadoLote) {
      qb.andWhere('lote.estadoLote = :estadoLote', {
        estadoLote: filtros.estadoLote,
      });
    }

    if (filtros.fechaCaducidadLoteDesde) {
      qb.andWhere('lote.fechaCaducidadLote >= :fechaDesde', {
        fechaDesde: filtros.fechaCaducidadLoteDesde,
      });
    }

    if (filtros.fechaCaducidadLoteHasta) {
      qb.andWhere('lote.fechaCaducidadLote <= :fechaHasta', {
        fechaHasta: filtros.fechaCaducidadLoteHasta,
      });
    }

    if (filtros.stockLoteMin !== undefined && filtros.stockLoteMin !== null) {
      qb.andWhere('lote.stockLote >= :stockMinimo', {
        stockMinimo: filtros.stockLoteMin,
      });
    }

    if (filtros.stockLoteMax !== undefined && filtros.stockLoteMax !== null) {
      qb.andWhere('lote.stockLote <= :stockMaximo', {
        stockMaximo: filtros.stockLoteMax,
      });
    }

    return qb.getMany();
  }

  /**
   * Solo se usa para filtros y consultas.
   */
  async listarProductos(manager?: EntityManager): Promise<ProductoEntity[]> {
    return this.getProductoRepository(manager).find({
      order: {
        nombreProd: 'ASC',
      },
    });
  }

  private getLoteRepository(manager?: EntityManager): Repository<LoteEntity> {
    if (manager) {
      return manager.getRepository(LoteEntity);
    }

    return this.loteRepository;
  }

  private getProductoRepository(
    manager?: EntityManager,
  ): Repository<ProductoEntity> {
    if (manager) {
      return manager.getRepository(ProductoEntity);
    }

    return this.productoRepository;
  }
}
