import { Controller, Get, Post, Patch, Delete, Body, UseGuards, UnauthorizedException, Req, Ip } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AuthService } from './auth.service';
import { AccesosUsuariosService } from '../admin/seguridad/accesos/accesos.service';

interface ICredential {
    usuario: string;
    clave: string;
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private servicio:AccesosUsuariosService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Get('admin/data')
    getAdminData() {
        return 'Este dato solo es para admins';
    }


    @Post('login')
    async login(@Body() body: ICredential,  @Req() req: Request, @Ip() ip) {
        const user = await this.authService.validateUser(body.usuario, body.clave);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        // Registrar acceso
        await this.servicio.insertarAccesoUsuario({
            ide_cuen: user.ide_cuen,
            fecha_acce: new Date().toLocaleString(),  //?
            num_intentos_acce: 1,   //?
            ip_acce: ip || '999.999.999.999', //?
            navegador_acce: req.headers['user-agent'] || '',
            latitud_acce: null,  //?
            longitud_acce: null,  //?
        });
        return this.authService.login(user);
    }


}
