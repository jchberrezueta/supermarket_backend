import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregaDetalleDTO } from './create_entrega_detalle.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateEntregaDetalleDTO extends PartialType(CreateEntregaDetalleDTO) {
    @IsInt()
    @Min(0)
    ideDetaEntr: number;

    toArray = (): any[] => {
      return [
        this.ideDetaEntr,
        this.ideEntr,
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