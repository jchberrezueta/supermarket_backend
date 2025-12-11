import { IsString, IsNumber, IsEnum, IsDateString, Length, IsInt, Min, IsOptional, Equals } from 'class-validator';
import { Transform } from 'class-transformer';
import { EnumEstadoEntrega, EnumEstadoVenta, IEntrega, IVenta } from '@models';

export class CreateVentaCabeceraDTO implements IVenta {

  @IsInt()
  @Equals(-1)
  ideVent: number;

  @IsInt()
  @Min(0)
  ideEmpl: number;

  @IsInt()
  @Min(0)
  ideClie: number;

  @IsString()
  @Length(1, 25)
  @Transform(({value}) => (
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  ))
  numFacturaVent: string;

  @IsDateString()
  fechaVent: string;

  @IsInt()
  @Min(1)
  cantidadVent: number;

  @IsNumber()
  @Min(0)
  subTotalVent: number;

  @IsNumber()
  @Min(0)
  totalVent: number;

  @IsNumber()
  @Min(0)
  dctoVent: number;

  @IsEnum(EnumEstadoVenta)
  estadoVent:EnumEstadoVenta;

  toArray(): any[] {
    return [
      this.ideEmpl,
      this.ideClie,
      this.numFacturaVent,
      this.fechaVent,
      this.cantidadVent,
      this.subTotalVent,
      this.dctoVent,
      this.totalVent,
      this.estadoVent
    ]
  }
}