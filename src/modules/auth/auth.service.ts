import { Injectable } from '@nestjs/common';
import { CuentasService } from '../admin/seguridad/cuentas/cuentas.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private usersService: CuentasService, private jwtService: JwtService) {}

  async validateUser(usuario: string, clave: string): Promise<any> {
    const user = await this.usersService.buscarUsuario(usuario);
    if (user && await bcrypt.compare(clave, user['PASSWORD_CUEN'])) {
      const { password_cuen, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const info = await this.usersService.getPerfilPermisos(user['IDE_CUEN']);
    const permisosUsuario = info.map(p => ({
      ruta: p['RUTA_OPCI'],
      listar: p['LISTAR'] === 'SI',
      insertar: p['INSERTAR'] === 'SI',
      modificar: p['MODIFICAR'] === 'SI',
      eliminar: p['ELIMINAR'] === 'SI',
      activo: p['ACTIVO_OPCI'] === 'SI',
    }));
    const payload = {
      sub: info[0]['IDE_CUEN'],
      username: info[0]['USUARIO_CUEN'],
      state: info[0]['ESTADO_CUEN'],
      perfil: info[0]['NOMBRE_PERF'],
      permisos: permisosUsuario,
    };    
    return {
      access_token: this.jwtService.sign(payload),
        user: {
        id: payload.sub,
        username: payload.username,
        state: payload.state,
        perfil: payload.perfil,
        permisos: payload.permisos,
      }
    };
  }
}
