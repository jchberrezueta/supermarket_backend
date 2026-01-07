import { IsInt, Min } from 'class-validator';
import { CreateEmpresaPrecioDTO } from './create_precio.dto';

export class UpdateEmpresaPrecioDTO extends CreateEmpresaPrecioDTO {

    @IsInt()
    @Min(0)
    ideEmprProd: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideEmprProd);
        return lista;
    };

}