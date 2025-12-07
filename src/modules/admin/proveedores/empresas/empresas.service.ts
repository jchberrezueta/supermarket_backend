import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';
import { UpdateEmpresaDTO } from './dto/update_empresa.dto';
import { FilterEmpresaDTO } from './dto/filter_empresa.dto';

@Injectable()
export class EmpresasService {
  
  private fnName: string = 'empresa';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
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

  async actualizar(id: number, body:UpdateEmpresaDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
  
}