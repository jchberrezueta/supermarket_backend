import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import * as oracledb from 'oracledb';
import { CreateEmpresaDTO } from './dto/create_empresa.dto';

@Injectable()
export class EmpresasService {
  
  constructor(private readonly db: DatabaseService){}


  async listarEmpresas(){
    return this.db.executeFunctionRead('fn_listar_empresa');
  }

  async buscarEmpresa(id:number){
    return this.db.executeFunctionRead('fn_buscar_empresa');
  }

  async filtrarEmpresa(){

  }

  async insertarEmpresa(empresa:CreateEmpresaDTO){
    console.log(Object.values(empresa));
    return this.db.executeFunctionWrite('fn_insertar_empresa');
  }

  async actualizarEmpresa(){

  }

  async eliminarEmpresa(){

  }
  
}