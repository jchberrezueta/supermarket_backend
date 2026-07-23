import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneyUtil } from '@common/utils/money.util';
import {
  DetallePedidoEntity,
  EmpresaEntity,
  EmpresaPreciosEntity,
  EntregaEntity,
  PedidoEntity,
  ProductoEntity,
} from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreatePedidoCabeceraDTO } from './dto/create_pedido_cabecera.dto';
import { CreatePedidoDetalleDTO } from './dto/create_pedido_detalle.dto';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { UpdatePedidoCabeceraDTO } from './dto/update_pedido_cabecera.dto';

interface TotalesPedido {
  cantidadTotalPedi: number;
  totalPedi: number;
}

@Injectable()
export class PedidosRepository {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,

    @InjectRepository(DetallePedidoEntity)
    private readonly detallePedidoRepository: Repository<DetallePedidoEntity>,

    @InjectRepository(EmpresaEntity)
    private readonly empresaRepository: Repository<EmpresaEntity>,
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
        detalles: {
          producto: true,
        },
        entregas: true,
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
      .where('pedido.idePedi = :idePedi', {
        idePedi,
      })
      .getOne();
  }

  async buscarEmpresaPorId(
    ideEmpr: number,
    manager?: EntityManager,
  ): Promise<EmpresaEntity | null> {
    return this.getEmpresaRepository(manager).findOne({
      where: {
        ideEmpr,
      },
    });
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

    if (filtros.fechaPediDesde) {
      qb.andWhere('DATE(pedido.fechaPedi) >= :fechaPedi', {
        fechaPedi: filtros.fechaPediDesde,
      });
    }

    if (filtros.fechaPediHasta) {
      qb.andWhere('DATE(pedido.fechaPedi) <= :fechaPediHasta', {
        fechaPediHasta: filtros.fechaPediHasta,
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
      relations: {
        producto: true,
      },
      order: {
        ideDetaPedi: 'ASC',
      },
    });
  }

  async crearPedido(
    cabecera: CreatePedidoCabeceraDTO,
    totales: TotalesPedido,
    manager: EntityManager,
  ): Promise<PedidoEntity> {
    const repository = manager.getRepository(PedidoEntity);

    const pedido = repository.create({
      ideEmpr: cabecera.ideEmpr,
      fechaPedi: new Date(),
      fechaEntrPedi: this.toCalendarDate(cabecera.fechaEntrPedi),
      cantidadTotalPedi: totales.cantidadTotalPedi,
      totalPedi: MoneyUtil.toMoneyString(totales.totalPedi),

      /**
       * Crear un pedido nunca lo emite.
       */
      estadoPedi: 'borrador',

      motivoPedi: cabecera.motivoPedi,
      observacionPedi: cabecera.observacionPedi ?? null,
      usuaIngre: 'admin',
    });

    return repository.save(pedido);
  }

  async actualizarPedido(
    pedido: PedidoEntity,
    cabecera: UpdatePedidoCabeceraDTO,
    totales: TotalesPedido,
    manager: EntityManager,
  ): Promise<PedidoEntity> {
    pedido.ideEmpr = cabecera.ideEmpr;
    // fechaPedi conserva la fecha original bajo autoridad del servidor.
    pedido.fechaEntrPedi = this.toCalendarDate(cabecera.fechaEntrPedi);
    pedido.cantidadTotalPedi = totales.cantidadTotalPedi;
    pedido.totalPedi = MoneyUtil.toMoneyString(totales.totalPedi);

    /**
     * Este método únicamente debe modificar borradores.
     * No confía en el estado recibido desde el frontend.
     */
    pedido.estadoPedi = 'borrador';

    pedido.motivoPedi = cabecera.motivoPedi;
    pedido.observacionPedi = cabecera.observacionPedi ?? null;
    pedido.usuaActua = 'admin';
    pedido.fechaActua = new Date();

    return manager.getRepository(PedidoEntity).save(pedido);
  }

  private toCalendarDate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
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

        /**
         * Todo detalle nuevo comienza pendiente.
         */
        estadoDetaPedi: 'pendiente',
      }),
    );

    return repository.save(nuevosDetalles);
  }

  async guardarPedido(
    pedido: PedidoEntity,
    manager?: EntityManager,
  ): Promise<PedidoEntity> {
    return this.getPedidoRepository(manager).save(pedido);
  }

  async guardarDetallePedido(
    detalle: DetallePedidoEntity,
    manager?: EntityManager,
  ): Promise<DetallePedidoEntity> {
    return this.getDetallePedidoRepository(manager).save(detalle);
  }

  async guardarDetallesPedido(
    detalles: DetallePedidoEntity[],
    manager?: EntityManager,
  ): Promise<DetallePedidoEntity[]> {
    if (!detalles.length) {
      return [];
    }

    return this.getDetallePedidoRepository(manager).save(detalles);
  }

  async listarPreciosPorEmpresaYProductos(
    ideEmpr: number,
    idsProductos: number[],
    manager?: EntityManager,
  ): Promise<EmpresaPreciosEntity[]> {
    if (!idsProductos.length) {
      return [];
    }

    return this.getEmpresaPreciosRepository(manager)
      .createQueryBuilder('precioEmpresa')
      .leftJoinAndSelect('precioEmpresa.producto', 'producto')
      .where('precioEmpresa.ideEmpr = :ideEmpr', {
        ideEmpr,
      })
      .andWhere('precioEmpresa.ideProd IN (:...idsProductos)', {
        idsProductos,
      })
      .orderBy('precioEmpresa.ideProd', 'ASC')
      .addOrderBy('precioEmpresa.ideEmprProd', 'ASC')
      .getMany();
  }

  /**
   * Devuelve los productos del pedido que no están
   * asociados a la empresa en empresa_precios.
   */
  async listarProductosSinPrecioEmpresa(
    ideEmpr: number,
    idsProductos: number[],
    manager?: EntityManager,
  ): Promise<ProductoEntity[]> {
    if (!idsProductos.length) {
      return [];
    }

    return this.getProductoRepository(manager)
      .createQueryBuilder('producto')
      .leftJoin(
        EmpresaPreciosEntity,
        'precioEmpresa',
        `
          precioEmpresa.ideProd = producto.ideProd
          AND precioEmpresa.ideEmpr = :ideEmpr
        `,
        {
          ideEmpr,
        },
      )
      .where('producto.ideProd IN (:...idsProductos)', {
        idsProductos,
      })
      .andWhere('precioEmpresa.ideEmprProd IS NULL')
      .orderBy('producto.nombreProd', 'ASC')
      .getMany();
  }

  async contarEntregasNoAnuladas(
    idePedi: number,
    manager?: EntityManager,
  ): Promise<number> {
    return this.getEntregaRepository(manager)
      .createQueryBuilder('entrega')
      .where('entrega.idePedi = :idePedi', {
        idePedi,
      })
      .andWhere('entrega.estadoEntr <> :estadoAnulada', {
        estadoAnulada: 'anulada',
      })
      .getCount();
  }

  async contarEntregasBorrador(
    idePedi: number,
    manager?: EntityManager,
  ): Promise<number> {
    return this.getEntregaRepository(manager).count({
      where: {
        idePedi,
        estadoEntr: 'borrador',
      },
    });
  }

  async contarEntregasConfirmadas(
    idePedi: number,
    manager?: EntityManager,
  ): Promise<number> {
    return this.getEntregaRepository(manager)
      .createQueryBuilder('entrega')
      .where('entrega.idePedi = :idePedi', {
        idePedi,
      })
      .andWhere('entrega.estadoEntr IN (:...estados)', {
        estados: ['parcial', 'completa'],
      })
      .getCount();
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

  private getEmpresaRepository(
    manager?: EntityManager,
  ): Repository<EmpresaEntity> {
    if (manager) {
      return manager.getRepository(EmpresaEntity);
    }

    return this.empresaRepository;
  }

  private getEmpresaPreciosRepository(
    manager?: EntityManager,
  ): Repository<EmpresaPreciosEntity> {
    if (manager) {
      return manager.getRepository(EmpresaPreciosEntity);
    }

    return this.pedidoRepository.manager.getRepository(EmpresaPreciosEntity);
  }

  private getProductoRepository(
    manager?: EntityManager,
  ): Repository<ProductoEntity> {
    if (manager) {
      return manager.getRepository(ProductoEntity);
    }

    return this.pedidoRepository.manager.getRepository(ProductoEntity);
  }

  private getEntregaRepository(
    manager?: EntityManager,
  ): Repository<EntregaEntity> {
    if (manager) {
      return manager.getRepository(EntregaEntity);
    }

    return this.pedidoRepository.manager.getRepository(EntregaEntity);
  }
}
