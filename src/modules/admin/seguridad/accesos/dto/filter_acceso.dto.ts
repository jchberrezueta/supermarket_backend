import { isIntNumeric } from '@helpers/utilities';
import { IFiltroAccesoUsuario } from '@models';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, IsString, Min, Max, IsEnum, IsNumber, Length, IsDateString } from 'class-validator';


export class FiltroAccesoDto implements IFiltroAccesoUsuario{

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
  @IsInt()
  @Min(0)
  ideCuen?: number;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  ipAcce?: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  navegadorAcce?: string;

  @IsDateString()
  fechaAcceDesde?: string;

  @IsDateString()
  fechaAcceHasta?: string;

  toArray(): any[] {
    return [
      this.ideCuen?? null,
      this.ipAcce?? null,
      this.navegadorAcce?? null,
      this.fechaAcceDesde?? null,
      this.fechaAcceHasta?? null
    ]
  }

}