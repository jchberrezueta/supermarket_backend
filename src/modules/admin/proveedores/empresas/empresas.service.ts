import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';
import * as oracledb from 'oracledb';

@Injectable()
export class EmpresasService {
  
  constructor(private readonly db: DatabaseService){}


  async getEmpresas(){
    return this.db.executeFunctionRead('listar_empresa');
  }

  async findEmpresa(){
    
  }

  async filterEmpresas(){

  }

  async insertEmpresa(){

  }

  async updateEmpresa(){

  }

  async deleteEmpresa(){

  }
  
}