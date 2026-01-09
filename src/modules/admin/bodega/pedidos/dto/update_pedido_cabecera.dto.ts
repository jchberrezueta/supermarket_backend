import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoCabeceraDTO } from './create_pedido_cabecera.dto';
import { IsInt, Min } from 'class-validator';

export class UpdatePedidoCabeceraDTO extends (CreatePedidoCabeceraDTO) {

    @IsInt()
    @Min(0)
    idePedi: number;

    toArray (): any[]  {
        const lista = super.toArray();
        // Remover el último null (p_usua_ingre) y agregar al inicio el ID
        lista.pop();
        lista.unshift(this.idePedi);
        lista.push(null); // p_usua_actua
        return lista;
    };

}