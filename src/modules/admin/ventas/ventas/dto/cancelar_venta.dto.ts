import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CancelarVentaDTO {
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @Length(5, 250)
  motivo!: string;
}
