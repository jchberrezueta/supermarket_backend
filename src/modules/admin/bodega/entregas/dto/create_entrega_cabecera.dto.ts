import { IsString, IsNumber, IsEnum, IsDateString, Length, IsInt, Min } from 'class-validator';
import { EnumEstadoEntrega } from '../enums/estado_entrega.enum';

export class CreateEntregaCabeceraDTO {

    @IsInt()
    @Min(0)
    idPedi:number;

    @IsInt()
    @Min(0)
    idProv:number;

    @IsDateString()
    fechaEntr:Date;

    @IsInt()
    @Min(1)
    cantidadTotalEntr:number;

    @IsNumber()
    totalEntr:number;

    @IsEnum(EnumEstadoEntrega)
    estadoEntr:EnumEstadoEntrega;

    
    @IsString()
    @Length(1, 250)
    observacionEntr:string;

    toArray(): any[] {
      return [
        this.idPedi,
        this.idProv,
        this.fechaEntr,
        this.cantidadTotalEntr,
        this.totalEntr,
        this.estadoEntr,
        this.observacionEntr
      ]
    }
}