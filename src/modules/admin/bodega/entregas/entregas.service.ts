import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { FilterEntregaDTO } from './dto/filter_entrega.dto';
import { CreateEntregaDTO } from './dto/create_entrega.dto';
import { UpdateEntregaDTO } from './dto/update_entrega.dto';

@Injectable()
export class EntregasService {
  private fnName: string = 'entrega';
  private fnName2: string = 'detalle_entrega';

  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_insertar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`);
  }

  async filtrar(queryParams: FilterEntregaDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body: CreateEntregaDTO){
    const result = await this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.cabeceraEntrega.toArray());
    body.detalleEntrega.forEach( obj => {
      const data = obj.toArray(); data.unshift(result.p_id);
      this.db.executeFunctionWrite(`fn_insertar_${this.fnName2}`, data);
    });
    return result;
  }

  async actualizar(id: number, body: UpdateEntregaDTO){
    const data = body.cabeceraEntrega.toArray(); data.unshift(id);
    const result = await this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, data);
    body.detalleEntrega.forEach( obj => {
      this.db.executeFunctionWrite(`fn_actualizar_${this.fnName2}`, obj.toArray());
    });
    return result;
  }

  async eliminar(id: number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
}