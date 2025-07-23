import { IsOptional, IsInt, IsString, Min, Max, IsEnum, IsNumber, IsDate } from 'class-validator';


export class CreateAccesoDto {
  @IsOptional()
  @IsNumber()
  ide_cuen?: string;

  @IsOptional()
  @IsDate()
  fecha_acce?: Date;

  @IsOptional()
  @IsNumber()
  num_intentos_acce?: number;

  @IsOptional()
  @IsString()
  ip_acce?: string;

  @IsOptional()
  @IsString()
  navegador_acce?: string;

  @IsOptional()
  @IsString()
  latitud_acce?: string;

  @IsOptional()
  @IsString()
  longitud_acce?: string;

}