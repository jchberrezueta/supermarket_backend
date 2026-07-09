import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiResponseFactory, IdUtil } from '@common/index';
import { CategoriaEntity } from '@entities';
import { DataSource } from 'typeorm';

@Injectable()
export class MobileCategoriasService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Listar todas las categorías para la tienda móvil.
   *
   * Antes dependía de:
   * - fn_listar_categoria
   *
   * Ahora usa TypeORM directamente para evitar dependencia
   * de funciones PostgreSQL.
   */
  async listar() {
    const categorias = await this.dataSource.transaction((manager) =>
      manager.getRepository(CategoriaEntity).find({
        order: {
          nombreCate: 'ASC',
        },
      }),
    );

    return ApiResponseFactory.legacyRead(
      categorias.map((categoria) => ({
        ide_cate: categoria.ideCate,
        nombre_cate: categoria.nombreCate,
        descripcion_cate: categoria.descripcionCate,
        usua_ingre: categoria.usuaIngre,
        fecha_ingre: categoria.fechaIngre,
        usua_actua: categoria.usuaActua,
        fecha_actua: categoria.fechaActua,
      })),
      'Listado de categorías obtenido',
    );
  }

  /**
   * Buscar una categoría por ID.
   *
   * Se permite id = 0 si existe en la base.
   */
  async buscar(id: number) {
    const ideCate = IdUtil.requireId(id, 'El ID de la categoría no es válido.');

    const categoria = await this.dataSource.transaction((manager) =>
      manager.getRepository(CategoriaEntity).findOne({
        where: {
          ideCate,
        },
      }),
    );

    return ApiResponseFactory.legacyRead(
      categoria
        ? [
            {
              ide_cate: categoria.ideCate,
              nombre_cate: categoria.nombreCate,
              descripcion_cate: categoria.descripcionCate,
              usua_ingre: categoria.usuaIngre,
              fecha_ingre: categoria.fechaIngre,
              usua_actua: categoria.usuaActua,
              fecha_actua: categoria.fechaActua,
            },
          ]
        : [],
      'Categoría encontrada',
    );
  }
}
