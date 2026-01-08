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
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
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

  async actualizar(body: UpdatePedidoDTO){
    const result = await this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.cabeceraPedido.toArray());
    body.detallePedido.forEach( obj => {
      this.db.executeFunctionWrite(`fn_actualizar_${this.fnName2}`, obj.toArray());
    });
    return result;
  }

  async eliminar(id: number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }


  /**
   * JOINS
   */
  async listarPedidos(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}_empresa`);
  }
  async filtrarPedidos(queryParams: FilterPedidoDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}_empresa`, queryParams.toArray());
  }

  /**
   * COMBOS
   */
  async listarComboEstados() {
    const query = 
    `
      SELECT json_build_object(
        'data', json_agg(
          json_build_object(
            'label', estado,
            'value', estado
          )
        )
      )
      FROM (
        SELECT 'progreso'   AS estado
        UNION ALL
        SELECT 'completado'
        UNION ALL
        SELECT 'incompleto'
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboMotivos() {
    const query = 
    `
      SELECT json_build_object(
        'data', json_agg(
          json_build_object(
            'label', motivo,
            'value', motivo
          )
        )
      )
      FROM (
        SELECT 'peticion'   AS motivo
        UNION ALL
        SELECT 'devolucion'
      ) t;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
}