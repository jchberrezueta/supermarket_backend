import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterOpcionDto } from './dto/filter_opcion.dto';
import { CreateOpcionDto } from './dto/create_opcion.dto';
import { UpdateOpcionDto } from './dto/update_opcion.dto';

@Injectable()
export class OpcionesService {
  
  private fnName: string = 'opciones';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterOpcionDto){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }

  async insertar(body:CreateOpcionDto){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateOpcionDto){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }


  /**
   * COMBOS
   */
  async listarComboNombres() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', nombre_opci,
            'value', ide_opci
          )
          ORDER BY nombre_opci
        )
      )
      FROM opciones;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboRutas() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', ruta_opci,
            'value', ide_opci
          )
          ORDER BY ruta_opci
        )
      )
      FROM opciones;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboEstados() {
    const query = `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object('label', estado, 'value', estado)
        )
      )
      FROM (
        VALUES
          ('si'),
          ('no')
      ) AS estados(estado);
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
  
}