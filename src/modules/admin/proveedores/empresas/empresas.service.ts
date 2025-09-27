import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import * as oracledb from 'oracledb';

@Injectable()
export class EmpresasService {
  
  constructor(private readonly db: DatabaseService){}


  async getEmpresas(){
    const binds = {
      p_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
      p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
    };
    //return await this.db.ejecutarProcedimiento('listar_empresas', binds);
  }

  async findEmpresa(){
    
  }

  async insertEmpresa(){

  }

  async updateEmpresa(){

  }

  async deleteEmpresa(){

  }
  
}