import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoteEntity, ProductoEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateLoteDTO } from './dto/create_lote.dto';
import { FilterLoteDTO } from './dto/filter_lote.dto';
import { UpdateLoteDTO } from './dto/update_lote.dto';

@Injectable()
export class LotesRepository {
  constructor(
    @InjectRepository(LoteEntity)
    private readonly loteRepository: Repository<LoteEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

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

    if (filtros.ideProd !== undefined && filtros.ideProd !== null) {
      qb.andWhere('lote.ideProd = :ideProd', {
        ideProd: filtros.ideProd,
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

  async crear(
    dto: CreateLoteDTO,
    manager?: EntityManager,
  ): Promise<LoteEntity> {
    const repository = this.getLoteRepository(manager);

    const lote = repository.create({
      ideProd: dto.ideProd,
      fechaCaducidadLote: new Date(dto.fechaCaducidadLote),
      stockLote: dto.stockLote,
      estadoLote: dto.estadoLote as LoteEntity['estadoLote'],
    });

    return repository.save(lote);
  }

  async actualizar(
    lote: LoteEntity,
    dto: UpdateLoteDTO,
    manager?: EntityManager,
  ): Promise<LoteEntity> {
    lote.ideProd = dto.ideProd;
    lote.fechaCaducidadLote = new Date(dto.fechaCaducidadLote);
    lote.stockLote = dto.stockLote;
    lote.estadoLote = dto.estadoLote as LoteEntity['estadoLote'];

    return this.getLoteRepository(manager).save(lote);
  }

  async eliminar(ideLote: number, manager?: EntityManager): Promise<number> {
    const result = await this.getLoteRepository(manager).delete({
      ideLote,
    });

    return result.affected ?? 0;
  }

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
