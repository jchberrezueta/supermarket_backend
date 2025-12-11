import { DatabaseService } from '@database';
import { Injectable } from '@nestjs/common';
import { FilterVentaDTO } from './dto/filter_venta.dto';
import { CreateVentaDTO } from './dto/create_venta.dto';
import { UpdateVentaDTO } from './dto/update_venta.dto';

@Injectable()
export class VentasService {
  private fnName: string = 'venta';
  private fnName2: string = 'detalle_venta';

  constructor(private readonly db: DatabaseService){}

  async listar(){
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id:number){
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FilterVentaDTO){
    return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async insertar(body: CreateVentaDTO){
    const result = await this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.cabeceraVenta.toArray());
    body.detalleVenta.forEach( obj => {
      const data = obj.toArray(); data.unshift(result.p_id);
      this.db.executeFunctionWrite(`fn_insertar_${this.fnName2}`, data);
    });
    return result;
  }

  async actualizar(body: UpdateVentaDTO){
    const result = await this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.cabecerVenta.toArray());
    body.detalleVenta.forEach( obj => {
      this.db.executeFunctionWrite(`fn_actualizar_${this.fnName2}`, obj.toArray());
    });
    return result;
  }

  async eliminar(id: number){
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }
}