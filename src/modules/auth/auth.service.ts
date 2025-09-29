import { Injectable } from '@nestjs/common';
import { CuentasService } from '../admin/seguridad/cuentas/cuentas.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private cuentasService: CuentasService, private jwtService: JwtService) {}

  async validateUser(usuario: string, clave: string) {
    const user = await this.cuentasService.buscarUsuario(usuario);
    let result = null;
    if (user) {
      const res = await bcrypt.compare(clave, user.password_cuen);
      if(res){
        const { password_cuen, ...dataUser } = user;
        result = dataUser;
      }
    }
    return result;
  }

  async login(user: any) {
    const info = await this.cuentasService.getPerfilPermisos(user.ide_cuen);
    const permisosUsuario = info.map(p => ({
      ruta: p.ruta_opci,
      listar: p.listar === 'SI',
      insertar: p.insertar === 'SI',
      modificar: p.modificar === 'SI',
      eliminar: p.eliminar === 'SI',
      activo: p.activo_opci === 'SI',
    }));
    const payload = {
      sub: info[0].ide_cuen,
      username: info[0].usuario_cuen,
      state: info[0].estado_cuen,
      perfil: info[0].nombre_perf,
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
