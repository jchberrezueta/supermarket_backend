import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/modules/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('padmin', 'pbodega', 'pventas', 'pnomina')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly servicio: DashboardService) {}

    @Get('estadisticas')
    async getEstadisticas() {
        return this.servicio.getEstadisticas();
    }

    @Get('ventas-mensuales')
    async getVentasMensuales() {
        return this.servicio.getVentasMensuales();
    }

    @Get('productos-top')
    async getProductosTop() {
        return this.servicio.getProductosTop();
    }

    @Get('ventas-por-categoria')
    async getVentasPorCategoria() {
        return this.servicio.getVentasPorCategoria();
    }

    @Get('ultimas-ventas')
    async getUltimasVentas() {
        return this.servicio.getUltimasVentas();
    }

    @Get('pedidos-recientes')
    async getPedidosRecientes() {
        return this.servicio.getPedidosRecientes();
    }
}
