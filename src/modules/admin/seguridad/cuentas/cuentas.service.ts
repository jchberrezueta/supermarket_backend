import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';
import { FiltroCuentaDto } from './dto/filter_cuenta.dto';
import { CreateCuentaDto } from './dto/create_cuenta.dto';
import { UpdateCuentaDto } from './dto/update_cuenta.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CuentasService {
  private fnName: string = 'cuenta';
  constructor(private readonly db: DatabaseService) {}

  async listar() {
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
  }

  async buscar(id: number) {
    return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
  }

  async filtrar(queryParams: FiltroCuentaDto) {
    return this.db.executeFunctionRead(
      `fn_filtrar_${this.fnName}`,
      queryParams.toArray(),
    );
  }

  async eliminar(id: number) {
    return this.db.executeFunctionWrite(`fn_eliminar_${this.fnName}`, [id]);
  }

  async insertar(body: CreateCuentaDto) {
    /*Encriptacion de passwords :)*/
    const hashedPassword = await this.encriptadorHash(body.passwordCuen);
    body.passwordCuen = hashedPassword;
    return this.db.executeFunctionWrite(
      `fn_insertar_${this.fnName}`,
      body.toArray(),
    );
  }

  async actualizar(body: UpdateCuentaDto) {
    // Solo encriptar si se proporciona nueva contraseña
    if (body.passwordCuen && body.passwordCuen.trim() !== '') {
      const hashedPassword = await this.encriptadorHash(body.passwordCuen);
      body.passwordCuen = hashedPassword;
    }
    return this.db.executeFunctionWrite(
      `fn_actualizar_${this.fnName}`,
      body.toArray(),
    );
  }

  async encriptadorHash(value: string) {
    const saltRounds = 10;
    return await bcrypt.hash(value, saltRounds);
  }

  async buscarUsuario(usuario: string) {
    const result = await this.db.executeQuery(
      `SELECT * FROM CUENTA WHERE usuario_cuen LIKE '${usuario}'`,
    );
    return result[0];
  }

  async getPerfilPermisos(idCuenta: string) {
    const query = `
    SELECT 
      a.ide_cuen,
      a.ide_empl,
      a.usuario_cuen,
      a.estado_cuen,
      b.nombre_perf,
      d.nombre_opci,
      d.activo_opci,
      c.listar,
      c.insertar,
      c.modificar,
      c.eliminar,
      d.ruta_opci,
      d.nivel_opci,
      d.padre_opci
    FROM cuenta a
    LEFT JOIN perfil b ON b.ide_perf = a.ide_perf
    LEFT JOIN perfil_opciones c ON c.ide_perf = b.ide_perf
    LEFT JOIN opciones d ON d.ide_opci = c.ide_opci
    WHERE a.ide_cuen = $1
  `;

    const result = await this.db.executeQuery(query, [idCuenta]);

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

  /**
   * JOINS
   */
  async listarCuentas() {
    return this.db.executeFunctionRead(`fn_listar_${this.fnName}_perfil`);
  }
  async filtrarCuentas(queryParams: FiltroCuentaDto) {
    return this.db.executeFunctionRead(
      `fn_filtrar_${this.fnName}_perfil`,
      queryParams.toArray(),
    );
  }

  /**
   * COMBOS
   */
  async listarComboCuentas() {
    const query = `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', usuario_cuen,
            'value', ide_cuen
          )
          ORDER BY usuario_cuen
        )
      )
      FROM cuenta;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboUsuarios() {
    const query = `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object(
            'label', usuario_cuen,
            'value', usuario_cuen
          )
          ORDER BY usuario_cuen
        )
      )
      FROM cuenta;
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }

  async listarComboEstados() {
    const query = `
      SELECT json_build_object(
        'response', 'OK',
        'data',
        json_agg(
          json_build_object('label', estado, 'value', estado)
        )
      )
      FROM (
        VALUES
          ('activo'),
          ('inactivo'),
          ('bloqueado')
      ) AS estados(estado);
    `;
    const result = await this.db.executeQuery(query);
    return result[0].json_build_object.data;
  }
}
