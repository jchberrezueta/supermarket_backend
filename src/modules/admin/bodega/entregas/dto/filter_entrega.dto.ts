import { IsOptional, IsString, Length, IsEnum, IsNumber, Min, IsDateString, IsInt } from 'class-validator';
import { EnumEstadoEntrega } from '../enums/estado_entrega.enum';


export class FilterEntregaDTO {
    @IsOptional()
    @IsInt()
    @Min(0)
    idePedi: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    ideProv: number;

    @IsOptional()
    @IsEnum(EnumEstadoEntrega)
    estadoEntr: EnumEstadoEntrega;

    @IsOptional()
    @IsDateString()
    fechaPedi: Date;

    @IsOptional()
    @IsDateString()
    fechaEntrPedi: Date;

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
