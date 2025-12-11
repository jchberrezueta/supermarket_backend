import { CreateCategoriaDTO } from './create_categoria.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateCategoriaDTO extends (CreateCategoriaDTO) {
    @IsInt()
    @Min(0)
    ideCate: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideCate);
        return lista;
    };
}