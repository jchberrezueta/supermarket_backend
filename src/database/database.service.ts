import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {

  constructor(@InjectDataSource() private readonly datasource: DataSource){}

  async executeQuery(query: string){
    return this.datasource.query(query);
  }

  async executeFunctionWrite(functionName:string, params:any[] = []) {
    const indexs = params.map((_,i) => `$${i+1}`).join(', ');
    const result = await this.datasource.query(
      `SELECT * FROM ${functionName}(${indexs})`,
      params,
    );
    return result[0]; 
  }

  async executeFunctionRead(functionName:string, params:any[]=[]) {
    const indexs = params.map((_,i) => `$${i+1}`).join(', ');
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query('BEGIN');
      const result = await queryRunner.query(`SELECT * FROM ${functionName}(${indexs})`, params);
      const cursorName = result[0].p_result;
      const response = result[0].p_response;

      const rows = await queryRunner.query(`FETCH ALL FROM "${cursorName}"`);
      await queryRunner.query('COMMIT');

      return { 
        data: rows, 
        response 
      };
    } catch (error) {
      await queryRunner.query('ROLLBACK');
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}