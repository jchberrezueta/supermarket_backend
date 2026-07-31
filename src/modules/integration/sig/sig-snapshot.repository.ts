import { Injectable } from '@nestjs/common';

import {
  CategoriaEntity,
  ClienteEntity,
  DetalleVentaEntity,
  EmpresaEntity,
  EntregaEntity,
  LoteEntity,
  MovimientoInventarioEntity,
  PedidoEntity,
  ProductoEntity,
  ProveedorEntity,
  VentaEntity,
} from '@entities';

import { EntityManager } from 'typeorm';

export interface SigSnapshotSourceData {
  categories: CategoriaEntity[];
  companies: EmpresaEntity[];
  suppliers: ProveedorEntity[];
  products: ProductoEntity[];
  customers: ClienteEntity[];

  sales: VentaEntity[];
  saleDetails: DetalleVentaEntity[];

  orders: PedidoEntity[];
  deliveries: EntregaEntity[];

  lots: LoteEntity[];
  movements: MovimientoInventarioEntity[];
}

@Injectable()
export class SigSnapshotRepository {
  async load(manager: EntityManager): Promise<SigSnapshotSourceData> {
    const categories = await manager.getRepository(CategoriaEntity).find({
      order: {
        ideCate: 'ASC',
      },
    });

    const companies = await manager.getRepository(EmpresaEntity).find({
      order: {
        ideEmpr: 'ASC',
      },
    });

    const suppliers = await manager.getRepository(ProveedorEntity).find({
      order: {
        ideProv: 'ASC',
      },
    });

    const products = await manager.getRepository(ProductoEntity).find({
      order: {
        ideProd: 'ASC',
      },
    });

    const customers = await manager.getRepository(ClienteEntity).find({
      order: {
        ideClie: 'ASC',
      },
    });

    const sales = await manager.getRepository(VentaEntity).find({
      order: {
        ideVent: 'ASC',
      },
    });

    const saleDetails = await manager.getRepository(DetalleVentaEntity).find({
      order: {
        ideDetaVent: 'ASC',
      },
    });

    const orders = await manager.getRepository(PedidoEntity).find({
      order: {
        idePedi: 'ASC',
      },
    });

    const deliveries = await manager.getRepository(EntregaEntity).find({
      order: {
        ideEntr: 'ASC',
      },
    });

    const lots = await manager.getRepository(LoteEntity).find({
      order: {
        ideLote: 'ASC',
      },
    });

    const movements = await manager
      .getRepository(MovimientoInventarioEntity)
      .find({
        relations: {
          detalleVenta: {
            venta: true,
          },

          detalleEntrega: {
            entrega: true,
          },
        },

        order: {
          ideMovi: 'ASC',
        },
      });

    return {
      categories,
      companies,
      suppliers,
      products,
      customers,
      sales,
      saleDetails,
      orders,
      deliveries,
      lots,
      movements,
    };
  }
}
