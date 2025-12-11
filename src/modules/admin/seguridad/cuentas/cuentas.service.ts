import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import * as oracledb from 'oracledb';
import { FiltroCuentaDto } from './dto/filter_cuenta.dto';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CuentasService {
  
  private fnName: string = 'cuenta';
  constructor(private readonly db: DatabaseService){}

  async listar(){
    this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id: number) {
    this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FiltroCuentaDto) {
    this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, queryParams.toArray());
  }

  async eliminar(id: number) {
    this.db.executeFunctionRead(`fn_eliminar_${this.fnName}`, [id]);
  }

  async insertar(body: CreateCuentaDto) {
    /*Encriptacion de passwords :)*/
    const hashedPassword = await this.encriptadorHash(body.passwordCuen);
    body.passwordCuen = hashedPassword;
    this.db.executeFunctionWrite(`fn_insertar_${this.fnName}`, body.toArray());
  }

  async actualizar(body: UpdateCuentaDto) {
    /*const hashedPassword = await this.encriptadorHash(body.passwordCuen);
    body.passwordCuen = hashedPassword;*/
    this.db.executeFunctionWrite(`fn_actualizar_${this.fnName}`, body.toArray());
  }

  async encriptadorHash(value: string) {
     const saltRounds = 10;
     return await bcrypt.hash(value, saltRounds);
  }

  async buscarUsuario(usuario: string) {
    const result = await this.db.executeQuery(`SELECT * FROM CUENTA WHERE usuario_cuen LIKE '${usuario}'`);
    return result[0];
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
        d.RUTA_OPCI,
        d.NOMBRE_OPCI,
        d.NIVEL_OPCI,
        d.PADRE_OPCI
      FROM CUENTA a
      LEFT JOIN PERFIL b ON (b.IDE_PERF = a.IDE_PERF)
      LEFT JOIN PERFIL_OPCIONES c ON(c.IDE_PERF = b.IDE_PERF)
      LEFT JOIN OPCIONES d ON(d.IDE_OPCI = c.IDE_OPCI)
      WHERE a.IDE_CUEN = ${idCuenta}
    `;
    const result = await this.db.executeQuery(query);
    return result;
  }


  async getSidebarRutas(idCuenta: string) {
    const query = `
      SELECT 
        jsonb_agg(obtener_rutas_json(d.ide_opci, b.ide_perf)) AS menu
      FROM CUENTA a
      LEFT JOIN PERFIL b ON (b.IDE_PERF = a.IDE_PERF)
      LEFT JOIN PERFIL_OPCIONES c ON(c.IDE_PERF = b.IDE_PERF)
      LEFT JOIN OPCIONES d ON(d.IDE_OPCI = c.IDE_OPCI)
      WHERE a.IDE_CUEN = ${idCuenta}
        AND a.ESTADO_CUEN = 'activo'
        AND d.PADRE_OPCI IS NULL
        AND d.ACTIVO_OPCI = 'si'
    `;
    const result = await this.db.executeQuery(query);
    return result[0].menu;
  }

}