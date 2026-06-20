import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetalleEntregaEntity, EntregaEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { MoneyUtil } from '@common/utils/money.util';
import { CreateEntregaCabeceraDTO } from './dto/create_entrega_cabecera.dto';
import { CreateEntregaDetalleDTO } from './dto/create_entrega_detalle.dto';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { UpdateEntregaCabeceraDTO } from './dto/update_entrega_cabecera.dto';
import { UpdateEntregaDetalleDTO } from './dto/update_entrega_detalle.dto';

@Injectable()
export class EntregasRepository {
  constructor(
    @InjectRepository(EntregaEntity)
    private readonly entregaRepository: Repository<EntregaEntity>,
    @InjectRepository(DetalleEntregaEntity)
    private readonly detalleEntregaRepository: Repository<DetalleEntregaEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<EntregaEntity[]> {
    return this.getEntregaRepository(manager).find({
      relations: {
        pedido: {
          empresa: true,
        },
        proveedor: true,
      },
      order: {
        fechaEntr: 'DESC',
        ideEntr: 'DESC',
      },
    });
  }

  async buscarPorId(
    ideEntr: number,
    manager?: EntityManager,
  ): Promise<EntregaEntity | null> {
    return this.getEntregaRepository(manager).findOne({
      where: {
        ideEntr,
      },
      relations: {
        pedido: {
          empresa: true,
        },
        proveedor: true,
      },
    });
  }

  async buscarPorIdForUpdate(
    ideEntr: number,
    manager: EntityManager,
  ): Promise<EntregaEntity | null> {
    return manager
      .getRepository(EntregaEntity)
      .createQueryBuilder('entrega')
      .setLock('pessimistic_write')
      .where('entrega.ideEntr = :ideEntr', { ideEntr })
      .getOne();
  }

  async filtrar(
    filtros: FilterEntregaDTO,
    manager?: EntityManager,
  ): Promise<EntregaEntity[]> {
    const fechaDesde =
      filtros.fechaDesde ?? (filtros as any).fechaEntrDesde ?? null;
    const fechaHasta =
      filtros.fechaHasta ?? (filtros as any).fechaEntrHasta ?? null;

    const qb = this.getEntregaRepository(manager)
      .createQueryBuilder('entrega')
      .leftJoinAndSelect('entrega.pedido', 'pedido')
      .leftJoinAndSelect('pedido.empresa', 'empresa')
      .leftJoinAndSelect('entrega.proveedor', 'proveedor')
      .orderBy('entrega.fechaEntr', 'DESC')
      .addOrderBy('entrega.ideEntr', 'DESC');

    if (filtros.idePedi !== undefined && filtros.idePedi !== null) {
      qb.andWhere('entrega.idePedi = :idePedi', {
        idePedi: filtros.idePedi,
      });
    }

    if (filtros.ideProv !== undefined && filtros.ideProv !== null) {
      qb.andWhere('entrega.ideProv = :ideProv', {
        ideProv: filtros.ideProv,
      });
    }

    if (filtros.estadoEntr) {
      qb.andWhere('entrega.estadoEntr = :estadoEntr', {
        estadoEntr: filtros.estadoEntr,
      });
    }

    if (fechaDesde) {
      qb.andWhere('entrega.fechaEntr >= :fechaDesde', {
        fechaDesde,
      });
    }

    if (fechaHasta) {
      qb.andWhere('entrega.fechaEntr <= :fechaHasta', {
        fechaHasta,
      });
    }

    return qb.getMany();
  }

  async listarDetallesPorEntrega(
    ideEntr: number,
    manager?: EntityManager,
  ): Promise<DetalleEntregaEntity[]> {
    return this.getDetalleEntregaRepository(manager).find({
      where: {
        ideEntr,
      },
      relations: {
        producto: true,
      },
      order: {
        ideDetaEntr: 'ASC',
      },
    });
  }

  async crearEntrega(
    cabecera: CreateEntregaCabeceraDTO,
    totales: {
      cantidadTotalEntr: number;
      totalEntr: number;
    },
    manager: EntityManager,
  ): Promise<EntregaEntity> {
    const repository = manager.getRepository(EntregaEntity);

    const entrega = repository.create({
      idePedi: cabecera.idePedi,
      ideProv: cabecera.ideProv,
      fechaEntr: new Date(cabecera.fechaEntr),
      cantidadTotalEntr: totales.cantidadTotalEntr,
      totalEntr: MoneyUtil.toMoneyString(totales.totalEntr),
      estadoEntr: cabecera.estadoEntr as EntregaEntity['estadoEntr'],
      observacionEntr: cabecera.observacionEntr,
      usuaIngre: 'admin',
    });

    return repository.save(entrega);
  }

  async actualizarEntrega(
    entrega: EntregaEntity,
    cabecera: UpdateEntregaCabeceraDTO,
    totales: {
      cantidadTotalEntr: number;
      totalEntr: number;
    },
    manager: EntityManager,
  ): Promise<EntregaEntity> {
    entrega.idePedi = cabecera.idePedi;
    entrega.ideProv = cabecera.ideProv;
    entrega.fechaEntr = new Date(cabecera.fechaEntr);
    entrega.cantidadTotalEntr = totales.cantidadTotalEntr;
    entrega.totalEntr = MoneyUtil.toMoneyString(totales.totalEntr);
    entrega.estadoEntr = cabecera.estadoEntr as EntregaEntity['estadoEntr'];
    entrega.observacionEntr = cabecera.observacionEntr;
    entrega.usuaActua = 'admin';
    entrega.fechaActua = new Date();

    return manager.getRepository(EntregaEntity).save(entrega);
  }

  async reemplazarDetalles(
    ideEntr: number,
    detalles: Array<CreateEntregaDetalleDTO | UpdateEntregaDetalleDTO>,
    manager: EntityManager,
  ): Promise<DetalleEntregaEntity[]> {
    const repository = manager.getRepository(DetalleEntregaEntity);

    await repository.delete({
      ideEntr,
    });

    if (!detalles.length) {
      return [];
    }

    const nuevosDetalles = detalles.map((detalle) =>
      repository.create({
        ideEntr,
        ideProd: detalle.ideProd,
        cantidadProd: detalle.cantidadProd,
        precioUnitarioProd: MoneyUtil.toMoneyString(detalle.precioUnitarioProd),
        subtotalProd: MoneyUtil.toMoneyString(detalle.subtotalProd),
        dctoCompraProd: MoneyUtil.toMoneyString(detalle.dctoCompraProd),
        ivaProd: MoneyUtil.toMoneyString(detalle.ivaProd),
        totalProd: MoneyUtil.toMoneyString(detalle.totalProd),
        dctoCaducProd: MoneyUtil.toMoneyString(detalle.dctoCaducProd),
        estadoDetaEntr:
          (detalle as any).estadoDetaEntr ??
          (detalle as any).estadoDetaPedi ??
          'incompleto',
      }),
    );

    return repository.save(nuevosDetalles);
  }

  async eliminarEntregaConDetalles(
    ideEntr: number,
    manager: EntityManager,
  ): Promise<number> {
    await manager.getRepository(DetalleEntregaEntity).delete({
      ideEntr,
    });

    const result = await manager.getRepository(EntregaEntity).delete({
      ideEntr,
    });

    return result.affected ?? 0;
  }

  private getEntregaRepository(
    manager?: EntityManager,
  ): Repository<EntregaEntity> {
    if (manager) {
      return manager.getRepository(EntregaEntity);
    }

    return this.entregaRepository;
  }

  private getDetalleEntregaRepository(
    manager?: EntityManager,
  ): Repository<DetalleEntregaEntity> {
    if (manager) {
      return manager.getRepository(DetalleEntregaEntity);
    }

    return this.detalleEntregaRepository;
  }
}
