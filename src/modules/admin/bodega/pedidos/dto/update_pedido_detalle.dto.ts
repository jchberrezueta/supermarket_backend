import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDetalleDTO } from './create_pedido_detalle.dto';
import { IsInt, Min } from 'class-validator';

export class UpdatePedidoDetalleDTO extends (CreatePedidoDetalleDTO) {
    @IsInt()
    @Min(0)
    ideDetaPedi: number;

    @IsInt()
    @Min(0)
    idePedi: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.idePedi);
        lista.unshift(this.ideDetaPedi);
        return lista;
    };
}