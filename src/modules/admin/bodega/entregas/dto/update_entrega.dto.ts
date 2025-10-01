import { CreateEntregaDto } from "./create_entrega.dto";
import { IsNumber } from 'class-validator';

export class UpdateEntregaDTO extends CreateEntregaDto{

    @IsNumber()
    ideEntrega: number;
}