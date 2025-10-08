import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDate, MinLength, IsInt, Min, IsPositive, MinDate, IsIn, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

enum EstadoEntrega {
    ACTIVO = 'activo',
    INACTIVO = 'inactivo'
}

export class CreateEntregaDto {

    @IsInt()
    @Min(1)
    idPedido:number;

    @IsInt()
    @Min(1)
    idProveedor:number;

    @IsDate()
    @Type(() => Date)
    @MinDate(new Date())
    fechaEntrega:Date;

    @IsInt()
    @Min(1)
    cantidadTotal:number;

    @IsNumber()
    montoTotal:number;

    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.trim())
    @Transform(({value}) => value.toLowerCase())
    @IsEnum(EstadoEntrega)
    estadoEntrega:string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    observacion?:string;
}