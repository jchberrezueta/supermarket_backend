import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { CreateProveedorDTO } from './dto/create_proveedor.dto';
import { UpdateProveedorDTO } from './dto/update_proveedor.dto';
import { FilterProveedorDTO } from './dto/filter_proveedor.dto';

@Injectable()
export class ProveedoresService {
  
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead('fn_listar_proveedor');
  }

  async buscar(id:number){
    return this.db.executeFunctionRead('fn_buscar_proveedor', [id]);
  }

  async filtrar(queryParams: FilterProveedorDTO){
    return this.db.executeFunctionRead('fn_filtrar_proveedor', queryParams.toArray());
  }

  async insertar(body:CreateProveedorDTO){
    return this.db.executeFunctionWrite('fn_insertar_proveedor', body.toArray());
  }

  async actualizar(id: number, body:UpdateProveedorDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite('fn_actualizar_proveedor', data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite('fn_eliminar_proveedor', [id]);
  }
  
}