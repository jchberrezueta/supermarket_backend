import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterEmpleadoDTO } from './dto/filter_empleado.dto';
import { CreateEmpleadoDTO } from './dto/create_empleado.dto';
import { UpdateEmpleadoDTO } from './dto/update_empleado.dto';

@Injectable()
export class EmpleadosService {
  
  private fnName: string = 'empleado';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterEmpleadoDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateEmpleadoDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateEmpleadoDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }

  /**
   * JOINS
   */
  async listarEmpleados(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}_rol`);
  }
  async filtrarEmpleados(queryParams: FilterEmpleadoDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}_rol`, queryParams.toArray());
  }

  /**
   * COMBOS
   */
  async listarComboEmpleados() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label',
              trim(
                e.primer_nombre_empl || ' ' ||
                coalesce(e.segundo_nombre_empl, '') || ' ' ||
                e.apellido_paterno_empl || ' ' ||
                coalesce(e.apellido_materno_empl, '')
              ),
            'value', e.ide_empl
          )
          ORDER BY e.apellido_paterno_empl, e.primer_nombre_empl
        )
      )
      FROM empleado e;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
  async listarComboCedulas() {
    const query = 
    `
      SELECT json_build_object(
        'data',
        json_agg(
          json_build_object(
            'label', cedula_empl,
            'value', cedula_empl
          )
          ORDER BY cedula_empl
        )
      )
      FROM (
        SELECT DISTINCT cedula_empl
        FROM empleado
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboPrimerNombre() {
    const query = 
    `
      SELECT json_build_object(
        'data',
        json_agg(
          json_build_object(
            'label', primer_nombre_empl,
            'value', primer_nombre_empl
          )
          ORDER BY primer_nombre_empl
        )
      )
      FROM (
        SELECT DISTINCT primer_nombre_empl
        FROM empleado
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboApellidoPaterno() {
    const query = 
    `
      SELECT json_build_object(
        'data',
        json_agg(
          json_build_object(
            'label', apellido_paterno_empl,
            'value', apellido_paterno_empl
          )
          ORDER BY apellido_paterno_empl
        )
      )
      FROM (
        SELECT DISTINCT apellido_paterno_empl
        FROM empleado
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboTitulos() {
    const query = 
    `
      SELECT json_build_object(
        'data',
        json_agg(
          json_build_object(
            'label', titulo_empl,
            'value', titulo_empl
          )
          ORDER BY titulo_empl
        )
      )
      FROM (
        SELECT DISTINCT titulo_empl
        FROM empleado
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboEstados() {
    const query = 
    `
     SELECT json_build_object(
        'data',
        json_agg(
          json_build_object('label', estado, 'value', estado)
        )
      )
      FROM (
        SELECT 'activo'   AS estado
        UNION ALL
        SELECT 'inactivo' AS estado
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
  
  
}