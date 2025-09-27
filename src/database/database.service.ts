import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {

  constructor(@InjectDataSource() private readonly datasource: DataSource){}

  async executeQuery(query: string){
    return this.datasource.query(query);
  }

  executeFunction(name: string, params:any[]=[]){
    const placeholders = params.map((_,i) => (`$${i+1}`)).join(', ');
    console.log(placeholders);
    const result = this.datasource.query(`CALL ${name}(${placeholders})`, params);
    console.log(result);
    return result;
  }
}