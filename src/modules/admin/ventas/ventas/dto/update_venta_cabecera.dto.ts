import { IsInt, Min } from 'class-validator';
import { CreateVentaCabeceraDTO } from './create_venta_cabecera.dto';

export class UpdateVentaCabeceraDTO extends (CreateVentaCabeceraDTO) {

    @IsInt()
    @Min(0)
    ideVent: number;

    toArray(): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideVent);
        return lista;
    };
}