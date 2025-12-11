import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";
import { CreateClienteDTO } from "./create_cliente.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateClienteDTO extends (CreateClienteDTO) {

    @IsInt()
    @Min(0)
    ideClie: number;

    toArray(): any[]  {
        const lista = super.toArray();
        lista.unshift(this.ideClie);
        return lista;
    };
}
