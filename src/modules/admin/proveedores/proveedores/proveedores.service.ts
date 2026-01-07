import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { CreateProveedorDTO } from './dto/create_proveedor.dto';
import { UpdateProveedorDTO } from './dto/update_proveedor.dto';
import { FilterProveedorDTO } from './dto/filter_proveedor.dto';

@Injectable()
export class ProveedoresService {
  
  private fnName: string = 'proveedor';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterProveedorDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateProveedorDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateProveedorDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }

  async listarProveedores(){
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data', json_agg(
          json_build_object(
            'ide_prov', p.ide_prov,
            'ide_empr', p.ide_empr,
            'nombre_empr', e.nombre_empr,
            'cedula_prov', p.cedula_prov,
            'nombre_completo',
              trim(
                p.primer_nombre_prov || ' ' ||
                coalesce(p.segundo_nombre_prov, '') || ' ' ||
                p.apellido_paterno_prov || ' ' ||
                coalesce(p.apellido_materno_prov, '')
              ),
            'fecha_nacimiento_prov',
              TO_CHAR(
                p.fecha_nacimiento_prov::timestamp AT TIME ZONE 'America/Guayaquil',
                'DD/MM/YYYY HH24:MI'
              ),
            'edad_prov', p.edad_prov,
            'telefono_prov', p.telefono_prov,
            'email_prov', p.email_prov
          )
        )
      )
      FROM proveedor p
      JOIN empresa e
        ON e.ide_empr = p.ide_empr;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object;
  }

  async filtrarProveedores(queryParams: FilterProveedorDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}_empresa`, queryParams.toArray());
  }

  async listarComboProveedorCedula() {
    const query = 
    `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', cedula_prov,
            'value', ide_prov
          )
          ORDER BY cedula_prov
        )
      )
      FROM proveedor;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboProveedorPrimerNombre() {
    const query = 
    `
     SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', primer_nombre_prov,
            'value', ide_prov
          )
          ORDER BY primer_nombre_prov
        )
      )
      FROM proveedor;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboProveedorApellidoPaterno() {
    const query = 
    `
     SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', apellido_paterno_prov,
            'value', ide_prov
          )
          ORDER BY apellido_paterno_prov
        )
      )
      FROM proveedor;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboProveedorEmail() {
    const query = 
    `
     SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', email_prov,
            'value', ide_prov
          )
          ORDER BY email_prov
        )
      )
      FROM proveedor;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
  
}