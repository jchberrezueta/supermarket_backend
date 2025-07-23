import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateCuentaDto {

  @IsNumber()
  @IsNotEmpty()
  ide_empl: number;

  @IsNumber()
  @IsNotEmpty()
  ide_perf: number;

  @IsString()
  @IsNotEmpty()
  usuario_cuen: string;

  @IsString()
  @IsNotEmpty()
  password_cuen: string;

  @IsString()
  @IsNotEmpty()
  estado_cuen: string;

  @IsString()
  @IsOptional()
  usua_ingre?: string;

  @IsDateString()
  @IsOptional()
  fecha_ingre?: string;
}
