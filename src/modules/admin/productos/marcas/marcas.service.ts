import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterMarcaDTO } from './dto/filter_marca.dto';
import { CreateMarcaDTO } from './dto/create_marca.dto';
import { UpdateMarcaDTO } from './dto/update_marca.dto';



@Injectable()
export class MarcasService {
  
  private fnName: string = 'marcas';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterMarcaDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateMarcaDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(id: number, body:UpdateMarcaDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
  
}