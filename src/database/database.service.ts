// oracle.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as oracledb from 'oracledb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool;

  async onModuleInit() {
    this.pool = await oracledb.createPool({
      user: 'admin_super',
      password: 'Admin123',
      connectString: '192.168.1.108:1521/SUPERMARKET_PDB',
      poolMin: 1,
      poolMax: 5,
      poolIncrement: 1,
    });
    console.log('✅ Conexión Oracle lista');
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.close(0);
      console.log('🛑 Conexión Oracle cerrada');
    }
  }

  async ejecutarSQL(query: string, binds: any = {}, options: oracledb.ExecuteOptions = {}) {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute(query, binds, options);
      return result;
    } finally {
      await connection.close();
    }
  }

  async ejecutarProcedimiento(nombreProc: string, options?: oracledb.ExecuteOptions) {
    const connection = await this.pool.getConnection();
    try {
       const binds = {
        v_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
      };
      const result = await connection.execute(`BEGIN ${nombreProc}; END;`, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      const resultSet = result.outBinds.v_cursor;
      const rows = await resultSet.getRows();
     await resultSet.close();
      return rows;
    } finally {
      await connection.close();
    }
  }
}
