import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDTO } from './create_empleado.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateEmpleadoDTO extends (CreateEmpleadoDTO) {

    @IsInt()
    @Min(0)
    ideEmpl: number;

    toArray (): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideEmpl);
        return lista;
    };
    
}