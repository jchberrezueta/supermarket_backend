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
  
}