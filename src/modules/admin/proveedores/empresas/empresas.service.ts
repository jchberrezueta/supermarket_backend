import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';
import { ListEstadosEmpresa } from '@models';
import { CreateEmpresaPrecioDTO } from './dto/create_precio.dto';
import { UpdateEmpresaPrecioDTO } from './dto/update_precio.dto';

@Injectable()
export class EmpresasService {
  
  private fnName: string = 'empresa';
  private fnName2: string = 'empresa_precios';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async listarEstados(){
    return ListEstadosEmpresa;
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterEmpresaDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateEmpresaDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateEmpresaDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }



  async listarPrecios(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName2}`);
  }

  async insertarPrecio(body: CreateEmpresaPrecioDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName2}`, body.toArray());
  }

  async actualizarPrecio(body: UpdateEmpresaPrecioDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName2}`, body.toArray());
  }

  async listarPreciosProductosEmpresa(id: number) {
    const query = 
    `
      SELECT json_build_object(
        'data', json_agg(
          json_build_object(
            'ide_empr_prod', ep.ide_empr_prod,
            'ide_empr', ep.ide_empr,
            'ide_prod', ep.ide_prod,
            'precio_compra_prod', ep.precio_compra_prod,
            'dcto_compra_prod', ep.dcto_compra_prod,
            'dcto_caducidad_prod', ep.dcto_caducidad_prod,
            'iva_prod', ep.iva_prod,
            'nombre_prod', p.nombre_prod
          )
        ),
        'response', '{"success": true, "message": "Listado de precios por empresa obtenido"}'
      )
      FROM empresa_precios ep
      JOIN producto p ON p.ide_prod = ep.ide_prod
      WHERE ep.ide_empr = ${id};
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object;
  }
  
}