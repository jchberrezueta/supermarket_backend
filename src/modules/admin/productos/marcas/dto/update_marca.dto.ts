import { IsInt, Min } from 'class-validator';
import { CreateMarcaDTO } from './create_marca.dto';

export class UpdateMarcaDTO extends (CreateMarcaDTO) {

    @IsInt()
    @Min(0)
    ideMarc: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideMarc);
        return lista;
    };

}