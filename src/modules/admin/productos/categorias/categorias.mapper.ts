import { CategoriaEntity } from '@entities';

export interface CategoriaRow {
  ide_cate: number;
  nombre_cate: string;
  descripcion_cate: string;
  usua_ingre?: string;
  fecha_ingre?: Date;
  usua_actua?: string;
  fecha_actua?: Date;
}

export class CategoriasMapper {
  static toRow(categoria: CategoriaEntity): CategoriaRow {
    return {
      ide_cate: categoria.ideCate,
      nombre_cate: categoria.nombreCate,
      descripcion_cate: categoria.descripcionCate,
      usua_ingre: categoria.usuaIngre,
      fecha_ingre: categoria.fechaIngre,
      usua_actua: categoria.usuaActua,
      fecha_actua: categoria.fechaActua,
    };
  }

  static toRows(categorias: CategoriaEntity[]): CategoriaRow[] {
    return categorias.map((categoria) => this.toRow(categoria));
  }
}
