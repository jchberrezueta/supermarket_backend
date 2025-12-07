import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterEmpleadoDTO } from './dto/filter_empleado.dto';
import { CreateEmpleadoDTO } from './dto/create_empleado.dto';
import { UpdateEmpleadoDTO } from './dto/update_empleado.dto';


@Injectable()
export class EmpleadosService {
  
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead('fn_listar_Empleado');
  }

  async buscar(id:number){
    return this.db.executeFunctionRead('fn_buscar_Empleado');
  }

  async filtrar(queryParams: FilterEmpleadoDTO){
    return this.db.executeFunctionRead('fn_filtrar_Empleado', queryParams.toArray());
  }

  async insertar(body:CreateEmpleadoDTO){
    return this.db.executeFunctionWrite('fn_insertar_Empleado', body.toArray());
  }

  async actualizar(id: number, body:UpdateEmpleadoDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite('fn_actualizar_Empleado', data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite('fn_eliminar_Empleado', [id]);
  }
  
}