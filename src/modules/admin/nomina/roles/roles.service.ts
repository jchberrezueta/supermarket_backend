import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterRolDTO } from './dto/filter_rol.dto';
import { CreateRolDTO } from './dto/create_rol.dto';
import { UpdateRolDTO } from './dto/update_rol.dto';


@Injectable()
export class RolesService {
  
  private fnName: string = 'empleado';
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

  async actualizar(id: number, body:UpdateRolDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
  
}