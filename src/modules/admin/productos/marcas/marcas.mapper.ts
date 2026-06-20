import { MarcaEntity } from '@entities';

export interface MarcaRow {
  ide_marc: number;
  nombre_marc: string;
  pais_origen_marc: string;
  calidad_marc: number;
  descripcion_marc: string;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export class MarcasMapper {
  static toRow(marca: MarcaEntity): MarcaRow {
    return {
      ide_marc: marca.ideMarc,
      nombre_marc: marca.nombreMarc,
      pais_origen_marc: marca.paisOrigenMarc,
      calidad_marc: marca.calidadMarc,
      descripcion_marc: marca.descripcionMarc,
      usua_ingre: marca.usuaIngre,
      fecha_ingre: marca.fechaIngre,
      usua_actua: marca.usuaActua,
      fecha_actua: marca.fechaActua,
    };
  }

  static toRows(marcas: MarcaEntity[]): MarcaRow[] {
    return marcas.map((marca) => this.toRow(marca));
  }
}
