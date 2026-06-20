import { ProveedorEntity } from '@entities';

export interface ProveedorRow {
  ide_prov: number;
  ide_empr: number;
  nombre_empr?: string | null;
  cedula_prov: string;
  fecha_nacimiento_prov: Date | string;
  edad_prov: number;
  telefono_prov: string;
  email_prov: string;
  primer_nombre_prov: string;
  apellido_paterno_prov: string;
  segundo_nombre_prov?: string | null;
  apellido_materno_prov?: string | null;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export interface ProveedorEmpresaRow {
  ide_prov: number;
  ide_empr: number;
  nombre_empr?: string | null;
  cedula_prov: string;
  nombre_completo: string;
  fecha_nacimiento_prov: string;
  edad_prov: number;
  telefono_prov: string;
  email_prov: string;
}

export class ProveedoresMapper {
  static toRow(proveedor: ProveedorEntity): ProveedorRow {
    return {
      ide_prov: proveedor.ideProv,
      ide_empr: proveedor.ideEmpr,
      nombre_empr: proveedor.empresa?.nombreEmpr ?? null,
      cedula_prov: proveedor.cedulaProv,
      fecha_nacimiento_prov: proveedor.fechaNacimientoProv,
      edad_prov: proveedor.edadProv,
      telefono_prov: proveedor.telefonoProv,
      email_prov: proveedor.emailProv,
      primer_nombre_prov: proveedor.primerNombreProv,
      apellido_paterno_prov: proveedor.apellidoPaternoProv,
      segundo_nombre_prov: proveedor.segundoNombreProv ?? null,
      apellido_materno_prov: proveedor.apellidoMaternoProv ?? null,
      usua_ingre: proveedor.usuaIngre,
      fecha_ingre: proveedor.fechaIngre,
      usua_actua: proveedor.usuaActua,
      fecha_actua: proveedor.fechaActua,
    };
  }

  static toRows(proveedores: ProveedorEntity[]): ProveedorRow[] {
    return proveedores.map((proveedor) => this.toRow(proveedor));
  }

  static toEmpresaRow(proveedor: ProveedorEntity): ProveedorEmpresaRow {
    return {
      ide_prov: proveedor.ideProv,
      ide_empr: proveedor.ideEmpr,
      nombre_empr: proveedor.empresa?.nombreEmpr ?? null,
      cedula_prov: proveedor.cedulaProv,
      nombre_completo: this.getNombreCompleto(proveedor),
      fecha_nacimiento_prov: this.formatDateTimeDDMMYYYY(
        proveedor.fechaNacimientoProv,
      ),
      edad_prov: proveedor.edadProv,
      telefono_prov: proveedor.telefonoProv,
      email_prov: proveedor.emailProv,
    };
  }

  static toEmpresaRows(proveedores: ProveedorEntity[]): ProveedorEmpresaRow[] {
    return proveedores.map((proveedor) => this.toEmpresaRow(proveedor));
  }

  static getNombreCompleto(proveedor: ProveedorEntity): string {
    return [
      proveedor.primerNombreProv,
      proveedor.segundoNombreProv,
      proveedor.apellidoPaternoProv,
      proveedor.apellidoMaternoProv,
    ]
      .filter((value) => !!value)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static formatDateTimeDDMMYYYY(value: Date | string): string {
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
