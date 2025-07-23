import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool;

  constructor(private configService: ConfigService){}

  async onModuleInit() {
    this.pool = await oracledb.createPool({
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      connectString: this.configService.get<string>('DB_CONNECT_STRING'),
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


  async ejecutarSQL(query: string, binds = {}, options: oracledb.ExecuteOptions = {}) {
    const connection = await this.pool.getConnection();
    try {
      return await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT, ...options });
    } finally {
      await connection.close();
    }
  }


   

  async ejecutarProcedimiento(procedureName: string, binds: any, options: oracledb.ExecuteOptions = {}) {
    const connection = await this.pool.getConnection();
    try {
      const claves = Object.keys(binds);
      const parameters = claves.map(clave => `:${clave}`).join(', ');
      const result = await connection.execute(`BEGIN ${procedureName} (${parameters}); END;`, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true,...options });

      // Si devuelve cursor, procesarlo
      if (result.outBinds && Object.values(result.outBinds).some(bind => bind instanceof oracledb.ResultSet)) {
        for (const key in result.outBinds) {
          const val = result.outBinds[key];
          if (val instanceof oracledb.ResultSet) {
            const rows = await val.getRows();
            await val.close();
            result.outBinds[key] = rows;
          }
        }
      }

      // Procesar CLOB (p_response) si existe
      if (result.outBinds && result.outBinds.p_response) {
        result.outBinds.p_response = await this.readClob(result.outBinds.p_response);
      }

      return result.outBinds;
    } finally {
      await connection.close();
    }
  }

  
  private readClob(clob: oracledb.Lob): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = '';
      clob.setEncoding('utf8');
      clob.on('data', chunk => (data += chunk));
      clob.on('end', () => resolve(data));
      clob.on('error', err => reject(err));
    });
  }

}