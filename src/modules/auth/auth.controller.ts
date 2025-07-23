import { Controller, Get, Post, Patch, Delete, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Get('admin/data')
    getAdminData() {
        return 'Este dato solo es para admins';
    }


    @Post('login')
    async login(@Body() body: { usuario: string; clave: string }) {
        const user = await this.authService.validateUser(body.usuario, body.clave);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');
        return this.authService.login(user);
    }


}
