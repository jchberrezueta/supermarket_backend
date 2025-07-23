import { IsString, IsOptional, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCuentaDto } from './create_cuenta.dto';

export class UpdateCuentaDto extends PartialType(CreateCuentaDto) {
  @IsString()
  @IsOptional()
  usua_actua?: string;

  @IsDateString()
  @IsOptional()
  fecha_actua?: string;
}
