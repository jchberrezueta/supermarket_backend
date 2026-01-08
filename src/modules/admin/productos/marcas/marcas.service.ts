import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterMarcaDTO } from './dto/filter_marca.dto';
import { CreateMarcaDTO } from './dto/create_marca.dto';
import { UpdateMarcaDTO } from './dto/update_marca.dto';



@Injectable()
export class MarcasService {
  
  private fnName: string = 'marca';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterMarcaDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateMarcaDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateMarcaDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }


  /**
   * COMBOS
   */

  async listarComboNombre(){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', nombre_marc,
              'value', ide_marc
            )
            ORDER BY nombre_marc
          )
        )
        FROM marca;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

    async listarComboPais(){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', pais_origen_marc,
              'value', pais_origen_marc
            )
            ORDER BY pais_origen_marc
          )
        )
        FROM (
          SELECT DISTINCT pais_origen_marc
          FROM marca
        ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboCalidad(){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', v,
              'value', v
            )
            ORDER BY v
          )
        )
        FROM generate_series(1, 10) AS v;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboMarcas(){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', nombre_marc,
              'value', ide_marc
            )
            ORDER BY nombre_marc
          )
        )
        FROM marca;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
  
}