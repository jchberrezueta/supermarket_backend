import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductoEntity } from '@entities';

export interface PosAlertaStock {
  ideProd: number;
  nombreProd: string;
  stockActual: number;
  mensaje: string;
}

@Injectable()
export class StockPolicyService {
  validarStockDisponible(producto: ProductoEntity, cantidad: number): void {
    if (producto.stockProd < cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para ${producto.nombreProd}. Disponible: ${producto.stockProd}`,
      );
    }
  }

  descontarStock(
    producto: ProductoEntity,
    cantidad: number,
    usuario = 'pos',
  ): ProductoEntity {
    producto.stockProd -= cantidad;
    producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
    producto.usuaActua = usuario;
    producto.fechaActua = new Date();

    return producto;
  }

  revertirStock(
    producto: ProductoEntity,
    cantidad: number,
    usuario = 'pos',
  ): ProductoEntity {
    producto.stockProd += cantidad;
    producto.disponibleProd = producto.stockProd > 0 ? 'si' : 'no';
    producto.usuaActua = usuario;
    producto.fechaActua = new Date();

    return producto;
  }

  crearAlertaSiStockBajo(producto: ProductoEntity): PosAlertaStock | null {
    const stockMinimo = Math.max(0, Number(producto.stockMinimoProd ?? 0));

    if (producto.stockProd > stockMinimo) {
      return null;
    }

    return {
      ideProd: producto.ideProd,
      nombreProd: producto.nombreProd,
      stockActual: producto.stockProd,
      mensaje: `Stock bajo para ${producto.nombreProd}. Mínimo: ${stockMinimo}.`,
    };
  }
}
