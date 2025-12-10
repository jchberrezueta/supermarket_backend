import { CreateEntregaCabeceraDTO } from './create_entrega_cabecera.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateEntregaCabeceraDTO extends (CreateEntregaCabeceraDTO) {

    @IsInt()
    @Min(0)
    ideEntr: number;

    toArray(): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideEntr);
        return lista;
    };
}