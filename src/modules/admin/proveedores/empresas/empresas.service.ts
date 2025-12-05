import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';

@Injectable()
export class EmpresasService {
  
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead('fn_listar_empresa');
  }

  async buscar(id:number){
    return this.db.executeFunctionRead('fn_buscar_empresa');
  }

  async filtrar(queryParams: FilterEmpresaDTO){
    return this.db.executeFunctionRead('fn_filtrar_empresa', queryParams.toArray());
  }

  async insertar(body:CreateEmpresaDTO){
    return this.db.executeFunctionWrite('fn_insertar_empresa', body.toArray());
  }

  async actualizar(id: number, body:UpdateEmpresaDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite('fn_actualizar_empresa', data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite('fn_eliminar_empresa', [id]);
  }
  
}