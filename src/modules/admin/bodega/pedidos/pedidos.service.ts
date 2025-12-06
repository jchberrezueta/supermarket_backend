import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { CreatePedidoDTO } from './dto/create_pedido.dto';
import { UpdatePedidoDTO } from './dto/update_pedido.dto';

@Injectable()
export class PedidosService {
  private fnName: string = 'pedido';
  private fnName2: string = 'detalle_pedido';

  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_insertar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`);
  }

  async filtrar(queryParams: FilterPedidoDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body: CreatePedidoDTO){
    const result = await this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.cabeceraPedido.toArray());
    body.detallePedido.forEach( obj => {
      const data = obj.toArray(); data.unshift(result.p_id);
      this.db.executeFunctionWrite(`fn_insertar_${this.fnName2}`, data);
    });
    return result;
  }

  async actualizar(id: number, body: UpdatePedidoDTO){
    const data = body.cabeceraPedido.toArray(); data.unshift(id);
    const ids = await this.db.executeQuery(`
        SELECT ide_deta_pedi 
        FROM DETALLE_PEDIDO 
        WHERE ide_pedi = ${id}
        ORDER BY ide_deta_pedi
      `);
    const result = await this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, data);
    body.detallePedido.forEach( obj => {
      const data = obj.toArray(); data.unshift(id);
      this.db.executeFunctionWrite(`fn_actualizar_${this.fnName2}`, data);
    });
    return result;
  }

  async eliminar(id: number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
}