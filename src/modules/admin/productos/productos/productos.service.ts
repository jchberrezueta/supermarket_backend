import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { CreateProductoDTO } from './dto/create_producto.dto';
import { UpdateProductoDTO } from './dto/update_producto.dto';
import { FilterProductoDTO } from './dto/filter_producto.dto';

@Injectable()
export class ProductosService {
  
  private fnName: string = 'producto';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterProductoDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateProductoDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateProductoDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }

  /**
   * JOINS
   */
  async listarProductos(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}_categoria_marca`);
  }
  

  /**
   * COMBOS
   */
  async listarComboProductos() {
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', nombre_prod,
              'value', ide_prod
            )
            ORDER BY nombre_prod
          )
        )
        FROM producto;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboCodigosBarras() {
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', codigo_barra_prod,
              'value', codigo_barra_prod
            )
            ORDER BY codigo_barra_prod
          )
        )
        FROM (
          SELECT DISTINCT codigo_barra_prod
          FROM producto
        ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboEstados() {
    const query = 
      `
        SELECT json_build_object(
          'data', json_agg(
            json_build_object(
              'label', estado,
              'value', estado
            )
          )
        )
        FROM (
          SELECT 'activo' AS estado
          UNION ALL
          SELECT 'inactivo'
        ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }


  async listarComboDisponibilidad() {
    const query = 
      `
        SELECT json_build_object(
          'data', json_agg(
            json_build_object(
              'label', disponible,
              'value', disponible
            )
          )
        )
        FROM (
          SELECT 'si' AS disponible
          UNION ALL
          SELECT 'no'
        ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

}