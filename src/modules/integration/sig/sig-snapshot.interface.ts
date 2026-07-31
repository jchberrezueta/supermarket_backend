export const SIG_SNAPSHOT_CONTRACT_VERSION = '1.0';
export const SIG_SNAPSHOT_SOURCE = 'supermarket-erp';

export interface SigCategorySnapshot {
  idOrigen: number;
  nombre: string;
  descripcion?: string;
}

export interface SigCompanySnapshot {
  idOrigen: number;
  nombre: string;
  responsable?: string;
  telefono?: string;
  correo?: string;
  estado: string;
}

export interface SigSupplierSnapshot {
  idOrigen: number;
  idEmpresaOrigen: number;
  identificacion?: string;
  nombre: string;
  telefono?: string;
  correo?: string;
  estado: string;
}

export interface SigProductSnapshot {
  idOrigen: number;
  idCategoriaOrigen: number;
  codigoBarra?: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  precioVenta: number;
  estado: string;
}

export interface SigCustomerSnapshot {
  idOrigen: number;
  identificacion?: string;
  nombre: string;
  correo?: string;
  telefono?: string;
}

export interface SigSaleSnapshot {
  idOrigen: number;
  idClienteOrigen?: number;
  numeroFactura: string;
  fechaVenta: string;
  canal: 'pos' | 'movil';
  estado: string;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
}

export interface SigSaleDetailSnapshot {
  idOrigen: number;
  idVentaOrigen: number;
  idProductoOrigen: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
}

export interface SigOrderSnapshot {
  idOrigen: number;
  idEmpresaOrigen: number;
  motivo: string;
  estado: string;
  fechaPedido: string;
  fechaEsperada?: string;
  cantidadSolicitada: number;
  cantidadRecibida: number;
  total: number;
}

export interface SigDeliverySnapshot {
  idOrigen: number;
  idPedidoOrigen: number;
  idProveedorOrigen: number;
  fechaEntrega?: string;
  estado: string;
  cantidadRecibida: number;
}

export interface SigLotSnapshot {
  idOrigen: number;
  idProductoOrigen: number;
  fechaCaducidad: string;
  stock: number;
  estado: string;
}

export interface SigInventoryMovementSnapshot {
  idOrigen: number;
  idProductoOrigen: number;
  idLoteOrigen?: number;
  tipo: string;
  cantidad: number;

  stockProductoAnterior?: number;
  stockProductoPosterior?: number;
  stockLoteAnterior?: number;
  stockLotePosterior?: number;

  documentoOrigen?: string;
  usuarioOrigen?: string;
  fechaMovimiento: string;
}

export interface SigSnapshotV1 {
  versionContrato: string;
  fuente: string;
  fechaGeneracion: string;

  categorias: SigCategorySnapshot[];
  empresas: SigCompanySnapshot[];
  proveedores: SigSupplierSnapshot[];
  productos: SigProductSnapshot[];
  clientes: SigCustomerSnapshot[];

  ventas: SigSaleSnapshot[];
  detallesVenta: SigSaleDetailSnapshot[];

  pedidos: SigOrderSnapshot[];
  entregas: SigDeliverySnapshot[];

  lotes: SigLotSnapshot[];
  movimientos: SigInventoryMovementSnapshot[];
}
