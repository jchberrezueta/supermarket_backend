import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterRolDTO } from './dto/filter_rol.dto';
import { CreateRolDTO } from './dto/create_rol.dto';
import { UpdateRolDTO } from './dto/update_rol.dto';


@Injectable()
export class RolesService {
  
  private fnName: string = 'rol';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterRolDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateRolDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateRolDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }

  /**
   * COMBOS
   */
  async listarComboRoles() {
    const query = 
    `
      SELECT json_build_object(
        'data',
        json_agg(
          json_build_object(
            'label', nombre_rol,
            'value', ide_rol
          )
          ORDER BY nombre_rol
        )
      )
      FROM rol;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboNombres() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', nombre_rol,
            'value', ide_rol
          )
          ORDER BY nombre_rol
        )
      )
      FROM rol;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboDescripciones() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', descripcion_rol,
            'value', descripcion_rol
          )
          ORDER BY descripcion_rol
        )
      )
      FROM (
        SELECT DISTINCT descripcion_rol
        FROM rol
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
  
}