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

  async actualizar(id: number, body:UpdateProveedorDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
  
}