import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import * as oracledb from 'oracledb';
import { FiltroCuentaDto } from './dto/filtro_cuenta.dto';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CuentasService {
  
    constructor(private readonly db: DatabaseService){}

    /**
    * Listar
    */
    async listarCuentas(){
        const binds = {
          p_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        };

        const outBinds = await this.db.ejecutarProcedimiento('listar_cuentas', binds);
        return outBinds;
    }

    /**
    * Buscar x ID
    */
    async buscarCuentaPorId(id: number) {
        const binds = {
            p_id: id,
            p_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        };

        const outBinds = await this.db.ejecutarProcedimiento('buscar_cuenta', binds);
        return outBinds;
    }

    async filtrarCuentas(filtros: FiltroCuentaDto) {
        const binds = {
            p_ususario_cuen: filtros.usuario_cuen || null,
            p_estado_cuen: filtros.estado_cuen || null,
            p_ide_empl: filtros.ide_empl || null,
            p_ide_perf: filtros.ide_perf || null,

            p_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        };

        const outBinds = await this.db.ejecutarProcedimiento('filtrar_cuentas', binds);
        return outBinds;
    }

    async eliminarCuenta(id: number) {
        const binds = {
            p_id: id,
            p_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        };

        const outBinds = await this.db.ejecutarProcedimiento('eliminar_cuenta', binds);
        return outBinds;
    }



   async insertarCuenta(data: CreateCuentaDto) {
    const binds = {
      p_ide_empl: data.ide_empl,         
      p_ide_perf: data.ide_perf,          
      p_usuario_cuen: data.usuario_cuen,  
      p_password_cuen: data.password_cuen,
      p_estado_cuen: data.estado_cuen,    
      p_usua_ingre: data.usua_ingre || 'uinsert', 

      p_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
    };
    //Encriptacion de passwords :)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(binds.p_password_cuen, saltRounds);
    const cuentaConHash = {
      ...binds,
      p_password_cuen: hashedPassword,
    };
    const outBinds = await this.db.ejecutarProcedimiento('insertar_cuenta', cuentaConHash);
    return outBinds;
  }

  async actualizarCuenta(id: number, data: UpdateCuentaDto) {
    const binds = {
      p_id: id,
      p_ide_empl: data.ide_empl,         
      p_ide_perf: data.ide_perf,          
      p_usuario_cuen: data.usuario_cuen,  
      p_password_cuen: data.password_cuen, //encriptar
      p_estado_cuen: data.estado_cuen,    
      p_usua_actua: data.usua_actua || 'uactua', 

      p_result: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
    };

    //Encriptacion de passwords :)
    /*const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(binds.p_password_cuen, saltRounds);
    const cuentaConHash = {
      ...binds,
      p_password_cuen: hashedPassword,
    };*/

    const outBinds = await this.db.ejecutarProcedimiento('actualizar_cuenta', binds);
    return outBinds;
  }


  async buscarUsuario(usuario: string){
    const query = `SELECT * FROM CUENTA WHERE usuario_cuen LIKE '${usuario}'`;
    const result = await this.db.ejecutarSQL(query);
    return result.rows[0];
  }

  async getPerfilPermisos(idCuenta: string){
    const query = `
      SELECT 
        a.IDE_CUEN,
        a.USUARIO_CUEN,
        a.ESTADO_CUEN,
        b.NOMBRE_PERF,
        d.NOMBRE_OPCI,
        d.ACTIVO_OPCI,
        c.LISTAR,
        c.INSERTAR,
        c.MODIFICAR,
        c.ELIMINAR,
        d.RUTA_OPCI
      FROM CUENTA a
      JOIN PERFIL b ON (b.IDE_PERF = a.IDE_PERF)
      JOIN PERFIL_OPCIONES c ON(c.IDE_PERF = b.IDE_PERF)
      JOIN OPCIONES d ON(d.IDE_OPCI = c.IDE_OPCI)
      WHERE a.IDE_CUEN = ${idCuenta}
    `;
    const result = await this.db.ejecutarSQL(query);
    return result.rows;
  }

  
}