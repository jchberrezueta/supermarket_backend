import { ClienteEntity } from '@entities';

export interface ClienteRow {
  ide_clie: number;
  cedula_clie: string;
  fecha_nacimiento_clie: Date | string;
  edad_clie: number;
  telefono_clie: string;
  primer_nombre_clie: string;
  apellido_paterno_clie: string;
  email_clie: string;
  es_socio: string;
  es_tercera_edad: string;
  segundo_nombre_clie?: string | null;
  apellido_materno_clie?: string | null;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export interface ClienteCuentaRow {
  ide_clie: number;
  usuario_clie?: string | null;
  cedula_clie: string;
  nombre_completo: string;
  fecha_nacimiento_clie: string;
  edad_clie: number;
  telefono_clie: string;
  email_clie: string;
  es_socio: string;
  es_tercera_edad: string;
}

export class ClientesMapper {
  static toRow(cliente: ClienteEntity): ClienteRow {
    return {
      ide_clie: cliente.ideClie,
      cedula_clie: cliente.cedulaClie,
      fecha_nacimiento_clie: cliente.fechaNacimientoClie,
      edad_clie: cliente.edadClie,
      telefono_clie: cliente.telefonoClie,
      primer_nombre_clie: cliente.primerNombreClie,
      apellido_paterno_clie: cliente.apellidoPaternoClie,
      email_clie: cliente.emailClie,
      es_socio: cliente.esSocio,
      es_tercera_edad: cliente.esTerceraEdad,
      segundo_nombre_clie: cliente.segundoNombreClie ?? null,
      apellido_materno_clie: cliente.apellidoMaternoClie ?? null,
      usua_ingre: cliente.usuaIngre,
      fecha_ingre: cliente.fechaIngre,
      usua_actua: cliente.usuaActua,
      fecha_actua: cliente.fechaActua,
    };
  }

  static toRows(clientes: ClienteEntity[]): ClienteRow[] {
    return clientes.map((cliente) => this.toRow(cliente));
  }

  static toCuentaRow(cliente: ClienteEntity): ClienteCuentaRow {
    const cuentaCliente = cliente.cuentasCliente?.[0];

    return {
      ide_clie: cliente.ideClie,
      usuario_clie: cuentaCliente?.usuarioClie ?? null,
      cedula_clie: cliente.cedulaClie,
      nombre_completo: this.getNombreCompleto(cliente),
      fecha_nacimiento_clie: this.formatDateDDMMYYYY(
        cliente.fechaNacimientoClie,
      ),
      edad_clie: cliente.edadClie,
      telefono_clie: cliente.telefonoClie,
      email_clie: cliente.emailClie,
      es_socio: cliente.esSocio,
      es_tercera_edad: cliente.esTerceraEdad,
    };
  }

  static toCuentaRows(clientes: ClienteEntity[]): ClienteCuentaRow[] {
    return clientes.map((cliente) => this.toCuentaRow(cliente));
  }

  static getNombreCompleto(cliente: ClienteEntity): string {
    return [
      cliente.primerNombreClie,
      cliente.segundoNombreClie,
      cliente.apellidoPaternoClie,
      cliente.apellidoMaternoClie,
    ]
      .filter((value) => !!value)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static formatDateDDMMYYYY(value: Date | string): string {
    if (!value) {
      return '';
    }

    const dateText =
      value instanceof Date ? value.toISOString().slice(0, 10) : String(value);

    const [year, month, day] = dateText.slice(0, 10).split('-');

    if (!year || !month || !day) {
      return dateText;
    }

    return `${day}/${month}/${year}`;
  }
}
