import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDetalleDTO } from './create_pedido_detalle.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdatePedidoDetalleDTO extends PartialType(CreatePedidoDetalleDTO) {
    @IsNumber()
    @Min(0)
    ideDetaPedi: number;

    toArray = (): any[] => {
      return [
        this.ideDetaPedi,
        this.idePedi,
        this.ideProd,
        this.cantidadProd,
        this.precioUnitarioProd,
        this.subtotalProd,
        this.dctoCompraProd,
        this.ivaProd,
        this.totalProd,
        this.dctoCaducProd
      ]
    }
}