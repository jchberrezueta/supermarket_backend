import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoCabeceraDTO } from './create_pedido_cabecera.dto';
import { IsInt, Min } from 'class-validator';

export class UpdatePedidoCabeceraDTO extends (CreatePedidoCabeceraDTO) {

    @IsInt()
    @Min(0)
    idePedi: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.idePedi);
        return lista;
    };

}