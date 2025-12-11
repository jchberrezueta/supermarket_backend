import { Controller, Post, Body, UnauthorizedException, Req, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccesosUsuariosService } from '../admin/seguridad/accesos/accesos.service';
import { CreateAccesoUsuarioDto } from '../admin/seguridad/accesos/dto/create_acceso.dto';
import { formatDate } from '@helpers/utilities';

interface ICredential {
    usuario: string;
    clave: string;
    numIntentos: number;
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private servicio:AccesosUsuariosService) {}

    @Post('login')
    async login(@Body() body: ICredential,  @Req() req: Request, @Ip() ip) {
        const user = await this.authService.validateUser(body.usuario, body.clave);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        if (ip.startsWith('::ffff:')) {
            ip = ip.split('::ffff:')[1]; // ahora tienes IPv4
        }
        const accesoUsuario: CreateAccesoUsuarioDto = {
            ideAcce: -1,
            ideCuen: user.ide_cuen,
            navegadorAcce: req.headers['user-agent'] || '',
            fechaAcce: formatDate(new Date()),
            numIntFallAcce: body.numIntentos ?? 0,
            ipAcce: ip || '999.999.999.999',
            latitudAcce: null,
            longitudAcce: null  
        };
        // Registrar acceso usuario
        await this.servicio.insertarAccesoUsuario(accesoUsuario);
        return this.authService.login(user);
    }


}
