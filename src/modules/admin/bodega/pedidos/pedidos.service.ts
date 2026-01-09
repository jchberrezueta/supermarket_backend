import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { FilterPedidoDTO } from './dto/filter_pedido.dto';
import { CreatePedidoDTO } from './dto/create_pedido.dto';
import { UpdatePedidoDTO } from './dto/update_pedido.dto';
import { CreatePedidoDetalleDTO } from './dto/create_pedido_detalle.dto';

@Injectable()
export class PedidosService {
  private fnName: string = 'pedido';
  private fnName2: string = 'detalle_pedido';

  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}_empresa`);
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
    const idPedi = body.cabeceraPedido.idePedi;
    // Actualizar cabecera
    const result = await this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.cabeceraPedido.toArray());
    // Eliminar detalles anteriores
    await this.db.executeQuery(`DELETE FROM detalle_pedido WHERE ide_pedi = $1`, [idPedi]);
    // Insertar nuevos detalles
    for (const obj of body.detallePedido) {
      const detalle = new CreatePedidoDetalleDTO();
      Object.assign(detalle, obj);
      const data = detalle.toArray();
      data.unshift(idPedi);
      await this.db.executeFunctionWrite(`fn_insertar_${this.fnName2}`, data);
    }
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

  async listarDetallesPedido(idPedido: number){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName2}`, [idPedido, null]);
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

  async listarComboPedidos() {
    const query = 
    `
      SELECT json_build_object(
        'data', COALESCE(json_agg(
          json_build_object(
            'label', CONCAT('Pedido #', p.ide_pedi, ' - ', e.nombre_empr),
            'value', p.ide_pedi
          ) ORDER BY p.ide_pedi DESC
        ), '[]'::json)
      )
      FROM pedido p
      INNER JOIN empresa e ON p.ide_empr = e.ide_empr;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
}