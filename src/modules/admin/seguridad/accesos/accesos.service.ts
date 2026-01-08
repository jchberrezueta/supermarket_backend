import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { FilterAccesoUsuarioDto, FilterAccesoUsuarioDtoToArray } from './dto/filter_acceso.dto';
import { CreateAccesoUsuarioToArray, CreateAccesoUsuarioDto } from './dto/create_acceso.dto';
import { toArray } from 'rxjs';

@Injectable()
export class AccesosUsuariosService {

  private fnName: string = 'acceso_usuario'
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id: number) {
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id])
  }

  async filtrar(queryParams: FilterAccesoUsuarioDto) {
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, FilterAccesoUsuarioDtoToArray(queryParams));
  }

  async insertarAccesoUsuario(data: CreateAccesoUsuarioDto) {
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, CreateAccesoUsuarioToArray(data));
  }


  /**
   * JOINS
   */
  async listarAccesos(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}_cuenta`);
  }
  async filtrarAccesos(queryParams: FilterAccesoUsuarioDto){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  /**
   * COMBOS
   */
  async listarComboIps() {
    const query = `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', ip_acce,
            'value', ip_acce
          )
          ORDER BY ip_acce
        )
      )
      FROM (
        SELECT DISTINCT ip_acce
        FROM acceso_usuario
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboNavegador() {
    const query = `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', navegador_acce,
            'value', navegador_acce
          )
          ORDER BY navegador_acce
        )
      )
      FROM (
        SELECT DISTINCT navegador_acce
        FROM acceso_usuario
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

}