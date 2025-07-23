import { Controller, Get, Post, Patch, Delete, Body, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AuthService } from './auth.service';
import { AccesosUsuariosService } from '../admin/seguridad/accesos/accesos.service';

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
    async login(@Body() body: { usuario: string; clave: string },  @Req() req: Request,) {
        const user = await this.authService.validateUser(body.usuario, body.clave);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');
        
        // Registrar acceso
        await this.servicio.insertarAccesoUsuario({
            ide_cuen: user['IDE_CUEN'],
            fecha_acce: new Date(),
            num_intentos_acce: 1,
            ip_acce: req.headers['x-forwarded-for'] || '127.0.0.1',
            navegador_acce: req.headers['user-agent'] || '',
            latitud_acce: null,
            longitud_acce: null,
        });
        return this.authService.login(user);
    }


}
