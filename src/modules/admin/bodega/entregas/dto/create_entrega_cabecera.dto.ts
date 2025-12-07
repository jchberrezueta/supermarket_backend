import { IsString, IsNumber, IsEnum, IsDateString, Length, IsInt, Min, IsOptional } from 'class-validator';
import { EnumEstadoEntrega } from '../enums/estado_entrega.enum';
import { Transform } from 'class-transformer';

export class CreateEntregaCabeceraDTO {

    @IsInt()
    @Min(0)
    idePedi:number;

    @IsInt()
    @Min(0)
    ideProv:number;

    @IsDateString()
    fechaEntr:Date;

    @IsInt()
    @Min(1)
    cantidadTotalEntr:number;

    @IsNumber()
    @Min(0)
    totalEntr:number;

    @IsEnum(EnumEstadoEntrega)
    estadoEntr:EnumEstadoEntrega;
    
    @Transform(({value}) => (
      (typeof value !== 'string') || (typeof value === 'string' && value.trim() === '') || (value == null)) ? 'ninguna' : value.trim()
    )
    @IsString()
    @Length(1, 250)
    observacionEntr:string;

    toArray(): any[] {
      return [
        this.idePedi,
        this.ideProv,
        this.fechaEntr,
        this.cantidadTotalEntr,
        this.totalEntr,
        this.estadoEntr,
        this.observacionEntr
      ]
    }
}