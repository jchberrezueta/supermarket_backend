import { IsOptional, IsString, Length, IsEnum, IsNumber, Min, IsDateString, IsInt, isInt, IsNumberString } from 'class-validator';
import { EnumEstadoEntrega } from '../enums/estado_entrega.enum';
import { Type } from 'class-transformer';

export class FilterEntregaDTO {
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    idePedi?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    ideProv?: number;

    @IsOptional()
    @IsEnum(EnumEstadoEntrega)
    estadoEntr?: EnumEstadoEntrega;

    @IsOptional()
    @IsDateString()
    fechaPedi?: string;

    @IsOptional()
    @IsDateString()
    fechaEntrPedi?: string;

    toArray(): any[] {
        return [
            this.idePedi ?? null,
            this.ideProv ?? null,
            this.estadoEntr ?? null,
            this.fechaPedi ?? null,
            this.fechaEntrPedi ?? null
        ];
    }
}
