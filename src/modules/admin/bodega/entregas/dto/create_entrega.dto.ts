import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateEntregaDto {

    @IsNumber()
    idPedido:number;

    @IsNumber()
    idProveedor:number;

    @IsDate()
    fechaEntrega:Date;

    @IsNumber()
    cantidadTotal:number;

    @IsNumber()
    montoTotal:number;

    @IsString()
    estadoEntrega:string;

    @IsOptional()
    @IsString()
    observacion:string;
}