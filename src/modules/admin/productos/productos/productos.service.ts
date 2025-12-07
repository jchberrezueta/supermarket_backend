import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';

@Injectable()
export class CategoriasService {
  
  private fnName: string = 'producto';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterCategoriaDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateCategoriaDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(id: number, body:UpdateCategoriaDTO){
    const data = body.toArray(); data.unshift(id);
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, data);
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
  
}