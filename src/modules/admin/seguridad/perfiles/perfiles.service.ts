import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { UpdatePerfilDto } from './dto/update_perfil.dto';
import { CreatePerfilDto } from './dto/create_perfil.dto';
import { FilterPerfilDto } from './dto/filter_perfil.dto';



@Injectable()
export class PerfilesService {
  
  private fnName: string = 'perfil';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterPerfilDto){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreatePerfilDto){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdatePerfilDto){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }

  /**
   * JOINS
   */
  async listarPerfiles(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}_rol`);
  }
  async filtrarPerfiles(queryParams: FilterPerfilDto){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}_rol`, queryParams.toArray());
  }


  /**
   * COMBOS
   */
  async listarComboPerfiles() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', nombre_perf,
            'value', ide_perf
          )
          ORDER BY nombre_perf
        )
      )
      FROM perfil;
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
            'label', nombre_perf,
            'value', ide_perf
          )
          ORDER BY nombre_perf
        )
      )
      FROM perfil;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboDescripcion() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', descripcion_perf,
            'value', ide_perf
          )
          ORDER BY descripcion_perf
        )
      )
      FROM perfil;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
  
}