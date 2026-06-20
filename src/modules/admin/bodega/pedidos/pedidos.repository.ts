import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetallePedidoEntity, PedidoEntity } from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { MoneyUtil } from '@common/utils/money.util';
import { CreatePedidoCabeceraDTO } from './dto/create_pedido_cabecera.dto';
import { CreatePedidoDetalleDTO } from './dto/create_pedido_detalle.dto';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { UpdatePedidoCabeceraDTO } from './dto/update_pedido_cabecera.dto';

@Injectable()
export class PedidosRepository {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(DetallePedidoEntity)
    private readonly detallePedidoRepository: Repository<DetallePedidoEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<PedidoEntity[]> {
    return this.getPedidoRepository(manager).find({
      relations: {
        empresa: true,
      },
      order: {
        fechaPedi: 'DESC',
        idePedi: 'DESC',
      },
    });
  }

  async buscarPorId(
    idePedi: number,
    manager?: EntityManager,
  ): Promise<PedidoEntity | null> {
    return this.getPedidoRepository(manager).findOne({
      where: {
        idePedi,
      },
      relations: {
        empresa: true,
      },
    });
  }

  async buscarPorIdForUpdate(
    idePedi: number,
    manager: EntityManager,
  ): Promise<PedidoEntity | null> {
    return manager
      .getRepository(PedidoEntity)
      .createQueryBuilder('pedido')
      .setLock('pessimistic_write')
      .where('pedido.idePedi = :idePedi', { idePedi })
      .getOne();
  }

  async filtrar(
    filtros: FilterPedidoDTO,
    manager?: EntityManager,
  ): Promise<PedidoEntity[]> {
    const qb = this.getPedidoRepository(manager)
      .createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.empresa', 'empresa')
      .orderBy('pedido.fechaPedi', 'DESC')
      .addOrderBy('pedido.idePedi', 'DESC');

    if (filtros.nombreEmpr) {
      qb.andWhere('LOWER(empresa.nombreEmpr) LIKE LOWER(:nombreEmpr)', {
        nombreEmpr: `%${filtros.nombreEmpr}%`,
      });
    }

    if (filtros.estadoPedi) {
      qb.andWhere('pedido.estadoPedi = :estadoPedi', {
        estadoPedi: filtros.estadoPedi,
      });
    }

    if (filtros.motivoPedi) {
      qb.andWhere('pedido.motivoPedi = :motivoPedi', {
        motivoPedi: filtros.motivoPedi,
      });
    }

    if (filtros.fechaPedi) {
      qb.andWhere('pedido.fechaPedi >= :fechaPedi', {
        fechaPedi: filtros.fechaPedi,
      });
    }

    if (filtros.fechaEntrPedi) {
      qb.andWhere('pedido.fechaEntrPedi <= :fechaEntrPedi', {
        fechaEntrPedi: filtros.fechaEntrPedi,
      });
    }

    return qb.getMany();
  }

  async listarDetallesPorPedido(
    idePedi: number,
    manager?: EntityManager,
  ): Promise<DetallePedidoEntity[]> {
    return this.getDetallePedidoRepository(manager).find({
      where: {
        idePedi,
      },
      order: {
        ideDetaPedi: 'ASC',
      },
    });
  }

  async crearPedido(
    cabecera: CreatePedidoCabeceraDTO,
    totales: {
      cantidadTotalPedi: number;
      totalPedi: number;
    },
    manager: EntityManager,
  ): Promise<PedidoEntity> {
    const repository = manager.getRepository(PedidoEntity);

    const pedido = repository.create({
      ideEmpr: cabecera.ideEmpr,
      fechaPedi: new Date(cabecera.fechaPedi),
      fechaEntrPedi: new Date(cabecera.fechaEntrPedi),
      cantidadTotalPedi: totales.cantidadTotalPedi,
      totalPedi: MoneyUtil.toMoneyString(totales.totalPedi),
      estadoPedi: cabecera.estadoPedi as PedidoEntity['estadoPedi'],
      motivoPedi: cabecera.motivoPedi as PedidoEntity['motivoPedi'],
      observacionPedi: cabecera.observacionPedi,
      usuaIngre: 'admin',
    });

    return repository.save(pedido);
  }

  async actualizarPedido(
    pedido: PedidoEntity,
    cabecera: UpdatePedidoCabeceraDTO,
    totales: {
      cantidadTotalPedi: number;
      totalPedi: number;
    },
    manager: EntityManager,
  ): Promise<PedidoEntity> {
    pedido.ideEmpr = cabecera.ideEmpr;
    pedido.fechaPedi = new Date(cabecera.fechaPedi);
    pedido.fechaEntrPedi = new Date(cabecera.fechaEntrPedi);
    pedido.cantidadTotalPedi = totales.cantidadTotalPedi;
    pedido.totalPedi = MoneyUtil.toMoneyString(totales.totalPedi);
    pedido.estadoPedi = cabecera.estadoPedi as PedidoEntity['estadoPedi'];
    pedido.motivoPedi = cabecera.motivoPedi as PedidoEntity['motivoPedi'];
    pedido.observacionPedi = cabecera.observacionPedi;
    pedido.usuaActua = 'admin';
    pedido.fechaActua = new Date();

    return manager.getRepository(PedidoEntity).save(pedido);
  }

  async reemplazarDetalles(
    idePedi: number,
    detalles: CreatePedidoDetalleDTO[],
    manager: EntityManager,
  ): Promise<DetallePedidoEntity[]> {
    const repository = manager.getRepository(DetallePedidoEntity);

    await repository.delete({
      idePedi,
    });

    const nuevosDetalles = detalles.map((detalle) =>
      repository.create({
        idePedi,
        ideProd: detalle.ideProd,
        cantidadProd: detalle.cantidadProd,
        precioUnitarioProd: MoneyUtil.toMoneyString(detalle.precioUnitarioProd),
        subtotalProd: MoneyUtil.toMoneyString(detalle.subtotalProd),
        dctoCompraProd: MoneyUtil.toMoneyString(detalle.dctoCompraProd),
        ivaProd: MoneyUtil.toMoneyString(detalle.ivaProd),
        totalProd: MoneyUtil.toMoneyString(detalle.totalProd),
        dctoCaducProd: MoneyUtil.toMoneyString(detalle.dctoCaducProd),
        estadoDetaPedi:
          detalle.estadoDetaPedi as DetallePedidoEntity['estadoDetaPedi'],
      }),
    );

    return repository.save(nuevosDetalles);
  }

  async eliminarPedidoConDetalles(
    idePedi: number,
    manager: EntityManager,
  ): Promise<number> {
    await manager.getRepository(DetallePedidoEntity).delete({
      idePedi,
    });

    const result = await manager.getRepository(PedidoEntity).delete({
      idePedi,
    });

    return result.affected ?? 0;
  }

  private getPedidoRepository(
    manager?: EntityManager,
  ): Repository<PedidoEntity> {
    if (manager) {
      return manager.getRepository(PedidoEntity);
    }

    return this.pedidoRepository;
  }

  private getDetallePedidoRepository(
    manager?: EntityManager,
  ): Repository<DetallePedidoEntity> {
    if (manager) {
      return manager.getRepository(DetallePedidoEntity);
    }

    return this.detallePedidoRepository;
  }
}
