import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterClienteDTO } from './dto/filter_cliente.dto';
import { CreateClienteDTO } from './dto/create_cliente.dto';
import { UpdateClienteDTO } from './dto/update_cliente.dto';


@Injectable()
export class ClientesService {
  
  private fnName: string = 'cliente';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterClienteDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateClienteDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateClienteDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
  
}