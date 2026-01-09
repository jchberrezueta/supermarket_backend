import { IsInt, Min } from 'class-validator';
import { CreateLoteDTO } from './create_lote.dto';

export class UpdateLoteDTO extends (CreateLoteDTO) {

    @IsInt()
    @Min(0)
    ideLote: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideLote);
        return lista;
    };

}
