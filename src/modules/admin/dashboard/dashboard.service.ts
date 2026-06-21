import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getEstadisticas() {
    return this.dashboardRepository.getEstadisticas();
  }

  async getVentasMensuales() {
    return this.dashboardRepository.getVentasMensuales();
  }

  async getProductosTop() {
    return this.dashboardRepository.getProductosTop();
  }

  async getVentasPorCategoria() {
    return this.dashboardRepository.getVentasPorCategoria();
  }

  async getUltimasVentas() {
    return this.dashboardRepository.getUltimasVentas();
  }

  async getPedidosRecientes() {
    return this.dashboardRepository.getPedidosRecientes();
  }
}
