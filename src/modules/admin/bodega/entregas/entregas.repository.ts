import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DetalleEntregaEntity,
  DetalleEntregaLoteEntity,
  DetallePedidoEntity,
  EntregaEntity,
  LoteEntity,
  MovimientoInventarioEntity,
  PedidoEntity,
  ProductoEntity,
  ProveedorEntity,
} from '@entities';
import { EntityManager, Repository } from 'typeorm';
import { CreateEntregaCabeceraDTO } from './dto/create_entrega_cabecera.dto';
import { CreateEntregaDetalleDTO } from './dto/create_entrega_detalle.dto';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { UpdateEntregaCabeceraDTO } from './dto/update_entrega_cabecera.dto';

interface TotalesEntregaCalculados {
  cantidadTotalEntr: number;
  totalEntr: number;
}

interface RegistrarMovimientoInventarioParams {
  ideProd: number;
  ideLote?: number | null;
  ideDetaEntr?: number | null;
  ideDetaVent?: number | null;
  tipoMovi: MovimientoInventarioEntity['tipoMovi'];
  cantidadMovi: number;
  stockProdAnterior?: number | null;
  stockProdPosterior?: number | null;
  stockLoteAnterior?: number | null;
  stockLotePosterior?: number | null;
  observacionMovi?: string | null;
  usuaIngre?: string;
}

export interface CantidadConfirmadaPedidoRow {
  ide_deta_pedi: number;
  cantidad_confirmada: string;
}

@Injectable()
export class EntregasRepository {
  constructor(
    @InjectRepository(EntregaEntity)
    private readonly entregaRepository: Repository<EntregaEntity>,

    @InjectRepository(DetalleEntregaEntity)
    private readonly detalleEntregaRepository: Repository<DetalleEntregaEntity>,

    @InjectRepository(DetalleEntregaLoteEntity)
    private readonly detalleEntregaLoteRepository: Repository<DetalleEntregaLoteEntity>,

    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,

    @InjectRepository(DetallePedidoEntity)
    private readonly detallePedidoRepository: Repository<DetallePedidoEntity>,

    @InjectRepository(ProveedorEntity)
    private readonly proveedorRepository: Repository<ProveedorEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(LoteEntity)
    private readonly loteRepository: Repository<LoteEntity>,

    @InjectRepository(MovimientoInventarioEntity)
    private readonly movimientoInventarioRepository: Repository<MovimientoInventarioEntity>,
  ) {}

  async listar(manager?: EntityManager): Promise<EntregaEntity[]> {
    return this.getEntregaRepository(manager).find({
      relations: {
        pedido: {
          empresa: true,
        },
        proveedor: {
          empresa: true,
        },
        detalles: {
          producto: true,
          detallePedido: true,
          lotesRecibidos: {
            lote: true,
          },
        },
      },
      order: {
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
        proveedor: {
          empresa: true,
        },
        detalles: {
          producto: true,
          detallePedido: true,
          lotesRecibidos: {
            lote: true,
          },
        },
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
    const qb = this.getEntregaRepository(manager)
      .createQueryBuilder('entrega')
      .leftJoinAndSelect('entrega.pedido', 'pedido')
      .leftJoinAndSelect('pedido.empresa', 'empresaPedido')
      .leftJoinAndSelect('entrega.proveedor', 'proveedor')
      .leftJoinAndSelect('proveedor.empresa', 'empresaProveedor')
      .leftJoinAndSelect('entrega.detalles', 'detalle')
      .leftJoinAndSelect('detalle.producto', 'producto')
      .leftJoinAndSelect('detalle.detallePedido', 'detallePedido')
      .leftJoinAndSelect('detalle.lotesRecibidos', 'detalleLote')
      .leftJoinAndSelect('detalleLote.lote', 'lote')
      .orderBy('entrega.ideEntr', 'DESC');

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

    if (filtros.fechaDesde) {
      qb.andWhere('DATE(entrega.fechaEntr) >= :fechaDesde', {
        fechaDesde: filtros.fechaDesde,
      });
    }

    if (filtros.fechaHasta) {
      qb.andWhere('DATE(entrega.fechaEntr) <= :fechaHasta', {
        fechaHasta: filtros.fechaHasta,
      });
    }

    return qb.getMany();
  }

  async crearEntrega(
    dto: CreateEntregaCabeceraDTO,
    totales: TotalesEntregaCalculados,
    manager?: EntityManager,
  ): Promise<EntregaEntity> {
    const repository = this.getEntregaRepository(manager);

    const entrega = repository.create({
      idePedi: dto.idePedi,
      ideProv: dto.ideProv,
      fechaEntr: new Date(dto.fechaEntr),
      cantidadTotalEntr: totales.cantidadTotalEntr,
      totalEntr: totales.totalEntr.toFixed(2),

      /**
       * La creación nunca confirma inventario.
       */
      estadoEntr: 'borrador',

      observacionEntr: dto.observacionEntr ?? null,
      usuaIngre: 'admin',
    });

    return repository.save(entrega);
  }

  async actualizarEntrega(
    entrega: EntregaEntity,
    dto: UpdateEntregaCabeceraDTO,
    totales: TotalesEntregaCalculados,
    manager?: EntityManager,
  ): Promise<EntregaEntity> {
    entrega.idePedi = dto.idePedi;
    entrega.ideProv = dto.ideProv;
    entrega.fechaEntr = new Date(dto.fechaEntr);
    entrega.cantidadTotalEntr = totales.cantidadTotalEntr;
    entrega.totalEntr = totales.totalEntr.toFixed(2);

    /**
     * Este método solo debe utilizarse con borradores.
     * No acepta estados enviados por el frontend.
     */
    entrega.estadoEntr = 'borrador';

    entrega.observacionEntr = dto.observacionEntr ?? null;
    entrega.usuaActua = 'admin';
    entrega.fechaActua = new Date();

    return this.getEntregaRepository(manager).save(entrega);
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
        detallePedido: true,
        lotesRecibidos: {
          lote: true,
        },
      },
      order: {
        ideDetaEntr: 'ASC',
      },
    });
  }

  async reemplazarDetalles(
    ideEntr: number,
    detalles: CreateEntregaDetalleDTO[],
    manager?: EntityManager,
  ): Promise<void> {
    const detalleRepository = this.getDetalleEntregaRepository(manager);
    const detalleLoteRepository = this.getDetalleEntregaLoteRepository(manager);

    const detallesActuales = await detalleRepository.find({
      where: {
        ideEntr,
      },
      relations: {
        lotesRecibidos: true,
      },
    });

    for (const detalleActual of detallesActuales) {
      if (detalleActual.lotesRecibidos?.length) {
        await detalleLoteRepository.remove(detalleActual.lotesRecibidos);
      }
    }

    if (detallesActuales.length) {
      await detalleRepository.remove(detallesActuales);
    }

    for (const detalleDto of detalles) {
      const detalle = detalleRepository.create({
        ideEntr,
        ideDetaPedi: detalleDto.ideDetaPedi ?? null,
        ideProd: detalleDto.ideProd,
        cantidadProd: detalleDto.cantidadProd,
        precioUnitarioProd: detalleDto.precioUnitarioProd.toFixed(2),
        subtotalProd: detalleDto.subtotalProd.toFixed(2),
        dctoCompraProd: detalleDto.dctoCompraProd.toFixed(2),
        ivaProd: detalleDto.ivaProd.toFixed(2),
        totalProd: detalleDto.totalProd.toFixed(2),
        dctoCaducProd: detalleDto.dctoCaducProd.toFixed(2),
        estadoDetaEntr: detalleDto.estadoDetaEntr,
      });

      const detalleGuardado = await detalleRepository.save(detalle);

      if (detalleDto.lotesRecibidos?.length) {
        const lotes = detalleDto.lotesRecibidos.map((loteDto) =>
          detalleLoteRepository.create({
            ideDetaEntr: detalleGuardado.ideDetaEntr,
            /**
             * Mientras la entrega sea borrador, todavía no existe
             * una afectación real sobre la tabla lote.
             */
            ideLote: null,
            fechaCaducidadLote: new Date(loteDto.fechaCaducidadLote),
            cantidadLote: loteDto.cantidadLote,
            estadoDetaEntrLote: 'registrado',
            usuaIngre: 'admin',
          }),
        );

        await detalleLoteRepository.save(lotes);
      }
    }
  }

  async eliminarEntregaConDetalles(
    ideEntr: number,
    manager?: EntityManager,
  ): Promise<number> {
    const detalleRepository = this.getDetalleEntregaRepository(manager);
    const detalleLoteRepository = this.getDetalleEntregaLoteRepository(manager);

    const detalles = await detalleRepository.find({
      where: {
        ideEntr,
      },
      relations: {
        lotesRecibidos: true,
      },
    });

    for (const detalle of detalles) {
      if (detalle.lotesRecibidos?.length) {
        await detalleLoteRepository.remove(detalle.lotesRecibidos);
      }
    }

    if (detalles.length) {
      await detalleRepository.remove(detalles);
    }

    const result = await this.getEntregaRepository(manager).delete({
      ideEntr,
    });

    return result.affected ?? 0;
  }

  async buscarPedidoPorId(
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
      },
    });
  }

  async buscarProveedorPorId(
    ideProv: number,
    manager?: EntityManager,
  ): Promise<ProveedorEntity | null> {
    return this.getProveedorRepository(manager).findOne({
      where: {
        ideProv,
      },
      relations: {
        empresa: true,
      },
    });
  }

  async buscarProductoPorIdForUpdate(
    ideProd: number,
    manager: EntityManager,
  ): Promise<ProductoEntity | null> {
    return manager
      .getRepository(ProductoEntity)
      .createQueryBuilder('producto')
      .setLock('pessimistic_write')
      .where('producto.ideProd = :ideProd', { ideProd })
      .getOne();
  }

  async guardarProducto(
    producto: ProductoEntity,
    manager?: EntityManager,
  ): Promise<ProductoEntity> {
    return this.getProductoRepository(manager).save(producto);
  }

  async buscarLotePorProductoYFechaForUpdate(
    ideProd: number,
    fechaCaducidadLote: string,
    manager: EntityManager,
  ): Promise<LoteEntity | null> {
    return manager
      .getRepository(LoteEntity)
      .createQueryBuilder('lote')
      .setLock('pessimistic_write')
      .where('lote.ideProd = :ideProd', { ideProd })
      .andWhere('DATE(lote.fechaCaducidadLote) = :fechaCaducidadLote', {
        fechaCaducidadLote,
      })
      .getOne();
  }

  async crearLote(
    ideProd: number,
    fechaCaducidadLote: string,
    stockInicial: number,
    manager?: EntityManager,
  ): Promise<LoteEntity> {
    const repository = this.getLoteRepository(manager);

    const lote = repository.create({
      ideProd,
      fechaCaducidadLote: new Date(fechaCaducidadLote),
      stockLote: stockInicial,
      estadoLote: this.obtenerEstadoLotePorFecha(fechaCaducidadLote),
    });

    return repository.save(lote);
  }

  async guardarLote(
    lote: LoteEntity,
    manager?: EntityManager,
  ): Promise<LoteEntity> {
    lote.estadoLote = this.obtenerEstadoLotePorFecha(lote.fechaCaducidadLote);

    return this.getLoteRepository(manager).save(lote);
  }

  async registrarMovimientoInventario(
    params: RegistrarMovimientoInventarioParams,
    manager?: EntityManager,
  ): Promise<MovimientoInventarioEntity> {
    const repository = this.getMovimientoInventarioRepository(manager);

    const movimiento = repository.create({
      ideProd: params.ideProd,
      ideLote: params.ideLote ?? null,
      ideDetaEntr: params.ideDetaEntr ?? null,
      ideDetaVent: params.ideDetaVent ?? null,
      tipoMovi: params.tipoMovi,
      cantidadMovi: params.cantidadMovi,
      stockProdAnterior: params.stockProdAnterior ?? null,
      stockProdPosterior: params.stockProdPosterior ?? null,
      stockLoteAnterior: params.stockLoteAnterior ?? null,
      stockLotePosterior: params.stockLotePosterior ?? null,
      observacionMovi: params.observacionMovi ?? null,
      usuaIngre: params.usuaIngre ?? 'admin',
    });

    return repository.save(movimiento);
  }

  async obtenerCantidadesConfirmadasPorPedido(
    idePedi: number,
    excluirIdeEntr: number | null,
    manager?: EntityManager,
  ): Promise<CantidadConfirmadaPedidoRow[]> {
    const qb = this.getDetalleEntregaRepository(manager)
      .createQueryBuilder('detalleEntrega')
      .innerJoin('detalleEntrega.entrega', 'entrega')
      .select('detalleEntrega.ideDetaPedi', 'ide_deta_pedi')
      .addSelect(
        'COALESCE(SUM(detalleEntrega.cantidadProd), 0)',
        'cantidad_confirmada',
      )
      .where('entrega.idePedi = :idePedi', { idePedi })
      .andWhere('entrega.estadoEntr IN (:...estados)', {
        estados: ['parcial', 'completa'],
      })
      .andWhere('detalleEntrega.ideDetaPedi IS NOT NULL')
      .andWhere('detalleEntrega.estadoDetaEntr <> :estadoNoEntregado', {
        estadoNoEntregado: 'no_entregado',
      })
      .andWhere('detalleEntrega.cantidadProd > 0')
      .groupBy('detalleEntrega.ideDetaPedi');

    if (excluirIdeEntr !== null) {
      qb.andWhere('entrega.ideEntr <> :excluirIdeEntr', {
        excluirIdeEntr,
      });
    }

    return qb.getRawMany<CantidadConfirmadaPedidoRow>();
  }

  async guardarDetallesEntrega(
    detalles: DetalleEntregaEntity[],
    manager?: EntityManager,
  ): Promise<DetalleEntregaEntity[]> {
    if (!detalles.length) {
      return [];
    }

    return this.getDetalleEntregaRepository(manager).save(detalles);
  }

  async guardarDetallePedido(
    detallePedido: DetallePedidoEntity,
    manager?: EntityManager,
  ): Promise<DetallePedidoEntity> {
    return this.getDetallePedidoRepository(manager).save(detallePedido);
  }

  async guardarPedido(
    pedido: PedidoEntity,
    manager?: EntityManager,
  ): Promise<PedidoEntity> {
    return this.getPedidoRepository(manager).save(pedido);
  }

  async guardarEntrega(
    entrega: EntregaEntity,
    manager?: EntityManager,
  ): Promise<EntregaEntity> {
    return this.getEntregaRepository(manager).save(entrega);
  }

  private obtenerEstadoLotePorFecha(
    fecha: Date | string,
  ): LoteEntity['estadoLote'] {
    const fechaBase = fecha instanceof Date ? fecha : new Date(fecha);

    if (Number.isNaN(fechaBase.getTime())) {
      return 'correcto';
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const caducidad = new Date(fechaBase);
    caducidad.setHours(0, 0, 0, 0);

    const diferenciaMs = caducidad.getTime() - hoy.getTime();
    const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) {
      return 'caducado';
    }

    if (diferenciaDias <= 30) {
      return 'proximo';
    }

    return 'correcto';
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

  private getDetalleEntregaLoteRepository(
    manager?: EntityManager,
  ): Repository<DetalleEntregaLoteEntity> {
    if (manager) {
      return manager.getRepository(DetalleEntregaLoteEntity);
    }

    return this.detalleEntregaLoteRepository;
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

  private getProveedorRepository(
    manager?: EntityManager,
  ): Repository<ProveedorEntity> {
    if (manager) {
      return manager.getRepository(ProveedorEntity);
    }

    return this.proveedorRepository;
  }

  private getProductoRepository(
    manager?: EntityManager,
  ): Repository<ProductoEntity> {
    if (manager) {
      return manager.getRepository(ProductoEntity);
    }

    return this.productoRepository;
  }

  private getLoteRepository(manager?: EntityManager): Repository<LoteEntity> {
    if (manager) {
      return manager.getRepository(LoteEntity);
    }

    return this.loteRepository;
  }

  private getMovimientoInventarioRepository(
    manager?: EntityManager,
  ): Repository<MovimientoInventarioEntity> {
    if (manager) {
      return manager.getRepository(MovimientoInventarioEntity);
    }

    return this.movimientoInventarioRepository;
  }
}
