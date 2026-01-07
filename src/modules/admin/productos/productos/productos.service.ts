import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import { CreateProductoDTO } from './dto/create_producto.dto';
import { UpdateProductoDTO } from './dto/update_producto.dto';
import { FilterProductoDTO } from './dto/filter_producto.dto';

@Injectable()
export class ProductosService {
  
  private fnName: string = 'producto';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterProductoDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body:CreateProductoDTO){
    return this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body:UpdateProductoDTO){
    return this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async eliminar(id:number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }


  async listarComboProductos() {
    const query = 
      `
        SELECT json_agg(
          json_build_object(
              'label', nombre_prod,
              'value', ide_prod
          )
          ORDER BY nombre_prod
        ) AS productos
        FROM producto;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].productos;
  }
  
}