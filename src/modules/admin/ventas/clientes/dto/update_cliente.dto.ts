import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateClienteDTO } from "./create_cliente.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateClienteDTO extends PartialType(CreateClienteDTO) {

    @IsNumber()
    @IsNotEmpty()
    idCliente: number;
}