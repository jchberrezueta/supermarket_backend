import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { FilterLoteDTO } from './dto/filter_lote.dto';
import { CreateLoteDTO } from './dto/create_lote.dto';
import { UpdateLoteDTO } from './dto/update_lote.dto';



@Injectable()
export class LotesService {
  
  private fnName: string = 'lote';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async listarLotes(){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'ide_lote', l.ide_lote,
              'ide_prod', l.ide_prod,
              'nombre_prod', p.nombre_prod,
              'fecha_caducidad_lote', l.fecha_caducidad_lote,
              'stock_lote', l.stock_lote,
              'estado_lote', l.estado_lote
            )
            ORDER BY l.fecha_caducidad_lote
          )
        )
        FROM lote l
        INNER JOIN producto p ON l.ide_prod = p.ide_prod;
      `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object;
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterLoteDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async filtrarLotes(queryParams: FilterLoteDTO){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'ide_lote', l.ide_lote,
              'ide_prod', l.ide_prod,
              'nombre_prod', p.nombre_prod,
              'fecha_caducidad_lote', l.fecha_caducidad_lote,
              'stock_lote', l.stock_lote,
              'estado_lote', l.estado_lote
            )
            ORDER BY l.fecha_caducidad_lote
          )
        )
        FROM lote l
        INNER JOIN producto p ON l.ide_prod = p.ide_prod
        WHERE ($1 IS NULL OR l.ide_prod = $1)
        AND ($2 IS NULL OR l.estado_lote = $2)
        AND ($3 IS NULL OR l.fecha_caducidad_lote >= $3)
        AND ($4 IS NULL OR l.fecha_caducidad_lote <= $4);
      `;
    const result = await this.db.executeQuery(query, queryParams.toArray());
    return result[0].json_build_object;
  }

  async insertar(body:CreateLoteDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateLoteDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }


  /**
   * COMBOS
   */

  async listarComboProductos(){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', nombre_prod,
              'value', ide_prod
            )
            ORDER BY nombre_prod
          )
        )
        FROM producto;
      `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboEstados(){
    const query = 
      `
        SELECT json_build_object(
          'response', 'OK',
          'data',
          json_agg(
            json_build_object(
              'label', INITCAP(v),
              'value', v
            )
            ORDER BY v
          )
        )
        FROM (VALUES ('correcto'), ('proximo'), ('caducado'), ('devuelto')) AS t(v);
      `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
}
