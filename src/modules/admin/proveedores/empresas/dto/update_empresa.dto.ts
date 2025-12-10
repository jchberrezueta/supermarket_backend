import { CreateEmpresaDTO } from './create_empresa.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateEmpresaDTO extends CreateEmpresaDTO {

    @IsInt()
    @Min(0)
    ideEmp: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideEmp);
        return lista;
    };

}