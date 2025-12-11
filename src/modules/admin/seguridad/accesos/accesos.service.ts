import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { FiltroAccesoDto } from './dto/filter_acceso.dto';
import { CreateAccesoUsuarioDto } from './dto/create_acceso.dto';

@Injectable()
export class AccesosUsuariosService {

  private fnName: string = 'acceso_usuario'
  constructor(private readonly db: DatabaseService){}

  /**
  * Listar
  */
  async listar(){
      this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }


  async filtrar(queryParams: FiltroAccesoDto) {
      this.db.executeFunctionRead(`fn_listar_${this.fnName}`, queryParams.toArray())
  }

  async insertarAccesoUsuario(data: CreateAccesoUsuarioDto) {
    this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, data.toArray());
  }

  
}