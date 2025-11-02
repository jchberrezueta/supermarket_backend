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
    const rutasSidebar = await this.cuentasService.getSidebarRutas(user.ide_cuen);
    //console.log(info);
    const permisosUsuario = info.map(p => ({
      ruta: p.ruta_opci,
      listar: p.listar === 'si',
      insertar: p.insertar === 'si',
      modificar: p.modificar === 'si',
      eliminar: p.eliminar === 'si',
      activo: p.activo_opci === 'si',
      nombre: p.nombre_opci,
      nivel: p.nivel_opci,
      padre: p.padre_opci
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
        rutas_sidebar: rutasSidebar
      },
    };
  }
}
