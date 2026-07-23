import { MoneyUtil } from '@common/utils/money.util';
import { EmpresaEntity, EmpresaPreciosEntity } from '@entities';

export interface EmpresaRow {
  ide_empr: number;
  nombre_empr: string;
  responsable_empr: string;
  fecha_contrato_empr: string;
  direccion_empr: string;
  telefono_empr: string;
  email_empr: string;
  estado_empr: string;
  descripcion_empr: string;
}

export interface EmpresaPrecioRow {
  ide_empr_prod: number;
  ide_empr: number;
  nombre_empr?: string | null;
  ide_prod: number;
  nombre_prod?: string | null;
  estado_prod?: string | null;
  precio_compra_prod: number;
  dcto_compra_prod: number;
  dcto_caducidad_prod: number;
  iva_prod: number;
}

export class EmpresasMapper {
  static toRow(empresa: EmpresaEntity): EmpresaRow {
    return {
      ide_empr: empresa.ideEmpr,
      nombre_empr: empresa.nombreEmpr,
      responsable_empr: empresa.responsableEmpr,
      fecha_contrato_empr: this.formatDateTimeText(empresa.fechaContratoEmpr),
      direccion_empr: empresa.direccionEmpr,
      telefono_empr: empresa.telefonoEmpr,
      email_empr: empresa.emailEmpr,
      estado_empr: empresa.estadoEmpr,
      descripcion_empr: empresa.descripcionEmpr,
    };
  }

  static toRows(empresas: EmpresaEntity[]): EmpresaRow[] {
    return empresas.map((empresa) => this.toRow(empresa));
  }

  static toPrecioRow(precio: EmpresaPreciosEntity): EmpresaPrecioRow {
    return {
      ide_empr_prod: precio.ideEmprProd,
      ide_empr: precio.ideEmpr,
      nombre_empr: precio.empresa?.nombreEmpr ?? null,
      ide_prod: precio.ideProd,
      nombre_prod: precio.producto?.nombreProd ?? null,
      estado_prod: precio.producto?.estadoProd ?? null,
      precio_compra_prod: MoneyUtil.toNumber(precio.precioCompraProd),
      dcto_compra_prod: MoneyUtil.toNumber(precio.dctoCompraProd),
      dcto_caducidad_prod: MoneyUtil.toNumber(precio.dctoCaducidadProd),
      iva_prod: MoneyUtil.toNumber(precio.ivaProd),
    };
  }

  static toPrecioRows(precios: EmpresaPreciosEntity[]): EmpresaPrecioRow[] {
    return precios.map((precio) => this.toPrecioRow(precio));
  }

  private static formatDateTimeText(value: Date | string): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
}
