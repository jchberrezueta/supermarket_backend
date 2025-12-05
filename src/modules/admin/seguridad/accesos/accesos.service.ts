import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import * as oracledb from 'oracledb';
import { FiltroAccesoDto } from './dto/filter_acceso.dto';
import * as bcrypt from 'bcrypt';
import { CreateAccesoDto } from './dto/create_acceso.dto';

@Injectable()
export class AccesosUsuariosService {
  
    constructor(private readonly db: DatabaseService){}

    /**
    * Listar
    */
    async listarAccesos(){
        const binds = {
          p_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        };

        /*const outBinds = await this.db.ejecutarProcedimiento('listar_accesos_usuario', binds);
        return outBinds;*/
    }


    async filtrarAccesos(filtros: FiltroAccesoDto) {
        const binds = {
            p_ide_cuen: filtros.ide_cuen || null,
            p_ip_acce: filtros.ip_acce || null,
            p_navegador_acce: filtros.navegador_acce || null,

            p_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_response: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        };

        /*const outBinds = await this.db.ejecutarProcedimiento('filtrar_accesos', binds);
        return outBinds;*/
    }



   async insertarAccesoUsuario(data: CreateAccesoDto) {
    const datosAcceso = {
      p_ide_cuen: data.ide_cuen,         
      p_fecha_acce: data.fecha_acce,          
      p_num_intentos_acce: data.num_intentos_acce,  
      p_ip_acce: data.ip_acce,
      p_navegador_acce: data.navegador_acce,    
      p_latitud_acce: data.latitud_acce,
      p_longitud_acce: data.longitud_acce, 
    };
    console.log(datosAcceso);
    //this.db.executeFunctionWrite('insertar_acceso', [datos]);
  }

  
}