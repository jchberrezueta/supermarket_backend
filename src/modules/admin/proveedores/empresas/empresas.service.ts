import { Injectable } from '@nestjs/common';
import {DatabaseService} from '@database';

@Injectable()
export class EmpresasService {
  
  constructor(private readonly db: DatabaseService){}


  async getEmpresas(){
    //return await this.db.ejecutarProcedimiento('listar_empresas(:v_cursor, :p_response)');
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