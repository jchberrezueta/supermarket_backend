import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { FilterAccesoUsuarioDto, FilterAccesoUsuarioDtoToArray } from './dto/filter_acceso.dto';
import { CreateAccesoUsuarioToArray, CreateAccesoUsuarioDto } from './dto/create_acceso.dto';

@Injectable()
export class AccesosUsuariosService {

  private fnName: string = 'acceso_usuario'
  constructor(private readonly db: DatabaseService){}

  async listar(){
    this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id: number) {
    this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id])
  }

  async filtrar(queryParams: FilterAccesoUsuarioDto) {
    this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, FilterAccesoUsuarioDtoToArray(queryParams));
  }

  async insertarAccesoUsuario(data: CreateAccesoUsuarioDto) {
    this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, CreateAccesoUsuarioToArray(data));
  }

}