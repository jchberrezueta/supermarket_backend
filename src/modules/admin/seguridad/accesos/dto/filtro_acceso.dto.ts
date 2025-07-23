import { IsOptional, IsInt, IsString, Min, Max, IsEnum, IsNumber } from 'class-validator';


export class FiltroAccesoDto {
  @IsOptional()
  @IsNumber()
  ide_cuen?: string;

  @IsOptional()
  @IsString()
  ip_acce?: string;

  @IsOptional()
  @IsString()
  navegador_acce?: string;

}