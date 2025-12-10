import { IsString, IsNumber, IsEnum, IsDateString, Length, IsInt, Min, IsOptional, Equals } from 'class-validator';
import { Transform } from 'class-transformer';
import { EnumEstadoEntrega, IEntrega } from '@models';

export class CreateEntregaCabeceraDTO implements IEntrega {

  @IsInt()
  @Equals(-1)
  ideEntr: number;

  @IsInt()
  @Min(0)
  idePedi: number;

  @IsInt()
  @Min(0)
  ideProv: number;

  @IsDateString()
  fechaEntr: string;

  @IsInt()
  @Min(1)
  cantidadTotalEntr: number;

  @IsNumber()
  @Min(0)
  totalEntr: number;

  @IsEnum(EnumEstadoEntrega)
  estadoEntr:EnumEstadoEntrega;
  
  @IsString()
  @Length(1, 250)
  @Transform(({value}) => (
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
  ))
  observacionEntr: string;

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