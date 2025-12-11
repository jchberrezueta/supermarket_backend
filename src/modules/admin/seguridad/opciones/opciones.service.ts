import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FiltroOpcionDto } from './dto/filter_opcion.dto';
import { CreateOpcionDto } from './dto/create_opcion.dto';
import { UpdateOpcionDto } from './dto/update_opcion.dto';

@Injectable()
export class OpcionesService {
  
  private fnName: string = 'opciones';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FiltroOpcionDto){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateOpcionDto){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateOpcionDto){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
  
}